// The content contract, shared by the admin preview, the publish pipeline and
// the Reader. One definition, three consumers — the whole point of this package
// is that there is no second parser anywhere.

/**
 * The only directive blocks a note may use.
 *
 * A closed set, not a convention. An unknown block is a validation error rather
 * than something that renders as a stray paragraph: a `:::tip` that silently
 * degrades to plain text looks fine in review and loses its styling for every
 * student who reads it afterwards.
 */
export const ALLOWED_BLOCKS = [
  "idea",
  "example",
  "working",
  "answer-box",
  "exam-tip",
  "warning",
  "diagram",
  "formula",
  "practice-link",
] as const;

export type BlockName = (typeof ALLOWED_BLOCKS)[number];

export const TRUST_LEVELS = ["ai_draft", "code_verified", "teacher_verified"] as const;
export type TrustLevel = (typeof TRUST_LEVELS)[number];

export const DOCUMENT_TYPES = [
  "topic_note",
  "guide",
  "paper_solution",
  "cheat_sheet",
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export interface Frontmatter {
  id: string;
  type: DocumentType;
  course: string;
  /** ltree path of the syllabus node this document explains. */
  syllabus_path: string;
  /** Printed label from the syllabus, e.g. "6.d". Display only. */
  syllabus_code?: string;
  trust: TrustLevel;
  version?: number;
  title?: string;
}

/**
 * One heading and the body beneath it, down to the next heading of the same or
 * higher level.
 *
 * Derived at publish, never authored. This is the unit that drives the Reader
 * outline, deep links, and (Phase 3) the RAG chunks — blueprint rule 3, "one
 * structure, three uses".
 */
export interface Section {
  anchor: string;
  level: 1 | 2 | 3;
  heading: string;
  /** "Deadlock detection › Multiple instances › Example" */
  headingPath: string;
  /** Anchor of the nearest enclosing heading, or null for the H1. */
  parentAnchor: string | null;
  bodyMd: string;
  orderIndex: number;
}

/** A node of the "On this page" outline. H2/H3 only — the H1 is the page title. */
export interface TocEntry {
  anchor: string;
  level: 2 | 3;
  text: string;
  children: TocEntry[];
}

export interface ValidationIssue {
  /** `error` blocks publishing; `warning` is shown but does not. */
  severity: "error" | "warning";
  /** Machine-readable, so the editor can jump to the right control. */
  code:
    | "frontmatter_missing"
    | "frontmatter_invalid"
    | "unknown_block"
    | "heading_order"
    | "duplicate_anchor"
    | "missing_h1"
    | "multiple_h1"
    | "heading_too_deep"
    | "empty_document"
    | "practice_link_unresolved"
    | "block_nesting";
  message: string;
  /** 1-indexed line in the source markdown, for click-to-jump in the editor. */
  line?: number;
}

export interface ParsedDocument {
  frontmatter: Frontmatter;
  /** The markdown body with the frontmatter block removed. */
  body: string;
  title: string;
  sections: Section[];
  toc: TocEntry[];
  issues: ValidationIssue[];
  /** True when nothing with severity "error" was found. */
  valid: boolean;
}

export interface RenderOptions {
  /**
   * Revision mode collapses `idea` and `example` blocks.
   *
   * Same content, different rendering — deliberately not a second copy of the
   * document. Two copies drift, and the one a student revises from is always
   * the stale one.
   */
  mode?: "beginner" | "revision";
  /** Offset heading levels, e.g. when embedding a note inside an assembled book. */
  headingOffset?: number;
}
