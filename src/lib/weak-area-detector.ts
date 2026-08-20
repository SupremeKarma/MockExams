/**
 * MockExams: Weak Area Detection System
 * Real-time identification of struggling topics
 * Triggers automated intervention suggestions
 */

export interface StudentMetrics {
  studentId: string;
  topicMetrics: {
    topicId: string;
    topicName: string;
    masteryPercentage: number;
    recentAttempts: {
      correct: boolean;
      timeSeconds: number;
      difficulty: number;
    }[];
    averageTime: number;
    errorRate: number;
    lastAttemptTime: Date;
    attemptCount: number;
  }[];
  overallMastery: number;
}

export interface WeakArea {
  topicId: string;
  topicName: string;
  severity: "critical" | "high" | "medium"; // C: <50%, H: 50-70%, M: 70-85%
  masteryPercentage: number;
  errorRate: number;
  averageResponseTime: number;
  recommendedIntervention: string;
  estimatedRecoveryHours: number;
  prerequisitesMissing: string[];
}

export interface InterventionSuggestion {
  topicId: string;
  interventionType: "hint" | "explanation" | "practice" | "visualize" | "prerequisites";
  urgency: "immediate" | "soon" | "planned";
  suggestedAction: string;
  estimatedTimeMinutes: number;
  expectedImprovementPercent: number;
}

export class WeakAreaDetector {
  /**
   * Analyze student performance and detect weak areas
   */
  detectWeakAreas(metrics: StudentMetrics): WeakArea[] {
    const weakAreas: WeakArea[] = [];

    for (const topic of metrics.topicMetrics) {
      // Classify severity
      let severity: "critical" | "high" | "medium";
      if (topic.masteryPercentage < 50) {
        severity = "critical";
      } else if (topic.masteryPercentage < 70) {
        severity = "high";
      } else if (topic.masteryPercentage < 85) {
        severity = "medium";
      } else {
        continue; // Skip if mastery is good
      }

      // Calculate metrics
      const errorRate = topic.recentAttempts.length > 0
        ? (topic.recentAttempts.filter((a) => !a.correct).length /
            topic.recentAttempts.length) *
          100
        : 0;

      const avgResponseTime = topic.averageTime || 0;

      // Identify missing prerequisites
      const prerequisitesMissing = this.checkPrerequisites(
        topic.topicId,
        metrics.topicMetrics
      );

      // Estimate recovery time
      const improvementNeeded = 85 - topic.masteryPercentage;
      const estimatedHours = Math.ceil(
        improvementNeeded * (severity === "critical" ? 0.15 : 0.1)
      );

      // Generate intervention recommendation
      const recommendedIntervention = this.getRecommendedIntervention(
        topic.masteryPercentage,
        errorRate,
        avgResponseTime,
        prerequisitesMissing.length > 0
      );

      weakAreas.push({
        topicId: topic.topicId,
        topicName: topic.topicName,
        severity,
        masteryPercentage: topic.masteryPercentage,
        errorRate,
        averageResponseTime: avgResponseTime,
        recommendedIntervention,
        estimatedRecoveryHours: estimatedHours,
        prerequisitesMissing,
      });
    }

    // Sort by severity and mastery (worst first)
    return weakAreas.sort((a, b) => {
      const severityScore = { critical: 3, high: 2, medium: 1 };
      const diff = severityScore[b.severity] - severityScore[a.severity];
      return diff !== 0 ? diff : a.masteryPercentage - b.masteryPercentage;
    });
  }

  /**
   * Check if student has mastered prerequisites
   */
  private checkPrerequisites(
    topicId: string,
    allTopics: StudentMetrics["topicMetrics"]
  ): string[] {
    // Map of topic prerequisites
    const prerequisites: Record<string, string[]> = {
      "btree": ["indexing", "search"],
      "normalization": ["relational-model"],
      "transactions": ["relational-model", "normalization"],
      "graphs": ["trees", "linked-lists"],
      "dynamic-programming": ["recursion", "complexity-analysis"],
    };

    const missing: string[] = [];
    const prereqs = prerequisites[topicId] || [];

    for (const prereqId of prereqs) {
      const prereqTopic = allTopics.find((t) => t.topicId === prereqId);
      if (!prereqTopic || prereqTopic.masteryPercentage < 70) {
        missing.push(prereqId);
      }
    }

    return missing;
  }

  /**
   * Get recommended intervention based on performance
   */
  private getRecommendedIntervention(
    mastery: number,
    errorRate: number,
    avgTime: number,
    hasPrerequisiteGaps: boolean
  ): string {
    if (hasPrerequisiteGaps) {
      return "Review missing prerequisites first";
    }

    if (mastery < 30) {
      return "Start with basic concepts and examples";
    }

    if (mastery < 50) {
      return "Practice foundational problems with solutions";
    }

    if (errorRate > 50) {
      return "Focus on common mistakes and misconceptions";
    }

    if (avgTime > 300) {
      // > 5 minutes
      return "Work on speed and efficiency";
    }

    return "Practice harder problems to deepen understanding";
  }

