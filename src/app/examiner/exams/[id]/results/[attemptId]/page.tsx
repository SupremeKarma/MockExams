"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  Loader2,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  PenLine,
  Sparkles,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { FormattedContent } from "@/components/FormattedContent";

interface Breakdown {
  questionId: string;
  type?: "mcq" | "written";
  question_text: string;
  marksAwarded: number;
  isCorrect: boolean;
  writtenAnswer?: string | null;
  modelAnswer?: string | null;
  aiFeedback?: string | null;
  attachmentUrls?: string[];
  teacherReviewed?: boolean;
  teacherFeedback?: string | null;
  selectedAnswer?: string | null;
  correctAnswer?: string;
}

export default function AttemptReviewPage({ params }: { params: any }) {
  const { id: examId, attemptId } = use(params) as { id: string; attemptId: string };
  const { user } = useAuth();
  const router = useRouter();

  const [exam, setExam] = useState<any>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [breakdown, setBreakdown] = useState<Breakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => { if (user) fetchData(); }, [examId, attemptId, user]);

  const fetchData = async () => {
    try {
      const examSnap = await getDoc(doc(db, "exams", examId));
      if (!examSnap.exists()) { router.push("/examiner/exams"); return; }
      const examData = { id: examSnap.id, ...examSnap.data() as any };
      if (!user || examData.created_by !== user.uid) { setUnauthorized(true); setLoading(false); return; }
      setExam(examData);

      const attSnap = await getDoc(doc(db, "exam_attempts", attemptId));
      if (!attSnap.exists()) { router.push(`/examiner/exams/${examId}/results`); return; }
      const attData = { id: attSnap.id, ...attSnap.data() as any };
      setAttempt(attData);
      setBreakdown(attData.answers_json?.breakdown || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateBreakdownItem = (idx: number, patch: Partial<Breakdown>) => {
    setBreakdown(prev => prev.map((b, i) => (i === idx ? { ...b, ...patch } : b)));
  };

  const saveReview = async () => {
    if (!attempt) return;
    setSaving(true);
    setSavedMsg(false);
    try {
      const newScore = breakdown.reduce((s, b) => s + (Number(b.marksAwarded) || 0), 0);
      const totalMarks = Number(attempt.total_marks) || 0;
      const newPercentage = totalMarks > 0 ? Math.round((newScore / totalMarks) * 10000) / 100 : 0;

      await updateDoc(doc(db, "exam_attempts", attemptId), {
        "answers_json.breakdown": breakdown,
        score: newScore,
        percentage: newPercentage,
      });
      setAttempt((prev: any) => ({ ...prev, score: newScore, percentage: newPercentage }));
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } catch (err) {
      console.error("Failed to save review:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (unauthorized) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShieldAlert className="w-16 h-16 text-rose-500 mb-6" />
      <h2 className="text-2xl font-bold mb-3">Not Your Exam</h2>
      <Link href="/examiner/exams" className="px-6 py-3 bg-primary text-white rounded-xl font-bold">Back to My Exams</Link>
    </div>
  );

  const writtenItems = breakdown.filter(b => b.type === "written");

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <Link href={`/examiner/exams/${examId}/results`} className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to results
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{attempt?.user_name || "Student"}</h1>
          <p className="text-zinc-500 text-sm mt-1">{exam?.title} — transcript review</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-zinc-900">{attempt?.score}/{attempt?.total_marks}</div>
          <div className="text-xs text-zinc-500">{Number(attempt?.percentage).toFixed(1)}%</div>
        </div>
      </div>

      {attempt?.integrity_signals && (
        <div className="p-4 rounded-lg border border-zinc-200 bg-white space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Session record
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <Signal
              label="Time taken"
              value={`${Math.round(attempt.integrity_signals.serverElapsedSeconds / 60)} min`}
              note="Measured by the server"
            />
            <Signal
              label="Tab switches"
              value={String(attempt.integrity_signals.blurCount)}
              note={
                attempt.integrity_signals.longestBlurSeconds > 0
                  ? `Longest ${attempt.integrity_signals.longestBlurSeconds}s away`
                  : "Stayed on the exam"
              }
            />
            <Signal
              label="Honour pledge"
              value={attempt.integrity_signals.honorAccepted ? "Accepted" : "Not accepted"}
              note="Agreed before starting"
            />
            <Signal
              label="Submitted"
              value={attempt.integrity_signals.lateSubmission ? "After time" : "In time"}
              note={
                attempt.integrity_signals.clientTimeMismatch
                  ? "Browser clock disagreed with server"
                  : "Clocks agreed"
              }
            />
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
            Context for your judgement, not an accusation. Switching tabs is usually a
            notification, not cheating — talk to the student before drawing conclusions.
          </p>
        </div>
      )}

      {writtenItems.length === 0 ? (
        <div className="glass-card p-10 rounded-xl border border-zinc-200 text-center text-zinc-500">
          No written/descriptive answers to review for this attempt.
        </div>
      ) : (
        <div className="space-y-5">
          {breakdown.map((item, idx) => {
            if (item.type !== "written") return null;
            return (
              <div key={item.questionId} className="bg-white p-5 rounded-lg border border-zinc-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-2 py-1 rounded-md ${item.isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                    {item.isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {item.isCorrect ? "Passed" : "Below threshold"}
                  </span>
                  {item.teacherReviewed && (
                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-blue-50 text-blue-700">Reviewed</span>
                  )}
                </div>

                <div className="text-sm sm:text-base font-semibold leading-relaxed text-zinc-900">
                  <FormattedContent content={item.question_text} size="lg" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1.5 text-zinc-500 font-bold text-[11px] uppercase tracking-wide">
                    <PenLine className="w-3.5 h-3.5" /> Student transcript
                  </div>
                  <div className="text-sm sm:text-base text-zinc-800 leading-relaxed p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                    {item.writtenAnswer && item.writtenAnswer.trim() ? (
                      <FormattedContent content={item.writtenAnswer} size="base" />
                    ) : (
                      <span className="text-zinc-400 italic font-mono text-sm">(left blank - no answer submitted)</span>
                    )}
                  </div>
                </div>

                {!!item.attachmentUrls?.length && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 text-zinc-500 font-bold text-[11px] uppercase tracking-wide">
                      <ImageIcon className="w-3.5 h-3.5" /> Attached diagrams ({item.attachmentUrls.length})
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {item.attachmentUrls.map(url => (
                        <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="block rounded-md overflow-hidden border border-zinc-200">
                          <img src={url} alt="Attached diagram" className="w-full h-24 object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {item.modelAnswer && (
                  <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50/70 via-primary-50/40 to-white rounded-xl border border-primary-200 shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-primary-200/60">
                      <div className="text-primary-800 font-bold text-xs sm:text-sm uppercase tracking-wider">
                        Model Answer / Benchmark Solution
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary-100 text-primary-800">
                        Full Marks Standard
                      </span>
                    </div>
                    <div className="text-sm sm:text-base text-zinc-800 leading-relaxed">
                      <FormattedContent content={item.modelAnswer} size="base" />
                    </div>
                  </div>
                )}

                {item.aiFeedback && (
                  <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs uppercase tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5" /> AI feedback
                    </div>
                    <div className="text-sm text-zinc-800 leading-relaxed">
                      <FormattedContent content={item.aiFeedback} size="sm" />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-3 items-start pt-2 border-t border-zinc-100">
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 block mb-1">Marks awarded</label>
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      value={item.marksAwarded}
                      onChange={e => updateBreakdownItem(idx, { marksAwarded: parseFloat(e.target.value) || 0, teacherReviewed: true })}
                      className="w-full p-2 border border-zinc-200 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 block mb-1">Teacher feedback</label>
                    <textarea
                      rows={2}
                      value={item.teacherFeedback || ""}
                      onChange={e => updateBreakdownItem(idx, { teacherFeedback: e.target.value, teacherReviewed: true })}
                      placeholder="Add feedback the student will see..."
                      className="w-full p-2 border border-zinc-200 rounded-md text-sm resize-none"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {writtenItems.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={saveReview}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-full font-semibold text-sm shadow-lg transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {savedMsg ? "Saved!" : "Save review"}
          </button>
        </div>
      )}
    </div>
  );
}

function Signal({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="space-y-0.5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">{label}</div>
      <div className="text-sm font-bold text-zinc-900">{value}</div>
      <div className="text-[11px] text-zinc-400">{note}</div>
    </div>
  );
}
