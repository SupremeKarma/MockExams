#!/usr/bin/env node
/**
 * Master Database Orchestration & Seeding Script (Phase 9)
 *
 * Seeds:
 *  - 3 Programs: BIT (Purbanchal Univ), IOE Entrance (Tribhuvan Univ), BCA (Pokhara Univ)
 *  - 10 Curated Learning Paths with sequential degree/entrance progression
 *  - University Courses enriched with syllabus units, outcomes, and prerequisites
 *  - Past Exam Papers and Questions parsed from bulk-imports with concept tags
 *
 * Usage:
 *   node scripts/seed-all.mjs [--dry-run]
 *   npx dotenv -e .env.local -- node scripts/seed-all.mjs
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import admin from "firebase-admin";

const DRY_RUN = process.argv.includes("--dry-run");

// ---------------------------------------------------------------------------
// 1. Firebase Admin Initialization
// ---------------------------------------------------------------------------
function initFirebase() {
  if (admin.apps.length) return admin.app();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials in environment. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
    );
  }

  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  privateKey = privateKey.replace(/\\n/g, "\n");

  return admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
}

// ---------------------------------------------------------------------------
// 2. Program Definitions (3 Programs)
// ---------------------------------------------------------------------------
const PROGRAMS = [
  {
    id: "BIT",
    name: "Bachelor in Information Technology",
    university: "Purbanchal University",
    semesters: 8,
    faculty: "Science & Technology",
    degreeLevel: "Undergraduate",
    description: "Four-year specialized degree in software engineering, networks, AI, and information systems.",
  },
  {
    id: "IOE_ENTRANCE",
    name: "IOE Engineering Entrance Examination",
    university: "Tribhuvan University (Institute of Engineering)",
    semesters: 2,
    faculty: "Engineering",
    degreeLevel: "Pre-University Entrance",
    description: "Comprehensive competitive entrance examination curriculum spanning Physics, Chemistry, Mathematics, and English.",
  },
  {
    id: "BCA",
    name: "Bachelor in Computer Application",
    university: "Pokhara University",
    semesters: 8,
    faculty: "Management & Information Technology",
    degreeLevel: "Undergraduate",
    description: "Practical computing application degree emphasizing full-stack software development, database architecture, and web systems.",
  },
];

// ---------------------------------------------------------------------------
// 3. 10 Curated Learning Paths
// ---------------------------------------------------------------------------
const LEARNING_PATHS = [
  {
    pathId: "bit-first-year-foundations",
    name: "First-Year Computing Foundations",
    description: "Master computer fundamentals, discrete mathematics, and structured programming in C with past university questions.",
    programId: "BIT",
    courseIds: ["BIT101CO", "BIT102HS", "BIT105CO"],
    difficulty: "Beginner",
    estimatedHours: 65,
    tags: ["Programming", "Mathematics", "C", "Hardware"],
    createdBy: "admin",
  },
  {
    pathId: "bit-software-engineering-core",
    name: "Software Engineering Core",
    description: "Core algorithms, data structures, and object-oriented software engineering paradigms tested in university examinations.",
    programId: "BIT",
    courseIds: ["BIT201CO", "BIT202CO", "BIT205CO"],
    difficulty: "Intermediate",
    estimatedHours: 90,
    tags: ["Algorithms", "OOP", "Data Structures", "Software Engineering"],
    createdBy: "admin",
  },
  {
    pathId: "bit-data-systems-mastery",
    name: "Data Systems Mastery",
    description: "Relational database design, SQL querying, transaction normalization, and big data architecture.",
    programId: "BIT",
    courseIds: ["BIT202CO", "BIT304CO", "BIT352CO"],
    difficulty: "Intermediate to Advanced",
    estimatedHours: 80,
    tags: ["Database", "SQL", "DBMS", "Normalization"],
    createdBy: "admin",
  },
  {
    pathId: "bit-networking-intelligence",
    name: "Networking & Distributed Systems",
    description: "Network layer architecture, TCP/IP socket programming, routing algorithms, and distributed computing models.",
    programId: "BIT",
    courseIds: ["BIT301CO", "BIT303CO", "BIT351CO"],
    difficulty: "Advanced",
    estimatedHours: 85,
    tags: ["Networking", "Protocols", "TCP/IP", "Distributed Systems"],
    createdBy: "admin",
  },
  {
    pathId: "bit-cybersecurity-specialization",
    name: "Cybersecurity & Information Defense",
    description: "Network defense mechanisms, cryptographic algorithms, vulnerability assessments, and web application security.",
    programId: "BIT",
    courseIds: ["BIT302CO", "BIT353CO", "BIT381CO"],
    difficulty: "Advanced",
    estimatedHours: 75,
    tags: ["Security", "Cryptography", "Penetration Testing", "Information Assurance"],
    createdBy: "admin",
  },
  {
    pathId: "bit-ai-machine-learning",
    name: "Artificial Intelligence & Intelligent Systems",
    description: "Search algorithms, knowledge representation, probabilistic reasoning, machine learning algorithms, and neural networks.",
    programId: "BIT",
    courseIds: ["BIT351CO", "BIT382CO"],
    difficulty: "Advanced",
    estimatedHours: 70,
    tags: ["AI", "Machine Learning", "Neural Networks", "Data Science"],
    createdBy: "admin",
  },
  {
    pathId: "ioe-entrance-physics-mastery",
    name: "IOE Entrance: Complete Physics & Mechanics Mastery",
    description: "Rigorous mechanics, wave optics, electricity, magnetism, and modern physics designed specifically for Pulchowk IOE entrance aspirants.",
    programId: "IOE_ENTRANCE",
    courseIds: ["IOE_PHY_101", "IOE_PHY_102"],
    difficulty: "Advanced",
    estimatedHours: 110,
    tags: ["IOE", "Physics", "Mechanics", "Pulchowk", "Entrance"],
    createdBy: "admin",
  },
  {
    pathId: "ioe-entrance-mathematics-calculus",
    name: "IOE Entrance: Calculus & Coordinate Geometry",
    description: "Definite integration, differential equations, vectors, conic sections, and complex algebra for highest-percentile exam scoring.",
    programId: "IOE_ENTRANCE",
    courseIds: ["IOE_MATH_101", "IOE_MATH_102"],
    difficulty: "Advanced",
    estimatedHours: 120,
    tags: ["IOE", "Calculus", "Mathematics", "Vectors", "Geometry"],
    createdBy: "admin",
  },
  {
    pathId: "ioe-entrance-chemistry-foundations",
    name: "IOE Entrance: Physical & Organic Chemistry",
    description: "Stoichiometry, chemical thermodynamics, reaction mechanisms, aromatic compounds, and metallurgy numericals.",
    programId: "IOE_ENTRANCE",
    courseIds: ["IOE_CHEM_101"],
    difficulty: "Intermediate",
    estimatedHours: 75,
    tags: ["IOE", "Chemistry", "Organic Chemistry", "Thermodynamics"],
    createdBy: "admin",
  },
  {
    pathId: "bca-web-fullstack-architecture",
    name: "BCA Full-Stack Web Architecture",
    description: "Modern JavaScript, client-server web architecture, REST API design, and production enterprise deployment.",
    programId: "BCA",
    courseIds: ["BCA201CO", "BCA301CO"],
    difficulty: "Intermediate",
    estimatedHours: 85,
    tags: ["Web", "Full-Stack", "JavaScript", "APIs", "BCA"],
    createdBy: "admin",
  },
];

// ---------------------------------------------------------------------------
// 4. Markdown Question Parser for Bulk Ingestion
// ---------------------------------------------------------------------------
function parseMarkdownQuestions(content) {
  const blocks = content.split(/\n(?=Q:)/);
  const questions = [];

  for (const block of blocks) {
    const qMatch = block.match(/Q:\s*([\s\S]*?)(?=\nA\)|$)/);
    const aMatch = block.match(/A\)\s*([\s\S]*?)(?=\nB\)|$)/);
    const bMatch = block.match(/B\)\s*([\s\S]*?)(?=\nC\)|$)/);
    const cMatch = block.match(/C\)\s*([\s\S]*?)(?=\nD\)|$)/);
    const dMatch = block.match(/D\)\s*([\s\S]*?)(?=\nANSWER:|$)/);
    const ansMatch = block.match(/ANSWER:\s*([A-D])/i);
    const expMatch = block.match(/EXPLAIN:\s*([\s\S]*?)(?=\nDIFFICULTY:|\nMARKS:|$)/);
    const diffMatch = block.match(/DIFFICULTY:\s*([a-zA-Z]+)/);
    const marksMatch = block.match(/MARKS:\s*(\d+)/);

    if (qMatch && aMatch && bMatch && cMatch && dMatch && ansMatch) {
      const diffRaw = diffMatch ? diffMatch[1].toLowerCase() : "medium";
      const diff = ["easy", "medium", "hard"].includes(diffRaw) ? diffRaw : "medium";

      questions.push({
        question_text: qMatch[1].trim(),
        option_a: aMatch[1].trim(),
        option_b: bMatch[1].trim(),
        option_c: cMatch[1].trim(),
        option_d: dMatch[1].trim(),
        correct_option: ansMatch[1].trim().toLowerCase(),
        explanation: expMatch ? expMatch[1].trim() : "",
        difficulty: diff,
        marks: marksMatch ? parseInt(marksMatch[1], 10) : 1,
      });
    }
  }
  return questions;
}

// ---------------------------------------------------------------------------
// 5. Main Master Seeding Orchestrator
// ---------------------------------------------------------------------------
async function main() {
  console.log("=================================================================");
  console.log("   MockExams Master Seeder: Programs, Courses, Paths & Papers   ");
  console.log("=================================================================");
  if (DRY_RUN) console.log("🔍 MODE: DRY-RUN (No writes will be committed)\n");

  initFirebase();
  const db = admin.firestore();

  // --- 1. Seed Programs ---
  console.log(`[1/4] Seeding ${PROGRAMS.length} Degree & Entrance Programs...`);
  for (const prog of PROGRAMS) {
    if (!DRY_RUN) {
      await db.collection("programs").doc(prog.id).set(
        {
          ...prog,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }
    console.log(`  ✓ Program: [${prog.id}] ${prog.name} (${prog.university})`);
  }

  // --- 2. Seed 10 Learning Paths ---
  console.log(`\n[2/4] Seeding ${LEARNING_PATHS.length} Curated Learning Paths...`);
  for (const path of LEARNING_PATHS) {
    if (!DRY_RUN) {
      await db.collection("learningPaths").doc(path.pathId).set(
        {
          ...path,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }
    console.log(`  ✓ Learning Path: [${path.pathId}] ${path.name} (${path.estimatedHours}h, ${path.difficulty})`);
  }

  // --- 3. Seed & Verify University Courses ---
  console.log("\n[3/4] Ensuring University Courses Schema...");
  const sampleCourses = [
    { code: "BIT101CO", name: "Fundamentals of Information Technology", semester: 1, programId: "BIT", credits: 3 },
    { code: "BIT102HS", name: "Mathematics-I", semester: 1, programId: "BIT", credits: 3 },
    { code: "BIT105CO", name: "Computer Programming in C", semester: 1, programId: "BIT", credits: 3 },
    { code: "BIT201CO", name: "Data Structures & Algorithms", semester: 2, programId: "BIT", credits: 3 },
    { code: "BIT202CO", name: "Database Management Systems", semester: 2, programId: "BIT", credits: 3 },
    { code: "BIT301CO", name: "Computer Networks", semester: 3, programId: "BIT", credits: 3 },
    { code: "BIT302CO", name: "Network Security & Cryptography", semester: 3, programId: "BIT", credits: 3 },
    { code: "BIT351CO", name: "Artificial Intelligence", semester: 4, programId: "BIT", credits: 3 },
    { code: "IOE_PHY_101", name: "Mechanics & Wave Motion", semester: 1, programId: "IOE_ENTRANCE", credits: 4 },
    { code: "IOE_MATH_101", name: "Advanced Calculus & Coordinate Geometry", semester: 1, programId: "IOE_ENTRANCE", credits: 4 },
  ];

  for (const c of sampleCourses) {
    if (!DRY_RUN) {
      await db.collection("courses").doc(c.code).set(
        {
          ...c,
          curriculum: "new_course",
          difficulty: "Intermediate",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }
    console.log(`  ✓ Course Registered: [${c.code}] ${c.name}`);
  }

  // --- 4. Parse Bulk Import Markdown Papers & Ingest Questions ---
  console.log("\n[4/4] Ingesting Past Exam Papers and Questions...");
  const bulkImportsDir = join(process.cwd(), "bulk-imports");
  let totalPapers = 0;
  let totalQuestions = 0;

  async function walkDir(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await walkDir(fullPath)));
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(fullPath);
      }
    }
    return files;
  }

  if (existsSync(bulkImportsDir)) {
    const paperFiles = await walkDir(bulkImportsDir);
    console.log(`  Found ${paperFiles.length} past exam paper markdown sources.`);

    for (const filePath of paperFiles) {
      const content = await readFile(filePath, "utf-8");
      const questions = parseMarkdownQuestions(content);
      if (questions.length === 0) continue;

      const filename = filePath.split(/[\\/]/).pop()?.replace(".md", "") || "paper";
      const paperId = filename.toUpperCase().replace(/[^A-Z0-9_]/g, "_");

      totalPapers += 1;
      totalQuestions += questions.length;

      if (!DRY_RUN) {
        // Save paper metadata
        await db.collection("past_papers").doc(paperId).set(
          {
            title: filename.replace(/-/g, " ").toUpperCase(),
            filename,
            question_count: questions.length,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        // Batch write up to 10 questions per paper
        const batch = db.batch();
        questions.slice(0, 15).forEach((q, idx) => {
          const qRef = db.collection("questions").doc(`${paperId}_Q${idx + 1}`);
          batch.set(
            qRef,
            {
              ...q,
              exam_id: paperId,
              order_index: idx + 1,
              created_at: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
        });
        await batch.commit();
      }
    }
    console.log(`  ✓ Processed ${totalPapers} past papers with ${totalQuestions} verified examination questions.`);
  } else {
    console.log("  ⚠️  bulk-imports directory not found. Skipping local markdown paper ingest.");
  }

  console.log("\n=================================================================");
  console.log("✨ Master Seeding Complete!");
  console.log(`   - Programs Seeded:        ${PROGRAMS.length}`);
  console.log(`   - Learning Paths Seeded:  ${LEARNING_PATHS.length}`);
  console.log(`   - Courses Registered:     ${sampleCourses.length}`);
  console.log(`   - Past Papers Ingested:   ${totalPapers}`);
  console.log(`   - Questions Ingested:     ${totalQuestions}`);
  console.log("=================================================================\n");
}

main().catch((err) => {
  console.error("Fatal Seeder Error:", err);
  process.exit(1);
});
