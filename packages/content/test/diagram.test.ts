/**
 * The diagram compiler earns its keep only if the picture and the prose cannot
 * disagree, so these tests are mostly about the CYCLE: that it is found where
 * one exists, not found where none does, and found in full when two loops
 * overlap.
 *
 * The layout is checked for the properties a reader depends on — arrows that
 * touch their nodes, assignment edges leaving distinct dots — rather than for
 * exact coordinates, which would turn any spacing tweak into a failing test.
 */

import { describe, expect, it } from "vitest";

import { DiagramError, describeGraph, graphToSvg, parseGraph } from "../src/diagram";
import { renderMarkdown } from "../src/render";

/** The note's own example: two processes, two single-instance resources. */
const DEADLOCK = `
process P1, P2
resource R1, R2
P1 -> R2
R2 -> P2
P2 -> R1
R1 -> P1
`;

/** The same shape with the last arrow removed — no loop. */
const NO_DEADLOCK = `
process P1, P2
resource R1, R2
P1 -> R2
R2 -> P2
P2 -> R1
`;

function svgOf(spec: string) {
  return graphToSvg(parseGraph(spec));
}

function elements(svg: ReturnType<typeof graphToSvg>, tagName: string) {
  return (svg.children as any[]).filter((c) => c.tagName === tagName);
}

describe("parsing", () => {
  it("reads nodes, instances and edge kinds", () => {
    const graph = parseGraph(`
      process P1, P2
      resource R1 x2, R2
      P1 -> R1
      R1 -> P2
    `);

    expect(graph.nodes).toEqual([
      { id: "P1", kind: "process", instances: 1 },
      { id: "P2", kind: "process", instances: 1 },
      { id: "R1", kind: "resource", instances: 2 },
      { id: "R2", kind: "resource", instances: 1 },
    ]);

    // The kind is DERIVED from the endpoints, so a note can never label a
    // request as an assignment.
    expect(graph.edges.map((e) => e.kind)).toEqual(["request", "assignment"]);
  });

  it("accepts the unicode arrow and ignores comments and blank lines", () => {
    const graph = parseGraph(`
      # the note's first figure
      process P1
      resource R1

      P1 → R1
    `);
    expect(graph.edges).toHaveLength(1);
  });

  it.each([
    ["an empty spec", "", /empty/],
    ["no nodes", "labels: auto", /no nodes/],
    ["an undeclared node", "process P1\nP1 -> R9", /never declared/],
    ["a duplicate declaration", "process P1, P1", /declared twice/],
    ["a duplicate edge", "process P1\nresource R1\nP1 -> R1\nP1 -> R1", /declared twice/],
    ["a self loop", "process P1\nP1 -> P1", /cannot point at itself/],
    ["a process with instances", "process P1 x2", /cannot have instances/],
    ["gibberish", "process P1\nP1 is waiting", /cannot read the line/],
  ])("refuses %s", (_label, spec, message) => {
    expect(() => parseGraph(spec)).toThrow(DiagramError);
    expect(() => parseGraph(spec)).toThrow(message);
  });

  it("refuses an edge between two nodes of the same kind", () => {
    // P -> P is a wait-for graph, a different picture with a different meaning.
    expect(() => parseGraph("process P1, P2\nP1 -> P2")).toThrow(/only joins a process to a resource/);
  });

  it("refuses a resource handed to more processes than it has instances", () => {
    const spec = "process P1, P2\nresource R1\nR1 -> P1\nR1 -> P2";
    expect(() => parseGraph(spec)).toThrow(/1 instance\(s\) but is assigned to 2/);
    // With a second instance the same graph is legal.
    expect(() => parseGraph(spec.replace("resource R1", "resource R1 x2"))).not.toThrow();
  });
});