  /**
   * Generate intervention suggestions for weak areas
   */
  generateInterventionSuggestions(weakAreas: WeakArea[]): InterventionSuggestion[] {
    const suggestions: InterventionSuggestion[] = [];

    for (const area of weakAreas) {
      // Critical areas need immediate intervention
      if (area.severity === "critical") {
        suggestions.push({
          topicId: area.topicId,
          interventionType: area.prerequisitesMissing.length > 0 ? "prerequisites" : "explanation",
          urgency: "immediate",
          suggestedAction:
            area.prerequisitesMissing.length > 0
              ? `Review: ${area.prerequisitesMissing.join(", ")}`
              : `Get detailed explanation of ${area.topicName}`,
          estimatedTimeMinutes: 30,
          expectedImprovementPercent: 20,
        });

        // Also add practice suggestion
        suggestions.push({
          topicId: area.topicId,
          interventionType: "practice",
          urgency: "immediate",
          suggestedAction: `Solve 5 easy problems on ${area.topicName}`,
          estimatedTimeMinutes: 25,
          expectedImprovementPercent: 15,
        });
      }

      // High severity: suggest focused practice
      if (area.severity === "high") {
        suggestions.push({
          topicId: area.topicId,
          interventionType: area.errorRate > 60 ? "hint" : "practice",
          urgency: "soon",
          suggestedAction:
            area.errorRate > 60
              ? `Get hints for common mistakes in ${area.topicName}`
              : `Practice 3-5 medium difficulty problems`,
          estimatedTimeMinutes: 20,
          expectedImprovementPercent: 12,
        });
      }

      // Medium: suggest visualization or deeper practice
      if (area.severity === "medium") {
        suggestions.push({
          topicId: area.topicId,
          interventionType: "visualize",
          urgency: "planned",
          suggestedAction: `Visualize concepts in ${area.topicName}`,
          estimatedTimeMinutes: 15,
          expectedImprovementPercent: 8,
        });
      }
    }

    return suggestions.sort((a, b) => {
      const urgencyScore = { immediate: 3, soon: 2, planned: 1 };
      return urgencyScore[b.urgency] - urgencyScore[a.urgency];
    });
  }

  /**
   * Calculate struggle score (0-100)
   * Higher = more struggling
   */
  calculateStruggleScore(topic: StudentMetrics["topicMetrics"][number]): number {
    if (topic.attemptCount === 0) return 0;

    const masteryFactor = (100 - topic.masteryPercentage) * 0.4;
    const errorFactor = topic.errorRate * 0.4;
    const timeFactor = Math.min(topic.averageTime / 2, 100) * 0.2; // Normalize time

    return Math.min(100, masteryFactor + errorFactor + timeFactor);
  }

  /**
   * Identify students at risk (across cohort)
   */
  identifyAtRiskStudents(
    allStudents: StudentMetrics[],
    threshold: number = 40 // Struggle score threshold
  ): {
    studentId: string;
    riskLevel: "high" | "medium" | "low";
    weakAreas: WeakArea[];
    suggestedActions: string[];
  }[] {
    return allStudents
      .map((metrics) => {
        const weakAreas = this.detectWeakAreas(metrics);
        const avgStruggle = metrics.topicMetrics.length > 0
          ? metrics.topicMetrics.reduce((sum, t) => sum + this.calculateStruggleScore(t), 0) /
            metrics.topicMetrics.length
          : 0;

        let riskLevel: "high" | "medium" | "low";
        if (avgStruggle > 60) {
          riskLevel = "high";
        } else if (avgStruggle > threshold) {
          riskLevel = "medium";
        } else {
          riskLevel = "low";
        }

        const suggestedActions: string[] = [];
        if (weakAreas.length > 0) {
          suggestedActions.push(
            `Focus on: ${weakAreas[0].topicName} (${weakAreas[0].masteryPercentage.toFixed(0)}%)`
          );

          if (weakAreas.length > 1) {
            suggestedActions.push(
              `Secondary: ${weakAreas[1].topicName} (${weakAreas[1].masteryPercentage.toFixed(0)}%)`
            );
          }
        }

        if (avgStruggle > 70) {
          suggestedActions.push("Consider one-on-one tutoring session");
        }

        return {
          studentId: metrics.studentId,
          riskLevel,
          weakAreas,
          suggestedActions,
        };
      })
      .filter((s) => s.riskLevel !== "low")
      .sort((a, b) => {
        const riskScore = { high: 3, medium: 2, low: 1 };
        return riskScore[b.riskLevel] - riskScore[a.riskLevel];
      });
  }

  /**
   * Analyze performance trends (improving vs declining)
   */
  analyzeTrend(recentAttempts: { correct: boolean; timestamp: Date }[]): {
    trend: "improving" | "declining" | "stable";
    velocity: number; // percentage change per day
    forecast: number; // predicted mastery in 7 days
  } {
    if (recentAttempts.length < 2) {
      return { trend: "stable", velocity: 0, forecast: 50 };
    }

    const recentCorrect = recentAttempts
      .slice(-5)
      .filter((a) => a.correct).length;
    const olderCorrect = recentAttempts
      .slice(-10, -5)
      .filter((a) => a.correct).length;

    const changePercent =
      ((recentCorrect - olderCorrect) / (olderCorrect || 1)) * 100;

    let trend: "improving" | "declining" | "stable";
    if (changePercent > 10) {
      trend = "improving";
    } else if (changePercent < -10) {
      trend = "declining";
    } else {
      trend = "stable";
    }

    const velocity = changePercent / 5; // per day approximately
    const forecast = Math.min(100, Math.max(0, 50 + velocity * 7));

    return { trend, velocity, forecast };
  }
}

/**
 * Initialize weak area detector
 */
export function initializeWeakAreaDetector(): WeakAreaDetector {
  return new WeakAreaDetector();
}
