"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Target, TrendingUp, Search, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState("All Time");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [currentUserEntry, setCurrentUserEntry] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const headers: HeadersInit = {};
        if (user) {
          const token = await user.getIdToken();
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch("/api/leaderboard?limit=50", { headers });
        const data = await response.json();
        
        if (data && data.entries && Array.isArray(data.entries)) {
          setLeaderboard(data.entries);
          setCurrentUserEntry(data.currentUserEntry || null);
        } else if (Array.isArray(data)) {
          setLeaderboard(data);
        } else {
          setLeaderboard([]);
          console.warn("Leaderboard API returned non-array data:", data);
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [period, user]);

  const filteredLeaderboard = leaderboard.filter(entry => 
    entry.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const top3 = filteredLeaderboard.slice(0, 3);
  const rest = filteredLeaderboard.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium mb-6">
          <Trophy className="w-4 h-4" />
          <span>Hall of Fame</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Community Leaderboard</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Celebrate the top performers in our ecosystem. Compete with thousands of students 
          and climb the ranks!
        </p>
      </div>

      {/* User's Personal Standout Section */}
      {currentUserEntry && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14 relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-amber-500/30 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition-opacity" />
          <div className="relative glass-card p-8 md:p-10 rounded-[2.5rem] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary-dark flex flex-col items-center justify-center text-white shadow-2xl shadow-primary/20">
                <span className="text-[10px] uppercase font-black tracking-widest opacity-70">Rank</span>
                <span className="text-4xl font-black">#{currentUserEntry.rank}</span>
              </div>
              <div>
                <p className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-1">Your Performance</p>
                <h2 className="text-3xl font-black text-white">{currentUserEntry.displayName}</h2>
                <div className="flex items-center gap-3 mt-2 text-slate-400 text-sm font-medium">
                  <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-emerald-400" /> Top {Math.round((currentUserEntry.rank / (leaderboard.length || 100)) * 100)}%</span>
                  <span>•</span>
                  <span>{currentUserEntry.attempts} exams attempted</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-8 md:gap-14 items-center border-t md:border-t-0 md:border-l border-white/5 pt-8 md:pt-0 md:pl-14">
              <div className="text-center">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Accuracy</p>
                <p className="text-3xl font-black text-emerald-400">{currentUserEntry.bestPercentage.toFixed(1)}%</p>
              </div>
              <div className="text-center">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Score</p>
                <p className="text-3xl font-black text-white">{currentUserEntry.bestScore}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Period Selection */}
      <div className="flex justify-center mb-12">
        <div className="glass p-1 rounded-2xl flex items-center">
          {["Weekly", "Monthly", "All Time"].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                period === p 
                  ? "bg-white text-black shadow-lg" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Top 3 Podium */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="glass-card p-12 rounded-3xl animate-pulse" />
            ))
          ) : (
            <>
              {top3[1] && (
                <PodiumCard 
                  rank={top3[1].rank || 2} 
                  name={top3[1].displayName} 
                  score={top3[1].bestPercentage} 
                  color="text-slate-300" 
                  bgColor="bg-slate-300/10"
                  delay={0.2}
                />
              )}
              {top3[0] && (
                <PodiumCard 
                  rank={top3[0].rank || 1} 
                  name={top3[0].displayName} 
                  score={top3[0].bestPercentage} 
                  color="text-amber-400" 
                  bgColor="bg-amber-400/10"
                  delay={0}
                  featured={true}
                />
              )}
              {top3[2] && (
                <PodiumCard 
                  rank={top3[2].rank || 3} 
                  name={top3[2].displayName} 
                  score={top3[2].bestPercentage} 
                  color="text-orange-400" 
                  bgColor="bg-orange-400/10"
                  delay={0.4}
                />
              )}
            </>
          )}
        </div>

        {/* Full List */}
        <div className="lg:col-span-2 glass-card rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-bold">Top Aspirants</h2>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Find student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
              />
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="p-8 animate-pulse border-b border-white/5" />
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
              <div className="p-20 text-center text-slate-500 font-medium">
                No entries found yet. Be the first to take an exam!
              </div>
            )}
          </div>
        </div>

        {/* Your Stats */}
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-3xl text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Target className="text-primary w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">My Performance</h3>
              <p className="text-sm text-slate-400 mb-8">
                {user ? `Welcome back, ${user.displayName || user.email?.split('@')[0] || "Student"}.` : "Sign in to see your ranking."}
              </p>
              
              <div className="space-y-4 text-left">
                <StatLine label="Ranking" value={currentUserEntry ? `#${currentUserEntry.rank}` : "Unranked"} />
                <StatLine label="Best Score" value={currentUserEntry ? `${currentUserEntry.bestPercentage}%` : "—"} />
                <StatLine label="Exams Taken" value={currentUserEntry ? currentUserEntry.attempts : "0"} />
              </div>

              <Link href="/exams" className="w-full mt-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center">
                Continue Practicing
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10" />
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-8 rounded-3xl border border-amber-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Medal className="text-amber-500 w-6 h-6" />
              <h3 className="font-bold">Season Rewards</h3>
            </div>
            <p className="text-sm text-slate-400 mb-6 font-medium">Top 100 students every month get exclusive access to the Advanced Physics Masterclass.</p>
            <Link href="/rewards" className="text-amber-500 text-sm font-bold flex items-center gap-1 hover:underline">
              View Rewards <ChevronRight className="w-4 h-4" />
            </Link>
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
      transition={{ delay, duration: 0.5 }}
      className={`glass-card p-8 rounded-3xl text-center relative ${featured ? "border-amber-500/30 ring-1 ring-amber-500/20 scale-105" : ""}`}
    >
      <div className={`w-16 h-16 rounded-2xl ${bgColor} flex items-center justify-center mx-auto mb-6 ${color}`}>
        {rank === 1 ? <Trophy className="w-8 h-8" /> : rank === 2 ? <Medal className="w-8 h-8" /> : <Medal className="w-8 h-8 opacity-70" />}
      </div>
      <h3 className="text-lg font-bold mb-1 truncate">{name}</h3>
      <div className="text-2xl font-black mb-4">{score.toLocaleString()} <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">pts</span></div>
      <div className={`text-sm font-bold uppercase tracking-widest ${color}`}>Rank {rank}</div>
      
      {featured && (
        <div className="absolute top-4 right-4 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
        </div>
      )}
    </motion.div>
  );
}

function LeaderboardRow({ rank, name, score, exams, isUser }: { rank: number, name: string, score: number, exams: number, isUser?: boolean }) {
  return (
    <div className={`p-4 flex items-center gap-4 transition-colors ${isUser ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-white/[0.02]"}`}>
      <div className="w-10 text-center text-sm font-bold text-slate-500">#{rank}</div>
      <div className="flex-1 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs uppercase">
          {name.split(" ").map(n => n[0]).join("")}
        </div>
        <div>
          <h4 className="font-bold text-sm flex items-center gap-2">
            {name} 
            {isUser && <span className="px-1.5 py-0.5 rounded bg-primary text-[8px] uppercase tracking-widest text-white">You</span>}
          </h4>
          <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{exams} Exams Taken</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-sm">{score.toLocaleString()}</div>
        <div className="text-[10px] text-slate-500 font-bold uppercase">Points</div>
      </div>
    </div>
  );
}

function StatLine({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-sm text-slate-400 font-medium">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}
