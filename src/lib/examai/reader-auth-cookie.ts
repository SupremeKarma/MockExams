/**
 * Shared between the client (AuthContext, which writes it) and the server
 * (reader-auth.ts, which reads it) — kept in its own file, with no
 * `server-only` import, so importing the constant from a client component
 * never pulls in code that would throw in the browser bundle.
 */
export const READER_AUTH_COOKIE = "examai_auth";
