// Marking rubrics: turning "you got 5/8" into "you lost 3 marks because you
// never explained why rationality differs from performance".
//
// This is the thing students actually ask for — "what answer gets me full
// marks". The `rubric` field already exists on questions and the grader already
// feeds it to the model (see grading.ts), so the only gaps were content and
// display.
//
// A rubric is derived from the question and its model answer, not invented:
// every criterion must correspond to something the model answer actually
// contains, and the marks must add up to the marks on offer.

import { callGemini } from "@/lib/gemini";

export interface RubricCriterion {
  marks: number;
  /** What the student must demonstrate to earn these marks. */
  criterion: string;
}

export interface Rubric {
  criteria: RubricCriterion[];
  totalMarks: number;
}

const RUBRIC_PROMPT = `You write marking rubrics for university exam questions.

You are given a question, the marks available, and the official model answer. Break the marks into criteria an examiner would tick off.

Respond with ONLY a JSON array, no other text and no markdown fences:

[{"marks": <number>, "criterion": "<what the student must demonstrate>"}]

Rules:
- The marks MUST add up to exactly the marks available. This is not negotiable.
- Every criterion must correspond to something actually present in the model answer. Do not invent requirements the model answer does not support.
- Write each criterion as an observable action: "defines X as ...", "gives a worked example of ...", "states the time complexity". Not "understanding of X".
- Split by what the question asks. A question saying "define and explain the difference" has at least a definition criterion and a difference criterion.
- 2 to 6 criteria. Whole or half marks only.
- Keep each criterion under 140 characters.`;

/** Parse and validate the model's reply. Exported so the contract is testable. */
export function parseRubric(raw: string, totalMarks: number): Rubric {
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON array in rubric response");

  const parsed = JSON.parse(match[0]);
  if (!Array.isArray(parsed)) throw new Error("Rubric response was not an array");

  const criteria: RubricCriterion[] = [];
  for (const item of parsed) {
    const marks = Number(item?.marks);
    const criterion =
      typeof item?.criterion === "string" ? item.criterion.trim().replace(/\s+/g, " ").slice(0, 140) : "";

    // Reject non-positive or fractional-beyond-half marks outright: a rubric
    // an examiner cannot apply is worse than none.
    if (!Number.isFinite(marks) || marks <= 0 || Math.round(marks * 2) !== marks * 2) continue;
    if (!criterion) continue;

    criteria.push({ marks, criterion });
    if (criteria.length >= 6) break;
  }

  if (criteria.length === 0) throw new Error("No usable criteria in rubric response");

  return { criteria, totalMarks };
}

export function rubricSum(rubric: Rubric): number {
  return rubric.criteria.reduce((total, c) => total + c.marks, 0);
}

/**
 * A rubric whose marks do not add up to the marks on offer is broken: a student
 * following it either cannot reach full marks or can exceed them.
 */
export function rubricBalances(rubric: Rubric): boolean {
  // Compare in halves to avoid floating-point drift on 0.5-mark criteria.
  return Math.round(rubricSum(rubric) * 2) === Math.round(rubric.totalMarks * 2);
}

/** Render for storage in the question's `rubric` field and for display. */
export function formatRubric(rubric: Rubric): string {
  return rubric.criteria
    .map((c) => `${c.marks} ${c.marks === 1 ? "mark" : "marks"} - ${c.criterion}`)
    .join("\n");
}

/** Read back a stored rubric string so the UI can show it as a list. */
export function parseStoredRubric(text: string): RubricCriterion[] {
  if (!text?.trim()) return [];
  return text
    .split(/\r?\n/)
    .map((line) => {
      const m = /^\s*([\d.]+)\s*marks?\s*[-–—:]\s*(.+)$/i.exec(line.trim());
      if (!m) return null;
      const marks = Number(m[1]);
      if (!Number.isFinite(marks)) return null;
      return { marks, criterion: m[2].trim() };
    })
    .filter((c): c is RubricCriterion => c !== null);
}

export interface AuthorRubricInput {
  questionText: string;
  modelAnswer: string;
  totalMarks: number;
}

/**
 * Draft a rubric for one question.
 *
 * Retries once when the marks do not balance — the model gets the arithmetic
 * wrong often enough to be worth a second attempt before a human is asked to
 * fix it by hand.
 */
export async function authorRubric(apiKey: string, input: AuthorRubricInput): Promise<Rubric> {
  const first = await authorRubricOnce(apiKey, input, false);
  if (rubricBalances(first)) return first;

  const retry = await authorRubricOnce(apiKey, input, true);
  return rubricBalances(retry) ? retry : first;
}

async function authorRubricOnce(
  apiKey: string,
  input: AuthorRubricInput,
  insist: boolean
): Promise<Rubric> {
  const { questionText, modelAnswer, totalMarks } = input;

  const arithmeticNote = insist
    ? `\n\nYour previous attempt did not add up. The criteria marks MUST sum to exactly ${totalMarks}. Check the arithmetic before answering.`
    : "";

  const raw = await callGemini(
    apiKey,
    RUBRIC_PROMPT,
    [
      {
        role: "user",
        parts: [
          {
            text: `Question: ${questionText}\n\nMarks available: ${totalMarks}\n\nModel answer: ${modelAnswer}${arithmeticNote}`,
          },
        ],
      },
    ],
    800
  );

  return parseRubric(raw, totalMarks);
}
