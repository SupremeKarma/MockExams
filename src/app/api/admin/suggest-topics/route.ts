import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { suggestTopicsForBatch, TAGGING_BATCH_SIZE, type QuestionForTagging } from "@/lib/topic-tagging";
import { subjectFromExamTitle } from "@/lib/analytics";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function requireStaff(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(token);
  } catch {
    return { error: NextResponse.json({ error: "Your session expired." }, { status: 401 }) };
  }
  if (!decoded) {
    return { error: NextResponse.json({ error: "Auth is not configured on the server" }, { status: 503 }) };
  }

  const snap = await adminDb.collection("users").doc(decoded.uid).get();
  const role = snap.exists ? (snap.data()?.role ?? "student") : "student";
  if (!["admin", "examiner", "org_admin"].includes(role)) {
    return { error: NextResponse.json({ error: "Staff only." }, { status: 403 }) };
  }
  return { uid: decoded.uid };
}

/**
 * Suggest topic tags for an exam's untagged questions.
 *
 * Returns suggestions only — nothing is written. A wrong tag quietly distorts
 * weak-area analysis, so a human approves before it lands.
 */
export async function POST(request: NextRequest) {
  const auth = await requireStaff(request);
  if (auth.error) return auth.error;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Tagging is unavailable right now." }, { status: 503 });
    }

    const body = await request.json().catch(() => ({}));
    const examId = String(body?.examId ?? "");
    if (!examId) return NextResponse.json({ error: "examId is required" }, { status: 400 });

    const examSnap = await adminDb.collection("exams").doc(examId).get();
    if (!examSnap.exists) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

    const subject = subjectFromExamTitle(examSnap.data()?.title ?? "");

    const qSnap = await adminDb.collection("questions").where("exam_id", "==", examId).get();
    const untagged: QuestionForTagging[] = qSnap.docs
      .map((doc: any) => ({ id: doc.id, ...doc.data() }))
      .filter((q: any) => !q.topic && q.question_text)
      .map((q: any) => ({ id: q.id, question_text: q.question_text }));

    if (untagged.length === 0) {
      return NextResponse.json({ suggestions: [], message: "Every question here is already tagged." });
    }

    const suggestions = [];
    for (let i = 0; i < untagged.length; i += TAGGING_BATCH_SIZE) {
      const batch = untagged.slice(i, i + TAGGING_BATCH_SIZE);
      suggestions.push(...(await suggestTopicsForBatch(apiKey, subject, batch)));
    }

    return NextResponse.json({ subject, total: untagged.length, suggestions });
  } catch (err) {
    console.error("Topic suggestion failed:", err);
    return NextResponse.json({ error: "Could not suggest topics" }, { status: 500 });
  }
}
