import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

if (admin.apps.length === 0) {
  const rawProjectId = process.env.FIREBASE_PROJECT_ID;
  const rawClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let pk = process.env.FIREBASE_PRIVATE_KEY || '';
  
  // Clean the private key
  if (pk.startsWith('"') && pk.endsWith('"')) {
    pk = pk.slice(1, -1);
  }
  pk = pk.replace(/\\n/g, '\n');
  pk = pk.replace(/\r\n/g, '\n');

  if (!pk || !rawProjectId || !rawClientEmail) {
    console.error('❌ Firebase environment variables are missing.');
    process.exit(1);
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: rawProjectId,
        clientEmail: rawClientEmail,
        privateKey: pk,
      }),
    });
    console.log('✅ Firebase Admin initialized successfully.');
  } catch (initErr: any) {
    console.error('❌ Failed to initialize Firebase Admin:', initErr.message);
    process.exit(1);
  }
}

const db = admin.firestore();

const RESOURCES = [
  {
    title: "IOE Entrance Preparation Guide 2081",
    author: "Er. Gopal Khanal",
    type: "Book",
    format: "PDF",
    category: "Engineering",
    subject: "IOE Entrance",
    rating: 4.8,
    downloadUrl: "",
    externalUrl: "https://ioe.edu.np",
  },
  {
    title: "NEB Physics Grade 12 Notes",
    author: "Physics Department, JCC",
    type: "Notes",
    format: "PDF",
    category: "Physics",
    subject: "NEB Grade 12",
    rating: 4.6,
    downloadUrl: "",
    externalUrl: "",
  },
  {
    title: "Mathematics Formula Sheet — IOE",
    author: "Er. Ram Prasad Sharma",
    type: "Notes",
    format: "PDF",
    category: "Mathematics",
    subject: "IOE Entrance",
    rating: 4.9,
    downloadUrl: "",
    externalUrl: "",
  },
  {
    title: "NEB Chemistry Grade 12 — Past Papers 2075-2081",
    author: "NEB Archive",
    type: "Past Papers",
    format: "PDF",
    category: "Chemistry",
    subject: "NEB Grade 12",
    rating: 4.7,
    downloadUrl: "",
    externalUrl: "",
  },
  {
    title: "Computer Science — IOE Syllabus Notes",
    author: "IOE Study Group",
    type: "Notes",
    format: "PDF",
    category: "Computer Science",
    subject: "IOE Entrance",
    rating: 4.4,
    downloadUrl: "",
    externalUrl: "",
  },
];

