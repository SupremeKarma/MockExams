// Resource allocation graphs, compiled from a text spec to SVG.
//
// ## Why this exists rather than raw SVG in the markdown
//
// The renderer sets `allowDangerousHtml: false` on purpose, so a note cannot
// contain author-written HTML. That rule is worth keeping, and it means a
// diagram has to be GENERATED rather than pasted.
//
// Generating it buys something the pasted version could never have: the cycle
// is FOUND, not asserted. An author who draws a graph by hand and colours in
// the loop they think they see can be wrong, and a deadlock note whose picture
// contradicts its own prose is worse than no picture. Here the red edges come
// out of a strongly-connected-components pass over the edges the author
// declared, so the drawing and the claim cannot disagree.
//
// It also means the graph can describe itself: the `aria-label` is written from
// the same edge list, so a student using a screen reader gets the sentence
// version of the picture instead of nothing at all.
//
// ## The spec
//
//     process P1, P2
//     resource R1, R2 x2
//     P1 -> R2
//     R2 -> P2
//
// `x2` gives a resource two instances. `P -> R` is a request (P is waiting),
// `R -> P` is an assignment (P holds it); which one an edge is follows from the
// kinds of its endpoints, so it is never stated twice and cannot be stated
// inconsistently.
//
// The class names (`p`, `r`, `e`, `e--cycle`, `head`, `head--cycle`, `cap`)
// are the contract with `.diagram-svg` in src/styles/reader/reader.css.

export type NodeKind = "process" | "resource";

export interface GraphNode {
  id: string;
  kind: NodeKind;
  /** Resource instances. Always 1 for a process. */
  instances: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  /** Derived from the endpoints, never authored. */
  kind: "request" | "assignment";
  /** True when this edge lies on a directed cycle. */
  onCycle: boolean;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** Node ids forming one cycle, in order, for the description. Empty if none. */
  cycle: string[];
  /** Show "request"/"assignment" beside each edge. */
  showLabels: boolean;
}

export class DiagramError extends Error {}

const DECLARATION = /^(process|resource)\s+(.+)$/i;
const EDGE = /^([A-Za-z][\w]*)\s*(?:->|→)\s*([A-Za-z][\w]*)$/;
const OPTION = /^labels:\s*(auto|off)$/i;
const INSTANCES = /^([A-Za-z][\w]*)(?:\s*[x×]\s*(\d+))?$/;

/**
 * Parse the spec. Throws on anything it does not understand rather than
 * skipping the line: a typo that silently drops an edge would produce a graph
 * missing the very arrow the question turns on.
 */
