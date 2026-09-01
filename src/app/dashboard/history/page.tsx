"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
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
        where("user_id", "==", user.uid)
      )
    ).then(snap => {
      const sorted = snap.docs
        .map(d => ({ id: d.id, ...d.data() as any }))
        .sort((a, b) => {
          const tA = a.attempted_at ? new Date(a.attempted_at).getTime() : 0;
          const tB = b.attempted_at ? new Date(b.attempted_at).getTime() : 0;
          return tB - tA;
        });
      setAttempts(sorted);
    }).catch(console.error).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

  return (
    <div className="min-h-screen bg-zinc-50/40 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>

        <h1 className="text-xl font-bold text-zinc-900">Exam history</h1>

        {attempts.length === 0 ? (
          <div className="bg-white p-12 rounded-lg border border-zinc-200 text-center text-zinc-500">
            <TrendingUp className="w-10 h-10 mx-auto mb-3 text-zinc-300" />
            <p className="text-sm font-medium text-zinc-900">No attempts yet.</p>
            <p className="text-xs mt-1">Take your first exam to see your history here.</p>
            <Link href="/exams" className="mt-5 inline-block px-5 py-2.5 bg-primary-600 text-white rounded-md font-semibold text-sm hover:bg-primary-700 transition-colors">
              Browse exams
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {attempts.map(att => (
              <Link
                key={att.id}
                href={`/exams/results/${att.id}`}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-zinc-200 hover:border-primary-300 transition-colors group shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center ${
                    Number(att.percentage) >= 80 ? "bg-emerald-50 text-emerald-600" :
                    Number(att.percentage) >= 50 ? "bg-amber-50 text-amber-600" :
                    "bg-red-50 text-red-600"
                  }`}>
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{att.exam_title || "Exam"}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {att.score}/{att.total_marks} marks ·{" "}
                      {att.attempted_at ? new Date(att.attempted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className={`text-sm font-bold tabular-nums ${
                    Number(att.percentage) >= 80 ? "text-emerald-600" :
                    Number(att.percentage) >= 50 ? "text-amber-600" : "text-red-600"
                  }`}>
                    {Number(att.percentage).toFixed(1)}%
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
