import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import {
  getEntitlement,
  hasActivePlan,
  awardDailyLogin,
  CREDIT_COSTS,
  CREDIT_REWARDS,
} from "@/lib/entitlements";

export const dynamic = "force-dynamic";

// The client can read entitlements/{uid} directly under the new rules, but
// this endpoint also returns the derived `isPro` flag and the cost table so UI
// gating never has to reimplement expiry logic.
export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
  if (!decoded) {
    return NextResponse.json({ error: "Auth is not configured on the server" }, { status: 503 });
  }

  // Showing up is itself study behaviour, so the daily bonus is granted here.
  // awardDailyLogin is idempotent per calendar day, so repeated reads are safe.
  let daily = { awarded: false, credits: 0, streak: 0 };
  try {
    daily = await awardDailyLogin(decoded.uid);
  } catch (err) {
    console.error("Daily credit award failed:", err);
  }

  const entitlement = await getEntitlement(decoded.uid);

  return NextResponse.json(
    {
      ...entitlement,
      isPro: hasActivePlan(entitlement),
      dailyBonusAwarded: daily.awarded,
      costs: CREDIT_COSTS,
      rewards: CREDIT_REWARDS,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
