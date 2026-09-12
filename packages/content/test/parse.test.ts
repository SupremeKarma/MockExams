/**
 * Content pipeline contract.
 *
 * These guard the properties the Reader and the publish pipeline both depend
 * on. Two matter most:
 *
 *   - Sections are derived from headings correctly, because the outline, the
 *     deep links and (Phase 3) the RAG chunks are all the same tree.
 *   - Validation rejects what would render wrongly rather than degrading
 *     quietly. A `:::tip` that falls through as a paragraph looks fine in
 *     review and is broken for every student afterwards.
 */

import { describe, expect, it } from "vitest";
import { parseDocument, buildToc } from "../src/parse";
import { renderDocument } from "../src/render";
import { diffAnchors } from "../src/anchors";

const FRONTMATTER = `---
id: bit253co-u6-t4
type: topic_note
course: BIT253CO
syllabus_path: bit.s4.bit253co.u6.t4
syllabus_code: "6.d"
trust: ai_draft
---
`;

function doc(body: string, frontmatter = FRONTMATTER) {
  return parseDocument(`${frontmatter}\n${body}`);
}

const SAMPLE = `# Deadlock detection and recovery

:::idea
The OS lets deadlocks happen, checks now and then, and breaks them when found.
:::

## Single instance of each resource

Use a wait-for graph.

### Building the graph

Collapse resource nodes.

### Spotting the cycle

A cycle means a deadlock.

## Multiple instances

Use the detection algorithm.
`;

describe("frontmatter", () => {
  it("requires the fields that tie a note to the spine", () => {
    const parsed = parseDocument("# Title\n\nBody.");
    expect(parsed.valid).toBe(false);
    expect(parsed.issues[0].code).toBe("frontmatter_missing");
  });

  it("rejects a syllabus_path that is not an ltree path", () => {
    const bad = FRONTMATTER.replace("bit.s4.bit253co.u6.t4", "bit/s4/bit253co");
    const parsed = doc("# Title\n\nBody.", bad);
    expect(parsed.valid).toBe(false);
    expect(parsed.issues.some((i) => i.message.includes("ltree"))).toBe(true);
  });

  it("rejects an unknown trust level", () => {
    const bad = FRONTMATTER.replace("trust: ai_draft", "trust: definitely_true");
    expect(doc("# Title\n\nBody.", bad).valid).toBe(false);
  });

  it("accepts a well-formed document", () => {
    const parsed = doc(SAMPLE);
    expect(parsed.issues.filter((i) => i.severity === "error")).toEqual([]);
    expect(parsed.valid).toBe(true);
    expect(parsed.frontmatter.syllabus_path).toBe("bit.s4.bit253co.u6.t4");
  });
});

describe("sections", () => {
  it("derives one section per H1-H3 heading, in order", () => {
    const { sections } = doc(SAMPLE);
    expect(sections.map((s) => s.heading)).toEqual([
      "Deadlock detection and recovery",
      "Single instance of each resource",
      "Building the graph",
      "Spotting the cycle",
      "Multiple instances",
    ]);
    expect(sections.map((s) => s.orderIndex)).toEqual([0, 1, 2, 3, 4]);
  });

  it("nests each section under the nearest enclosing heading", () => {
    const byAnchor = Object.fromEntries(doc(SAMPLE).sections.map((s) => [s.anchor, s]));

    expect(byAnchor["deadlock-detection-and-recovery"].parentAnchor).toBeNull();
    expect(byAnchor["single-instance-of-each-resource"].parentAnchor).toBe(
      "deadlock-detection-and-recovery"
    );
    expect(byAnchor["building-the-graph"].parentAnchor).toBe("single-instance-of-each-resource");
    // The second H2 closes the first H2's H3s rather than nesting under them.
    expect(byAnchor["multiple-instances"].parentAnchor).toBe("deadlock-detection-and-recovery");
  });

  it("builds heading_path from the ancestor chain", () => {
    const section = doc(SAMPLE).sections.find((s) => s.anchor === "spotting-the-cycle")!;
    expect(section.headingPath).toBe(
      "Deadlock detection and recovery › Single instance of each resource › Spotting the cycle"
    );
  });

  it("captures each section's body without the heading line", () => {
    const section = doc(SAMPLE).sections.find((s) => s.anchor === "building-the-graph")!;
    expect(section.bodyMd).toBe("Collapse resource nodes.");
    expect(section.bodyMd).not.toContain("###");
  });

  it("keeps the idea block with the H1 section", () => {
    const h1 = doc(SAMPLE).sections[0];
    expect(h1.bodyMd).toContain(":::idea");
  });
});

