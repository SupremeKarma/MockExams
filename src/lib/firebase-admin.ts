import * as admin from "firebase-admin";

let isInitialized = false;

function initFirebase() {
  if (isInitialized || admin.apps.length > 0) {
    isInitialized = true;
    return;
  }

  try {
    const rawProjectId = process.env.FIREBASE_PROJECT_ID;
    const rawClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!rawProjectId || !rawClientEmail || !rawPrivateKey) {
      console.warn("Firebase environment variables are missing. Initialization skipped.");
      return;
    }

    // Modern PEM cleaning:
    // 1. Remove optional surrounding quotes (Next.js does it sometimes, but being safe)
    // 2. Correct double-escaped newlines (\n to literal newline)
    // 3. Ensure the string actually starts with the PEM header
    let privateKey = rawPrivateKey;
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.substring(1, privateKey.length - 1);
    }
    privateKey = privateKey.replace(/\\n/g, "\n");

    if (!privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
      console.error("FIREBASE_PRIVATE_KEY appears to be malformed (missing PEM header).");
      return;
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: rawProjectId,
        clientEmail: rawClientEmail,
        privateKey: privateKey,
      }),
    });
    isInitialized = true;
    console.log("Firebase Admin SDK successfully initialized.");
  } catch (error: any) {
    console.error("Firebase admin initialization failed FATALLY:", error.message);
    // We don't re-throw to prevent module-level crashes, 
    // but the Proxies will now handle subsequent calls safely.
  }
}

export const adminAuth = new Proxy({} as any, {
  get(target, prop) {
    initFirebase();
    if (!admin.apps.length) return undefined;
    const auth = admin.auth();
    const val = (auth as any)[prop];
    return typeof val === "function" ? val.bind(auth) : val;
  }
});

export const adminDb = new Proxy({} as any, {
  get(target, prop) {
    initFirebase();
    if (!admin.apps.length) return undefined;
    const db = admin.firestore();
    const val = (db as any)[prop];
    return typeof val === "function" ? val.bind(db) : val;
  }
});
