#!/usr/bin/env node
// Ingests solved-paper markdown from solutions/ into the Supreme AI platform's
// shared knowledge collection (services/memory-service in the SUPREME-AI repo),
// under scope "examai" — the same scope the tutor's /ask calls read from
// (see src/lib/supremeAsk.ts). This is the piece that makes /ask's `sources`
// stop being empty for this app.
//
// One knowledge doc per file: each file in solutions/ is already a single
// question + solution + marking scheme (see solutions/BIT351CO/2025/*.md for
// the shape) — small enough that no further chunking is needed or wanted;
// splitting a question from its own marking scheme would make retrieval worse,
// not better.
//
// Usage:
//   MEMORY_SERVICE_URL=http://localhost:8020 INTERNAL_API_KEY=... node scripts/ingest-knowledge.mjs
//   node scripts/ingest-knowledge.mjs --dry-run   # parse + print, no network calls

import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const SCOPE = "examai";
const SOLUTIONS_DIR = join(process.cwd(), "solutions");
const MEMORY_SERVICE_URL = (process.env.MEMORY_SERVICE_URL || "http://localhost:8020").replace(/\/+$/, "");
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "";
const DRY_RUN = process.argv.includes("--dry-run");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name.endsWith(".md")) files.push(full);
  }
  return files;
}

// solutions/BIT351CO/2025/BIT351CO_2025_regular_A1.md
// -> { subject: "BIT351CO", year: "2025", examType: "regular", question: "A1" }
function parseMeta(filePath) {
  const rel = relative(SOLUTIONS_DIR, filePath).split(sep);
  const [subject, year] = rel;
  const base = rel[rel.length - 1].replace(/\.md$/, "");
  const parts = base.split("_");
  const question = parts[parts.length - 1];
  const examType = parts.slice(2, -1).join("_") || "regular";
  return { subject, year, examType, question };
}

async function main() {
  const files = await walk(SOLUTIONS_DIR);
  console.log(`Found ${files.length} solved-paper files under solutions/`);

  if (!DRY_RUN && !MEMORY_SERVICE_URL) {
    console.error("MEMORY_SERVICE_URL is not set. Use --dry-run to preview without it.");
    process.exit(1);
  }

  let ok = 0, failed = 0;
  for (const filePath of files) {
    const content = await readFile(filePath, "utf-8");
    const meta = parseMeta(filePath);
    // Title is the dedupe key (scope+title is unique in the knowledge table),
    // so it must be stable across re-runs — the relative path already is.
    const title = relative(SOLUTIONS_DIR, filePath).split(sep).join("/").replace(/\.md$/, "");

    if (DRY_RUN) {
      console.log(`[dry-run] ${title}  (${meta.subject} ${meta.year} ${meta.examType} Q${meta.question}, ${content.length} chars)`);
      continue;
    }

    try {
      const res = await fetch(`${MEMORY_SERVICE_URL}/v1/knowledge/${SCOPE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Key": INTERNAL_API_KEY,
        },
        body: JSON.stringify({
          title,
          content,
          metadata: meta,
          source: "mockexams-solutions",
        }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`${res.status} ${body.slice(0, 200)}`);
      }
      ok++;
      process.stdout.write(".");
    } catch (err) {
      failed++;
      console.error(`\nFAILED ${title}: ${err.message || err}`);
    }
  }

  if (!DRY_RUN) console.log(`\nIngested ${ok}/${files.length} (${failed} failed) into scope "${SCOPE}"`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
