import { NextRequest, NextResponse } from "next/server";
import { adminDb, paperBucket } from "@/lib/firebase-admin";
import { requireStaff } from "@/lib/examai/admin-auth";
import { MIME_TO_EXTENSION, originalPath, isSafePathSegment } from "@/lib/examai/paths";
import { buildPaperId, EXAM_TYPES, type ExamType, type Paper } from "@/lib/examai/types";

export const dynamic = "force-dynamic";
// Page scans are several MB each and go to Cloud Storage before we reply.
export const maxDuration = 120;

const MAX_FILE_BYTES = 15 * 1024 * 1024;
const MAX_PAGES = 12;

/** Papers the admin can work on, newest first. */
export async function GET(request: NextRequest) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const courseId = request.nextUrl.searchParams.get("courseId");

  try {
    let query = adminDb.collection("papers");
    if (courseId) query = query.where("courseId", "==", courseId);

    const snap = await query.get();
    const papers = snap.docs
      .map((d: { data: () => Paper }) => d.data())
      .sort(
        (a: Paper, b: Paper) =>
          b.year - a.year || String(b.createdAt).localeCompare(String(a.createdAt))
      );

    return NextResponse.json({ papers }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("ExamAI paper list failed:", err);
    return NextResponse.json({ error: "Could not load papers." }, { status: 500 });
  }
}

/**
 * Upload a paper's page scans and create the paper document.
 *
 * This does NOT start extraction — that is a separate call, so the admin can
 * check the pages uploaded in the right order before spending a model call on
 * them. A paper sits in `uploaded` until extraction is started explicitly.
 */
export async function POST(request: NextRequest) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const form = await request.formData();

    const courseId = String(form.get("courseId") ?? "").trim().toUpperCase();
    const yearRaw = Number(form.get("year"));
    const examType = String(form.get("examType") ?? "regular") as ExamType;
    const programId = String(form.get("programId") ?? "BIT").trim().toUpperCase();

    if (!isSafePathSegment(courseId)) {
      return NextResponse.json({ error: "Pick a course." }, { status: 400 });
    }
    if (!Number.isInteger(yearRaw) || yearRaw < 2000 || yearRaw > 2100) {
      return NextResponse.json({ error: "Year must be between 2000 and 2100." }, { status: 400 });
    }
    if (!EXAM_TYPES.includes(examType)) {
      return NextResponse.json({ error: "Unknown exam type." }, { status: 400 });
    }

    const courseSnap = await adminDb.collection("courses").doc(courseId).get();
    if (!courseSnap.exists) {
      return NextResponse.json(
        { error: `Course ${courseId} is not seeded. Run scripts/seed-examai-courses.mjs first.` },
        { status: 400 }
      );
    }

    const files = form.getAll("pages").filter((f): f is File => f instanceof File);
    if (files.length === 0) {
      return NextResponse.json({ error: "Attach at least one page image." }, { status: 400 });
    }
    if (files.length > MAX_PAGES) {
      return NextResponse.json(
        { error: `That is ${files.length} pages; the limit is ${MAX_PAGES}.` },
        { status: 413 }
      );
    }

    // Validate every file BEFORE uploading any of them. A half-uploaded paper
    // would leave orphaned objects in the bucket that nothing references and
    // nothing cleans up.
    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          { error: `${file.name} is over 15MB.` },
          { status: 413 }
        );
      }
      const ext = MIME_TO_EXTENSION[file.type];
      if (!ext) {
        return NextResponse.json(
          { error: `${file.name} is ${file.type || "an unknown type"}. Use JPEG, PNG or WebP.` },
          { status: 415 }
        );
      }
      if (ext === "pdf") {
        // The worker rejects these too, but failing here means the admin finds
        // out before the upload rather than when the job fails.
        return NextResponse.json(
          {
            error:
              "Split the PDF into one image per page first — page boundaries are what " +
              "lets a question point back at the scan it came from.",
          },
          { status: 415 }
        );
      }
    }

    const paperId = buildPaperId(courseId, yearRaw, examType);
    const bucket = paperBucket();

    // Upload in the order the files were attached: that is reading order, and
    // the zero-padded index in the path is what preserves it.
    const imagePaths: string[] = [];
    for (const [index, file] of files.entries()) {
      const ext = MIME_TO_EXTENSION[file.type]!;
      const path = originalPath(paperId, index, ext);
      const buffer = Buffer.from(await file.arrayBuffer());
      await bucket.file(path).save(buffer, {
        contentType: file.type,
        resumable: false,
        metadata: { cacheControl: "private, max-age=3600" },
      });
      imagePaths.push(path);
    }

    const timestamp = new Date().toISOString();
    const existing = await adminDb.collection("papers").doc(paperId).get();

    // Re-uploading the same course/year/type replaces the scans rather than
    // creating a second paper — the id is derived, so there is only ever one.
    // Status resets to `uploaded` because the previous extraction described
    // different images and is no longer evidence about these ones.
    await adminDb
      .collection("papers")
      .doc(paperId)
      .set(
        {
          paperId,
          courseId,
          programId,
          year: yearRaw,
          examType,
          imagePaths,
          status: "uploaded",
          updatedAt: timestamp,
          ...(existing.exists
            ? {}
            : {
                fullMarks: 0,
                passMarks: null,
                timeHours: null,
                groups: [],
                coverage: {
                  byGroup: [],
                  status: "partial",
                  missingRanges: [],
                  notes: "Not extracted yet.",
                },
                extractionNotes: "",
                createdBy: auth.user.uid,
                createdAt: timestamp,
                publishedAt: null,
                totalTokens: 0,
                totalCostUsd: 0,
              }),
        },
        { merge: true }
      );

    return NextResponse.json({
      paperId,
      imagePaths,
      replaced: existing.exists,
      pages: imagePaths.length,
    });
  } catch (err) {
    console.error("ExamAI paper upload failed:", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
