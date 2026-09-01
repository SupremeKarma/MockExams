// Solving an uploaded past paper.
//
// A student uploads their college's question paper — PDF, photo of a printed
// sheet, or pasted text — and gets back worked solutions: the answer, why it is
// the answer, and for written questions how the marks divide up.
//
// Design decisions worth knowing:
//
//  * **Solutions are grounded.** Search is on, and sources are recorded, because
//    a confidently wrong solution to a real past paper is the worst possible
//    output here — the student revises from it and loses the marks twice.
//
//  * **Solved papers are private to the uploader.** They are that student's
//    copy of their own college's paper. Nothing is added to the shared question
//    bank automatically; staff promote a paper deliberately, after review.
//
//  * **Confidence is reported, not hidden.** Where the model is unsure of an
//    answer it says so, so the student knows to check with a teacher rather
//    than memorising a guess.

import { callGeminiGrounded, type GeminiPart, type GroundingSource } from "@/lib/gemini";

export type SolvedQuestionType = "mcq" | "written";
/**
 * Purbanchal semester exams are entirely descriptive; entrance exams
 * (IOE, NEB) are multiple-choice. Telling the solver which it is removes all
 * guesswork about question type.
 */
export type PaperType = "semester" | "entrance" | "unknown";
export type Confidence = "high" | "medium" | "low";

/** The header block printed at the top of a real exam paper. */
export interface PaperMeta {
  university: string;
  programme: string;
  subjectCode: string;
  subjectName: string;
  year: string;
  fullMarks: string;
  passMarks: string;
  timeAllowed: string;
  /** "Candidates are required to give their answers in their own words..." */
  instructions: string[];
}

export interface SolvedQuestion {
  number: string;
  /** "Group A" / "Group B" as printed, so the paper can be rebuilt faithfully. */
  group: string;
  /** "Answer TWO questions." — the instruction under the group heading. */
  groupInstruction: string;
  /** "2x12=24" — the marks line printed to the right of the group heading. */
  groupMarks: string;
  type: SolvedQuestionType;
  question: string;
  marks: number | null;
  /** For MCQs: the option text or letter. For written: the full answer. */
  answer: string;
  explanation: string;
  /** Mark breakdown for written questions, "2 marks - does X" per entry. */
  rubric: string[];
  /**
   * False when the rubric's marks do not add up to the marks on offer. Kept
   * and flagged rather than dropped: a slightly-off breakdown still shows a
   * student where the marks sit, but they should not trust the arithmetic.
   */
  rubricBalanced: boolean;
  confidence: Confidence;
}

export interface SolvedPaper {
  meta: PaperMeta;
  /**
   * Question numbers that appear to be missing from the solutions.
   *
   * A long paper can lose questions two ways: the model skips one, or the
   * response truncates. Either way the student must be told — silently
   * returning 8 of 11 questions is worse than returning none, because it
   * looks complete.
   */
  missingNumbers: string[];
  paperType: PaperType;
  questions: SolvedQuestion[];
  sources: GroundingSource[];
  /** True when the model consulted nothing — treat the solutions as unverified. */
  grounded: boolean;
}

export const MAX_QUESTIONS_PER_PAPER = 40;

const SOLVING_PROMPT = `You are an experienced university examiner. You are given a real past exam question paper. Produce worked solutions a student can revise from.

Search the web for authoritative material where a fact needs checking. Accuracy matters more than speed: a student will memorise what you write.

Respond with ONLY a JSON object, no other text and no markdown fences:

{
  "meta": {
    "university": "<university name as printed>",
    "programme": "<e.g. Bachelor in Information Technology (B.I.T.)/Second Semester/Final>",
    "subjectCode": "<e.g. BIT173CO>",
    "subjectName": "<e.g. Digital Logic>",
    "year": "<year as printed>",
    "fullMarks": "<as printed>",
    "passMarks": "<as printed>",
    "timeAllowed": "<as printed>",
    "instructions": ["<each instruction line printed under the header>"]
  },
  "questions": [
  {
    "number": "<question number as printed, e.g. 1, 2a, 5(ii)>",
    "group": "<the group heading this question sits under, e.g. Group A. Empty string if the paper has no groups>",
    "groupInstruction": "<the instruction under that heading, e.g. Answer TWO questions.>",
    "groupMarks": "<the marks line beside that heading, e.g. 2x12=24>",
    "type": "mcq" | "written",
    "question": "<the question as printed, cleaned up>",
    "marks": <marks if printed on the paper, otherwise null>,
    "answer": "<for mcq: the correct option and its text. for written: the full answer an examiner would accept>",
    "explanation": "<why this is the answer, and for mcq why the tempting wrong options are wrong>",
    "rubric": ["<for written questions only: '2 marks - states the definition' style entries that sum to the marks>"],
    "confidence": "high" | "medium" | "low"
  }
  ]
}

Rules:
- Copy the header block and group headings EXACTLY as printed. They are used to reproduce the paper.
- Repeat "group", "groupInstruction" and "groupMarks" on every question in that group.
- Solve EVERY question on the paper, in the order printed. Do not skip or summarise.
- Write answers at the length the marks justify: a 2-mark question does not need three paragraphs.
- For a written question, "rubric" entries must sum to that question's marks. Omit rubric entirely for MCQs.
- Set "confidence" honestly. Use "low" when the paper is unclear, the question is ambiguous, or you could not verify the answer. Never guess with high confidence.
- If part of the paper is unreadable, still emit the question with whatever text you can read and confidence "low".
- Plain text only. No markdown, no LaTeX delimiters.`;

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, max);
}

