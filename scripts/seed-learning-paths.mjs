#!/usr/bin/env node
// scripts/seed-learning-paths.mjs
//
// Seeds default BIT Learning Paths and enriches courses with student-facing fields:
// - courses/{courseId}
// - learningPaths/{pathId}
//
// Usage:
//   npx dotenv -e .env.local -- npx tsx scripts/seed-learning-paths.mjs --dry-run
//   npx dotenv -e .env.local -- npx tsx scripts/seed-learning-paths.mjs

import admin from "firebase-admin";

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

const COURSES_TO_ENRICH = [
  {
    courseId: "BIT101",
    name: "Programming in C",
    semester: 1,
    programId: "BIT",
    credits: 3,
    description: "Foundational structured programming covering syntax, pointer mechanics, dynamic memory allocation, and data storage.",
    learningOutcomes: [
      "Master pointer arithmetic and dynamic heap allocation",
      "Implement modular algorithms with structured function calls",
      "Design file I/O operations and composite struct data types",
    ],
    prerequisites: ["Basic Computer Literacy"],
    difficulty: "Beginner",
  },
  {
    courseId: "BIT102",
    name: "Mathematics-I (Calculus & Vectors)",
    semester: 1,
    programId: "BIT",
    credits: 3,
    description: "Calculus, differential equations, vectors, and mean value theorems required for computer science analysis.",
    learningOutcomes: [
      "Apply Rolle's and Lagrange's Mean Value Theorems",
      "Evaluate partial derivatives and homogeneous differential functions",
      "Solve first-order linear differential equations",
    ],
    prerequisites: ["Secondary School Mathematics"],
    difficulty: "Beginner",
  },
  {
    courseId: "BIT201",
    name: "Object-Oriented Programming in C++",
    semester: 2,
    programId: "BIT",
    credits: 3,
    description: "Object-oriented design principles including classes, inheritance, polymorphism, virtual dispatch, and templates.",
    learningOutcomes: [
      "Architect modular systems using encapsulation and class hierarchies",
      "Implement dynamic runtime polymorphism via vtables and abstract classes",
      "Handle memory safety with destructors and exception mechanisms",
    ],
    prerequisites: ["BIT101: Programming in C"],
    difficulty: "Intermediate",
  },
  {
    courseId: "BIT301",
    name: "Data Structures & Algorithms",
    semester: 3,
    programId: "BIT",
    credits: 3,
    description: "Linear and non-linear data structures, trees, graphs, sorting techniques, and asymptotic complexity analysis.",
    learningOutcomes: [
      "Analyze algorithm efficiency using Big-O notation",
      "Implement linked lists, binary search trees, and heaps",
      "Execute graph traversals (BFS, DFS) and shortest-path algorithms",
    ],
    prerequisites: ["BIT201: Object-Oriented Programming in C++"],
    difficulty: "Intermediate",
  },
  {
    courseId: "BIT401",
    name: "Database Management Systems",
    semester: 4,
    programId: "BIT",
    credits: 3,
    description: "Relational database modeling, SQL query optimization, transaction processing, and normalization normal forms.",
    learningOutcomes: [
      "Formulate relational schemas up to BCNF and 4NF",
      "Write advanced SQL queries with indexing and transaction control",
      "Understand ACID properties and concurrency control algorithms",
    ],
    prerequisites: ["BIT301: Data Structures & Algorithms"],
    difficulty: "Intermediate",
  },
  {
    courseId: "BIT351CO",
    name: "Operating Systems",
    semester: 5,
    programId: "BIT",
    credits: 3,
    description: "Kernel architecture, process synchronization, CPU scheduling, virtual memory management, and deadlock avoidance.",
    learningOutcomes: [
      "Implement IPC mechanisms and process scheduling strategies",
      "Solve race conditions using semaphores, mutexes, and monitors",
      "Simulate Banker's algorithm and paging page replacement schemes",
    ],
    prerequisites: ["BIT301: Data Structures & Algorithms"],
    difficulty: "Intermediate",
  },
  {
    courseId: "BIT601",
    name: "Computer Networks",
    semester: 6,
    programId: "BIT",
    credits: 3,
    description: "OSI and TCP/IP protocol suites, packet switching, IP addressing, routing protocols, and transport layer reliability.",
    learningOutcomes: [
      "Calculate IPv4/IPv6 subnet masks and routing tables",
      "Analyze TCP 3-way handshake and sliding window flow control",
      "Implement socket programming for distributed communications",
    ],
    prerequisites: ["BIT351CO: Operating Systems"],
    difficulty: "Intermediate",
  },
  {
    courseId: "BIT701",
    name: "Artificial Intelligence",
    semester: 7,
    programId: "BIT",
    credits: 3,
    description: "Heuristic search algorithms, knowledge representation, game theory, logic resolution, and introduction to neural networks.",
    learningOutcomes: [
      "Implement A*, Minimax with Alpha-Beta pruning, and hill climbing",
      "Formalize first-order logic and inference mechanisms",
      "Develop basic machine learning classification models",
    ],
    prerequisites: ["BIT301: Data Structures & Algorithms"],
    difficulty: "Advanced",
  },
  {
    courseId: "BIT801",
    name: "Network Security & Cryptography",
    semester: 8,
    programId: "BIT",
    credits: 3,
    description: "Symmetric and asymmetric encryption, public key infrastructure, digital signatures, hash algorithms, and threat modeling.",
    learningOutcomes: [
      "Calculate RSA encryption and Diffie-Hellman key exchanges",
      "Deploy SSL/TLS certificates and authenticate public keys",
      "Analyze security vulnerabilities and apply mitigation controls",
    ],
    prerequisites: ["BIT601: Computer Networks"],
    difficulty: "Advanced",
  },
];