describe("anchors", () => {
  it("slugs headings by default", () => {
    expect(doc(SAMPLE).sections[1].anchor).toBe("single-instance-of-each-resource");
  });

  it("honours an explicit {#anchor}", () => {
    const parsed = doc("# Title\n\n## Detection method {#method}\n\nBody.");
    expect(parsed.sections[1].anchor).toBe("method");
    expect(parsed.sections[1].heading).toBe("Detection method");
  });

  it("de-duplicates repeated slugs so every section stays addressable", () => {
    const parsed = doc("# Title\n\n## Example\n\nA.\n\n## Example\n\nB.");
    // github-slugger's convention, matching GitHub itself: the second
    // occurrence gets "-1". What matters is that both stay addressable.
    expect(parsed.sections.map((s) => s.anchor)).toEqual(["title", "example", "example-1"]);
  });

  it("reports a duplicated EXPLICIT anchor as an error", () => {
    // Author's own choice, so a clash is their mistake: silently suffixing it
    // would leave one of their deep links pointing at the wrong section.
    const parsed = doc("# Title\n\n## One {#dup}\n\nA.\n\n## Two {#dup}\n\nB.");
    expect(parsed.valid).toBe(false);
    expect(parsed.issues.some((i) => i.code === "duplicate_anchor")).toBe(true);
  });
});

describe("validation", () => {
  it("rejects an unknown block", () => {
    const parsed = doc("# Title\n\n:::tip\nNot allowed.\n:::\n");
    expect(parsed.valid).toBe(false);
    const issue = parsed.issues.find((i) => i.code === "unknown_block")!;
    expect(issue.message).toContain(":::tip");
    expect(issue.line).toBeGreaterThan(1);
  });

  it("accepts every allowed block", () => {
    const body = [
      "# Title",
      ":::idea\nx\n:::",
      ":::example\nx\n:::",
      ":::working\nx\n:::",
      ":::answer-box\nx\n:::",
      ":::exam-tip\nx\n:::",
      ":::warning\nx\n:::",
      ":::diagram\nx\n:::",
      ":::formula\nx\n:::",
      ":::practice-link\nx\n:::",
    ].join("\n\n");
    expect(doc(body).valid).toBe(true);
  });

  it("rejects an H3 with no H2 above it", () => {
    const parsed = doc("# Title\n\n### Orphan\n\nBody.");
    expect(parsed.valid).toBe(false);
    expect(parsed.issues.some((i) => i.code === "heading_order")).toBe(true);
  });

  it("rejects headings deeper than H3", () => {
    const parsed = doc("# Title\n\n## Two\n\n### Three\n\n#### Four\n\nBody.");
    expect(parsed.issues.some((i) => i.code === "heading_too_deep")).toBe(true);
  });

  it("rejects a document with no H1 or with two", () => {
    expect(doc("## Only an H2\n\nBody.").issues.some((i) => i.code === "missing_h1")).toBe(true);
    expect(doc("# One\n\n# Two").issues.some((i) => i.code === "multiple_h1")).toBe(true);
  });

  it("reports line numbers against the whole file, not the body", () => {
    // The editor jumps to this line. Counting from the body would land the
    // cursor seven lines above the real problem, which is worse than nothing.
    const parsed = doc("# Title\n\n:::nope\nx\n:::\n");
    const issue = parsed.issues.find((i) => i.code === "unknown_block")!;
    // 8 frontmatter lines + the blank joiner + "# Title" + blank = ":::nope" on 12.
    expect(issue.line).toBe(12);
  });
});

