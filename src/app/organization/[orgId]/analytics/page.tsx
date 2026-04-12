"use client";

import { useState, useEffect, use } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { BarChart2, TrendingUp, Users, Award, ArrowLeft, Loader2, Target, Zap, Activity } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function OrgAnalyticsPage({ params }: { params: any }) {
  const { orgId } = use(params) as { orgId: string };
  const [exams, setExams] = useState<any[]>([]);
  const [examStats, setExamStats] = useState<any[]>([]);
  const [topStudents, setTopStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [orgId]);

  const fetchData = async () => {
    try {
      const examsSnap = await getDocs(query(collection(db, "exams"), where("org_id", "==", orgId)));
      const orgExams = examsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
      setExams(orgExams);

      const statsPromises = orgExams.map(async (exam) => {
        const attSnap = await getDocs(query(
          collection(db, "exam_attempts"),
          where("exam_id", "==", exam.id)
        ));
        const attempts = attSnap.docs.map((d: any) => d.data());
        const count = attempts.length;
        const avgPct = count > 0
          ? Math.round(attempts.reduce((s, a) => s + (typeof a.percentage === "number" ? a.percentage : Number(a.percentage || 0)), 0) / count)
          : 0;
        return { examId: exam.id, title: exam.title, count, avgPct };
      });

      const stats = await Promise.all(statsPromises);
      setExamStats(stats.filter(s => s.count > 0).sort((a, b) => b.count - a.count));

      const allAttempts: any[] = [];
      for (const stat of stats) {
        const attSnap = await getDocs(query(
          collection(db, "exam_attempts"),
          where("exam_id", "==", stat.examId),
          orderBy("percentage", "desc")
        ));
        attSnap.docs.forEach((d: any) => allAttempts.push(d.data()));
      }

      const userMap: Record<string, { name: string; bestPct: number; attempts: number }> = {};
      allAttempts.forEach(a => {
        if (!userMap[a.user_id]) {
          userMap[a.user_id] = { name: a.user_name || "Student", bestPct: 0, attempts: 0 };
        }
        userMap[a.user_id].attempts++;
        const pct = typeof a.percentage === "number" ? a.percentage : Number(a.percentage || 0);
        userMap[a.user_id].bestPct = Math.max(userMap[a.user_id].bestPct, pct);
      });

      const sorted = Object.entries(userMap)
        .map(([uid, v]) => ({ uid, ...v }))
        .sort((a, b) => b.bestPct - a.bestPct)
        .slice(0, 10);

      setTopStudents(sorted);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="text-slate-500 font-bold animate-pulse text-sm uppercase tracking-widest">Compiling Analytics Data...</p>
    </div>
  );

  const totalAttempts = examStats.reduce((s, e) => s + e.count, 0);
  const overallAvg = examStats.length > 0
    ? Math.round(examStats.reduce((s, e) => s + e.avgPct, 0) / examStats.length)
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-10 px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/5">
        <div className="space-y-4">
          <Link href={`/organization/${orgId}`} className="inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
            <ArrowLeft className="w-4 h-4" /> Command Dashboard
          </Link>
          <div>
            <h1 className="text-5xl font-black tracking-tight flex items-center gap-4">
              Intelligence <span className="text-primary italic">Matrix</span>
            </h1>
            <p className="text-slate-400 font-medium max-w-lg mt-2">Comprehensive performance metrics, student achievement tracking, and institutional health diagnostics.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Telemetry Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsStatCard icon={<Target className="w-6 h-6" />} label="Active Assets" value={exams.length} suffix="Exams" color="text-primary" bg="bg-primary/10" />
        <AnalyticsStatCard icon={<Users className="w-6 h-6" />} label="Total Engagement" value={totalAttempts} suffix="Attempts" color="text-emerald-400" bg="bg-emerald-400/10" />
        <AnalyticsStatCard icon={<TrendingUp className="w-6 h-6" />} label="Success Vector" value={`${overallAvg}%`} suffix="Avg Score" color="text-amber-400" bg="bg-amber-400/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
        {/* Exam performance */}
        {examStats.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight">Performance <span className="text-slate-500">Breakdown</span></h2>
              <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                <BarChart2 className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            
            <div className="glass-card rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-8 py-6">Knowledge Module</th>
                      <th className="px-8 py-6 text-center">Attempts</th>
                      <th className="px-8 py-6 text-center">Efficiency</th>
                      <th className="px-8 py-6">Trajectory</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {examStats.map((s, idx) => (
                      <motion.tr 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={s.examId} 
                        className="hover:bg-white/[0.02] group transition-all"
                      >
                        <td className="px-8 py-6">
                          <p className="font-black text-sm tracking-tight group-hover:text-primary transition-colors">{s.title}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Reference ID: {s.examId.slice(0, 8)}</p>
                        </td>
                        <td className="px-8 py-6 text-center font-black text-slate-300">{s.count}</td>
                        <td className="px-8 py-6 text-center">
                          <span className={`text-sm font-black ${s.avgPct >= 70 ? "text-emerald-400" : s.avgPct >= 50 ? "text-amber-400" : "text-rose-400"}`}>
                            {s.avgPct}%
                          </span>
                        </td>
                        <td className="px-8 py-6 min-w-[200px]">
                          <div className="flex items-center gap-4">
                            <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${s.avgPct}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full shadow-lg ${s.avgPct >= 70 ? "bg-emerald-500 shadow-emerald-500/20" : s.avgPct >= 50 ? "bg-amber-500 shadow-amber-500/20" : "bg-rose-500 shadow-rose-500/20"}`}
                              />
                            </div>
                            {s.avgPct >= 70 ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingUp className="w-4 h-4 text-rose-400 rotate-180" />}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card p-24 rounded-[3rem] border border-white/10 text-center flex flex-col items-center gap-6 bg-gradient-to-br from-white/[0.02] to-transparent">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center opacity-30 grayscale">
              <Zap className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Awaiting Data Inflow</h3>
              <p className="text-slate-500 font-medium max-w-sm">Performance metrics will automatically populate once students complete their initial assessment cycles.</p>
            </div>
          </div>
        )}

        {/* Top students grid/list */}
        {topStudents.length > 0 && (
          <div className="space-y-6">
             <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight">Institutional <span className="text-primary italic">Elite</span></h2>
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topStudents.map((s, idx) => (
                <motion.div 
                  key={s.uid}
                  whileHover={{ y: -5 }}
                  className="glass-card p-6 rounded-[2rem] border border-white/10 flex items-center gap-5 relative overflow-hidden group"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 bg-gradient-to-br transition-all group-hover:scale-150 ${idx === 0 ? 'from-amber-400' : idx === 1 ? 'from-slate-300' : 'from-primary'}`} />
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${idx === 0 ? 'bg-amber-400/20 text-amber-400 border border-amber-400/20' : idx === 1 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/20' : 'bg-primary/20 text-primary border border-primary/20'}`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-black text-lg group-hover:text-primary transition-colors">{s.name}</h4>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.attempts} Cycles</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{s.bestPct.toFixed(1)}% Peak</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AnalyticsStatCard({ icon, label, value, suffix, color, bg }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent shadow-xl"
    >
      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-2xl ${bg} ${color}`}>{icon}</div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black tracking-tighter">{value}</span>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{suffix}</span>
      </div>
    </motion.div>
  );
}
