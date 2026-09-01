// Server-only entitlement + credit ledger.
//
// Plans and credits live in `entitlements/{uid}`, NOT on the user document.
// The user doc is client-writable (students edit their own profile), so storing
// `subscription: "pro"` there meant anyone could grant themselves Pro from the
// browser console. Firestore rules deny all client writes to `entitlements`;
// the Admin SDK bypasses rules, so this module is the only way in.
//
// Import this from route handlers only — never from a client component.

import { adminDb } from "@/lib/firebase-admin";

export type Plan = "free" | "pro" | "campus";

export interface Entitlement {
  plan: Plan;
  credits: number;
  /** Consecutive days with at least one visit, for streaks and daily rewards. */
  streak: number;
  longestStreak: number;
  /** ISO date; null for plans that don't expire (free). */
  expires_at: string | null;
  updated_at: string;
}

/** Credit cost per AI action. Paid plans bypass these entirely. */
export const CREDIT_COSTS = {
  written_feedback: 2,
  tutor_turn: 1,
  flashcard_extraction: 5,
  // Solving a whole uploaded paper is the most expensive action in the app:
  // a long document, search grounding, and a large response.
  solve_paper: 15,
} as const;

/** Credits granted for study activity — how a diligent student stays free. */
export const CREDIT_REWARDS = {
  daily_login: 2,
  exam_completed: 5,
  flashcard_session: 2,
  question_contribution_approved: 20,
} as const;

const STARTING_CREDITS = 20;

const FREE_ENTITLEMENT = (): Entitlement => ({
  plan: "free",
  credits: STARTING_CREDITS,
  streak: 0,
  longestStreak: 0,
  expires_at: null,
  updated_at: new Date().toISOString(),
});

/** Local calendar day key, used to award the daily bonus at most once a day. */
function dayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

function daysBetween(from: string, to: string): number {
  const ms = new Date(`${to}T00:00:00Z`).getTime() - new Date(`${from}T00:00:00Z`).getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

function ref(uid: string) {
  return adminDb.collection("entitlements").doc(uid);
}

/** True when a paid plan is present and has not lapsed. */
export function hasActivePlan(ent: Entitlement): boolean {
  if (ent.plan === "free") return false;
  if (!ent.expires_at) return true;
  return new Date(ent.expires_at).getTime() > Date.now();
}

export async function getEntitlement(uid: string): Promise<Entitlement> {
  const snap = await ref(uid).get();
  if (!snap.exists) return FREE_ENTITLEMENT();
  const data = snap.data() as Partial<Entitlement>;
  return {
    plan: (data.plan as Plan) ?? "free",
    credits: typeof data.credits === "number" ? data.credits : 0,
    streak: typeof data.streak === "number" ? data.streak : 0,
    longestStreak: typeof data.longestStreak === "number" ? data.longestStreak : 0,
    expires_at: data.expires_at ?? null,
    updated_at: data.updated_at ?? new Date().toISOString(),
  };
}

/**
 * Single mutation point for plan upgrades. Every payment provider funnels here
 * after its own callback verification, so provider-specific code never touches
 * Firestore directly.
 */
export async function grantEntitlement(
  uid: string,
  plan: Plan,
  expiresAt: string | null,
  source: string
): Promise<void> {
  await ref(uid).set(
    {
      plan,
      expires_at: expiresAt,
      granted_by: source,
      updated_at: new Date().toISOString(),
    },
    { merge: true }
  );
}

/** Award credits for study activity. Returns the new balance. */
export async function addCredits(uid: string, amount: number, reason: string): Promise<number> {
  if (amount <= 0) return (await getEntitlement(uid)).credits;

  return adminDb.runTransaction(async (tx: any) => {
    const doc = ref(uid);
    const snap = await tx.get(doc);
    const current = snap.exists ? (snap.data().credits ?? 0) : STARTING_CREDITS;
    const next = current + amount;

    tx.set(
      doc,
      {
        plan: snap.exists ? (snap.data().plan ?? "free") : "free",
        credits: next,
        last_credit_reason: reason,
        updated_at: new Date().toISOString(),
      },
      { merge: true }
    );
    return next;
  });
}

export interface SpendResult {
  ok: boolean;
  remaining: number;
  /** True when the action was free because the user is on a paid plan. */
  unlimited: boolean;
}

/**
 * Atomically charge credits for an AI action. Paid plans are never charged.
 * Callers must treat `ok: false` as "offer the earn-or-upgrade prompt", not as
 * an error — running out of credits is an expected state, not a failure.
 */
export async function spendCredits(uid: string, cost: number, reason: string): Promise<SpendResult> {
  const ent = await getEntitlement(uid);
  if (hasActivePlan(ent)) {
    return { ok: true, remaining: ent.credits, unlimited: true };
  }

  return adminDb.runTransaction(async (tx: any) => {
    const doc = ref(uid);
    const snap = await tx.get(doc);
    const current = snap.exists ? (snap.data().credits ?? 0) : STARTING_CREDITS;

    if (current < cost) {
      return { ok: false, remaining: current, unlimited: false };
    }

    const next = current - cost;
    tx.set(
      doc,
      {
        plan: snap.exists ? (snap.data().plan ?? "free") : "free",
        credits: next,
        last_spend_reason: reason,
        updated_at: new Date().toISOString(),
      },
      { merge: true }
    );
    return { ok: true, remaining: next, unlimited: false };
  });
}

export interface DailyAward {
  awarded: boolean;
  credits: number;
  streak: number;
}

/**
 * Award the once-a-day credit bonus and advance the streak. Idempotent within
 * a calendar day, so it is safe to call on every entitlement read — which is
 * how a student earns tutor credits simply by turning up and studying.
 */
export async function awardDailyLogin(uid: string): Promise<DailyAward> {
  const today = dayKey();

  return adminDb.runTransaction(async (tx: any) => {
    const docRef = ref(uid);
    const snap = await tx.get(docRef);
    const data = snap.exists ? snap.data() : {};

    if (data.last_daily_at === today) {
      return {
        awarded: false,
        credits: data.credits ?? STARTING_CREDITS,
        streak: data.streak ?? 0,
      };
    }

    const previous: string | undefined = data.last_daily_at;
    // A gap of more than one day breaks the streak.
    const streak = previous && daysBetween(previous, today) === 1 ? (data.streak ?? 0) + 1 : 1;
    const longestStreak = Math.max(data.longestStreak ?? 0, streak);
    const credits = (snap.exists ? (data.credits ?? 0) : STARTING_CREDITS) + CREDIT_REWARDS.daily_login;

    tx.set(
      docRef,
      {
        plan: data.plan ?? "free",
        credits,
        streak,
        longestStreak,
        last_daily_at: today,
        updated_at: new Date().toISOString(),
      },
      { merge: true }
    );

    return { awarded: true, credits, streak };
  });
}
