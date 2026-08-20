"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Flag, 
  Info, 
  Layers, 
  Layout, 
  Timer,
  Maximize2,
  Minimize2,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "@/lib/firebase";
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import Link from "next/link";

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation?: string;
}

export default function TakeExamPage() {
  const { id: exam_id } = useParams() as { id: string };
  const router = useRouter();
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fetchExamData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const examDoc = await getDoc(doc(db, "exams", exam_id));
      if (!examDoc.exists()) {
        setError("Exam simulation not found.");
        setLoading(false);
        return;
      }

      const examData = examDoc.data();
      setExam(examData);
      
      const q = query(
        collection(db, "questions"),
        where("exam_id", "==", exam_id)
      );
      
      const querySnapshot = await getDocs(q);
      const questionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Question[];

      questionsData.sort((a: any, b: any) => (a.order_in_exam || 0) - (b.order_in_exam || 0));
      setQuestions(questionsData);
      
      if (examData.duration_minutes) {
        setTimeLeft(examData.duration_minutes * 60);
      }
    } catch (err: any) {
      console.error("Error fetching exam:", err);
      setError("Failed to load questions. Please ensure you are connected.");
    } finally {
      setLoading(false);
    }
  }, [exam_id]);

  useEffect(() => {
    fetchExamData();
  }, [fetchExamData]);

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
          time_spent_seconds: exam?.duration_minutes ? (exam.duration_minutes * 60) - (timeLeft || 0) : 0
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        <h2 className="text-base font-bold text-slate-800 animate-pulse">Initializing Exam Environment...</h2>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-rose-200 max-w-md text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto" />
          <h2 className="text-2xl font-black text-slate-900">Exam Unavailable</h2>
          <p className="text-slate-600 text-sm">{error}</p>
          <Link href="/exams" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-sm">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Exam Matrix
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-mesh text-slate-900 font-sans pb-24">
      {/* Top sticky HUD */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/exams" className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 truncate max-w-[200px] sm:max-w-md leading-tight">
                  {exam?.title || "Mock Exam Simulation"}
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              {timeLeft !== null && (
                <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                  timeLeft < 300 
                    ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse" 
                    : "bg-slate-50 border-slate-200 text-slate-800"
                }`}>
                  <Timer className={`w-4 h-4 ${timeLeft < 300 ? "text-rose-600" : "text-indigo-600"}`} />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? "Submitting..." : "Submit Exam"}</span>
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-300"
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
              className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-8"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-700 text-base font-black rounded-xl border border-indigo-200">
                    {currentQuestionIndex + 1}
                  </span>
                  <div>
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Question Palette</h4>
                    <p className="text-xs font-bold text-slate-700">Multiple Choice Question (1 Mark)</p>
                  </div>
                </div>

                <button 
                  onClick={toggleFlag}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    flaggedQuestions.has(currentQuestionIndex) 
                      ? "bg-amber-50 border-amber-300 text-amber-700" 
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${flaggedQuestions.has(currentQuestionIndex) ? "fill-amber-600 text-amber-600" : ""}`} />
                  <span>{flaggedQuestions.has(currentQuestionIndex) ? "Marked for Review" : "Mark for Review"}</span>
                </button>
              </div>

              <div>
                <h2 className="text-lg sm:text-2xl font-bold leading-relaxed text-slate-900">
                  {currentQuestion?.question_text || "Loading question statement..."}
                </h2>
              </div>

              <div className="grid gap-3.5">
                {['a', 'b', 'c', 'd'].map((key) => {
                  const label = (currentQuestion as any)[`option_${key}`];
                  if (!label) return null;
                  const isSelected = answers[currentQuestion.id] === key;
                  
                  return (
                    <button
                      key={key}
                      onClick={() => handleAnswerSelect(key)}
                      className={`group flex items-center p-5 rounded-2xl text-left transition-all border-2 ${
                        isSelected 
                          ? "bg-indigo-50/80 border-indigo-600 text-indigo-950 shadow-sm" 
                          : "bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50/50 text-slate-700"
                      }`}
                    >
                      <div className={`w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl font-black text-sm mr-4 transition-colors ${
                        isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-indigo-100"
                      }`}>
                        {key.toUpperCase()}
                      </div>
                      <span className="text-sm sm:text-base font-medium flex-1">
                        {label}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 ml-2 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-slate-700 rounded-2xl font-bold text-xs border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-xs shadow-md hover:bg-indigo-700 transition-all"
            >
              {currentQuestionIndex === questions.length - 1 ? "Review All" : "Save & Next"}
              {currentQuestionIndex !== questions.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
            </button>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-28 space-y-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layout className="w-4 h-4 text-indigo-600" /> Question Palette
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
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center relative border ${
                      isCurrent ? "ring-2 ring-indigo-600 ring-offset-2 border-indigo-600" : ""
                    } ${
                      isAnswered 
                        ? "bg-emerald-600 text-white border-emerald-600" 
                        : isFlagged
                          ? "bg-amber-400 text-slate-950 border-amber-400"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs font-bold">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500">
                  <span className="w-3 h-3 rounded-md bg-emerald-600" /> Answered
                </span>
                <span className="text-slate-900">{answeredCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500">
                  <span className="w-3 h-3 rounded-md bg-amber-400" /> Marked for Review
                </span>
                <span className="text-slate-900">{flaggedQuestions.size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500">
                  <span className="w-3 h-3 rounded-md bg-slate-200" /> Unanswered
                </span>
                <span className="text-slate-900">{questions.length - answeredCount}</span>
              </div>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}
