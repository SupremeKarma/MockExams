import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load env
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

async function deployRules() {
  try {
    const rulesPath = path.join(process.cwd(), 'firestore.rules');
    const source = fs.readFileSync(rulesPath, 'utf8');
    
    console.log("Deploying firestore.rules...");
    
    // Using the built-in helper method for Firestore
    await admin.securityRules().releaseFirestoreRulesetFromSource(source);
    
    console.log("🎉 Security Rules successfully deployed to Firebase via Admin SDK!");
  } catch (err) {
    console.error("❌ Failed to deploy security rules:", err);
  } finally {
    process.exit(0);
  }
}

deployRules();
