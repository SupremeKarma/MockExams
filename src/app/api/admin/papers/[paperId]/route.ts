import { NextRequest, NextResponse } from "next/server";
import { adminDb, paperBucket } from "@/lib/firebase-admin";
import { requireStaff } from "@/lib/examai/admin-auth";
import { isSafePathSegment } from "@/lib/examai/paths";
import { sortQuestions, type Paper, type Question } from "@/lib/examai/types";

export const dynamic = "force-dynamic";

/** How long a scan URL stays valid. Long enough to review a paper, short enough not to leak. */
const SIGNED_URL_MINUTES = 60;

/**
 * One paper, its questions, and signed URLs for the scans.
 *
 * The signed URLs are why this route exists rather than the client reading
 * Firestore directly: Storage rules deny all client access to `papers/**`,
 * because they cannot check whether a paper is published. Minting short-lived
 * URLs here — after the role check — is the part that Storage rules cannot do.
 */
export async function GET(
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
    const paperRef = adminDb.collection("papers").doc(paperId);
    const [paperSnap, questionSnap] = await Promise.all([
      paperRef.get(),
      paperRef.collection("questions").get(),
    ]);

    if (!paperSnap.exists) {
      return NextResponse.json({ error: "No such paper." }, { status: 404 });
    }

    const paper = paperSnap.data() as Paper;
    const questions = sortQuestions(
      questionSnap.docs.map((d: { data: () => Question }) => d.data())
    );

    const expires = Date.now() + SIGNED_URL_MINUTES * 60 * 1000;
    const bucket = paperBucket();
    const pageUrls = await Promise.all(
      (paper.imagePaths ?? []).map(async (path) => {
        try {
          const [url] = await bucket.file(path).getSignedUrl({ action: "read", expires });
          return { path, url };
        } catch (err) {
          // One unreadable scan must not blank the whole review screen — the
          // reviewer can still work from the extracted text, and a null url
          // renders as "scan unavailable" rather than an empty page.
          console.error(`Signing failed for ${path}:`, err);
          return { path, url: null };
        }
      })
    );

    return NextResponse.json(
      { paper, questions, pageUrls },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("ExamAI paper fetch failed:", err);
    return NextResponse.json({ error: "Could not load that paper." }, { status: 500 });
  }
}
