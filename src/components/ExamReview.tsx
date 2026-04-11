"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  BookOpen 
} from "lucide-react";

interface QuestionBreakdown {
  questionId: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  explanation: string | null;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  marksAwarded: number;
}

interface ExamReviewProps {
  breakdown: QuestionBreakdown[];
}

export function ExamReview({ breakdown }: ExamReviewProps) {
  const [showAll, setShowAll] = useState(false);
  const wrongAnswers = breakdown.filter((b) => !b.isCorrect && b.selectedAnswer !== null);
  const items = showAll ? breakdown : wrongAnswers;

  if (breakdown.length === 0) {
    return (
      <div className="mt-8 p-6 glass-card rounded-2xl border border-white/10 text-center text-slate-500 text-sm">
        Solution review not available for this attempt.
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Answer Review
          <span className="ml-2 text-sm font-normal text-slate-400">
            ({wrongAnswers.length} wrong · {breakdown.filter((b) => b.isCorrect).length} correct)
          </span>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAll(false)}
            className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
              !showAll 
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" 
                : "bg-white/5 text-slate-400 border border-white/10 hover:border-white/20"
            }`}
          >
            Wrong Only
          </button>
          <button
            onClick={() => setShowAll(true)}
            className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
              showAll 
                ? "bg-primary/20 text-primary border border-primary/30" 
                : "bg-white/5 text-slate-400 border border-white/10 hover:border-white/20"
            }`}
          >
            All Questions
          </button>
        </div>
      </div>

      {items.length === 0 && (
        <div className="p-12 glass-card rounded-2xl border border-white/10 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4 opacity-20" />
          <p className="text-slate-400 font-medium">
            {showAll ? "No questions to display." : "Absolute Perfection! You answered everything correctly."}
          </p>
        </div>
      )}

      {items.map((item, idx) => {
        const globalIdx = breakdown.indexOf(item);
        return (
          <div
            key={item.questionId}
            className={`glass-card p-6 rounded-2xl border transition-all ${
              item.isCorrect ? "border-emerald-500/10" : "border-rose-500/10 hover:border-rose-500/20"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${
                item.isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
              }`}>
                {item.isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {item.isCorrect ? "Correct" : "Incorrect"}
              </span>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Question {globalIdx + 1}</span>
              <span className="ml-auto text-xs font-bold text-slate-500">
                {item.marksAwarded > 0 ? `+${item.marksAwarded}` : item.marksAwarded} Marks
              </span>
            </div>

            <h3 className="text-base font-semibold mb-6 leading-relaxed text-slate-200">
              {item.question_text}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {(["a","b","c","d"] as const).map(opt => {
                const isCorrectOpt = item.correctAnswer === opt;
                const isSelected = item.selectedAnswer === opt;
                
                let cls = "bg-white/5 border-white/10 text-slate-400";
                if (isCorrectOpt) cls = "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 ring-1 ring-emerald-500/20";
                else if (isSelected && !isCorrectOpt) cls = "bg-rose-500/10 border-rose-500/30 text-rose-300 opacity-80";
                
                return (
                  <div key={opt} className={`p-4 rounded-xl border flex items-center gap-3 ${cls}`}>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black uppercase ${
                      isCorrectOpt ? "bg-emerald-500 text-white" : isSelected ? "bg-rose-500 text-white" : "bg-white/5"
                    }`}>
                      {opt}
                    </div>
                    <span className="font-medium">{item[`option_${opt as keyof QuestionBreakdown}`]}</span>
                    {isCorrectOpt && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0 text-emerald-400" />}
                    {isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 ml-auto shrink-0 text-rose-400" />}
                  </div>
                );
              })}
            </div>

            {item.explanation && (
              <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-widest">
                  <BookOpen className="w-3 h-3" />
                  Explanation
                </div>
                <p className="text-sm text-slate-400 leading-relaxed italic">
                  {item.explanation}
                </p>
              </div>
            )}
            
            {!item.selectedAnswer && !item.isCorrect && (
              <p className="mt-4 text-xs text-amber-500/60 font-medium flex items-center gap-1.5">
                <XCircle className="w-3 h-3" />
                This question was left unanswered during the exam.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
