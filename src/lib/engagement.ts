// Streaks, badges, points and level, computed from real activity.
//
// Wires up the (previously orphaned) EngagementTracker: the tracker owns the
// badge catalogue, level curve and summary logic, while this module supplies
// the actual numbers from exam attempts, practice sessions and the entitlement
// streak that awardDailyLogin maintains.

import { adminDb } from "@/lib/firebase-admin";
import {
  EngagementTracker,
  type Badge,
  type BadgeType,
  type StudentEngagementMetrics,
} from "@/lib/engagement-tracker";
import { getEntitlement } from "@/lib/entitlements";

export interface EngagementSummary {
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  level: number;
  examsCompleted: number;
  practiceSessions: number;
  avgScore: number;
  globalRank: number | null;
  /** Number of ranked students, so the UI can say what a rank is out of. */
  cohortSize: number;
  badges: Badge[];
  /** Badges not yet earned, so the UI can show what's next. */
  lockedBadges: Badge[];
  engagementScore: number;
  recommendation: string;
  nextMilestones: string[];
}

/**
 * Hall of Fame is rank #1 globally. With only a handful of ranked students
 * that is trivially true, so it stays locked until the cohort is big enough
 * for the rank to mean something.
 */
export const HALL_OF_FAME_MIN_COHORT = 10;

const ALL_BADGES: BadgeType[] = [
  "first_exam",
  "perfect_score",
  "week_streak_7",
  "week_streak_14",
  "month_streak_30",
  "speed_demon",
  "comeback_king",
  "tutor_choice",
  "problem_master",
  "hall_of_fame",
];

/**
 * Global rank by best exam percentage. Returns null when the student has no
 * leaderboard entry rather than inventing a rank.
 */
async function globalRankFor(userId: string): Promise<{ rank: number | null; cohortSize: number }> {
  const snap = await adminDb.collection("leaderboard").get();
  if (snap.empty) return { rank: null, cohortSize: 0 };

  // One entry per user per exam; a student's standing is their best result.
  const bestByUser = new Map<string, number>();
  snap.docs.forEach((doc: any) => {
    const data = doc.data();
    const current = bestByUser.get(data.user_id) ?? 0;
    bestByUser.set(data.user_id, Math.max(current, Number(data.percentage) || 0));
  });

  const cohortSize = bestByUser.size;
  const mine = bestByUser.get(userId);
  if (mine === undefined) return { rank: null, cohortSize };

  let ahead = 0;
  bestByUser.forEach((percentage, uid) => {
    if (uid !== userId && percentage > mine) ahead += 1;
  });

  return { rank: ahead + 1, cohortSize };
}

export async function buildEngagementSummary(userId: string): Promise<EngagementSummary> {
  const [attemptSnap, practiceSnap, entitlement] = await Promise.all([
    adminDb.collection("exam_attempts").where("user_id", "==", userId).get(),
    adminDb.collection("practice_sessions").where("user_id", "==", userId).get(),
    getEntitlement(userId),
  ]);

  const attempts = attemptSnap.docs
    .map((doc: any) => doc.data())
    .sort((a: any, b: any) => String(a.attempted_at).localeCompare(String(b.attempted_at)));

  const examsCompleted = attempts.length;
  const practiceSessions = practiceSnap.size;

  const avgScore =
    examsCompleted > 0
      ? Math.round(
          (attempts.reduce((sum: number, a: any) => sum + (Number(a.percentage) || 0), 0) /
            examsCompleted) *
            10
        ) / 10
      : 0;

  const { rank: globalRank, cohortSize } = await globalRankFor(userId);
  const tracker = new EngagementTracker();

  // ---- Badge eligibility, all from real activity ----
  const earned = new Set<BadgeType>();

  if (examsCompleted >= 1) earned.add("first_exam");
  if (attempts.some((a: any) => Number(a.percentage) === 100)) earned.add("perfect_score");
  if (entitlement.longestStreak >= 7) earned.add("week_streak_7");
  if (entitlement.longestStreak >= 14) earned.add("week_streak_14");
  if (entitlement.longestStreak >= 30) earned.add("month_streak_30");

  if (
    attempts.some(
      (a: any) => Number(a.percentage) >= 80 && (Number(a.time_spent_seconds) || 0) < 30 * 60
    )
  ) {
    earned.add("speed_demon");
  }

  if (examsCompleted >= 25 && avgScore >= 70) earned.add("problem_master");
  if (examsCompleted >= 5 && avgScore >= 90) earned.add("tutor_choice");
  if (globalRank === 1 && cohortSize >= HALL_OF_FAME_MIN_COHORT) earned.add("hall_of_fame");

  // Comeback: a later attempt on the same exam beating an earlier one by 30+.
  const bestSoFar = new Map<string, number>();
  for (const attempt of attempts) {
    const examId = attempt.exam_id;
    const percentage = Number(attempt.percentage) || 0;
    const previous = bestSoFar.get(examId);
    if (previous !== undefined && percentage - previous >= 30) {
      earned.add("comeback_king");
    }
    bestSoFar.set(examId, Math.max(previous ?? 0, percentage));
  }

  const badges: Badge[] = [];
  const lockedBadges: Badge[] = [];
  for (const id of ALL_BADGES) {
    const definition = tracker.getBadgeDefinition(id);
    if (earned.has(id)) badges.push(definition);
    else lockedBadges.push(definition);
  }

  // Points: badges plus a flat award per completed activity.
  const badgePoints = badges.reduce((sum, badge) => sum + badge.points, 0);
  const activityPoints = examsCompleted * 20 + practiceSessions * 5;
  const totalPoints = badgePoints + activityPoints;

  const metrics: StudentEngagementMetrics = {
    studentId: userId,
    currentStreak: entitlement.streak,
    longestStreak: entitlement.longestStreak,
    totalPoints,
    badges,
    level: tracker.calculateLevel(totalPoints),
    learningMinutesToday: 0,
    examsCompleted,
    avgScore,
    globalRank: globalRank ?? 0,
  };

  const summary = tracker.getSummary(metrics);

  return {
    currentStreak: metrics.currentStreak,
    longestStreak: metrics.longestStreak,
    totalPoints,
    level: metrics.level,
    examsCompleted,
    practiceSessions,
    avgScore,
    globalRank,
    cohortSize,
    badges,
    lockedBadges,
    engagementScore: summary.engagementScore,
    recommendation: summary.recommendation,
    nextMilestones: summary.nextMilestones,
  };
}
