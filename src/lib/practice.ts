// "Fix my weak spots" — builds an adaptive practice set from the weak areas
// analytics detected, using the (previously orphaned) AdaptiveEngine to pick
// each question at the right difficulty for the student's current mastery.
//
// This is the step that turns MockExams from a quiz bank into a tutor: the
// loop closes here, from answer -> feedback -> detected weakness -> targeted
// practice -> measured mastery.

import { adminDb } from "@/lib/firebase-admin";
import {
  AdaptiveEngine,
  type QuestionMetadata,
  type StudentPerformance,
} from "@/lib/adaptive-engine";
import { buildStudentAnalytics, subjectFromExamTitle } from "@/lib/analytics";

/** The engine works on a 1-5 scale; question docs store a word. */
const DIFFICULTY_VALUE: Record<string, number> = { easy: 1.5, medium: 3, hard: 4.5 };

export interface PracticeQuestion {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  marks: number;
  /** Null when the question carries no difficulty rating — not all do. */
  difficulty: string | null;
  topicName: string;
  /** Why the engine picked this one, shown to the student. */
  rationale: string;
}

export interface PracticeSet {
  questions: PracticeQuestion[];
  /** Topics the set is targeting, worst mastery first. */
  focusTopics: { topicId: string; topicName: string; masteryPercentage: number }[];
  /** Set when there is nothing useful to drill yet. */
  reason?: string;
}

interface CandidateQuestion extends QuestionMetadata {
  topicName: string;
  raw: any;
}

/**
 * Load every MCQ, tagged with a topic the same way analytics groups them:
 * explicit `topic` field when present, otherwise the exam's subject.
 *
 * Written questions are excluded — practice gives instant feedback, and
 * written answers need a grading round trip.
 */
async function loadCandidates(): Promise<CandidateQuestion[]> {
  const [questionsSnap, examsSnap] = await Promise.all([
    adminDb.collection("questions").get(),
    adminDb.collection("exams").get(),
  ]);

  const examTitles = new Map<string, string>();
  examsSnap.docs.forEach((doc: any) => examTitles.set(doc.id, doc.data().title ?? ""));

  return questionsSnap.docs
    .map((doc: any) => ({ id: doc.id, ...doc.data() }))
    .filter((q: any) => q.type !== "written" && q.correct_option)
    .map((q: any) => {
      const topicName = q.topic || subjectFromExamTitle(examTitles.get(q.exam_id) ?? "");
      return {
        id: q.id,
        topicId: slugify(topicName),
        topicName,
        difficulty: DIFFICULTY_VALUE[String(q.difficulty ?? "medium")] ?? 3,
        masteryRequired: 0,
        averageTimeSeconds: 60,
        correctRate: 0.5,
        // No prerequisite graph exists for this content yet, so nothing is
        // gated. The engine handles an empty list as "always qualifying".
        prerequisitesMetIds: [],
        raw: q,
      };
    });
}

/** The engine's own rationale is internal ("targeting difficulty 3.5"); this is
 *  the student-facing version. */
