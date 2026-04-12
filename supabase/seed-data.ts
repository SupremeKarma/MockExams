import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

if (admin.apps.length === 0) {
  const rawProjectId = process.env.FIREBASE_PROJECT_ID;
  const rawClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let pk = process.env.FIREBASE_PRIVATE_KEY || '';
  
  if (pk.startsWith('"') && pk.endsWith('"')) {
    pk = pk.slice(1, -1);
  }
  pk = pk.replace(/\\n/g, '\n').replace(/\r\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: rawProjectId,
      clientEmail: rawClientEmail,
      privateKey: pk,
    }),
  });
}

const db = admin.firestore();

const MOCK_USERS = [
  { uid: 'user_1', displayName: 'Aabhash Shrestha', email: 'aabhash@example.com', role: 'student', karma: 1250 },
  { uid: 'user_2', displayName: 'Binita Thapa', email: 'binita@example.com', role: 'student', karma: 980 },
  { uid: 'user_3', displayName: 'Chitiz Gurung', email: 'chitiz@example.com', role: 'examiner', karma: 450 },
  { uid: 'user_4', displayName: 'Deepa Rai', email: 'deepa@example.com', role: 'student', karma: 1560 },
  { uid: 'user_5', displayName: 'Eshan Pandey', email: 'eshan@example.com', role: 'admin', karma: 2000 },
  { uid: 'user_6', displayName: 'Falguni Shah', email: 'falguni@example.com', role: 'student', karma: 720 },
  { uid: 'user_7', displayName: 'Gopal Khanal', email: 'gopal@example.com', role: 'examiner', karma: 890 },
];

async function seedData() {
  console.log('🚀 Seeding Users and Leaderboard...');

  try {
    // 1. Seed Users
    console.log('--- Seeding Users ---');
    for (const u of MOCK_USERS) {
      await db.collection('users').doc(u.uid).set({
        ...u,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✅ User: ${u.displayName}`);
    }

    // 2. Seed Leaderboard entries for existing exams
    console.log('--- Seeding Leaderboard ---');
    const examsSnap = await db.collection('exams').limit(2).get();
    if (examsSnap.empty) {
      console.log('⚠️ No exams found. Run seed-firebase first.');
    } else {
      const examIds = examsSnap.docs.map(d => d.id);
      const examTitles = examsSnap.docs.map(d => d.data().title);

      for (let i = 0; i < examIds.length; i++) {
        const examId = examIds[i];
        const examTitle = examTitles[i];
        
        // Randomly assign some users to the leaderboard for this exam
        const participants = MOCK_USERS.slice(0, 5).sort(() => 0.5 - Math.random());
        
        for (const user of participants) {
          const score = Math.floor(Math.random() * 80) + 20;
          const percentage = score; // Assuming max score is 100 for simplicity in mock
          
          await db.collection('leaderboard').add({
            user_id: user.uid,
            user_name: user.displayName,
            displayName: user.displayName,
            exam_id: examId,
            exam_title: examTitle,
            score: score,
            percentage: percentage,
            attempts: Math.floor(Math.random() * 3) + 1,
            last_attempt: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

          // Also seed an attempt for each in exam_attempts
          await db.collection('exam_attempts').add({
            user_id: user.uid,
            user_name: user.displayName,
            displayName: user.displayName,
            exam_id: examId,
            exam_title: examTitle,
            score: score,
            total_marks: 100,
            percentage: percentage,
            time_spent_seconds: Math.floor(Math.random() * 3600),
            attempted_at: new Date().toISOString(),
            answers_json: { breakdown: [], raw_answers: {} }
          });
        }
      }
      console.log('✅ Leaderboard and Attempts seeded.');
    }

    console.log('🎉 Mock data seeding successful!');
  } catch (err) {
    console.error('❌ Data seeding failed:', err);
  } finally {
    process.exit(0);
  }
}

seedData();
