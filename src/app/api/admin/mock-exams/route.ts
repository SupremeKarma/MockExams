import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireStaff } from "@/lib/examai/admin-auth";
import { sortQuestions, type Paper, type Question } from "@/lib/examai/types";

export const dynamic = "force-dynamic";

/**
 * Assembles a mock exam from real, published, reviewer-approved questions.
 *
 * Deliberately not AI-generated: every question here already went through
 * the paper pipeline's review gate (canPublish() in types.ts requires every
 * question approved before a paper can reach `published`), so this is
 * sampling real exam history, not drafting new content. There is no per-user
 * state — the same request against the same published corpus always
 * produces an assembly from the same candidate pool, so the tool behaves
 * identically for every admin who uses it.
 */

interface AssembleRequest {
  courseId: string;
  targetMarks: number;
  targetQuestions: number;
}

interface AssembledQuestion {
  qId: string;
  paperId: string;
  year: number;
  examType: string;
  number: string;
  marks: number;
  textExact: string | null;
  type: Question["type"];
}

function fisherYatesShuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Greedy pick toward the target marks/count, never overshooting the question
 * count and only overshooting marks by whatever the last question added.
 * Not optimal — an exact subset-sum would be overkill for what is, at most,
 * a few dozen candidate questions — but it is honest: no fabricated marks,
 * no question invented to hit a round number.
 */
function assemble(
  candidates: AssembledQuestion[],
  targetMarks: number,
  targetQuestions: number
): AssembledQuestion[] {
  const shuffled = fisherYatesShuffle(candidates);
  const picked: AssembledQuestion[] = [];
  let marks = 0;

  for (const q of shuffled) {
    if (picked.length >= targetQuestions) break;
    if (marks >= targetMarks) break;
    picked.push(q);
    marks += q.marks;
  }

  return picked;
}

export async function POST(request: NextRequest) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  let body: Partial<AssembleRequest>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const courseId = String(body.courseId ?? "").trim().toUpperCase();
  const targetMarks = Number(body.targetMarks);
  const targetQuestions = Number(body.targetQuestions);

  if (!courseId) return NextResponse.json({ error: "Pick a course." }, { status: 400 });
  if (!Number.isInteger(targetMarks) || targetMarks < 1 || targetMarks > 500) {
    return NextResponse.json({ error: "Marks must be between 1 and 500." }, { status: 400 });
  }
  if (!Number.isInteger(targetQuestions) || targetQuestions < 1 || targetQuestions > 100) {
    return NextResponse.json({ error: "Question count must be between 1 and 100." }, { status: 400 });
  }

  try {
    const papersSnap = await adminDb
      .collection("papers")
      .where("courseId", "==", courseId)
      .where("status", "==", "published")
      .get();

    const papers = papersSnap.docs.map((d: { data: () => Paper }) => d.data());

    const candidates: AssembledQuestion[] = [];
    for (const paper of papers) {
      const questionsSnap = await adminDb
        .collection("papers")
        .doc(paper.paperId)
        .collection("questions")
        .get();

      const questions = sortQuestions<Question>(
        questionsSnap.docs.map((d: { data: () => Question }) => d.data())
      );

      for (const q of questions) {
        // Sub-parts stay nested in their parent, and a question with no
        // printed mark split cannot be budgeted honestly — skip rather than
        // guess a number that was never on the paper.
        if (q.marks === null) continue;
        candidates.push({
          qId: q.qId,
          paperId: paper.paperId,
          year: paper.year,
          examType: paper.examType,
          number: q.number,
          marks: q.marks,
          textExact: q.textExact,
          type: q.type,
        });
      }
    }

    const assembled = assemble(candidates, targetMarks, targetQuestions);
    const totalMarks = assembled.reduce((n, q) => n + q.marks, 0);

    return NextResponse.json({
      courseId,
      requested: { targetMarks, targetQuestions },
      candidatePoolSize: candidates.length,
      papersUsed: papers.length,
      questions: assembled,
      totalMarks,
    });
  } catch (err) {
    console.error("Mock exam assembly failed:", err);
    return NextResponse.json({ error: "Could not assemble a mock exam." }, { status: 500 });
  }
}
