"use client";

import { ExamTimerBar } from "@/components/ExamTimerBar";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Loader2, XCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import { ExamReview } from "@/components/ExamReview";

export default function TakeExamPage({ params }: { params: any }) {
  const router = useRouter();
  const { id: exam_id } = use(params) as any;
  const { user } = useAuth();
  
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!exam_id) return;

    async function fetchData() {
      // Hardcoded Mock Data for Demo
      if (exam_id === "real-ioe-entrance") {
        setExam({
          id: "real-ioe-entrance",
          title: "IOE Entrance Model Exam 2081",
          category: "University Entrance",
          duration_minutes: 120,
          negativeMarkingEnabled: true,
          defaultMarksPerQuestion: 1,
          defaultNegativeMarks: 0.25
        });

        const mockQuestions = [
          {
            id: "q1",
            question_text: "A force F = (5i + 3j + 2k) N moves a particle from r1 = (2i + j) m to r2 = (4i + 3j - k) m. The work done by the force is:",
            option_a: "10 J",
            option_b: "12 J",
            option_c: "14 J",
            option_d: "15 J",
            correct_option: "c"
          },
          {
            id: "q2",
            question_text: "The escape velocity of a body from the earth's surface depends upon:",
            option_a: "The mass of the body",
            option_b: "The direction of projection",
            option_c: "The height of projection",
            option_d: "The mass and radius of the planet",
            correct_option: "d"
          },
          {
            id: "q3",
            question_text: "In a Young's double slit experiment, if the distance between the slits is halved and the distance between the slits and the screen is doubled, the fringe width will be:",
            option_a: "Unchanged",
            option_b: "Doubled",
            option_c: "Four times",
            option_d: "Eight times",
            correct_option: "c"
          },
          {
            id: "q4",
            question_text: "The dimension of Planck's constant (h) is equivalent to:",
            option_a: "Linear Momentum",
            option_b: "Angular Momentum",
            option_c: "Energy",
            option_d: "Power",
            correct_option: "b"
          },
          {
            id: "q5",
            question_text: "If z = (1+i)/(1-i), then |z| is equal to:",
            option_a: "0",
            option_b: "1",
            option_c: "2",
            option_d: "i",
            correct_option: "b"
          },
          {
            id: "q6",
            question_text: "The derivative of log(sec x) with respect to x is:",
            option_a: "tan x",
            option_b: "sec x",
            option_c: "cot x",
            option_d: "cos x",
            correct_option: "a"
          },
          {
            id: "q7",
            question_text: "Which of the following describes the behavior of an ideal gas at absolute zero temperature?",
            option_a: "Molecules cease to move",
            option_b: "Volume becomes infinite",
            option_c: "Pressure becomes infinite",
            option_d: "Entropy reaches maximum",
            correct_option: "a"
          },
          {
            id: "q8",
            question_text: "The half-life of a radioactive element is 10 days. The fraction of the element left after 20 days is:",
            option_a: "1/2",
            option_b: "1/4",
            option_c: "1/8",
            option_d: "3/4",
            correct_option: "b"
          },
          {
            id: "q9",
            question_text: "The specific heat capacity of water is approximately:",
            option_a: "4200 J/kg·K",
            option_b: "2100 J/kg·K",
            option_c: "1000 J/kg·K",
            option_d: "4.2 J/kg·K",
            correct_option: "a"
          },
          {
            id: "q10",
            question_text: "In a triangle ABC, if a=3, b=4, and c=5, the angle C is:",
            option_a: "30 degrees",
            option_b: "45 degrees",
            option_c: "60 degrees",
            option_d: "90 degrees",
            correct_option: "d"
          }
        ];

        setQuestions(mockQuestions);
        setStartTime(Date.now());
        setLoading(false);
        return;
      }

      try {
        // Fetch Exam
        const examDoc = await getDoc(doc(db, "exams", exam_id));
        if (!examDoc.exists()) {
          setLoading(false);
          return;
        }
        const examData = { id: examDoc.id, ...examDoc.data() };

        // Fetch Questions
        const q = query(
          collection(db, "questions"),
          where("exam_id", "==", exam_id),
          orderBy("order_in_exam", "asc")
        );
        const querySnapshot = await getDocs(q);
        const questionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setExam(examData);
        setQuestions(questionsData || []);
        setStartTime(Date.now());
      } catch (err) {
        console.error("Error fetching exam:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [exam_id]);

  // Persist answers
  useEffect(() => {
    if (!exam_id || Object.keys(answers).length === 0) return;
    localStorage.setItem(`exam_answers_${exam_id}`, JSON.stringify(answers));
  }, [answers, exam_id]);

  const handleAnswer = (questionId: string, option: string) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    const timeSpent = Math.floor((Date.now() - (startTime || 0)) / 1000);

    try {
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      const response = await fetch(`/api/exams/${exam_id}/submit`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          answers,
          time_spent_seconds: timeSpent,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data);
        setSubmitted(true);
        // Clear saved answers on successful submission
        localStorage.removeItem(`exam_answers_${exam_id}`);
        sessionStorage.removeItem(`exam-timer-${exam_id}`); // Clear timer too
      } else {
        throw new Error(data.error || "Submission failed");
      }
    } catch (err: any) {
      console.error("Submission failed:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-400 font-medium">Preparing your exam experience...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Exam Not Found</h1>
        <p className="text-slate-400 mb-8 max-w-md">We couldn't find the exam you're looking for. It might have been removed or unpublished.</p>
        <Link href="/exams" className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all">
          Browse All Exams
        </Link>
      </div>
    );
  }


  if (submitted && result) {
    const breakdown: any[] = result?.result?.answers_json?.breakdown ?? [];
    const wrongAnswers = breakdown.filter((b: any) => !b.isCorrect && b.selectedAnswer !== null);


    return (
      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 md:p-12 rounded-3xl"
        >
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Exam Completed! {result.percentage >= 80 ? '🎉' : '💪'}</h1>
            <p className="text-slate-400">Great effort. Here is your performance breakdown.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <ResultStat label="Score" value={`${result.correct_count}/${result.total}`} color="text-primary" />
            <ResultStat label="Accuracy" value={`${result.percentage.toFixed(1)}%`} />
            <ResultStat label="Time Taken" value={formatTime(Math.floor((Date.now() - (startTime || 0)) / 1000))} />
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="px-8 py-4 bg-white text-black rounded-2xl font-bold hover:bg-slate-200 transition-all shadow-lg text-center flex-1">
              Go to Dashboard
            </Link>
            <Link href="/exams" className="px-8 py-4 glass border-white/10 text-white rounded-2xl font-bold hover:bg-white/5 transition-all text-center flex-1">
              Take Another Exam
            </Link>
          </div>

          <ExamReview breakdown={breakdown} />
        </motion.div>
      </div>
    );
  }

  function ResultStat({ label, value, color = "text-white" }: { label: string, value: string, color?: string }) {
    return (
      <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
        <div className={`text-3xl font-black mb-1 ${color}`}>{value}</div>
        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{label}</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIdx];

  return (
    <div className="min-h-screen bg-mesh pb-20">
      <ExamTimerBar 
        totalSeconds={exam.duration_minutes * 60}
        totalQuestions={questions.length}
        answeredCount={Object.keys(answers).length}
        persistKey={`exam-${exam_id}`}
        onExpire={handleSubmit}
      />

      <div className="max-w-5xl mx-auto px-6 mt-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Brain className="text-primary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{exam.title}</h1>
              <p className="text-sm text-slate-400 font-medium">{exam.category} • {questions.length} Questions</p>
            </div>
          </div>
          
          <Link 
            href="/dashboard" 
            className="px-6 py-3 bg-white/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-2xl text-sm font-bold transition-all"
          >
            Quit Exam
          </Link>
        </div>

        {/* Question Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Question Card */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentQuestionIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-10 md:p-12 rounded-[2rem] border-white/10 border relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-10">
                  <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
                    Question {currentQuestionIdx + 1}
                  </span>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    {Math.round(((currentQuestionIdx + 1) / questions.length) * 100)}% Complete
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-12 leading-tight">
                  {currentQuestion?.question_text || "No questions found for this exam. Please contact the administrator."}
                </h2>

                <div className="space-y-4">
                  {currentQuestion && ['a', 'b', 'c', 'd'].map((opt) => {
                    const optionKey = `option_${opt}`;
                    const text = currentQuestion[optionKey];
                    if (!text) return null;
                    
                    const isSelected = answers[currentQuestion.id] === opt;
                    
                    return (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(currentQuestion.id, opt)}
                        className={`w-full text-left p-6 rounded-2xl border transition-all flex items-center gap-4 group ${
                          isSelected 
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                            : "bg-white/5 border-white/10 hover:border-primary/50 text-slate-300 hover:text-white"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black uppercase ${
                          isSelected ? "bg-white/20" : "bg-white/5 group-hover:bg-primary/20 transition-colors"
                        }`}>
                          {opt}
                        </div>
                        <span className="font-medium">{text}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIdx === 0}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                  >
                    <ChevronLeft className="w-5 h-5" /> Previous
                  </button>
                  
                  {currentQuestionIdx < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                      className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                    >
                      Next Question <ChevronRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="flex flex-col items-end gap-2">
                       <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 px-10 py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-500 transition-all shadow-lg shadow-green-500/20 active:scale-[0.98] disabled:opacity-50"
                      >
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                        Finalize Exam
                      </button>
                      {error && <p className="text-rose-500 text-xs font-bold">{error}</p>}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar Navigation */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border-white/10 border">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Jump to Question
              </h3>
              <div className="grid grid-cols-5 gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`w-full aspect-square rounded-xl text-xs font-black transition-all border ${
                      currentQuestionIdx === idx
                        ? "bg-primary border-primary text-white"
                        : answers[q.id]
                        ? "bg-primary/20 border-primary/20 text-primary"
                        : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 p-6 rounded-3xl">
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                <span className="text-primary font-bold">Pro-Tip:</span> Use question navigation to skip difficult problems and return to them later. All answers are auto-saved locally.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
