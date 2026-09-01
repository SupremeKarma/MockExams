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
const snap = await db.collection("exams").orderBy("title").get();
console.log(`Total exams: ${snap.size}\n`);
snap.forEach((doc) => {
  const d = doc.data();
  console.log(`[${doc.id}] "${d.title}" | category=${d.category} | total_questions=${d.total_questions} | created_by=${d.created_by ?? "?"} | published=${d.is_published}`);
});
process.exit(0);
