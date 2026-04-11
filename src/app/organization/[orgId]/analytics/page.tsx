"use client";

import { useState, useEffect, use } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { BarChart2, TrendingUp, Users, Award, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function OrgAnalyticsPage({ params }: { params: any }) {
  const { orgId } = use(params) as { orgId: string };
  const [exams, setExams] = useState<any[]>([]);
  const [examStats, setExamStats] = useState<any[]>([]);
  const [topStudents, setTopStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [orgId]);

  const fetchData = async () => {
    try {
      // Get all org exams
      const examsSnap = await getDocs(query(collection(db, "exams"), where("org_id", "==", orgId)));
      const orgExams = examsSnap.docs.map(d => ({ id: d.id, ...d.data() as any }));
      setExams(orgExams);

      // For each exam, get attempt stats
      const statsPromises = orgExams.map(async exam => {
        const attSnap = await getDocs(query(
          collection(db, "exam_attempts"),
          where("exam_id", "==", exam.id)
        ));
        const attempts = attSnap.docs.map(d => d.data() as any);
        const count = attempts.length;
        const avgPct = count > 0
          ? Math.round(attempts.reduce((s, a) => s + Number(a.percentage || 0), 0) / count)
          : 0;
        return { examId: exam.id, title: exam.title, count, avgPct };
      });

      const stats = await Promise.all(statsPromises);
      setExamStats(stats.filter(s => s.count > 0).sort((a, b) => b.count - a.count));

      // Aggregate top students across all org exams
      const allAttempts: any[] = [];
      for (const stat of stats) {
        const attSnap = await getDocs(query(
          collection(db, "exam_attempts"),
          where("exam_id", "==", stat.examId),
          orderBy("percentage", "desc")
        ));
        attSnap.docs.forEach(d => allAttempts.push(d.data()));
      }

      // Group by user, take best percentage per user
      const userMap: Record<string, { name: string; bestPct: number; attempts: number }> = {};
      allAttempts.forEach(a => {
        if (!userMap[a.user_id]) {
          userMap[a.user_id] = { name: a.user_name || "Student", bestPct: 0, attempts: 0 };
        }
        userMap[a.user_id].attempts++;
        userMap[a.user_id].bestPct = Math.max(userMap[a.user_id].bestPct, Number(a.percentage || 0));
      });

      const sorted = Object.entries(userMap)
        .map(([uid, v]) => ({ uid, ...v }))
        .sort((a, b) => b.bestPct - a.bestPct)
        .slice(0, 10);

      setTopStudents(sorted);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const totalAttempts = examStats.reduce((s, e) => s + e.count, 0);
  const overallAvg = examStats.length > 0
    ? Math.round(examStats.reduce((s, e) => s + e.avgPct, 0) / examStats.length)
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <Link href={`/organization/${orgId}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-400/20 flex items-center justify-center">
          <BarChart2 className="text-amber-400 w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Organization Analytics</h1>
          <p className="text-slate-400 text-sm">Performance overview across all organization exams</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<BarChart2 className="w-6 h-6" />} label="Active Exams" value={exams.length.toString()} color="text-primary" bg="bg-primary/10" />
        <StatCard icon={<Users className="w-6 h-6" />} label="Total Attempts" value={totalAttempts.toString()} color="text-emerald-400" bg="bg-emerald-400/10" />
        <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Overall Avg Score" value={`${overallAvg}%`} color="text-amber-400" bg="bg-amber-400/10" />
      </div>

      {/* Per-exam table */}
      {examStats.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Exam Performance</h2>
          <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest">
                <tr>
                  <th className="p-5">Exam</th>
                  <th className="p-5">Attempts</th>
                  <th className="p-5">Avg Score</th>
                  <th className="p-5">Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {examStats.map(s => (
                  <tr key={s.examId} className="hover:bg-white/[0.02]">
                    <td className="p-5 font-medium">{s.title}</td>
                    <td className="p-5 text-slate-400">{s.count}</td>
                    <td className="p-5">
                      <span className={`text-sm font-bold ${s.avgPct >= 70 ? "text-emerald-400" : s.avgPct >= 50 ? "text-amber-400" : "text-rose-400"}`}>
                        {s.avgPct}%
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${s.avgPct >= 70 ? "bg-emerald-500" : s.avgPct >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                          style={{ width: `${s.avgPct}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top students */}
      {topStudents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" /> Top Performers
          </h2>
          <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest">
                <tr>
                  <th className="p-5 w-12">Rank</th>
                  <th className="p-5">Student</th>
                  <th className="p-5">Exams Taken</th>
                  <th className="p-5">Best Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topStudents.map((s, idx) => (
                  <tr key={s.uid} className="hover:bg-white/[0.02]">
                    <td className="p-5">
                      <span className={`text-sm font-black ${idx === 0 ? "text-amber-400" : idx === 1 ? "text-slate-300" : idx === 2 ? "text-amber-700" : "text-slate-500"}`}>
                        #{idx + 1}
                      </span>
                    </td>
                    <td className="p-5 font-medium">{s.name}</td>
                    <td className="p-5 text-slate-400">{s.attempts}</td>
                    <td className="p-5">
                      <span className={`text-sm font-bold ${s.bestPct >= 80 ? "text-emerald-400" : s.bestPct >= 60 ? "text-amber-400" : "text-slate-400"}`}>
                        {s.bestPct.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {examStats.length === 0 && (
        <div className="glass-card p-16 rounded-3xl border border-white/10 text-center text-slate-500">
          <BarChart2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No data yet.</p>
          <p className="text-sm mt-1">Analytics will appear once students start taking your organization's exams.</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color, bg }: any) {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${bg} ${color}`}>{icon}</div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{label}</h3>
      <div className="text-3xl font-black">{value}</div>
    </div>
  );
}
