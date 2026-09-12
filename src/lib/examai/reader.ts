import "server-only";

import { readQuery } from "./content-db";

// Every query the Reader makes. All of them go through `readQuery`, which uses
// the restricted pool — so none of this can reach a draft even if a WHERE
// clause here were wrong.
//
// The views already filter to published/active, which is why these queries look
// unguarded. That is the point: the guard lives one layer down, in the
// database, where a code change cannot remove it by accident.

export interface ReaderDocument {
  uuid: string;
  short_id: string;
  title: string;
  node_uuid: string;
  trust_level: "ai_draft" | "code_verified" | "teacher_verified";
  version: number;
  version_uuid: string;
  published_at: string | null;
}

export interface ReaderSection {
  anchor: string;
  level: 1 | 2 | 3;
  heading: string;
  heading_path: string;
  body_md: string;
  order_index: number;
  parent_section_uuid: string | null;
  uuid: string;
}

export interface SpineNode {
  uuid: string;
  path: string;
  kind: "program" | "semester" | "course" | "unit" | "topic" | "subtopic";
  code: string | null;
  title: string;
  order_index: number;
  hours: string | null;
  depth: number;
}

export interface TreeNode extends SpineNode {
  children: TreeNode[];
  /** short_id of the published note for this node, if one exists. */
  shortId: string | null;
  slug: string | null;
}

export async function getDocumentByShortId(shortId: string): Promise<ReaderDocument | null> {
  const rows = await readQuery<ReaderDocument>(
    `SELECT uuid, short_id, title, node_uuid, trust_level, version, version_uuid, published_at
       FROM examai.published_documents
      WHERE short_id = $1`,
    [shortId]
  );
  return rows[0] ?? null;
}

export async function getSections(versionUuid: string): Promise<ReaderSection[]> {
  return readQuery<ReaderSection>(
    `SELECT uuid, anchor, level, heading, heading_path, body_md, order_index, parent_section_uuid
       FROM examai.published_sections
      WHERE document_version_uuid = $1
      ORDER BY order_index`,
    [versionUuid]
  );
}

/**
 * Resolve an old anchor to where it lives now.
 *
 * A student's bookmark to `#deadlock-detection` must keep working after the
 * heading is reworded. Without this the link does not error — it lands silently
 * at the top of the page, which reads as the reader's mistake rather than ours.
 */
export async function resolveAnchorAlias(
  documentUuid: string,
  anchor: string
): Promise<string | null> {
  const rows = await readQuery<{ new_anchor: string }>(
    `SELECT new_anchor FROM examai.published_anchor_aliases
      WHERE document_uuid = $1 AND old_anchor = $2`,
    [documentUuid, anchor]
  );
  return rows[0]?.new_anchor ?? null;
}

export async function getNode(nodeUuid: string): Promise<SpineNode | null> {
  const rows = await readQuery<SpineNode>(
    `SELECT uuid, path::text, kind, code, title, order_index, hours, depth
       FROM examai.published_syllabus WHERE uuid = $1`,
    [nodeUuid]
  );
  return rows[0] ?? null;
}

/** Program → … → this node. Breadcrumbs, in one query. */
export async function getAncestors(path: string): Promise<SpineNode[]> {
  return readQuery<SpineNode>(
    `SELECT uuid, path::text, kind, code, title, order_index, hours, depth
       FROM examai.published_syllabus
      WHERE path @> $1::ltree
      ORDER BY depth`,
    [path]
  );
}

/**
 * The course tree for the left pane, with each node's published note attached.
 *
 * One flat query plus an in-memory assemble. A course with 9 units and 34
 * topics would otherwise be 44 round trips to draw one sidebar, on every page
 * load.
 */
export async function getCourseTree(coursePath: string): Promise<TreeNode | null> {
  const rows = await readQuery<SpineNode & { short_id: string | null; doc_title: string | null }>(
    `SELECT n.uuid, n.path::text, n.kind, n.code, n.title, n.order_index, n.hours, n.depth,
            d.short_id, d.title AS doc_title
       FROM examai.published_syllabus n
       LEFT JOIN examai.published_documents d ON d.node_uuid = n.uuid
      WHERE n.path <@ $1::ltree
      ORDER BY n.depth, n.path`,
    [coursePath]
  );

  if (rows.length === 0) return null;

  const byPath = new Map<string, TreeNode>();
  let root: TreeNode | null = null;

  for (const row of rows) {
    const node: TreeNode = {
      ...row,
      children: [],
      shortId: row.short_id,
      slug: row.doc_title ? slugify(row.doc_title) : null,
    };
    byPath.set(node.path, node);

    const parentPath = node.path.slice(0, node.path.lastIndexOf("."));
    const parent = parentPath && parentPath !== node.path ? byPath.get(parentPath) : undefined;
    if (parent) parent.children.push(node);
    else root ??= node;
  }

  return root;
}

export interface AdjacentTopic {
  shortId: string;
  title: string;
  slug: string;
  code: string | null;
}

/**
 * Previous and next topic in syllabus order.
 *
 * Ordered by `path`, which encodes position (`u6.t4`) — so this is print order
 * without a recursive walk. Only nodes that actually have a published note are
 * candidates: linking to a topic with no page would be a dead end.
 */
export async function getAdjacentTopics(
  coursePath: string,
  currentPath: string
): Promise<{ previous: AdjacentTopic | null; next: AdjacentTopic | null }> {
  const rows = await readQuery<{ path: string; title: string; code: string | null; short_id: string }>(
    `SELECT n.path::text, n.title, n.code, d.short_id
       FROM examai.published_syllabus n
       JOIN examai.published_documents d ON d.node_uuid = n.uuid
      WHERE n.path <@ $1::ltree
      ORDER BY n.path`,
    [coursePath]
  );

  const index = rows.findIndex((r) => r.path === currentPath);
  if (index === -1) return { previous: null, next: null };

  const toAdjacent = (row: (typeof rows)[number] | undefined): AdjacentTopic | null =>
    row ? { shortId: row.short_id, title: row.title, slug: slugify(row.title), code: row.code } : null;

  return { previous: toAdjacent(rows[index - 1]), next: toAdjacent(rows[index + 1]) };
}

export async function getCourseByCode(code: string): Promise<SpineNode | null> {
  const rows = await readQuery<SpineNode>(
    `SELECT uuid, path::text, kind, code, title, order_index, hours, depth
       FROM examai.published_syllabus
      WHERE kind = 'course' AND lower(code) = lower($1)`,
    [code]
  );
  return rows[0] ?? null;
}

/** URL slug from a title. Cosmetic — `short_id` is what actually resolves. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
