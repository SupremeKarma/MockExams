/**
 * MockExams: AI Tutoring Engine
 * Claude-powered Socratic method tutor
 * Guides students through problem-solving without giving answers
 */

import Anthropic from "@anthropic-ai/sdk";

export interface TutorContext {
  studentId: string;
  topicId: string;
  questionText: string;
  studentAttempt: string;
  masteryLevel: number; // 0-100%
  previousHints?: string[];
}

export interface TutorResponse {
  type: "hint" | "question" | "encouragement" | "explanation" | "next_step";
  content: string;
  followUp?: string;
  explanationIfNeeded?: string;
}

export class AiTutor {
  private client: Anthropic;

  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.CLAUDE_API_KEY,
    });
  }

  /**
   * Generate Socratic hint based on student's attempt
   * Guides without revealing answer
   */
  async generateHint(context: TutorContext): Promise<TutorResponse> {
    const systemPrompt = `You are an expert Socratic tutor helping students learn through guided discovery.

Your approach:
1. Never give the answer directly
2. Ask probing questions to guide thinking
3. Break down complex problems into smaller steps
4. Acknowledge what they got right
5. Point out where thinking needs adjustment
6. Encourage persistence and deep understanding

Student mastery level: ${context.masteryLevel}%
- 0-20%: Ask very basic guiding questions about fundamentals
- 21-50%: Guide through problem-solving process
- 51-80%: Ask deeper questions to refine understanding
- 81-100%: Challenge with extensions and advanced applications

Respond with ONLY the hint, no meta-commentary.`;

    const userPrompt = `Topic: ${context.topicText}
Question: "${context.questionText}"
Student's attempt: "${context.studentAttempt}"
${context.previousHints ? `Previous hints given: ${context.previousHints.join(" | ")}` : ""}

Generate a Socratic hint that guides them further without spoiling the answer.`;

    const response = await this.client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    return {
      type: "hint",
      content: this.extractText(response.content),
    };
  }

  /**
   * Evaluate student answer and provide feedback
   */
  async evaluateAnswer(context: TutorContext): Promise<TutorResponse> {
    const systemPrompt = `You are an expert tutor evaluating student answers.

Evaluate on:
1. Correctness (is the answer right?)
2. Reasoning (is the logic sound?)
3. Completeness (did they address all parts?)

Respond with:
- What they got right
- What needs improvement
- One guiding question (if answer is incomplete/wrong)
- Encouragement

Be specific and constructive.`;

    const userPrompt = `Question: "${context.questionText}"
Student's answer: "${context.studentAttempt}"

Evaluate this answer and provide constructive feedback with a guiding question if needed.`;

    const response = await this.client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 400,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    return {
      type: "encouragement",
      content: this.extractText(response.content),
    };
  }

  /**
   * Generate follow-up questions to deepen understanding
   */
  async generateFollowUpQuestion(
    context: TutorContext,
    correctAnswer: string
  ): Promise<TutorResponse> {
    const systemPrompt = `You are a tutor creating follow-up questions to deepen understanding.

Create a question that:
1. Builds on the correct answer just given
2. Extends understanding to related concepts
3. Applies the skill to new situations
4. Challenges at the student's level

The question should be clear and achievable.`;

    const userPrompt = `Topic: ${context.topicText}
Original question: "${context.questionText}"
Student's correct answer: "${correctAnswer}"
Student mastery level: ${context.masteryLevel}%

Generate ONE follow-up question to extend their understanding.`;

    const response = await this.client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 250,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    return {
      type: "question",
      content: this.extractText(response.content),
    };
  }

  /**
   * Generate full explanation (when student is stuck or asks for help)
   */
  async generateExplanation(context: TutorContext): Promise<TutorResponse> {
    const systemPrompt = `You are an expert tutor providing a clear explanation.

Structure your explanation:
1. Start with the core concept
2. Explain the reasoning step-by-step
3. Show how it applies to this problem
4. Provide the answer clearly
5. End with a tip for remembering

Be clear, concise, and educational.`;

    const userPrompt = `Topic: ${context.topicText}
Question: "${context.questionText}"
Student's attempt: "${context.studentAttempt}"

Provide a clear explanation of how to solve this problem.`;

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

    const explanation = this.extractText(response.content);

    return {
      type: "explanation",
      content: explanation,
      explanationIfNeeded: explanation,
    };
  }

  /**
   * Generate study recommendations based on performance
   */
  async generateStudyPlan(
    topicId: string,
    masteryPercentages: Record<string, number>,
    previousAttempts: number
  ): Promise<string> {
    const weakAreas = Object.entries(masteryPercentages)
      .filter(([_, mastery]) => mastery < 70)
      .map(([topic, mastery]) => `${topic} (${mastery}%)`)
      .join(", ");

    const userPrompt = `Student mastery levels:
${Object.entries(masteryPercentages)
  .map(([topic, mastery]) => `- ${topic}: ${mastery}%`)
  .join("\n")}

Previous attempts on difficult areas: ${previousAttempts}

Create a personalized study plan that:
1. Prioritizes weak areas
2. Recommends practice types (problems, explanations, visualizations)
3. Suggests study session length and frequency
4. Recommends resources or practice types
5. Sets realistic improvement goals

Be specific and actionable.`;

    const response = await this.client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 600,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    return this.extractText(response.content);
  }

  /**
   * Generate practice problems from topic
   */
  async generatePracticeProblem(
    topicId: string,
    difficulty: "easy" | "medium" | "hard",
    previousProblems?: string[]
  ): Promise<{
    problem: string;
    hints: string[];
    correctAnswer: string;
  }> {
    const difficultyGuidance = {
      easy: "Basic application of core concepts",
      medium: "Combine multiple concepts, requires problem-solving",
      hard: "Complex scenario requiring deep understanding and creativity",
    };

    const userPrompt = `Topic ID: ${topicId}
Difficulty: ${difficulty} - ${difficultyGuidance[difficulty]}
${previousProblems ? `Avoid these topics: ${previousProblems.join(", ")}` : ""}

Generate a practice problem that:
1. Is clearly stated and unambiguous
2. Has a single correct answer
3. Requires thinking (not just memorization)
4. Is appropriate for the difficulty level
5. Tests understanding, not trivia

Respond in JSON format:
{
  "problem": "Clear problem statement",
  "hint1": "First hint (Socratic, not revealing)",
  "hint2": "Second hint (more direct)",
  "hint3": "Third hint (very direct)",
  "answer": "Correct answer with brief explanation"
}`;

    const response = await this.client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    try {
      const content = this.extractText(response.content);
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          problem: parsed.problem,
          hints: [parsed.hint1, parsed.hint2, parsed.hint3],
          correctAnswer: parsed.answer,
        };
      }
    } catch (error) {
      console.error("Error parsing problem JSON:", error);
    }

    return {
      problem: "Unable to generate problem",
      hints: ["Try again"],
      correctAnswer: "N/A",
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
 * Initialize AI Tutor
 */
export function initializeAiTutor(): AiTutor {
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    throw new Error("CLAUDE_API_KEY environment variable not set");
  }

  return new AiTutor(apiKey);
}
