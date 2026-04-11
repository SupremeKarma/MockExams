"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, TrendingUp, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getDocs(
      query(
        collection(db, "exam_attempts"),
        where("user_id", "==", user.uid),
        orderBy("attempted_at", "desc")
      )
    ).then(snap => {
      setAttempts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }).catch(console.error).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold">Exam History</h1>

      {attempts.length === 0 ? (
        <div className="glass-card p-16 rounded-3xl border border-white/10 text-center text-slate-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No attempts yet.</p>
          <p className="text-sm mt-1">Take your first exam to see your history here.</p>
          <Link href="/exams" className="mt-6 inline-block px-6 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all">
            Browse Exams
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {attempts.map(att => (
            <Link
              key={att.id}
              href={`/exams/results/${att.id}`}
              className="flex items-center justify-between p-5 glass-card rounded-2xl border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  Number(att.percentage) >= 80 ? "bg-emerald-500/20 text-emerald-400" :
                  Number(att.percentage) >= 50 ? "bg-amber-500/20 text-amber-400" :
                  "bg-rose-500/20 text-rose-400"
                }`}>
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold group-hover:text-white transition-colors">{att.exam_title || "Exam"}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {att.score}/{att.total_marks} marks ·{" "}
                    {att.attempted_at ? new Date(att.attempted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-lg font-black ${
                  Number(att.percentage) >= 80 ? "text-emerald-400" :
                  Number(att.percentage) >= 50 ? "text-amber-400" : "text-rose-400"
                }`}>
                  {Number(att.percentage).toFixed(1)}%
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
