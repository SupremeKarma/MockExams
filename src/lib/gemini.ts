// Thin wrapper around Gemini's REST API (no SDK dependency needed).
// Gemini has a genuinely free tier (aistudio.google.com/apikey), used here
// in place of Anthropic for the AI Tutor, exam grading, and document
// extraction — set GEMINI_API_KEY in .env.local to enable these features.

// Defaults to the cheapest Flash-Lite tier, pinned to a specific version so
// grading behaviour cannot shift underneath us. Override with GEMINI_MODEL to
// move up (e.g. gemini-2.5-flash) or to track the rolling alias
// (gemini-flash-lite-latest) — quality and cost both scale with this value.
//
// Note: the 2.0 and 2.5 families this originally targeted are retired or
// closed to new users. If a model name 404s, list what your key can reach with
//   curl "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY"
const DEFAULT_MODEL = "gemini-3.5-flash-lite";

function model(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

export interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

export interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

/** A web source the model actually consulted, for attribution and checking. */
export interface GroundingSource {
  title: string;
  uri: string;
}

export interface GroundedResult {
  text: string;
  sources: GroundingSource[];
}

interface RequestOptions {
  maxOutputTokens?: number;
  temperature?: number;
  /** Enable Google Search grounding so claims come from real sources. */
  search?: boolean;
}

async function request(
  apiKey: string,
  systemInstruction: string,
  contents: GeminiContent[],
  options: RequestOptions = {}
): Promise<any> {
  const { maxOutputTokens = 1024, temperature = 0.4, search = false } = options;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model()}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents,
      generationConfig: { maxOutputTokens, temperature },
      ...(search ? { tools: [{ google_search: {} }] } : {}),
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    if (res.status === 404) {
      throw new Error(
        `Gemini model "${model()}" not found (404). Check GEMINI_MODEL, or unset it to use ${DEFAULT_MODEL}.`
      );
    }
    // 429 covers two very different situations — a per-minute rate limit and a
    // depleted billing balance — so surface Google's own wording rather than
    // guessing which one it is.
    if (res.status === 429) {
      let detail = "";
      try {
        detail = JSON.parse(errText)?.error?.message ?? "";
      } catch {
        detail = errText.slice(0, 200);
      }
      throw new Error(`Gemini quota error on "${model()}" (429): ${detail}`);
    }
    throw new Error(`Gemini API error ${res.status}: ${errText.slice(0, 500)}`);
  }

  const data = await res.json();

  const finishReason = data?.candidates?.[0]?.finishReason;
  if (finishReason === "SAFETY" || finishReason === "RECITATION") {
    throw new Error(`Gemini blocked the response (${finishReason})`);
  }

  return data;
}

function textOf(data: any): string {
  const text = (data?.candidates?.[0]?.content?.parts ?? [])
    .map((p: GeminiPart) => p.text ?? "")
    .join("\n")
    .trim();
  if (!text) throw new Error("Empty response from Gemini");
  return text;
}

export async function callGemini(
  apiKey: string,
  systemInstruction: string,
  contents: GeminiContent[],
  maxOutputTokens = 1024
): Promise<string> {
  return textOf(await request(apiKey, systemInstruction, contents, { maxOutputTokens }));
}

/**
 * Same call with Google Search grounding switched on, returning the sources the
 * model actually consulted.
 *
 * Used for authoring study notes: a student's marks depend on the content being
 * right, so claims must come from real material and a reviewer must be able to
 * check them. An empty `sources` array means the model answered from memory —
 * treat that as ungrounded and hold it back from publication.
 */
export async function callGeminiGrounded(
  apiKey: string,
  systemInstruction: string,
  contents: GeminiContent[],
  maxOutputTokens = 2048
): Promise<GroundedResult> {
  const data = await request(apiKey, systemInstruction, contents, {
    maxOutputTokens,
    // Lower temperature: this is factual authoring, not prose.
    temperature: 0.2,
    search: true,
  });

  const chunks = data?.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
  const seen = new Set<string>();
  const sources: GroundingSource[] = [];

  for (const chunk of chunks) {
    const uri = chunk?.web?.uri;
    if (typeof uri !== "string" || seen.has(uri)) continue;
    seen.add(uri);
    sources.push({ title: String(chunk?.web?.title ?? "").slice(0, 200), uri });
  }

  return { text: textOf(data), sources };
}
