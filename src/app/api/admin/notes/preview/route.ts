import { NextRequest, NextResponse } from "next/server";
import { parseDocument, renderDocument } from "@examai/content";
import { requireStaff } from "@/lib/examai/admin-auth";

export const dynamic = "force-dynamic";

/**
 * Parse + render without touching Postgres — the same functions the publish
 * pipeline and the Reader use, so what this shows is exactly what
 * publishing would produce. No document identity is resolved here (the
 * syllabus_path is not checked against the spine), so a valid preview can
 * still fail at publish time if the path is wrong.
 */
export async function POST(request: NextRequest) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  let body: { source?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const source = typeof body.source === "string" ? body.source : "";
  const parsed = parseDocument(source);

  const { html } = parsed.valid
    ? renderDocument(
        parsed.body,
        parsed.sections.map((s) => ({ heading: s.heading, anchor: s.anchor })),
        { mode: "beginner" }
      )
    : { html: "" };

  return NextResponse.json({
    valid: parsed.valid,
    title: parsed.title,
    issues: parsed.issues,
    sectionCount: parsed.sections.length,
    toc: parsed.toc,
    html,
  });
}
