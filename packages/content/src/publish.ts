// The publish pipeline.
//
// One transaction: insert the version, insert its sections, then move the
// document's pointer. A reader either sees the old version or the new one,
// never a half-written set of sections — which is what a multi-statement
// update without a transaction would expose, briefly, to whoever loaded the
// page at the wrong moment.
//
// Publishing also REFUSES to break deep links. If a previously published
// anchor would disappear and nothing aliases it, the publish fails rather than
// silently leaving every shared link to that section landing at the top of the
// page. That failure is loud on purpose: the silent version looks like the
// reader's mistake.

import type { PoolClient } from "pg";

import { diffAnchors, type AnchorDiff } from "./anchors";
import { parseDocument } from "./parse";
import type { ParsedDocument, TrustLevel } from "./types";

export interface PublishInput {
  /** Raw markdown including frontmatter. */
  source: string;
  /** Stable short id used in the URL. Generated on first publish if absent. */
  shortId?: string;
  authorId?: string;
  promptVersion?: string;
  modelUsed?: string;
  /** Old anchor → new anchor, for headings that were renamed. */
  aliases?: Record<string, string>;
  /** Publish immediately, or leave the version as a draft. */
  publish?: boolean;
}

export interface PublishResult {
  documentUuid: string;
  versionUuid: string;
  shortId: string;
  version: number;
  sections: number;
  anchors: AnchorDiff;
  published: boolean;
}

export class ValidationFailed extends Error {
  constructor(public readonly parsed: ParsedDocument) {
    const errors = parsed.issues.filter((i) => i.severity === "error");
    super(
      `Document is not valid (${errors.length} error${errors.length === 1 ? "" : "s"}):\n` +
        errors.map((e) => `  line ${e.line ?? "?"}: ${e.message}`).join("\n")
    );
    this.name = "ValidationFailed";
  }
}

export class AnchorsWouldBreak extends Error {
  constructor(public readonly diff: AnchorDiff) {
    super(
      `Publishing would remove ${diff.unmapped.length} anchor(s) that are already ` +
        `published, with no alias: ${diff.unmapped.join(", ")}.\n` +
        "Any shared link to those sections would silently land at the top of the page. " +
        "Add an alias mapping each old anchor to its new one, or restore the heading."
    );
    this.name = "AnchorsWouldBreak";
  }
}

const SHORT_ID_ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789"; // no l/o/0/1
const SHORT_ID_LENGTH = 8;

/** URL-safe, non-sequential, and unambiguous when read aloud or copied by hand. */
export function generateShortId(random: () => number = Math.random): string {
  let out = "";
  for (let i = 0; i < SHORT_ID_LENGTH; i += 1) {
    out += SHORT_ID_ALPHABET[Math.floor(random() * SHORT_ID_ALPHABET.length)];
  }
  return out;
}

/**
 * Publish (or draft) one document.
 *
 * `client` must already be inside a transaction owned by the caller, so that a
 * batch publish of many notes is all-or-nothing.
 */
