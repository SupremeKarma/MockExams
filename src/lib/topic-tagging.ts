// Suggest topic tags for untagged questions.
//
// Analytics and adaptive practice group by `topic` when it is set and fall
// back to the exam's subject when it is not. With the whole bank untagged,
// everything runs at subject granularity — tagging is the single highest-value
// content change, and this makes it a review-and-approve job instead of
// hand-typing hundreds of labels.
//
// Suggestions are never written automatically: a wrong tag silently distorts a
// student's weak-area analysis, which is harder to notice than a wrong answer.

import { callGemini } from "@/lib/gemini";

export interface TopicSuggestion {
  questionId: string;
  suggestedTopic: string;
}

export interface QuestionForTagging {
  id: string;
  question_text: string;
}

/** Batch size per model call. Large enough to be cheap, small enough to stay accurate. */
export const TAGGING_BATCH_SIZE = 20;

const TAGGING_SYSTEM_PROMPT = `You label exam questions with the specific concept each one tests, so a study platform can detect which concepts a student is weak in.

You will be given a subject and a numbered list of questions. Respond with ONLY a JSON array, no other text and no markdown fences:

[{"n": <the question number>, "topic": "<concept label>"}]

Rules for a good label:
- Name the CONCEPT tested, not the subject. "AVL rotations", not "Data Structures".
- 1 to 4 words. Title case. No trailing punctuation.
- Reuse the exact same label for questions testing the same concept — consistency matters more than precision, because these labels are grouped.
- If a question is too vague to label confidently, use the subject name itself rather than guessing.
- Return one entry for every question number given, in order.`;

/** Normalise so "avl rotations" and "AVL Rotations " group together. */
export function normaliseTopic(raw: string): string {
  return raw
    .trim()
    .replace(/[.,;:]+$/, "")
    .replace(/\s+/g, " ")
    .split(" ")
    .slice(0, 4)
    .join(" ")
    .slice(0, 60);
}

/** Parse the model's reply into suggestions. Exported for testing. */
export function parseSuggestions(raw: string, batch: QuestionForTagging[]): TopicSuggestion[] {
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON array in tagging response");

  const parsed = JSON.parse(match[0]);
  if (!Array.isArray(parsed)) throw new Error("Tagging response was not an array");

  const out: TopicSuggestion[] = [];
  for (const item of parsed) {
    const n = Number(item?.n);
    const topic = typeof item?.topic === "string" ? normaliseTopic(item.topic) : "";
    // n is 1-based and must map onto a question actually sent in this batch.
    if (!Number.isInteger(n) || n < 1 || n > batch.length || !topic) continue;
    out.push({ questionId: batch[n - 1].id, suggestedTopic: topic });
  }
  return out;
}

export async function suggestTopicsForBatch(
  apiKey: string,
  subject: string,
  batch: QuestionForTagging[]
): Promise<TopicSuggestion[]> {
  if (batch.length === 0) return [];

  const listing = batch
    .map((q, i) => `${i + 1}. ${q.question_text.replace(/\s+/g, " ").slice(0, 300)}`)
    .join("\n");

  const raw = await callGemini(
    apiKey,
    TAGGING_SYSTEM_PROMPT,
    [{ role: "user", parts: [{ text: `Subject: ${subject}\n\nQuestions:\n${listing}` }] }],
    2000
  );

  return parseSuggestions(raw, batch);
}
