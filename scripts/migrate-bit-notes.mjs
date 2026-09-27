#!/usr/bin/env node
// scripts/migrate-bit-notes.mjs
//
// One-time / repeatable migration script to push bitNotesData into Firestore
// under collection: studentNotes/{courseId}/topics/{topicId}
// and course metadata in studentNotes/{courseId}
//
// Usage:
//   npx dotenv -e .env.local -- npx tsx scripts/migrate-bit-notes.mjs --dry-run
//   npx dotenv -e .env.local -- npx tsx scripts/migrate-bit-notes.mjs

import admin from "firebase-admin";
import { bitNotesData } from "../src/data/bitNotesData.ts";

const DRY_RUN = process.argv.includes("--dry-run");

function initFirebase() {
  if (admin.apps.length) return admin.app();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\n/g, "\n");

    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  return admin.initializeApp();
}

async function migrateBitNotes() {
  console.log("=== Phase 1: Migrate BIT Notes to Firestore ===");
  console.log(`Mode: ${DRY_RUN ? "DRY RUN (no writes)" : "LIVE WRITE"}\n`);

  initFirebase();
  const db = admin.firestore();

  let totalCourses = 0;
  let totalTopics = 0;

  for (const [semesterStr, subjects] of Object.entries(bitNotesData)) {
    const semester = parseInt(semesterStr, 10);
    for (const [subjectKey, subject] of Object.entries(subjects)) {
      totalCourses++;
      const courseId = subject.code;
      const courseRef = db.collection("studentNotes").doc(courseId);

      const coursePayload = {
        courseId,
        subjectKey,
        name: subject.subjectName,
        code: subject.code,
        semester,
        creditHours: subject.creditHours,
        theoryTopics: subject.theoryTopics || [],
        topicsCount: (subject.topics || []).length,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      if (!DRY_RUN) {
        await courseRef.set(coursePayload, { merge: true });
      }

      console.log(`Course [${courseId}] Sem ${semester}: ${subject.subjectName} (${subject.topics?.length || 0} topics)`);

      for (const topic of subject.topics || []) {
        totalTopics++;
        const topicRef = courseRef.collection("topics").doc(topic.id);
        const topicPayload = {
          topicId: topic.id,
          courseId,
          name: topic.name,
          keyPoints: topic.keyPoints || [],
          code: topic.code || "",
          theory: topic.theory || "",
          example: topic.example || "",
          importance: topic.importance || "Medium",
          theoryTopics: subject.theoryTopics || [],
          commonExamQuestions: topic.commonExamQuestions || [],
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        if (!DRY_RUN) {
          await topicRef.set(topicPayload, { merge: true });
        }
      }
    }
  }

  console.log("\n--- Migration Summary ---");
  console.log(`Courses processed: ${totalCourses}`);
  console.log(`Topics processed:  ${totalTopics}`);

  if (DRY_RUN) {
    console.log("[DRY RUN] No documents were written.");
  } else {
    console.log("✅ All notes and topics successfully written to studentNotes collection!");
  }
}

migrateBitNotes().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