function describeSelection(topicName: string, mastery: number | undefined): string {
  if (mastery === undefined) return `Building a baseline for ${topicName}.`;
  if (mastery < 40) return `You're at ${Math.round(mastery)}% on ${topicName} — starting with the fundamentals.`;
  if (mastery < 70) return `Consolidating ${topicName} at ${Math.round(mastery)}%.`;
  return `Stretching you on ${topicName} at ${Math.round(mastery)}%.`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export interface BuildPracticeOptions {
  size?: number;
  /** Drill one specific topic instead of every weak area. */
  topicId?: string;
  /** Drill only the questions this student bookmarked. */
  bookmarkedOnly?: boolean;
}

export async function buildPracticeSet(
  userId: string,
  options: BuildPracticeOptions = {}
): Promise<PracticeSet> {
  const size = Math.min(Math.max(options.size ?? 10, 1), 25);

  const [analytics, allCandidates] = await Promise.all([
    buildStudentAnalytics(userId),
    loadCandidates(),
  ]);

  let candidates = allCandidates;

  // The revision set: only what the student flagged as hard, newest first.
  if (options.bookmarkedOnly) {
    const bookmarkSnap = await adminDb
      .collection("bookmarks")
      .where("user_id", "==", userId)
      .get();

    const ids = new Set(bookmarkSnap.docs.map((doc: any) => doc.data().question_id));
    candidates = allCandidates.filter((candidate) => ids.has(candidate.id));

    if (candidates.length === 0) {
      return { questions: [], focusTopics: [], reason: "no_bookmarks" };
    }
  }

  if (candidates.length === 0) {
    return { questions: [], focusTopics: [], reason: "no_questions" };
  }

  // Prefer detected weak areas. With no attempt history there is nothing to
  // target, so fall back to a mixed set rather than returning nothing.
  let focus = analytics.weakAreas.map((area) => ({
    topicId: area.topicId,
    topicName: area.topicName,
    masteryPercentage: area.masteryPercentage,
  }));

  if (options.topicId) {
    focus = focus.filter((topic) => topic.topicId === options.topicId);
    if (focus.length === 0) {
      const known = analytics.topics.find((topic) => topic.topicId === options.topicId);
      if (known) {
        focus = [
          {
            topicId: known.topicId,
            topicName: known.topicName,
            masteryPercentage: known.masteryPercentage,
          },
        ];
      }
    }
  }

  // A bookmarked set is the student's own choice, so weak-area focus does not
  // narrow it further.
  if (options.bookmarkedOnly) focus = [];

  const isFallback = focus.length === 0;

  const masteryPercentages: Record<string, number> = {};
  analytics.topics.forEach((topic) => {
    masteryPercentages[topic.topicId] = topic.masteryPercentage;
  });

  const performance: StudentPerformance = {
    studentId: userId,
    masteryPercentages,
    recentAttempts: [],
  };

  const engine = new AdaptiveEngine();
  const picked: PracticeQuestion[] = [];
  const used = new Set<string>();

  // Weakest topic first, and it gets the largest share of the set.
  const ordered = [...focus].sort((a, b) => a.masteryPercentage - b.masteryPercentage);

  const pickFrom = (topicId: string | null, limit: number) => {
    for (let i = 0; i < limit; i++) {
      const pool = candidates.filter(
        (candidate) => !used.has(candidate.id) && (topicId === null || candidate.topicId === topicId)
      );
      if (pool.length === 0) return;

      const selection = engine.selectNextQuestion(
        performance,
        pool,
        topicId ?? pool[0].topicId,
        600
      );

      const chosen = pool.find((candidate) => candidate.id === selection.questionId) ?? pool[0];
      used.add(chosen.id);

      picked.push({
        id: chosen.id,
        question_text: chosen.raw.question_text ?? "",
        option_a: chosen.raw.option_a ?? "",
        option_b: chosen.raw.option_b ?? "",
        option_c: chosen.raw.option_c ?? "",
        option_d: chosen.raw.option_d ?? "",
        marks: chosen.raw.marks ?? 1,
        // Don't invent a rating: much of the bank has no difficulty set, and
        // showing "medium" for those would be a fabricated label.
        difficulty: chosen.raw.difficulty ?? null,
        topicName: chosen.topicName,
        rationale: describeSelection(chosen.topicName, masteryPercentages[chosen.topicId]),
      });

      if (picked.length >= size) return;
    }
  };

  if (isFallback) {
    pickFrom(null, size);
  } else {
    // Weight: worst topic gets roughly half the set, the rest share what's left.
    const weights = ordered.map((_, index) => 1 / (index + 1));
    const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);

    ordered.forEach((topic, index) => {
      const share = Math.max(1, Math.round((weights[index] / weightTotal) * size));
      pickFrom(topic.topicId, share);
    });

    // Top up from anywhere if the weak topics didn't have enough questions.
    if (picked.length < size) pickFrom(null, size - picked.length);
  }

  return {
    questions: picked,
    focusTopics: ordered,
    reason: isFallback ? "no_weak_areas_yet" : undefined,
  };
}

