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

// NOTE: The Firebase Admin SDK does not support programmatically deploying firestore.indexes.json 
// via the 'admin.securityRules()' or similar REST-based helpers directly in the same way as rules.
// Usually, this is done via 'firebase deploy --only firestore:indexes'.

console.log("⚠️  Note: Firestore Indexes must be deployed via Firebase CLI:");
console.log("   firebase deploy --only firestore:indexes");
console.log("\nIf you don't have the CLI installed locally, you can use the Google Cloud Console.");
