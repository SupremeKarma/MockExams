"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Loader2, ShieldAlert, Users, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export default function ExamResultsPage({ params }: { params: any }) {
  const { id: examId } = use(params) as { id: string };
  const { user } = useAuth();
  const router = useRouter();

  const [exam, setExam] = useState<any>(null);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => { if (user) fetchData(); }, [examId, user]);

  const fetchData = async () => {
    try {
      const examSnap = await getDoc(doc(db, "exams", examId));
      if (!examSnap.exists()) { router.push("/examiner/exams"); return; }
      const examData = { id: examSnap.id, ...examSnap.data() as any };
      if (!user || examData.created_by !== user.uid) { setUnauthorized(true); setLoading(false); return; }
      setExam(examData);

      const attSnap = await getDocs(query(
        collection(db, "exam_attempts"),
        where("exam_id", "==", examId)
      ));
      const sortedAttempts = attSnap.docs
        .map(d => ({ id: d.id, ...d.data() as any }))
        .sort((a, b) => {
          const tA = a.attempted_at ? new Date(a.attempted_at).getTime() : 0;
          const tB = b.attempted_at ? new Date(b.attempted_at).getTime() : 0;
          return tB - tA;
        });
      setAttempts(sortedAttempts);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (unauthorized) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShieldAlert className="w-16 h-16 text-rose-500 mb-6" />
      <h2 className="text-2xl font-bold mb-3">Not Your Exam</h2>
      <Link href="/examiner/exams" className="px-6 py-3 bg-primary text-white rounded-xl font-bold">Back to My Exams</Link>
    </div>
  );

  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((s, a) => s + Number(a.percentage || 0), 0) / attempts.length)
    : 0;

  const avgTime = attempts.length > 0
    ? Math.round(attempts.reduce((s, a) => s + Number(a.time_spent_seconds || 0), 0) / attempts.length)
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link href={`/examiner/exams/${examId}`} className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Exam
      </Link>

      <div>
        <h1 className="text-2xl font-bold">{exam?.title}</h1>
        <p className="text-zinc-500 text-sm mt-1">Student attempt results</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Users className="w-6 h-6" />} label="Total Attempts" value={attempts.length.toString()} color="text-primary" bg="bg-primary/10" />
        <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Avg Score" value={`${avgScore}%`} color="text-emerald-700" bg="bg-emerald-50" />
        <StatCard icon={<Clock className="w-6 h-6" />} label="Avg Time" value={`${Math.floor(avgTime / 60)}m ${avgTime % 60}s`} color="text-amber-700" bg="bg-amber-50" />
      </div>

      {/* Attempts Table */}
      {attempts.length === 0 ? (
        <div className="glass-card p-16 rounded-xl border border-zinc-200 text-center text-zinc-500">
          <p className="font-medium">No attempts yet.</p>
          <p className="text-sm mt-1">Students haven&apos;t taken this exam yet.</p>
        </div>
      ) : (
        <div className="glass-card rounded-lg border border-zinc-200 overflow-x-auto">
          <table className="w-full text-left min-w-[560px]">
            <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-widest">
              <tr>
                <th className="p-5">Student</th>
                <th className="p-5">Score</th>
                <th className="p-5">Percentage</th>
                <th className="p-5">Time</th>
                <th className="p-5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {attempts.map(att => (
                <tr key={att.id} className="hover:bg-zinc-100 transition-colors cursor-pointer" onClick={() => router.push(`/examiner/exams/${examId}/results/${att.id}`)}>
                  <td className="p-5 font-medium">{att.user_name || "Student"}</td>
                  <td className="p-5 text-zinc-600">{att.score}/{att.total_marks}</td>
                  <td className="p-5">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${Number(att.percentage) >= 80 ? "bg-emerald-50 text-emerald-700" : Number(att.percentage) >= 50 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>
                      {Number(att.percentage).toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-5 text-zinc-500 text-sm">
                    {Math.floor((att.time_spent_seconds || 0) / 60)}m {(att.time_spent_seconds || 0) % 60}s
                  </td>
                  <td className="p-5 text-zinc-500 text-sm">
                    {att.attempted_at ? new Date(att.attempted_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color, bg }: any) {
  return (
    <div className="glass-card p-6 rounded-lg border border-zinc-200">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${bg} ${color}`}>{icon}</div>
      <h3 className="text-zinc-500 text-sm font-medium mb-1">{label}</h3>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}
