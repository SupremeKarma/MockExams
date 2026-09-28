// Markdown → HTML, emitting the ExamAI Study Design System's markup.
//
// This is the ONLY renderer. The admin preview, the publish pipeline and the
// Reader all call it, so "what the preview shows" and "what a student sees"
// cannot diverge — which is the failure a second renderer always eventually
// produces, usually in the block that matters most.
//
// The class names and label wording here are the contract with
// `src/styles/reader/reader.css` (see docs/DESIGN.md §5). Changing one without
// the other silently drops a block's styling: it still renders, just as a plain
// box, which looks fine in review and wrong to every student afterwards.

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";

import { ALLOWED_BLOCKS, type BlockName, type RenderOptions } from "./types";
import { DiagramError, graphToSvg, parseGraph } from "./diagram";

/**
 * Block name → design-system class suffix, label, and sprite icon.
 *
 * The directive names come from the authoring format and the classes from the
 * design system, and they deliberately differ in two places (`answer-box` →
 * `--answer`, `exam-tip` → `--tip`). Authors write what the thing is; the
 * stylesheet names what it looks like.
 */
const BLOCK_SPEC: Record<
  Exclude<BlockName, "practice-link">,
  { modifier: string; label: string; icon: string }
> = {
  idea: { modifier: "idea", label: "Idea in plain words", icon: "i-bulb" },
  example: { modifier: "example", label: "Example", icon: "i-grid" },
  working: { modifier: "working", label: "Method", icon: "i-steps" },
  "answer-box": { modifier: "answer", label: "Answer", icon: "i-box" },
  "exam-tip": { modifier: "tip", label: "Exam tip", icon: "i-pen" },
  warning: { modifier: "warning", label: "Common mistake", icon: "i-alert" },
  diagram: { modifier: "diagram", label: "Diagram", icon: "i-grid" },
  formula: { modifier: "formula", label: "Formula", icon: "i-steps" },
};

/** Blocks Revision mode collapses. */
const COLLAPSED_IN_REVISION: BlockName[] = ["idea", "example"];

/** An inline `<svg><use href="#i-x"/></svg>` node, matching the demo's sprite. */
function iconNode(id: string) {
  return {
    type: "element",
    tagName: "svg",
    properties: { className: ["icon"], "aria-hidden": "true" },
    children: [
      { type: "element", tagName: "use", properties: { href: `#${id}` }, children: [] },
    ],
  };
}

function directivesToHtml(options: RenderOptions) {
  return () => (tree: unknown) => {
    visit(tree as never, (node: any) => {
      if (node.type !== "containerDirective" && node.type !== "leafDirective") return;

      const name = node.name as BlockName;
      if (!ALLOWED_BLOCKS.includes(name)) return; // validation already rejected it

      const attrs = (node.attributes ?? {}) as Record<string, string>;

      // practice-link renders nothing until Phase 4 adds variants. Accepted now
      // so notes written today need no editing later, but a visible "Practice"
      // button that goes nowhere would be worse than absent.
      if (name === "practice-link") {
        node.type = "paragraph";
        node.children = [];
        node.data = {
          hName: "div",
          hProperties: { className: ["practice-placeholder"], hidden: true },
        };
        return;
      }

      const spec = BLOCK_SPEC[name as Exclude<BlockName, "practice-link">];

      // A formula is a single expression set between rules. It carries no label
      // row — the design gives it an aria-label instead, so a screen reader
      // still announces what it is without a visible heading interrupting the
      // line of reasoning.
      if (name === "formula") {
        node.data = {
          ...(node.data ?? {}),
          hName: "div",
          hProperties: {
            className: ["block", "block--formula"],
            "aria-label": attrs.title || "Formula",
          },
        };
        return;
      }

      // A diagram is a <figure>, so its caption is associated with the image
      // for assistive technology rather than being a loose paragraph beneath it.
      if (name === "diagram") {
        const caption = attrs.title;
        node.data = {
          ...(node.data ?? {}),
          hName: "figure",
          hProperties: {},
        };
        if (caption) {
          node.children = [
            ...(node.children ?? []),
            {
              type: "paragraph",
              data: { hName: "figcaption", hProperties: {} },
              children: [{ type: "text", value: caption }],
            },
          ];
        }
        return;
      }

      const collapsed = options.mode === "revision" && COLLAPSED_IN_REVISION.includes(name);

      // <details> collapses with no JavaScript, so Revision mode works in the
      // server-rendered HTML and in print.
      node.data = {
        ...(node.data ?? {}),
        hName: collapsed ? "details" : "div",
        hProperties: {
          className: ["block", `block--${spec.modifier}`],
          ...(attrs.verified ? { "data-verified": attrs.verified } : {}),
        },
      };

      const label = {
        type: "paragraph",
        data: {
          hName: collapsed ? "summary" : "p",
          hProperties: { className: ["block__label"] },
        },
        // The icon is added in the hast pass below: mdast has no element node
        // type, and injecting raw HTML here would need allowDangerousHtml,
        // which would also let any HTML in a note's markdown through.
        children: [{ type: "text", value: attrs.title || spec.label }],
      };

      node.children = [label, ...(node.children ?? [])];
    });
  };
}

