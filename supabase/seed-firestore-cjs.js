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

const EXAMS = [
  {
    title: 'IOE Entrance Mock 2026',
    category: 'Engineering',
    duration_minutes: 120,
    passing_score: 50,
    is_published: true,
    difficulty: 'Hard',
    price: 0,
    questions: [
      {
        question_text: 'The value of g is maximum at:',
        option_a: 'Equator',
        option_b: 'Poles',
        option_c: 'Center of Earth',
        option_d: 'Mount Everest',
        correct_option: 'b',
        explanation: 'The polar radius is smaller than the equatorial radius, making gravity stronger at the poles.',
        order_in_exam: 1
      },
      {
        question_text: 'Which of the following is a scalar quantity?',
        option_a: 'Force',
        option_b: 'Velocity',
        option_c: 'Work',
        option_d: 'Acceleration',
        correct_option: 'c',
        explanation: 'Work is the dot product of two vectors (Force and Displacement), resulting in a scalar quantity.',
        order_in_exam: 2
      },
      {
        question_text: 'The escape velocity from the Earth is approximately:',
        option_a: '11.2 km/s',
        option_b: '9.8 km/s',
        option_c: '3.0 x 10^8 m/s',
        option_d: '7.9 km/s',
        correct_option: 'a',
        explanation: 'Escape velocity is calculated as sqrt(2gR) which gives 11.2 km/s for Earth.',
        order_in_exam: 3
      },
      {
        question_text: 'Integration of cos(x) dx is:',
        option_a: 'sin(x) + c',
        option_b: '-sin(x) + c',
        option_c: 'cos(x) + c',
        option_d: '-cos(x) + c',
        correct_option: 'a',
        explanation: 'The derivative of sin(x) is cos(x). Therefore, the integral of cos(x) is sin(x).',
        order_in_exam: 4
      },
      {
        question_text: 'Which gas is most abundant in the Earth\'s atmosphere?',
        option_a: 'Oxygen',
        option_b: 'Carbon Dioxide',
        option_c: 'Argon',
        option_d: 'Nitrogen',
        correct_option: 'd',
        explanation: 'Nitrogen makes up approximately 78% of the Earth\'s atmosphere.',
        order_in_exam: 5
      }
    ]
  },
  {
    title: 'NEB Physics Mastery',
    category: 'Science',
    duration_minutes: 60,
    passing_score: 40,
    is_published: true,
    difficulty: 'Medium',
    price: 0,
    questions: [
      {
        question_text: 'What is the SI unit of electric current?',
        option_a: 'Volt',
        option_b: 'Ohm',
        option_c: 'Ampere',
        option_d: 'Watt',
        correct_option: 'c',
        explanation: 'Ampere is the SI unit representing the flow of electric charge.',
        order_in_exam: 1
      },
      {
        question_text: 'According to Ohm\'s Law, Voltage (V) is equal to:',
        option_a: 'I / R',
        option_b: 'I + R',
        option_c: 'I * R',
        option_d: 'R / I',
        correct_option: 'c',
        explanation: 'Ohm\'s Law states that Voltage equals Current multiplied by Resistance (V = IR).',
        order_in_exam: 2
      },
      {
        question_text: 'The phenomenon of splitting of white light into its component colors is called:',
        option_a: 'Reflection',
        option_b: 'Refraction',
        option_c: 'Diffraction',
        option_d: 'Dispersion',
        correct_option: 'd',
        explanation: 'Dispersion is the separation of visible light into its different colors.',
        order_in_exam: 3
      }
    ]
  },
  {
    title: 'Basic JavaScript Programming',
    category: 'Engineering',
    duration_minutes: 45,
    passing_score: 60,
    is_published: true,
    difficulty: 'Easy',
    price: 0,
    questions: [
      {
        question_text: 'Which symbol is used for strictly equals in JS?',
        option_a: '==',
        option_b: '===',
        option_c: '=',
        option_d: '=>',
        correct_option: 'b',
        explanation: 'The triple equal (===) checks for both value and type equality.',
        order_in_exam: 1
      },
      {
        question_text: 'How do you declare a constant variable in ES6?',
        option_a: 'var',
        option_b: 'let',
        option_c: 'const',
        option_d: 'constant',
        correct_option: 'c',
        explanation: 'The const keyword is used to declare variables whose values cannot be reassigned.',
        order_in_exam: 2
      }
    ]
  }
];

async function seed() {
  console.log('🚀 Starting Firestore exam seeding...');

  try {
    for (const examData of EXAMS) {
      const { questions, ...exam } = examData;
      
      const examRef = await db.collection('exams').add({
        ...exam,
        total_questions: questions.length,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`✅ Created Exam: ${exam.title} (${examRef.id})`);

      const batch = db.batch();
      questions.forEach((q) => {
        const qRef = examRef.collection('questions').doc();
        batch.set(qRef, {
          ...q,
          created_at: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      await batch.commit();
      console.log(`   - Inserted ${questions.length} questions`);
    }

    console.log('🎉 Firebase seeding complete!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    process.exit(0);
  }
}

seed();
