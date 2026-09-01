import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { buildStudentAnalytics } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(token);
  } catch {
    return NextResponse.json({ error: "Your session expired. Please sign in again." }, { status: 401 });
  }
  if (!decoded) {
    return NextResponse.json({ error: "Auth is not configured on the server" }, { status: 503 });
  }

  try {
    // Aggregation runs server-side: students cannot read each other's attempts
    // under the new rules, so the cohort average has to be computed here.
    const analytics = await buildStudentAnalytics(decoded.uid);
    return NextResponse.json(analytics, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Analytics build failed:", err);
    return NextResponse.json({ error: "Could not build analytics" }, { status: 500 });
  }
}
