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
const examId = process.argv[2];
if (!examId) { console.error("Usage: node inspect-exam.mjs <examId>"); process.exit(1); }

const examSnap = await db.collection("exams").doc(examId).get();
console.log("EXAM:", JSON.stringify(examSnap.data(), null, 2));

const qSnap = await db.collection("questions").where("exam_id", "==", examId).limit(3).get();
console.log(`\n${qSnap.size} question(s) sampled:\n`);
qSnap.forEach((doc) => {
  const d = doc.data();
  console.log(`Q: ${d.question_text}`);
  console.log(`  A) ${d.option_a}  B) ${d.option_b}  C) ${d.option_c}  D) ${d.option_d}`);
  console.log(`  ANSWER: ${d.correct_option}  EXPLAIN: ${d.explanation}\n`);
});
process.exit(0);
