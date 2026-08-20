"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Brain, 
  Zap, 
  Award, 
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface SubjectPerformance {
  subject: string;
  masteryPercentage: number;
  totalAttempted: number;
  accuracy: number;
  avgTimeSeconds: number;
  topperAvgSeconds: number;
  status: "Mastered" | "Proficient" | "Weak";
  weakTopics: string[];
}

const PERFORMANCE_DATA: SubjectPerformance[] = [
  {
    subject: "Programming in C",
    masteryPercentage: 88,
    totalAttempted: 145,
    accuracy: 91,
    avgTimeSeconds: 42,
    topperAvgSeconds: 38,
    status: "Mastered",
    weakTopics: ["File Handling with binary mode", "Function Pointers"]
  },
  {
    subject: "Data Structures & Algorithms",
    masteryPercentage: 74,
    totalAttempted: 120,
    accuracy: 78,
    avgTimeSeconds: 65,
    topperAvgSeconds: 45,
    status: "Proficient",
    weakTopics: ["AVL Tree Rotations (LR/RL)", "Dijkstra Graph Complexity"]
  },
  {
    subject: "Mathematics-I (Calculus)",
    masteryPercentage: 58,
    totalAttempted: 95,
    accuracy: 62,
    avgTimeSeconds: 88,
    topperAvgSeconds: 52,
    status: "Weak",
    weakTopics: ["Integration by Partial Fractions", "Mean Value Theorems"]
  },
  {
    subject: "Microcontroller 8051",
    masteryPercentage: 82,
    totalAttempted: 80,
    accuracy: 85,
    avgTimeSeconds: 35,
    topperAvgSeconds: 32,
    status: "Proficient",
    weakTopics: ["Timer Mode 2 Auto-reload", "UART SCON configuration"]
  },
  {
    subject: "Database Management Systems (DBMS)",
    masteryPercentage: 92,
    totalAttempted: 160,
    accuracy: 94,
    avgTimeSeconds: 40,
    topperAvgSeconds: 35,
    status: "Mastered",
    weakTopics: ["Boyce-Codd Normal Form (BCNF)"]
  }
];

export default function AnalyticsPage() {
  const [activeFilter, setActiveFilter] = useState<"All" | "Weak" | "Mastered">("All");

  const filteredData = PERFORMANCE_DATA.filter(p => {
    if (activeFilter === "Weak") return p.status === "Weak";
    if (activeFilter === "Mastered") return p.status === "Mastered";
    return true;
  });

  const overallMastery = Math.round(
    PERFORMANCE_DATA.reduce((acc, curr) => acc + curr.masteryPercentage, 0) / PERFORMANCE_DATA.length
  );

  return (
    <div className="min-h-screen bg-mesh text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Hero Banner */}
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-indigo-950/30 backdrop-blur-xl shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest">
              <BarChart3 className="w-4 h-4" />
              <span>Real-Time Mastery & Diagnostic Engine</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Learning Analytics & <br />
              <span className="text-gradient">Weak-Area Diagnosis</span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
              Track topic-level competency, benchmark your solving speed against university toppers, and trigger targeted intervention drills on your weakest concepts.
            </p>
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Overall Mastery</span>
              <Target className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-black text-white">{overallMastery}%</div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${overallMastery}%` }} />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Average Speed</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-white">54s <span className="text-xs text-slate-500">/ Question</span></div>
            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 12% faster than last week
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Questions Solved</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white">600+</div>
            <p className="text-xs text-slate-400">Across 5 semester courses</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Retention Score</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-purple-300">96.8%</div>
            <p className="text-xs text-purple-400 font-bold">FSRS v6 Active</p>
          </div>
        </div>

        {/* Subject Mastery Breakdown */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase text-indigo-400">Deep Diagnostic</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Subject Mastery & Weakness Analysis</h2>
            </div>

            <div className="flex gap-2">
              {(["All", "Weak", "Mastered"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    activeFilter === filter
                      ? "bg-indigo-600 text-white border-indigo-400 shadow-md"
                      : "bg-slate-900 text-slate-400 hover:text-white border-white/5"
                  }`}
                >
                  {filter} Subjects
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredData.map((sub, idx) => (
              <motion.div
                key={sub.subject}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 sm:p-7 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl space-y-5 shadow-xl hover:border-indigo-500/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-white">{sub.subject}</h3>
                      {sub.status === "Weak" ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Needs Attention
                        </span>
                      ) : sub.status === "Mastered" ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                          Proficient
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{sub.totalAttempted} Questions Practiced • {sub.accuracy}% Accuracy</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">{sub.masteryPercentage}%</div>
                      <div className="text-[11px] text-slate-500 uppercase font-bold">Mastery Level</div>
                    </div>

                    <Link
                      href="/flashcards"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
                    >
                      <span>Drill Flashcards</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-white/5">
                  <div 
                    className={`h-full rounded-full ${
                      sub.masteryPercentage >= 85 ? "bg-emerald-500" : sub.masteryPercentage >= 70 ? "bg-amber-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${sub.masteryPercentage}%` }}
                  />
                </div>

                {/* Weak Topics Diagnostic */}
                {sub.weakTopics && sub.weakTopics.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                    <span className="text-[11px] font-black uppercase text-rose-400 tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Identified Knowledge Gaps (Intervention Recommended)
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {sub.weakTopics.map((topic, tIdx) => (
                        <span key={tIdx} className="px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-300">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
