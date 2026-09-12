import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/examai/admin-auth";
import { writerPool } from "@/lib/examai/content-db";

export const dynamic = "force-dynamic";

interface NodeRow {
  path: string;
  code: string | null;
  title: string;
  kind: string;
}

/**
 * The syllabus-node picker for the note editor — every unit and topic under
 * a course, so an author chooses `syllabus_path` from a real spine node
 * instead of typing an ltree path by hand. A typo there passes validation
 * silently and then fails at publish with "not in the spine", which is a
 * worse place to discover it than a dropdown that cannot offer a wrong path.
 */
export async function GET(request: NextRequest) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const course = request.nextUrl.searchParams.get("course")?.trim().toLowerCase();
  if (!course) return NextResponse.json({ error: "Pass ?course=." }, { status: 400 });

  try {
    const result = await writerPool().query<NodeRow>(
      `SELECT path::text, code, title, kind
         FROM examai.syllabus_nodes
        WHERE status = 'active'
          AND kind IN ('unit', 'topic')
          AND path <@ (
            SELECT path FROM examai.syllabus_nodes
             WHERE kind = 'course' AND lower(code) = $1
             LIMIT 1
          )
        ORDER BY path`,
      [course]
    );

    return NextResponse.json({ nodes: result.rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Syllabus node lookup failed:", err);
    return NextResponse.json({ error: "Could not load syllabus nodes." }, { status: 500 });
  }
}