/**
 * Turn ```rag fences into generated SVG.
 *
 * Runs on hast and replaces the whole `<pre>`, rather than on mdast: the code
 * handler applies `hName` to the inner `<code>` and only then wraps it in a
 * `<pre>`, so an mdast pass produces `<pre><svg>…</svg></pre>` — a scrollable
 * code box around a picture.
 *
 * Building the element tree here also keeps `allowDangerousHtml` off. The flag
 * stays false and a note still cannot contain author-written markup; the only
 * markup that reaches the page is what this file generates.
 *
 * A spec that does not parse becomes a visible error block rather than a
 * silent omission: a deadlock note missing its graph should fail review
 * loudly, not render as a page that merely looks a bit short.
 */
function compileDiagrams() {
  return () => (tree: unknown) => {
    visit(tree as never, "element", (node: any, index: number | undefined, parent: any) => {
      if (node.tagName !== "pre" || parent == null || index == null) return;

      const code = (node.children ?? []).find((c: any) => c.tagName === "code");
      const classes: string[] = code?.properties?.className ?? [];
      if (!classes.includes("language-rag")) return;

      const source = (code.children ?? [])
        .filter((c: any) => c.type === "text")
        .map((c: any) => c.value)
        .join("");

      try {
        parent.children[index] = graphToSvg(parseGraph(source));
      } catch (error) {
        if (!(error instanceof DiagramError)) throw error;
        parent.children[index] = {
          type: "element",
          tagName: "p",
          properties: { className: ["diagram-error"] },
          children: [{ type: "text", value: `Diagram error: ${error.message}` }],
        };
      }
    });
  };
}

/** Insert the sprite icon into each block label once we are in hast. */
function blockLabelIcons() {
  return () => (tree: unknown) => {
    // Walk the BLOCKS rather than the labels: the block carries the modifier
    // that selects the icon, and finding it from the label would mean walking
    // back up the tree.
    visit(tree as never, "element", (node: any) => {
      const classes: string[] = node.properties?.className ?? [];
      const modifier = classes.find((c: string) => c.startsWith("block--"))?.slice(7);
      if (!modifier) return;

      const spec = Object.values(BLOCK_SPEC).find((s) => s.modifier === modifier);
      if (!spec) return;

      const label = (node.children ?? []).find(
        (c: any) => c.properties?.className?.includes?.("block__label")
      );
      if (!label) return;
      if (label.children?.[0]?.tagName === "svg") return; // already added

      label.children = [iconNode(spec.icon), ...(label.children ?? [])];
    });
  };
}

/**
 * Wrap display math ($$...$$ or KaTeX display mode) in a scrollable container
 * for complex nested integrals, Jacobians, and matrices that exceed mobile viewport.
 *
 * Semester 2 contains multi-line integrals and Jacobian determinants that need
 * graceful overflow handling on tablets and phones.
 */
