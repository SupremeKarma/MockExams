// Turn study notes into flashcards.
//
// Students paste (or upload) their notes and get back review-ready cards. The
// cards are returned for the student to check before anything is saved —
// extraction is a drafting aid, not an authority, and a wrong card memorised
// is worse than no card at all.

import { callGemini, type GeminiPart } from "@/lib/gemini";

export interface ExtractedCard {
  front: string;
  back: string;
  /** Short concept label, reused as the deck/topic grouping. */
  topic: string;
}

export const MAX_CARDS = 30;

const EXTRACTION_SYSTEM_PROMPT = `You turn a student's study notes into flashcards for spaced repetition.

Respond with ONLY a JSON array, no other text and no markdown fences, in this exact shape:
[
  {"front": "<question or prompt>", "back": "<the answer>", "topic": "<1-3 word concept label>"}
]

Rules for good cards:
- One fact per card. If a note contains three facts, make three cards.
- "front" must be a genuine question or cloze prompt, never a bare heading.
- "back" must be answerable from the notes given. Never invent facts that are not in the source.
- Prefer "Why" and "How" prompts over pure recall where the notes support it.
- Keep "front" under 200 characters and "back" under 400.
- Skip administrative text: page numbers, headers, course codes, timetables.
- If the notes contain nothing worth memorising, return an empty array [].

Produce at most ${MAX_CARDS} cards, choosing the most useful if there are more.`;

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

/** Parse and sanitise the model's reply. Exported so the contract is testable. */
export function parseCards(raw: string): ExtractedCard[] {
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON array in extraction response");

  const parsed = JSON.parse(match[0]);
  if (!Array.isArray(parsed)) throw new Error("Extraction response was not an array");

  const seen = new Set<string>();
  const cards: ExtractedCard[] = [];

  for (const item of parsed) {
    const front = clean(item?.front, 200);
    const back = clean(item?.back, 400);
    if (!front || !back) continue;

    // A duplicate front is a duplicate card in the review queue, which is
    // exactly the thing spaced repetition is supposed to avoid.
    const key = front.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    cards.push({ front, back, topic: clean(item?.topic, 60) || "General" });
    if (cards.length >= MAX_CARDS) break;
  }

  return cards;
}

export async function extractFlashcards(apiKey: string, parts: GeminiPart[]): Promise<ExtractedCard[]> {
  const raw = await callGemini(apiKey, EXTRACTION_SYSTEM_PROMPT, [{ role: "user", parts }], 4000);
  return parseCards(raw);
}
