"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Trophy,
  Target,
  Clock,
  Zap,
  Calendar,
  ChevronRight,
  Brain,
  Flame,
  BookOpen,
  AlertTriangle,
  BarChart3,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  PageHeader,
  PrimaryButton,
  SecondaryButton,
  SectionCard,
  StatCard,
  EmptyState,
} from "@/components/UIComponents";

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);
  const [allAttempts, setAllAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [engagement, setEngagement] = useState<any>(null);
  const [daily, setDaily] = useState<{ completed: boolean } | null>(null);

  // Rank and streak come from the server: rank needs the whole leaderboard,
  // which students cannot read directly under the current rules.
  useEffect(() => {
    if (authLoading || !user) return;

    (async () => {
      try {
        const token = await user.getIdToken();
        const [engRes, dailyRes] = await Promise.all([
          fetch("/api/me/engagement", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }),
          fetch("/api/me/practice?daily=1", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }),
        ]);
        if (engRes.ok) setEngagement(await engRes.json());
        if (dailyRes.ok) {
          const body = await dailyRes.json();
          setDaily(body.daily ?? { completed: body.reason === "daily_done" });
        }
      } catch (err) {
        console.error("Dashboard engagement load failed:", err);
      }
    })();
  }, [authLoading, user]);

  useEffect(() => {
    const userId = user?.uid;
    if (authLoading || !userId) return;

    async function fetchDashboardData() {
      try {
        const qAll = query(
          collection(db, "exam_attempts"),
          where("user_id", "==", userId)
        );
        const allSnap = await getDocs(qAll);
        const allData = allSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => {
             const timeA = a.attempted_at?.toMillis?.() || 0;
             const timeB = b.attempted_at?.toMillis?.() || 0;
             return timeB - timeA;
          });

        setAllAttempts(allData);
        setRecentAttempts(allData.slice(0, 4));
      } catch (err) {
        console.error("Dashboard: Error fetching data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user, authLoading]);

  const stats = useMemo(() => {
    const totalCount = allAttempts.length;
    if (totalCount === 0) return { avgScore: 0, examsTaken: 0, totalHours: 0, accuracy: 0, skillDistribution: {} };

    const totalScore = allAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0);
    const totalPossible = allAttempts.reduce((acc, curr) => acc + (curr.total_questions || curr.total_marks || 10), 0);
    const totalTimeSeconds = allAttempts.reduce((acc, curr) => acc + (curr.time_spent_seconds || 0), 0);

    const skills: Record<string, number> = {};
    allAttempts.forEach(att => {
      const cat = att.category || "General";
      skills[cat] = (skills[cat] || 0) + 1;
    });

    return {
      avgScore: Math.round((totalScore / totalCount) * 10) / 10,
      examsTaken: totalCount,
      totalHours: Math.round((totalTimeSeconds / 3600) * 10) / 10,
      accuracy: Math.round((totalScore / totalPossible) * 100),
      skillDistribution: skills
    };
  }, [allAttempts]);

  const systems = [
    { title: "AI Socratic Tutor", desc: "Get Socratic hints & explanations on demand", icon: Brain, href: "/tutor", tint: "bg-violet-50 text-violet-600" },
    { title: "Adaptive Exams", desc: "Difficulty adjusts to your skill level in real time", icon: Zap, href: "/exams", tint: "bg-amber-50 text-amber-600" },
    { title: "FSRS Flashcards", desc: "Scientific spaced repetition for 98%+ retention", icon: BookOpen, href: "/flashcards", tint: "bg-emerald-50 text-emerald-600" },
    { title: "Weak Area Detection", desc: "AI identifies & recommends targeted drills", icon: AlertTriangle, href: "/analytics", tint: "bg-red-50 text-red-600" },
    { title: "Study Planner", desc: "Personalized weekly schedule, AI-optimized", icon: Calendar, href: "/study-plan", tint: "bg-sky-50 text-sky-600" },
    { title: "Leaderboard", desc: "Compete globally & track your live ranking", icon: Trophy, href: "/leaderboard", tint: "bg-yellow-50 text-yellow-600" },
    { title: "Deep Analytics", desc: "Comprehensive performance metrics & insights", icon: BarChart3, href: "/analytics", tint: "bg-zinc-100 text-zinc-600" },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
        <div className="relative w-10 h-10 mb-4">
          <div className="absolute inset-0 border-2 border-primary-100 rounded-full" />
          <div className="absolute inset-0 border-2 border-t-primary-600 rounded-full animate-spin" />
        </div>
        <p className="text-zinc-400 font-semibold uppercase tracking-widest text-[11px]">Loading dashboard</p>
      </div>
    );
  }

  const firstName = user?.displayName || user?.email?.split("@")[0] || "there";

  return (
    <div className="min-h-screen bg-zinc-50/40 pb-20 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Welcome */}
        <PageHeader
          badge="AI-Powered Learning Hub"
          title={`Welcome back, ${firstName}`}
          subtitle={
            engagement
              ? engagement.currentStreak > 0
                ? `${engagement.currentStreak}-day streak going. ${engagement.recommendation}`
                : engagement.recommendation
              : "Loading your progress…"
          }
          actions={
            <>
              <PrimaryButton href="/exams" icon={<Zap className="w-4 h-4" />}>Take Exam</PrimaryButton>
              <div className="grid grid-cols-2 gap-2">
                <SecondaryButton href="/flashcards" icon={<Brain className="w-4 h-4" />}>Flashcards</SecondaryButton>
                <SecondaryButton href="/tutor" icon={<Sparkles className="w-4 h-4 text-violet-600" />}>Tutor</SecondaryButton>
              </div>
            </>
          }
        />

        {/* KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Trophy className="w-4 h-4" />}
            label="Overall Rank"
            value={engagement?.globalRank ? `#${engagement.globalRank}` : "—"}
            subValue={
              engagement?.globalRank
                ? `of ${engagement.cohortSize} · ${engagement.avgScore}% average`
                : "Sit an exam to rank"
            }
          />
          <StatCard icon={<Target className="w-4 h-4" />} label="Accuracy" value={`${stats.accuracy}%`} subValue="Precision rate" />
          <StatCard icon={<Clock className="w-4 h-4" />} label="Study Time" value={`${stats.totalHours}h`} subValue="Total logged" />
          <StatCard
            icon={<Flame className="w-4 h-4" />}
            label="Current Streak"
            value={engagement ? `${engagement.currentStreak} day${engagement.currentStreak === 1 ? "" : "s"}` : "—"}
            subValue={engagement ? `Best ${engagement.longestStreak} days` : "Consistent activity"}
          />
        </div>

        {/* Daily 10 */}
        <div className="p-5 rounded-xl bg-white border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                {daily?.completed ? "Daily 10 complete" : "Daily 10"}
              </h3>
              <p className="text-xs text-zinc-500">
                {daily?.completed
                  ? "Done for today — come back tomorrow to extend your streak."
                  : "Ten questions aimed at your weak spots. Keeps your streak alive and earns credits."}
              </p>
            </div>
          </div>
          {!daily?.completed && (
            <PrimaryButton href="/practice?daily=1" icon={<Zap className="w-4 h-4" />}>
              Start today&apos;s set
            </PrimaryButton>
          )}
        </div>

        {/* Learning ecosystem */}
        <SectionCard
          title="Your learning ecosystem"
          description="Every AI-powered system available to accelerate your prep"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {systems.map((s) => (
              <Link key={s.title} href={s.href}>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.15 }}
                  className="p-4 rounded-lg border border-zinc-200 hover:border-primary-300 h-full flex flex-col transition-colors"
                >
                  <div className={`w-9 h-9 rounded-md flex items-center justify-center mb-3 ${s.tint}`}>
                    <s.icon className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-semibold text-zinc-900 text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed flex-1">{s.desc}</p>
                  <div className="mt-3 flex items-center text-primary-600 font-semibold text-xs">
                    Explore <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Subject proficiency */}
          <SectionCard title="Subject proficiency" className="lg:col-span-1">
            <div className="space-y-4">
              {Object.keys(stats.skillDistribution).length > 0 ? (
                Object.entries(stats.skillDistribution).map(([cat, count]) => (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-zinc-700">
                      <span>{cat}</span>
                      <span className="tabular-nums">{Math.min(100, (count as number) * 25)}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                      <div className="h-full rounded-full bg-primary-600" style={{ width: `${Math.min(100, (count as number) * 25)}%` }} />
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={<Brain className="w-8 h-8" />}
                  title="No exam history yet"
                  description="Take your first diagnostic to see subject proficiency."
                  action={{ label: "Browse exams", href: "/exams" }}
                />
              )}
            </div>
            <div className="pt-4 mt-4 border-t border-zinc-100 flex justify-between items-center text-xs font-semibold text-zinc-500">
              <span>Target competency</span>
              <span className="text-primary-600">85% goal</span>
            </div>
          </SectionCard>

          {/* Recent attempts */}
          <SectionCard
            title="Recent assessment history"
            description={`${allAttempts.length} total attempts`}
            className="lg:col-span-2"
          >
            <div className="space-y-2.5">
              {recentAttempts.length > 0 ? (
                recentAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="p-3.5 rounded-lg bg-zinc-50 hover:bg-zinc-100/70 border border-zinc-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900">{attempt.exam_title || "Semester Examination"}</h4>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                        <span>{attempt.category || "BIT Course"}</span>
                        <span>·</span>
                        <span>{attempt.attempted_at?.toDate?.()?.toLocaleDateString() || "Recently"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-sm font-bold text-zinc-900 tabular-nums">{attempt.score || 0} / {attempt.total_marks || attempt.total_questions || 10}</span>
                        <p className="text-[10px] text-emerald-600 font-semibold">Completed</p>
                      </div>
                      <Link
                        href={`/exams/${attempt.exam_id || "default"}/take`}
                        className="px-3 py-1.5 rounded-md bg-white border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                      >
                        Retake
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={<BookOpen className="w-8 h-8" />}
                  title="No recent attempts found"
                  description="Your completed exams will show up here."
                  action={{ label: "Browse exams", href: "/exams" }}
                />
              )}
            </div>
          </SectionCard>

        </div>

      </div>
    </div>
  );
}
