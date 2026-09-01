"use client";

import { motion } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  Sparkles,
  Flame,
  Loader2,
  ArrowUpRight,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

interface Entitlement {
  plan: string;
  credits: number;
  streak: number;
  longestStreak: number;
  expires_at: string | null;
  isPro: boolean;
  costs: Record<string, number>;
  rewards: Record<string, number>;
}

const REWARD_LABELS: Record<string, string> = {
  daily_login: "Show up and study for a day",
  exam_completed: "Finish a mock exam",
  flashcard_session: "Complete a practice set",
  question_contribution_approved: "Contribute a question an examiner approves",
};

const COST_LABELS: Record<string, string> = {
  tutor_turn: "One message to the Socratic tutor",
  written_feedback: "Extra AI feedback on a written answer",
  flashcard_extraction: "Auto-extract flashcards from your notes",
};

export default function SubscriptionPage() {
  const { user, loading: authLoading } = useAuth();
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const token = await auth.currentUser!.getIdToken();
        const res = await fetch("/api/me/entitlement", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (res.ok) setEntitlement(await res.json());
      } catch (err) {
        console.error("Entitlement load failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading, user]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-zinc-50/40">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/40 pt-8 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${
              entitlement?.isPro
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-zinc-100 border-zinc-200 text-zinc-600"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {entitlement?.isPro ? `${entitlement.plan} plan` : "Free plan"}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900"
          >
            Study hard, and it stays <span className="text-gradient">free.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-zinc-500 text-sm max-w-2xl mx-auto leading-relaxed"
          >
            Every exam, every score, every written-answer feedback and every model answer is free,
            always. Only the open-ended AI tutor costs credits — and you earn credits by studying,
            so if you show up, you never pay.
          </motion.p>
        </div>

        {user && entitlement && !entitlement.isPro && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatBox
              icon={<Sparkles className="w-4 h-4 text-primary-600" />}
              label="Tutor credits"
              value={String(entitlement.credits)}
            />
            <StatBox
              icon={<Flame className="w-4 h-4 text-amber-600" />}
              label="Current streak"
              value={`${entitlement.streak} day${entitlement.streak === 1 ? "" : "s"}`}
            />
            <StatBox
              icon={<Zap className="w-4 h-4 text-violet-600" />}
              label="Best streak"
              value={`${entitlement.longestStreak} day${entitlement.longestStreak === 1 ? "" : "s"}`}
            />
          </div>
        )}

        {user && entitlement?.isPro && entitlement.expires_at && (
          <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-100 text-center">
            <p className="text-sm text-emerald-800">
              Unlimited AI tutoring is active until{" "}
              <strong>{new Date(entitlement.expires_at).toLocaleDateString()}</strong>.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Panel title="Always free" tint="emerald">
            <ul className="space-y-2">
              {[
                "Every mock exam and past paper",
                "Full scoring, including written answers",
                "AI feedback on what you got right and wrong",
                "Model answers and explanations",
                "Adaptive practice on your weak areas",
                "Analytics, leaderboard, flashcards, streaks",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-zinc-600">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Earn credits by studying" tint="primary">
            <ul className="space-y-2">
              {Object.entries(entitlement?.rewards ?? {}).map(([key, amount]) => (
                <li key={key} className="flex items-start justify-between gap-3 text-sm text-zinc-600">
                  <span>{REWARD_LABELS[key] ?? key}</span>
                  <span className="font-semibold text-primary-700 tabular-nums whitespace-nowrap">
                    +{amount}
                  </span>
                </li>
              ))}
            </ul>

            {entitlement && (
              <>
                <div className="h-px bg-zinc-100 my-4" />
                <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-400 mb-2">
                  What credits are spent on
                </p>
                <ul className="space-y-2">
                  {Object.entries(entitlement.costs).map(([key, amount]) => (
                    <li
                      key={key}
                      className="flex items-start justify-between gap-3 text-sm text-zinc-600"
                    >
                      <span>{COST_LABELS[key] ?? key}</span>
                      <span className="font-semibold text-zinc-500 tabular-nums whitespace-nowrap">
                        −{amount}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Panel>
        </div>

        {!entitlement?.isPro && (
          <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-bold text-zinc-900">Would rather not count credits?</h3>
              <p className="text-sm text-zinc-500">
                Pro gives unlimited tutoring, offline downloads and certificates.
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors flex-shrink-0"
            >
              See plans
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {!user && (
          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm"
            >
              Log in to see your credits
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-4 rounded-lg bg-white border border-zinc-200 text-center space-y-1">
      <div className="flex justify-center">{icon}</div>
      <div className="text-xl font-bold text-zinc-900 tabular-nums">{value}</div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">{label}</div>
    </div>
  );
}

function Panel({
  title,
  tint,
  children,
}: {
  title: string;
  tint: "emerald" | "primary";
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-xl bg-white border border-zinc-200 space-y-3">
      <h2
        className={`text-sm font-bold ${
          tint === "emerald" ? "text-emerald-700" : "text-primary-700"
        }`}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