function wrapDisplayMath() {
  return () => (tree: unknown) => {
    visit(tree as never, "element", (node: any, index: number | undefined, parent: any) => {
      if (!parent || index === undefined) return;

      const classes: string[] = node.properties?.className ?? [];
      const isDisplayMath = classes.includes("katex-display") ||
                           (node.tagName === "script" && node.properties?.type === "math/tex; mode=display");

      if (!isDisplayMath) return;

      // Check if already wrapped
      if (parent.properties?.className?.includes?.("math-wrap")) return;

      const wrapper = {
        type: "element",
        tagName: "div",
        properties: {
          className: ["math-wrap"],
          role: "region",
          "aria-label": "Mathematical formula",
        },
        children: [node],
      };

      parent.children[index] = wrapper;
    });
  };
}

/**
 * Wrap tables so a wide matrix scrolls inside its own box, not the page.
 *
 * The trailing `.table-hint` is part of the design system's contract: it is
 * hidden by default and revealed by `.table-wrap.is-scrollable + .table-hint`.
 * Without it, a matrix that overflows on a phone is simply clipped, and a
 * student reading the detection example has no way to know there are columns
 * they have not seen.
 */
function wrapTables() {
  return () => (tree: unknown) => {
    visit(tree as never, "element", (node: any, index: number | undefined, parent: any) => {
      if (node.tagName !== "table" || !parent || index === undefined) return;
      if (parent.properties?.className?.includes?.("table-wrap")) return;

      const wrap = {
        type: "element",
        tagName: "div",
        properties: { className: ["table-wrap"], tabIndex: 0, role: "region" },
        children: [node],
      };

      const hint = {
        type: "element",
        tagName: "p",
        properties: { className: ["table-hint"] },
        children: [
          { type: "text", value: "Swipe the table sideways to see every column." },
        ],
      };

      parent.children.splice(index, 1, wrap, hint);
    });
  };
}

/** Give every heading its anchor id, matching what publish stored. */
function headingAnchors(anchors: Map<string, string>) {
  return () => (tree: unknown) => {
    visit(tree as never, "element", (node: any) => {
      if (!/^h[1-6]$/.test(node.tagName)) return;
      const anchor = anchors.get(collectText(node).trim());
      if (anchor) node.properties = { ...(node.properties ?? {}), id: anchor };
    });
  };
}

function collectText(node: any): string {
  if (node.type === "text") return node.value;
  return (node.children ?? []).map(collectText).join("");
}

/** Strip the `{#anchor}` suffix from rendered heading text. */
function stripExplicitAnchors() {
  return () => (tree: unknown) => {
    visit(tree as never, "heading", (node: any) => {
      const last = node.children?.[node.children.length - 1];
      if (last?.type === "text") {
        last.value = last.value.replace(/\s*\{#[A-Za-z0-9][A-Za-z0-9_-]*\}\s*$/, "");
      }
    });
  };
}

export interface RenderResult {
  html: string;
}

export function renderMarkdown(
  markdown: string,
  anchors: Map<string, string> = new Map(),
  options: RenderOptions = {}
): RenderResult {
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkMath)
    .use(stripExplicitAnchors())
    .use(directivesToHtml(options))
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(compileDiagrams())
    .use(blockLabelIcons())
    .use(wrapTables())
    .use(headingAnchors(anchors))
    // `throwOnError: false` keeps a malformed formula from taking down the
    // whole page render: KaTeX shows the source in red instead, which a
    // reviewer can see and fix.
    .use(rehypeKatex, { output: "html", throwOnError: false } as never)
    .use(wrapDisplayMath())
    .use(rehypeStringify)
    .processSync(markdown);

  return { html: String(file) };
}

/** Render a parsed document's body with its own anchors applied. */
export function renderDocument(
  body: string,
  sections: { heading: string; anchor: string }[],
  options: RenderOptions = {}
): RenderResult {
  const anchors = new Map(sections.map((s) => [s.heading, s.anchor]));
  return renderMarkdown(body, anchors, options);
}
