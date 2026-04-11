const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Initialize Firebase Admin
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

const PAST_PAPERS = [
  {
    title: 'TU BIT Past Entrance Exam 2080 (Memory Based)',
    category: 'Computer Science',
    duration_minutes: 120,
    passing_score: 35,
    is_published: true,
    difficulty: 'Medium',
    price: 0,
    questions: [
      {
        question_text: "Which of the following correctly describes a 'Byte'?",
        option_a: "A group of 4 bits",
        option_b: "A group of 8 bits",
        option_c: "A single binary digit",
        option_d: "1024 kilobytes",
        correct_option: "b",
        explanation: "A byte is a unit of digital data that commonly consists of eight bits. It is the smallest addressable unit of memory in many computer architectures.",
        order_in_exam: 1
      },
      {
        question_text: "If f(x) = 3x - 5, what is the inverse function f⁻¹(x)?",
        option_a: "(x + 5) / 3",
        option_b: "3x + 5",
        option_c: "(x - 5) / 3",
        option_d: "1 / (3x - 5)",
        correct_option: "a",
        explanation: "To find the inverse, replace f(x) with y: y = 3x - 5. Swap x and y: x = 3y - 5. Solve for y: x + 5 = 3y, so y = (x + 5) / 3.",
        order_in_exam: 2
      },
      {
        question_text: "What is the primary function of an Operating System?",
        option_a: "To compile code and compile programs",
        option_b: "To manage computer hardware and software resources",
        option_c: "To protect the computer from viruses",
        option_d: "To browse the internet",
        correct_option: "b",
        explanation: "An Operating System (OS) is system software that manages computer hardware, software resources, and provides common services for computer programs.",
        order_in_exam: 3
      },
      {
        question_text: "Choose the correct synonym for the word 'Peculiar':",
        option_a: "Normal",
        option_b: "Ordinary",
        option_c: "Strange",
        option_d: "Familiar",
        correct_option: "c",
        explanation: "'Peculiar' means strange or odd; unusual. Therefore, 'Strange' is the correct synonym.",
        order_in_exam: 4
      },
      {
        question_text: "If A = {1, 2, 3} and B = {3, 4, 5}, what is the union of sets A and B (A ∪ B)?",
        option_a: "{3}",
        option_b: "{1, 2, 4, 5}",
        option_c: "{1, 2, 3, 4, 5}",
        option_d: "{1, 2, 3, 3, 4, 5}",
        correct_option: "c",
        explanation: "The union of two sets contains all the distinct elements present in either set. The element 3 is shared, but listed only once.",
        order_in_exam: 5
      }
    ]
  },
  {
    title: 'MECEE MBBS Common Entrance Exam 2024 (Past Paper)',
    category: 'Medical',
    duration_minutes: 180,
    passing_score: 50,
    is_published: true,
    difficulty: 'Hard',
    price: 0,
    questions: [
      {
        question_text: "Which organelle is known as the 'powerhouse' of the cell?",
        option_a: "Nucleus",
        option_b: "Ribosome",
        option_c: "Mitochondria",
        option_d: "Endoplasmic Reticulum",
        correct_option: "c",
        explanation: "Mitochondria are often referred to as the powerhouses of the cell because they generate most of the cell's supply of adenosine triphosphate (ATP).",
        order_in_exam: 1
      },
      {
        question_text: "During photosynthesis, the oxygen liberated comes from:",
        option_a: "Carbon dioxide",
        option_b: "Water",
        option_c: "Glucose",
        option_d: "Chlorophyll",
        correct_option: "b",
        explanation: "The oxygen released during photosynthesis comes from the photolysis (splitting) of water molecules, not from carbon dioxide.",
        order_in_exam: 2
      },
      {
        question_text: "What is the pH of normal human blood?",
        option_a: "6.8",
        option_b: "7.0",
        option_c: "7.4",
        option_d: "8.2",
        correct_option: "c",
        explanation: "The pH of human blood is tightly regulated between 7.35 and 7.45, making it slightly basic (alkaline).",
        order_in_exam: 3
      },
      {
        question_text: "Which of the following is an isotope of hydrogen that is radioactive?",
        option_a: "Protium",
        option_b: "Deuterium",
        option_c: "Tritium",
        option_d: "Hydronium",
        correct_option: "c",
        explanation: "Tritium (Hydrogen-3) is a rare and radioactive isotope of hydrogen with a nucleus containing one proton and two neutrons.",
        order_in_exam: 4
      },
      {
        question_text: "According to Newton's Second Law, the rate of change of momentum is directly proportional to:",
        option_a: "Mass",
        option_b: "Acceleration",
        option_c: "Applied unbalanced force",
        option_d: "Velocity",
        correct_option: "c",
        explanation: "Newton's Second Law of Motion states that the rate of change of momentum of a body is directly proportional to the applied force and takes place in the direction in which the force acts.",
        order_in_exam: 5
      }
    ]
  }
];

async function seedPastPapers() {
  console.log('🚀 Starting Past Papers Seed...');

  try {
    for (const examData of PAST_PAPERS) {
      const { questions, ...exam } = examData;
      
      const examRef = await db.collection('exams').add({
        ...exam,
        total_questions: questions.length,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`✅ Created Past Exam: ${exam.title} (${examRef.id})`);

      const batch = db.batch();
      questions.forEach((q) => {
        const qRef = examRef.collection('questions').doc();
        batch.set(qRef, {
          ...q,
          created_at: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      await batch.commit();
      console.log(`   - Successfully inserted ${questions.length} questions for ${exam.title}!`);
    }

    console.log('🎉 Past Papers Seeding complete!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    process.exit(0);
  }
}

seedPastPapers();
