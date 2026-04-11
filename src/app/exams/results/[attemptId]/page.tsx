"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  ShieldAlert
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

    async function fetchResult() {
      try {
        const attemptRef = doc(db, "exam_attempts", attemptId);
        const attemptSnap = await getDoc(attemptRef);

        if (!attemptSnap.exists()) {
          setError("Result not found.");
          return;
        }

        const data = attemptSnap.id ? { id: attemptSnap.id, ...attemptSnap.data() } : attemptSnap.data();
        
        // Security check: only owner or admin can see results
        if (!user || (data.user_id !== user.uid && !isAdmin)) {
           setUnauthorized(true);
           return;
        }

        setAttempt(data);
      } catch (err: any) {
        console.error("Error fetching results:", err);
        setError("Failed to load results. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [attemptId, user, authLoading, isAdmin, router]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-400 font-medium tracking-wide">Retrieving your performance data...</p>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-mesh">
        <ShieldAlert className="w-16 h-16 text-rose-500 mb-6" />
        <h1 className="text-3xl font-black mb-3 text-white">Access Denied</h1>
        <p className="text-slate-400 max-w-sm mb-8">You can only view your own exam performance data. If you believe this is an error, please contact support.</p>
        <Link href="/dashboard" className="px-10 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-mesh">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-white">{error || "Something went wrong"}</h1>
        <Link href="/dashboard" className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all">
          Back to Dashboard
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
  }) : "Recent Attempt";
  
  const timeStr = attempt.attempted_at ? new Date(attempt.attempted_at).toLocaleTimeString("en-US", { 
    hour: "2-digit", 
    minute: "2-digit" 
  }) : "";

  return (
    <div className="min-h-screen bg-mesh pb-20 pt-24">
      <div className="max-w-4xl mx-auto px-6">
        <Link 
          href="/dashboard/history" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to History
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/10"
        >
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-6">
              <CheckCircle2 className="w-4 h-4" />
              Attempt Finalized
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-white leading-tight">
              {attempt.exam_title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 font-medium text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {dateStr}
              </div>
              {timeStr && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {timeStr}
                </div>
              )}
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <ResultStat 
              label="Final Score" 
              value={`${attempt.score}/${attempt.total_questions || attempt.total_marks || '?'}`} 
              color="text-primary" 
              subValue="Points"
            />
            <ResultStat 
              label="Accuracy" 
              value={`${Number(attempt.percentage || 0).toFixed(1)}%`} 
              subValue="Percentage"
            />
            <ResultStat 
              label="Time Spent" 
              value={formatDuration(attempt.time_spent_seconds || 0)} 
              subValue="Duration"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/exams" 
              className="px-10 py-4 bg-white text-black rounded-2xl font-black hover:bg-slate-200 transition-all text-center flex-1 active:scale-[0.98] shadow-xl"
            >
              Take Another Exam
            </Link>
            <button 
              onClick={() => window.print()}
              className="px-10 py-4 glass border-white/10 text-white rounded-2xl font-black hover:bg-white/5 transition-all text-center flex-1 active:scale-[0.98]"
            >
              Download Report
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-white/5" />
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 whitespace-nowrap">Detailed Review</h2>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <ExamReview breakdown={breakdown} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ResultStat({ label, value, color = "text-white", subValue }: any) {
  return (
    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center flex flex-col items-center justify-center transition-all hover:bg-white/[0.07] hover:border-white/20 group">
      <div className={`text-3xl font-black mb-1 transition-transform group-hover:scale-110 duration-500 ${color}`}>{value}</div>
      <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">{label}</div>
      {subValue && <div className="text-[10px] text-slate-600 font-bold uppercase">{subValue}</div>}
    </div>
  );
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}
