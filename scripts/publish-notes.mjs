#!/usr/bin/env node
// Publish note markdown into the ExamAI content tables.
//
// Uses @examai/content — the same parser, validator and section-deriver the
// Reader and the admin preview use. There is deliberately no second
// implementation: if publishing derived sections differently from the preview,
// the page a reviewer approved would not be the page a student gets.
//
// Usage:
//   node scripts/publish-notes.mjs --dry-run
//   node scripts/publish-notes.mjs                       # publish everything
//   node scripts/publish-notes.mjs --file content/notes/bit253co/u6-t4-*.md
//   node scripts/publish-notes.mjs --draft               # write as draft, do not go live
//
// Connects as the WRITER role. The Reader uses a different role that cannot
// see anything this leaves unpublished.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import process from "node:process";

import pg from "pg";
import {
  publishDocument,
  parseDocument,
  ValidationFailed,
  AnchorsWouldBreak,
} from "@examai/content";

const ROOT = process.cwd();
const NOTES_DIR = join(ROOT, "content", "notes");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const AS_DRAFT = args.includes("--draft");
const ONLY_FILE = (() => {
  const i = args.indexOf("--file");
  return i >= 0 ? args[i + 1] : null;
})();

const DSN =
  process.env.EXAMAI_WRITER_DATABASE_URL ??
  process.env.DATABASE_URL ??
  "postgresql://examai_app:examai_dev_only@localhost:5432/supreme_media";

function markdownFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...markdownFiles(full));
    else if (entry.endsWith(".md")) out.push(full);
  }
  return out;
}

function describeIssues(parsed) {
  return parsed.issues
    .filter((i) => i.severity === "error")
    .map((i) => `      line ${i.line ?? "?"}: ${i.message}`)
    .join("\n");
}

async function main() {
  const files = ONLY_FILE ? [join(ROOT, ONLY_FILE)] : markdownFiles(NOTES_DIR);
  if (files.length === 0) {
    console.log(`No markdown under ${NOTES_DIR}`);
    return 0;
  }

  // Validate everything BEFORE opening a transaction. A batch that fails
  // halfway would otherwise roll back work that was fine, and the operator
  // would have to guess which note was the problem.
  let invalid = 0;
  for (const file of files) {
    const parsed = parseDocument(readFileSync(file, "utf-8"));
    const label = relative(ROOT, file);
    if (parsed.valid) {
      console.log(
        `  ok       ${label}  (${parsed.sections.length} sections, ` +
          `${parsed.toc.length} in outline)`
      );
    } else {
      invalid += 1;
      console.log(`  INVALID  ${label}\n${describeIssues(parsed)}`);
    }
  }

  if (invalid > 0) {
    console.error(`\n${invalid} file(s) failed validation. Nothing was written.`);
    return 1;
  }

  if (DRY_RUN) {
    console.log(`\n--dry-run: ${files.length} file(s) would be published.`);
    return 0;
  }

  const client = new pg.Client({ connectionString: DSN });
  await client.connect();

  try {
    // One transaction for the whole batch: either every note is live or none
    // is, so a failure never leaves a course half-published.
    await client.query("BEGIN");

    for (const file of files) {
      const source = readFileSync(file, "utf-8");
      const result = await publishDocument(client, {
        source,
        authorId: "cli:publish-notes",
        promptVersion: "topic_note.v1",
        publish: !AS_DRAFT,
      });

      const anchors = result.anchors;
      const changed =
        anchors.added.length || anchors.removed.length
          ? `  anchors +${anchors.added.length} -${anchors.removed.length}`
          : "";

      console.log(
        `  ${result.published ? "published" : "draft    "} ${relative(ROOT, file)}  ` +
          `v${result.version}  /${result.shortId}  ${result.sections} sections${changed}`
      );
    }

    await client.query("COMMIT");
    console.log(`\n${files.length} note(s) ${AS_DRAFT ? "saved as draft" : "published"}.`);
  } catch (err) {
    await client.query("ROLLBACK");

    if (err instanceof ValidationFailed) {
      console.error(`\nValidation failed:\n${err.message}`);
    } else if (err instanceof AnchorsWouldBreak) {
      // The most likely real-world failure, so it gets the clearest message:
      // someone reworded a heading and every shared link to it would break.
      console.error(`\n${err.message}`);
    } else {
      console.error(`\nPublish failed, rolled back: ${err.message}`);
    }
    return 1;
  } finally {
    await client.end();
  }

  return 0;
}

main().then((code) => process.exit(code));
