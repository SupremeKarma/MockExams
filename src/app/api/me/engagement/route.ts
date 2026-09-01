import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { buildEngagementSummary } from "@/lib/engagement";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    // Rank needs every leaderboard entry, which students cannot read directly
    // under the new rules — so this is computed server-side.
    const summary = await buildEngagementSummary(decoded.uid);
    return NextResponse.json(summary, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Engagement summary failed:", err);
    return NextResponse.json({ error: "Could not load your achievements" }, { status: 500 });
  }
}
