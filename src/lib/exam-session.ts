// Server-authoritative exam sessions.
//
// Before this, the take page read questions and then told the server how long
// it had spent — so timing was whatever the client claimed, and every student
// saw the same questions in the same order. A session now records the real
// start time server-side and stores a per-attempt shuffle, so:
//
//   * elapsed time is measured by the server, not reported by the browser
//   * question order and option order differ per student, per attempt
//   * the answer key never leaves the server (see the P0 rules lockdown)
//
// This is the "integrity by design" approach: it removes the cheating vectors
// that actually exist, without webcam surveillance of students.

import { randomUUID, randomInt } from "crypto";
import { adminDb } from "@/lib/firebase-admin";

export const OPTION_KEYS = ["a", "b", "c", "d"] as const;
export type OptionKey = (typeof OPTION_KEYS)[number];

export interface ExamSession {
  id: string;
  user_id: string;
  exam_id: string;
  started_at: string;
  expires_at: string;
  /** Question ids in the order this student sees them. */
  question_order: string[];
  /**
   * Per question, the original option key shown at each display position.
   * ["c","a","d","b"] means the student's option A is really option C.
   */
  option_maps: Record<string, OptionKey[]>;
  honor_accepted: boolean;
  submitted: boolean;
}

/** Fisher-Yates using crypto randomness. */
function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Translate a student's chosen display position back to the real option key.
 * Returns null when the session has no map for that question (e.g. a written
 * question, or a legacy session).
 */
export function resolveOption(
  session: Pick<ExamSession, "option_maps">,
  questionId: string,
  displayChoice: string | null
): string | null {
  if (!displayChoice) return null;

  const map = session.option_maps?.[questionId];
  if (!map) return displayChoice;

  const index = OPTION_KEYS.indexOf(displayChoice as OptionKey);
  if (index === -1 || index >= map.length) return null;
  return map[index];
}

export interface CreatedSession {
  session: ExamSession;
  /** Questions in display order, options already reordered, answer key removed. */
  questions: Record<string, unknown>[];
}

export async function createExamSession(
  userId: string,
  examId: string,
  honorAccepted: boolean
): Promise<CreatedSession | null> {
  const examSnap = await adminDb.collection("exams").doc(examId).get();
  if (!examSnap.exists) return null;
  const exam = examSnap.data() || {};

  const questionsSnap = await adminDb.collection("questions").where("exam_id", "==", examId).get();
  if (questionsSnap.empty) return null;

  const questions = questionsSnap.docs
    .map((doc: any) => ({ id: doc.id, ...doc.data() }))
    .sort((a: any, b: any) => (a.order_in_exam || 0) - (b.order_in_exam || 0));

  const ordered = shuffle(questions);
  const optionMaps: Record<string, OptionKey[]> = {};

  const presented = ordered.map((q: any) => {
    const base: Record<string, unknown> = {
      id: q.id,
      type: q.type ?? "mcq",
      question_text: q.question_text ?? "",
      marks: q.marks ?? 1,
    };

    if (q.type === "written") return base;

    // Only shuffle positions that actually hold an option, so a 3-option
    // question doesn't gain a blank D.
    const filled = OPTION_KEYS.filter((key) => String(q[`option_${key}`] ?? "").trim().length > 0);
    const map = shuffle(filled);
    optionMaps[q.id] = map;

    map.forEach((originalKey, index) => {
      base[`option_${OPTION_KEYS[index]}`] = q[`option_${originalKey}`] ?? "";
    });
    // Blank out any positions this question doesn't use.
    for (let i = map.length; i < OPTION_KEYS.length; i++) {
      base[`option_${OPTION_KEYS[i]}`] = "";
    }

    return base;
  });

  const startedAt = new Date();
  const durationMinutes = Number(exam.duration_minutes) || 60;
  // A small grace window absorbs network lag on the final submit.
  const expiresAt = new Date(startedAt.getTime() + (durationMinutes * 60 + 60) * 1000);

  const session: ExamSession = {
    id: randomUUID(),
    user_id: userId,
    exam_id: examId,
    started_at: startedAt.toISOString(),
    expires_at: expiresAt.toISOString(),
    question_order: ordered.map((q: any) => q.id),
    option_maps: optionMaps,
    honor_accepted: honorAccepted,
    submitted: false,
  };

  await adminDb.collection("exam_sessions").doc(session.id).set(session);

  return { session, questions: presented };
}

export async function getExamSession(sessionId: string): Promise<ExamSession | null> {
  const snap = await adminDb.collection("exam_sessions").doc(sessionId).get();
  return snap.exists ? (snap.data() as ExamSession) : null;
}

export async function markSessionSubmitted(sessionId: string): Promise<void> {
  await adminDb.collection("exam_sessions").doc(sessionId).update({
    submitted: true,
    submitted_at: new Date().toISOString(),
  });
}

export interface IntegritySignals {
  /** Times the exam tab lost focus. Recorded, never used to auto-accuse. */
  blurCount: number;
  longestBlurSeconds: number;
  honorAccepted: boolean;
  /** True when the client's reported time disagrees with the server's. */
  clientTimeMismatch: boolean;
  serverElapsedSeconds: number;
  clientReportedSeconds: number;
  /** True when the answers arrived after the session window closed. */
  lateSubmission: boolean;
}

/**
 * Compare what the browser reported against what the server observed.
 *
 * These are signals for a human to look at, not a verdict — a blurred tab is
 * far more often a notification than cheating, so nothing here blocks or
 * penalises a submission on its own.
 */
export function buildIntegritySignals(
  session: ExamSession,
  clientReportedSeconds: number,
  blurCount: number,
  longestBlurSeconds: number
): IntegritySignals {
  const serverElapsedSeconds = Math.max(
    0,
    Math.round((Date.now() - new Date(session.started_at).getTime()) / 1000)
  );

  // 60s of tolerance for clock skew and the final request in flight.
  const drift = Math.abs(serverElapsedSeconds - clientReportedSeconds);

  return {
    blurCount: Math.max(0, Math.floor(blurCount)),
    longestBlurSeconds: Math.max(0, Math.floor(longestBlurSeconds)),
    honorAccepted: session.honor_accepted,
    clientTimeMismatch: drift > 60,
    serverElapsedSeconds,
    clientReportedSeconds: Math.max(0, Math.floor(clientReportedSeconds)),
    lateSubmission: Date.now() > new Date(session.expires_at).getTime(),
  };
}
