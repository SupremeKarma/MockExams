"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, Target, TrendingUp, Plus, Brain, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ExaminerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ exams: 0, attempts: 0, avgScore: 0 });
  const [loading, setLoading] = useState(true);
  const [recentExams, setRecentExams] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      // My exams
      const examsSnap = await getDocs(
        query(collection(db, "exams"), where("created_by", "==", user!.uid))
      );
      const myExams = examsSnap.docs.map(d => ({ id: d.id, ...d.data() as any }));
      setRecentExams(myExams.slice(0, 5));

      const myExamIds = myExams.map(e => e.id);
      if (myExamIds.length === 0) {
        setStats({ exams: 0, attempts: 0, avgScore: 0 });
        setRecentAttempts([]);
        return;
      }

      // Latest attempts across my exams - Global View for Examiner
      const attemptsQ = query(
        collection(db, "exam_attempts"),
        where("exam_id", "in", myExamIds.slice(0, 10)), // Firestore limit
        orderBy("attempted_at", "desc")
      );
      
      const attemptsSnap = await getDocs(attemptsQ);
      const allAttempts = attemptsSnap.docs.map(d => ({ id: d.id, ...d.data() as any }));
      
      let totalPct = 0;
      allAttempts.forEach(a => totalPct += Number(a.percentage) || 0);

      setStats({
        exams: myExams.length,
        attempts: allAttempts.length, // This is just the slice for now
        avgScore: allAttempts.length > 0 ? Math.round(totalPct / allAttempts.length) : 0,
      });
      setRecentAttempts(allAttempts.slice(0, 5));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Examiner <span className="text-primary">Console</span></h1>
          <p className="text-slate-400 font-medium">Manage your curriculum and monitor student growth.</p>
        </div>
        <Link href="/examiner/exams/new" className="px-6 py-3 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all">
          <Plus className="w-5 h-5" /> New Exam
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="My Exams" value={loading ? "…" : stats.exams.toString()} icon={<BookOpen className="w-6 h-6" />} color="text-amber-400" bg="bg-amber-400/10" />
        <StatCard title="Total Students" value={loading ? "…" : stats.attempts.toString()} icon={<Users className="w-6 h-6" />} color="text-primary" bg="bg-primary/10" />
        <StatCard title="Global Average" value={loading ? "…" : `${stats.avgScore}%`} icon={<TrendingUp className="w-6 h-6" />} color="text-emerald-400" bg="bg-emerald-400/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Submissions */}
        <div className="glass-card rounded-[2rem] border border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <h3 className="font-black text-xl">Recent Submissions</h3>
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Live Feed</span>
          </div>
          <div className="divide-y divide-white/5">
            {recentAttempts.length > 0 ? (
              recentAttempts.map(att => (
                <div key={att.id} className="p-6 hover:bg-white/[0.02] transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs">
                      {att.user_name?.split(" ").map((n: string) => n[0]).join("") || "S"}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{att.user_name || "Anonymous Student"}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{att.exam_title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black ${Number(att.percentage) >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>{att.percentage}%</p>
                    <p className="text-[10px] text-slate-500 font-medium">{new Date(att.attempted_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center text-slate-500 font-medium italic">
                No submissions yet. Share your exams!
              </div>
            )}
          </div>
        </div>

        {/* My Exams List */}
        <div className="glass-card rounded-[2rem] border border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-black text-xl">Top Quality Exams</h3>
            <Link href="/examiner/exams" className="text-primary text-xs font-bold hover:underline">View All</Link>
          </div>
          <div className="p-4 space-y-3">
            {recentExams.map(exam => (
              <Link key={exam.id} href={`/examiner/exams/${exam.id}/results`} className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="w-6 h-6 text-slate-400 group-hover:text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-tight">{exam.title}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{exam.category} · {exam.total_questions} Qs</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-all translate-x-0 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, bg }: any) {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${bg} ${color}`}>{icon}</div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <div className="text-3xl font-black">{value}</div>
    </div>
  );
}
