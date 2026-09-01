/**
 * Bulk topic-tagging for the question bank.
 *
 *   node scripts/tag-questions.mjs              # dry run: prints proposed tags
 *   node scripts/tag-questions.mjs --apply      # writes them
 *   node scripts/tag-questions.mjs --exam <id>  # limit to one exam
 *
 * Dry run is the default on purpose. A wrong tag silently distorts a student's
 * weak-area analysis, which is far harder to spot than a wrong answer — so the
 * proposals are meant to be read before they are written.
 *
 * Requires serviceAccountKey.json and GEMINI_API_KEY in .env.local.
 */

import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const BATCH_SIZE = 20;

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const EXAM_ID = args.includes("--exam") ? args[args.indexOf("--exam") + 1] : null;

function readEnv(key) {
  const file = path.resolve(".env.local");
  if (!fs.existsSync(file)) return null;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (line.startsWith(`${key}=`)) {
      return line.slice(key.length + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  return null;
}

const apiKey = process.env.GEMINI_API_KEY || readEnv("GEMINI_API_KEY");
if (!apiKey) {
  console.error("GEMINI_API_KEY not found in environment or .env.local");
  process.exit(1);
}

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

const SYSTEM_PROMPT = `You label exam questions with the specific concept each one tests, so a study platform can detect which concepts a student is weak in.

You will be given a subject and a numbered list of questions. Respond with ONLY a JSON array, no other text and no markdown fences:

[{"n": <the question number>, "topic": "<concept label>"}]

Rules for a good label:
- Name the CONCEPT tested, not the subject. "AVL Rotations", not "Data Structures".
- 1 to 4 words. Title case. No trailing punctuation.
- Reuse the exact same label for questions testing the same concept — consistency matters more than precision, because these labels are grouped.
- If a question is too vague to label confidently, use the subject name itself rather than guessing.
- Return one entry for every question number given, in order.`;

function subjectFromExamTitle(title) {
  if (!title) return "General";
  const [subject] = title.split(/[—–-]{1,2}\s*BIT|\s+—\s+|\s+–\s+/);
  return (subject || title).trim().replace(/\s*\(\d{4}\)\s*$/, "").trim() || "General";
}

function normaliseTopic(raw) {
  return raw.trim().replace(/[.,;:]+$/, "").replace(/\s+/g, " ").split(" ").slice(0, 4).join(" ").slice(0, 60);
}

async function suggest(subject, batch) {
  const listing = batch
    .map((q, i) => `${i + 1}. ${String(q.question_text).replace(/\s+/g, " ").slice(0, 300)}`)
    .join("\n");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: `Subject: ${subject}\n\nQuestions:\n${listing}` }] }],
        generationConfig: { maxOutputTokens: 2000, temperature: 0.2 },
      }),
    }
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gemini ${res.status}: ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = (data?.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("\n");
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON array in response");

  const out = [];
  for (const item of JSON.parse(match[0])) {
    const n = Number(item?.n);
    const topic = typeof item?.topic === "string" ? normaliseTopic(item.topic) : "";
    if (!Number.isInteger(n) || n < 1 || n > batch.length || !topic) continue;
    out.push({ id: batch[n - 1].id, question_text: batch[n - 1].question_text, topic });
  }
  return out;
}

async function main() {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"))),
  });
  const db = admin.firestore();

  const examTitles = new Map();
  for (const doc of (await db.collection("exams").get()).docs) {
    examTitles.set(doc.id, doc.data().title ?? "");
  }

  let query = db.collection("questions");
  if (EXAM_ID) query = query.where("exam_id", "==", EXAM_ID);

  const all = (await query.get()).docs.map((d) => ({ id: d.id, ...d.data() }));
  const untagged = all.filter((q) => !q.topic && q.question_text);

  console.log(`${all.length} questions in scope, ${untagged.length} untagged.`);
  if (untagged.length === 0) return;

  // Group by exam so each batch shares a subject for consistent labelling.
  const byExam = new Map();
  for (const q of untagged) {
    if (!byExam.has(q.exam_id)) byExam.set(q.exam_id, []);
    byExam.get(q.exam_id).push(q);
  }

  const proposals = [];
  for (const [examId, questions] of byExam) {
    const subject = subjectFromExamTitle(examTitles.get(examId) ?? "");
    for (let i = 0; i < questions.length; i += BATCH_SIZE) {
      const batch = questions.slice(i, i + BATCH_SIZE);
      try {
        const results = await suggest(subject, batch);
        proposals.push(...results);
        console.log(`  ${subject}: tagged ${results.length}/${batch.length}`);
      } catch (err) {
        console.error(`  ${subject}: batch failed — ${err.message}`);
      }
    }
  }

  const counts = {};
  for (const p of proposals) counts[p.topic] = (counts[p.topic] || 0) + 1;

  console.log(`\nProposed ${proposals.length} tags across ${Object.keys(counts).length} distinct topics:`);
  for (const [topic, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}  ${topic}`);
  }

  console.log("\nSample:");
  for (const p of proposals.slice(0, 8)) {
    console.log(`  [${p.topic}] ${String(p.question_text).replace(/\s+/g, " ").slice(0, 78)}`);
  }

  if (!APPLY) {
    console.log(`\nDry run — nothing written. Re-run with --apply to save these ${proposals.length} tags.`);
    return;
  }

  let written = 0;
  for (let i = 0; i < proposals.length; i += 400) {
    const chunk = proposals.slice(i, i + 400);
    const batch = db.batch();
    for (const p of chunk) batch.update(db.collection("questions").doc(p.id), { topic: p.topic });
    await batch.commit();
    written += chunk.length;
  }
  console.log(`\nApplied ${written} tags.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
