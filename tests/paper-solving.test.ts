/**
 * Past-paper solving contract.
 *
 * A student revises directly from these solutions, so the dangerous failures
 * are a confidently wrong answer and a silently dropped question. Confidence
 * defaults to "low" when unstated, and a solution missing its question or
 * answer is discarded rather than shown.
 */

import { describe, expect, it } from "vitest";
import {
  parseSolvedPaper,
  lowConfidenceQuestions,
  classifyType,
  rubricBalances,
  sumRubricMarks,
  findMissingNumbers,
  MAX_QUESTIONS_PER_PAPER,
} from "@/lib/paper-solving";

const SOURCES = [{ title: "Example", uri: "https://example.com" }];

const mcq = {
  number: "1",
  type: "mcq",
  question: "SI unit of current?",
  marks: 1,
  answer: "b) Ampere",
  explanation: "The ampere is the SI base unit of current.",
  confidence: "high",
};

const written = {
  number: "2a",
  type: "written",
  question: "Explain 3NF.",
  marks: 5,
  answer: "A relation is in 3NF when ...",
  explanation: "Examiners expect the transitive dependency point.",
  rubric: ["2 marks - states 2NF is required", "3 marks - explains transitive dependency"],
  confidence: "medium",
};

describe("parseSolvedPaper", () => {
  it("parses mcq and written solutions", () => {
    const paper = parseSolvedPaper(JSON.stringify([mcq, written]), SOURCES);
    expect(paper.questions).toHaveLength(2);
    expect(paper.questions[0].type).toBe("mcq");
    expect(paper.questions[1].rubric).toHaveLength(2);
    expect(paper.grounded).toBe(true);
  });

  it("marks the paper ungrounded when nothing was consulted", () => {
    const paper = parseSolvedPaper(JSON.stringify([mcq]), []);
    expect(paper.grounded).toBe(false);
  });

  it("defaults confidence to low rather than assuming the answer is right", () => {
    const paper = parseSolvedPaper(JSON.stringify([{ ...mcq, confidence: undefined }]), SOURCES);
    expect(paper.questions[0].confidence).toBe("low");
  });

  it("rejects an unrecognised confidence value", () => {
    const paper = parseSolvedPaper(JSON.stringify([{ ...mcq, confidence: "certain" }]), SOURCES);
    expect(paper.questions[0].confidence).toBe("low");
  });

  it("drops a solution with no question or no answer", () => {
    const paper = parseSolvedPaper(
      JSON.stringify([{ ...mcq, answer: "" }, { ...mcq, question: "" }, written]),
      SOURCES
    );
    expect(paper.questions).toHaveLength(1);
    expect(paper.questions[0].number).toBe("2a");
  });

  it("strips a rubric from an mcq, where it is meaningless", () => {
    const paper = parseSolvedPaper(
      JSON.stringify([{ ...mcq, rubric: ["1 mark - picks the right option"] }]),
      SOURCES
    );
    expect(paper.questions[0].rubric).toEqual([]);
  });

  it("treats absent or invalid marks as unknown rather than zero", () => {
    const paper = parseSolvedPaper(
      JSON.stringify([{ ...mcq, marks: null }, { ...written, number: "3", marks: "five" }]),
      SOURCES
    );
    expect(paper.questions[0].marks).toBeNull();
    expect(paper.questions[1].marks).toBeNull();
  });

  it("numbers a question that arrived without one", () => {
    const paper = parseSolvedPaper(JSON.stringify([{ ...mcq, number: "" }]), SOURCES);
    expect(paper.questions[0].number).toBe("1");
  });

  it("salvages solutions from a truncated response", () => {
    // Long papers routinely truncate; losing the whole paper would waste a
    // paid call and the student's upload.
    const truncated = "[" + JSON.stringify(mcq) + "," + JSON.stringify(written).slice(0, 30);
    expect(parseSolvedPaper(truncated, SOURCES).questions).toHaveLength(1);
  });

  it("caps a very long paper", () => {
    const many = Array.from({ length: MAX_QUESTIONS_PER_PAPER + 10 }, (_, i) => ({
      ...mcq,
      number: String(i + 1),
    }));
    expect(parseSolvedPaper(JSON.stringify(many), SOURCES).questions).toHaveLength(
      MAX_QUESTIONS_PER_PAPER
    );
  });

  it("throws when nothing readable came back", () => {
    expect(() => parseSolvedPaper("I could not read that paper.", SOURCES)).toThrow();
    expect(() => parseSolvedPaper(JSON.stringify([{ question: "", answer: "" }]), SOURCES)).toThrow();
  });
});

describe("lowConfidenceQuestions", () => {
  it("surfaces exactly the answers a student should double-check", () => {
    const paper = parseSolvedPaper(
      JSON.stringify([mcq, { ...written, confidence: "low" }, { ...mcq, number: "3", confidence: "low" }]),
      SOURCES
    );
    expect(lowConfidenceQuestions(paper).map((q) => q.number)).toEqual(["2a", "3"]);
  });
});