export interface PracticeGradeResult {
  questionId: string;
  correct: boolean;
  correctOption: string;
  explanation: string | null;
  topicName: string;
  marksAwarded: number;
  fullMarks: number;
}

/**
 * Grade a finished practice set and record it. Practice sessions are stored
 * separately from exam attempts but in the same breakdown shape, so analytics
 * can fold them in without special-casing.
 */
export async function gradePracticeSession(
  userId: string,
  answers: Record<string, string>,
  timeSpentSeconds: number,
  isDaily = false
): Promise<{ sessionId: string; results: PracticeGradeResult[]; score: number; total: number }> {
  const questionIds = Object.keys(answers).slice(0, 25);
  if (questionIds.length === 0) {
    throw new Error("No answers submitted");
  }

  const [questionDocs, examsSnap] = await Promise.all([
    Promise.all(questionIds.map((id) => adminDb.collection("questions").doc(id).get())),
    adminDb.collection("exams").get(),
  ]);

  const examTitles = new Map<string, string>();
  examsSnap.docs.forEach((doc: any) => examTitles.set(doc.id, doc.data().title ?? ""));

  const results: PracticeGradeResult[] = [];
  const breakdown: any[] = [];
  let score = 0;
  let total = 0;

  for (const snap of questionDocs) {
    if (!snap.exists) continue;
    const q: any = { id: snap.id, ...snap.data() };

    const fullMarks = q.marks ?? 1;
    const selected = answers[q.id] ?? null;
    const correct = selected === q.correct_option;
    const marksAwarded = correct ? fullMarks : 0;
    const topicName = q.topic || subjectFromExamTitle(examTitles.get(q.exam_id) ?? "");

    score += marksAwarded;
    total += fullMarks;

    results.push({
      questionId: q.id,
      correct,
      correctOption: q.correct_option,
      explanation: q.explanation ?? null,
      topicName,
      marksAwarded,
      fullMarks,
    });

    breakdown.push({
      questionId: q.id,
      type: "mcq",
      question_text: q.question_text ?? "",
      selectedAnswer: selected,
      correctAnswer: q.correct_option,
      isCorrect: correct,
      marksAwarded,
      fullMarks,
      // Only record a topic when the question genuinely carries one. Writing
      // the subject fallback here would make analytics report per-concept
      // precision it does not actually have.
      topic: q.topic ?? null,
      difficulty: q.difficulty ?? null,
    });
  }

  const percentage = total > 0 ? Math.round((score / total) * 10000) / 100 : 0;

  const ref = await adminDb.collection("practice_sessions").add({
    user_id: userId,
    score,
    total_marks: total,
    percentage,
    time_spent_seconds: Math.max(0, Math.min(timeSpentSeconds, 4 * 60 * 60)),
    is_daily: isDaily,
    answers_json: { breakdown, raw_answers: answers },
    attempted_at: new Date().toISOString(),
  });

  return { sessionId: ref.id, results, score, total };
}

// ---------------------------------------------------------------------------
// Daily 10
// ---------------------------------------------------------------------------

export interface DailyStatus {
  /** Day key (YYYY-MM-DD) the set belongs to. */
  day: string;
  completed: boolean;
  score: number | null;
  total: number | null;
}

function dayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Whether today's Daily 10 has already been done. Completion is derived from
 * practice sessions rather than a separate flag, so it cannot drift out of
 * sync with the sessions that actually count towards mastery.
 */
export async function getDailyStatus(userId: string): Promise<DailyStatus> {
  const today = dayKey();

  const snap = await adminDb
    .collection("practice_sessions")
    .where("user_id", "==", userId)
    .where("is_daily", "==", true)
    .get();

  const todays = snap.docs
    .map((doc: any) => doc.data())
    .find((session: any) => String(session.attempted_at ?? "").slice(0, 10) === today);

  return {
    day: today,
    completed: Boolean(todays),
    score: todays ? Number(todays.score) : null,
    total: todays ? Number(todays.total_marks) : null,
  };
}
