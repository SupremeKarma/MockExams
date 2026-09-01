// Mastery certificates.
//
// A certificate that cannot be checked is just a picture, so every one carries
// a short code that resolves through a public verification endpoint. The
// certificate document itself stays private to its owner — verification returns
// only what a verifier needs to see.

import { randomBytes } from "crypto";
import { adminDb } from "@/lib/firebase-admin";

/** Minimum best score on an exam before a certificate is issued. */
export const MASTERY_THRESHOLD = 80;

export interface Certificate {
  id: string;
  code: string;
  user_id: string;
  user_name: string;
  exam_id: string;
  exam_title: string;
  percentage: number;
  attempts: number;
  issued_at: string;
}

/** Short, unambiguous, and readable aloud: no O/0 or I/1 confusion. */
function generateCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  let code = "";
  for (let i = 0; i < 8; i++) code += alphabet[bytes[i] % alphabet.length];
  return `MX-${code.slice(0, 4)}-${code.slice(4)}`;
}

export type IssueResult =
  | { status: "issued" | "existing"; certificate: Certificate }
  | { status: "not_eligible"; bestPercentage: number; required: number };

/**
 * Issue a certificate for an exam if the student has reached mastery.
 * Idempotent: a second call returns the existing certificate rather than
 * minting a duplicate, so a certificate cannot be farmed by re-requesting.
 */
export async function issueCertificate(userId: string, examId: string): Promise<IssueResult | null> {
  const attemptsSnap = await adminDb
    .collection("exam_attempts")
    .where("user_id", "==", userId)
    .where("exam_id", "==", examId)
    .get();

  if (attemptsSnap.empty) return null;

  const attempts = attemptsSnap.docs.map((doc: any) => doc.data());

  // Only fully graded attempts count — a pending written answer could still
  // move the score either way.
  const graded = attempts.filter((a: any) => a.grading_status !== "pending");
  if (graded.length === 0) return null;

  const best = graded.reduce(
    (top: any, a: any) => ((Number(a.percentage) || 0) > (Number(top.percentage) || 0) ? a : top),
    graded[0]
  );
  const bestPercentage = Number(best.percentage) || 0;

  if (bestPercentage < MASTERY_THRESHOLD) {
    return { status: "not_eligible", bestPercentage, required: MASTERY_THRESHOLD };
  }

  const existingSnap = await adminDb
    .collection("certificates")
    .where("user_id", "==", userId)
    .where("exam_id", "==", examId)
    .limit(1)
    .get();

  if (!existingSnap.empty) {
    const doc = existingSnap.docs[0];
    return { status: "existing", certificate: { id: doc.id, ...doc.data() } as Certificate };
  }

  const certificate: Omit<Certificate, "id"> = {
    code: generateCode(),
    user_id: userId,
    user_name: best.displayName ?? best.user_name ?? "Student",
    exam_id: examId,
    exam_title: best.exam_title ?? "Untitled exam",
    percentage: bestPercentage,
    attempts: graded.length,
    issued_at: new Date().toISOString(),
  };

  const ref = await adminDb.collection("certificates").add(certificate);
  return { status: "issued", certificate: { id: ref.id, ...certificate } };
}

export async function listCertificates(userId: string): Promise<Certificate[]> {
  const snap = await adminDb.collection("certificates").where("user_id", "==", userId).get();
  return snap.docs
    .map((doc: any) => ({ id: doc.id, ...doc.data() }) as Certificate)
    .sort((a: Certificate, b: Certificate) => b.issued_at.localeCompare(a.issued_at));
}

export async function getCertificate(id: string): Promise<Certificate | null> {
  const snap = await adminDb.collection("certificates").doc(id).get();
  return snap.exists ? ({ id: snap.id, ...snap.data() } as Certificate) : null;
}

export interface VerificationResult {
  valid: boolean;
  holder?: string;
  examTitle?: string;
  percentage?: number;
  issuedAt?: string;
}

/**
 * Public verification by code. Returns only the facts a verifier needs — no
 * user id, no attempt history, nothing that identifies the holder beyond the
 * name printed on the certificate itself.
 */
export async function verifyCertificate(code: string): Promise<VerificationResult> {
  const normalised = code.trim().toUpperCase();
  if (!/^MX-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(normalised)) return { valid: false };

  const snap = await adminDb
    .collection("certificates")
    .where("code", "==", normalised)
    .limit(1)
    .get();

  if (snap.empty) return { valid: false };

  const data = snap.docs[0].data();
  return {
    valid: true,
    holder: data.user_name,
    examTitle: data.exam_title,
    percentage: data.percentage,
    issuedAt: data.issued_at,
  };
}
