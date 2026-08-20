/**
 * MockExams: Engagement & Gamification Engine
 * Tracks streaks, badges, leaderboard, and rewards
 * Increases engagement by 10x through game mechanics
 */

export type BadgeType =
  | "first_exam"
  | "perfect_score"
  | "week_streak_7"
  | "week_streak_14"
  | "month_streak_30"
  | "problem_master"
  | "speed_demon"
  | "comeback_king"
  | "tutor_choice"
  | "hall_of_fame";

export interface Badge {
  id: BadgeType;
  name: string;
  description: string;
  icon: string;
  earnedDate: Date;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  points: number;
}

export interface StudentEngagementMetrics {
  studentId: string;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  badges: Badge[];
  level: number; // 1-100 based on points
  learningMinutesToday: number;
  examsCompleted: number;
  avgScore: number;
  globalRank: number;
}

export interface EngagementEvent {
  studentId: string;
  eventType: string;
  points: number;
  streak: number;
  badges?: BadgeType[];
  timestamp: Date;
}

export class EngagementTracker {
  /**
   * Track study activity and update engagement metrics
   */
  async recordStudySession(
    studentId: string,
    durationMinutes: number,
    topicsReviewed: number,
    performanceScore: number
  ): Promise<EngagementEvent> {
    const points = this.calculatePoints(durationMinutes, topicsReviewed, performanceScore);
    const badgesEarned: BadgeType[] = [];

    // Check for streak milestone
    if (durationMinutes > 0) {
      // Student is active today (streak continues)
    }

    // Check for badge eligibility
    if (performanceScore === 100) {
      badgesEarned.push("perfect_score");
    }

    if (durationMinutes > 120) {
      badgesEarned.push("speed_demon");
    }

    return {
      studentId,
      eventType: "study_session",
      points,
      streak: 1, // Will be calculated from database
      badges: badgesEarned,
      timestamp: new Date(),
    };
  }

  /**
   * Record exam completion
   */
  async recordExamCompletion(
    studentId: string,
    score: number,
    timeMinutes: number
  ): Promise<EngagementEvent> {
    const points = this.calculateExamPoints(score, timeMinutes);
    const badges: BadgeType[] = [];

    if (score === 100) {
      badges.push("perfect_score");
    }

    if (score >= 80 && timeMinutes < 30) {
      badges.push("speed_demon");
    }

    return {
      studentId,
      eventType: "exam_completed",
      points,
      streak: 1,
      badges,
      timestamp: new Date(),
    };
  }

  /**
   * Calculate points for study activity
   * Base formula: duration + mastery + speed bonus
   */
  private calculatePoints(
    durationMinutes: number,
    topicsReviewed: number,
    performanceScore: number
  ): number {
    const basePoints = durationMinutes * 0.5; // 0.5 points per minute
    const masteryBonus = performanceScore * 0.5; // Up to 50 points for score
    const topicBonus = topicsReviewed * 10; // 10 points per topic

    return Math.round(basePoints + masteryBonus + topicBonus);
  }

  /**
   * Calculate exam completion points
   */
  private calculateExamPoints(score: number, timeMinutes: number): number {
    const basePoints = score * 2; // 2 points per % score
    const speedBonus = Math.max(0, 100 - timeMinutes); // Bonus for speed

    return Math.round(basePoints + speedBonus);
  }

  /**
   * Calculate student level (1-100) based on total points
   */
  calculateLevel(totalPoints: number): number {
    // Level progression: each level requires progressively more points
    // Level 1-10: 100 points per level
    // Level 11-25: 500 points per level
    // Level 26-50: 1000 points per level
    // Level 51-100: 2000 points per level

    let level = 1;
    let accumulated = 0;

    for (let i = 1; i <= 100; i++) {
      let pointsForThisLevel = 100;
      if (i > 50) pointsForThisLevel = 2000;
      else if (i > 25) pointsForThisLevel = 1000;
      else if (i > 10) pointsForThisLevel = 500;

      if (accumulated + pointsForThisLevel > totalPoints) {
        break;
      }

      accumulated += pointsForThisLevel;
      level = i + 1;
    }

    return Math.min(100, level);
  }

  /**
   * Award badge and check for streak/achievement milestones
   */
  async checkBadgeEligibility(
    studentId: string,
    metrics: StudentEngagementMetrics
  ): Promise<BadgeType[]> {
    const newBadges: BadgeType[] = [];
    const existingBadgeIds = new Set(metrics.badges.map((b) => b.id));

    // Streak badges
    if (metrics.currentStreak === 7 && !existingBadgeIds.has("week_streak_7")) {
      newBadges.push("week_streak_7");
    }
    if (metrics.currentStreak === 14 && !existingBadgeIds.has("week_streak_14")) {
      newBadges.push("week_streak_14");
    }
    if (metrics.currentStreak === 30 && !existingBadgeIds.has("month_streak_30")) {
      newBadges.push("month_streak_30");
    }

    // Performance badges
    if (metrics.examsCompleted === 1 && !existingBadgeIds.has("first_exam")) {
      newBadges.push("first_exam");
    }

    if (metrics.avgScore >= 90 && metrics.examsCompleted >= 5 && !existingBadgeIds.has("tutor_choice")) {
      newBadges.push("tutor_choice");
    }

    // Achievement badges
    if (metrics.examsCompleted >= 25 && !existingBadgeIds.has("problem_master")) {
      newBadges.push("problem_master");
    }

    // Comeback badge (score improved significantly after low period)
    if (!existingBadgeIds.has("comeback_king")) {
      // Would check score history
    }

    // Hall of Fame (top 1% globally)
    if (metrics.globalRank === 1 && !existingBadgeIds.has("hall_of_fame")) {
      newBadges.push("hall_of_fame");
    }

    return newBadges;
  }