describe("classifyType", () => {
  it("trusts an explicit written label", () => {
    expect(classifyType("written", "Explain 3NF.", "A relation is...")).toBe("written");
  });

  it("recognises a real multiple-choice question by its options", () => {
    expect(
      classifyType("mcq", "SI unit of current? a) Volt b) Ampere c) Ohm d) Watt", "b) Ampere")
    ).toBe("mcq");
  });

  it("recognises an mcq from a short option-naming answer", () => {
    expect(classifyType("mcq", "Which normal form removes transitive dependency?", "c) 3NF")).toBe("mcq");
  });

  it("overrides a wrong mcq label on a high-mark descriptive question", () => {
    // Observed on a real Purbanchal paper: an 8-mark ACID question came back
    // labelled "mcq", which silently stripped its mark breakdown.
    expect(
      classifyType("mcq", "Explain the ACID properties with one example each.", "ACID stands for...")
    ).toBe("written");
  });

  it("overrides a wrong mcq label when a rubric is present", () => {
    expect(
      classifyType("mcq", "Define a primary key.", "A primary key is...")
    ).toBe("written");
  });

  it("overrides a wrong mcq label on a long answer", () => {
    expect(classifyType("mcq", "Describe K-maps.", "A".repeat(400))).toBe("written");
  });

  it("does not mistake an answer starting with the article A for option (a)", () => {
    // "A primary key is..." is a definition, not option (a).
    expect(classifyType("mcq", "Define a primary key.", "A primary key is a column...")).toBe(
      "written"
    );
  });

  it("treats a semester paper as entirely written, no guessing", () => {
    // Purbanchal semester exams have no multiple-choice questions at all.
    expect(
      classifyType("mcq", "a) Volt b) Ampere c) Ohm", "b) Ampere", "semester")
    ).toBe("written");
  });

  it("defaults to written when there is no evidence of options", () => {
    // Requiring positive evidence for mcq is the safe bias: a needless rubric
    // is harmless, a stripped one hides where 8 marks went.
    expect(classifyType("mcq", "State the SI unit of current.", "Ampere")).toBe("written");
  });
});

describe("rubric arithmetic on solved papers", () => {
  it("sums the leading mark value of each criterion", () => {
    expect(sumRubricMarks(["4 marks - distinction", "2 marks - part (a)", "0.5 marks - note"])).toBe(6.5);
  });

  it("ignores a criterion with no leading number", () => {
    expect(sumRubricMarks(["explains the concept", "3 marks - worked example"])).toBe(3);
  });

  it("accepts a breakdown that accounts for every mark", () => {
    expect(
      rubricBalances(
        ["4 marks - distinction", "2 marks - (a)", "2 marks - (b)", "2 marks - (c)", "2 marks - (d)"],
        12
      )
    ).toBe(true);
  });

  it("rejects a breakdown that leaves marks unaccounted for", () => {
    // 3+2+2+2+2 = 11 on a 12-mark question: a student following it could
    // never plan a full-marks answer.
    expect(
      rubricBalances(
        ["3 marks - distinction", "2 marks - (a)", "2 marks - (b)", "2 marks - (c)", "2 marks - (d)"],
        12
      )
    ).toBe(false);
  });

  it("treats an absent rubric or unknown marks as nothing to check", () => {
    expect(rubricBalances([], 12)).toBe(true);
    expect(rubricBalances(["4 marks - x"], null)).toBe(true);
  });

  it("flags an unbalanced rubric on the parsed question rather than dropping it", () => {
    const paper = parseSolvedPaper(
      JSON.stringify([
        {
          number: "1",
          type: "written",
          question: "Explain FOPL.",
          marks: 12,
          answer: "Predicate logic breaks propositions into objects...",
          rubric: ["3 marks - distinction", "2 marks - (a)", "2 marks - (b)"],
          confidence: "high",
        },
      ]),
      [],
      "semester"
    );
    expect(paper.questions[0].rubric).toHaveLength(3);
    expect(paper.questions[0].rubricBalanced).toBe(false);
  });

  it("marks a correct breakdown as balanced", () => {
    const paper = parseSolvedPaper(
      JSON.stringify([
        {
          number: "1",
          type: "written",
          question: "Explain FOPL.",
          marks: 8,
          answer: "Predicate logic...",
          rubric: ["4 marks - definition", "4 marks - example"],
          confidence: "high",
        },
      ]),
      [],
      "semester"
    );
    expect(paper.questions[0].rubricBalanced).toBe(true);
  });
});

