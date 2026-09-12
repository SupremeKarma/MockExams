import "server-only";

import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { READER_AUTH_COOKIE } from "./reader-auth-cookie";

export { READER_AUTH_COOKIE };

export interface ReaderUser {
  uid: string;
}

/**
 * The signed-in reader, or null for an anonymous visitor (or a search
 * engine's crawler, which never carries any cookie at all).
 *
 * The cookie holds a raw Firebase ID token, kept fresh client-side by
 * AuthContext's `onIdTokenChanged` listener. It is not httpOnly — a client
 * listener has no way to set one — but that does not widen the token's
 * exposure: the Firebase client SDK already holds the same token in memory
 * for every signed-in tab. `verifyIdToken` re-checks the signature and
 * expiry against Firebase itself, so a stale, forged, or expired cookie
 * value simply falls back to "anonymous" rather than granting access to
 * gated content.
 */
export async function getReaderUser(): Promise<ReaderUser | null> {
  const token = (await cookies()).get(READER_AUTH_COOKIE)?.value;
  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded ? { uid: decoded.uid } : null;
  } catch {
    // Expired, malformed, or Admin SDK not configured on this deploy — all
    // three mean "cannot prove this reader is signed in," which is exactly
    // what anonymous means. Never throw the Reader page over an auth cookie.
    return null;
  }
}
