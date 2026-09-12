import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/examai/admin-auth";
import { writerPool } from "@/lib/examai/content-db";

export const dynamic = "force-dynamic";

interface NoteRow {
  uuid: string;
  short_id: string;
  type: string;
  title: string;
  path: string;
  code: string | null;
  node_title: string;
  version: number | null;
  status: string | null;
  trust_level: string | null;
  published_at: string | null;
}

/**
 * Every note, its syllabus location, and its latest version's status.
 *
 * Uses the writer connection, not the Reader's restricted pool: an admin
 * list has to show drafts, which the Reader role cannot see at all by
 * design (examai-api/migrations/004_roles_views.sql).
 */
export async function GET(request: NextRequest) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const result = await writerPool().query<NoteRow>(
      `SELECT d.uuid, d.short_id, d.type, d.title,
              n.path::text, n.code, n.title AS node_title,
              lv.version, lv.status, lv.trust_level, lv.published_at
         FROM examai.documents d
         JOIN examai.syllabus_nodes n ON n.uuid = d.node_uuid
         LEFT JOIN LATERAL (
           SELECT version, status, trust_level, published_at
             FROM examai.document_versions
            WHERE document_uuid = d.uuid
            ORDER BY version DESC
            LIMIT 1
         ) lv ON true
        ORDER BY n.path`
    );

    return NextResponse.json({ notes: result.rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("ExamAI notes list failed:", err);
    return NextResponse.json({ error: "Could not load notes." }, { status: 500 });
  }
}