describe("paper header and group structure", () => {
  const wrapper = {
    meta: {
      university: "PURBANCHAL UNIVERSITY",
      programme: "Bachelor in Information Technology (B.I.T.)/Second Semester/Final",
      subjectCode: "BIT173CO",
      subjectName: "Digital Logic",
      year: "2021",
      fullMarks: "80",
      passMarks: "32",
      timeAllowed: "03:00 hrs.",
      instructions: ["Candidates are required to give their answers in their own words."],
    },
    questions: [
      {
        number: "1",
        group: "Group A",
        groupInstruction: "Answer TWO questions.",
        groupMarks: "2x12=24",
        type: "written",
        question: "Design the 4 bit Synchronous up-down counter.",
        marks: 12,
        answer: "A 4-bit synchronous up-down counter...",
        rubric: ["6 marks - design", "6 marks - timing diagram"],
        confidence: "high",
      },
    ],
  };

  it("reads the printed header block", () => {
    const paper = parseSolvedPaper(JSON.stringify(wrapper), [], "semester");
    expect(paper.meta.university).toBe("PURBANCHAL UNIVERSITY");
    expect(paper.meta.subjectCode).toBe("BIT173CO");
    expect(paper.meta.fullMarks).toBe("80");
    expect(paper.meta.instructions).toHaveLength(1);
  });

  it("keeps the group heading and its marks line on each question", () => {
    const paper = parseSolvedPaper(JSON.stringify(wrapper), [], "semester");
    expect(paper.questions[0].group).toBe("Group A");
    expect(paper.questions[0].groupInstruction).toBe("Answer TWO questions.");
    expect(paper.questions[0].groupMarks).toBe("2x12=24");
  });

  it("still accepts a bare array from older or salvaged output", () => {
    const paper = parseSolvedPaper(JSON.stringify(wrapper.questions), [], "semester");
    expect(paper.questions).toHaveLength(1);
    expect(paper.meta.university).toBe("");
  });

  it("tolerates a missing meta block", () => {
    const paper = parseSolvedPaper(JSON.stringify({ questions: wrapper.questions }), [], "semester");
    expect(paper.meta.subjectName).toBe("");
    expect(paper.questions).toHaveLength(1);
  });
});

describe("truncated wrapper recovery", () => {
  const truncated =
    '{"meta":{"university":"PURBANCHAL UNIVERSITY","subjectCode":"BIT173CO","subjectName":"Digital Logic","fullMarks":"80","instructions":["Answer in your own words."]},' +
    '"questions":[' +
    JSON.stringify({
      number: "1",
      group: "Group A",
      groupInstruction: "Answer TWO questions.",
      groupMarks: "2x12=24",
      type: "written",
      question: "Design a 4-bit counter.",
      marks: 12,
      answer: "A synchronous counter uses a common clock...",
      rubric: ["6 marks - design", "6 marks - timing"],
      confidence: "high",
    }) +
    ',{"number":"2","group":"Group A","type":"written","question":"What is a master slave flip-flop","answer":"It is bui';

  it("still recovers the header when the object is cut short", () => {
    const paper = parseSolvedPaper(truncated, [], "semester");
    expect(paper.meta.university).toBe("PURBANCHAL UNIVERSITY");
    expect(paper.meta.subjectCode).toBe("BIT173CO");
  });

  it("keeps the complete questions and drops the half-written one", () => {
    const paper = parseSolvedPaper(truncated, [], "semester");
    expect(paper.questions).toHaveLength(1);
    expect(paper.questions[0].number).toBe("1");
    expect(paper.questions[0].group).toBe("Group A");
  });

  it("never reports instruction lines as questions", () => {
    // The old fallback regex could match the "instructions" array instead of
    // "questions", turning header text into questions.
    const paper = parseSolvedPaper(truncated, [], "semester");
    for (const q of paper.questions) {
      expect(q.question).not.toContain("Answer in your own words");
    }
  });
});

describe("findMissingNumbers", () => {
  const q = (number: string) => ({ number }) as any;

  it("spots gaps in the middle of a paper", () => {
    // Observed live: an 11-question paper came back with 4, 5 and 7 absent.
    expect(findMissingNumbers([q("1"), q("2"), q("3"), q("6"), q("8")])).toEqual(["4", "5", "7"]);
  });

  it("reports nothing for a complete paper", () => {
    expect(findMissingNumbers([q("1"), q("2"), q("3")])).toEqual([]);
  });

  it("treats sub-parts as covered by their parent number", () => {
    expect(findMissingNumbers([q("1"), q("2a"), q("2b"), q("3")])).toEqual([]);
  });

  it("does not invent gaps for a paper that starts at 4", () => {
    expect(findMissingNumbers([q("4"), q("5"), q("6")])).toEqual([]);
  });

  it("copes with no numeric labels at all", () => {
    expect(findMissingNumbers([q("a"), q("b")])).toEqual([]);
    expect(findMissingNumbers([])).toEqual([]);
  });

  it("is reported on the parsed paper", () => {
    const paper = parseSolvedPaper(
      JSON.stringify([
        { number: "1", type: "written", question: "Q1", marks: 8, answer: "A1", confidence: "high" },
        { number: "3", type: "written", question: "Q3", marks: 8, answer: "A3", confidence: "high" },
      ]),
      [],
      "semester"
    );
    expect(paper.missingNumbers).toEqual(["2"]);
  });
});
