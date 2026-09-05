// Thin client for the Supreme AI platform's /ask contract
// (see docs/specs/SUPREME_PLATFORM_CONTRACT.md in the SUPREME-AI repo).
//
// MockExams does NOT do memory/RAG/agent logic itself — that lives entirely
// behind this one call. This file's only job is: build the request shape,
// send it, and surface the response or a typed error. If a caller finds
// itself wanting to read/write memory-service directly, or run its own
// retrieval, that is the signal something has gone wrong — see
// [[mockexams-first-thin-client]] in the platform owner's notes.
//
// scope is always "examai" — hardcoded, not a parameter — so no call site
// here can accidentally read or write another app's rows.

const SUPREME_GATEWAY_URL = process.env.SUPREME_GATEWAY_URL?.trim().replace(/\/+$/, "");
const SUPREME_GATEWAY_API_KEY = process.env.SUPREME_GATEWAY_API_KEY?.trim();
const SCOPE = "examai";

export interface SupremeAskMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface SupremeAskSource {
  id: string;
  title: string;
  snippet: string;
  score: number;
}

export interface SupremeAskResponse {
  answer: string;
  sources: SupremeAskSource[];
  usage: {
    model: string;
    input_tokens: number;
    output_tokens: number;
    credits_charged: number | null;
    credits_remaining: number | null;
  };
  memory: { recalled: number; written: number };
}

export class SupremeAskError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: "not_configured" | "unreachable" | "rejected"
  ) {
    super(message);
  }
}

/** True once SUPREME_GATEWAY_URL is set — callers use this to decide whether
 * to route through the platform or fall back to a local integration. */
export function isSupremeAskConfigured(): boolean {
  return Boolean(SUPREME_GATEWAY_URL);
}

/**
 * Calls the Supreme AI gateway's /ask endpoint. Scope is always "examai".
 *
 * `user_id` should be the caller's Firebase UID — memory-service treats it as
 * an opaque string, so this platform's UIDs are usable as-is.
 */
export async function askSupreme(params: {
  messages: SupremeAskMessage[];
  user_id: string;
  persona?: string;
  session_id?: string;
  remember?: { content: string; category?: string; importance?: number }[];
}): Promise<SupremeAskResponse> {
  if (!SUPREME_GATEWAY_URL) {
    throw new SupremeAskError(
      "SUPREME_GATEWAY_URL is not configured",
      503,
      "not_configured"
    );
  }

  let res: Response;
  try {
    res = await fetch(`${SUPREME_GATEWAY_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(SUPREME_GATEWAY_API_KEY
          ? { Authorization: `Bearer ${SUPREME_GATEWAY_API_KEY}` }
          : {}),
      },
      body: JSON.stringify({
        messages: params.messages,
        scope: SCOPE,
        user_id: params.user_id,
        persona: params.persona,
        session_id: params.session_id,
        remember: params.remember,
      }),
      signal: AbortSignal.timeout(20_000),
    });
  } catch (err: any) {
    throw new SupremeAskError(
      `Supreme AI gateway unreachable: ${err?.message || err}`,
      503,
      "unreachable"
    );
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new SupremeAskError(
      body?.detail ? String(body.detail) : `Gateway returned ${res.status}`,
      res.status,
      "rejected"
    );
  }

  return res.json();
}
