"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Flag,
  Layout,
  Timer,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import AnswerEditor from "@/components/AnswerEditor";
import ReadAloud from "@/components/ReadAloud";

interface Question {
  id: string;
  type?: "mcq" | "written";
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  marks?: number;
}

export default function TakeExamPage() {
  const { id: exam_id } = useParams() as { id: string };
  const router = useRouter();
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<Record<string, string[]>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [_isFullscreen, _setIsFullscreen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [honorAccepted, setHonorAccepted] = useState(false);
  const [started, setStarted] = useState(false);
  // Focus-loss telemetry. Recorded for staff to look at, never used to
  // auto-penalise — a blurred tab is usually a notification, not cheating.
  const blurStats = useRef({ count: 0, longest: 0 });

  const fetchExamData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError("Please sign in to sit this exam.");
        setLoading(false);
        return;
      }
      const token = await currentUser.getIdToken();

      // POST starts a server-side session: it records the real start time and
      // a per-student shuffle, so timing is not the browser's word and no two
      // students get the same question or option order.
      const res = await fetch(`/api/exams/${exam_id}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ honorAccepted }),
        cache: "no-store",
      });
      if (res.status === 404) {
        setError("Exam simulation not found.");
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(`Failed to start exam (${res.status})`);

      // The answer key (correct_option / model_answer) never reaches the client.
      const { exam: examData, questions: questionsData, sessionId: id } = await res.json();
      setExam(examData);
      setQuestions(questionsData as Question[]);
      setSessionId(id);

      if (examData.duration_minutes) {
        setTimeLeft(examData.duration_minutes * 60);
      }
    } catch (err: any) {
      console.error("Error fetching exam:", err);
      setError("Failed to load questions. Please ensure you are connected.");
    } finally {
      setLoading(false);
    }
  }, [exam_id, honorAccepted]);

  useEffect(() => {
    if (!started) return;
    fetchExamData();
  }, [started, fetchExamData]);

  // Track focus loss while the exam is open. This is a soft signal shown to
  // staff alongside the attempt, not something that blocks or flags a student.
  useEffect(() => {
    if (isCompleted) return;

    let leftAt: number | null = null;

    const onHide = () => {
      if (document.visibilityState === "hidden") {
        leftAt = Date.now();
        blurStats.current.count += 1;
      } else if (leftAt !== null) {
        const away = Math.round((Date.now() - leftAt) / 1000);
        blurStats.current.longest = Math.max(blurStats.current.longest, away);
        leftAt = null;
      }
    };

    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [isCompleted]);

  // Timer Countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isCompleted) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev !== null && prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isCompleted]);

  const handleAnswerSelect = (optionKey: string) => {
    if (!questions[currentQuestionIndex]) return;
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: optionKey
    }));
  };

  const handleWrittenAnswerChange = (value: string) => {
    if (!questions[currentQuestionIndex]) return;
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: value
    }));
  };

  const handleAttachmentsChange = (urls: string[]) => {
    if (!questions[currentQuestionIndex]) return;
    setAttachments(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: urls
    }));
  };

  const toggleFlag = () => {
    setFlaggedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(currentQuestionIndex)) {
        next.delete(currentQuestionIndex);
      } else {
        next.add(currentQuestionIndex);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : "";

      const response = await fetch(`/api/exams/${exam_id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          answers,
          attachments,
          time_spent_seconds: exam?.duration_minutes ? (exam.duration_minutes * 60) - (timeLeft || 0) : 0,
          session_id: sessionId,
          blur_count: blurStats.current.count,
          longest_blur_seconds: blurStats.current.longest
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setIsCompleted(true);
      router.push(`/exams/results/${data.attempt_id}`);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setError(err.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Pre-exam gate. The attestation is a real choice the student makes and is
  // stored on the session — the honest alternative to webcam proctoring.
  if (!started) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200 text-primary-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-zinc-900">Ready to begin?</h1>
            <p className="text-sm text-zinc-500 leading-relaxed">
              The clock starts when you begin and is kept by the server, so closing
              the tab will not pause it. Your questions and answer options are
              shuffled just for you.
            </p>
          </div>

          <label className="flex items-start gap-3 p-4 rounded-lg border border-zinc-200 bg-zinc-50/60 cursor-pointer">
            <input
              type="checkbox"
              checked={honorAccepted}
              onChange={(e) => setHonorAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-primary-600"
            />
            <span className="text-xs text-zinc-600 leading-relaxed">
              I will sit this exam honestly, using no outside help. I understand that
              switching away from this tab is recorded so my teacher can see it.
            </span>
          </label>

          {error && <p className="text-xs text-red-600 text-center">{error}</p>}

          <div className="flex gap-3">
            <Link
              href="/exams"
              className="flex-1 text-center px-4 py-2.5 rounded-md border border-zinc-200 text-zinc-700 font-semibold text-sm hover:bg-zinc-50 transition-colors"
            >
              Not yet
            </Link>
            <button
              onClick={() => setStarted(true)}
              disabled={!honorAccepted}
              className="flex-1 px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Start exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-primary-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
        <h2 className="text-base font-bold text-zinc-800 animate-pulse">Initializing Exam Environment...</h2>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="bg-white p-8 rounded-lg border border-red-200 max-w-md text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-red-600 mx-auto" />
          <h2 className="text-lg font-bold text-zinc-900">Exam unavailable</h2>
          <p className="text-zinc-500 text-sm">{error}</p>
          <Link href="/exams" className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-md font-semibold text-xs hover:bg-primary-700 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to exams
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-zinc-50/40 text-zinc-900 font-sans pb-20">
      {/* Top sticky HUD */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/exams" className="p-2 hover:bg-zinc-100 rounded-md transition-colors text-zinc-600">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-sm sm:text-base font-semibold text-zinc-900 truncate max-w-[200px] sm:max-w-md leading-tight">
                  {exam?.title || "Mock Exam Simulation"}
                </h1>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {timeLeft !== null && (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border font-mono font-bold text-sm ${
                  timeLeft < 300
                    ? "bg-red-50 border-red-200 text-red-600 animate-pulse"
                    : "bg-zinc-50 border-zinc-200 text-zinc-800"
                }`}>
                  <Timer className={`w-4 h-4 ${timeLeft < 300 ? "text-red-600" : "text-primary-600"}`} />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-md font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? "Submitting..." : "Submit Exam"}</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 relative h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-primary-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:grid lg:grid-cols-4 lg:gap-8 items-start">
        
        {/* Main Question Area */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-lg p-6 sm:p-8 shadow-xs border border-zinc-200 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 flex items-center justify-center bg-primary-50 text-primary-700 text-sm font-bold rounded-md border border-primary-200">
                    {currentQuestionIndex + 1}
                  </span>
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Question palette</h4>
                    <p className="text-xs font-semibold text-zinc-700">
                      {currentQuestion?.type === "written" ? "Written answer" : "Multiple choice"} question
                      {" "}({currentQuestion?.marks ?? 1} mark{(currentQuestion?.marks ?? 1) === 1 ? "" : "s"})
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleFlag}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border ${
                    flaggedQuestions.has(currentQuestionIndex)
                      ? "bg-amber-50 border-amber-300 text-amber-700"
                      : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${flaggedQuestions.has(currentQuestionIndex) ? "fill-amber-600 text-amber-600" : ""}`} />
                  <span>{flaggedQuestions.has(currentQuestionIndex) ? "Marked for review" : "Mark for review"}</span>
                </button>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-semibold leading-relaxed text-zinc-900">
                  {currentQuestion?.question_text || "Loading question statement..."}
                </h2>
                {currentQuestion && (
                  <ReadAloud
                    text={
                      currentQuestion.type === "written"
                        ? currentQuestion.question_text
                        : `${currentQuestion.question_text}. Option A: ${currentQuestion.option_a}. Option B: ${currentQuestion.option_b}. Option C: ${currentQuestion.option_c}. Option D: ${currentQuestion.option_d}.`
                    }
                    label="question"
                  />
                )}
              </div>

              {currentQuestion?.type === "written" ? (
                <div className="space-y-2">
                  <AnswerEditor
                    value={answers[currentQuestion.id] || ""}
                    onChange={handleWrittenAnswerChange}
                    attachments={attachments[currentQuestion.id] || []}
                    onAttachmentsChange={handleAttachmentsChange}
                    uploadPathPrefix={`answers/${exam_id}/${currentQuestion.id}`}
                    placeholder="Write your full answer here, just like you would on the real exam paper..."
                  />
                  <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Your answer will be graded by AI against a full model answer after you submit. Diagrams are reviewed by your teacher.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {['a', 'b', 'c', 'd'].map((key) => {
                    const label = (currentQuestion as any)[`option_${key}`];
                    if (!label) return null;
                    const isSelected = answers[currentQuestion.id] === key;

                    return (
                      <button
                        key={key}
                        onClick={() => handleAnswerSelect(key)}
                        className={`group flex items-center p-4 rounded-lg text-left transition-colors border-2 ${
                          isSelected
                            ? "bg-primary-50/80 border-primary-600 text-primary-950"
                            : "bg-white border-zinc-200 hover:border-primary-200 hover:bg-zinc-50/50 text-zinc-700"
                        }`}
                      >
                        <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-md font-bold text-sm mr-3.5 transition-colors ${
                          isSelected ? "bg-primary-600 text-white" : "bg-zinc-100 text-zinc-600 group-hover:bg-primary-100"
                        }`}>
                          {key.toUpperCase()}
                        </div>
                        <span className="text-sm sm:text-base flex-1">
                          {label}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-primary-600 ml-2 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white text-zinc-700 rounded-md font-semibold text-xs border border-zinc-200 disabled:opacity-30 hover:bg-zinc-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-md font-semibold text-xs hover:bg-primary-700 transition-colors shadow-button"
            >
              {currentQuestionIndex === questions.length - 1 ? "Review All" : "Save & Next"}
              {currentQuestionIndex !== questions.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
            </button>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white rounded-lg p-5 border border-zinc-200 shadow-xs sticky top-20 space-y-5">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <Layout className="w-4 h-4 text-primary-600" /> Question palette
            </h3>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = currentQuestionIndex === idx;
                const isAnswered = !!answers[q.id];
                const isFlagged = flaggedQuestions.has(idx);

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-9 h-9 rounded-md text-xs font-bold transition-colors flex items-center justify-center relative border ${
                      isCurrent ? "ring-2 ring-primary-600 ring-offset-2 border-primary-600" : ""
                    } ${
                      isAnswered
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : isFlagged
                          ? "bg-amber-400 text-zinc-950 border-amber-400"
                          : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-100 text-xs font-bold">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-zinc-500">
                  <span className="w-3 h-3 rounded-md bg-emerald-600" /> Answered
                </span>
                <span className="text-zinc-900">{answeredCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-zinc-500">
                  <span className="w-3 h-3 rounded-md bg-amber-400" /> Marked for Review
                </span>
                <span className="text-zinc-900">{flaggedQuestions.size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-zinc-500">
                  <span className="w-3 h-3 rounded-md bg-zinc-200" /> Unanswered
                </span>
                <span className="text-zinc-900">{questions.length - answeredCount}</span>
              </div>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}