const CONFIDENCE: Confidence[] = ["high", "medium", "low"];

/**
 * Decide whether a solution is an MCQ or a descriptive answer.
 *
 * The model's own label is unreliable — on a real Purbanchal past paper it
 * tagged two 5- and 8-mark descriptive questions as "mcq", which silently
 * stripped their mark breakdowns. Defaulting to "mcq" was the wrong bias:
 * a missing rubric is a worse failure than an unnecessary one, so anything
 * that does not look like a multiple-choice question is treated as written.
 */
export function classifyType(
  declared: unknown,
  question: string,
  answer: string,
  paperType: PaperType = "unknown"
): SolvedQuestionType {
  // Purbanchal semester papers are entirely descriptive — there are no
  // multiple-choice questions to find, so no guessing is needed.
  if (paperType === "semester") return "written";
  if (declared === "written") return "written";

  // Everywhere else, "mcq" requires positive evidence: printed lettered
  // options, or a short answer that names one. The model mislabels
  // descriptive questions as "mcq" often enough that trusting its word
  // silently strips mark breakdowns off 8-mark answers.
  const hasOptions = /(^|\s)\(?[a-d]\)\s*\S/i.test(question);
  // The marker must be a real marker — "b)" or "(c." — not a bare letter and
  // a space, or every definition starting "A primary key is..." reads as (a).
  const answerNamesOption = /^\(?[a-d][).]/i.test(answer.trim()) && answer.trim().length < 120;

  return hasOptions || answerNamesOption ? "mcq" : "written";
}

/** Sum the leading mark values in a rubric, e.g. "2 marks - defines X" -> 2. */
export function sumRubricMarks(rubric: string[]): number {
  return rubric.reduce((total, line) => {
    const match = /^\s*([\d.]+)/.exec(line);
    const value = match ? Number(match[1]) : 0;
    return total + (Number.isFinite(value) ? value : 0);
  }, 0);
}

/**
 * Does the breakdown account for exactly the marks on offer?
 *
 * Paper solving originally skipped this check while rubric authoring enforced
 * it — so a student could be shown a 12-mark question whose criteria summed to
 * 11 and quietly plan an answer that could never score full marks.
 */
export function rubricBalances(rubric: string[], marks: number | null): boolean {
  if (rubric.length === 0 || marks === null) return true;
  // Compare in halves so 0.5-mark criteria do not drift.
  return Math.round(sumRubricMarks(rubric) * 2) === Math.round(marks * 2);
}