export function parseGraph(source: string): Graph {
  const nodes = new Map<string, GraphNode>();
  const rawEdges: { from: string; to: string }[] = [];
  let showLabels = false;

  const lines = source
    .split("\n")
    .map((l) => l.replace(/#.*$/, "").trim())
    .filter(Boolean);

  if (lines.length === 0) throw new DiagramError("the diagram spec is empty");

  for (const line of lines) {
    const option = OPTION.exec(line);
    if (option) {
      showLabels = option[1].toLowerCase() === "auto";
      continue;
    }

    const declaration = DECLARATION.exec(line);
    if (declaration) {
      const kind = declaration[1].toLowerCase() as NodeKind;
      for (const part of declaration[2].split(",")) {
        const item = INSTANCES.exec(part.trim());
        if (!item) throw new DiagramError(`cannot read the declaration "${part.trim()}"`);

        const [, id, count] = item;
        if (nodes.has(id)) throw new DiagramError(`"${id}" is declared twice`);

        const instances = count ? Number(count) : 1;
        if (kind === "process" && count) {
          throw new DiagramError(`"${id}" is a process, so it cannot have instances`);
        }
        if (instances < 1 || instances > 8) {
          throw new DiagramError(`"${id}" needs between 1 and 8 instances, not ${instances}`);
        }
        nodes.set(id, { id, kind, instances });
      }
      continue;
    }

    const edge = EDGE.exec(line);
    if (edge) {
      rawEdges.push({ from: edge[1], to: edge[2] });
      continue;
    }

    throw new DiagramError(`cannot read the line "${line}"`);
  }

  if (nodes.size === 0) throw new DiagramError("the diagram declares no nodes");

  const seen = new Set<string>();
  for (const { from, to } of rawEdges) {
    for (const id of [from, to]) {
      if (!nodes.has(id)) throw new DiagramError(`"${id}" is used in an edge but never declared`);
    }
    if (from === to) throw new DiagramError(`"${from}" cannot point at itself`);

    const key = `${from}\u0000${to}`;
    if (seen.has(key)) throw new DiagramError(`the edge ${from} -> ${to} is declared twice`);
    seen.add(key);

    // The graph is bipartite by construction: an arrow only ever runs between a
    // process and a resource. P -> P would mean a wait-for graph, which is a
    // different picture with a different meaning (see 6.d), so it is refused
    // here rather than drawn as though it were a resource graph.
    if (nodes.get(from)!.kind === nodes.get(to)!.kind) {
      throw new DiagramError(
        `${from} -> ${to} joins two ${nodes.get(from)!.kind}s; a resource allocation graph only joins a process to a resource`
      );
    }
  }

  const order = [...nodes.values()];
  const onCycle = edgesOnCycles(order, rawEdges);

  const edges: GraphEdge[] = rawEdges.map(({ from, to }) => ({
    from,
    to,
    kind: nodes.get(from)!.kind === "process" ? "request" : "assignment",
    onCycle: onCycle.has(`${from}\u0000${to}`),
  }));

  assertInstancesNotOversubscribed(order, edges);

  return { nodes: order, edges, cycle: findCycle(order, rawEdges), showLabels };
}

/**
 * A resource cannot hand out more instances than it has.
 *
 * Worth refusing rather than drawing: a graph with three assignment edges
 * leaving a single-instance box is not a hard graph, it is a wrong one, and a
 * student copying it into an exam would lose the marks the picture was meant
 * to earn.
 */
function assertInstancesNotOversubscribed(nodes: GraphNode[], edges: GraphEdge[]): void {
  for (const node of nodes) {
    if (node.kind !== "resource") continue;
    const held = edges.filter((e) => e.kind === "assignment" && e.from === node.id).length;
    if (held > node.instances) {
      throw new DiagramError(
        `${node.id} has ${node.instances} instance(s) but is assigned to ${held} process(es)`
      );
    }
  }
}

/**
 * Every edge that lies on some directed cycle.
 *
 * Tarjan's strongly connected components: an edge is on a cycle exactly when
 * its two endpoints share an SCC of more than one node. That is the whole
 * definition, so this reports every cycle including overlapping ones — which a
 * single depth-first walk looking for "a" cycle would not.
 */
function edgesOnCycles(
  nodes: GraphNode[],
  edges: { from: string; to: string }[]
): Set<string> {
  const index = new Map<string, number>();
  const low = new Map<string, number>();
  const onStack = new Set<string>();
  const stack: string[] = [];
  const component = new Map<string, number>();
  let counter = 0;
  let components = 0;

  const out = new Map<string, string[]>();
  for (const node of nodes) out.set(node.id, []);
  for (const edge of edges) out.get(edge.from)!.push(edge.to);

  const strongconnect = (v: string): void => {
    index.set(v, counter);
    low.set(v, counter);
    counter += 1;
    stack.push(v);
    onStack.add(v);

    for (const w of out.get(v) ?? []) {
      if (!index.has(w)) {
        strongconnect(w);
        low.set(v, Math.min(low.get(v)!, low.get(w)!));
      } else if (onStack.has(w)) {
        low.set(v, Math.min(low.get(v)!, index.get(w)!));
      }
    }

    if (low.get(v) === index.get(v)) {
      let w: string;
      do {
        w = stack.pop()!;
        onStack.delete(w);
        component.set(w, components);
      } while (w !== v);
      components += 1;
    }
  };

  for (const node of nodes) if (!index.has(node.id)) strongconnect(node.id);

  const sizes = new Map<number, number>();
  for (const id of component.values()) sizes.set(id, (sizes.get(id) ?? 0) + 1);

  const result = new Set<string>();
  for (const edge of edges) {
    const a = component.get(edge.from)!;
    if (a === component.get(edge.to)! && sizes.get(a)! > 1) {
      result.add(`${edge.from}\u0000${edge.to}`);
    }
  }
  return result;
}

/** One cycle, as an ordered node list, for the spoken description. */
function findCycle(nodes: GraphNode[], edges: { from: string; to: string }[]): string[] {
  const out = new Map<string, string[]>();
  for (const node of nodes) out.set(node.id, []);
  for (const edge of edges) out.get(edge.from)!.push(edge.to);

  const state = new Map<string, 0 | 1 | 2>();
  const path: string[] = [];
  let found: string[] = [];

  const walk = (v: string): boolean => {
    state.set(v, 1);
    path.push(v);
    for (const w of out.get(v) ?? []) {
      if (state.get(w) === 1) {
        found = path.slice(path.indexOf(w));
        return true;
      }
      if (!state.has(w) && walk(w)) return true;
    }
    path.pop();
    state.set(v, 2);
    return false;
  };

  for (const node of nodes) {
    if (!state.has(node.id) && walk(node.id)) break;
  }
  return found;
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

const PROCESS_R = 24;
const RESOURCE_H = 46;
const DOT_R = 4;
const DOT_GAP = 15;
const ARROW = 9;
const PAD = 26;

interface Placed extends GraphNode {
  x: number;
  y: number;
  /** Half-width and half-height of the node's box, for edge clipping. */
  hw: number;
  hh: number;
}

function resourceWidth(instances: number): number {
  return Math.max(52, instances * DOT_GAP + 26);
}

/**
 * Nodes on a circle, ordered by the cycle when there is one.
 *
 * A circle is the right default here specifically BECAUSE these graphs are
 * drawn to show cycles — but only if the cycle's nodes are ADJACENT on it.
 * Placing them in declaration order instead sends the loop straight across the
 * middle as a crossing star, which is the one shape a reader must not have to
 * untangle in the diagram whose whole job is to make a loop obvious.
 *
 * So the cycle walks the ring first, and everything else follows in
 * declaration order. Both orderings are positional rather than measured or
 * random, so the same spec always produces byte-identical SVG and a diff in
 * review means the graph actually changed.
 */
function ringOrder(graph: Graph): GraphNode[] {
  if (graph.cycle.length === 0) return graph.nodes;

  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const ring = graph.cycle.map((id) => byId.get(id)!);
  const onRing = new Set(graph.cycle);
  return [...ring, ...graph.nodes.filter((n) => !onRing.has(n.id))];
}

function layout(graph: Graph): { placed: Placed[]; width: number; height: number } {
  const order = ringOrder(graph);
  const n = order.length;
  const radius = n <= 2 ? 90 : Math.max(105, 22 * n + 40);

  // Start at the top and go clockwise.
  const placed: Placed[] = order.map((node, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
    const hw = node.kind === "process" ? PROCESS_R : resourceWidth(node.instances) / 2;
    const hh = node.kind === "process" ? PROCESS_R : RESOURCE_H / 2;
    return { ...node, x: radius * Math.cos(angle), y: radius * Math.sin(angle), hw, hh };
  });

  const maxHw = Math.max(...placed.map((p) => p.hw));
  const maxHh = Math.max(...placed.map((p) => p.hh));
  const width = 2 * (radius + maxHw + PAD);
  const height = 2 * (radius + maxHh + PAD);

  for (const p of placed) {
    p.x += width / 2;
    p.y += height / 2;
  }

  return { placed, width, height };
}

/** Where a straight line towards `to` leaves the boundary of `from`. */
function boundary(from: Placed, to: { x: number; y: number }): { x: number; y: number } {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;

  if (from.kind === "process") {
    return { x: from.x + (dx / length) * from.hw, y: from.y + (dy / length) * from.hh };
  }

  // Rectangle: scale the direction until it touches the nearer pair of sides.
  const scale = Math.min(
    from.hw / (Math.abs(dx) || 1e-6),
    from.hh / (Math.abs(dy) || 1e-6)
  );
  return { x: from.x + dx * scale, y: from.y + dy * scale };
}

/** The instance dots of a resource, left to right. */
function dots(node: Placed): { x: number; y: number }[] {
  const span = (node.instances - 1) * DOT_GAP;
  return Array.from({ length: node.instances }, (_, i) => ({
    x: node.x - span / 2 + i * DOT_GAP,
    y: node.y + 11,
  }));
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

interface El {
  type: "element";
  tagName: string;
  properties: Record<string, unknown>;
  children: unknown[];
}

function el(tagName: string, properties: Record<string, unknown>, children: unknown[] = []): El {
  return { type: "element", tagName, properties, children };
}

function text(value: string) {
  return { type: "text", value };
}

/**
 * A sentence describing the graph, used as the SVG's accessible name.
 *
 * This is the diagram for a blind student, so it says what the picture says —
 * every edge in words, then the conclusion — rather than "resource allocation
 * graph", which tells them only that they are missing something.
 */
export function describeGraph(graph: Graph): string {
  const parts = [`Resource allocation graph with ${graph.nodes.length} nodes.`];

  for (const node of graph.nodes) {
    if (node.kind === "resource" && node.instances > 1) {
      parts.push(`${node.id} has ${node.instances} instances.`);
    }
  }

  for (const edge of graph.edges) {
    parts.push(
      edge.kind === "request"
        ? `${edge.from} is waiting for ${edge.to}.`
        : `${edge.to} holds ${edge.from}.`
    );
  }

  if (graph.cycle.length > 0) {
    const loop = [...graph.cycle, graph.cycle[0]].join(" to ");
    const single = graph.nodes
      .filter((n) => n.kind === "resource" && graph.cycle.includes(n.id))
      .every((n) => n.instances === 1);
    parts.push(
      `These form a cycle: ${loop}.`,
      single
        ? "Every resource in the cycle has one instance, so this is a deadlock."
        : "A resource in the cycle has several instances, so this may or may not be a deadlock."
    );
  } else {
    parts.push("There is no cycle, so there is no deadlock.");
  }

  return parts.join(" ");
}

/** Compile a spec to a hast `<svg>` element. */
export function graphToSvg(graph: Graph): El {
  const { placed, width, height } = layout(graph);
  const byId = new Map(placed.map((p) => [p.id, p]));

  // How many assignment edges this resource has already drawn, so each one
  // leaves a DIFFERENT dot. The note makes a point of this: with several
  // instances, which one is held is part of the answer.
  const dotsUsed = new Map<string, number>();

  const nodeLayer: El[] = [];
  const edgeLayer: El[] = [];
  const dotLayer: El[] = [];
  const labelLayer: El[] = [];

  for (const node of placed) {
    if (node.kind === "process") {
      nodeLayer.push(
        el("circle", {
          className: ["p"],
          cx: round(node.x),
          cy: round(node.y),
          r: PROCESS_R,
        })
      );
      labelLayer.push(
        el(
          "text",
          {
            x: round(node.x),
            y: round(node.y),
            "text-anchor": "middle",
            "dominant-baseline": "central",
          },
          [text(node.id)]
        )
      );
    } else {
      const w = resourceWidth(node.instances);
      nodeLayer.push(
        el("rect", {
          className: ["r"],
          x: round(node.x - w / 2),
          y: round(node.y - RESOURCE_H / 2),
          width: round(w),
          height: RESOURCE_H,
          rx: 4,
        })
      );
      labelLayer.push(
        el("text", { x: round(node.x), y: round(node.y - 6), "text-anchor": "middle" }, [
          text(node.id),
        ])
      );
      for (const dot of dots(node)) {
        dotLayer.push(
          el("circle", {
            className: ["head"],
            cx: round(dot.x),
            cy: round(dot.y),
            r: DOT_R,
          })
        );
      }
    }
  }

  for (const edge of graph.edges) {
    const from = byId.get(edge.from)!;
    const to = byId.get(edge.to)!;

    // An assignment starts at a specific instance dot rather than the box edge.
    let start: { x: number; y: number };
    if (edge.kind === "assignment") {
      const used = dotsUsed.get(from.id) ?? 0;
      dotsUsed.set(from.id, used + 1);
      start = dots(from)[used] ?? { x: from.x, y: from.y };
    } else {
      start = boundary(from, to);
    }

    const end = boundary(to, start);
    const edgeClass = edge.onCycle ? ["e", "e--cycle"] : ["e"];
    const headClass = edge.onCycle ? ["head", "head--cycle"] : ["head"];

    // Stop the line short of the arrowhead, or a thick stroke pokes out of the
    // tip and the arrow looks blunt.
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy) || 1;
    const tail = {
      x: end.x - (dx / length) * (ARROW - 1),
      y: end.y - (dy / length) * (ARROW - 1),
    };

    edgeLayer.push(
      el("line", {
        className: edgeClass,
        x1: round(start.x),
        y1: round(start.y),
        x2: round(tail.x),
        y2: round(tail.y),
      })
    );
    edgeLayer.push(el("polygon", { className: headClass, points: arrowhead(end, dx / length, dy / length) }));

    if (graph.showLabels) {
      const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };

      // Offset perpendicular to the line, on whichever side points AWAY from
      // the middle of the canvas. Picking a fixed side puts half the labels
      // inside the ring, where they land on the opposite edge; the nodes sit
      // on a circle, so "outward" is reliably clear space.
      const nx = -dy / length;
      const ny = dx / length;
      const outward = (mid.x - width / 2) * nx + (mid.y - height / 2) * ny >= 0 ? 1 : -1;

      // Clear the line by the label's own extent in the offset direction, not
      // by a fixed number of pixels. A steep edge offsets the label sideways,
      // and "assignment" is eighty pixels wide — a flat 16px pushed the middle
      // of the word onto the arrow it was labelling.
      const halfW = edge.kind.length * 3.3;
      const halfH = 7;
      const clearance = 9 + halfW * Math.abs(nx) + halfH * Math.abs(ny);

      labelLayer.push(
        el(
          "text",
          {
            className: ["cap"],
            x: round(mid.x + nx * outward * clearance),
            y: round(mid.y + ny * outward * clearance),
            "text-anchor": "middle",
            "dominant-baseline": "central",
          },
          [text(edge.kind)]
        )
      );
    }
  }

  return el(
    "svg",
    {
      className: ["diagram-svg"],
      viewBox: `0 0 ${round(width)} ${round(height)}`,
      role: "img",
      "aria-label": describeGraph(graph),
    },
    // Nodes first, then edges over them: an assignment edge leaves a dot INSIDE
    // the resource box, so it has to draw on top of the fill. Dots and labels
    // go last so a line never obscures a name.
    [...nodeLayer, ...edgeLayer, ...dotLayer, ...labelLayer]
  );
}

function arrowhead(tip: { x: number; y: number }, ux: number, uy: number): string {
  // Perpendicular, for the two back corners.
  const px = -uy;
  const py = ux;
  const back = { x: tip.x - ux * ARROW, y: tip.y - uy * ARROW };
  const half = ARROW * 0.42;
  return [
    `${round(tip.x)},${round(tip.y)}`,
    `${round(back.x + px * half)},${round(back.y + py * half)}`,
    `${round(back.x - px * half)},${round(back.y - py * half)}`,
  ].join(" ");
}