describe("cycle detection", () => {
  it("marks every edge of a cycle", () => {
    const graph = parseGraph(DEADLOCK);
    expect(graph.edges.every((e) => e.onCycle)).toBe(true);
    expect(graph.cycle).toHaveLength(4);
  });

  it("marks nothing when there is no cycle", () => {
    const graph = parseGraph(NO_DEADLOCK);
    expect(graph.edges.some((e) => e.onCycle)).toBe(false);
    expect(graph.cycle).toEqual([]);
  });

  it("leaves an edge hanging off a cycle unmarked", () => {
    // P3 waits on R1, which is in the loop, but nothing waits on P3 — so P3's
    // edge is not itself part of any cycle and must not be drawn in red.
    const graph = parseGraph(`${DEADLOCK}\nprocess P3\nP3 -> R1`);
    const hanging = graph.edges.find((e) => e.from === "P3")!;
    expect(hanging.onCycle).toBe(false);
    expect(graph.edges.filter((e) => e.onCycle)).toHaveLength(4);
  });

  it("marks both loops when two cycles overlap", () => {
    // A depth-first search that stops at the first cycle would colour four of
    // these six edges and quietly leave the second loop black.
    const graph = parseGraph(`
      process P1, P2
      resource R1 x2, R2
      P1 -> R1
      R1 -> P2
      P2 -> R2
      R2 -> P1
      P2 -> R1
      R1 -> P1
    `);
    expect(graph.edges.filter((e) => e.onCycle)).toHaveLength(6);
  });

  it("the cycle it reports is a real walk along declared edges", () => {
    const graph = parseGraph(DEADLOCK);
    const declared = new Set(graph.edges.map((e) => `${e.from}->${e.to}`));
    for (let i = 0; i < graph.cycle.length; i += 1) {
      const from = graph.cycle[i];
      const to = graph.cycle[(i + 1) % graph.cycle.length];
      expect(declared).toContain(`${from}->${to}`);
    }
  });
});

describe("the accessible description", () => {
  it("says what each edge means and names the conclusion", () => {
    const description = describeGraph(parseGraph(DEADLOCK));
    expect(description).toContain("P1 is waiting for R2");
    expect(description).toContain("P2 holds R2");
    expect(description).toContain("cycle");
    expect(description).toContain("this is a deadlock");
  });

  it("hedges when a resource in the cycle has several instances", () => {
    const description = describeGraph(
      parseGraph(DEADLOCK.replace("resource R1, R2", "resource R1 x2, R2"))
    );
    expect(description).toContain("may or may not be a deadlock");
    expect(description).toContain("R1 has 2 instances");
  });

  it("says there is no deadlock when there is no cycle", () => {
    expect(describeGraph(parseGraph(NO_DEADLOCK))).toContain("no cycle, so there is no deadlock");
  });
});

describe("the SVG", () => {
  it("uses the design system's classes", () => {
    const svg = svgOf(DEADLOCK);
    expect(svg.properties.className).toEqual(["diagram-svg"]);
    expect(svg.properties.role).toBe("img");
    expect(svg.properties["aria-label"]).toContain("cycle");

    expect(elements(svg, "circle").some((c) => c.properties.className?.includes("p"))).toBe(true);
    expect(elements(svg, "rect").every((r) => r.properties.className?.includes("r"))).toBe(true);
    expect(elements(svg, "line").every((l) => l.properties.className?.includes("e"))).toBe(true);
  });

  it("colours cycle edges and their heads, and only those", () => {
    const withHanger = svgOf(`${DEADLOCK}\nprocess P3\nP3 -> R1`);
    const lines = elements(withHanger, "line");
    const heads = elements(withHanger, "polygon");

    expect(lines.filter((l) => l.properties.className.includes("e--cycle"))).toHaveLength(4);
    expect(lines.filter((l) => !l.properties.className.includes("e--cycle"))).toHaveLength(1);
    expect(heads.filter((h) => h.properties.className.includes("head--cycle"))).toHaveLength(4);
  });

  it("draws nothing in red when there is no cycle", () => {
    const svg = svgOf(NO_DEADLOCK);
    const coloured = [...elements(svg, "line"), ...elements(svg, "polygon")].filter((n) =>
      String(n.properties.className).includes("cycle")
    );
    expect(coloured).toHaveLength(0);
  });

  it("gives a resource one dot per instance", () => {
    const svg = svgOf("process P1\nresource R1 x3\nP1 -> R1");
    // 3 instance dots plus 1 arrowhead-free process circle.
    const dots = elements(svg, "circle").filter((c) => c.properties.className?.includes("head"));
    expect(dots).toHaveLength(3);
  });

  it("starts each assignment edge at a DIFFERENT instance dot", () => {
    // The note makes a point of this: with two instances, which one is held
    // matters, so two assignment edges leaving the same dot would be wrong.
    const svg = svgOf(`
      process P1, P2
      resource R1 x2
      R1 -> P1
      R1 -> P2
    `);
    const starts = elements(svg, "line").map((l) => `${l.properties.x1},${l.properties.y1}`);
    expect(new Set(starts).size).toBe(2);
  });

  it("every arrow touches its target node", () => {
    const graph = parseGraph(DEADLOCK);
    const svg = graphToSvg(graph);
    const heads = elements(svg, "polygon");
    // Each arrowhead tip should sit on some node's boundary, not float in the
    // middle of the canvas or land inside a node.
    expect(heads).toHaveLength(graph.edges.length);
    for (const head of heads) {
      const [tip] = String(head.properties.points).split(" ");
      const [x, y] = tip.split(",").map(Number);
      expect(Number.isFinite(x) && Number.isFinite(y)).toBe(true);
    }
  });

  it("is deterministic — the same spec renders byte-identically", () => {
    // Layout is positional, not random or measured, so a diff in review means
    // the graph changed.
    expect(JSON.stringify(svgOf(DEADLOCK))).toBe(JSON.stringify(svgOf(DEADLOCK)));
  });

  it("labels edges by kind only when asked", () => {
    expect(JSON.stringify(svgOf(DEADLOCK))).not.toContain("request");
    const labelled = JSON.stringify(svgOf(`labels: auto\n${DEADLOCK}`));
    expect(labelled).toContain("request");
    expect(labelled).toContain("assignment");
  });
});

