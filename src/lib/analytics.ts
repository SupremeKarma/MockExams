// Turns raw exam attempts into the StudentMetrics shape the (previously
// orphaned) WeakAreaDetector expects, so /analytics can run on real data
// instead of the hardcoded PERFORMANCE_DATA constant it used to render.
//
// Topic granularity is the limiting factor. Questions have no topic field
// historically, so a topic is resolved in this order:
//   1. `concepts[]` from AI grading of a written answer  (most precise)
//   2. an explicit `topic` tag on the question           (set by staff)
//   3. the subject parsed out of the exam title          (always available)
// Analytics therefore works today at subject level and sharpens automatically
// as written answers get graded and questions get tagged.

import { adminDb } from "@/lib/firebase-admin";
import {
  WeakAreaDetector,
  type StudentMetrics,
  type WeakArea,
  type InterventionSuggestion,
} from "@/lib/weak-area-detector";

export interface TopicPerformance {
  topicId: string;
  topicName: string;
  /** Marks earned as a percentage of marks available. */
  masteryPercentage: number;
  questionsAttempted: number;
  correctCount: number;
  accuracy: number;
  /** Approximate: attempt time split evenly across its questions. */
  averageTimeSeconds: number;
  status: "Mastered" | "Proficient" | "Weak";
}

export interface ExamSummary {
  examId: string;
  examTitle: string;
  attempts: number;
  bestPercentage: number;
  latestPercentage: number;
  /** Mean percentage across every student who sat this exam. */
  cohortAveragePercentage: number | null;
  lastAttemptedAt: string;
}

