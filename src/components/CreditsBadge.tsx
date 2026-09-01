"use client";

import { Flame, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

interface Entitlement {
  plan: string;
  credits: number;
  streak: number;
  isPro: boolean;
  dailyBonusAwarded: boolean;
}

/**
 * Shows the student's tutor credits and study streak.
 *
 * Fetching this endpoint is also what grants the once-a-day credit bonus and
 * advances the streak — the award is idempotent per calendar day, so simply
 * arriving on any page with the navbar counts as showing up.
 */
export function CreditsBadge() {
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (!user) {
        if (!cancelled) setEntitlement(null);
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/me/entitlement", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setEntitlement(data);
      } catch {
        // A missing badge is not worth surfacing an error for.
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  if (!entitlement) return null;

  if (entitlement.isPro) {
    return (
      <span
        title="Pro — unlimited AI tutoring"
        className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] font-semibold"
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        Pro
      </span>
    );
  }

  return (
    <div className="hidden sm:flex items-center gap-1.5">
      {entitlement.streak > 0 && (
        <span
          title={`${entitlement.streak}-day study streak`}
          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-[12px] font-semibold tabular-nums"
        >
          <Flame className="w-3.5 h-3.5" />
          {entitlement.streak}
        </span>
      )}
      <Link
        href="/pricing"
        title="Tutor credits — earn more by studying, or go Pro for unlimited"
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-50 hover:bg-primary-50 border border-zinc-200 hover:border-primary-200 text-zinc-700 text-[12px] font-semibold tabular-nums transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5 text-primary-600" />
        {entitlement.credits}
      </Link>
    </div>
  );
}

export default CreditsBadge;
