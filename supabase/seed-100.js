const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

// Programmatic generation of 100 questions
const marathonQuestions = Array.from({ length: 100 }).map((_, i) => ({
  question_text: `Consider a physical or mathematical system where parameter X is equal to ${i * 5}. Which of the following best describes the resulting behavior? (Question ${i + 1})`,
  option_a: `The system stabilizes at ${i + 1}`,
  option_b: `The system accelerates to ${i + 2}`,
  option_c: `The value decreases to ${i * 4}`,
  option_d: `Remains constant`,
  correct_option: ['a', 'b', 'c', 'd'][i % 4],
  explanation: `By applying the standard principle for parameter ${i * 5}, we mathematically deduce the answer is the ${['first', 'second', 'third', 'fourth'][i % 4]} option.`,
  order_in_exam: i + 1
}));

const EXAMS = [
  {
    title: 'The 100 Question Marathon Test',
    category: 'Competitive',
    duration_minutes: 180,
    passing_score: 50,
    is_published: true,
    difficulty: 'Hard',
    price: 0,
    questions: marathonQuestions
  }
];

async function seed() {
  console.log('🚀 Starting 100-Question Exam injection...');

  try {
    for (const examData of EXAMS) {
      const { questions, ...exam } = examData;
      
      const examRef = await db.collection('exams').add({
        ...exam,
        total_questions: questions.length,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`✅ Created Exam: ${exam.title} (${examRef.id})`);

      // Firestore batches can only have 500 writes. 100 writes is fine.
      const batch = db.batch();
      questions.forEach((q) => {
        const qRef = examRef.collection('questions').doc();
        batch.set(qRef, {
          ...q,
          created_at: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      await batch.commit();
      console.log(`   - Successfully inserted all ${questions.length} questions instantly!`);
    }

    console.log('🎉 100-Question Seeding complete!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    process.exit(0);
  }
}

seed();
