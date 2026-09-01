// Written-answer grading.
//
// Grading used to run inline inside the submit request, one Gemini call after
// another, so a 10-question written paper left the student staring at a spinner
// for 30+ seconds. It now runs after the response is sent (see the submit
// route's `after()` call) and writes results back into the attempt, which the
// results page watches in real time.
//
// The output is structured rather than a prose blob: `concepts` is what the
// weak-area detector and adaptive engine consume downstream.

import { callGemini } from "@/lib/gemini";
import { adminDb } from "@/lib/firebase-admin";

export type GradingStatus = "pending" | "complete" | "unavailable";

export interface WrittenFeedback {
  marks: number;
  /** What the student actually got right — specific, not "good effort". */
  strengths: string[];
  /** What was missing or wrong. */
  gaps: string[];
  /** One concrete action for next time. */
  next_step: string;
  /** Syllabus concepts this answer touched, for weak-area detection. */
  concepts: string[];
}

const GRADING_SYSTEM_PROMPT = `You are grading a university exam answer. You will be given the question, the full marks available, a model answer, an optional marking rubric, and the student's actual written answer.

Grade strictly but fairly against the model answer's key concepts and the rubric if one is given. The student does not need to match the model answer word-for-word, but must demonstrate the same core understanding.

Respond with ONLY a JSON object, no other text, in this exact shape:
{
  "marks_awarded": <number, 0 to full marks, decimals allowed>,
  "strengths": ["<specific thing the student got right, quoting or referring to their own words>"],
  "gaps": ["<specific thing missing, wrong, or imprecise>"],
  "next_step": "<one concrete, actionable thing to do before the next attempt>",
  "concepts": ["<syllabus concept this question tests, 1-4 short noun phrases>"]
}

Rules:
- "strengths" and "gaps" must cite the student's actual answer, never generic praise or criticism.
- If the answer is blank or has no relevant content, award 0, leave "strengths" empty, and explain what a correct answer would need in "gaps".
- "concepts" describes the QUESTION's topic, so fill it in even when the answer is blank.
- Keep every string under 200 characters.`;

function clampList(value: unknown, max: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .slice(0, max)
    .map((v) => v.trim().slice(0, 200));
}

export interface GradeInput {
  question_text: string;
  model_answer: string;
  rubric?: string;
  student_answer: string;
  full_marks: number;
  attachmentCount?: number;
}

export async function gradeWrittenAnswer(
  apiKey: string,
  input: GradeInput
): Promise<WrittenFeedback> {
  const { question_text, model_answer, rubric, student_answer, full_marks, attachmentCount = 0 } = input;

  if (!student_answer.trim() && attachmentCount === 0) {
    return {
      marks: 0,
      strengths: [],
      gaps: ["No answer was submitted for this question."],
      next_step: "Attempt this question next time, even partially — a blank answer scores nothing.",
      concepts: [],
    };
  }

  const attachmentNote =
    attachmentCount > 0
      ? `\n\nNote: the student also attached ${attachmentCount} image(s) (diagram or handwritten work) that you cannot see. Grade the text answer on its own merits and say in "gaps" that the attached image(s) still need the teacher's manual review.`
      : "";

  const rubricNote = rubric?.trim() ? `\n\nMarking rubric:\n${rubric.trim()}` : "";

  const text = await callGemini(
    apiKey,
    GRADING_SYSTEM_PROMPT,
    [
      {
        role: "user",
        parts: [
          {
            text: `Question: ${question_text}\n\nFull marks: ${full_marks}\n\nModel answer: ${model_answer}${rubricNote}\n\nStudent's answer: ${student_answer}${attachmentNote}`,
          },
        ],
      },
    ],
    600
  );

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON object in grading response");

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    marks: Math.max(0, Math.min(full_marks, Number(parsed.marks_awarded) || 0)),
    strengths: clampList(parsed.strengths, 4),
    gaps: clampList(parsed.gaps, 4),
    next_step: typeof parsed.next_step === "string" ? parsed.next_step.trim().slice(0, 300) : "",
    concepts: clampList(parsed.concepts, 4),
  };
}

/** Run tasks with bounded concurrency — the Gemini free tier rate-limits bursts. */
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index], index);
    }
  });

  await Promise.all(workers);
  return results;
}

/**
 * Grade every pending written answer on an attempt, then update the score,
 * percentage and leaderboard. Safe to call more than once: already-graded
 * items are skipped, so a retry after a partial failure only fills the gaps.
 */
