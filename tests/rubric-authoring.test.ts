/**
 * Rubric contract.
 *
 * A rubric that does not add up to the marks on offer is worse than none: a
 * student following it either cannot reach full marks or can exceed them. The
 * balance check and the stored-format round trip are the two things that must
 * hold.
 */

import { describe, expect, it } from "vitest";
import {
  parseRubric,
  rubricBalances,
  rubricSum,
  formatRubric,
  parseStoredRubric,
} from "@/lib/rubric-authoring";

describe("parseRubric", () => {
  it("parses criteria and keeps the marks on offer", () => {
    const r = parseRubric('[{"marks":4,"criterion":"defines an intelligent agent"},{"marks":4,"criterion":"distinguishes performance from rationality"}]', 8);
    expect(r.criteria).toHaveLength(2);
    expect(r.totalMarks).toBe(8);
    expect(rubricSum(r)).toBe(8);
  });

  it("accepts half marks", () => {
    const r = parseRubric('[{"marks":0.5,"criterion":"states the definition"},{"marks":1.5,"criterion":"gives an example"}]', 2);
    expect(rubricBalances(r)).toBe(true);
  });

  it("drops criteria an examiner could not apply", () => {
    const r = parseRubric(
      '[{"marks":0,"criterion":"zero"},{"marks":-2,"criterion":"negative"},{"marks":1.3,"criterion":"third of a mark"},{"marks":8,"criterion":"valid"}]',
      8
    );
    expect(r.criteria).toHaveLength(1);
    expect(r.criteria[0].criterion).toBe("valid");
  });

  it("tolerates fences around the array", () => {
    const r = parseRubric('```json\n[{"marks":6,"criterion":"explains deadlock"}]\n```', 6);
    expect(r.criteria).toHaveLength(1);
  });

  it("throws when nothing usable comes back", () => {
    expect(() => parseRubric("I cannot write a rubric.", 8)).toThrow();
    expect(() => parseRubric('[{"marks":0,"criterion":""}]', 8)).toThrow();
  });
});

describe("rubricBalances", () => {
  const make = (marks: number[], total: number) => ({
    criteria: marks.map((m, i) => ({ marks: m, criterion: `c${i}` })),
    totalMarks: total,
  });

  it("passes when criteria sum to the marks available", () => {
    expect(rubricBalances(make([4, 4], 8))).toBe(true);
    expect(rubricBalances(make([2.5, 2.5, 5], 10))).toBe(true);
  });

  it("fails when the rubric under- or over-shoots", () => {
    // A student following this could never reach 8.
    expect(rubricBalances(make([3, 4], 8))).toBe(false);
    expect(rubricBalances(make([5, 5], 8))).toBe(false);
  });

  it("is not defeated by floating-point drift on half marks", () => {
    expect(rubricBalances(make([0.5, 0.5, 0.5, 0.5, 0.5, 0.5], 3))).toBe(true);
  });
});

describe("stored format round trip", () => {
  it("formats criteria the way the grader and UI expect", () => {
    const text = formatRubric({
      criteria: [
        { marks: 1, criterion: "defines the term" },
        { marks: 4, criterion: "gives a worked example" },
      ],
      totalMarks: 5,
    });
    expect(text).toBe("1 mark - defines the term\n4 marks - gives a worked example");
  });

  it("reads back what it wrote", () => {
    const original = {
      criteria: [
        { marks: 2, criterion: "states the definition" },
        { marks: 0.5, criterion: "notes the complexity" },
      ],
      totalMarks: 2.5,
    };
    expect(parseStoredRubric(formatRubric(original))).toEqual(original.criteria);
  });

  it("ignores lines that are not criteria", () => {
    expect(parseStoredRubric("some heading\n2 marks - does the thing\n\nnot a criterion")).toEqual([
      { marks: 2, criterion: "does the thing" },
    ]);
  });

  it("returns nothing for empty input", () => {
    expect(parseStoredRubric("")).toEqual([]);
    expect(parseStoredRubric("   ")).toEqual([]);
  });
});
