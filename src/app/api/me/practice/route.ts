import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { buildPracticeSet, gradePracticeSession, getDailyStatus } from "@/lib/practice";
import { addCredits, CREDIT_REWARDS } from "@/lib/entitlements";

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

// Build an adaptive set. Answer keys are never included — grading happens in
// POST, so the correct option cannot be read out of the practice payload.
export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth.error) return auth.error;

  try {
    const isDaily = request.nextUrl.searchParams.get("daily") === "1";
    const sizeParam = Number(request.nextUrl.searchParams.get("size"));

    // The Daily 10 is a fixed-size set, and only one counts per day.
    if (isDaily) {
      const status = await getDailyStatus(auth.uid!);
      if (status.completed) {
        return NextResponse.json(
          { questions: [], focusTopics: [], reason: "daily_done", daily: status },
          { headers: { "Cache-Control": "no-store" } }
        );
      }
      const set = await buildPracticeSet(auth.uid!, { size: 10 });
      return NextResponse.json({ ...set, daily: status }, { headers: { "Cache-Control": "no-store" } });
    }

    const set = await buildPracticeSet(auth.uid!, {
      size: Number.isFinite(sizeParam) && sizeParam > 0 ? sizeParam : 10,
      topicId: request.nextUrl.searchParams.get("topic") ?? undefined,
      bookmarkedOnly: request.nextUrl.searchParams.get("bookmarks") === "1",
    });
    return NextResponse.json(set, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Practice set build failed:", err);
    return NextResponse.json({ error: "Could not build a practice set" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json().catch(() => ({}));
    const answers = body?.answers && typeof body.answers === "object" ? body.answers : {};
    const timeSpent = Number(body?.time_spent_seconds) || 0;

    const isDaily = body?.daily === true;

    // Guard against a second Daily 10 being banked on the same day.
    if (isDaily) {
      const status = await getDailyStatus(auth.uid!);
      if (status.completed) {
        return NextResponse.json({ error: "Today's Daily 10 is already done" }, { status: 409 });
      }
    }

    const result = await gradePracticeSession(auth.uid!, answers, timeSpent, isDaily);

    // Drilling counts as study, so it earns credits like finishing an exam.
    try {
      await addCredits(auth.uid!, CREDIT_REWARDS.flashcard_session, "practice_session");
    } catch (err) {
      console.error("Failed to award practice credits:", err);
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Practice grading failed:", err);
    return NextResponse.json({ error: "Could not grade this session" }, { status: 500 });
  }
}
