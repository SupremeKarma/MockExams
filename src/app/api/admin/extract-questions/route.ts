import { NextResponse } from "next/server";
import { callGemini, GeminiPart } from "@/lib/gemini";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

// Admins/examiners upload a real question paper (PDF, photo/scan, or raw
// pasted text) and Gemini reads it and reformats it into the plain-text
// bulk-import format that BulkQuestionImport/bulkQuestionParser expects:
//
//   Q: ...
//   A) ...
//   B) ...
//   C) ...
//   D) ...
//   ANSWER: X
//   EXPLAIN: ... (optional)
//   DIFFICULTY: easy|medium|hard (optional)
//   MARKS: n (optional)
//
// The admin still reviews the parsed preview before anything is written to
// Firestore — this endpoint only produces the intermediate text.

const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB — comfortably under Claude's per-file limits

const EXTRACTION_SYSTEM_PROMPT = `You convert exam question papers into a strict plain-text format. You will be given either a document (PDF), an image of a question paper, or raw pasted text.

Extract every multiple-choice question you can find and output ONLY the following format, nothing else — no preamble, no markdown fences, no commentary:

Q: <full question text>
A) <option A>
B) <option B>
C) <option C>
D) <option D>
ANSWER: <letter A-D>
EXPLAIN: <short explanation, only if you can determine or reasonably infer the correct reasoning; omit this line entirely if unsure>
DIFFICULTY: <easy, medium, or hard — your best estimate; omit if genuinely unsure>
MARKS: <marks for the question if stated in the source; omit if not stated>

Separate each question block with a single blank line. If a question in the source is not already multiple-choice (e.g. a short-answer or descriptive question), still convert it: write the question, then produce four plausible options (A-D) with exactly one correct, and pick DIFFICULTY sensibly.

If the ANSWER for a question is genuinely not determinable from the source and you cannot infer it confidently, still include your best-guess ANSWER but do not include an EXPLAIN line for it, so the reviewer knows to double check it.

Do not skip questions. Do not summarize. Output every question you can identify, in the order they appear.`;

export async function POST(request: Request) {
  try {
    // This endpoint spends real money per call and was previously reachable
    // with no credentials at all — anyone could burn the Gemini quota. It is
    // an authoring tool, so it is now restricted to staff.
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const userSnap = await adminDb.collection("users").doc(decoded.uid).get();
    const role = userSnap.exists ? (userSnap.data()?.role ?? "student") : "student";
    if (!["admin", "examiner", "org_admin"].includes(role)) {
      return NextResponse.json({ error: "Staff only." }, { status: 403 });
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

      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const mediaType = file.type || "application/octet-stream";

      if (mediaType === "application/pdf") {
        parts = [
          { inlineData: { mimeType: "application/pdf", data: base64 } },
          { text: "Extract and reformat every question from this PDF question paper." },
        ];
      } else if (mediaType.startsWith("image/")) {
        const supported = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!supported.includes(mediaType)) {
          return NextResponse.json({ error: "Unsupported image type. Use JPEG, PNG, GIF, or WebP." }, { status: 415 });
        }
        parts = [
          { inlineData: { mimeType: mediaType, data: base64 } },
          { text: "Extract and reformat every question from this photo/scan of a question paper." },
        ];
      } else if (mediaType === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        const text = Buffer.from(arrayBuffer).toString("utf-8");
        parts = [{ text: `Extract and reformat every question from this text:\n\n${text.slice(0, 100000)}` }];
      } else {
        return NextResponse.json({ error: "Unsupported file type. Use PDF, an image, or a .txt file." }, { status: 415 });
      }
    } else {
      const body = await request.json().catch(() => null);
      const rawText = typeof body?.text === "string" ? body.text : "";
      if (!rawText.trim()) {
        return NextResponse.json({ error: "No text provided." }, { status: 400 });
      }
      parts = [{ text: `Extract and reformat every question from this text:\n\n${rawText.slice(0, 100000)}` }];
    }

    const extracted = await callGemini(
      apiKey,
      EXTRACTION_SYSTEM_PROMPT,
      [{ role: "user", parts }],
      8000
    );

    if (!extracted) {
      return NextResponse.json({ error: "Couldn't extract any questions from that file." }, { status: 422 });
    }

    return NextResponse.json({ text: extracted });
  } catch (error) {
    console.error("Question extraction error:", error);
    return NextResponse.json({ error: "Extraction failed. Please try again." }, { status: 500 });
  }
}
