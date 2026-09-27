// ExamAI data model — the TypeScript half of the contract in /docs/schema.md.
//
// The Pydantic half lives in examai-api/app/schemas.py. Both are generated from
// the same document; change one and you must change the other, or the worker
// writes fields the frontend cannot see.
//
// These types describe documents that are read STRAIGHT off a Firestore
// listener into React state, which is why the field names are camelCase while
// the older MockExams collections are snake_case. See /docs/schema.md for why
// that split exists and why it is not worth unifying.

import type { Timestamp, FieldValue } from "firebase/firestore";

// ---------------------------------------------------------------------------
// Canonical User Schema (Phase 0)
// ---------------------------------------------------------------------------

export type UserRole = "student" | "examiner" | "org_admin" | "admin";

export interface User {
  id: string;                    // Firebase UID (doc ID)
  email: string;
  name: string;
  displayName?: string;
  photoURL?: string;
  phone?: string;
  role: UserRole;
  orgId?: string;
  org_id?: string;               // Legacy compatibility
  createdAt: Timestamp | FieldValue | Date | any;
  updatedAt: Timestamp | FieldValue | Date | any;
}

export type ExamType = "regular" | "back" | "make_up" | "model";
export type Curriculum = "new_course" | "old_course";
export type Confidence = "high" | "medium" | "low";

/**
 * Question type drives everything downstream, and `numerical` is the reason the
 * field exists: those questions must never be served as a memorised answer,
 * because topics repeat across years and numbers do not. They get verification
 * (Phase 3) and variant generation (Phase 4) instead.
 */
export type QuestionType =
  | "theory"
  | "numerical"
  | "short_note"
  | "comparison"
  | "diagram";

export type PaperStatus =
  | "uploaded"
  | "extracted"
  | "solving"
  | "review"
  | "published"
  | "failed";

export type JobStage =
  | "extract"
  | "classify"
  | "solve"
  | "verify"
  | "embed"
  | "stats"
  | "render";

export type JobStatus = "queued" | "running" | "succeeded" | "failed" | "cancelled";

export type ReviewStatus = "pending" | "approved" | "rejected";

/** `"n/a"` for anything that is not a numerical — distinct from "not yet checked". */
export type VerifiedNumerical = boolean | "n/a";

// ---------------------------------------------------------------------------
// Program / course
// ---------------------------------------------------------------------------

export interface Program {
  id: string;
  name: string;
  university: string;
  semesters: number;
}

export interface SyllabusUnit {
  unitId: string;
  title: string;
}

export interface Course {
  code: string;
  courseId?: string;
  name: string;
  semester: number;
  programId: string;
  credits: number;
  curriculum: Curriculum;
  /** The tagging vocabulary. Generated from bitSyllabusData so it cannot drift. */
  syllabusUnits: SyllabusUnit[];
  description?: string;
  learningOutcomes?: string[];
  prerequisites?: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

// ---------------------------------------------------------------------------
// Student Notes (Phase 1)
// ---------------------------------------------------------------------------

export interface StudentNotesTopic {
  topicId: string;
  courseId: string;           // e.g. "BIT351CO"
  name: string;
  keyPoints: string[];
  code?: string;              // Unit code or code snippet
  importance: 'Very High' | 'High' | 'Medium';
  theoryTopics: string[];
  createdAt?: Timestamp | FieldValue | Date | any;
  updatedAt?: Timestamp | FieldValue | Date | any;
}

// ---------------------------------------------------------------------------
// Learning Paths & Student Progress (Phase 3)
// ---------------------------------------------------------------------------

export interface LearningPath {
  pathId: string;
  name: string;              // "First Semester Foundations"
  description: string;
  programId: string;
  courseIds: string[];       // ordered
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  estimatedHours: number;
  tags: string[];
  createdBy: string;         // admin UID
  createdAt?: Timestamp | FieldValue | Date | any;
  updatedAt?: Timestamp | FieldValue | Date | any;
}

export interface StudentCourseEnrollment {
  userId: string;
  courseId: string;
  enrolledAt: Timestamp | FieldValue | Date | any;
  completionPercentage: number;
  status: 'active' | 'completed' | 'paused' | 'dropped';
  lastAccessedAt: Timestamp | FieldValue | Date | any;
  topicsCompleted: string[];
  topicsInProgress: string[];
  questionsAttempted: number;
  certificateIssuedAt?: Timestamp | FieldValue | Date | any;
}

export interface StudentPathEnrollment {
  userId: string;
  pathId: string;
  enrolledAt: Timestamp | FieldValue | Date | any;
  completedCourses: string[];
  currentCourseId: string;
  completionPercentage: number;
  certificateIssuedAt?: Timestamp | FieldValue | Date | any;
}

// ---------------------------------------------------------------------------
// Paper
// ---------------------------------------------------------------------------

/**
 * A printed section and its choice rule.
 *
 * `questionsPrinted` is normally LARGER than `answerCount` — "Answer SEVEN
 * questions" over eight printed. Extraction must capture every printed
 * question, not `answerCount` of them, and completeness is judged against
 * `questionsPrinted`.
 */
export interface PaperGroup {
  label: string;
  questionsPrinted: number;
  answerCount: number;
  marksEach: number;
  marksTotal: number;
  instruction: string;
}

export interface GroupCoverage {
  label: string;
  questionsExtracted: number;
  questionsPrinted: number;
}

/**
 * Makes incomplete extraction visible.
 *
 * Counted in questions per group rather than summed marks: on a choice-based
 * paper a complete extraction legitimately carries more marks than the paper is
 * worth, so summed marks would flag a perfect run as over-extracted.
 *
 * Always derived from what was actually written. Never ask the model how
 * complete it was — that is precisely the self-report this field exists to
 * replace.
 */
export interface Coverage {
  byGroup: GroupCoverage[];
  status: "complete" | "partial" | "over_extracted";
  missingRanges: string[];
  notes: string;
}

export interface Paper {
  paperId: string;
  courseId: string;
  programId: string;
  year: number;
  examType: ExamType;
  fullMarks: number;
  passMarks: number | null;
  timeHours: number | null;
  /** Storage paths in reading order. Build them with paths.ts, never by hand. */
  imagePaths: string[];
  groups: PaperGroup[];
  coverage: Coverage;
  status: PaperStatus;
  extractionNotes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  totalTokens: number;
  totalCostUsd: number;
}

// ---------------------------------------------------------------------------
// Question
// ---------------------------------------------------------------------------

export interface UnitTag {
  unitId: string;
  confidence: Confidence;
  /** A human tag outranks a model tag and is never overwritten by a re-run. */
  taggedBy: "model" | "human";
}

/**
 * WITHIN-question choice only — "Write short notes on any TWO:" over three
 * options listed as sub-parts. Group-level choice ("Answer SEVEN questions")
 * belongs on PaperGroup.answerCount; conflating the two makes the paper's mark
 * arithmetic impossible to reconstruct.
 */
export interface ChoiceRule {
  choose: number;
}

export interface Question {
  qId: string;
  number: string;
  group: string;
  /** Sort key. The document id cannot be used — "B10" sorts before "B2". */
  orderIndex: number;