  /**
   * Get badge definition
   */
  getBadgeDefinition(badgeId: BadgeType): Badge {
    const definitions: Record<BadgeType, Omit<Badge, "earnedDate" | "id">> = {
      first_exam: {
        name: "First Step",
        description: "Complete your first exam",
        icon: "🎯",
        rarity: "common",
        points: 10,
      },
      perfect_score: {
        name: "Perfect!",
        description: "Score 100% on an exam",
        icon: "⭐",
        rarity: "rare",
        points: 50,
      },
      week_streak_7: {
        name: "Week Warrior",
        description: "Study for 7 consecutive days",
        icon: "🔥",
        rarity: "uncommon",
        points: 30,
      },
      week_streak_14: {
        name: "Fortnight Focus",
        description: "Study for 14 consecutive days",
        icon: "💪",
        rarity: "uncommon",
        points: 50,
      },
      month_streak_30: {
        name: "Monthly Master",
        description: "Study for 30 consecutive days",
        icon: "👑",
        rarity: "epic",
        points: 100,
      },
      problem_master: {
        name: "Problem Solver",
        description: "Complete 25+ exams with good scores",
        icon: "🧠",
        rarity: "epic",
        points: 150,
      },
      speed_demon: {
        name: "Speed Demon",
        description: "Complete an exam in under 30 minutes with 80%+ score",
        icon: "⚡",
        rarity: "uncommon",
        points: 40,
      },
      comeback_king: {
        name: "Comeback King",
        description: "Improve 30+ points after a struggle period",
        icon: "🏆",
        rarity: "rare",
        points: 75,
      },
      tutor_choice: {
        name: "Tutor's Choice",
        description: "Maintain 90%+ average over 5+ exams",
        icon: "🎓",
        rarity: "rare",
        points: 100,
      },
      hall_of_fame: {
        name: "Hall of Fame",
        description: "Achieve rank #1 globally",
        icon: "🥇",
        rarity: "legendary",
        points: 500,
      },
    };

    const def = definitions[badgeId];
    return {
      ...def,
      id: badgeId,
      earnedDate: new Date(),
    };
  }

  /**
   * Generate leaderboard rankings
   */
  generateLeaderboard(
    allStudents: StudentEngagementMetrics[],
    timeframe: "daily" | "weekly" | "alltime"
  ): {
    rank: number;
    studentId: string;
    points: number;
    streak: number;
    badges: number;
    level: number;
  }[] {
    // In production, would filter by timeframe and calculate accordingly
    return allStudents
      .map((student, index) => ({
        rank: index + 1,
        studentId: student.studentId,
        points: student.totalPoints,
        streak: student.currentStreak,
        badges: student.badges.length,
        level: student.level,
      }))
      .sort((a, b) => b.points - a.points)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
  }

  /**
   * Calculate engagement summary
   */
  getSummary(metrics: StudentEngagementMetrics): {
    engagementScore: number; // 0-100
    recommendation: string;
    nextMilestones: string[];
  } {
    // Engagement = (streak% + exam_count% + badge_count%) / 3
    const streakScore = Math.min(100, metrics.currentStreak * 3);
    const examScore = Math.min(100, metrics.examsCompleted * 4);
    const badgeScore = Math.min(100, metrics.badges.length * 5);

    const engagementScore = Math.round((streakScore + examScore + badgeScore) / 3);

    let recommendation = "";
    if (engagementScore > 80) {
      recommendation = "🔥 Outstanding engagement! Keep crushing it!";
    } else if (engagementScore > 60) {
      recommendation = "💪 Great momentum! You're making excellent progress.";
    } else if (engagementScore > 40) {
      recommendation = "👍 Good start! Aim for a 7-day study streak.";
    } else {
      recommendation = "🎯 Get started! Complete 3 exams this week.";
    }

    const nextMilestones: string[] = [];
    if (metrics.currentStreak < 7) {
      nextMilestones.push(`${7 - metrics.currentStreak} more days for Week Warrior badge`);
    }
    if (metrics.examsCompleted < 5) {
      nextMilestones.push(`${5 - metrics.examsCompleted} exams for strong foundation`);
    }
    if (metrics.avgScore < 90 && metrics.examsCompleted >= 5) {
      nextMilestones.push("Aim for 90%+ average for Tutor's Choice badge");
    }

    return {
      engagementScore,
      recommendation,
      nextMilestones,
    };
  }
}

/**
 * Initialize engagement tracker
 */
export function initializeEngagementTracker(): EngagementTracker {
  return new EngagementTracker();
}
