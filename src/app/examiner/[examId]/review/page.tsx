"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  ShieldAlert,
  Clock,
  User,
  Check,
  FileText,
  Filter,
} from "lucide-react";
import Link from "next/link";

interface ReviewQuestion {
  id: string;
  question_text: string;
  type?: "mcq" | "written" | string;
  marks?: number;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_option?: string;
  model_answer?: string;
  reviewStatus?: "pending" | "approved" | "rejected";
  unclear?: boolean;
}

export default function ExaminerReviewQueuePage({ params }: { params: any }) {
  const { examId } = use(params) as { examId: string };
  const { user, isExaminer, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [pendingAttempts, setPendingAttempts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"questions" | "attempts">("questions");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || (!isExaminer && !isAdmin)) {
      router.push("/examiner");
      return;
    }
    fetchReviewData();
  }, [examId, user, isExaminer, isAdmin, authLoading]);

  const fetchReviewData = async () => {
    setLoading(true);
    try {
      // 1. Fetch exam details
      const examSnap = await getDoc(doc(db, "exams", examId));
      if (!examSnap.exists()) {
        router.push("/examiner");
        return;
      }
      setExam({ id: examSnap.id, ...examSnap.data() });

      // 2. Fetch questions for this exam
      const questionsSnap = await getDocs(
        query(collection(db, "questions"), where("exam_id", "==", examId))
      );
      let qList: ReviewQuestion[] = questionsSnap.docs.map((d) => ({
        id: d.id,
        reviewStatus: d.data().reviewStatus || "pending",
        ...(d.data() as Omit<ReviewQuestion, "id">),
      }));

      // If empty, also check subcollection `exams/{examId}/questions`
      if (qList.length === 0) {
        const subSnap = await getDocs(collection(db, "exams", examId, "questions"));
        qList = subSnap.docs.map((d) => ({
          id: d.id,
          reviewStatus: d.data().reviewStatus || "pending",
          ...(d.data() as Omit<ReviewQuestion, "id">),
        }));
      }
      setQuestions(qList);

      // 3. Fetch pending attempts requiring teacher grading
      const attemptsSnap = await getDocs(
        query(
          collection(db, "exam_attempts"),
          where("exam_id", "==", examId),
          where("grading_status", "==", "pending")
        )
      );
      setPendingAttempts(attemptsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error loading review queue:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    questionId: string,
    newStatus: "approved" | "rejected"
  ) => {
    setUpdatingId(questionId);
    try {
      // Try updating in `questions/{id}`, fallback to `exams/{examId}/questions/{id}`
      const qRef = doc(db, "questions", questionId);
      const qSnap = await getDoc(qRef);

      if (qSnap.exists()) {
        await updateDoc(qRef, {
          reviewStatus: newStatus,
          reviewedAt: serverTimestamp(),
          reviewedBy: user?.uid,
        });
      } else {
        const subRef = doc(db, "exams", examId, "questions", questionId);
        await updateDoc(subRef, {
          reviewStatus: newStatus,
          reviewedAt: serverTimestamp(),
          reviewedBy: user?.uid,
        });
      }

      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, reviewStatus: newStatus } : q))
      );
    } catch (err) {
      console.error("Failed to update question review status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (statusFilter === "all") return true;
    return q.reviewStatus === statusFilter;
  });

  const pendingCount = questions.filter((q) => q.reviewStatus !== "approved").length;
  const approvedCount = questions.filter((q) => q.reviewStatus === "approved").length;

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation back */}
        <Link
          href={`/examiner/exams/${examId}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Exam Details
        </Link>

        {/* Header Banner */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-primary-50 text-primary-700 text-xs font-bold">
                Examiner Review Queue
              </span>
              {exam?.course_id && (
                <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-xs font-bold">
                  Course: {exam.course_id}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 mt-2">{exam?.title}</h1>
            <p className="text-xs text-zinc-500 mt-1">
              Verify extracted questions for accuracy and evaluate written answer submissions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-center">
              <span className="text-lg font-bold text-zinc-900 block">{questions.length}</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Questions</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="text-lg font-bold text-emerald-700 block">{approvedCount}</span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase">Approved</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <span className="text-lg font-bold text-amber-700 block">{pendingCount}</span>
              <span className="text-[10px] text-amber-600 font-bold uppercase">Pending</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-3">
          <button
            onClick={() => setActiveTab("questions")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "questions"
                ? "bg-zinc-900 text-white shadow-sm"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            <FileText className="w-4 h-4" />
            Questions Queue ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab("attempts")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "attempts"
                ? "bg-zinc-900 text-white shadow-sm"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            <User className="w-4 h-4" />
            Written Submissions ({pendingAttempts.length})
          </button>
        </div>

        {activeTab === "questions" ? (
          <div className="space-y-4">
            {/* Filter buttons */}
            <div className="flex items-center gap-2 text-xs font-medium">
              <Filter className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-bold text-zinc-400">Filter:</span>
              {(["all", "pending", "approved", "rejected"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                    statusFilter === filter
                      ? "bg-primary-600 text-white font-bold"
                      : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="p-12 text-center bg-white border border-zinc-200 rounded-2xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-zinc-800">No questions match this filter</h3>
                <p className="text-xs text-zinc-500 mt-1">All filtered questions have been processed.</p>
              </div>
            ) : (
              filteredQuestions.map((q, idx) => {
                const isApproved = q.reviewStatus === "approved";
                const isRejected = q.reviewStatus === "rejected";
                const isUpdating = updatingId === q.id;

                return (
                  <div
                    key={q.id}
                    className={`bg-white border rounded-2xl p-6 shadow-xs space-y-4 transition-all ${
                      isApproved
                        ? "border-emerald-200 bg-emerald-50/10"
                        : isRejected
                        ? "border-rose-200 bg-rose-50/10"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-400">Q{idx + 1}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-100 text-zinc-700">
                            {q.type || "mcq"}
                          </span>
                          <span className="text-xs font-semibold text-zinc-500">
                            {q.marks || 1} Mark(s)
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-zinc-900 leading-relaxed mt-1">
                          {q.question_text}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isApproved ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Approved
                          </span>
                        ) : isRejected ? (
                          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Rejected
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Pending Review
                          </span>
                        )}
                      </div>
                    </div>

                    {/* MCQ Options Display */}
                    {q.option_a && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className={`p-2.5 rounded-lg border ${q.correct_option === "a" ? "bg-emerald-50 border-emerald-300 font-bold" : "bg-zinc-50 border-zinc-200"}`}>
                          A. {q.option_a}
                        </div>
                        <div className={`p-2.5 rounded-lg border ${q.correct_option === "b" ? "bg-emerald-50 border-emerald-300 font-bold" : "bg-zinc-50 border-zinc-200"}`}>
                          B. {q.option_b}
                        </div>
                        <div className={`p-2.5 rounded-lg border ${q.correct_option === "c" ? "bg-emerald-50 border-emerald-300 font-bold" : "bg-zinc-50 border-zinc-200"}`}>
                          C. {q.option_c}
                        </div>
                        <div className={`p-2.5 rounded-lg border ${q.correct_option === "d" ? "bg-emerald-50 border-emerald-300 font-bold" : "bg-zinc-50 border-zinc-200"}`}>
                          D. {q.option_d}
                        </div>
                      </div>
                    )}

                    {/* Model Answer if written */}
                    {q.model_answer && (
                      <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-1">
                        <span className="font-bold text-zinc-600 block">Model Solution:</span>
                        <p className="text-zinc-700 whitespace-pre-wrap">{q.model_answer}</p>
                      </div>
                    )}

                    {/* Review Actions */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                      <button
                        onClick={() => handleUpdateStatus(q.id, "approved")}
                        disabled={isUpdating}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                      >
                        {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        Approve Question
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(q.id, "rejected")}
                        disabled={isUpdating}
                        className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Flag / Reject
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Written Submissions Queue */
          <div className="space-y-4">
            {pendingAttempts.length === 0 ? (
              <div className="p-12 text-center bg-white border border-zinc-200 rounded-2xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-zinc-800">All submissions graded</h3>
                <p className="text-xs text-zinc-500 mt-1">There are no pending written exam submissions waiting for review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-md">
                          Attempt #{attempt.id.slice(0, 8)}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Pending Grading
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-900">
                        Candidate: {attempt.user_name || attempt.user_id?.slice(0, 10) || "Student"}
                      </h4>
                      <p className="text-xs text-zinc-500">
                        Score so far: {attempt.score || 0} / {attempt.total_questions || attempt.total_marks || 10}
                      </p>
                    </div>

                    <Link
                      href={`/examiner/exams/${examId}/results/${attempt.id}`}
                      className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all text-center block"
                    >
                      Review &amp; Grade Written Answers
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
