// Authoring study notes from the official syllabus.
//
// The syllabus in bitSyllabusData.ts is authoritative — 44 subjects verified
// against Purbanchal University's published course documents — but the notes
// that should sit under it are almost empty. This module drafts them.
//
// Two rules shape everything here:
//
//  1. **Grounded, not remembered.** Generation runs with Google Search on and
//     records the sources consulted. A student's marks depend on this being
//     right, so a reviewer has to be able to check every claim. A topic that
//     comes back with no sources is marked ungrounded and held back.
//
//  2. **Written, not copied.** Notes are original prose explaining the syllabus
//     unit, informed by sources and citing them. Reproducing someone else's
//     notes verbatim would be copyright infringement, so the prompt forbids it
//     and `looksCopied` gives the reviewer a second line of defence.
//
// Nothing here publishes. Output is always a draft for human approval.

import { callGeminiGrounded, type GroundingSource } from "@/lib/gemini";

export type Importance = "Very High" | "High" | "Medium" | "Low";
export type NoteStatus = "draft" | "approved";

/** Matches the Topic shape already used by bitNotesData and the notes page. */
export interface AuthoredTopic {
  id: string;
  name: string;
  importance: Importance;
  keyPoints: string[];
  theory: string;
  commonExamQuestions: string[];
  sources: GroundingSource[];
  /** False when the model returned no sources — never publish these as-is. */
  grounded: boolean;
}

export interface AuthoredSubjectNotes {
  code: string;
  subjectName: string;
  semester: number;
  topics: AuthoredTopic[];
}

const IMPORTANCE: Importance[] = ["Very High", "High", "Medium", "Low"];
export const MAX_TOPICS_PER_CALL = 6;

const AUTHORING_PROMPT = `You write original study notes for university students, based on an official syllabus unit.

Search the web for authoritative material on the unit before writing. Base every factual claim on what you find.

Respond with ONLY a JSON array, no other text and no markdown fences:

[
  {
    "name": "<the unit or a specific concept within it>",
    "importance": "Very High" | "High" | "Medium" | "Low",
    "keyPoints": ["<a fact a student must be able to state in an exam>"],
    "theory": "<2-4 paragraphs explaining the concept in your own words>",
    "commonExamQuestions": ["<a question of the kind that gets asked on this unit>"]
  }
]

Hard rules:
- WRITE IN YOUR OWN WORDS. Never copy sentences or paragraphs from any source. Explain the idea as a teacher would, not as a page would.
- Every factual claim must be supported by material you actually found. If you cannot find support for something, leave it out.
- "keyPoints": 4 to 8 entries, each a single self-contained fact, under 200 characters.
- "theory": explain WHY, not just what. A student who reads it should be able to answer an unseen question on the unit.
- "commonExamQuestions": 2 to 4, phrased the way an examiner would phrase them.
- "importance" reflects how central the unit is to the subject, not how hard it is.
- Use plain text. No markdown headings, no bullet characters, no LaTeX delimiters.`;

/**
 * Citation and section markers carried over from source pages — "[12]",
 * "[1.1.6]". Live output leaked these into exam questions, and they are noise
 * to a student, so they are stripped rather than merely flagged.
 */
const CITATION_MARKER = /\s*\[\d+(?:\.\d+)*\]/g;

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(CITATION_MARKER, "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, max);
}

function cleanList(value: unknown, max: number, itemMax: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => clean(v, itemMax))
    .filter((v) => v.length > 0)
    .slice(0, max);
}

export function slugifyTopic(subjectCode: string, name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
  return `${subjectCode.toLowerCase()}-${slug}`;
}

/**
 * Heuristic check for text lifted verbatim from a source.
 *
 * Not a plagiarism detector — it catches the obvious tells (encyclopaedia
 * openers, citation marks, page furniture) so a reviewer's attention goes to
 * the topics most likely to be copied.
 */
export function looksCopied(text: string): boolean {
  const tells = [
    // Citation and section markers of any depth: [12], [1.1.6], [4.2].
    // Live output leaked "[1.1.6]" into exam questions, which a bare
    // \[\d+\] pattern missed.
    /\[\d+(?:\.\d+)*\]/,
    /\bretrieved on\b/i,
    /\ball rights reserved\b/i,
    /^\s*(in|from)\s+wikipedia/i,
    /\bthis article\b/i,
    /\bclick here\b/i,
    /\bpage \d+ of \d+\b/i,
  ];
  return tells.some((t) => t.test(text));
}

/**
 * Recover the usable objects from a malformed array.
 *
 * Live runs produce broken JSON often enough to matter — a truncated array when
 * the token budget runs out, or a corrupted key. Throwing away a whole unit's
 * notes because the last object is damaged wastes a paid call and a good draft,
 * so each `{...}` block is parsed on its own and the intact ones are kept.
 */