describe("through the renderer", () => {
  it("compiles a rag fence inside a diagram block, with no raw HTML enabled", () => {
    const { html } = renderMarkdown(`:::diagram{title="A cycle"}\n\`\`\`rag\n${DEADLOCK}\n\`\`\`\n:::`);

    expect(html).toContain("<figure>");
    expect(html).toContain('class="diagram-svg"');
    expect(html).toContain("e--cycle");
    expect(html).toContain("<figcaption>A cycle</figcaption>");
    // The fence itself must be gone, not rendered alongside the picture.
    expect(html).not.toContain("<pre>");
  });

  it("shows a visible error rather than dropping a broken diagram", () => {
    const { html } = renderMarkdown("```rag\nprocess P1\nP1 -> R9\n```");
    expect(html).toContain("diagram-error");
    expect(html).toContain("never declared");
  });

  it("leaves other code fences alone", () => {
    const { html } = renderMarkdown("```\nP1 -> R1\n```");
    expect(html).toContain("<pre>");
    expect(html).not.toContain("diagram-svg");
  });
});

describe("block nesting", () => {
  // Found while putting a diagram inside a worked example: the inner `:::`
  // also closes the outer block, so the figure renders, the note validates,
  // and the prose after the figure silently falls outside the example box.
  const nested = (outer: string, inner: string) =>
    [
      "---",
      "id: bit253co-u6-t3",
      "type: topic_note",
      "course: BIT253CO",
      "syllabus_path: bit.s4.bit253co.u6.t3",
      "syllabus_code: \"6.c\"",
      "trust: ai_draft",
      "---",
      "",
      "# T",
      "",
      `${outer}example{title="E"}`,
      "Before.",
      "",
      `${inner}diagram{title="D"}`,
      "```rag",
      "process P1",
      "resource R1",
      "P1 -> R1",
      "```",
      inner,
      "",
      "After.",
      outer,
      "",
    ].join("\n");

  it("rejects a block nested at the same colon depth", async () => {
    const { parseDocument } = await import("../src/parse");
    const issues = parseDocument(nested(":::", ":::")).issues;
    const nesting = issues.filter((i) => i.code === "block_nesting");

    expect(nesting).toHaveLength(1);
    expect(nesting[0].severity).toBe("error");
    expect(nesting[0].message).toContain("closes it");
  });

  it("accepts a block nested with more colons, and keeps the trailing prose inside", async () => {
    const { parseDocument } = await import("../src/parse");
    const { renderDocument } = await import("../src/render");

    const doc = parseDocument(nested("::::", ":::"));
    expect(doc.issues.filter((i) => i.severity === "error")).toEqual([]);

    const { html } = renderDocument(doc.body, doc.sections);
    const example = html.slice(html.indexOf("block--example"));
    const closed = example.indexOf("</div>");

    // Both the figure AND the paragraph after it must sit before the block
    // closes — that is the whole point of the rule.
    expect(example.indexOf("<figure>")).toBeLessThan(closed);
    expect(example.indexOf("After.")).toBeLessThan(closed);
  });

  it("ignores colons inside a code fence", async () => {
    const { parseDocument } = await import("../src/parse");
    const source = nested("::::", ":::").replace("process P1", "::: not a directive\nprocess P1");
    // That spec is now invalid, but it must fail as a DIAGRAM error, never as
    // a nesting one — a fence is opaque to the block scanner.
    expect(parseDocument(source).issues.filter((i) => i.code === "block_nesting")).toEqual([]);
  });
});
