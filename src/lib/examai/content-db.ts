import "server-only";

import { Pool } from "pg";

// Postgres access for the Reader and the publish pipeline.
//
// `server-only` is the first line on purpose: importing this from a client
// component becomes a build error rather than a connection string in the
// browser bundle. There is an exit test asserting the built output contains no
// credentials, but a build-time failure is better than a test that catches it
// afterwards.
//
// TWO POOLS, and the distinction is the whole authorization model:
//
//   readerPool  connects as a role with SELECT on the published_* views only.
//               It physically cannot read a draft. A missing WHERE clause in a
//               Reader query returns "permission denied", not an unreviewed
//               page. See examai-api/migrations/004_roles_views.sql.
//
//   writerPool  full DML. Publishing and imports only. Never used to serve a
//               student-facing page.
//
// Using one pool "and remembering to filter" is the failure this design
// exists to prevent: it fails open, silently, and the page looks fine.

const READER_DSN =
  process.env.EXAMAI_READER_DATABASE_URL ??
  "postgresql://examai_web:examai_dev_only@localhost:5432/supreme_media";

const WRITER_DSN =
  process.env.EXAMAI_WRITER_DATABASE_URL ??
  process.env.DATABASE_URL ??
  "postgresql://examai_app:examai_dev_only@localhost:5432/supreme_media";

declare global {
  // Next dev reloads modules on every edit; without this each reload would leak
  // a pool and exhaust Postgres connections within a few saves.
  // eslint-disable-next-line no-var
  var __examaiReaderPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __examaiWriterPool: Pool | undefined;
}

function makePool(connectionString: string, max: number): Pool {
  const pool = new Pool({
    connectionString,
    max,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
  // An idle-client error otherwise becomes an unhandled rejection and takes the
  // whole server process down.
  pool.on("error", (err) => console.error("[examai] idle pg client error:", err.message));
  return pool;
}

export function readerPool(): Pool {
  globalThis.__examaiReaderPool ??= makePool(READER_DSN, 10);
  return globalThis.__examaiReaderPool;
}

export function writerPool(): Pool {
  globalThis.__examaiWriterPool ??= makePool(WRITER_DSN, 4);
  return globalThis.__examaiWriterPool;
}

export async function readQuery<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const result = await readerPool().query(sql, params);
  return result.rows as T[];
}

/** A DSN with the password masked, for logs and error messages. */
export function safeDsn(dsn: string): string {
  return dsn.replace(/:\/\/([^:]+):[^@]*@/, "://$1:***@");
}