describe("table of contents", () => {
  it("lists H2s with their H3s nested, and omits the H1", () => {
    const toc = doc(SAMPLE).toc;
    expect(toc.map((t) => t.text)).toEqual([
      "Single instance of each resource",
      "Multiple instances",
    ]);
    expect(toc[0].children.map((c) => c.text)).toEqual([
      "Building the graph",
      "Spotting the cycle",
    ]);
  });

  it("matches the document headings exactly", () => {
    const { sections, toc } = doc(SAMPLE);
    const flat = (entries: typeof toc): string[] =>
      entries.flatMap((e) => [e.anchor, ...flat(e.children)]);
    expect(flat(toc)).toEqual(
      sections.filter((s) => s.level > 1).map((s) => s.anchor)
    );
  });

  it("is empty for a document with only an H1", () => {
    expect(buildToc(doc("# Just a title\n\nBody.").sections)).toEqual([]);
  });
});

describe("rendering", () => {
  it("renders directive blocks as labelled sections", () => {
    const parsed = doc("# Title\n\n:::idea\nPlain words.\n:::\n");
    const { html } = renderDocument(parsed.body, parsed.sections);

    // The class contract with src/styles/reader/reader.css (DESIGN.md §5).
    expect(html).toContain('class="block block--idea"');
    expect(html).toContain('class="block__label"');
    expect(html).toContain("Idea in plain words");
    // Meaning never rests on colour alone: every block gets a text label and
    // an icon from the sprite.
    expect(html).toContain('href="#i-bulb"');
    expect(html).toContain("Plain words.");
  });

  it("uses a custom title when the block supplies one", () => {
    const parsed = doc('# Title\n\n:::example{title="Detection with Available = (0,0,0)"}\nx\n:::\n');
    expect(renderDocument(parsed.body, parsed.sections).html).toContain(
      "Detection with Available = (0,0,0)"
    );
  });

  it("collapses idea and example in revision mode, and nothing else", () => {
    const parsed = doc("# Title\n\n:::idea\nA.\n:::\n\n:::exam-tip\nB.\n:::\n");
    const revision = renderDocument(parsed.body, parsed.sections, { mode: "revision" }).html;

    // <details> collapses without JavaScript, so this works server-rendered
    // and in print.
    expect(revision).toContain("<details");
    expect(revision).toContain("<summary");
    // The content is still present — one document, two renderings, never two copies.
    expect(revision).toContain("A.");
    expect(revision).toContain("B.");

    const beginner = renderDocument(parsed.body, parsed.sections).html;
    expect(beginner).not.toContain("<details");
  });

  it("hides practice-link until Phase 4", () => {
    const parsed = doc("# Title\n\n:::practice-link\nlater\n:::\n");
    const { html } = renderDocument(parsed.body, parsed.sections);
    expect(html).toContain("practice-placeholder");
    expect(html).not.toContain(">Practice<");
  });

  it("puts the derived anchor on the heading it belongs to", () => {
    const parsed = doc(SAMPLE);
    const { html } = renderDocument(parsed.body, parsed.sections);
    expect(html).toContain('id="single-instance-of-each-resource"');
    expect(html).toContain('id="building-the-graph"');
  });

  it("strips the {#anchor} marker from visible heading text", () => {
    const parsed = doc("# Title\n\n## Detection method {#method}\n\nBody.");
    const { html } = renderDocument(parsed.body, parsed.sections);
    expect(html).toContain('id="method"');
    expect(html).not.toContain("{#method}");
  });

  it("renders GFM tables and math", () => {
    const parsed = doc("# Title\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n$E = mc^2$\n");
    const { html } = renderDocument(parsed.body, parsed.sections);
    expect(html).toContain("<table>");
    expect(html).toContain("katex");
  });
});

describe("anchor diffing", () => {
  it("classifies added, removed and kept anchors", () => {
    const diff = diffAnchors(["a", "b", "c"], ["b", "c", "d"]);
    expect(diff.added).toEqual(["d"]);
    expect(diff.removed).toEqual(["a"]);
    expect(diff.kept).toEqual(["b", "c"]);
    expect(diff.unmapped).toEqual(["a"]);
  });

  it("treats an aliased anchor as covered", () => {
    const diff = diffAnchors(["old-name"], ["new-name"], new Map([["old-name", "new-name"]]));
    expect(diff.removed).toEqual(["old-name"]);
    expect(diff.unmapped).toEqual([]);
  });

  it("refuses an alias pointing at an anchor that does not exist", () => {
    // Otherwise the broken link just moves one hop along and still breaks.
    const diff = diffAnchors(["old"], ["actual"], new Map([["old", "also-gone"]]));
    expect(diff.unmapped).toEqual(["old"]);
  });

  it("reports nothing unmapped when the document is unchanged", () => {
    expect(diffAnchors(["a", "b"], ["a", "b"]).unmapped).toEqual([]);
  });
});

