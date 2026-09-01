import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { createExamSession } from "@/lib/exam-session";

export const dynamic = "force-dynamic";

// Serves exam questions to students with the answer key removed.
//
// Questions used to be read straight from Firestore by the client, which meant
// `correct_option` and `model_answer` were readable before the exam was even
// started. Grading has always been server-side (see ../submit/route.ts), so the
// client never actually needed those fields — this route strips them, and the
// Firestore rules now deny direct reads of the `questions` collection.
const ANSWER_KEY_FIELDS = ["correct_option", "model_answer", "explanation", "rubric"];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: examId } = await params;

    if (!adminDb) {
      return NextResponse.json(
        { error: "Server not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY." },
        { status: 503 }
      );
    }

    const examSnap = await adminDb.collection("exams").doc(examId).get();
    if (!examSnap.exists) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    const questionsSnap = await adminDb
      .collection("questions")
      .where("exam_id", "==", examId)
      .get();

    const questions = questionsSnap.docs
      .map((doc: any) => {
        const data = { ...doc.data() };
        for (const field of ANSWER_KEY_FIELDS) delete data[field];
        return { id: doc.id, ...data };
      })
      .sort((a: any, b: any) => (a.order_in_exam || 0) - (b.order_in_exam || 0));

    const exam = examSnap.data() || {};

    return NextResponse.json(
      { exam: { id: examSnap.id, ...exam }, questions },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Failed to load exam questions:", error);
    return NextResponse.json({ error: "Failed to load questions" }, { status: 500 });
  }
}

/**
 * Start a sat attempt. Creates a server-side session that records the real
 * start time and a per-student shuffle of questions and options, then returns
 * the questions in that order.
 *
 * The GET above stays for previewing an exam; only POST starts the clock.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: examId } = await params;

    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Please sign in to start this exam." }, { status: 401 });
    }

    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: "Your session expired. Please sign in again." }, { status: 401 });
    }
    if (!decoded) {
      return NextResponse.json({ error: "Auth is not configured on the server" }, { status: 503 });
    }

    const body = await request.json().catch(() => ({}));
    const honorAccepted = body?.honorAccepted === true;

    const created = await createExamSession(decoded.uid, examId, honorAccepted);
    if (!created) {
      return NextResponse.json({ error: "Exam not found or has no questions" }, { status: 404 });
    }

    const examSnap = await adminDb.collection("exams").doc(examId).get();

    return NextResponse.json(
      {
        sessionId: created.session.id,
        exam: { id: examSnap.id, ...examSnap.data() },
        questions: created.questions,
        startedAt: created.session.started_at,
        expiresAt: created.session.expires_at,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Failed to start exam session:", error);
    return NextResponse.json({ error: "Could not start the exam" }, { status: 500 });
  }
}
