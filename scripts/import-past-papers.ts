import * as fs from 'fs';
import * as path from 'path';
import admin from 'firebase-admin';

// 1. Initialize Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ serviceAccountKey.json not found at:', serviceAccountPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

interface ParsedQuestion {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
}

interface ExamMeta {
  title: string;
  category: 'Engineering' | 'Science' | 'Mathematics' | 'Medical' | 'Competitive';
  duration_minutes: number;
  passing_score: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  negative_marking: boolean;
  subject: string;
  year?: number;
}

function parseMarkdownQuestions(filePath: string): ParsedQuestion[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const blocks = content.split(/\n(?=Q:)/);
  const questions: ParsedQuestion[] = [];

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
      const diffRaw = diffMatch ? diffMatch[1].toLowerCase() : 'medium';
      const diff = (['easy', 'medium', 'hard'].includes(diffRaw) ? diffRaw : 'medium') as 'easy' | 'medium' | 'hard';

      questions.push({
        question_text: qMatch[1].trim(),
        option_a: aMatch[1].trim(),
        option_b: bMatch[1].trim(),
        option_c: cMatch[1].trim(),
        option_d: dMatch[1].trim(),
        correct_option: ansMatch[1].trim().toLowerCase(),
        explanation: expMatch ? expMatch[1].trim() : '',
        difficulty: diff,
        marks: marksMatch ? parseInt(marksMatch[1], 10) : 1
      });
    }
  }
  return questions;
}

function getExamMetadata(filePath: string): ExamMeta {
  const normalized = filePath.replace(/\\/g, '/');

  if (normalized.includes('entrance-exams/IOE')) {
    return {
      title: 'IOE Entrance Model Exam (BE / B.Arch)',
      category: 'Engineering',
      duration_minutes: 120,
      passing_score: 50,
      difficulty: 'Hard',
      negative_marking: true,
      subject: 'IOE Entrance Comprehensive'
    };
  }

  if (normalized.includes('entrance-exams/NEB-Physics')) {
    return {
      title: 'NEB Grade 12 Physics Board Model Exam',
      category: 'Science',
      duration_minutes: 90,
      passing_score: 40,
      difficulty: 'Medium',
      negative_marking: false,
      subject: 'NEB Grade 12 Physics'
    };
  }

  // BIT papers
  const yearMatch = normalized.match(/BIT\/(\d{4})\/([^/]+)\.md/);
  if (yearMatch) {
    const year = parseInt(yearMatch[1], 10);
    const slug = yearMatch[2];

    const titleMap: Record<string, { title: string; category: ExamMeta['category'] }> = {
      'advance-oop': { title: 'Advanced Object-Oriented Programming (Java/C++)', category: 'Engineering' },
      'computer-network': { title: 'Computer Networks & Protocols', category: 'Engineering' },
      'data-mining': { title: 'Data Mining & Business Intelligence', category: 'Engineering' },
      'embedded-system': { title: 'Embedded Systems & IoT Architecture', category: 'Engineering' },
      'research-methodology': { title: 'Research Methodology & Academic Writing', category: 'Science' },
      'data-structure-algorithm': { title: 'Data Structures & Algorithms (DSA)', category: 'Engineering' },
      'microcontroller': { title: 'Microcontrollers & 8051 Architecture', category: 'Engineering' },
      'numerical-methods': { title: 'Numerical Methods & Computational Math', category: 'Mathematics' },
      'system-analysis-design': { title: 'System Analysis & Design (SAD)', category: 'Engineering' },
      'artificial-intelligence': { title: 'Artificial Intelligence & Expert Systems', category: 'Engineering' },
      'dwdm': { title: 'Data Warehousing & Data Mining (DWDM)', category: 'Engineering' },
      'mis': { title: 'Management Information Systems (MIS)', category: 'Engineering' },
      'simulation-modeling': { title: 'System Simulation & Mathematical Modeling', category: 'Engineering' },
      'software-engineering': { title: 'Software Engineering & Agile Lifecycle', category: 'Engineering' }
    };

    const mapped = titleMap[slug] || {
      title: slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      category: 'Engineering' as const
    };

    return {
      title: `BIT ${year} — ${mapped.title}`,
      category: mapped.category,
      duration_minutes: 60,
      passing_score: 40,
      difficulty: year >= 2025 ? 'Hard' : 'Medium',
      negative_marking: false,
      subject: mapped.title,
      year: year
    };
  }

  return {
    title: path.basename(filePath, '.md').replace(/-/g, ' ').toUpperCase(),
    category: 'Engineering',
    duration_minutes: 60,
    passing_score: 40,
    difficulty: 'Medium',
    negative_marking: false,
    subject: 'General'
  };
}

function walk(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.md') && !filePath.includes('summary')) {
      results.push(filePath);
    }
  }
  return results;
}

async function importAll() {
  console.log('🚀 Starting Past Papers to Mock Exams Conversion...');
  const files = walk(path.join(__dirname, '../bulk-imports'));
  console.log(`📁 Found ${files.length} past paper files to process.\n`);

  let totalExamsCreated = 0;
  let totalQuestionsCreated = 0;

  for (const file of files) {
    const questions = parseMarkdownQuestions(file);
    if (questions.length === 0) {
      console.log(`⚠️ Skipped ${path.basename(file)}: No valid questions parsed.`);
      continue;
    }

    const meta = getExamMetadata(file);

    // Create Exam Document in Firestore
    const examRef = await db.collection('exams').add({
      title: meta.title,
      category: meta.category,
      subject: meta.subject,
      year: meta.year || null,
      duration_minutes: meta.duration_minutes,
      passing_score: meta.passing_score,
      is_published: true,
      visibility: 'public',
      difficulty: meta.difficulty,
      price: 0,
      negative_marking: meta.negative_marking,
      negativeMarkingEnabled: meta.negative_marking,
      defaultMarksPerQuestion: 1,
      defaultNegativeMarks: meta.negative_marking ? 0.25 : 0,
      total_questions: questions.length,
      source_file: path.relative(path.join(__dirname, '..'), file).replace(/\\/g, '/'),
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    totalExamsCreated++;
    console.log(`✅ Created Exam [${totalExamsCreated}/${files.length}]: "${meta.title}" (${questions.length} questions) -> ID: ${examRef.id}`);

    // Batch insert questions (both in root collection & sub-collection)
    const batch = db.batch();
    questions.forEach((q, idx) => {
      const qRef = db.collection('questions').doc();
      const questionPayload = {
        exam_id: examRef.id,
        order_in_exam: idx + 1,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_option: q.correct_option,
        explanation: q.explanation,
        marks: q.marks || 1,
        negative_marks: meta.negative_marking ? 0.25 : 0,
        difficulty: q.difficulty,
        subject: meta.subject,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      };

      // Top-level questions collection
      batch.set(qRef, questionPayload);

      // Subcollection questions
      const subQRef = examRef.collection('questions').doc(qRef.id);
      batch.set(subQRef, questionPayload);

      totalQuestionsCreated++;
    });

    await batch.commit();
  }

  console.log(`\n🎉 ALL DONE!`);
  console.log(`📊 Successfully created ${totalExamsCreated} full Mock Exams with ${totalQuestionsCreated} interactive questions in Firestore!`);
  process.exit(0);
}

importAll().catch(err => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});