const EXAMS = [
  {
    title: 'IOE Entrance Model Exam 2081',
    category: 'Engineering',
    duration_minutes: 120,
    passing_score: 50,
    is_published: true,
    difficulty: 'Hard',
    price: 0,
    negative_marking: true,
    questions: [
      { question_text: 'The value of g is maximum at:', option_a: 'Equator', option_b: 'Poles', option_c: 'Center of Earth', option_d: 'Mount Everest', correct_option: 'b', explanation: 'Gravity is strongest at poles due to earth flattening.', subject: 'Physics' },
      { question_text: 'Which is a scalar?', option_a: 'Force', option_b: 'Velocity', option_c: 'Work', option_d: 'Acceleration', correct_option: 'c', explanation: 'Work is force dot displacement.', subject: 'Physics' },
      { question_text: 'Escape velocity from Earth is:', option_a: '11.2 km/s', option_b: '9.8 km/s', option_c: '7.9 km/s', option_d: '1 km/s', correct_option: 'a', explanation: 'sqrt(2gR).', subject: 'Physics' },
      { question_text: 'Unit of viscosity is:', option_a: 'Poise', option_b: 'Watt', option_c: 'Joule', option_d: 'Pascal', correct_option: 'a', explanation: 'Poise is CGS unit of viscosity.', subject: 'Physics' },
      { question_text: 'Specific heat of water is:', option_a: '1 cal/g°C', option_b: '4.2 J/g°C', option_c: 'Both a & b', option_d: '1000 J/kg°C', correct_option: 'c', explanation: 'It is 1 cal/g°C or 4184 J/kg°C.', subject: 'Physics' },
      { question_text: 'Integration of sin(x):', option_a: 'cos(x)', option_b: '-cos(x)', option_c: 'tan(x)', option_d: 'sec(x)', correct_option: 'b', explanation: 'd/dx(-cos x) = sin x.', subject: 'Mathematics' },
      { question_text: 'd/dx (log x) is:', option_a: '1/x', option_b: 'e^x', option_c: 'x', option_d: 'log x', correct_option: 'a', explanation: 'Standard derivative.', subject: 'Mathematics' },
      { question_text: 'Sum of internal angles of a triangle:', option_a: '90°', option_b: '180°', option_c: '360°', option_d: '270°', correct_option: 'b', explanation: 'Euclidean geometry basic.', subject: 'Mathematics' },
      { question_text: 'Atomic number of Gold (Au):', option_a: '79', option_b: '47', option_c: '82', option_d: '11', correct_option: 'a', explanation: 'Gold is 79.', subject: 'Chemistry' },
      { question_text: 'pH of pure water:', option_a: '0', option_b: '7', option_c: '14', option_d: '1', correct_option: 'b', explanation: 'Neutral pH is 7.', subject: 'Chemistry' },
      // ... Add more to reach 40 if needed, for now let's do a few more distinct ones
      { question_text: 'Synonym of "Amicable":', option_a: 'Hostile', option_b: 'Friendly', option_c: 'Hateful', option_d: 'Cold', correct_option: 'b', explanation: 'Amicable means friendly.', subject: 'English' },
      { question_text: 'Opposite of "Arrogant":', option_a: 'Humble', option_b: 'Proud', option_c: 'Rude', option_d: 'Eager', correct_option: 'a', explanation: 'Self-explanatory.', subject: 'English' },
    ]
  },
  {
    title: 'NEB Grade 12 Physics Final Prep',
    category: 'Science',
    duration_minutes: 90,
    passing_score: 40,
    is_published: true,
    difficulty: 'Medium',
    price: 0,
    questions: [
      { question_text: 'SI unit of current:', option_a: 'Volt', option_b: 'Ampere', option_c: 'Ohm', option_d: 'Watt', correct_option: 'b', subject: 'Physics' },
      { question_text: 'Ohm\'s Law is V = ?', option_a: 'IR', option_b: 'I/R', option_c: 'R/I', option_d: 'I+R', correct_option: 'a', subject: 'Physics' },
      { question_text: 'Lens maker\'s formula relates:', option_a: 'f, R, mu', option_b: 'u, v, f', option_c: 'I, V, R', option_d: 'E, m, c^2', correct_option: 'a', subject: 'Physics' },
    ]
  }
];

async function seed() {
  console.log('🚀 Starting content seeding...');

  try {
    // 1. Seed Resources
    console.log('--- Seeding Resources ---');
    for (const res of RESOURCES) {
      await db.collection('resources').add({
        ...res,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`✅ Resource: ${res.title}`);
    }

    // 2. Seed Exams
    console.log('--- Seeding Exams ---');
    for (const examData of EXAMS) {
      const { questions, ...exam } = examData;
      const examRef = await db.collection('exams').add({
        ...exam,
        total_questions: questions.length,
        visibility: 'public',
        negativeMarkingEnabled: examData.negative_marking || false,
        defaultMarksPerQuestion: 1,
        defaultNegativeMarks: 0.25,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`✅ Exam: ${exam.title} (${examRef.id})`);

      const batch = db.batch();
      questions.forEach((q, idx) => {
        // Add to top-level 'questions' collection as expected by the app
        const qRef = db.collection('questions').doc();
        batch.set(qRef, {
          ...q,
          exam_id: examRef.id,
          order_in_exam: idx + 1,
          marks: 1,
          negative_marks: examData.negative_marking ? 0.25 : 0,
          created_at: admin.firestore.FieldValue.serverTimestamp()
        });
        
        // Also add to sub-collection for extra robustness
        const subQRef = examRef.collection('questions').doc(qRef.id);
        batch.set(subQRef, {
          ...q,
          order_in_exam: idx + 1,
          marks: 1,
          negative_marks: examData.negative_marking ? 0.25 : 0,
          created_at: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      await batch.commit();
      console.log(`   - Added ${questions.length} questions`);
    }

    console.log('🎉 Seeding successful!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    process.exit(0);
  }
}

seed();