export async function gradeAttempt(attemptId: string): Promise<void> {
  const apiKey = process.env.GEMINI_API_KEY;
  const attemptRef = adminDb.collection("exam_attempts").doc(attemptId);
  const snap = await attemptRef.get();
  if (!snap.exists) return;

  const attempt = snap.data();
  const breakdown = attempt?.answers_json?.breakdown;
  if (!Array.isArray(breakdown)) return;

  const pendingIndexes = breakdown
    .map((item: any, index: number) => ({ item, index }))
    .filter(({ item }: any) => item.type === "written" && item.grading_status === "pending")
    .map(({ index }: any) => index);

  if (pendingIndexes.length === 0) return;

  if (!apiKey) {
    // No key configured: mark the answers for manual review rather than
    // leaving them stuck on "pending" forever.
    pendingIndexes.forEach((index: number) => {
      breakdown[index].grading_status = "unavailable";
      breakdown[index].gaps = ["Automatic grading is unavailable — a teacher will review this answer."];
    });
    await attemptRef.update({
      "answers_json.breakdown": breakdown,
      grading_status: "unavailable",
      graded_at: new Date().toISOString(),
    });
    return;
  }

  await mapWithConcurrency(pendingIndexes, 3, async (index: number) => {
    const item = breakdown[index];
    try {
      const feedback = await gradeWrittenAnswer(apiKey, {
        question_text: item.question_text ?? "",
        model_answer: item.modelAnswer ?? "",
        rubric: item.rubric ?? undefined,
        student_answer: item.writtenAnswer ?? "",
        full_marks: item.fullMarks ?? 0,
        attachmentCount: Array.isArray(item.attachmentUrls) ? item.attachmentUrls.length : 0,
      });

      item.marksAwarded = feedback.marks;
      item.isCorrect = feedback.marks >= (item.fullMarks ?? 0) * 0.5;
      item.strengths = feedback.strengths;
      item.gaps = feedback.gaps;
      item.nextStep = feedback.next_step;
      item.concepts = feedback.concepts;
      item.grading_status = "complete";
    } catch (err) {
      console.error(`Grading failed for question ${item.questionId}:`, err);
      item.grading_status = "unavailable";
      item.gaps = ["Automatic grading failed for this answer — a teacher will review it."];
    }
  });

  // Recompute the totals now that written marks exist.
  const score = Math.max(
    0,
    breakdown.reduce((sum: number, item: any) => sum + (Number(item.marksAwarded) || 0), 0)
  );
  const maxScore = Number(attempt?.total_marks) || 0;
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 10000) / 100 : 0;

  const anyUnavailable = breakdown.some((item: any) => item.grading_status === "unavailable");

  await attemptRef.update({
    "answers_json.breakdown": breakdown,
    score,
    percentage,
    concepts: Array.from(
      new Set(breakdown.flatMap((item: any) => (Array.isArray(item.concepts) ? item.concepts : [])))
    ),
    grading_status: anyUnavailable ? "unavailable" : "complete",
    graded_at: new Date().toISOString(),
  });

  await updateLeaderboard({
    userId: attempt.user_id,
    examId: attempt.exam_id,
    displayName: attempt.displayName ?? attempt.user_name ?? "Student",
    score,
    percentage,
    countAttempt: false,
  });
}

export interface LeaderboardUpdate {
  userId: string;
  examId: string;
  displayName: string;
  score: number;
  percentage: number;
  /** False when correcting an existing entry after async grading. */
  countAttempt: boolean;
}

export async function updateLeaderboard(update: LeaderboardUpdate): Promise<void> {
  const { userId, examId, displayName, score, percentage, countAttempt } = update;

  await adminDb.runTransaction(async (transaction: any) => {
    const existing = await transaction.get(
      adminDb
        .collection("leaderboard")
        .where("user_id", "==", userId)
        .where("exam_id", "==", examId)
        .limit(1)
    );

    const now = new Date().toISOString();

    if (existing.empty) {
      transaction.set(adminDb.collection("leaderboard").doc(), {
        user_id: userId,
        user_name: displayName,
        displayName,
        exam_id: examId,
        score,
        percentage,
        attempts: 1,
        last_attempt: now,
        updated_at: now,
      });
      return;
    }

    const docSnap = existing.docs[0];
    const data = docSnap.data();
    const isBest = (data.percentage || 0) < percentage;

    transaction.update(docSnap.ref, {
      user_name: displayName,
      displayName,
      attempts: (data.attempts || 0) + (countAttempt ? 1 : 0),
      last_attempt: now,
      updated_at: now,
      ...(isBest ? { score, percentage } : {}),
    });
  });
}
