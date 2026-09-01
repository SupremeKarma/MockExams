// One-shot importer: reads every subject file under bulk-imports/ and
// creates the matching exam + questions directly in Firestore via the
// Admin SDK, bypassing the manual "create exam -> paste bulk import" steps.
//
// Run with: npm run import-bulk-exams

import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

dotenv.config({ path: path.join(ROOT, ".env.local") });

if (admin.apps.length === 0) {
  const rawProjectId = process.env.FIREBASE_PROJECT_ID;
  const rawClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let pk = process.env.FIREBASE_PRIVATE_KEY || "";

  if (pk.startsWith('"') && pk.endsWith('"')) pk = pk.slice(1, -1);
  pk = pk.replace(/\\n/g, "\n").replace(/\r\n/g, "\n");

  if (!pk || !rawProjectId || !rawClientEmail) {
    console.error("❌ Firebase environment variables are missing.");
    process.exit(1);
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: rawProjectId,
      clientEmail: rawClientEmail,
      privateKey: pk,
    }),
  });
  console.log("✅ Firebase Admin initialized successfully.");
}

const db = admin.firestore();
const BULK_ROOT = path.join(ROOT, "bulk-imports");

// --- Parser: mirrors src/lib/bulkQuestionParser.ts exactly (MCQ + written) ---
const OPTION_RE = /^\s*([A-Da-d])[).:-]\s*(.+)$/;
const Q_RE = /^\s*(?:Q(?:uestion)?)\s*[:.)-]\s*(.+)$/i;
const ANSWER_RE = /^\s*(?:ANSWER|CORRECT)\s*[:.)-]\s*([A-Da-d])\b.*$/i;
const TYPE_RE = /^\s*TYPE\s*[:.)-]\s*(mcq|written)\s*$/i;
const MODEL_ANSWER_RE = /^\s*MODEL[\s_]?ANSWER\s*[:.)-]\s*(.*)$/i;
const EXPLAIN_RE = /^\s*(?:EXPLAIN(?:ATION)?)\s*[:.)-]\s*(.*)$/i;
const DIFFICULTY_RE = /^\s*DIFFICULTY\s*[:.)-]\s*(easy|medium|hard)\s*$/i;
const MARKS_RE = /^\s*MARKS\s*[:.)-]\s*([\d.]+)\s*$/i;
const NEGATIVE_RE = /^\s*NEGATIVE(?:\s*MARKS)?\s*[:.)-]\s*([\d.]+)\s*$/i;

function parseBlock(block) {
  const lines = block.split("\n").map((l) => l.trimEnd());
  const errors = [];
  let questionLines = [], modelAnswerLines = [], explanationLines = [];
  const options = {};
  let correctLetter = null, type = "mcq", difficulty = "medium", marks = 1, negativeMarks = 0.25;
  let mode = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    let m;
    if ((m = line.match(Q_RE))) { questionLines.push(m[1]); mode = "question"; continue; }
    if ((m = line.match(OPTION_RE))) { options[m[1].toLowerCase()] = m[2].trim(); mode = null; continue; }
    if ((m = line.match(ANSWER_RE))) { correctLetter = m[1].toLowerCase(); mode = null; continue; }
    if ((m = line.match(TYPE_RE))) { type = m[1].toLowerCase(); mode = null; continue; }
    if ((m = line.match(MODEL_ANSWER_RE))) { modelAnswerLines.push(m[1]); mode = "model_answer"; continue; }
    if ((m = line.match(EXPLAIN_RE))) { explanationLines.push(m[1]); mode = "explanation"; continue; }
    if ((m = line.match(DIFFICULTY_RE))) { difficulty = m[1].toLowerCase(); mode = null; continue; }
    if ((m = line.match(MARKS_RE))) { marks = parseFloat(m[1]); mode = null; continue; }
    if ((m = line.match(NEGATIVE_RE))) { negativeMarks = parseFloat(m[1]); mode = null; continue; }
    if (mode === "question") questionLines.push(line);
    else if (mode === "explanation") explanationLines.push(line);
    else if (mode === "model_answer") modelAnswerLines.push(line);
  }

  const question_text = questionLines.join(" ").trim();
  const model_answer = modelAnswerLines.join(" ").trim();
  const explanation = explanationLines.join(" ").trim();

  if (!question_text) errors.push("Missing question text");
  if (type === "written") {
    if (!model_answer) errors.push("Written questions need MODEL_ANSWER");
  } else {
    if (!options.a || !options.b || !options.c || !options.d) errors.push("Needs all four options");
    if (!correctLetter) errors.push("Missing ANSWER");
    else if (!options[correctLetter]) errors.push("ANSWER points to missing option");
  }

  if (errors.length > 0) return { errors, question: null };

  return {
    errors: [],
    question: {
      type,
      question_text,
      option_a: options.a ?? "",
      option_b: options.b ?? "",
      option_c: options.c ?? "",
      option_d: options.d ?? "",
      correct_option: correctLetter ?? "a",
      model_answer,
      explanation,
      difficulty,
      marks: Number.isFinite(marks) ? marks : 1,
      negativeMarks: Number.isFinite(negativeMarks) ? negativeMarks : 0.25,
    },
  };
}