describe("design system markup (docs/DESIGN.md §5)", () => {
  // These names are the contract with src/styles/reader/reader.css. A rename on
  // one side without the other still renders — just unstyled — which looks fine
  // in review and wrong to every student afterwards.

  it("maps each directive to its design-system class", () => {
    const cases: [string, string][] = [
      ["idea", "block--idea"],
      ["example", "block--example"],
      ["working", "block--working"],
      ["answer-box", "block--answer"],
      ["exam-tip", "block--tip"],
      ["warning", "block--warning"],
      ["formula", "block--formula"],
    ];

    for (const [directive, className] of cases) {
      const parsed = doc(`# Title\n\n:::${directive}\nBody.\n:::\n`);
      const { html } = renderDocument(parsed.body, parsed.sections);
      expect(html, `${directive} should render ${className}`).toContain(className);
    }
  });

  it("gives every labelled block an icon, so meaning never rests on colour", () => {
    const parsed = doc("# Title\n\n:::warning\nCareful.\n:::\n");
    const { html } = renderDocument(parsed.body, parsed.sections);
    expect(html).toContain('href="#i-alert"');
    expect(html).toContain("Common mistake");
  });

  it("renders a formula with no label row but an accessible name", () => {
    // A label paragraph would interrupt the line of reasoning; a screen reader
    // still needs to know what the box is.
    const parsed = doc('# Title\n\n:::formula{title="Update rule"}\nWork = Work + Allocation[i]\n:::\n');
    const { html } = renderDocument(parsed.body, parsed.sections);
    expect(html).toContain('aria-label="Update rule"');
    expect(html).not.toContain("block__label");
  });

  it("renders a diagram as a figure with its caption", () => {
    const parsed = doc('# Title\n\n:::diagram{title="A wait-for graph"}\nP1 waits on P2.\n:::\n');
    const { html } = renderDocument(parsed.body, parsed.sections);
    expect(html).toContain("<figure>");
    expect(html).toContain("<figcaption>A wait-for graph</figcaption>");
  });

  it("wraps tables so a wide matrix scrolls inside its own box", () => {
    // Otherwise the PAGE scrolls sideways on a phone, which breaks every other
    // column on screen.
    const parsed = doc("# Title\n\n| a | b |\n|---|---|\n| 1 | 2 |\n");
    const { html } = renderDocument(parsed.body, parsed.sections);
    expect(html).toContain('class="table-wrap"');
    expect(html.indexOf("table-wrap")).toBeLessThan(html.indexOf("<table>"));
    // Keyboard users must be able to scroll it too.
    expect(html).toContain('tabindex="0"');
  });

  it("uses the author's title in place of the default label", () => {
    const parsed = doc('# Title\n\n:::example{title="Detection with Available = (0,0,0)"}\nx\n:::\n');
    const { html } = renderDocument(parsed.body, parsed.sections);
    expect(html).toContain("Detection with Available = (0,0,0)");
    expect(html).not.toContain(">Example<");
  });
});

describe("table overflow hint", () => {
  it("emits the hint paragraph after each wrapped table", () => {
    // Hidden by CSS until `.is-scrollable` is set by measurement in the
    // browser; without it a clipped matrix gives a phone reader no sign that
    // columns are missing.
    const parsed = doc("# Title\n\n| a | b |\n|---|---|\n| 1 | 2 |\n");
    const { html } = renderDocument(parsed.body, parsed.sections);

    expect(html).toContain('class="table-hint"');
    expect(html).toContain("Swipe the table sideways");
    // The CSS selector is `.table-wrap.is-scrollable + .table-hint`, so the
    // hint has to be the wrap's immediate SIBLING, not a child.
    expect(html).toMatch(/<\/div>\s*<p class="table-hint">/);
  });

  it("emits one hint per table", () => {
    const parsed = doc(
      "# Title\n\n| a |\n|---|\n| 1 |\n\n## Next\n\n| b |\n|---|\n| 2 |\n"
    );
    const { html } = renderDocument(parsed.body, parsed.sections);
    expect(html.match(/table-hint/g)).toHaveLength(2);
  });
});
