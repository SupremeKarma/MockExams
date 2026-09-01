"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Flame,
  Trophy,
  Target,
  Loader2,
  ArrowRight,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  points: number;
}

interface EngagementSummary {
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  level: number;
  examsCompleted: number;
  practiceSessions: number;
  avgScore: number;
  globalRank: number | null;
  cohortSize: number;
  badges: Badge[];
  lockedBadges: Badge[];
  engagementScore: number;
  recommendation: string;
  nextMilestones: string[];
}

const RARITY_STYLES: Record<Badge["rarity"], string> = {
  common: "bg-zinc-50 border-zinc-200 text-zinc-600",
  uncommon: "bg-emerald-50 border-emerald-200 text-emerald-700",
  rare: "bg-sky-50 border-sky-200 text-sky-700",
  epic: "bg-violet-50 border-violet-200 text-violet-700",
  legendary: "bg-amber-50 border-amber-200 text-amber-700",
};

export default function RewardsPage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<EngagementSummary | null>(null);
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
        const res = await fetch("/api/me/engagement", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (res.ok) setData(await res.json());
      } catch (err) {
        console.error("Engagement load failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading, user]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/40">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!user || !data) {
    return (
      <div className="min-h-screen bg-zinc-50/40 flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <Trophy className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-zinc-900">Sign in to see your achievements</h1>
          <p className="text-sm text-zinc-500">
            Badges, streaks and points are earned from your own study activity.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm"
          >
            Log in <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/40 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Level {data.level}
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight">
            Earned, not given.
          </h1>
          <p className="text-zinc-500 text-sm max-w-xl mx-auto">{data.recommendation}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat icon={<Flame className="w-4 h-4 text-amber-600" />} label="Current streak" value={`${data.currentStreak}d`} sub={`Best ${data.longestStreak}d`} />
          <Stat icon={<Sparkles className="w-4 h-4 text-primary-600" />} label="Points" value={String(data.totalPoints)} sub={`Level ${data.level}`} />
          <Stat icon={<Target className="w-4 h-4 text-violet-600" />} label="Activity" value={`${data.examsCompleted + data.practiceSessions}`} sub={`${data.examsCompleted} exams · ${data.practiceSessions} drills`} />
          <Stat
            icon={<Trophy className="w-4 h-4 text-emerald-600" />}
            label="Global rank"
            value={data.globalRank ? `#${data.globalRank}` : "—"}
            sub={
              data.globalRank
                ? `of ${data.cohortSize} · ${data.avgScore}% average`
                : "Sit an exam to rank"
            }
          />
        </div>

        <div className="p-5 rounded-xl bg-white border border-zinc-200 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900">Engagement</h2>
            <span className="text-sm font-bold text-zinc-900 tabular-nums">
              {data.engagementScore}/100
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-600 transition-all"
              style={{ width: `${data.engagementScore}%` }}
            />
          </div>
          {data.nextMilestones.length > 0 && (
            <ul className="space-y-1 pt-1">
              {data.nextMilestones.map((milestone) => (
                <li key={milestone} className="text-xs text-zinc-500 flex items-start gap-1.5">
                  <ArrowRight className="w-3 h-3 mt-0.5 text-zinc-300 flex-shrink-0" />
                  {milestone}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-5 rounded-xl bg-white border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-sm font-bold text-zinc-900">Daily 10</h2>
            <p className="text-xs text-zinc-500">
              Ten questions aimed at your weak spots. Keeps your streak alive and earns credits.
            </p>
          </div>
          <Link
            href="/practice?daily=1"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm flex-shrink-0"
          >
            Start today&apos;s set <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Recognition instead of cash.
            The page used to promise the global top 1% a "$500 tuition
            reimbursement". That is a financial obligation the platform cannot
            currently honour, and an unhonoured promise to students is worse
            than offering nothing. These rewards cost nothing to keep and can
            be honoured on day one. */}
        <div className="p-5 rounded-xl bg-white border border-zinc-200 space-y-3">
          <h2 className="text-sm font-bold text-zinc-900">What recognition gets you</h2>
          <ul className="space-y-2">
            {[
              "A verifiable certificate for every exam you master, with a code anyone can check",
              "Your name on the public leaderboard for each exam",
              "Badges on your profile that show what you actually did, not what you paid for",
              "Credits earned by studying, so the AI tutor stays free if you keep showing up",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-zinc-600">
                <Sparkles className="w-3.5 h-3.5 text-primary-600 flex-shrink-0 mt-1" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            No cash prizes or scholarships are offered. Everything listed here is something
            MockExams can honour today.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-sm font-bold text-zinc-900">
            Badges earned{" "}
            <span className="font-normal text-zinc-400">
              ({data.badges.length} of {data.badges.length + data.lockedBadges.length})
            </span>
          </h2>

          {data.badges.length === 0 ? (
            <p className="text-sm text-zinc-500 py-4">
              None yet — finish an exam to unlock your first.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border space-y-1 ${RARITY_STYLES[badge.rarity]}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide opacity-70">
                      {badge.rarity} · {badge.points}pt
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900">{badge.name}</h3>
                  <p className="text-xs text-zinc-500">{badge.description}</p>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {data.lockedBadges.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-zinc-900">Still to unlock</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.lockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-4 rounded-lg border border-dashed border-zinc-200 bg-white space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl grayscale opacity-40">{badge.icon}</span>
                    <Lock className="w-3.5 h-3.5 text-zinc-300" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-500">{badge.name}</h3>
                  <p className="text-xs text-zinc-400">{badge.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="p-4 rounded-lg bg-white border border-zinc-200 space-y-1">
      {icon}
      <div className="text-xl font-bold text-zinc-900 tabular-nums">{value}</div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">{label}</div>
      <div className="text-[11px] text-zinc-400">{sub}</div>
    </div>
  );
}
