"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, TrendingUp, Plus, ArrowRight, Users } from "lucide-react";
import Link from "next/link";

export default function ExaminerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ exams: 0, attempts: 0, avgScore: 0 });
  const [loading, setLoading] = useState(true);
  const [recentExams, setRecentExams] = useState<any[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
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

      const attemptsQ = query(
        collection(db, "exam_attempts"),
        where("exam_id", "in", myExamIds.slice(0, 10))
      );
      
      const attemptsSnap = await getDocs(attemptsQ);
      const allAttempts = attemptsSnap.docs
        .map(d => ({ id: d.id, ...d.data() as any }))
        .sort((a, b) => {
          const tA = a.attempted_at ? new Date(a.attempted_at).getTime() : 0;
          const tB = b.attempted_at ? new Date(b.attempted_at).getTime() : 0;
          return tB - tA;
        });
      
      let totalPct = 0;
      allAttempts.forEach(a => totalPct += Number(a.percentage) || 0);

      setStats({
        exams: myExams.length,
        attempts: allAttempts.length,
        avgScore: allAttempts.length > 0 ? Math.round(totalPct / allAttempts.length) : 0,
      });
      setRecentAttempts(allAttempts.slice(0, 5));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 bg-mesh min-h-screen text-slate-900 pt-8 pb-16 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Examiner <span className="text-indigo-600">Console</span></h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">Manage your curriculum and monitor student diagnostic growth.</p>
        </div>
        <Link href="/examiner/exams/new" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Create New Exam
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard title="My Authored Exams" value={loading ? "…" : stats.exams.toString()} icon={<BookOpen className="w-5 h-5 text-amber-600" />} bg="bg-amber-50" />
        <StatCard title="Total Student Attempts" value={loading ? "…" : stats.attempts.toString()} icon={<Users className="w-5 h-5 text-indigo-600" />} bg="bg-indigo-50" />
        <StatCard title="Class Average Accuracy" value={loading ? "…" : `${stats.avgScore}%`} icon={<TrendingUp className="w-5 h-5 text-emerald-600" />} bg="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Submissions */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Recent Student Submissions</h3>
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-black uppercase tracking-wider rounded-full">Live Feed</span>
          </div>
          <div className="divide-y divide-slate-100">
            {recentAttempts.length > 0 ? (
              recentAttempts.map(att => (
                <div key={att.id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                      {att.user_name?.split(" ").map((n: string) => n[0]).join("") || "S"}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">{att.user_name || "Student Aspirant"}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{att.exam_title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-sm ${Number(att.percentage) >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>{att.percentage}%</p>
                    <p className="text-[10px] text-slate-400 font-medium">{new Date(att.attempted_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                No submissions recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* My Exams List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Curriculum Question Banks</h3>
            <Link href="/exams" className="text-indigo-600 text-xs font-bold hover:underline">Explore All</Link>
          </div>
          <div className="p-4 space-y-2.5">
            {recentExams.map(exam => (
              <Link key={exam.id} href={`/exams/${exam.id}/take`} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl transition-all border border-slate-200 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">{exam.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{exam.category} · {exam.total_questions || 10} Questions</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bg }: any) {
  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${bg}`}>{icon}</div>
      <h3 className="text-slate-400 text-xs font-bold uppercase">{title}</h3>
      <div className="text-2xl font-black text-slate-900">{value}</div>
    </div>
  );
}
