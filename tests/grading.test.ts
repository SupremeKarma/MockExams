/**
 * Written-answer grading tests.
 *
 * The offline cases run everywhere. The live case only runs when
 * GEMINI_API_KEY is set (read from .env.local), because its real job is to
 * catch the model drifting from the JSON contract the UI and the weak-area
 * detector both depend on.
 */

import { readFileSync, existsSync } from "fs";
import { describe, expect, it } from "vitest";
import { gradeWrittenAnswer } from "@/lib/grading";

// vitest does not load .env.local the way Next does.
if (existsSync(".env.local") && !process.env.GEMINI_API_KEY) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const match = /^GEMINI_API_KEY=(.*)$/.exec(line.trim());
    if (match) process.env.GEMINI_API_KEY = match[1].replace(/^["']|["']$/g, "");
  }
}

const apiKey = process.env.GEMINI_API_KEY;

// A 429 from Gemini means the key has no quota or credit left. That's an
// environment problem, not a regression, so the live tests report it and skip
// rather than failing the suite forever.
let quotaExhausted = false;

async function runLive(fn: () => Promise<void>): Promise<void> {
  if (quotaExhausted) return;
  try {
    await fn();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("(429)")) {
      quotaExhausted = true;
      console.warn(`
  [skipped] Gemini quota unavailable: ${message}
`);
      return;
    }
    throw err;
  }
}

const liveIt = apiKey ? it : it.skip;

const QUESTION = {
  question_text: "Explain what a B-tree is and why databases use it for indexing.",
  model_answer:
    "A B-tree is a self-balancing search tree where each node holds multiple keys and has multiple children, keeping all leaves at the same depth. Databases use it because its high branching factor keeps the tree shallow, so a lookup needs very few disk reads, and it stays balanced under inserts and deletes.",
  full_marks: 5,
};

describe("gradeWrittenAnswer (offline)", () => {
  it("scores a blank answer zero without calling the model", async () => {
    const result = await gradeWrittenAnswer("unused-key", {
      ...QUESTION,
      student_answer: "   ",
    });

    expect(result.marks).toBe(0);
    expect(result.strengths).toEqual([]);
    expect(result.gaps.length).toBeGreaterThan(0);
    expect(result.next_step).toBeTruthy();
  });
});

describe("gradeWrittenAnswer (live model)", () => {
  liveIt("returns the structured contract for a partially correct answer", async () => {
    await runLive(async () => {
    const result = await gradeWrittenAnswer(apiKey!, {
      ...QUESTION,
      student_answer:
        "A B-tree is a balanced tree that keeps data sorted. Databases use it because it makes searching faster than a linked list.",
    });

    // Partial credit: correct on balance and sorting, silent on disk reads
    // and branching factor.
    expect(result.marks).toBeGreaterThan(0);
    expect(result.marks).toBeLessThan(QUESTION.full_marks);

    expect(Array.isArray(result.strengths)).toBe(true);
    expect(Array.isArray(result.gaps)).toBe(true);
    expect(result.gaps.length).toBeGreaterThan(0);
    expect(result.next_step.length).toBeGreaterThan(0);

    // `concepts` is what the weak-area detector consumes downstream, so an
    // empty array here would silently break analytics.
    expect(result.concepts.length).toBeGreaterThan(0);

    for (const text of [...result.strengths, ...result.gaps]) {
      expect(text.length).toBeLessThanOrEqual(200);
    }
    });
  }, 45000);

  liveIt("awards full marks to an answer matching the model answer", async () => {
    await runLive(async () => {
      const result = await gradeWrittenAnswer(apiKey!, {
        ...QUESTION,
        student_answer: QUESTION.model_answer,
      });

      expect(result.marks).toBeGreaterThanOrEqual(QUESTION.full_marks * 0.8);
      expect(result.strengths.length).toBeGreaterThan(0);
    });
  }, 45000);

  liveIt("marks against a rubric when one is supplied", async () => {
    await runLive(async () => {
    const result = await gradeWrittenAnswer(apiKey!, {
      ...QUESTION,
      rubric: [
        "2 marks - defines a B-tree as a self-balancing multi-way search tree",
        "2 marks - explains that a high branching factor minimises disk reads",
        "1 mark - notes that all leaves sit at the same depth",
      ].join("\n"),
      student_answer:
        "A B-tree is a self-balancing multi-way search tree. All of its leaves are at the same depth.",
    });

    // Hits criteria 1 and 3, misses the disk-read criterion worth 2 marks.
    expect(result.marks).toBeGreaterThan(0);
    expect(result.marks).toBeLessThanOrEqual(4);
    expect(result.gaps.length).toBeGreaterThan(0);
    });
  }, 45000);
});
