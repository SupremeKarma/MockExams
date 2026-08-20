/**
 * MockExams: Adaptive Learning Engine
 * ALEKS-style mastery-based difficulty adjustment
 * Adjusts question difficulty based on student performance
 */

export interface StudentPerformance {
  studentId: string;
  masteryPercentages: Record<string, number>; // topic -> mastery %
  recentAttempts: {
    questionId: string;
    correct: boolean;
    timeSeconds: number;
    difficulty: number;
  }[];
}

export interface QuestionMetadata {
  id: string;
  topicId: string;
  difficulty: number; // 1-5 scale
  masteryRequired: number; // prerequisite mastery %
  averageTimeSeconds: number;
  correctRate: number; // historical success rate
  prerequisitesMetIds: string[]; // must know these first
}

export interface AdaptiveQuestionSelection {
  questionId: string;
  difficulty: number;
  estimatedTimeSeconds: number;
  rationale: string;
}

export class AdaptiveEngine {
  /**
   * Calculate student's current mastery in a skill
   */
  calculateMastery(
    correctCount: number,
    incorrectCount: number,
    recentWeighted: boolean = true
  ): number {
    const total = correctCount + incorrectCount;
    if (total === 0) return 0;

    let mastery = (correctCount / total) * 100;

    // Weight recent attempts higher
    if (recentWeighted && total > 5) {
      const recencyMultiplier = 1.1; // 10% boost if improving recently
      mastery = mastery * recencyMultiplier;
    }

    return Math.min(100, mastery);
  }

  /**
   * Select next question based on adaptive algorithm
   * Balances: challenge, prerequisites, time management
   */
  selectNextQuestion(
    performance: StudentPerformance,
    availableQuestions: QuestionMetadata[],
    currentTopicId: string,
    sessionTimeRemaining: number
  ): AdaptiveQuestionSelection {
    // 1. Filter questions by prerequisites
    const qualifyingQuestions = availableQuestions.filter((q) => {
      // Check if student has mastered prerequisites
      return q.prerequisitesMetIds.every(
        (prereqId) =>
          performance.masteryPercentages[prereqId] >=
          (availableQuestions.find((aq) => aq.id === prereqId)?.masteryRequired || 70)
      );
    });

    if (qualifyingQuestions.length === 0) {
      // Fallback to easiest question
      return {
        questionId: availableQuestions[0].id,
        difficulty: 1,
        estimatedTimeSeconds: 60,
        rationale: "No qualifying questions; starting with basics",
      };
    }

    // 2. Calculate difficulty adjustment
    const currentMastery = performance.masteryPercentages[currentTopicId] || 0;
    const targetDifficulty = this.calculateTargetDifficulty(currentMastery);

    // 3. Find question closest to target difficulty
    const selectedQuestion = this.findClosestDifficultyQuestion(
      qualifyingQuestions,
      targetDifficulty
    );

    // 4. Verify time is sufficient
    if (
      selectedQuestion.averageTimeSeconds > sessionTimeRemaining &&
      sessionTimeRemaining < 300
    ) {
      // Session ending soon, pick faster question
      const fasterQuestion = qualifyingQuestions
        .filter((q) => q.averageTimeSeconds <= sessionTimeRemaining)
        .sort((a, b) => b.difficulty - a.difficulty)[0] || selectedQuestion;

      return {
        questionId: fasterQuestion.id,
        difficulty: fasterQuestion.difficulty,
        estimatedTimeSeconds: fasterQuestion.averageTimeSeconds,
        rationale: `Session ending soon (${sessionTimeRemaining}s left); picking faster question`,
      };
    }

    return {
      questionId: selectedQuestion.id,
      difficulty: selectedQuestion.difficulty,
      estimatedTimeSeconds: selectedQuestion.averageTimeSeconds,
      rationale: `Current mastery ${currentMastery.toFixed(0)}%; targeting difficulty ${targetDifficulty}`,
    };
  }

  /**
   * Calculate ideal difficulty based on mastery
   * Zones: [0-40%] easy, [40-70%] medium, [70-90%] hard, [90-100%] expert
   */
  private calculateTargetDifficulty(currentMastery: number): number {
    if (currentMastery < 40) return 1.5; // Very easy
    if (currentMastery < 60) return 2.5; // Easy
    if (currentMastery < 75) return 3.5; // Medium
    if (currentMastery < 90) return 4.0; // Hard
    return 4.5; // Expert
  }

  /**
   * Find question with difficulty closest to target
   */
  private findClosestDifficultyQuestion(
    questions: QuestionMetadata[],
    targetDifficulty: number
  ): QuestionMetadata {
    return questions.reduce((closest, current) => {
      const currentDiff = Math.abs(current.difficulty - targetDifficulty);
      const closestDiff = Math.abs(closest.difficulty - targetDifficulty);

      // Prefer harder questions when close (encourages learning)
      if (currentDiff === closestDiff) {
        return current.difficulty > closest.difficulty ? current : closest;
      }

      return currentDiff < closestDiff ? current : closest;
    });
  }

