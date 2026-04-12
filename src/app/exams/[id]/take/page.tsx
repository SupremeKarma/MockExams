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
  Timer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "@/lib/firebase";
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy 
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

  const fetchExamData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const examDoc = await getDoc(doc(db, "exams", exam_id));
      if (!examDoc.exists()) {
        setError("Exam not found.");
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

      // Sort client-side to avoid index requirements
      questionsData.sort((a: any, b: any) => (a.order_in_exam || 0) - (b.order_in_exam || 0));

      setQuestions(questionsData);
      
      if (examData.duration_minutes) {
        setTimeLeft(examData.duration_minutes * 60);
      }
    } catch (err: any) {
      console.error("Error fetching exam:", err);
      setError("Permission denied or failed to load questions. Please ensure you are logged in.");
    } finally {
      setLoading(false);
    }
  }, [exam_id]);

  useEffect(() => {
    fetchExamData();
  }, [fetchExamData]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isCompleted]);

  const handleAnswerSelect = (option: string) => {
    if (isCompleted) return;
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers({
      ...answers,
      [currentQuestion.id]: option
    });
  };

  const toggleFlag = () => {
    const newFlags = new Set(flaggedQuestions);
    if (newFlags.has(currentQuestionIndex)) {
      newFlags.delete(currentQuestionIndex);
    } else {
      newFlags.add(currentQuestionIndex);
    }
    setFlaggedQuestions(newFlags);
  };

  const handleSubmit = async () => {
    if (isSubmitting || isCompleted) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be logged in to submit.");

      const token = await user.getIdToken();
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
      setError(err.message);
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-8">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-t-4 border-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-r-4 border-emerald-500 rounded-full animate-spin [animation-duration:1.5s]"></div>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white animate-pulse">Initializing Exam Environment...</h2>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-8">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-rose-100 dark:border-rose-900/30 max-w-md text-center">
          <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Access Denied</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">{error}</p>
          <Link href="/exams" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            <ChevronLeft className="w-5 h-5 mr-2" /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-inter">
      {/* Top sticky navigation */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/exams" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              </Link>
              <div>
                <h1 className="text-lg font-black text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md leading-tight">
                  {exam?.title || "Mock Exam"}
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Section: Main</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-6">
              {timeLeft !== null && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${
                  timeLeft < 300 
                    ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse" 
                    : "bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                }`}>
                  <Timer className={`w-4 h-4 ${timeLeft < 300 ? "text-rose-500" : "text-indigo-500"}`} />
                  <span className="text-lg font-black tabular-nums">{formatTime(timeLeft)}</span>
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="hidden sm:inline-flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-black transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                {isSubmitting ? "Submitting..." : "Finalize Exam"}
              </button>
              <button
                onClick={handleSubmit}
                className="sm:hidden p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20"
              >
                <CheckCircle2 className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="mt-4 relative h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:grid lg:grid-cols-4 lg:gap-8 min-h-[calc(100-112px)]">
        {/* Main Question Area */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -mr-32 -mt-32"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white text-xl font-black rounded-2xl shadow-lg shadow-indigo-200">
                      {currentQuestionIndex + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Current Question</h4>
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Section A • MCQs</p>
                    </div>
                  </div>
                  <button 
                    onClick={toggleFlag}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      flaggedQuestions.has(currentQuestionIndex) 
                        ? "bg-amber-100 text-amber-700" 
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Flag className={`w-4 h-4 ${flaggedQuestions.has(currentQuestionIndex) ? "fill-current" : ""}`} />
                    <span className="text-xs font-black uppercase tracking-wider">Review Later</span>
                  </button>
                </div>

                <div className="mb-10">
                  <h2 className="text-xl sm:text-2xl font-bold leading-relaxed text-slate-900 dark:text-white">
                    {currentQuestion?.question_text || "Question content is loading..."}
                  </h2>
                </div>

                <div className="grid gap-4">
                  {['a', 'b', 'c', 'd'].map((key) => {
                    const label = (currentQuestion as any)[`option_${key}`];
                    const isSelected = answers[currentQuestion.id] === key;
                    
                    return (
                      <button
                        key={key}
                        onClick={() => handleAnswerSelect(key)}
                        className={`group relative flex items-center p-6 rounded-2xl text-left transition-all border-2 ${
                          isSelected 
                            ? "bg-indigo-50 border-indigo-600 dark:bg-indigo-900/20 shadow-lg shadow-indigo-100" 
                            : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800"
                        }`}
                      >
                        <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl font-black text-lg mr-4 transition-colors ${
                          isSelected ? "bg-indigo-600 text-white" : "bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50"
                        }`}>
                          {key.toUpperCase()}
                        </div>
                        <span className={`text-lg font-medium transition-colors ${isSelected ? "text-indigo-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}>
                          {label}
                        </span>
                        {isSelected && (
                          <div className="ml-auto">
                            <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Question Navigation Bar */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-2xl font-bold border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>

            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all text-lg"
            >
              {currentQuestionIndex === questions.length - 1 ? "End of Exam" : "Save & Next"}
              {currentQuestionIndex !== questions.length - 1 && <ChevronRight className="w-5 h-5 ml-1" />}
            </button>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold shadow-sm"
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </div>

        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm sticky top-32">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Layout className="w-5 h-5 text-indigo-600" /> Navigator
            </h3>
            
            <div className="grid grid-cols-5 gap-2 mb-8">
              {questions.map((q, idx) => {
                const isSelected = currentQuestionIndex === idx;
                const isAnswered = !!answers[q.id];
                const isFlagged = flaggedQuestions.has(idx);
                
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-10 h-10 rounded-lg text-xs font-black transition-all flex items-center justify-center relative ${
                      isSelected ? "ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-slate-900" : ""
                    } ${
                      isAnswered 
                        ? "bg-indigo-600 text-white" 
                        : isFlagged
                          ? "bg-amber-400 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {idx + 1}
                    {isFlagged && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full"></div>}
                  </button>
                );
              })}
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-widest">Answered</span>
                <span className="text-slate-900 dark:text-white px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
                  {answeredCount}/{questions.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-widest">Flagged</span>
                <span className="text-slate-900 dark:text-white px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 rounded-md">
                  {flaggedQuestions.size}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <button 
                className="w-full flex items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
              >
                <Info className="w-4 h-4" /> Exam Guidelines
              </button>
              <button 
                className="w-full flex items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
              >
                <Layers className="w-4 h-4" /> Toggle Symbols
              </button>
            </div>
          </div>
        </aside>
      </main>
      
      {/* Dynamic Background elements */}
      <div className="fixed bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-500/5 to-transparent -z-10 blur-3xl pointer-events-none"></div>
    </div>
  );
}
