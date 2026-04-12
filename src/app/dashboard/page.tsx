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
  Star,
  Brain,
  ShieldCheck,
  ZapOff,
  Flame,
  Layout
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

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
        // Fetch all attempts for stats
        // Resilience against missing composite index for user_id + attempted_at
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
    
    // Skill distribution by category
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
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#020617]">
        <div className="relative w-24 h-24 mb-8">
           <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
           <Zap className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
        </div>
        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Synchronizing Matrix...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500/30">
      
      {/* 🌌 Background Atmosphere */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-600/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* 👋 Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>Identity Verified: Member</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{user?.displayName || user?.email?.split('@')[0]}</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium">Your neurological performance is trending <span className="text-emerald-400">+12.4%</span> this week.</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
            <Link href="/exams" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-3 active:scale-95">
              <Zap className="w-5 h-5" /> Begin Assessment
            </Link>
          </motion.div>
        </div>

        {/* 📊 High-Level Stats Neural Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard icon={<Trophy />} label="Elite Rank" value="#124" subValue="Top 5% Global" color="text-amber-400" />
          <StatCard icon={<Target />} label="Accuracy Matrix" value={`${stats.accuracy}%`} subValue="Precision Rate" color="text-emerald-400" />
          <StatCard icon={<Clock />} label="Focus Time" value={`${stats.totalHours}h`} subValue="Total Immersion" color="text-indigo-400" />
          <StatCard icon={<Flame />} label="Current Streak" value="8" subValue="Days Active" color="text-rose-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* 🧠 Skill Matrix Visualization */}
          <div className="lg:col-span-1 space-y-8">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="glass-card p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 relative overflow-hidden group"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl group-hover:bg-indigo-600/20 transition-all"></div>
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                  <Brain className="w-6 h-6 text-indigo-400" /> Cognitive Skills
                </h3>
                
                <div className="space-y-8 relative z-10">
                  {Object.keys(stats.skillDistribution).length > 0 ? (
                    Object.entries(stats.skillDistribution).map(([cat, count], i) => (
                      <SkillMetric 
                        key={cat} 
                        label={cat} 
                        level={Math.min(100, (count as number) * 20)} 
                        color={i % 2 === 0 ? "bg-indigo-500" : "bg-emerald-500"} 
                      />
                    ))
                  ) : (
                    <div className="text-center py-10 opacity-30">
                       <ZapOff className="w-12 h-12 mx-auto mb-4" />
                       <p className="text-[10px] font-black uppercase tracking-widest">No Skill Data Available</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-12 pt-8 border-t border-white/5">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-500 uppercase tracking-widest text-[10px]">Mastery Level</span>
                    <span className="text-indigo-400">Pioneer II</span>
                  </div>
                </div>
             </motion.div>

             {/* CTA block removed to reflect standard access */}
          </div>

          {/* 📜 Recent Activity Feed */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card rounded-[2.5rem] bg-slate-900/40 border border-white/5 overflow-hidden">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-indigo-400" /> Neural History
                </h2>
                <Link href="/dashboard/history" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                  Expand Module
                </Link>
              </div>
              
              <div className="divide-y divide-white/5">
                {recentAttempts.length > 0 ? (
                  recentAttempts.map((attempt) => (
                    <div key={attempt.id} className="p-8 flex items-center justify-between hover:bg-white/[0.02] transition-all group">
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black ${
                            (attempt.percentage || (attempt.score / (attempt.total_questions || 10)) * 100) >= 70 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}>
                          <span className="text-xs opacity-60">SCORE</span>
                          <span className="text-lg">{Math.round(attempt.percentage || (attempt.score / (attempt.total_questions || 10)) * 100)}%</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{attempt.exam_title || "Simulation"}</h4>
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <Calendar className="w-3 h-3" />
                            {attempt.attempted_at ? new Date(attempt.attempted_at).toLocaleDateString() : "RECENT"}
                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                            <span className="text-slate-400">{attempt.category || "General"}</span>
                          </div>
                        </div>
                      </div>
                      <Link 
                        href={`/exams/results/${attempt.id}`}
                        className="p-4 bg-white/5 rounded-2xl text-slate-400 group-hover:text-white group-hover:bg-indigo-600 transition-all active:scale-95"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="p-20 text-center">
                    <ZapOff className="w-12 h-12 text-slate-700 mx-auto mb-6" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No simulation data recorded yet.</p>
                    <Link href="/exams" className="text-indigo-400 text-xs font-black uppercase tracking-widest mt-4 inline-block hover:underline">Start First Session</Link>
                  </div>
                )}
              </div>
            </div>

            {/* 🏆 Leaderboard Spotlight */}
            <div className="glass-card p-10 rounded-[2.5rem] bg-slate-900/40 border border-white/5 flex flex-col md:flex-row items-center gap-10">
               <div className="flex-1">
                  <h3 className="text-2xl font-black text-white mb-2">Compete in the Arena</h3>
                  <p className="text-slate-400 text-sm font-medium mb-8">Measure your cognitive capacity against the top 0.1% of global aspirants.</p>
                  <Link href="/leaderboard" className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all">
                    Open Hall of Fame
                  </Link>
               </div>
               <div className="flex items-end gap-3 h-32">
                  <div className="w-12 bg-slate-800 rounded-t-xl h-2/3"></div>
                  <div className="w-12 bg-indigo-600 rounded-t-xl h-full shadow-[0_0_30px_rgba(79,70,229,0.3)]"></div>
                  <div className="w-12 bg-slate-800 rounded-t-xl h-1/2"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue, color }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass-card p-8 rounded-[2rem] bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all group"
    >
      <div className="flex items-start justify-between mb-8">
        <div className={`p-4 bg-white/5 rounded-2xl ${color} group-hover:scale-110 transition-transform duration-500`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{label}</p>
          <span className="text-[10px] font-bold text-slate-600 group-hover:text-slate-400 transition-colors">{subValue}</span>
        </div>
      </div>
      <h3 className="text-4xl font-black text-white tracking-widest tabular-nums">{value}</h3>
    </motion.div>
  );
}

function SkillMetric({ label, level, color }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
        <span className="text-xs font-bold text-white tabular-nums">{level}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color} shadow-[0_0_15px_rgba(79,70,229,0.5)]`}
        />
      </div>
    </div>
  );
}
