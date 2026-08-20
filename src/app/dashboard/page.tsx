"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Zap,
  Calendar,
  ChevronRight,
  Brain,
  ShieldCheck,
  ZapOff,
  Flame,
  ArrowRight,
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

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);
  const [allAttempts, setAllAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
        <div className="relative w-16 h-16 mb-6">
           <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
           <Zap className="absolute inset-0 m-auto w-6 h-6 text-indigo-600 animate-pulse" />
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh text-slate-900 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Welcome Section with Enhanced Design */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-transparent to-purple-50 opacity-50" />

          <div className="relative z-10 p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-300 text-indigo-700 text-xs font-black uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                <span>AI-Powered Learning Hub</span>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Welcome back, <br />
                  <span className="text-gradient">{user?.displayName || user?.email?.split('@')[0]}</span>
                </h1>
              </div>
              <div className="space-y-2">
                <p className="text-slate-700 text-sm sm:text-base font-medium">
                  Your diagnostic performance is trending <span className="text-emerald-600 font-bold">+12.4% ↗</span> this week
                </p>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Keep your 8-day streak going! Next milestone: 15 days 🔥
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <Link href="/exams" className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-xs hover:shadow-lg transition-all shadow-md flex items-center justify-center gap-2 transform hover:scale-105">
                <Zap className="w-4 h-4" /> Take Exam
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/flashcards" className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5">
                  <Brain className="w-4 h-4" /> Flashcards
                </Link>
                <Link href="/tutor" className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Tutor
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* High-Level Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            icon={<Trophy className="w-5 h-5 text-amber-600" />}
            label="Overall Rank"
            value="#124"
            subValue="Top 5% Global"
            badgeBg="bg-amber-50"
          />
          <StatCard
            icon={<Target className="w-5 h-5 text-emerald-600" />}
            label="Accuracy Matrix"
            value={`${stats.accuracy}%`}
            subValue="Precision Rate"
            badgeBg="bg-emerald-50"
          />
          <StatCard
            icon={<Clock className="w-5 h-5 text-indigo-600" />}
            label="Total Study Time"
            value={`${stats.totalHours}h`}
            subValue="Time Immersed"
            badgeBg="bg-indigo-50"
          />
          <StatCard
            icon={<Flame className="w-5 h-5 text-rose-600" />}
            label="Current Streak"
            value="8 Days"
            subValue="Consistent Active"
            badgeBg="bg-rose-50"
          />
        </div>

        {/* AI Systems Showcase - 8 Key Features */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">Your AI Learning Ecosystem</h2>
            <p className="text-sm text-slate-600">Explore all 8 AI-powered systems designed to accelerate your learning</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Dashboard - Already here, show stats */}
            <AISystemCard
              title="Dashboard"
              description="Real-time stats & adaptive progress tracking"
              icon={<TrendingUp className="w-6 h-6" />}
              bgGradient="from-indigo-50 to-blue-50"
              borderColor="border-indigo-200"
              href="/dashboard"
              isActive={true}
            />

            {/* 2. AI Tutor */}
            <AISystemCard
              title="AI Socratic Tutor"
              description="Get Socratic hints & explanations on demand"
              icon={<Brain className="w-6 h-6" />}
              bgGradient="from-purple-50 to-pink-50"
              borderColor="border-purple-200"
              href="/tutor"
            />

            {/* 3. Adaptive Exams */}
            <AISystemCard
              title="Adaptive Exams"
              description="Difficulty adjusts to your skill level in real-time"
              icon={<Zap className="w-6 h-6" />}
              bgGradient="from-amber-50 to-orange-50"
              borderColor="border-amber-200"
              href="/exams"
            />

            {/* 4. FSRS Flashcards */}
            <AISystemCard
              title="FSRS Flashcards"
              description="Scientific spaced repetition for 98%+ retention"
              icon={<BookOpen className="w-6 h-6" />}
              bgGradient="from-emerald-50 to-teal-50"
              borderColor="border-emerald-200"
              href="/flashcards"
            />

            {/* 5. Weak Area Detection */}
            <AISystemCard
              title="Weak Area Detection"
              description="AI identifies & recommends targeted drills"
              icon={<AlertTriangle className="w-6 h-6" />}
              bgGradient="from-rose-50 to-red-50"
              borderColor="border-rose-200"
              href="/analytics"
            />

            {/* 6. Study Plan Generator */}
            <AISystemCard
              title="Study Planner"
              description="Personalized weekly schedule with AI optimization"
              icon={<Calendar className="w-6 h-6" />}
              bgGradient="from-cyan-50 to-blue-50"
              borderColor="border-cyan-200"
              href="/study-plan"
            />

            {/* 7. Leaderboard & Competition */}
            <AISystemCard
              title="Leaderboard"
              description="Compete globally & track your ranking in real-time"
              icon={<Trophy className="w-6 h-6" />}
              bgGradient="from-yellow-50 to-amber-50"
              borderColor="border-yellow-200"
              href="/leaderboard"
            />

            {/* 8. Performance Analytics */}
            <AISystemCard
              title="Deep Analytics"
              description="Comprehensive performance metrics & insights"
              icon={<BarChart3 className="w-6 h-6" />}
              bgGradient="from-slate-50 to-gray-50"
              borderColor="border-slate-200"
              href="/analytics"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Skill Distribution */}
          <div className="lg:col-span-1 space-y-4">
             <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                  <Brain className="w-5 h-5 text-indigo-600" /> Subject Proficiency
                </h3>
                
                <div className="space-y-5">
                  {Object.keys(stats.skillDistribution).length > 0 ? (
                    Object.entries(stats.skillDistribution).map(([cat, count], i) => (
                      <SkillMetric 
                        key={cat} 
                        label={cat} 
                        level={Math.min(100, (count as number) * 25)} 
                        color={i % 2 === 0 ? "bg-indigo-600" : "bg-emerald-600"} 
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                       <ZapOff className="w-10 h-10 mx-auto mb-2 opacity-50" />
                       <p className="text-xs font-bold uppercase tracking-wider">No Exam History Yet</p>
                    </div>
                  )}
                </div>
                
                <div className="pt-5 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>Target Competency</span>
                  <span className="text-indigo-600">85% Goal</span>
                </div>
             </div>
          </div>

          {/* Recent Attempt History */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" /> Recent Assessment History
                </h3>
                <span className="text-xs text-slate-400 font-bold">{allAttempts.length} Total Attempts</span>
              </div>

              <div className="space-y-3">
                {recentAttempts.length > 0 ? (
                  recentAttempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{attempt.exam_title || "Semester Examination"}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                          <span>{attempt.category || "BIT Course"}</span>
                          <span>•</span>
                          <span>{attempt.attempted_at?.toDate?.()?.toLocaleDateString() || "Recently"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-auto">
                        <div className="text-right">
                          <span className="text-sm font-black text-slate-900">{attempt.score || 0} / {attempt.total_marks || attempt.total_questions || 10}</span>
                          <p className="text-[10px] text-emerald-600 font-bold">Completed</p>
                        </div>
                        <Link
                          href={`/exams/${attempt.exam_id || "default"}/take`}
                          className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
                        >
                          Retake
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-400 space-y-3">
                    <BookOpen className="w-10 h-10 mx-auto opacity-50" />
                    <p className="text-xs font-bold uppercase tracking-wider">No Recent Attempts Found</p>
                    <Link href="/exams" className="inline-block px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700">
                      Browse Exams
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue, badgeBg }: any) {
  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
      <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
        <span>{label}</span>
        <div className={`p-2 rounded-xl ${badgeBg}`}>{icon}</div>
      </div>
      <div className="text-3xl font-black text-slate-900">{value}</div>
      <p className="text-xs text-slate-500 font-medium">{subValue}</p>
    </div>
  );
}

function SkillMetric({ label, level, color }: any) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-bold text-slate-700">
        <span>{label}</span>
        <span>{level}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}

function AISystemCard({
  title,
  description,
  icon,
  bgGradient,
  borderColor,
  href,
  isActive,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgGradient: string;
  borderColor: string;
  href: string;
  isActive?: boolean;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05, translateY: -4 }}
        className={`p-6 rounded-3xl border ${borderColor} bg-gradient-to-br ${bgGradient} cursor-pointer transition-all shadow-sm hover:shadow-md h-full flex flex-col ${
          isActive ? "ring-2 ring-indigo-400" : ""
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-2xl bg-white/50 border border-white/50 text-indigo-600">{icon}</div>
          {isActive && <span className="px-2 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black">ACTIVE</span>}
        </div>
        <h3 className="font-bold text-slate-900 text-sm mb-1">{title}</h3>
        <p className="text-xs text-slate-700 leading-relaxed flex-1">{description}</p>
        <div className="mt-4 flex items-center text-indigo-600 font-bold text-xs">
          Explore <ChevronRight className="w-3 h-3 ml-1" />
        </div>
      </motion.div>
    </Link>
  );
}
