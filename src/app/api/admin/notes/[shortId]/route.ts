import { NextRequest, NextResponse } from "next/server";
import { stringify as stringifyYaml } from "yaml";
import { requireStaff } from "@/lib/examai/admin-auth";
import { writerPool } from "@/lib/examai/content-db";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ shortId: string }>;
}

/**
 * The editable markdown source for an existing note — reconstructed, since
 * `publishDocument` (packages/content/src/publish.ts) stores frontmatter and
 * body as separate columns, not the original file text. Rebuilt from the
 * LATEST version (draft or published, whichever is newer), not just the
 * current live one, so re-opening a note mid-edit continues from what was
 * last saved rather than reverting to what students currently see.
 */
export async function GET(request: NextRequest, { params }: Params) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const { shortId } = await params;

  try {
    const docResult = await writerPool().query<{ uuid: string; short_id: string; type: string }>(
      "SELECT uuid, short_id, type FROM examai.documents WHERE short_id = $1",
      [shortId]
    );
    const doc = docResult.rows[0];
    if (!doc) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const versionResult = await writerPool().query<{
      body_md: string;
      frontmatter: Record<string, unknown>;
      version: number;
      status: string;
    }>(
      `SELECT body_md, frontmatter, version, status
         FROM examai.document_versions
        WHERE document_uuid = $1
        ORDER BY version DESC
        LIMIT 1`,
      [doc.uuid]
    );
    const version = versionResult.rows[0];
    if (!version) return NextResponse.json({ error: "This note has no versions yet." }, { status: 404 });

    // body_md already carries its own leading blank line (the one between the
    // closing `---` and the first heading in the original source — see
    // splitFrontmatter in packages/content/src/parse.ts), so no `\n\n` goes
    // between them here — verified by round-tripping a real note and
    // reparsing it back to the identical body.
    const source = `---\n${stringifyYaml(version.frontmatter).trimEnd()}\n---\n${version.body_md}`;

    return NextResponse.json(
      { shortId: doc.short_id, source, version: version.version, status: version.status },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("ExamAI note fetch failed:", err);
    return NextResponse.json({ error: "Could not load this note." }, { status: 500 });
  }
}