/** Parse and sanitise the model's reply. Exported so the contract is testable. */
/** Index of the brace closing the one at `open`, or -1 if the text ends first. */
function matchingBrace(text: string, open: number): number {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = open; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

const EMPTY_META: PaperMeta = {
  university: "",
  programme: "",
  subjectCode: "",
  subjectName: "",
  year: "",
  fullMarks: "",
  passMarks: "",
  timeAllowed: "",
  instructions: [],
};

function parseMeta(value: any): PaperMeta {
  if (!value || typeof value !== "object") return EMPTY_META;
  return {
    university: clean(value.university, 120),
    programme: clean(value.programme, 200),
    subjectCode: clean(value.subjectCode, 40),
    subjectName: clean(value.subjectName, 120),
    year: clean(value.year, 20),
    fullMarks: clean(value.fullMarks, 20),
    passMarks: clean(value.passMarks, 20),
    timeAllowed: clean(value.timeAllowed, 40),
    instructions: Array.isArray(value.instructions)
      ? value.instructions.map((i: unknown) => clean(i, 300)).filter(Boolean).slice(0, 6)
      : [],
  };
}

export function parseSolvedPaper(
  raw: string,
  sources: GroundingSource[],
  paperType: PaperType = "unknown"
): SolvedPaper {
  // The response is an object now, but older callers and salvaged output may
  // still be a bare array of questions.
  let meta = EMPTY_META;
  const objectMatch = raw.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      const wrapper = JSON.parse(objectMatch[0]);
      if (wrapper && !Array.isArray(wrapper) && Array.isArray(wrapper.questions)) {
        meta = parseMeta(wrapper.meta);
        raw = JSON.stringify(wrapper.questions);
      }
    } catch {
      // Truncated wrapper — a full paper's solutions routinely run past the
      // token budget. Recover the meta block on its own, then narrow `raw` to
      // the questions array so the salvage below cannot latch onto the
      // "instructions" array instead and report instruction strings as
      // questions.
      const metaStart = raw.indexOf('"meta"');
      if (metaStart !== -1) {
        const metaOpen = raw.indexOf("{", metaStart);
        const metaClose = metaOpen === -1 ? -1 : matchingBrace(raw, metaOpen);
        if (metaClose !== -1) {
          try {
            meta = parseMeta(JSON.parse(raw.slice(metaOpen, metaClose + 1)));
          } catch {
            // Leave meta empty; the questions still matter more.
          }
        }
      }

      const questionsKey = raw.indexOf('"questions"');
      if (questionsKey !== -1) {
        const arrayStart = raw.indexOf("[", questionsKey);
        if (arrayStart !== -1) raw = raw.slice(arrayStart);
      }
    }
  }

  const open = raw.indexOf("[");
  const closed = raw.match(/\[[\s\S]*\]/);
  const body = closed ? closed[0] : open === -1 ? null : raw.slice(open);
  if (body === null) throw new Error("No JSON array in solving response");

  let parsed: any[];
  try {
    const direct = JSON.parse(body);
    if (!Array.isArray(direct)) throw new Error("Solving response was not an array");
    parsed = direct;
  } catch (err) {
    if (err instanceof Error && err.message === "Solving response was not an array") throw err;
    // A long paper often truncates; keep the questions that did come through.
    parsed = salvage(raw.slice(open === -1 ? 0 : open));
    if (parsed.length === 0) throw new Error("No usable solutions in response");
  }

  const questions: SolvedQuestion[] = [];

  for (const item of parsed) {
    const question = clean(item?.question, 1200);
    const answer = clean(item?.answer, 3000);
    // A solution with no question or no answer helps nobody.
    if (!question || !answer) continue;

    const marksValue = Number(item?.marks);
    const marks = Number.isFinite(marksValue) && marksValue > 0 ? marksValue : null;
    const type = classifyType(item?.type, question, answer, paperType);

    // Rubrics belong to written questions; an MCQ rubric is noise.
    const rubric =
      type === "written" && Array.isArray(item?.rubric)
        ? item.rubric.map((r: unknown) => clean(r, 200)).filter(Boolean).slice(0, 8)
        : [];

    questions.push({
      number: clean(item?.number, 12) || String(questions.length + 1),
      type,
      question,
      marks,
      answer,
      explanation: clean(item?.explanation, 2000),
      group: clean(item?.group, 60),
      groupInstruction: clean(item?.groupInstruction, 160),
      groupMarks: clean(item?.groupMarks, 40),
      rubric,
      rubricBalanced: rubricBalances(rubric, marks),
      confidence: CONFIDENCE.includes(item?.confidence) ? item.confidence : "low",
    });

    if (questions.length >= MAX_QUESTIONS_PER_PAPER) break;
  }

  if (questions.length === 0) throw new Error("No questions could be read from that paper");

  return {
    meta,
    missingNumbers: findMissingNumbers(questions),
    paperType,
    questions,
    sources,
    grounded: sources.length > 0,
  };
}

/** Recover intact objects from a truncated or partly corrupted array. */
function salvage(raw: string): any[] {
  const out: any[] = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        try {
          out.push(JSON.parse(raw.slice(start, i + 1)));
        } catch {
          // Skip this one; later objects may still be intact.
        }
        start = -1;
      }
    }
  }
  return out;
}

/**
 * Find gaps in the numbering, e.g. solutions for 1,2,3,6,8 on a paper that
 * clearly ran 1..8 means 4, 5 and 7 went missing.
 *
 * Only whole-number question labels are considered; sub-parts like "2a" are
 * covered by their parent number.
 */
export function findMissingNumbers(questions: SolvedQuestion[]): string[] {
  const seen = new Set<number>();
  for (const q of questions) {
    const match = /^(\d+)/.exec(q.number);
    if (match) seen.add(Number(match[1]));
  }
  if (seen.size === 0) return [];

  const numbers = [...seen].sort((a, b) => a - b);
  const first = numbers[0];
  const last = numbers[numbers.length - 1];

  const missing: string[] = [];
  for (let n = first; n <= last; n++) {
    if (!seen.has(n)) missing.push(String(n));
  }
  return missing;
}

/** Questions a student should check with a teacher before trusting. */
export function lowConfidenceQuestions(paper: SolvedPaper): SolvedQuestion[] {
  return paper.questions.filter((q) => q.confidence === "low");
}

export async function solvePaper(
  apiKey: string,
  parts: GeminiPart[],
  paperType: PaperType = "unknown"
): Promise<SolvedPaper> {
  const guidance =
    paperType === "semester"
      ? `

This is a university SEMESTER paper. Every question is descriptive — there are no multiple-choice questions. Set "type" to "written" for every question, and always supply a rubric whose marks sum to the marks printed beside that question.`
      : paperType === "entrance"
        ? `

This is an ENTRANCE exam paper. The questions are multiple-choice. Give the correct option and say why the tempting distractors are wrong.`
        : "";

  const { text, sources } = await callGeminiGrounded(
    apiKey,
    SOLVING_PROMPT + guidance,
    [{ role: "user", parts }],
    // A full paper with worked solutions and rubrics needs real room; 8000
    // truncated mid-array on an 11-question paper.
    16000
  );
  return parseSolvedPaper(text, sources, paperType);
}
