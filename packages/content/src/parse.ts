// Parse → validate → derive. The single entry point for turning a note's
// markdown into everything downstream needs.
//
// Deriving sections from headings rather than asking an author to declare them
// is blueprint rule 3: the heading tree is the outline, the deep-link targets,
// and later the RAG chunks. Anything hand-maintained alongside it would drift.

import GithubSlugger from "github-slugger";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { directiveFromMarkdown } from "mdast-util-directive";
import { mathFromMarkdown } from "mdast-util-math";
import { gfm } from "micromark-extension-gfm";
import { directive } from "micromark-extension-directive";
import { math } from "micromark-extension-math";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";
import { parse as parseYaml } from "yaml";

import {
  ALLOWED_BLOCKS,
  DOCUMENT_TYPES,
  TRUST_LEVELS,
  type BlockName,
  type Frontmatter,
  type ParsedDocument,
  type Section,
  type TocEntry,
  type ValidationIssue,
} from "./types";

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/** Explicit anchor syntax: `## Some heading {#custom-anchor}` */
const EXPLICIT_ANCHOR_RE = /\s*\{#([A-Za-z0-9][A-Za-z0-9_-]*)\}\s*$/;

export function toMdast(markdown: string) {
  return fromMarkdown(markdown, {
    extensions: [gfm(), directive(), math()],
    mdastExtensions: [gfmFromMarkdown(), directiveFromMarkdown(), mathFromMarkdown()],
  });
}

export function splitFrontmatter(source: string): { raw: string | null; body: string; offset: number } {
  const match = source.match(FRONTMATTER_RE);
  if (!match) return { raw: null, body: source, offset: 0 };
  // Line offset so issue line numbers point at the real line in the file, not
  // at the body-relative one — an editor jumping to the wrong line is worse
  // than no line at all.
  const offset = match[0].split("\n").length - 1;
  return { raw: match[1], body: source.slice(match[0].length), offset };
}

function validateFrontmatter(raw: string | null, issues: ValidationIssue[]): Frontmatter | null {
  if (raw === null) {
    issues.push({
      severity: "error",
      code: "frontmatter_missing",
      message: "The document has no YAML frontmatter block.",
      line: 1,
    });
    return null;
  }

  let data: Record<string, unknown>;
  try {
    data = (parseYaml(raw) ?? {}) as Record<string, unknown>;
  } catch (err) {
    issues.push({
      severity: "error",
      code: "frontmatter_invalid",
      message: `Frontmatter is not valid YAML: ${(err as Error).message}`,
      line: 1,
    });
    return null;
  }

  const required = ["id", "type", "course", "syllabus_path", "trust"] as const;
  for (const key of required) {
    if (typeof data[key] !== "string" || !(data[key] as string).trim()) {
      issues.push({
        severity: "error",
        code: "frontmatter_invalid",
        message: `Frontmatter is missing required field "${key}".`,
        line: 1,
      });
    }
  }

  if (data.type && !DOCUMENT_TYPES.includes(data.type as never)) {
    issues.push({
      severity: "error",
      code: "frontmatter_invalid",
      message: `Unknown type "${String(data.type)}". Use one of: ${DOCUMENT_TYPES.join(", ")}.`,
      line: 1,
    });
  }

  if (data.trust && !TRUST_LEVELS.includes(data.trust as never)) {
    issues.push({
      severity: "error",
      code: "frontmatter_invalid",
      message: `Unknown trust level "${String(data.trust)}". Use one of: ${TRUST_LEVELS.join(", ")}.`,
      line: 1,
    });
  }

  // The syllabus path is what ties a note to the spine. A typo here produces a
  // note that publishes cleanly and is attached to nothing.
  if (typeof data.syllabus_path === "string" && !/^[a-z0-9_]+(\.[a-z0-9_]+)*$/.test(data.syllabus_path)) {
    issues.push({
      severity: "error",
      code: "frontmatter_invalid",
      message: `syllabus_path "${data.syllabus_path}" is not a valid ltree path.`,
      line: 1,
    });
  }

  return issues.some((i) => i.severity === "error" && i.code.startsWith("frontmatter"))
    ? null
    : (data as unknown as Frontmatter);
}

/** Heading text with an explicit `{#anchor}` stripped, plus that anchor if present. */
function headingParts(text: string): { text: string; explicit: string | null } {
  const match = text.match(EXPLICIT_ANCHOR_RE);
  if (!match) return { text: text.trim(), explicit: null };
  return { text: text.slice(0, match.index).trim(), explicit: match[1] };
}

interface RawHeading {
  level: number;
  text: string;
  explicit: string | null;
  startLine: number;
  endLine: number;
}

function collectHeadings(tree: ReturnType<typeof toMdast>): RawHeading[] {
  const out: RawHeading[] = [];
  visit(tree, "heading", (node: any) => {
    const { text, explicit } = headingParts(toString(node));
    out.push({
      level: node.depth,
      text,
      explicit,
      startLine: node.position?.start?.line ?? 0,
      endLine: node.position?.end?.line ?? 0,
    });
  });
  return out;
}

function validateBlocks(tree: ReturnType<typeof toMdast>, offset: number, issues: ValidationIssue[]): void {
  const seen = new Set<string>();
  visit(tree, (node: any) => {
    if (
      node.type !== "containerDirective" &&
      node.type !== "leafDirective" &&
      node.type !== "textDirective"
    ) {
      return;
    }
    seen.add(node.name);
    if (!ALLOWED_BLOCKS.includes(node.name as BlockName)) {
      issues.push({
        severity: "error",
        code: "unknown_block",
        message:
          `":::${node.name}" is not an allowed block. Allowed: ` +
          ALLOWED_BLOCKS.join(", ") +
          ".",
        line: (node.position?.start?.line ?? 0) + offset,
      });
    }
  });
}

/**
 * A nested block must use MORE colons than the block containing it.
 *
 * `:::diagram` inside `:::example` does not nest: the inner opening fence is
 * also a valid closing fence for the outer block, so remark ends the example
 * there. The figure still renders, the note still validates, and the prose
 * after the figure silently falls OUTSIDE the example box — which looks like a
 * styling glitch rather than the structural error it is.
 *
 * Checked on the raw source rather than the tree because by the time remark
 * has parsed it the evidence is gone: what is left is a correctly-formed
 * document that simply is not the one the author wrote.
 */
function validateBlockNesting(body: string, offset: number, issues: ValidationIssue[]): void {
  const open: { name: string; colons: number }[] = [];
  let inCodeFence = false;

  body.split("\n").forEach((line, index) => {
    if (/^\s*(```|~~~)/.test(line)) {
      inCodeFence = !inCodeFence;
      return;
    }
    if (inCodeFence) return;

    const match = /^(:{3,})([a-z-]*)/.exec(line);
    if (!match) return;

    const colons = match[1].length;
    const name = match[2];

    if (!name) {
      open.pop();
      return;
    }

    const parent = open[open.length - 1];
    if (parent && colons >= parent.colons) {
      issues.push({
        severity: "error",
        code: "block_nesting",
        message:
          `":::${name}" is inside ":::${parent.name}" but opens with ${colons} colons, which closes it. ` +
          `Give ":::${parent.name}" ${colons + 1} colons — the outer block needs more than the inner one.`,
        line: index + 1 + offset,
      });
    }
    open.push({ name, colons });
  });
}

function validateHeadingOrder(headings: RawHeading[], offset: number, issues: ValidationIssue[]): void {
  const h1s = headings.filter((h) => h.level === 1);

  if (h1s.length === 0) {
    issues.push({
      severity: "error",
      code: "missing_h1",
      message: "The document has no H1. The H1 is the page title.",
      line: 1,
    });
  } else if (h1s.length > 1) {
    issues.push({
      severity: "error",
      code: "multiple_h1",
      message: `The document has ${h1s.length} H1 headings; exactly one is allowed.`,
      line: h1s[1].startLine + offset,
    });
  }

  let previous = 0;
  for (const heading of headings) {
    if (heading.level > 3) {
      issues.push({
        severity: "error",
        code: "heading_too_deep",
        message: `"${heading.text}" is an H${heading.level}. Sections are derived from H1–H3 only.`,
        line: heading.startLine + offset,
      });
      continue;
    }
    // An H3 with no H2 above it has no parent section, so it would attach
    // straight to the H1 and read as a sibling of its own siblings in the
    // outline. Rejecting it keeps the outline a faithful tree.
    if (previous > 0 && heading.level > previous + 1) {
      issues.push({
        severity: "error",
        code: "heading_order",
        message: `"${heading.text}" is an H${heading.level} directly under an H${previous}. Add an H${previous + 1} above it.`,
        line: heading.startLine + offset,
      });
    }
    previous = heading.level;
  }
}

function deriveSections(
  headings: RawHeading[],
  bodyLines: string[],
  offset: number,
  issues: ValidationIssue[]
): Section[] {
  const slugger = new GithubSlugger();
  const used = new Set<string>();
  const usable = headings.filter((h) => h.level <= 3);

  const sections: Section[] = [];
  const stack: { level: number; anchor: string; text: string }[] = [];

  usable.forEach((heading, index) => {
    let anchor = heading.explicit ?? slugger.slug(heading.text);

    if (used.has(anchor)) {
      // Explicit anchors are the author's choice, so a clash is their mistake
      // and must be reported rather than silently suffixed — two headings
      // sharing an anchor means one deep link is unreachable.
      if (heading.explicit) {
        issues.push({
          severity: "error",
          code: "duplicate_anchor",
          message: `Anchor "{#${anchor}}" is used more than once. Anchors must be unique within a document.`,
          line: heading.startLine + offset,
        });
      }
      let n = 2;
      while (used.has(`${anchor}-${n}`)) n += 1;
      anchor = `${anchor}-${n}`;
    }
    used.add(anchor);

    while (stack.length && stack[stack.length - 1].level >= heading.level) stack.pop();
    const parent = stack[stack.length - 1] ?? null;

    const headingPath = [...stack.map((s) => s.text), heading.text].join(" › ");

    // Body runs from the line after this heading up to the line before the next
    // usable heading.
    //
    // `bodyLines` is padded with a leading "" so that body line N sits at index
    // N. The heading itself is at index `endLine`, so the body starts at
    // `endLine + 1` — slicing from `endLine` would fold each heading into its
    // own section body, which then renders the heading twice and pollutes the
    // section text that Phase 3 will embed.
    const next = usable[index + 1];
    const from = heading.endLine + 1;
    const to = next ? next.startLine : bodyLines.length;
    const bodyMd = bodyLines.slice(from, to).join("\n").trim();

    sections.push({
      anchor,
      level: heading.level as 1 | 2 | 3,
      heading: heading.text,
      headingPath,
      parentAnchor: parent ? parent.anchor : null,
      bodyMd,
      orderIndex: sections.length,
    });

    stack.push({ level: heading.level, anchor, text: heading.text });
  });

  return sections;
}

/** The "On this page" outline: H2 and H3 only — the H1 is the page title. */
export function buildToc(sections: Section[]): TocEntry[] {
  const roots: TocEntry[] = [];
  let current: TocEntry | null = null;

  for (const section of sections) {
    if (section.level === 2) {
      current = { anchor: section.anchor, level: 2, text: section.heading, children: [] };
      roots.push(current);
    } else if (section.level === 3) {
      const entry: TocEntry = {
        anchor: section.anchor,
        level: 3,
        text: section.heading,
        children: [],
      };
      // Heading order is validated, so an H3 without an H2 is already an error;
      // this branch only guards against rendering a partially valid preview.
      if (current) current.children.push(entry);
      else roots.push(entry as unknown as TocEntry);
    }
  }
  return roots;
}

export function parseDocument(source: string): ParsedDocument {
  const issues: ValidationIssue[] = [];
  const { raw, body, offset } = splitFrontmatter(source);

  const frontmatter = validateFrontmatter(raw, issues);

  if (!body.trim()) {
    issues.push({
      severity: "error",
      code: "empty_document",
      message: "The document has no content below the frontmatter.",
      line: offset + 1,
    });
  }

  const tree = toMdast(body);
  const headings = collectHeadings(tree);

  validateBlocks(tree, offset, issues);
  validateBlockNesting(body, offset, issues);
  validateHeadingOrder(headings, offset, issues);

  // Body lines are 1-indexed against the body (not the file), matching mdast
  // positions; a leading empty element makes the arithmetic in deriveSections
  // read directly.
  const bodyLines = ["", ...body.split("\n")];
  const sections = deriveSections(headings, bodyLines, offset, issues);
  const toc = buildToc(sections);

  const title = sections.find((s) => s.level === 1)?.heading ?? frontmatter?.title ?? "";

  return {
    frontmatter: (frontmatter ?? {}) as Frontmatter,
    body,
    title,
    sections,
    toc,
    issues,
    valid: !issues.some((i) => i.severity === "error"),
  };
}
