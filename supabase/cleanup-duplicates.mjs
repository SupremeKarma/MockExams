import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

if (admin.apps.length === 0) {
  let pk = process.env.FIREBASE_PRIVATE_KEY || "";
  if (pk.startsWith('"') && pk.endsWith('"')) pk = pk.slice(1, -1);
  pk = pk.replace(/\\n/g, "\n").replace(/\r\n/g, "\n");
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: pk,
    }),
  });
}

const db = admin.firestore();

// Duplicates of my own bulk-import-script exams (generic "BIT 20XX — ..."
// titles, created by an earlier/separate import process using the same
// source .md files).
const DUPES_OF_MINE = [
  ["VudgQ2QWbieDWqbA1HFs", "BIT 2022 — Advanced Object-Oriented Programming (Java/C++)"],
  ["5jk8uNAtzoyuMNSfBAj9", "BIT 2022 — Computer Networks & Protocols"],
  ["F0UJehdre6xiMCgjvdxy", "BIT 2022 — Data Mining & Business Intelligence"],
  ["ZTygtcsjci5fD87SlD57", "BIT 2022 — Embedded Systems & IoT Architecture"],
  ["oGqQt1NZDCltWXYOkWcD", "BIT 2022 — Research Methodology & Academic Writing"],
  ["3WhP49OJlua09u7BSfXM", "BIT 2024 — Computer Networks & Protocols"],
  ["pEEF9hTF6CqjDH75AqOL", "BIT 2024 — Data Structures & Algorithms (DSA)"],
  ["ttkxzuDP7qj1i5Cg73qq", "BIT 2024 — Microcontrollers & 8051 Architecture"],
  ["oA8GV9ZG2eexCZ6ULtkD", "BIT 2024 — Numerical Methods & Computational Math"],
  ["pHfIugl6c5lcRS9HMoCW", "BIT 2024 — System Analysis & Design (SAD)"],
  ["yWj9ZGv5QvXVZnGzhGZQ", "BIT 2025 — Artificial Intelligence & Expert Systems"],
  ["f1oV39IkgGisIJSV8lWv", "BIT 2025 — Data Warehousing & Data Mining (DWDM)"],
  ["ihppLheQbOwRHi8bmgAB", "BIT 2025 — Management Information Systems (MIS)"],
  ["waw3viroEUgvpdBVPTYV", "BIT 2025 — Software Engineering & Agile Lifecycle"],
  ["Z8vlWlRgqOdySKt3EWHW", "BIT 2025 — System Simulation & Mathematical Modeling"],
  ["wC3ODqZZ5xPKI9n7lR8j", "BIT 2026 — Artificial Intelligence & Expert Systems"],
  ["tU91w51BpzDuRWcMoSmK", "BIT 2026 — Data Warehousing & Data Mining (DWDM)"],
  ["mfMm6hdr3eDM5xULyW7V", "BIT 2026 — Management Information Systems (MIS)"],
  ["ssyXmj9QC8FhE8sz8rii", "BIT 2026 — Software Engineering & Agile Lifecycle"],
  ["Uiy151ydH2cysda9mJar", "BIT 2026 — System Simulation & Mathematical Modeling"],
  ["zlXYl15mwMYbqwhaMzv6", "IOE Entrance Model Exam (BE / B.Arch)"],
  ["VhCo6pDNcrGfluXI4Z74", "NEB Grade 12 Physics Board Model Exam"],
];

// Pre-existing duplicate pairs unrelated to my imports — keep the first id
// listed, delete the second.
const OLD_DUPLICATE_PAIRS_DELETE = [
  ["u8GUdJDunIQ3nsHOMzjb", "IOE Entrance Model Exam 2081 (duplicate copy)"],
  ["aGSNRaPZrOyXkOcnP7ia", "NEB Grade 12 Physics Final Prep (duplicate copy)"],
];

const TO_DELETE = [...DUPES_OF_MINE, ...OLD_DUPLICATE_PAIRS_DELETE];

async function deleteExam(examId, title) {
  const qSnap = await db.collection("questions").where("exam_id", "==", examId).get();
  const batch = db.batch();
  qSnap.forEach((doc) => batch.delete(doc.ref));
  batch.delete(db.collection("exams").doc(examId));
  await batch.commit();
  console.log(`🗑️  Deleted "${title}" [${examId}] and ${qSnap.size} question(s)`);
}

async function main() {
  console.log(`Deleting ${TO_DELETE.length} duplicate exams...\n`);
  for (const [id, title] of TO_DELETE) {
    await deleteExam(id, title);
  }
  console.log("\nDone.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Cleanup failed:", err);
  process.exit(1);
});