function salvageObjects(raw: string): any[] {
  const objects: any[] = [];
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
          objects.push(JSON.parse(raw.slice(start, i + 1)));
        } catch {
          // Skip this object; the rest of the response may still be fine.
        }
        start = -1;
      }
    }
  }

  return objects;
}

/** Parse and sanitise the model's reply. Exported so the contract is testable. */
export function parseTopics(
  raw: string,
  subjectCode: string,
  sources: GroundingSource[]
): AuthoredTopic[] {
  const closed = raw.match(/\[[\s\S]*\]/);
  // A truncated response has no closing bracket, which is exactly the case
  // salvage exists for — so fall back to everything from the first "[".
  const open = raw.indexOf("[");
  const body = closed ? closed[0] : open === -1 ? null : raw.slice(open);
  if (body === null) throw new Error("No JSON array in authoring response");

  let parsed: any[];
  try {
    const direct = JSON.parse(body);
    if (!Array.isArray(direct)) throw new Error("Authoring response was not an array");
    parsed = direct;
  } catch (err) {
    if (err instanceof Error && err.message === "Authoring response was not an array") throw err;
    // Salvage scans the whole response, not `body`: the greedy bracket match
    // can end on a "]" belonging to a nested array (keyPoints), cutting the
    // first object in half.
    parsed = salvageObjects(raw.slice(open === -1 ? 0 : open));
    if (parsed.length === 0) throw new Error("No usable topics in authoring response");
  }

  const seen = new Set<string>();
  const topics: AuthoredTopic[] = [];

  for (const item of parsed) {
    const name = clean(item?.name, 120);
    const theory = clean(item?.theory, 4000);
    const keyPoints = cleanList(item?.keyPoints, 8, 200);

    // A topic with no name, no explanation, or no key points is not a note.
    if (!name || !theory || keyPoints.length === 0) continue;

    const id = slugifyTopic(subjectCode, name);
    if (seen.has(id)) continue;
    seen.add(id);

    const importance = IMPORTANCE.includes(item?.importance) ? item.importance : "Medium";

    topics.push({
      id,
      name,
      importance,
      keyPoints,
      theory,
      commonExamQuestions: cleanList(item?.commonExamQuestions, 4, 300),
      sources,
      // Grounding is per-call, so every topic from one call shares its sources.
      grounded: sources.length > 0,
    });

    if (topics.length >= MAX_TOPICS_PER_CALL) break;
  }

  return topics;
}

export interface AuthorUnitInput {
  subjectCode: string;
  subjectName: string;
  /** The syllabus unit to write about, from SubjectInfo.keyUnits. */
  unit: string;
}

/**
 * Draft notes for one syllabus unit.
 *
 * The model decides for itself whether to search, and in live runs it sometimes
 * answers from memory even when told to search. Ungrounded output is useless
 * here because a reviewer cannot check it, so one retry is made with a blunter
 * instruction before giving up and letting `reviewFlags` mark it.
 */
export async function authorUnitNotes(
  apiKey: string,
  input: AuthorUnitInput
): Promise<AuthoredTopic[]> {
  const first = await authorUnitOnce(apiKey, input, false);
  if (first.length > 0 && first[0].grounded) return first;

  const retry = await authorUnitOnce(apiKey, input, true);
  // Keep whichever attempt actually consulted sources.
  if (retry.length > 0 && retry[0].grounded) return retry;
  return first.length > 0 ? first : retry;
}

async function authorUnitOnce(
  apiKey: string,
  input: AuthorUnitInput,
  insist: boolean
): Promise<AuthoredTopic[]> {
  const { subjectCode, subjectName, unit } = input;

  const { text, sources } = await callGeminiGrounded(
    apiKey,
    AUTHORING_PROMPT,
    [
      {
        role: "user",
        parts: [
          {
            text: `Subject: ${subjectName} (${subjectCode}), a Bachelor of Information Technology course at Purbanchal University, Nepal.\n\nSyllabus unit: ${unit}\n\nWrite notes covering this unit.${insist ? " You MUST run a web search before answering. Do not rely on memory." : " Search for authoritative material first."}`,
          },
        ],
      },
    ],
    3000
  );

  return parseTopics(text, subjectCode, sources);
}

/** Reasons a topic must not be published without a human fixing it first. */
export function reviewFlags(topic: AuthoredTopic): string[] {
  const flags: string[] = [];
  if (!topic.grounded) flags.push("no sources — model answered from memory");
  if (looksCopied(topic.theory)) flags.push("theory may contain copied text");
  if (topic.keyPoints.some(looksCopied)) flags.push("a key point may contain copied text");
  // Exam questions were originally unchecked, and that is exactly where a
  // source's section markers turned up in live output.
  if (topic.commonExamQuestions.some(looksCopied)) {
    flags.push("an exam question may contain copied text");
  }
  if (topic.theory.length < 200) flags.push("explanation is very short");
  if (topic.commonExamQuestions.length === 0) flags.push("no exam questions produced");
  return flags;
}
