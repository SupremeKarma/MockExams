// Parses a Telegram-quiz-bot-style plain text block into question objects.
//
// MCQ format (one question per block, blocks separated by a blank line or "---"):
//
//   Q: What is the time complexity of binary search?
//   A) O(n)
//   B) O(log n)
//   C) O(n^2)
//   D) O(1)
//   ANSWER: B
//   EXPLAIN: Binary search halves the search space each iteration.
//   DIFFICULTY: easy
//   MARKS: 1
//
// Written (long-answer) format — mirrors a real university exam question,
// graded by AI against a full model answer instead of an option letter:
//
//   Q: Explain the working of He-Ne laser.
//   TYPE: written
//   MODEL_ANSWER: <the full expected answer, written out in full>
//   MARKS: 4
//
// Only Q/A/B/C/D/ANSWER (MCQ) or Q/TYPE/MODEL_ANSWER (written) are required
// — EXPLAIN, DIFFICULTY, MARKS are optional and fall back to sensible
// defaults. Matching is case-insensitive and tolerant of "A." / "a)" /
// "Answer -" style variations.

export interface ParsedQuestion {
  type: "mcq" | "written";
  question_text: string;
  // MCQ fields (empty strings / "a" for written questions, unused)
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: "a" | "b" | "c" | "d";
  // Written fields (empty string for MCQ)
  model_answer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  marks: number;
  negativeMarks: number;
}

export interface ParsedBlockResult {
  raw: string;
  question: ParsedQuestion | null;
  errors: string[];
}

const OPTION_RE = /^\s*([A-Da-d])[).:-]\s*(.+)$/;
const Q_RE = /^\s*(?:Q(?:uestion)?)\s*[:.)-]\s*(.+)$/i;
const ANSWER_RE = /^\s*(?:ANSWER|CORRECT)\s*[:.)-]\s*([A-Da-d])\b.*$/i;
const TYPE_RE = /^\s*TYPE\s*[:.)-]\s*(mcq|written)\s*$/i;
const MODEL_ANSWER_RE = /^\s*MODEL[\s_]?ANSWER\s*[:.)-]\s*(.*)$/i;
const EXPLAIN_RE = /^\s*(?:EXPLAIN(?:ATION)?)\s*[:.)-]\s*(.*)$/i;
const DIFFICULTY_RE = /^\s*DIFFICULTY\s*[:.)-]\s*(easy|medium|hard)\s*$/i;
const MARKS_RE = /^\s*MARKS\s*[:.)-]\s*([\d.]+)\s*$/i;
const NEGATIVE_RE = /^\s*NEGATIVE(?:\s*MARKS)?\s*[:.)-]\s*([\d.]+)\s*$/i;

function parseBlock(block: string): ParsedBlockResult {
  const lines = block.split("\n").map((l) => l.trimEnd());
  const errors: string[] = [];

  const questionLines: string[] = [];
  const options: Record<string, string> = {};
  let correctLetter: string | null = null;
  const explanationLines: string[] = [];
  const modelAnswerLines: string[] = [];
  let type: ParsedQuestion["type"] = "mcq";
  let difficulty: ParsedQuestion["difficulty"] = "medium";
  let marks = 1;
  let negativeMarks = 0.25;

  let mode: "question" | "explanation" | "model_answer" | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const qMatch = line.match(Q_RE);
    if (qMatch) {
      questionLines.push(qMatch[1]);
      mode = "question";
      continue;
    }

    const optMatch = line.match(OPTION_RE);
    if (optMatch) {
      options[optMatch[1].toLowerCase()] = optMatch[2].trim();
      mode = null;
      continue;
    }

    const ansMatch = line.match(ANSWER_RE);
    if (ansMatch) {
      correctLetter = ansMatch[1].toLowerCase();
      mode = null;
      continue;
    }

    const typeMatch = line.match(TYPE_RE);
    if (typeMatch) {
      type = typeMatch[1].toLowerCase() as ParsedQuestion["type"];
      mode = null;
      continue;
    }

    const modelAnswerMatch = line.match(MODEL_ANSWER_RE);
    if (modelAnswerMatch) {
      modelAnswerLines.push(modelAnswerMatch[1]);
      mode = "model_answer";
      continue;
    }

    const explainMatch = line.match(EXPLAIN_RE);
    if (explainMatch) {
      explanationLines.push(explainMatch[1]);
      mode = "explanation";
      continue;
    }

    const diffMatch = line.match(DIFFICULTY_RE);
    if (diffMatch) {
      difficulty = diffMatch[1].toLowerCase() as ParsedQuestion["difficulty"];
      mode = null;
      continue;
    }

    const marksMatch = line.match(MARKS_RE);
    if (marksMatch) {
      marks = parseFloat(marksMatch[1]);
      mode = null;
      continue;
    }

    const negMatch = line.match(NEGATIVE_RE);
    if (negMatch) {
      negativeMarks = parseFloat(negMatch[1]);
      mode = null;
      continue;
    }

    // Unrecognized line: treat as a continuation of whatever we were last
    // reading (question statement wrapping onto multiple lines, or a
    // multi-line explanation), so authors don't have to cram everything
    // onto one line.
    if (mode === "question") {
      questionLines.push(line);
    } else if (mode === "explanation") {
      explanationLines.push(line);
    } else if (mode === "model_answer") {
      modelAnswerLines.push(line);
    }
  }

  const question_text = questionLines.join(" ").trim();
  const explanation = explanationLines.join(" ").trim();
  const model_answer = modelAnswerLines.join(" ").trim();

  if (!question_text) errors.push("Missing question text (start a line with \"Q:\")");

  if (type === "written") {
    if (!model_answer) errors.push("Written questions need a full reference answer (add \"MODEL_ANSWER: ...\")");
  } else {
    if (!options.a || !options.b || !options.c || !options.d) {
      errors.push("Needs all four options (A)/B)/C)/D))");
    }
    if (!correctLetter) errors.push("Missing correct answer (add \"ANSWER: B\")");
    else if (!options[correctLetter]) errors.push(`ANSWER points to option ${correctLetter.toUpperCase()}, which has no text`);
  }

  if (errors.length > 0) {
    return { raw: block, question: null, errors };
  }

  return {
    raw: block,
    errors: [],
    question: {
      type,
      question_text,
      option_a: options.a ?? "",
      option_b: options.b ?? "",
      option_c: options.c ?? "",
      option_d: options.d ?? "",
      correct_option: (correctLetter as "a" | "b" | "c" | "d") ?? "a",
      model_answer,
      explanation,
      difficulty,
      marks: Number.isFinite(marks) ? marks : 1,
      negativeMarks: Number.isFinite(negativeMarks) ? negativeMarks : 0.25,
    },
  };
}

export function parseBulkQuestions(text: string): ParsedBlockResult[] {
  const normalized = text.replace(/\r\n/g, "\n");
  // Split on blank-line gaps or an explicit "---" divider; a new "Q:" line
  // also implicitly starts a new block even without a blank line before it.
  const roughBlocks = normalized
    .split(/\n\s*\n|\n-{3,}\n/)
    .flatMap((chunk) => {
      const pieces: string[] = [];
      let current: string[] = [];
      for (const line of chunk.split("\n")) {
        if (Q_RE.test(line) && current.some((l) => l.trim())) {
          pieces.push(current.join("\n"));
          current = [line];
        } else {
          current.push(line);
        }
      }
      if (current.some((l) => l.trim())) pieces.push(current.join("\n"));
      return pieces;
    })
    .filter((b) => b.trim().length > 0);

  return roughBlocks.map(parseBlock);
}