const LEARNING_PATHS = [
  {
    pathId: "bit-first-year-foundations",
    name: "First Semester Foundations",
    description: "Master essential C programming mechanics, algorithmic thinking, and core university mathematics for computer science.",
    programId: "BIT",
    courseIds: ["BIT101", "BIT102"],
    difficulty: "Beginner",
    estimatedHours: 45,
    tags: ["Programming in C", "Calculus", "Foundations", "PU-BIT"],
    createdBy: "admin",
  },
  {
    pathId: "bit-software-engineering-core",
    name: "Software & Systems Architecture",
    description: "Level up from procedural C to object-oriented C++ design, mastering memory safety, inheritance, and dynamic polymorphism.",
    programId: "BIT",
    courseIds: ["BIT201", "BIT301"],
    difficulty: "Intermediate",
    estimatedHours: 60,
    tags: ["C++", "Data Structures", "Algorithms", "OOP"],
    createdBy: "admin",
  },
  {
    pathId: "bit-data-systems-mastery",
    name: "Data Systems & Operating Core",
    description: "Comprehensive study of relational databases, query optimization, operating system processes, memory management, and deadlocks.",
    programId: "BIT",
    courseIds: ["BIT401", "BIT351CO"],
    difficulty: "Intermediate",
    estimatedHours: 65,
    tags: ["Databases", "Operating Systems", "SQL", "Kernel"],
    createdBy: "admin",
  },
  {
    pathId: "bit-networking-intelligence",
    name: "Networks & Artificial Intelligence",
    description: "Connect networked distributed architectures with modern AI algorithms, search trees, and intelligent agent systems.",
    programId: "BIT",
    courseIds: ["BIT601", "BIT701"],
    difficulty: "Advanced",
    estimatedHours: 70,
    tags: ["Networking", "Artificial Intelligence", "Protocols", "Heuristics"],
    createdBy: "admin",
  },
  {
    pathId: "bit-cybersecurity-specialization",
    name: "Cybersecurity & Cryptographic Defense",
    description: "Advanced cryptographic mathematics, network defense, public key infrastructure, and secure communications protocols.",
    programId: "BIT",
    courseIds: ["BIT601", "BIT801"],
    difficulty: "Advanced",
    estimatedHours: 55,
    tags: ["Security", "Cryptography", "RSA", "Defense"],
    createdBy: "admin",
  },
];

async function seedLearningPaths() {
  console.log("=== Phase 3: Seed Courses & Learning Paths ===");
  console.log(`Mode: ${DRY_RUN ? "DRY RUN (no writes)" : "LIVE WRITE"}\n`);

  initFirebase();
  const db = admin.firestore();

  // 1. Enrich courses
  console.log(`Enriching ${COURSES_TO_ENRICH.length} course(s)...`);
  for (const c of COURSES_TO_ENRICH) {
    const courseRef = db.collection("courses").doc(c.courseId);
    const payload = {
      code: c.courseId,
      courseId: c.courseId,
      name: c.name,
      semester: c.semester,
      programId: c.programId,
      credits: c.credits,
      description: c.description,
      learningOutcomes: c.learningOutcomes,
      prerequisites: c.prerequisites,
      difficulty: c.difficulty,
      curriculum: "new_course",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (!DRY_RUN) {
      await courseRef.set(payload, { merge: true });
    }
    console.log(`  ✓ Course [${c.courseId}] ${c.name} (${c.difficulty})`);
  }

  // 2. Seed learning paths
  console.log(`\nSeeding ${LEARNING_PATHS.length} Learning Path(s)...`);
  for (const p of LEARNING_PATHS) {
    const pathRef = db.collection("learningPaths").doc(p.pathId);
    const payload = {
      ...p,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (!DRY_RUN) {
      await pathRef.set(payload, { merge: true });
    }
    console.log(`  ✓ Path [${p.pathId}] "${p.name}" (${p.courseIds.join(" -> ")})`);
  }

  console.log("\n--- Seeding Complete ---");
  if (DRY_RUN) {
    console.log("[DRY RUN] No writes performed.");
  } else {
    console.log("✅ Successfully seeded courses and learning paths in Firestore!");
  }
}

seedLearningPaths().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
