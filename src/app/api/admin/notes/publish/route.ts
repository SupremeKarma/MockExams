import { NextRequest, NextResponse } from "next/server";
import { AnchorsWouldBreak, publishDocument, ValidationFailed } from "@examai/content";
import { requireStaff } from "@/lib/examai/admin-auth";
import { writerPool } from "@/lib/examai/content-db";

export const dynamic = "force-dynamic";

/**
 * Publish (or draft-save) one note. Thin wrapper around publishDocument —
 * the same function scripts/publish-notes.mjs calls — so a note saved here
 * behaves identically to one published from a markdown file: same
 * validation, same anchor-safety check, same one-transaction atomicity.
 */
export async function POST(request: NextRequest) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  let body: { source?: unknown; publish?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const source = typeof body.source === "string" ? body.source : "";
  const publish = body.publish !== false;

  const client = await writerPool().connect();
  try {
    await client.query("BEGIN");
    const result = await publishDocument(client, {
      source,
      authorId: auth.user.uid,
      promptVersion: "admin-ui",
      publish,
    });
    await client.query("COMMIT");

    return NextResponse.json(result);
  } catch (err) {
    await client.query("ROLLBACK");

    if (err instanceof ValidationFailed) {
      return NextResponse.json(
        { error: "Document is not valid.", issues: err.parsed.issues },
        { status: 422 }
      );
    }
    if (err instanceof AnchorsWouldBreak) {
      return NextResponse.json({ error: err.message, anchors: err.diff }, { status: 409 });
    }

    console.error("ExamAI note publish failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Publish failed." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