  /**
   * Null ONLY on a sub-part whose share of the marks is not printed. Inventing
   * a split feeds fabricated numbers into mark-weight analysis, and 0 would be
   * worse because it reads as a real value.
   */
  marks: number | null;
  /** The margin split, e.g. "4+8" -> [4, 8]. Null when none is printed. */
  markSplit: number[] | null;
  choiceRule: ChoiceRule | null;

  /**
   * Transcribed verbatim — Nepali-English textbook phrasing preserved, grammar
   * never "corrected".
   *
   * Null is allowed in exactly two cases: a bare stem whose content all lives
   * in subParts, or genuinely unreadable text (and then confidence must be
   * "low"). Validation rejects null with neither, so null can never quietly
   * mean "we lost it".
   */
  textExact: string | null;
  type: QuestionType;

  /** Primary unit, for grouping. Null when nothing in the syllabus fits. */
  syllabusUnit: string | null;
  /** May be empty — but only alongside unclear: true. See /docs/schema.md. */
  syllabusUnits: UnitTag[];
  topics: string[];
  subParts: Question[];

  hasDiagram: boolean;
  diagramDescription: string | null;
  /** 1-indexed into Paper.imagePaths, so the scan can be shown beside the text. */
  sourcePage: number | null;

  confidence: Confidence;
  /** Derived, never model-reported. reviewNote always says which rule fired. */
  unclear: boolean;
  reviewNote: string | null;

  // --- populated by later phases -------------------------------------------
  solutionPath: string | null;
  verifiedNumerical: VerifiedNumerical;
  reviewStatus: ReviewStatus;
  reviewerNote: string | null;
  embedding: number[] | null;
  promptVersion: string | null;
  modelUsed: string | null;
  tokensUsed: number;
  costUsd: number;
  generatedAt: string | null;
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

export interface JobLog {
  at: string;
  level: "info" | "warn" | "error";
  message: string;
}

export interface Job {
  jobId: string;
  paperId: string;
  stage: JobStage;
  status: JobStatus;
  attempts: number;
  error: string | null;
  logs: JobLog[];
  progress: { done: number; total: number };
  startedAt: string | null;
  finishedAt: string | null;
  createdBy: string;
}

// ---------------------------------------------------------------------------
// Topic stats
// ---------------------------------------------------------------------------

export interface TopicStat {
  count: number;
  years: number[];
  totalMarks: number;
}

export interface TopicStats {
  courseId: string;
  topics: Record<string, TopicStat>;
  units: Record<string, TopicStat>;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Helpers shared by UI and API routes
// ---------------------------------------------------------------------------

export const EXAM_TYPES: readonly ExamType[] = ["regular", "back", "make_up", "model"];

/** `BIT351CO_2025_regular` — stable, so re-upload overwrites instead of duplicating. */
export function buildPaperId(courseId: string, year: number, examType: ExamType): string {
  return `${courseId.toUpperCase()}_${year}_${examType}`;
}

const PAPER_ID_RE = /^[A-Z0-9]+_\d{4}_(regular|back|make_up|model)$/;

export function isValidPaperId(value: string): boolean {
  return PAPER_ID_RE.test(value);
}

/**
 * Sort questions the way the paper prints them.
 *
 * Group first, then orderIndex — deliberately not the document id, because
 * "B10" sorts before "B2" as a string and a reviewer comparing against the scan
 * would see the questions out of order.
 */
export function sortQuestions<T extends Pick<Question, "group" | "orderIndex">>(
  questions: T[]
): T[] {
  return [...questions].sort(
    (a, b) => a.group.localeCompare(b.group) || a.orderIndex - b.orderIndex
  );
}

/** Questions a reviewer must look at before anything can be published. */
export function questionsNeedingReview(questions: Question[]): Question[] {
  return questions.filter((q) => q.unclear || q.reviewStatus !== "approved");
}

/**
 * Publishing is blocked unless every question is approved AND the extraction is
 * complete. Both halves matter: an approved set of 8 questions from an
 * 11-question paper is still a paper with three questions missing, and nothing
 * in the per-question state would reveal that.
 */
export function canPublish(paper: Paper, questions: Question[]): boolean {
  if (questions.length === 0) return false;
  if (paper.coverage.status !== "complete") return false;
  return questions.every((q) => q.reviewStatus === "approved");
}
