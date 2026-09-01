import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { subjectFromExamTitle } from "@/lib/analytics";

export const dynamic = "force-dynamic";

async function requireUser(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    if (!decoded) {
      return { error: NextResponse.json({ error: "Auth is not configured on the server" }, { status: 503 }) };
    }
    return { uid: decoded.uid as string };
  } catch {
    return { error: NextResponse.json({ error: "Your session expired. Please sign in again." }, { status: 401 }) };
  }
}

// Bookmarks are read back through the API rather than Firestore because the
// question text lives in a staff-only collection.
export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth.error) return auth.error;

  try {
    const snap = await adminDb.collection("bookmarks").where("user_id", "==", auth.uid).get();

    const examTitles = new Map<string, string>();
    const exams = await adminDb.collection("exams").get();
    exams.docs.forEach((doc: any) => examTitles.set(doc.id, doc.data().title ?? ""));

    const items = await Promise.all(
      snap.docs.map(async (doc: any) => {
        const data = doc.data();
        const qSnap = await adminDb.collection("questions").doc(data.question_id).get();
        const question = qSnap.exists ? qSnap.data() : null;

        return {
          id: doc.id,
          questionId: data.question_id,
          createdAt: data.created_at,
          // Answer key deliberately omitted — this is a revision list, not a key.
          questionText: question?.question_text ?? "(question no longer available)",
          topicName:
            question?.topic || subjectFromExamTitle(examTitles.get(question?.exam_id ?? "") ?? ""),
        };
      })
    );

    items.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return NextResponse.json({ bookmarks: items }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Bookmark list failed:", err);
    return NextResponse.json({ error: "Could not load bookmarks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json().catch(() => ({}));
    const questionId = String(body?.questionId ?? "");
    if (!questionId) {
      return NextResponse.json({ error: "questionId is required" }, { status: 400 });
    }

    const qSnap = await adminDb.collection("questions").doc(questionId).get();
    if (!qSnap.exists) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Deterministic id keeps bookmarking idempotent — tapping twice does not
    // create a duplicate.
    const id = `${auth.uid}_${questionId}`;
    await adminDb.collection("bookmarks").doc(id).set({
      user_id: auth.uid,
      question_id: questionId,
      exam_id: qSnap.data()?.exam_id ?? null,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ bookmarked: true, id });
  } catch (err) {
    console.error("Bookmark create failed:", err);
    return NextResponse.json({ error: "Could not save bookmark" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth.error) return auth.error;

  try {
    const questionId = request.nextUrl.searchParams.get("questionId");
    if (!questionId) {
      return NextResponse.json({ error: "questionId is required" }, { status: 400 });
    }

    await adminDb.collection("bookmarks").doc(`${auth.uid}_${questionId}`).delete();
    return NextResponse.json({ bookmarked: false });
  } catch (err) {
    console.error("Bookmark delete failed:", err);
    return NextResponse.json({ error: "Could not remove bookmark" }, { status: 500 });
  }
}
