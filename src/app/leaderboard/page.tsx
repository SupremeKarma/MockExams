"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Target, TrendingUp, Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [selectedExam, setSelectedExam] = useState("");
  const [exams, setExams] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [currentUserEntry, setCurrentUserEntry] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const examsQ = query(
          collection(db, "exams"),
          where("is_published", "==", true),
          where("visibility", "==", "public")
        );
        const examsSnapshot = await getDocs(examsQ);
        setExams(examsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        const token = await user?.getIdToken();
        const url = `/api/leaderboard?${selectedExam ? `examId=${selectedExam}` : ""}`;
        const response = await fetch(url, {
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        
        const data = await response.json();
        
        if (data.entries) {
          setLeaderboard(data.entries);
          setCurrentUserEntry(data.currentUserEntry || null);
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedExam, user]);

  const filteredLeaderboard = leaderboard.filter(entry => 
    entry.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const top3 = filteredLeaderboard.slice(0, 3);
  const rest = filteredLeaderboard.slice(3);

  return (
    <div className="min-h-screen bg-mesh text-slate-900 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black uppercase tracking-widest">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Hall of Fame</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Community Leaderboard</h1>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            Celebrate the top performers in our ecosystem. Compete with students and climb the global ranking.
          </p>
        </div>

        {/* User's Standout Section */}
        {currentUserEntry && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex flex-col items-center justify-center text-white shadow-md">
                <span className="text-[10px] uppercase font-black tracking-widest opacity-80">Rank</span>
                <span className="text-3xl font-black">#{currentUserEntry.rank}</span>
              </div>
              <div>
                <p className="text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">Your Performance</p>
                <h2 className="text-2xl font-black text-slate-900">{currentUserEntry.displayName}</h2>
                <div className="flex items-center gap-3 mt-1.5 text-slate-500 text-xs font-medium">
                  <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Top {Math.round((currentUserEntry.rank / (leaderboard.length || 100)) * 100)}%</span>
                  <span>•</span>
                  <span>{currentUserEntry.attempts} exams attempted</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-8 items-center border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
              <div className="text-center">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Accuracy</p>
                <p className="text-2xl font-black text-emerald-600">{currentUserEntry.bestPercentage.toFixed(1)}%</p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Score</p>
                <p className="text-2xl font-black text-slate-900">{currentUserEntry.bestScore}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter Bar */}
        <div className="flex justify-center">
          <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-3">Filter by Exam:</span>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              <option value="">All Exams (Global)</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>
                  {exam.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-48 bg-white border border-slate-200 rounded-3xl animate-pulse" />
            ))
          ) : (
            <>
              {top3[1] && (
                <PodiumCard 
                  rank={top3[1].rank || 2} 
                  name={top3[1].displayName} 
                  score={top3[1].bestPercentage} 
                  color="text-slate-700" 
                  bgColor="bg-slate-100"
                  delay={0.1}
                />
              )}
              {top3[0] && (
                <PodiumCard 
                  rank={top3[0].rank || 1} 
                  name={top3[0].displayName} 
                  score={top3[0].bestPercentage} 
                  color="text-amber-700" 
                  bgColor="bg-amber-100"
                  delay={0}
                  featured={true}
                />
              )}
              {top3[2] && (
                <PodiumCard 
                  rank={top3[2].rank || 3} 
                  name={top3[2].displayName} 
                  score={top3[2].bestPercentage} 
                  color="text-orange-700" 
                  bgColor="bg-orange-100"
                  delay={0.2}
                />
              )}
            </>
          )}
        </div>

        {/* Full List & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main List */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-sm">Top Aspirants Ranking</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Find student..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="p-6 animate-pulse" />
                ))
              ) : (
                rest.map((entry, i) => (
                  <LeaderboardRow 
                    key={i} 
                    rank={entry.rank} 
                    name={entry.displayName} 
                    score={entry.bestPercentage}
                    exams={entry.attempts}
                    isUser={entry.isCurrentUser}
                  />
                ))
              )}
              {!loading && leaderboard.length === 0 && (
                <div className="p-16 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                  No entries found yet. Be the first to take an exam!
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Personal Standing</h3>
              <p className="text-xs text-slate-500">
                {user ? `Logged in as ${user.displayName || user.email?.split('@')[0] || "Student"}.` : "Sign in to see your ranking."}
              </p>
              
              <div className="space-y-3 text-left pt-2 border-t border-slate-100">
                <StatLine label="Current Rank" value={currentUserEntry ? `#${currentUserEntry.rank}` : "Unranked"} />
                <StatLine label="Best Score" value={currentUserEntry ? `${currentUserEntry.bestPercentage}%` : "—"} />
                <StatLine label="Exams Taken" value={currentUserEntry ? currentUserEntry.attempts : "0"} />
              </div>

              <Link href="/exams" className="block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-all shadow-sm">
                Continue Practicing
              </Link>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-amber-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800 text-sm">
                <Medal className="w-5 h-5 text-amber-600" />
                <span>Monthly Honor Roll</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">Top performers every month receive featured badges and verified score verification certificates.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function PodiumCard({ rank, name, score, color, bgColor, delay, featured }: { rank: number, name: string, score: number, color: string, bgColor: string, delay: number, featured?: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`p-6 rounded-3xl bg-white border text-center relative shadow-sm ${featured ? "border-amber-400 ring-2 ring-amber-400/30 scale-105 shadow-md" : "border-slate-200"}`}
    >
      <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center mx-auto mb-4 ${color}`}>
        {rank === 1 ? <Trophy className="w-6 h-6 text-amber-600" /> : rank === 2 ? <Medal className="w-6 h-6 text-slate-600" /> : <Medal className="w-6 h-6 text-orange-600" />}
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1 truncate">{name}</h3>
      <div className="text-2xl font-black text-slate-900 mb-2">{score.toFixed(1)} <span className="text-xs text-slate-400 font-bold uppercase">pts</span></div>
      <div className={`text-xs font-bold uppercase tracking-wider ${color}`}>Rank {rank}</div>
    </motion.div>
  );
}

function LeaderboardRow({ rank, name, score, exams, isUser }: { rank: number, name: string, score: number, exams: number, isUser?: boolean }) {
  return (
    <div className={`p-4 flex items-center gap-4 transition-colors ${isUser ? "bg-indigo-50/70 border-l-4 border-l-indigo-600" : "hover:bg-slate-50"}`}>
      <div className="w-8 text-center text-xs font-bold text-slate-400">#{rank}</div>
      <div className="flex-1 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[11px] text-slate-700 uppercase">
          {name.split(" ").map((n: string) => n[0]).join("")}
        </div>
        <div>
          <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
            {name} 
            {isUser && <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-[9px] font-black uppercase tracking-wider text-white">You</span>}
          </h4>
          <div className="text-[10px] text-slate-400 font-medium">{exams} Exams Attempted</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-black text-xs text-slate-900">{score.toFixed(1)}</div>
        <div className="text-[9px] text-slate-400 font-bold uppercase">Score</div>
      </div>
    </div>
  );
}

function StatLine({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}
