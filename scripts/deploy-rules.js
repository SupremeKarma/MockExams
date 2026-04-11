const admin = require('firebase-admin');
const dotenv = require('dotenv');
const fs = require('fs');
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

async function deploy() {
  try {
    const rulesPath = path.join(process.cwd(), 'firestore.rules');
    const source = fs.readFileSync(rulesPath, 'utf8');
    console.log("Deploying firestore.rules...");
    await admin.securityRules().releaseFirestoreRulesetFromSource(source);
    console.log("🎉 Rules successfully deployed!");
  } catch (err) {
    console.error("Deploy failed:", err);
  } finally {
    process.exit(0);
  }
}

deploy();