function parseBulkQuestions(text) {
  const normalized = text.replace(/\r\n/g, "\n");
  const roughBlocks = normalized
    .split(/\n\s*\n|\n-{3,}\n/)
    .flatMap((chunk) => {
      const pieces = [];
      let current = [];
      for (const line of chunk.split("\n")) {
        if (Q_RE.test(line) && current.some((l) => l.trim())) {
          pieces.push(current.join("\n"));
          current = [line];
        } else current.push(line);
      }
      if (current.some((l) => l.trim())) pieces.push(current.join("\n"));
      return pieces;
    })
    .filter((b) => b.trim().length > 0);
  return roughBlocks.map(parseBlock);
}

// --- Exam manifest: file -> exam metadata ---
const MANIFEST = [
  { file: "BIT/2022/computer-network.md", title: "Computer Network — BIT373CO (2022, Old Course)", category: "Engineering", description: "Purbanchal University, 2022. Bachelor in Information Technology (B.I.T.) / Sixth Semester / Final. BIT373CO: Computer Network (Old Course). Full Marks: 80 / Pass Marks: 32. Time: 03:00 hrs.", duration_minutes: 35, passing_score: 40 },
  { file: "BIT/2022/advance-oop.md", title: "Advance OOP — BIT376CO (2022, Old Course)", category: "Engineering", description: "Purbanchal University, 2022. Bachelor in Information Technology (B.I.T.) / Sixth Semester / Final. BIT376CO: Advance Object-Oriented Programming (Old Course). Full Marks: 80 / Pass Marks: 32. Time: 03:00 hrs.", duration_minutes: 30, passing_score: 40 },
  { file: "BIT/2022/research-methodology.md", title: "Research Methodology — BIT308SH (2022, Old Course)", category: "Engineering", description: "Purbanchal University, 2022. Bachelor in Information Technology (B.I.T.) / Sixth Semester / Final. BIT308SH: Research Methodology (Old Course). Full Marks: 80 / Pass Marks: 32. Time: 03:00 hrs.", duration_minutes: 20, passing_score: 40 },
  { file: "BIT/2022/embedded-system.md", title: "Embedded System Programming — BIT370CO (2022, Old Course)", category: "Engineering", description: "Purbanchal University, 2022. Bachelor in Information Technology (B.I.T.) / Sixth Semester / Final. BIT370CO: Embedded System Programming (Old Course). Full Marks: 80 / Pass Marks: 32. Time: 03:00 hrs.", duration_minutes: 20, passing_score: 40 },
  { file: "BIT/2022/data-mining.md", title: "Data Mining & Data Warehousing — BIT371CO (2022, Old Course)", category: "Engineering", description: "Purbanchal University, 2022. Bachelor in Information Technology (B.I.T.) / Sixth Semester / Final. BIT371CO: Data Mining & Data Warehousing (Old Course). Full Marks: 80 / Pass Marks: 32. Time: 03:00 hrs.", duration_minutes: 20, passing_score: 40 },

  { file: "BIT/2024/numerical-methods.md", title: "Numerical Methods — BIT201HS/BIT280CO (2024)", category: "Engineering", description: "Purbanchal University, 2024. Bachelor of Information Technology (B.I.T.) / Third Semester / Final. BIT201HS/BIT280CO: Numerical Methods (New/Back). Full Marks: 80 / Pass Marks: 32. Time: 03:00 hrs.", duration_minutes: 30, passing_score: 40 },
  { file: "BIT/2024/microcontroller.md", title: "Microcontroller — BIT202CO (2024)", category: "Engineering", description: "Purbanchal University, 2024. Bachelor in Information Technology (B.I.T.) / Third Semester / Final. BIT202CO: Microcontroller (New Course). Full Marks: 80 / Pass Marks: 32. Time: 03:00 hrs.", duration_minutes: 25, passing_score: 40 },
  { file: "BIT/2024/data-structure-algorithm.md", title: "Data Structure & Algorithm — BIT203CO (2024)", category: "Engineering", description: "Purbanchal University, 2024. Bachelor in Information Technology (B.I.T.) / 3rd Semester / Final/Back. BIT203CO/BIT273CO/BIT215CS: Data Structure & Algorithm. Full Marks: 80 / Pass Marks: 32. Time: 03:00 hrs.", duration_minutes: 25, passing_score: 40 },
  { file: "BIT/2024/computer-network.md", title: "Computer Network and Data Communication — BIT204CO (2024)", category: "Engineering", description: "Purbanchal University, 2024. Bachelor in Information Technology (B.I.T.) / Third Semester / Final. BIT204CO: Computer Network and Data Communication (New Course). Full Marks: 80 / Pass Marks: 32. Time: 03:00 hrs.", duration_minutes: 35, passing_score: 40 },
  { file: "BIT/2024/system-analysis-design.md", title: "System Analysis & Design — BIT205CO (2024)", category: "Engineering", description: "Purbanchal University, 2024. Bachelor in Information Technology (B.I.T.) / Third Semester / Final. BIT205CO/BIT270CO: System Analysis & Design (New/Back Course). Full Marks: 80 / Pass Marks: 32. Time: 03:00 hrs.", duration_minutes: 25, passing_score: 40 },

  { file: "BIT/2025/artificial-intelligence.md", title: "Artificial Intelligence — BIT351CO (2025)", category: "Engineering", description: "Purbanchal University, 2025. Bachelor in Information Technology (B.I.T.) / Sixth Semester / Final. BIT351CO: Artificial Intelligence (New Course). Full Marks: 80 / Pass Marks: 32. Time: 03:00 hrs.", duration_minutes: 20, passing_score: 40 },
  { file: "BIT/2025/mis.md", title: "Management Information System — BIT352CO (2025)", category: "Engineering", description: "Purbanchal University, 2025. Bachelor in Information Technology (B.I.T.) / Sixth Semester / Final. BIT352CO: Management Information System (New Course). Full Marks: 80 / Pass Marks: 32. Time: 03:00 hrs.", duration_minutes: 25, passing_score: 40 },
  { file: "BIT/2025/dwdm.md", title: "Data Warehousing and Mining — BIT353CO (2025)", category: "Engineering", description: "Purbanchal University, 2025. Bachelor in Information Technology (B.I.T.) / Sixth Semester / Final. BIT353CO: Data Warehousing and Mining (New Course). Full Marks: 80 / Pass Marks: 32. Time: 03:00 hrs.", duration_minutes: 20, passing_score: 40 },
  { file: "BIT/2025/simulation-modeling.md", title: "Simulation and Modeling — BIT354CO (2025)", category: "Engineering", description: "Purbanchal University, 2025. Bachelor in Information Technology (B.I.T.) / Sixth Semester / Final. BIT354CO: Simulation and Modeling (New Course). Full Marks: 80 / Pass Marks: 32. Time: 03:00 hrs.", duration_minutes: 25, passing_score: 40 },
  { file: "BIT/2025/software-engineering.md", title: "Software Engineering — BIT355CO (2025)", category: "Engineering", description: "Purbanchal University, 2025. Bachelor in Information Technology (B.I.T.) / Sixth Semester / Final. BIT355CO: Software Engineering (New Course). Full Marks: 80 / Pass Marks: 32. Time: 03:00 hrs.", duration_minutes: 25, passing_score: 40 },

  { file: "BIT/2026/artificial-intelligence.md", title: "Artificial Intelligence — BIT351CO (2026)", category: "Engineering", description: "Purbanchal University, 2026. Bachelor in Information Technology (B.I.T.) / Sixth Semester / Final. BIT351CO: Artificial Intelligence (New Course). Full Marks: 80 / Pass Marks: 24. Time: 03:00 hrs.", duration_minutes: 25, passing_score: 30 },
  { file: "BIT/2026/mis.md", title: "Management Information System — BIT352CO (2026)", category: "Engineering", description: "Purbanchal University, 2026. Bachelor in Information Technology (B.I.T.) / Sixth Semester / Final. BIT352CO: Management Information System (New Course). Full Marks: 80 / Pass Marks: 32. Time: 03:00 hrs.", duration_minutes: 25, passing_score: 40 },
  { file: "BIT/2026/dwdm.md", title: "Data Warehousing and Data Mining — BIT353CO (2026)", category: "Engineering", description: "Purbanchal University, 2026. Bachelor in Information Technology (B.I.T.) / Sixth Semester / Final. BIT353CO: Data Warehousing and Data Mining (New Course). Full Marks: 80 / Pass Marks: 32. Time: 03:00 hrs.", duration_minutes: 30, passing_score: 40 },
  { file: "BIT/2026/simulation-modeling.md", title: "Simulation & Modeling — BIT354CO (2026)", category: "Engineering", description: "Purbanchal University, 2026. Bachelor in Information Technology (B.I.T.) / Sixth Semester / Final. BIT354CO: Simulation & Modeling (New Course). Full Marks: 80 / Pass Marks: 32. Time: 03:00 hrs.", duration_minutes: 30, passing_score: 40 },
  { file: "BIT/2026/software-engineering.md", title: "Software Engineering — BIT355CO (2026)", category: "Engineering", description: "Purbanchal University, 2026. Bachelor in Information Technology (B.I.T.) / Sixth Semester / Final. BIT355CO: Software Engineering (New Course). Full Marks: 80 / Pass Marks: 32. Time: 03:00 hrs.", duration_minutes: 25, passing_score: 40 },

  { file: "BIT/_demo/artificial-intelligence-demo.md", title: "Artificial Intelligence — Try Written Mode", category: "Engineering", description: "Demo exam mixing multiple-choice and written (AI-graded) questions on BIT351CO Artificial Intelligence topics — try both answer formats in one exam.", duration_minutes: 30, passing_score: 40 },
  { file: "BIT/_demo/dbms-written-demo.md", title: "Database Management System — Semester Descriptive Exam", category: "Engineering", description: "Fully descriptive (written, AI-graded) semester theory paper for a bachelor's degree DBMS course — 10 long/short answer questions covering ER modeling, normalization, ACID, joins, indexing, deadlocks, keys, and distributed databases, each with a detailed model answer and an examiner marking scheme. Full Marks: 74. Try rich-text answers, voice dictation, and diagram uploads.", duration_minutes: 90, passing_score: 30 },

  { file: "entrance-exams/IOE/be-barch-model-2015.md", title: "IOE B.E./B.Arch Entrance Model Exam (2015)", category: "Engineering", description: "Tribhuvan University, Institute of Engineering (IOE). B.E./B.Arch Entrance Examination model question set — English, Physics, Chemistry, Mathematics, and Engineering Aptitude.", duration_minutes: 60, passing_score: 40 },
  { file: "entrance-exams/NEB-Physics/model-2077.md", title: "NEB Grade 12 Physics Model Exam (2077/2020)", category: "Science", description: "National Examinations Board (NEB), Nepal. Grade XII Physics Model Question set, 2077 (2020). Sub. Code: 210.", duration_minutes: 25, passing_score: 40 },
];

