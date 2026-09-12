#!/usr/bin/env node
// Seed programs/{BIT} and courses/{CODE} from the generated syllabus vocabulary.
//
// Source of truth is examai-ingest/schema/units.sem*.json, which is itself
// generated from src/data/bitSyllabusData.ts by scripts/dump-syllabus-units.ts.
// Going through the generated files rather than the TypeScript directly keeps
// exactly one definition of a unit id: the one questions are already tagged
// with. Reading the .ts here and numbering units independently would be a
// second implementation of unitId(), and the day the two disagree every tag on
// every extracted question silently stops matching.
//
// Usage:
//   npm run seed-examai            # writes programs/ and courses/
//   node scripts/seed-examai-courses.mjs --dry-run

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import admin from "firebase-admin";

const SCHEMA_DIR = join(process.cwd(), "examai-ingest", "schema");
const DRY_RUN = process.argv.includes("--dry-run");

const PROGRAM = {
  id: "BIT",
  name: "Bachelor in Information Technology",
  university: "Purbanchal University",
  semesters: 8,
};

/**
 * Which curriculum a subject code belongs to.
 *
 * Derived from the code, never from a paper's printed "(New Course)" label —
 * 2022 old-curriculum papers print that too, because the label was relative to
 * a still earlier revision. The generated vocabulary only contains current
 * codes, so anything we are seeding here is by definition new_course; the
 * function exists so the rule is written down where the field is set.
 */
function curriculumFor(subjectCode) {
  const legacy = /^BIT3(7|8)\d[A-Z]{2}$/;
  return legacy.test(subjectCode) ? "old_course" : "new_course";
}

function initFirebase() {
  if (admin.apps.length) return admin.app();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY " +
        "(run through `dotenv -e .env.local --` like the other scripts)."
    );
  }
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) privateKey = privateKey.slice(1, -1);
  privateKey = privateKey.replace(/\\n/g, "\n");

  return admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
}

async function loadCourses() {
  const files = (await readdir(SCHEMA_DIR)).filter(
    (name) => name.startsWith("units.sem") && name.endsWith(".json")
  );
  if (files.length === 0) {
    throw new Error(
      `No units.sem*.json in ${SCHEMA_DIR}. Generate them first:\n` +
        "  node scripts/dump-syllabus-units.ts"
    );
  }

  const courses = [];
  for (const file of files.sort()) {
    const data = JSON.parse(await readFile(join(SCHEMA_DIR, file), "utf-8"));
    for (const subject of data.subjects) {
      courses.push({
        code: subject.subject_code,
        name: subject.subject_name,
        semester: data.semester,
        programId: PROGRAM.id,
        credits: subject.credits ?? 3,
        curriculum: curriculumFor(subject.subject_code),
        syllabusUnits: subject.units.map((unit) => ({
          unitId: unit.unit_id,
          title: unit.title,
        })),
      });
    }
  }
  return courses;
}

async function main() {
  const courses = await loadCourses();

  console.log(`Program: ${PROGRAM.id} — ${PROGRAM.name}`);
  console.log(`Courses: ${courses.length}`);
  for (const course of courses) {
    console.log(
      `  sem ${course.semester}  ${course.code.padEnd(10)} ${course.syllabusUnits.length
        .toString()
        .padStart(2)} units  ${course.name}`
    );
  }

  if (DRY_RUN) {
    console.log("\n--dry-run: nothing written.");
    return;
  }

  const db = admin.firestore(initFirebase());

  await db.collection("programs").doc(PROGRAM.id).set(PROGRAM, { merge: true });

  // merge:true so a re-run after a syllabus edit updates unit titles without
  // detaching papers already filed under the course.
  let batch = db.batch();
  let pending = 0;
  for (const course of courses) {
    batch.set(db.collection("courses").doc(course.code), course, { merge: true });
    if (++pending % 400 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }
  await batch.commit();

  console.log(`\nSeeded 1 program and ${courses.length} courses.`);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
