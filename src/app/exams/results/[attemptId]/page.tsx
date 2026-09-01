"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Calendar,
  Clock,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { ExamReview } from "@/components/ExamReview";

export default function ExamResultsPage({ params }: { params: any }) {
  const router = useRouter();
  const { attemptId } = use(params) as { attemptId: string };
  const { user, loading: authLoading, isAdmin } = useAuth();

  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    // Written answers are graded after submission, so watch the document
    // rather than reading it once — feedback streams in as it lands.
    const unsubscribe = onSnapshot(
      doc(db, "exam_attempts", attemptId),
      (snap) => {
        if (!snap.exists()) {
          setError("Result not found.");
          setLoading(false);
          return;
        }

        const data = { id: snap.id, ...snap.data() } as any;

        if (data.user_id !== user!.uid && !isAdmin) {
          setUnauthorized(true);
          setLoading(false);
          return;
        }

        setAttempt(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error watching results:", err);
        setError("Failed to load results. Please try again.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [attemptId, user, authLoading, isAdmin, router]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-white">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">Retrieving your results</p>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-white">
        <ShieldAlert className="w-12 h-12 text-red-500 mb-5" />
        <h1 className="text-xl font-bold mb-2 text-zinc-900">Access denied</h1>
        <p className="text-zinc-500 max-w-sm mb-6 text-sm">You can only view your own exam performance data. If you believe this is an error, please contact support.</p>
        <Link href="/dashboard" className="px-6 py-3 bg-primary-600 text-white rounded-md font-semibold text-sm shadow-button hover:bg-primary-700 transition-colors">
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
        <AlertCircle className="w-12 h-12 text-red-500 mb-5" />
        <h1 className="text-xl font-bold mb-4 text-zinc-900">{error || "Something went wrong"}</h1>
        <Link href="/dashboard" className="px-6 py-3 bg-primary-600 text-white rounded-md font-semibold text-sm hover:bg-primary-700 transition-colors">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const breakdown = attempt.answers_json?.breakdown ?? [];
  const dateStr = attempt.attempted_at ? new Date(attempt.attempted_at).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }) : "Recent attempt";

  const timeStr = attempt.attempted_at ? new Date(attempt.attempted_at).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  }) : "";

  return (
    <div className="min-h-screen bg-zinc-50/40 pb-16 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          href="/dashboard/history"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-6 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to history
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 md:p-10 rounded-lg border border-zinc-200 shadow-xs"
        >
          <header className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold uppercase tracking-wider mb-4">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Attempt finalized
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight text-zinc-900 leading-tight">
              {attempt.exam_title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-500 text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {dateStr}
              </div>
              {timeStr && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {timeStr}
                </div>
              )}
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <ResultStat
              label="Final score"
              value={`${attempt.score}/${attempt.total_questions || attempt.total_marks || '?'}`}
              color="text-primary-600"
              subValue="Points"
            />
            <ResultStat
              label="Accuracy"
              value={`${Number(attempt.percentage || 0).toFixed(1)}%`}
              subValue="Percentage"
            />
            <ResultStat
              label="Time spent"
              value={formatDuration(attempt.time_spent_seconds || 0)}
              subValue="Duration"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-3 justify-center mb-10">
            <Link
              href={`/exams/${attempt.exam_id}/take`}
              className="px-6 py-3 bg-primary-600 text-white rounded-md font-semibold text-sm shadow-button hover:bg-primary-700 transition-colors text-center flex-1"
            >
              Retake exam
            </Link>
            <Link
              href="/exams"
              className="px-6 py-3 bg-white border border-zinc-200 text-zinc-700 rounded-md font-semibold text-sm hover:bg-zinc-50 transition-colors text-center flex-1"
            >
              Browse more exams
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-100" />
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 whitespace-nowrap">Detailed review</h2>
              <div className="h-px flex-1 bg-zinc-100" />
            </div>
            <ExamReview breakdown={breakdown} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ResultStat({ label, value, color = "text-zinc-900", subValue }: any) {
  return (
    <div className="p-6 bg-zinc-50 rounded-lg border border-zinc-200 text-center flex flex-col items-center justify-center">
      <div className={`text-2xl font-bold mb-1 tabular-nums ${color}`}>{value}</div>
      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">{label}</div>
      {subValue && <div className="text-[10px] text-zinc-400 font-semibold uppercase">{subValue}</div>}
    </div>
  );
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}
