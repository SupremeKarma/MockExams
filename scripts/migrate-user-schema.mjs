#!/usr/bin/env node
// scripts/migrate-user-schema.mjs
//
// Migration script to audit and backfill Firestore user documents to the
// canonical User schema defined in Phase 0:
//
// interface User {
//   id: string;                    // Firebase UID (doc ID)
//   email: string;
//   name: string;
//   displayName?: string;
//   photoURL?: string;
//   phone?: string;
//   role: 'student' | 'examiner' | 'org_admin' | 'admin';
//   orgId?: string;
//   createdAt: Timestamp;
//   updatedAt: Timestamp;
// }
//
// Usage:
//   node scripts/migrate-user-schema.mjs --audit      # Dry-run audit mode (no writes)
//   node scripts/migrate-user-schema.mjs              # Audit and backfill inconsistent docs

import admin from "firebase-admin";

const AUDIT_MODE = process.argv.includes("--audit") || process.argv.includes("--dry-run");

function initFirebase() {
  if (admin.apps.length) return admin.app();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\n/g, "\n");

    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  // Fallback to Application Default Credentials
  return admin.initializeApp();
}

async function migrateUserSchema() {
  console.log("=== Phase 0: User Schema Audit & Migration ===");
  console.log(`Mode: ${AUDIT_MODE ? "AUDIT ONLY (Dry Run)" : "LIVE MIGRATION"}\n`);

  initFirebase();
  const db = admin.firestore();

  const usersSnap = await db.collection("users").get();
  console.log(`Found ${usersSnap.size} user document(s) in Firestore.`);

  let compliantCount = 0;
  let inconsistentCount = 0;
  const updates = [];

  for (const docSnap of usersSnap.docs) {
    const data = docSnap.data();
    const uid = docSnap.id;
    const issues = [];
    const patch = {};

    // 1. Verify id
    if (!data.id) {
      issues.push("missing id");
      patch.id = uid;
    }

    // 2. Verify name and displayName
    const fallbackName = data.name || data.displayName || data.email?.split("@")[0] || "Student";
    if (!data.name) {
      issues.push("missing name");
      patch.name = fallbackName;
    }
    if (!data.displayName) {
      issues.push("missing displayName");
      patch.displayName = fallbackName;
    }

    // 3. Verify role
    const validRoles = ["student", "examiner", "org_admin", "admin"];
    if (!data.role || !validRoles.includes(data.role)) {
      const isSuperAdmin = data.email?.toLowerCase() === "amanmahato321@gmail.com";
      const resolvedRole = isSuperAdmin ? "admin" : "student";
      issues.push(`invalid role (${data.role || "undefined"} -> ${resolvedRole})`);
      patch.role = resolvedRole;
    }

    // 4. Normalize orgId vs org_id
    if (data.org_id && !data.orgId) {
      issues.push("org_id present but missing canonical orgId");
      patch.orgId = data.org_id;
    }

    // 5. Timestamps
    const now = admin.firestore.FieldValue.serverTimestamp();
    if (!data.createdAt) {
      issues.push("missing createdAt");
      patch.createdAt = data.created_at || now;
    }
    if (!data.updatedAt) {
      issues.push("missing updatedAt");
      patch.updatedAt = data.updated_at || now;
    }

    if (issues.length > 0) {
      inconsistentCount++;
      console.log(`\n[INCONSISTENT] User ${uid} (${data.email || "no-email"}):`);
      for (const issue of issues) {
        console.log(`  - ${issue}`);
      }
      updates.push({ ref: docSnap.ref, patch, uid });
    } else {
      compliantCount++;
    }
  }

  console.log("\n--- Audit Summary ---");
  console.log(`Total Scanned:     ${usersSnap.size}`);
  console.log(`Fully Compliant:   ${compliantCount}`);
  console.log(`Inconsistent Docs: ${inconsistentCount}`);

  if (AUDIT_MODE) {
    console.log("\n[AUDIT ONLY] No documents were modified. Run without --audit to apply changes.");
    return;
  }

  if (updates.length === 0) {
    console.log("\nAll user documents are already consistent with the canonical schema!");
    return;
  }

  console.log(`\nApplying updates to ${updates.length} document(s)...`);
  const batchSize = 400;
  for (let i = 0; i < updates.length; i += batchSize) {
    const chunk = updates.slice(i, i + batchSize);
    const batch = db.batch();
    for (const item of chunk) {
      batch.set(item.ref, item.patch, { merge: true });
    }
    await batch.commit();
    console.log(`  Committed batch ${Math.floor(i / batchSize) + 1} (${chunk.length} docs)`);
  }

  console.log("\n✅ Migration complete! All user documents backfilled to canonical schema.");
}

migrateUserSchema().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