export interface StudentAnalytics {
  hasData: boolean;
  totalAttempts: number;
  practiceSessions: number;
  questionsAnswered: number;
  overallMastery: number;
  averagePercentage: number;
  totalStudySeconds: number;
  topics: TopicPerformance[];
  weakAreas: WeakArea[];
  interventions: InterventionSuggestion[];
  exams: ExamSummary[];
  /** True when every topic came from exam titles, i.e. nothing is tagged yet. */
  coarseTopicsOnly: boolean;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Exam titles follow "Subject — CODE (year)". Strip the code and year so
 * "Data Structure & Algorithm — BIT203CO (2024)" groups with its other years.
 */
export function subjectFromExamTitle(title: string): string {
  if (!title) return "General";
  const [subject] = title.split(/[—–-]{1,2}\s*BIT|\s+—\s+|\s+–\s+/);
  return (subject || title).trim().replace(/\s*\(\d{4}\)\s*$/, "").trim() || "General";
}

interface TopicAccumulator {
  topicName: string;
  marksEarned: number;
  marksAvailable: number;
  correct: number;
  attempted: number;
  timeSeconds: number;
  recentAttempts: { correct: boolean; timeSeconds: number; difficulty: number }[];
  lastAttemptTime: Date;
  precise: boolean;
}

const DIFFICULTY_SCORE: Record<string, number> = { easy: 1, medium: 2, hard: 3 };

export async function buildStudentAnalytics(userId: string): Promise<StudentAnalytics> {
  const [attemptSnap, practiceSnap] = await Promise.all([
    adminDb.collection("exam_attempts").where("user_id", "==", userId).get(),
    adminDb.collection("practice_sessions").where("user_id", "==", userId).get(),
  ]);

  const examAttempts = attemptSnap.docs.map((doc: any) => ({
    id: doc.id,
    isPractice: false,
    ...doc.data(),
  }));

  // Practice sessions use the same breakdown shape, so they fold straight into
  // the same mastery maths — drilling a weak topic actually moves the number.
  const practiceSessions = practiceSnap.docs.map((doc: any) => ({
    id: doc.id,
    isPractice: true,
    exam_id: null,
    exam_title: "",
    ...doc.data(),
  }));

  const attempts = [...examAttempts, ...practiceSessions].sort((a: any, b: any) =>
    String(a.attempted_at).localeCompare(String(b.attempted_at))
  );

  if (attempts.length === 0) {
    return {
      hasData: false,
      totalAttempts: 0,
      practiceSessions: 0,
      questionsAnswered: 0,
      overallMastery: 0,
      averagePercentage: 0,
      totalStudySeconds: 0,
      topics: [],
      weakAreas: [],
      interventions: [],
      exams: [],
      coarseTopicsOnly: true,
    };
  }

  const topics = new Map<string, TopicAccumulator>();
  const examStats = new Map<string, ExamSummary>();

  let questionsAnswered = 0;
  let totalStudySeconds = 0;
  let anyPreciseTopic = false;

  for (const attempt of attempts) {
    const breakdown: any[] = Array.isArray(attempt?.answers_json?.breakdown)
      ? attempt.answers_json.breakdown
      : [];

    const attemptedAt = String(attempt.attempted_at ?? new Date().toISOString());
    const attemptDate = new Date(attemptedAt);
    const attemptSeconds = Number(attempt.time_spent_seconds) || 0;
    totalStudySeconds += attemptSeconds;

    // Per-question timing isn't recorded, so attempt time is split evenly.
    const perQuestionSeconds = breakdown.length > 0 ? attemptSeconds / breakdown.length : 0;
    const subject = subjectFromExamTitle(attempt.exam_title ?? "");

    const percentage = Number(attempt.percentage) || 0;

    if (!attempt.isPractice && attempt.exam_id) {
      const existingExam = examStats.get(attempt.exam_id);
      examStats.set(attempt.exam_id, {
        examId: attempt.exam_id,
        examTitle: attempt.exam_title ?? "Untitled exam",
        attempts: (existingExam?.attempts ?? 0) + 1,
        bestPercentage: Math.max(existingExam?.bestPercentage ?? 0, percentage),
        latestPercentage: percentage,
        cohortAveragePercentage: null,
        lastAttemptedAt: attemptedAt,
      });
    }

    for (const item of breakdown) {
      // Skip written answers still awaiting grading — counting them as zero
      // would show a fake mastery dip that corrects itself minutes later.
      if (item.type === "written" && item.grading_status === "pending") continue;

      const labels: string[] =
        Array.isArray(item.concepts) && item.concepts.length > 0
          ? item.concepts
          : item.topic
            ? [item.topic]
            : [subject];

      const precise = Array.isArray(item.concepts) && item.concepts.length > 0 ? true : Boolean(item.topic);
      if (precise) anyPreciseTopic = true;

      const marksEarned = Math.max(0, Number(item.marksAwarded) || 0);
      // fullMarks is absent on attempts recorded before the M1 change. Falling
      // back to a flat 1 mark would push mastery above 100% whenever a question
      // was worth more than one mark, so infer the denominator from what a
      // correct answer actually earned.
      const marksAvailable = Number(item.fullMarks) || Math.max(1, marksEarned);

      questionsAnswered += 1;

      for (const label of labels) {
        const id = slugify(label);
        if (!id) continue;

        const acc = topics.get(id) ?? {
          topicName: label,
          marksEarned: 0,
          marksAvailable: 0,
          correct: 0,
          attempted: 0,
          timeSeconds: 0,
          recentAttempts: [],
          lastAttemptTime: attemptDate,
          precise,
        };

        acc.marksEarned += marksEarned;
        acc.marksAvailable += marksAvailable;
        acc.attempted += 1;
        if (item.isCorrect) acc.correct += 1;
        acc.timeSeconds += perQuestionSeconds;
        acc.precise = acc.precise || precise;
        if (attemptDate > acc.lastAttemptTime) acc.lastAttemptTime = attemptDate;

        acc.recentAttempts.push({
          correct: Boolean(item.isCorrect),
          timeSeconds: perQuestionSeconds,
          difficulty: DIFFICULTY_SCORE[String(item.difficulty ?? "medium")] ?? 2,
        });
        if (acc.recentAttempts.length > 20) acc.recentAttempts.shift();

        topics.set(id, acc);
      }
    }
  }

  const topicPerformance: TopicPerformance[] = Array.from(topics.entries()).map(([topicId, acc]) => {
    const masteryPercentage =
      acc.marksAvailable > 0
        ? Math.min(100, Math.round((acc.marksEarned / acc.marksAvailable) * 1000) / 10)
        : 0;
    const accuracy = acc.attempted > 0 ? Math.round((acc.correct / acc.attempted) * 1000) / 10 : 0;

    return {
      topicId,
      topicName: acc.topicName,
      masteryPercentage,
      questionsAttempted: acc.attempted,
      correctCount: acc.correct,
      accuracy,
      averageTimeSeconds: acc.attempted > 0 ? Math.round(acc.timeSeconds / acc.attempted) : 0,
      status: masteryPercentage >= 85 ? "Mastered" : masteryPercentage >= 70 ? "Proficient" : "Weak",
    };
  });

  topicPerformance.sort((a, b) => a.masteryPercentage - b.masteryPercentage);

  const totalMarksEarned = Array.from(topics.values()).reduce((sum, t) => sum + t.marksEarned, 0);
  const totalMarksAvailable = Array.from(topics.values()).reduce((sum, t) => sum + t.marksAvailable, 0);
  const overallMastery =
    totalMarksAvailable > 0
      ? Math.min(100, Math.round((totalMarksEarned / totalMarksAvailable) * 1000) / 10)
      : 0;

  const metrics: StudentMetrics = {
    studentId: userId,
    overallMastery,
    topicMetrics: Array.from(topics.entries()).map(([topicId, acc]) => ({
      topicId,
      topicName: acc.topicName,
      masteryPercentage:
        acc.marksAvailable > 0
          ? Math.min(100, (acc.marksEarned / acc.marksAvailable) * 100)
          : 0,
      recentAttempts: acc.recentAttempts,
      averageTime: acc.attempted > 0 ? acc.timeSeconds / acc.attempted : 0,
      errorRate: acc.attempted > 0 ? ((acc.attempted - acc.correct) / acc.attempted) * 100 : 0,
      lastAttemptTime: acc.lastAttemptTime,
      attemptCount: acc.attempted,
    })),
  };

  const detector = new WeakAreaDetector();
  const weakAreas = detector.detectWeakAreas(metrics);
  const interventions = detector.generateInterventionSuggestions(weakAreas);

  const exams = Array.from(examStats.values()).sort((a, b) =>
    b.lastAttemptedAt.localeCompare(a.lastAttemptedAt)
  );

  await attachCohortAverages(exams);

  const averagePercentage =
    examAttempts.length > 0
      ? Math.round(
          (examAttempts.reduce((sum: number, a: any) => sum + (Number(a.percentage) || 0), 0) /
            examAttempts.length) *
            10
        ) / 10
      : 0;

  return {
    hasData: true,
    totalAttempts: examAttempts.length,
    practiceSessions: practiceSessions.length,
    questionsAnswered,
    overallMastery,
    averagePercentage,
    totalStudySeconds,
    topics: topicPerformance,
    weakAreas,
    interventions,
    exams,
    coarseTopicsOnly: !anyPreciseTopic,
  };
}

/** Mean percentage across all students per exam, for an honest peer comparison. */
async function attachCohortAverages(exams: ExamSummary[]): Promise<void> {
  await Promise.all(
    exams.map(async (exam) => {
      try {
        const snap = await adminDb
          .collection("exam_attempts")
          .where("exam_id", "==", exam.examId)
          .get();

        if (snap.empty) return;

        const total = snap.docs.reduce(
          (sum: number, doc: any) => sum + (Number(doc.data().percentage) || 0),
          0
        );
        exam.cohortAveragePercentage = Math.round((total / snap.size) * 10) / 10;
      } catch (err) {
        console.error(`Cohort average failed for exam ${exam.examId}:`, err);
      }
    })
  );
}
