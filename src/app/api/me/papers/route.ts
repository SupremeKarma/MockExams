import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import {
  solvePaper,
  lowConfidenceQuestions,
  MAX_QUESTIONS_PER_PAPER,
  type PaperType,
} from "@/lib/paper-solving";
import { spendCredits, CREDIT_COSTS, CREDIT_REWARDS, getEntitlement, hasActivePlan } from "@/lib/entitlements";
import type { GeminiPart } from "@/lib/gemini";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const MAX_FILE_BYTES = 15 * 1024 * 1024;
const MAX_TEXT_CHARS = 60_000;

async function requireUser(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return { error: NextResponse.json({ error: "Please sign in first." }, { status: 401 }) };
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    if (!decoded) {
      return { error: NextResponse.json({ error: "Auth is not configured on the server" }, { status: 503 }) };
    }
    return { uid: decoded.uid as string };
  } catch {
    return { error: NextResponse.json({ error: "Your session expired. Please sign in again." }, { status: 401 }) };
  }
}

/** A student's own solved papers. Private to them. */
export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth.error) return auth.error;

  try {
    const snap = await adminDb.collection("solved_papers").where("user_id", "==", auth.uid).get();
    const papers = snap.docs
      .map((d: any) => ({ id: d.id, ...d.data() }))
      .sort((a: any, b: any) => String(b.created_at).localeCompare(String(a.created_at)));
    return NextResponse.json({ papers }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Solved paper list failed:", err);
    return NextResponse.json({ error: "Could not load your papers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth.error) return auth.error;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Paper solving is unavailable right now." }, { status: 503 });
    }

    const contentType = request.headers.get("content-type") || "";
    let parts: GeminiPart[];
    let sourceLabel = "pasted text";
    // Semester papers are entirely descriptive; entrance papers are MCQ.
    // Declaring it removes all guessing about question type.
    let paperType: PaperType = "semester";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "No file provided." }, { status: 400 });
      }
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: "File is too large (max 15MB)." }, { status: 413 });
      }

      const declared = String(form.get("paperType") ?? "semester");
      paperType = declared === "entrance" ? "entrance" : declared === "unknown" ? "unknown" : "semester";

      const buffer = await file.arrayBuffer();
      const mediaType = file.type || "application/octet-stream";
      sourceLabel = file.name;

      if (mediaType === "application/pdf") {
        parts = [
          { inlineData: { mimeType: "application/pdf", data: Buffer.from(buffer).toString("base64") } },
          { text: "Solve every question on this past exam paper." },
        ];
      } else if (["image/jpeg", "image/png", "image/gif", "image/webp"].includes(mediaType)) {
        parts = [
          { inlineData: { mimeType: mediaType, data: Buffer.from(buffer).toString("base64") } },
          { text: "Solve every question on this photographed or scanned past exam paper." },
        ];
      } else if (mediaType.startsWith("text/") || /\.(txt|md)$/i.test(file.name)) {
        parts = [
          { text: `Solve every question on this past exam paper:\n\n${Buffer.from(buffer).toString("utf-8").slice(0, MAX_TEXT_CHARS)}` },
        ];
      } else {
        return NextResponse.json(
          { error: "Unsupported file type. Use a PDF, a photo, or a .txt file." },
          { status: 415 }
        );
      }
    } else {
      const body = await request.json().catch(() => null);
      const text = typeof body?.text === "string" ? body.text : "";
      if (!text.trim()) return NextResponse.json({ error: "Paste the paper first." }, { status: 400 });
      paperType =
        body?.paperType === "entrance" ? "entrance" : body?.paperType === "unknown" ? "unknown" : "semester";
      parts = [{ text: `Solve every question on this past exam paper:\n\n${text.slice(0, MAX_TEXT_CHARS)}` }];
    }

    // Pro is unlimited; everyone else spends credits, which are earned by
    // studying. Charged before the call so a failure cannot be retried free
    // in a loop.
    const entitlement = await getEntitlement(auth.uid!);
    const spend = await spendCredits(auth.uid!, CREDIT_COSTS.solve_paper, "solve_paper");
    if (!spend.ok) {
      return NextResponse.json(
        {
          error: "out_of_credits",
          message: `Solving a paper costs ${CREDIT_COSTS.solve_paper} credits. Earn ${CREDIT_REWARDS.exam_completed} by finishing an exam, or go Pro for unlimited.`,
          remaining: spend.remaining,
        },
        { status: 402 }
      );
    }

    const solved = await solvePaper(apiKey, parts, paperType);
    const uncertain = lowConfidenceQuestions(solved);

    // Private to the uploader: this is their copy of their own college's
    // paper, not a contribution to the shared bank. Staff promote papers
    // deliberately, after review.
    const ref = await adminDb.collection("solved_papers").add({
      user_id: auth.uid,
      source: sourceLabel,
      paper_type: paperType,
      meta: solved.meta,
      missing_numbers: solved.missingNumbers,
      questions: solved.questions,
      sources: solved.sources,
      grounded: solved.grounded,
      low_confidence_count: uncertain.length,
      is_pro: hasActivePlan(entitlement),
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      id: ref.id,
      paperType,
      meta: solved.meta,
      missingNumbers: solved.missingNumbers,
      questions: solved.questions,
      sources: solved.sources,
      grounded: solved.grounded,
      lowConfidenceCount: uncertain.length,
      max: MAX_QUESTIONS_PER_PAPER,
      creditsRemaining: spend.unlimited ? null : spend.remaining,
    });
  } catch (err) {
    console.error("Paper solving failed:", err);
    return NextResponse.json({ error: "Could not solve that paper. Please try again." }, { status: 500 });
  }
}
