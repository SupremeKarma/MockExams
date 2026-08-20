/**
 * MockExams: Auto-Grading System
 * Handles MCQ, essay, and code submission grading
 */

import Anthropic from "@anthropic-ai/sdk";

export type QuestionType = "mcq_single" | "mcq_multiple" | "essay" | "code" | "numerical";

export interface GradingResult {
  correct: boolean;
  score: number; // 0-100
  maxScore: number;
  feedback: string;
  explanations?: {
    whyCorrect?: string;
    whyIncorrect?: string;
    commonMistakes?: string;
  };
  timeToGrade: number; // milliseconds
}

export interface AutoGradeRequest {
  questionId: string;
  questionType: QuestionType;
  question: string;
  correctAnswer: string;
  studentAnswer: string;
  options?: string[]; // for MCQ
  correctOptionIds?: string[]; // for MCQ_multiple
  testCases?: { input: string; expectedOutput: string }[]; // for code
}

export class AutoGrader {
  private client: Anthropic;

  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.CLAUDE_API_KEY,
    });
  }

  /**
   * Grade any question type
   */
  async gradeQuestion(request: AutoGradeRequest): Promise<GradingResult> {
    const startTime = Date.now();

    let result: GradingResult;

    switch (request.questionType) {
      case "mcq_single":
        result = this.gradeMcqSingle(request);
        break;
      case "mcq_multiple":
        result = this.gradeMcqMultiple(request);
        break;
      case "essay":
        result = await this.gradeEssay(request);
        break;
      case "code":
        result = await this.gradeCode(request);
        break;
      case "numerical":
        result = this.gradeNumerical(request);
        break;
      default:
        result = {
          correct: false,
          score: 0,
          maxScore: 100,
          feedback: "Unknown question type",
          timeToGrade: 0,
        };
    }

    result.timeToGrade = Date.now() - startTime;
    return result;
  }

  /**
   * Grade single-choice MCQ (instant)
   */
  private gradeMcqSingle(request: AutoGradeRequest): GradingResult {
    const correct =
      request.studentAnswer.toLowerCase().trim() ===
      request.correctAnswer.toLowerCase().trim();

    return {
      correct,
      score: correct ? 100 : 0,
      maxScore: 100,
      feedback: correct
        ? "✓ Correct!"
        : `✗ Incorrect. The correct answer is: ${request.correctAnswer}`,
      explanations: {
        whyCorrect: correct ? `You selected the right option.` : undefined,
        whyIncorrect: !correct ? `You selected a distractor.` : undefined,
      },
      timeToGrade: 0,
    };
  }

  /**
   * Grade multiple-choice MCQ (instant)
   */
  private gradeMcqMultiple(request: AutoGradeRequest): GradingResult {
    const studentSelected = new Set(
      request.studentAnswer.split(",").map((s) => s.toLowerCase().trim())
    );
    const correctSet = new Set(
      (request.correctOptionIds || []).map((s) => s.toLowerCase().trim())
    );

    // Calculate partial credit
    const correctSelectedCount = [...studentSelected].filter((s) =>
      correctSet.has(s)
    ).length;
    const incorrectSelectedCount = [...studentSelected].filter(
      (s) => !correctSet.has(s)
    ).length;
    const missedCorrectCount = correctSet.size - correctSelectedCount;

    const score =
      correctSelectedCount * 50 -
      (incorrectSelectedCount + missedCorrectCount) * 25;
    const finalScore = Math.max(0, score);

    return {
      correct: finalScore === 100,
      score: finalScore,
      maxScore: 100,
      feedback:
        finalScore === 100
          ? "✓ Perfect! All correct options selected."
          : finalScore > 50
            ? "✓ Partial credit. Some options are correct."
            : `✗ Incorrect. Correct answers: ${[...correctSet].join(", ")}`,
      explanations: {
        whyCorrect:
          finalScore === 100
            ? "You selected all and only the correct options."
            : undefined,
        whyIncorrect:
          finalScore < 100
            ? `Missed: ${missedCorrectCount} correct | Selected wrong: ${incorrectSelectedCount}`
            : undefined,
      },
      timeToGrade: 0,
    };
  }

  /**
   * Grade essay using Claude (semantic understanding)
   */
  async gradeEssay(request: AutoGradeRequest): Promise<GradingResult> {
    const rubric = this.generateEssayRubric(request);

    const systemPrompt = `You are an expert essay grader. Grade the student essay on:
${rubric}

Respond in JSON format:
{
  "score": <0-100>,
  "correct": <true if score >= 70>,
  "feedback": "<constructive feedback>",
  "strengths": ["<strength1>", "<strength2>"],
  "improvements": ["<improvement1>", "<improvement2>"],
  "commonMistake": "<what they may have misunderstood>"
}`;

    const userPrompt = `Question: "${request.question}"
Expected answer: "${request.correctAnswer}"
Student answer: "${request.studentAnswer}"

Grade this essay. Be fair but rigorous.`;

    try {
      const response = await this.client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

      const content = this.extractText(response.content);
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const grading = JSON.parse(jsonMatch[0]);
        return {
          correct: grading.correct,
          score: grading.score,
          maxScore: 100,
          feedback: grading.feedback,
          explanations: {
            whyCorrect:
              grading.strengths && grading.strengths.length > 0
                ? grading.strengths.join(" | ")
                : undefined,
            whyIncorrect:
              grading.improvements && grading.improvements.length > 0
                ? grading.improvements.join(" | ")
                : undefined,
            commonMistakes: grading.commonMistake,
          },
          timeToGrade: 0,
        };
      }
    } catch (error) {
      console.error("Error grading essay:", error);
    }

    return {
      correct: false,
      score: 0,
      maxScore: 100,
      feedback: "Could not grade essay. Please try again.",
      timeToGrade: 0,
    };
  }

  /**
   * Grade code submission
   */
  async gradeCode(request: AutoGradeRequest): Promise<GradingResult> {
    // Check syntax first
    const syntaxCheck = this.checkSyntax(request.studentAnswer);
    if (!syntaxCheck.valid) {
      return {
        correct: false,
        score: 0,
        maxScore: 100,
        feedback: `Syntax Error: ${syntaxCheck.error}`,
        timeToGrade: 0,
      };
    }

    // Test execution
    if (request.testCases && request.testCases.length > 0) {
      const testResults = await this.runTests(
        request.studentAnswer,
        request.testCases
      );

      const passedTests = testResults.filter((t) => t.passed).length;
      const score = (passedTests / testResults.length) * 100;

      return {
        correct: score === 100,
        score: Math.round(score),
        maxScore: 100,
        feedback:
          score === 100
            ? "✓ All test cases passed!"
            : `${passedTests}/${testResults.length} test cases passed`,
        explanations: {
          whyIncorrect: testResults
            .filter((t) => !t.passed)
            .map((t) => `Failed: ${t.testCase} → Expected ${t.expected}, got ${t.actual}`)
            .join(" | "),
        },
        timeToGrade: 0,
      };
    }

    // Fallback: AI review
    return await this.reviewCodeQuality(request);
  }

  /**
   * Grade numerical answers (with tolerance)
   */
  private gradeNumerical(request: AutoGradeRequest): GradingResult {
    try {
      const studentNum = parseFloat(request.studentAnswer);
      const correctNum = parseFloat(request.correctAnswer);

      // Allow 1% tolerance
      const tolerance = Math.abs(correctNum) * 0.01;
      const difference = Math.abs(studentNum - correctNum);

      const correct = difference <= tolerance;

      return {
        correct,
        score: correct ? 100 : 0,
        maxScore: 100,
        feedback: correct
          ? `✓ Correct! (${studentNum})`
          : `✗ Incorrect. Your answer: ${studentNum}, Correct: ${correctNum}`,
        timeToGrade: 0,
      };
    } catch (error) {
      return {
        correct: false,
        score: 0,
        maxScore: 100,
        feedback: "Invalid numerical input",
        timeToGrade: 0,
      };
    }
  }

  /**
   * Generate essay grading rubric
   */
  private generateEssayRubric(request: AutoGradeRequest): string {
    return `- Correctness: Does the answer match the expected answer?
- Completeness: Are all key points covered?
- Clarity: Is the explanation clear and well-organized?
- Reasoning: Is the logic sound?
- Detail: Are examples or evidence provided?

Scale: 0-20 per criterion = 0-100 total`;
  }

  /**
   * Check code syntax
   */
  private checkSyntax(code: string): { valid: boolean; error?: string } {
    try {
      // Basic check: can we parse it?
      new Function(code);
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: (error as Error).message.substring(0, 100),
      };
    }
  }

  /**
   * Run test cases against code
   */
  private async runTests(
    code: string,
    testCases: { input: string; expectedOutput: string }[]
  ): Promise<
    { passed: boolean; testCase: string; expected: string; actual: string }[]
  > {
    return testCases.map((tc) => {
      try {
        // Execute code with input
        const fn = new Function("input", code + `\nreturn output;`);
        const actual = String(fn(tc.input));

        return {
          passed: actual === tc.expectedOutput,
          testCase: tc.input,
          expected: tc.expectedOutput,
          actual,
        };
      } catch (error) {
        return {
          passed: false,
          testCase: tc.input,
          expected: tc.expectedOutput,
          actual: `Error: ${(error as Error).message}`,
        };
      }
    });
  }

  /**
   * AI-based code quality review
   */
  private async reviewCodeQuality(request: AutoGradeRequest): Promise<GradingResult> {
    const userPrompt = `Code Quality Review:
Question: "${request.question}"
Student Code:
\`\`\`javascript
${request.studentAnswer}
\`\`\`

Expected Implementation: "${request.correctAnswer}"

Evaluate: Correctness, efficiency, readability, best practices.
Score 0-100.

Respond in JSON: {"score": <number>, "feedback": "<feedback>"}`;

    try {
      const response = await this.client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

      const content = this.extractText(response.content);
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          correct: result.score >= 70,
          score: result.score,
          maxScore: 100,
          feedback: result.feedback,
          timeToGrade: 0,
        };
      }
    } catch (error) {
      console.error("Error reviewing code:", error);
    }

    return {
      correct: false,
      score: 0,
      maxScore: 100,
      feedback: "Could not grade code. Please submit again.",
      timeToGrade: 0,
    };
  }

  /**
   * Extract text from Claude response
   */
  private extractText(content: Anthropic.ContentBlock[]): string {
    return content
      .filter((block) => block.type === "text")
      .map((block) => (block as Anthropic.TextBlock).text)
      .join("\n");
  }
}

/**
 * Initialize auto-grader
 */
export function initializeAutoGrader(): AutoGrader {
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    throw new Error("CLAUDE_API_KEY environment variable not set");
  }

  return new AutoGrader(apiKey);
}
