import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { extractFlashcards, MAX_CARDS } from "@/lib/flashcard-extraction";
import { spendCredits, CREDIT_COSTS, CREDIT_REWARDS } from "@/lib/entitlements";
import type { GeminiPart } from "@/lib/gemini";

export const dynamic = "force-dynamic";

const MAX_FILE_BYTES = 15 * 1024 * 1024;
const MAX_TEXT_CHARS = 60_000;

export async function POST(request: NextRequest) {
  try {
    // Authenticate before touching config or the model: this endpoint spends
    // real money per call, so it must never be reachable anonymously.
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Please sign in to extract flashcards." }, { status: 401 });
    }

    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: "Your session expired. Please sign in again." }, { status: 401 });
    }
    if (!decoded) {
      return NextResponse.json({ error: "Auth is not configured on the server" }, { status: 503 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Extraction is unavailable right now." }, { status: 503 });
    }

    const contentType = request.headers.get("content-type") || "";
    let parts: GeminiPart[];

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "No file provided." }, { status: 400 });
      }
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: "File is too large (max 15MB)." }, { status: 413 });
      }

      const buffer = await file.arrayBuffer();
      const mediaType = file.type || "application/octet-stream";

      if (mediaType === "application/pdf") {
        parts = [
          { inlineData: { mimeType: "application/pdf", data: Buffer.from(buffer).toString("base64") } },
          { text: "Make flashcards from these notes." },
        ];
      } else if (["image/jpeg", "image/png", "image/gif", "image/webp"].includes(mediaType)) {
        parts = [
          { inlineData: { mimeType: mediaType, data: Buffer.from(buffer).toString("base64") } },
          { text: "Make flashcards from these handwritten or photographed notes." },
        ];
      } else if (mediaType.startsWith("text/") || /\.(txt|md)$/i.test(file.name)) {
        parts = [
          { text: `Make flashcards from these notes:\n\n${Buffer.from(buffer).toString("utf-8").slice(0, MAX_TEXT_CHARS)}` },
        ];
      } else {
        return NextResponse.json(
          { error: "Unsupported file type. Use a PDF, an image, or a .txt file." },
          { status: 415 }
        );
      }
    } else {
      const body = await request.json().catch(() => null);
      const text = typeof body?.text === "string" ? body.text : "";
      if (!text.trim()) {
        return NextResponse.json({ error: "Paste some notes first." }, { status: 400 });
      }
      parts = [{ text: `Make flashcards from these notes:\n\n${text.slice(0, MAX_TEXT_CHARS)}` }];
    }

    // Charged before the call, so a failed extraction cannot be retried for
    // free in a loop. Paid plans are never charged.
    const spend = await spendCredits(decoded.uid, CREDIT_COSTS.flashcard_extraction, "flashcard_extraction");
    if (!spend.ok) {
      return NextResponse.json(
        {
          error: "out_of_credits",
          message: `Extracting flashcards costs ${CREDIT_COSTS.flashcard_extraction} credits. Earn ${CREDIT_REWARDS.exam_completed} by finishing an exam, or go Pro for unlimited.`,
          remaining: spend.remaining,
        },
        { status: 402 }
      );
    }

    const cards = await extractFlashcards(apiKey, parts);

    if (cards.length === 0) {
      return NextResponse.json(
        { cards: [], message: "Nothing worth memorising was found in those notes." },
        { status: 200 }
      );
    }

    // Cards are returned for review, not written to Firestore: a wrong card
    // memorised is worse than no card, so a human confirms first.
    return NextResponse.json({
      cards,
      max: MAX_CARDS,
      creditsRemaining: spend.unlimited ? null : spend.remaining,
    });
  } catch (error) {
    console.error("Flashcard extraction error:", error);
    return NextResponse.json({ error: "Extraction failed. Please try again." }, { status: 500 });
  }
}