  /**
   * Update student's mastery based on recent answer
   */
  updateMastery(
    currentMastery: number,
    answered: boolean,
    difficulty: number,
    timeSeconds: number,
    averageTimeSeconds: number
  ): {
    newMastery: number;
    change: number;
    feedback: string;
  } {
    let change = 0;

    if (answered) {
      // Correct answer increases mastery
      // Weight by difficulty: harder questions = more points
      const difficultyMultiplier = difficulty / 3;
      change = Math.min(10, 5 * difficultyMultiplier);

      // Bonus for speed
      if (timeSeconds < averageTimeSeconds * 0.8) {
        change += 2; // Fast answer
      }
    } else {
      // Wrong answer decreases mastery
      // Weight by difficulty
      const difficultyPenalty = (difficulty - 1) * 1.5;
      change = -Math.max(3, 3 + difficultyPenalty);

      // Penalty for taking too long on hard questions
      if (difficulty > 3 && timeSeconds > averageTimeSeconds * 1.5) {
        change -= 2;
      }
    }

    const newMastery = Math.max(0, Math.min(100, currentMastery + change));

    return {
      newMastery,
      change,
      feedback: this.generateFeedback(currentMastery, newMastery, answered, difficulty),
    };
  }

  /**
   * Generate encouragement based on performance
   */
  private generateFeedback(
    oldMastery: number,
    newMastery: number,
    answered: boolean,
    difficulty: number
  ): string {
    if (!answered) {
      if (difficulty > 3) {
        return "This was a challenge! Study harder questions to build mastery.";
      } else {
        return "Let's review this concept before moving on.";
      }
    }

    const improvement = newMastery - oldMastery;

    if (newMastery >= 85) {
      return `Excellent! You're mastering this (${newMastery.toFixed(0)}%). Ready for harder challenges?`;
    } else if (improvement > 5) {
      return "Great improvement! Keep this momentum.";
    } else if (improvement > 0) {
      return "Good! You're making progress.";
    } else {
      return "You got this right! Consistency builds mastery.";
    }
  }

  /**
   * Calculate expected test score based on mastery
   */
  predictTestScore(masteryPercentages: Record<string, number>): {
    expectedScore: number;
    scoreRange: [number, number];
    confidence: number;
  } {
    const masteryValues = Object.values(masteryPercentages);
    const avgMastery =
      masteryValues.length > 0
        ? masteryValues.reduce((a, b) => a + b, 0) / masteryValues.length
        : 0;

    // Expected score correlates strongly with mastery
    const expectedScore = avgMastery * 0.95; // 95% of mastery transfers to test

    // Range: ±15%
    const range: [number, number] = [
      Math.max(0, expectedScore - 15),
      Math.min(100, expectedScore + 15),
    ];

    // Confidence is higher with more consistent mastery
    const variance =
      masteryValues.length > 0
        ? masteryValues.reduce(
            (sum, m) => sum + Math.pow(m - avgMastery, 2),
            0
          ) / masteryValues.length
        : 0;

    const confidence = Math.max(0.5, 1 - Math.sqrt(variance) / 100);

    return {
      expectedScore: Math.round(expectedScore),
      scoreRange: [Math.round(range[0]), Math.round(range[1])],
      confidence: Math.round(confidence * 100),
    };
  }

  /**
   * Generate personalized study recommendation
   */
  recommendStudyFocus(
    masteryPercentages: Record<string, number>,
    topicImportance: Record<string, number> // 1-5 scale
  ): {
    focus: string;
    reason: string;
    estimatedImprovementHours: number;
    expectedScoreIncrease: number;
  } {
    // Find weakest important topic
    const topics = Object.entries(masteryPercentages)
      .map(([topic, mastery]) => ({
        topic,
        mastery,
        importance: topicImportance[topic] || 3,
        priority: (100 - mastery) * (topicImportance[topic] || 3),
      }))
      .sort((a, b) => b.priority - a.priority);

    const focus = topics[0]?.topic || "General Review";
    const focusData = topics[0];

    if (!focusData) {
      return {
        focus: "General Review",
        reason: "No data available",
        estimatedImprovementHours: 5,
        expectedScoreIncrease: 5,
      };
    }

    // Estimate improvement potential
    const improvementPotential = 100 - focusData.mastery;
    const hoursPerPoint = improvementPotential > 30 ? 0.5 : 0.3;
    const estimatedHours = Math.round(improvementPotential * hoursPerPoint);

    return {
      focus,
      reason: `Low mastery (${focusData.mastery.toFixed(0)}%) in important topic (priority ${focusData.importance}/5)`,
      estimatedImprovementHours: estimatedHours,
      expectedScoreIncrease: Math.round(improvementPotential * 0.6),
    };
  }
}

/**
 * Initialize adaptive engine
 */
export function initializeAdaptiveEngine(): AdaptiveEngine {
  return new AdaptiveEngine();
}
