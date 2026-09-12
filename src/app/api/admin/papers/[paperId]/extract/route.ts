import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireStaff, callWorker, WorkerUnavailableError } from "@/lib/examai/admin-auth";
import { isSafePathSegment } from "@/lib/examai/paths";
import type { Paper } from "@/lib/examai/types";

export const dynamic = "force-dynamic";

/**
 * Start (or restart) extraction for a paper.
 *
 * Returns as soon as the worker accepts the job. Progress is reported through
 * `jobs/{paperId}__extract`, which the admin screen subscribes to — holding
 * this request open for the length of a vision call would risk a platform
 * timeout killing it mid-extraction, leaving the paper in `uploaded` with
 * nothing recorded about why.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ paperId: string }> }
) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const { paperId } = await params;
  if (!isSafePathSegment(paperId)) {
    return NextResponse.json({ error: "Bad paper id." }, { status: 400 });
  }

  try {
    const snap = await adminDb.collection("papers").doc(paperId).get();
    if (!snap.exists) {
      return NextResponse.json({ error: "No such paper." }, { status: 404 });
    }

    const paper = snap.data() as Paper;
    if (!paper.imagePaths?.length) {
      return NextResponse.json(
        { error: "This paper has no page scans to extract from." },
        { status: 400 }
      );
    }

    // A paper already past review has approved questions attached to it.
    // Re-extraction preserves them (see the worker's write path), but it is
    // still a decision the admin should make knowingly rather than by
    // double-clicking a button, so it needs an explicit confirm.
    const body = await request.json().catch(() => ({}));
    const force = body?.force === true;
    if (!force && (paper.status === "published" || paper.status === "review")) {
      return NextResponse.json(
        {
          error: "needs_confirmation",
          message:
            `This paper is already at "${paper.status}". Re-extracting replaces the ` +
            "questions; approved ones and human unit tags are kept. Send force: true to proceed.",
        },
        { status: 409 }
      );
    }

    await adminDb.collection("papers").doc(paperId).set(
      { status: "uploaded", updatedAt: new Date().toISOString() },
      { merge: true }
    );

    const accepted = await callWorker<{ jobId: string }>("/stages/extract", {
      method: "POST",
      body: {
        paper_id: paperId,
        course_id: paper.courseId,
        program_id: paper.programId ?? "BIT",
        year: paper.year,
        exam_type: paper.examType,
        image_paths: paper.imagePaths,
        created_by: auth.user.uid,
        force,
      },
    });

    return NextResponse.json({ started: true, ...accepted }, { status: 202 });
  } catch (err) {
    if (err instanceof WorkerUnavailableError) {
      return NextResponse.json(
        {
          error:
            "The extraction worker is not configured. Set EXAMAI_WORKER_URL and " +
            "EXAMAI_INTERNAL_API_KEY, and start examai-api.",
        },
        { status: 503 }
      );
    }
    console.error("ExamAI extract start failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not start extraction." },
      { status: 502 }
    );
  }
}
