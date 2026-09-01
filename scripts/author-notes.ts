/**
 * Draft study notes for a subject from the official syllabus.
 *
 *   npm run author-notes -- --subject BIT353CO           # dry run, prints drafts
 *   npm run author-notes -- --subject BIT353CO --apply   # writes drafts to Firestore
 *   npm run author-notes -- --semester 6 --apply         # every subject in a semester
 *
 * Dry run is the default. Nothing this writes is visible to students: every
 * document lands with status "draft", and the Firestore rules only expose
 * "approved" notes. A human reviews before publication because a wrong note
 * costs a student marks.
 *
 * Written in TypeScript and run through tsx so it uses the same
 * src/lib/notes-authoring.ts the app uses — the prompt and parsing live in one
 * place, not two.
 */

import admin from "firebase-admin";
import fs from "fs";
import { bitSyllabusData } from "../src/data/bitSyllabusData";
import { authorUnitNotes, reviewFlags, type AuthoredTopic } from "../src/lib/notes-authoring";

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const SUBJECT = args.includes("--subject") ? args[args.indexOf("--subject") + 1] : null;
const SEMESTER = args.includes("--semester") ? Number(args[args.indexOf("--semester") + 1]) : null;
const LIMIT_UNITS = args.includes("--units") ? Number(args[args.indexOf("--units") + 1]) : null;

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set. Run via `npm run author-notes` so .env.local loads.");
  process.exit(1);
}

interface Target {
  semester: number;
  code: string;
  name: string;
  units: string[];
}

function targets(): Target[] {
  const out: Target[] = [];
  for (const sem of bitSyllabusData) {
    if (SEMESTER !== null && sem.semester !== SEMESTER) continue;
    for (const subject of sem.subjects) {
      if (SUBJECT && subject.code.toUpperCase() !== SUBJECT.toUpperCase()) continue;
      // Practical and project entries have no examinable theory units.
      if (!subject.keyUnits?.length) continue;
      out.push({
        semester: sem.semester,
        code: subject.code,
        name: subject.name,
        units: LIMIT_UNITS ? subject.keyUnits.slice(0, LIMIT_UNITS) : subject.keyUnits,
      });
    }
  }
  return out;
}

async function main() {
  // Refuse to run unscoped. Without this, a missing or mis-forwarded argument
  // silently starts authoring all 44 subjects — dozens of minutes of model
  // calls nobody asked for.
  if (!SUBJECT && SEMESTER === null) {
    console.error(
      "Refusing to run over the whole syllabus. " +
        "Scope it: --subject <CODE> or --semester <N>. Add --all to override."
    );
    if (!args.includes("--all")) process.exit(1);
  }

  const list = targets();
  if (list.length === 0) {
    console.error("No matching subject. Pass --subject <CODE> or --semester <N>.");
    process.exit(1);
  }

  console.log(
    `Scope: ${list.length} subject(s), ${list.reduce((n, t) => n + t.units.length, 0)} units. ` +
      (APPLY ? "WRITING DRAFTS." : "Dry run.")
  );

  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"))),
  });
  const db = admin.firestore();

  const drafted: { target: Target; unit: string; topic: AuthoredTopic; flags: string[] }[] = [];

  for (const target of list) {
    console.log(`\n${target.code} — ${target.name} (semester ${target.semester}), ${target.units.length} units`);

    for (const unit of target.units) {
      try {
        const topics = await authorUnitNotes(apiKey!, {
          subjectCode: target.code,
          subjectName: target.name,
          unit,
        });

        for (const topic of topics) {
          const flags = reviewFlags(topic);
          drafted.push({ target, unit, topic, flags });
        }

        const ungrounded = topics.filter((t) => !t.grounded).length;
        console.log(
          `  ${unit}: ${topics.length} topic(s)` + (ungrounded ? ` — ${ungrounded} UNGROUNDED` : "")
        );
      } catch (err) {
        console.error(`  ${unit}: FAILED — ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  const flagged = drafted.filter((d) => d.flags.length > 0);

  console.log(`\n${drafted.length} topics drafted, ${flagged.length} flagged for attention.`);
  if (flagged.length > 0) {
    console.log("\nFlagged:");
    for (const f of flagged.slice(0, 15)) {
      console.log(`  [${f.topic.name}] ${f.flags.join("; ")}`);
    }
  }

  console.log("\nSample:");
  for (const d of drafted.slice(0, 3)) {
    console.log(`  ${d.topic.name} [${d.topic.importance}] — ${d.topic.keyPoints.length} key points, ${d.topic.sources.length} sources`);
    console.log(`    ${d.topic.keyPoints[0]}`);
  }

  if (!APPLY) {
    console.log(`\nDry run — nothing written. Re-run with --apply to save ${drafted.length} drafts.`);
    return;
  }

  let written = 0;
  for (let i = 0; i < drafted.length; i += 300) {
    const chunk = drafted.slice(i, i + 300);
    const batch = db.batch();
    for (const d of chunk) {
      batch.set(db.collection("notes").doc(d.topic.id), {
        subject_code: d.target.code,
        subject_name: d.target.name,
        semester: d.target.semester,
        syllabus_unit: d.unit,
        name: d.topic.name,
        importance: d.topic.importance,
        keyPoints: d.topic.keyPoints,
        theory: d.topic.theory,
        commonExamQuestions: d.topic.commonExamQuestions,
        sources: d.topic.sources,
        grounded: d.topic.grounded,
        review_flags: d.flags,
        // Never published directly: rules only expose "approved".
        status: "draft",
        generated_by: `gemini:${process.env.GEMINI_MODEL || "default"}`,
        generated_at: new Date().toISOString(),
      });
    }
    await batch.commit();
    written += chunk.length;
  }

  console.log(`\nWrote ${written} drafts with status "draft". Review and approve before students see them.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
