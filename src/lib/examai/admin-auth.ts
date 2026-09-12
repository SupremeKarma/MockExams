// Admin guard for ExamAI API routes, and the call into the FastAPI worker.
//
// The trust chain is: browser holds a Firebase ID token -> these routes verify
// it and check the role -> the worker is called with a shared internal key.
// The worker has Admin SDK credentials and does NOT re-check the user, so this
// file is the only thing standing between a signed-in student and the ability
// to overwrite any paper. Treat changes here as security changes.

import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export type Role = "admin" | "org_admin" | "examiner" | "student";

/** Roles that may author and review papers — the same set the app calls "staff". */
const STAFF_ROLES: readonly Role[] = ["admin", "examiner", "org_admin"];

export interface AuthedAdmin {
  uid: string;
  role: Role;
}

type GuardResult = { ok: true; user: AuthedAdmin } | { ok: false; response: NextResponse };

/**
 * Verify the caller is signed in and is staff.
 *
 * Role is read from `users/{uid}.role`, matching what AuthContext and
 * admin/layout.tsx already do, with a custom claim honoured too for accounts
 * provisioned by script. Rules keep `role` immutable from the client, which is
 * what makes the document trustworthy as an authorisation source.
 */
export async function requireStaff(request: Request): Promise<GuardResult> {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return { ok: false, response: NextResponse.json({ error: "Please sign in." }, { status: 401 }) };
  }

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(token);
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Your session expired. Please sign in again." }, { status: 401 }),
    };
  }
  if (!decoded) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Auth is not configured on the server." }, { status: 503 }),
    };
  }

  const claimRole = typeof decoded.role === "string" ? (decoded.role as Role) : null;
  const snap = await adminDb.collection("users").doc(decoded.uid).get();
  const docRole = (snap.exists ? snap.data()?.role : null) as Role | null;
  const role = claimRole ?? docRole ?? "student";

  if (!STAFF_ROLES.includes(role)) {
    return { ok: false, response: NextResponse.json({ error: "Staff only." }, { status: 403 }) };
  }

  return { ok: true, user: { uid: decoded.uid, role } };
}

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------

export class WorkerUnavailableError extends Error {}

function workerConfig(): { url: string; key: string } {
  const url = process.env.EXAMAI_WORKER_URL;
  const key = process.env.EXAMAI_INTERNAL_API_KEY;
  if (!url || !key) {
    throw new WorkerUnavailableError(
      "EXAMAI_WORKER_URL and EXAMAI_INTERNAL_API_KEY must both be set for paper processing."
    );
  }
  return { url: url.replace(/\/$/, ""), key };
}

/**
 * Call the FastAPI worker.
 *
 * Stage endpoints return 202 immediately and report progress through the job
 * document, so this never waits on the actual work — a long extraction held
 * open through a serverless function would be killed by the platform's request
 * timeout, leaving a paper stuck in `uploaded` with nothing recorded about why.
 */
export async function callWorker<T>(
  path: string,
  init: { method: "GET" | "POST"; body?: unknown }
): Promise<T> {
  const { url, key } = workerConfig();

  const response = await fetch(`${url}${path}`, {
    method: init.method,
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Key": key,
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });

  const text = await response.text();
  if (!response.ok) {
    let detail = text.slice(0, 500);
    try {
      detail = JSON.parse(text).detail ?? detail;
    } catch {
      // Not JSON — the raw body is the better error anyway.
    }
    throw new Error(`Worker ${response.status}: ${detail}`);
  }

  return text ? (JSON.parse(text) as T) : ({} as T);
}
