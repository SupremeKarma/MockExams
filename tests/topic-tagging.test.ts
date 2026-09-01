/**
 * Topic tagging contract.
 *
 * Tags are grouped to compute mastery, so an inconsistent or mis-mapped label
 * silently distorts a student's weak-area analysis — quieter and harder to
 * catch than a wrong answer.
 */

import { describe, expect, it } from "vitest";
import { parseSuggestions, normaliseTopic, TAGGING_BATCH_SIZE } from "@/lib/topic-tagging";

const batch = [
  { id: "q1", question_text: "What is an AVL rotation?" },
  { id: "q2", question_text: "Define 3NF." },
  { id: "q3", question_text: "What is a pointer?" },
];

describe("normaliseTopic", () => {
  it("trims trailing punctuation and collapses whitespace", () => {
    expect(normaliseTopic("  AVL   Rotations.  ")).toBe("AVL Rotations");
  });

  it("caps the label at four words so tags stay groupable", () => {
    expect(normaliseTopic("One Two Three Four Five Six")).toBe("One Two Three Four");
  });

  it("caps overall length", () => {
    expect(normaliseTopic("A".repeat(200)).length).toBeLessThanOrEqual(60);
  });
});

describe("parseSuggestions", () => {
  it("maps 1-based question numbers onto the right question ids", () => {
    const out = parseSuggestions('[{"n":1,"topic":"AVL Rotations"},{"n":3,"topic":"Pointers"}]', batch);
    expect(out).toEqual([
      { questionId: "q1", suggestedTopic: "AVL Rotations" },
      { questionId: "q3", suggestedTopic: "Pointers" },
    ]);
  });

  it("drops out-of-range indices instead of mis-assigning a tag", () => {
    // Mis-assignment is the dangerous failure: a real question, a wrong topic.
    const out = parseSuggestions('[{"n":0,"topic":"X"},{"n":9,"topic":"Y"},{"n":2,"topic":"3NF"}]', batch);
    expect(out).toEqual([{ questionId: "q2", suggestedTopic: "3NF" }]);
  });

  it("drops entries with a missing or non-string topic", () => {
    expect(parseSuggestions('[{"n":1},{"n":2,"topic":42},{"n":3,"topic":"Pointers"}]', batch)).toEqual([
      { questionId: "q3", suggestedTopic: "Pointers" },
    ]);
  });

  it("tolerates prose or fences around the array", () => {
    const out = parseSuggestions('Sure:\n```json\n[{"n":1,"topic":"AVL Rotations"}]\n```', batch);
    expect(out).toHaveLength(1);
  });

  it("normalises topics as it parses, so grouping is consistent", () => {
    const out = parseSuggestions('[{"n":1,"topic":"  avl rotations.  "}]', batch);
    expect(out[0].suggestedTopic).toBe("avl rotations");
  });

  it("throws when there is no array at all", () => {
    expect(() => parseSuggestions("I cannot label these.", batch)).toThrow();
  });

  it("uses a batch size small enough to stay accurate", () => {
    expect(TAGGING_BATCH_SIZE).toBeGreaterThan(0);
    expect(TAGGING_BATCH_SIZE).toBeLessThanOrEqual(50);
  });
});