async function importExam(entry) {
  const filePath = path.join(BULK_ROOT, entry.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Skipping missing file: ${entry.file}`);
    return;
  }

  const text = fs.readFileSync(filePath, "utf-8");
  const results = parseBulkQuestions(text);
  const valid = results.filter((r) => r.question);
  const invalid = results.filter((r) => !r.question);

  if (invalid.length > 0) {
    console.warn(`⚠️  ${entry.file}: ${invalid.length} block(s) failed to parse and were skipped.`);
  }
  if (valid.length === 0) {
    console.error(`❌ ${entry.file}: no valid questions, skipping exam creation.`);
    return;
  }

  const examRef = db.collection("exams").doc();
  await examRef.set({
    title: entry.title,
    category: entry.category,
    duration_minutes: entry.duration_minutes,
    passing_score: entry.passing_score,
    is_published: true,
    description: entry.description,
    created_by: "bulk-import-script",
    total_questions: valid.length,
    visibility: "public",
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  const batch = db.batch();
  valid.forEach((r, idx) => {
    const q = r.question;
    const qRef = db.collection("questions").doc();
    batch.set(qRef, {
      exam_id: examRef.id,
      type: q.type,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_option: q.correct_option,
      model_answer: q.model_answer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      marks: q.marks,
      negativeMarks: q.negativeMarks,
      order_in_exam: idx + 1,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
  await batch.commit();

  console.log(`✅ ${entry.title}: created with ${valid.length} question(s) [exam_id: ${examRef.id}]`);
}

async function main() {
  console.log(`Importing ${MANIFEST.length} exams from bulk-imports/...\n`);
  for (const entry of MANIFEST) {
    await importExam(entry);
  }
  console.log("\nDone.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Import failed:", err);
  process.exit(1);
});
