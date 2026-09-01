import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { issueCertificate, listCertificates } from "@/lib/certificates";

export const dynamic = "force-dynamic";

async function requireUser(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    if (!decoded) {
      return { error: NextResponse.json({ error: "Auth is not configured on the server" }, { status: 503 }) };
    }
    return { uid: decoded.uid as string };
  } catch {
    return { error: NextResponse.json({ error: "Your session expired. Please sign in again." }, { status: 401 }) };
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth.error) return auth.error;

  try {
    return NextResponse.json(
      { certificates: await listCertificates(auth.uid!) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("Certificate list failed:", err);
    return NextResponse.json({ error: "Could not load certificates" }, { status: 500 });
  }
}

// Eligibility is decided server-side from graded attempts; the client cannot
// assert that it earned one.
export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json().catch(() => ({}));
    const examId = String(body?.examId ?? "");
    if (!examId) return NextResponse.json({ error: "examId is required" }, { status: 400 });

    const result = await issueCertificate(auth.uid!, examId);
    if (!result) {
      return NextResponse.json({ error: "No graded attempt for this exam yet" }, { status: 404 });
    }
    if (result.status === "not_eligible") {
      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Certificate issue failed:", err);
    return NextResponse.json({ error: "Could not issue a certificate" }, { status: 500 });
  }
}