export async function publishDocument(
  client: PoolClient,
  input: PublishInput
): Promise<PublishResult> {
  const parsed = parseDocument(input.source);
  if (!parsed.valid) throw new ValidationFailed(parsed);

  const { frontmatter, sections, body, title } = parsed;

  // The note must attach to a real syllabus node. A typo here would otherwise
  // publish a page that is reachable by URL and invisible in the tree.
  const node = await client.query<{ uuid: string }>(
    "SELECT uuid FROM examai.syllabus_nodes WHERE path = $1::ltree",
    [frontmatter.syllabus_path]
  );
  if (node.rowCount === 0) {
    throw new Error(
      `syllabus_path "${frontmatter.syllabus_path}" is not in the spine. ` +
        "Import the syllabus first, or fix the path in the frontmatter."
    );
  }
  const nodeUuid = node.rows[0].uuid;

  // Find or create the document. Identity is the syllabus node plus type, so
  // re-publishing the same topic updates it rather than creating a second page
  // students could reach by an older link.
  const existing = await client.query<{
    uuid: string;
    short_id: string;
    current_version_uuid: string | null;
  }>(
    `SELECT uuid, short_id, current_version_uuid
       FROM examai.documents
      WHERE node_uuid = $1 AND type = $2`,
    [nodeUuid, frontmatter.type]
  );

  let documentUuid: string;
  let shortId: string;

  if (existing.rowCount && existing.rows[0]) {
    documentUuid = existing.rows[0].uuid;
    shortId = existing.rows[0].short_id;
  } else {
    shortId = input.shortId ?? generateShortId();
    const created = await client.query<{ uuid: string }>(
      `INSERT INTO examai.documents (short_id, type, node_uuid, title, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING uuid`,
      [shortId, frontmatter.type, nodeUuid, title, input.authorId ?? null]
    );
    documentUuid = created.rows[0].uuid;
  }

  // --- anchor safety -------------------------------------------------------
  const publishedAnchors = await client.query<{ anchor: string }>(
    `SELECT s.anchor
       FROM examai.sections s
       JOIN examai.documents d ON d.current_version_uuid = s.document_version_uuid
      WHERE d.uuid = $1`,
    [documentUuid]
  );

  const storedAliases = await client.query<{ old_anchor: string; new_anchor: string }>(
    "SELECT old_anchor, new_anchor FROM examai.anchor_aliases WHERE document_uuid = $1",
    [documentUuid]
  );

  const aliases = new Map<string, string>([
    ...storedAliases.rows.map((r) => [r.old_anchor, r.new_anchor] as [string, string]),
    ...Object.entries(input.aliases ?? {}),
  ]);

  const anchors = diffAnchors(
    publishedAnchors.rows.map((r) => r.anchor),
    sections.map((s) => s.anchor),
    aliases
  );

  // Only enforced when actually going live. A draft may legitimately be
  // mid-rewrite with headings temporarily missing.
  if (input.publish !== false && anchors.unmapped.length > 0) {
    throw new AnchorsWouldBreak(anchors);
  }

  for (const [oldAnchor, newAnchor] of Object.entries(input.aliases ?? {})) {
    await client.query(
      `INSERT INTO examai.anchor_aliases (document_uuid, old_anchor, new_anchor)
       VALUES ($1, $2, $3)
       ON CONFLICT (document_uuid, old_anchor) DO UPDATE SET new_anchor = EXCLUDED.new_anchor`,
      [documentUuid, oldAnchor, newAnchor]
    );
  }

  // --- version -------------------------------------------------------------
  const nextVersion = await client.query<{ next: number }>(
    "SELECT COALESCE(MAX(version), 0) + 1 AS next FROM examai.document_versions WHERE document_uuid = $1",
    [documentUuid]
  );
  const version = nextVersion.rows[0].next;
  const status = input.publish === false ? "draft" : "published";

  const versionRow = await client.query<{ uuid: string }>(
    `INSERT INTO examai.document_versions
       (document_uuid, version, body_md, frontmatter, status, trust_level,
        author_id, prompt_version, model_used, published_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING uuid`,
    [
      documentUuid,
      version,
      body,
      JSON.stringify(frontmatter),
      status,
      (frontmatter.trust ?? "ai_draft") as TrustLevel,
      input.authorId ?? null,
      input.promptVersion ?? null,
      input.modelUsed ?? null,
      status === "published" ? new Date() : null,
    ]
  );
  const versionUuid = versionRow.rows[0].uuid;

  // --- sections ------------------------------------------------------------
  // Insert parents before children so parent_section_uuid can be resolved
  // without a second pass; sections are already in document order.
  const anchorToUuid = new Map<string, string>();
  for (const section of sections) {
    const parentUuid = section.parentAnchor ? anchorToUuid.get(section.parentAnchor) ?? null : null;
    const row = await client.query<{ uuid: string }>(
      `INSERT INTO examai.sections
         (document_version_uuid, anchor, level, parent_section_uuid,
          heading, heading_path, body_md, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING uuid`,
      [
        versionUuid,
        section.anchor,
        section.level,
        parentUuid,
        section.heading,
        section.headingPath,
        section.bodyMd,
        section.orderIndex,
      ]
    );
    anchorToUuid.set(section.anchor, row.rows[0].uuid);
  }

  // --- switch the pointer --------------------------------------------------
  // Last, and only for a published version. Until this runs, the live page is
  // untouched — which is what makes draft edits invisible to students.
  if (status === "published") {
    await client.query(
      "UPDATE examai.documents SET title = $2, current_version_uuid = $3 WHERE uuid = $1",
      [documentUuid, title, versionUuid]
    );
    await client.query(
      `INSERT INTO examai.document_topics (document_uuid, node_uuid, role)
       VALUES ($1, $2, 'primary') ON CONFLICT DO NOTHING`,
      [documentUuid, nodeUuid]
    );
    // Older published versions become archived, so exactly one is ever live.
    await client.query(
      `UPDATE examai.document_versions SET status = 'archived'
        WHERE document_uuid = $1 AND uuid <> $2 AND status = 'published'`,
      [documentUuid, versionUuid]
    );
  }

  return {
    documentUuid,
    versionUuid,
    shortId,
    version,
    sections: sections.length,
    anchors,
    published: status === "published",
  };
}
