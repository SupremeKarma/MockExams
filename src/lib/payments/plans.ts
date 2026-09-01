// Single source of truth for what can be bought.
//
// Prices are in NPR because the audience is Nepali students. Amounts are
// integers (rupees) to avoid float rounding in payment signatures.

import type { Plan } from "@/lib/entitlements";

export interface PlanOffer {
  /** Stable id used in checkout requests and stored on the transaction. */
  id: string;
  plan: Plan;
  label: string;
  amountNPR: number;
  durationDays: number;
  /** Env var holding the Stripe price id, for international checkout. */
  stripePriceIdEnv?: string;
}

export const PLAN_CATALOG: Record<string, PlanOffer> = {
  pro_monthly: {
    id: "pro_monthly",
    plan: "pro",
    label: "Pro Scholar (monthly)",
    amountNPR: 499,
    durationDays: 30,
    stripePriceIdEnv: "STRIPE_PRICE_PRO_MONTHLY",
  },
  campus_semester: {
    id: "campus_semester",
    plan: "campus",
    label: "Campus License (semester)",
    amountNPR: 2999,
    durationDays: 180,
    stripePriceIdEnv: "STRIPE_PRICE_CAMPUS_SEMESTER",
  },
};

export function getPlanOffer(id: string): PlanOffer | null {
  return PLAN_CATALOG[id] ?? null;
}

export function expiryFromNow(durationDays: number): string {
  return new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
}
