"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  Sparkles,
  PenLine,
  AlertTriangle,
  ArrowRight,
  Loader2,
  MessageCircleQuestion,
  ListChecks,
} from "lucide-react";
import { AiTutorModal } from "@/components/AiTutorModal";
import { BookmarkButton } from "@/components/BookmarkButton";
import ReadAloud from "@/components/ReadAloud";
import { parseStoredRubric } from "@/lib/rubric-authoring";

interface QuestionBreakdown {
  questionId: string;
  type?: "mcq" | "written";
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
  fullMarks?: number;
  writtenAnswer?: string | null;
  modelAnswer?: string | null;
  /** Legacy single-blob feedback, kept so older attempts still render. */
  aiFeedback?: string | null;
  rubric?: string | null;
  grading_status?: "pending" | "complete" | "unavailable";
  strengths?: string[];
  gaps?: string[];
  nextStep?: string;
  concepts?: string[];
  attachmentUrls?: string[];
  teacherReviewed?: boolean;
  teacherFeedback?: string | null;
}

interface ExamReviewProps {
  breakdown: QuestionBreakdown[];
}

export function ExamReview({ breakdown }: ExamReviewProps) {
  const [showAll, setShowAll] = useState(false);
  const [tutorContext, setTutorContext] = useState<string | null>(null);
  const wrongAnswers = breakdown.filter((b) => !b.isCorrect && b.selectedAnswer !== null);
  const items = showAll ? breakdown : wrongAnswers;

  if (breakdown.length === 0) {
    return (
      <div className="mt-6 p-6 bg-white rounded-lg border border-zinc-200 text-center text-zinc-500 text-sm">
        Solution review not available for this attempt.
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary-600" />
          Answer review
          <span className="ml-1 text-xs font-normal text-zinc-500">
            ({wrongAnswers.length} wrong · {breakdown.filter((b) => b.isCorrect).length} correct)
          </span>
        </h2>
        <div className="flex gap-1.5">
          <button
            onClick={() => setShowAll(false)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border ${
              !showAll
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            Wrong only
          </button>
          <button
            onClick={() => setShowAll(true)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border ${
              showAll
                ? "bg-primary-50 text-primary-700 border-primary-200"
                : "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            All questions
          </button>
        </div>
      </div>

      {items.length === 0 && (
        <div className="p-10 bg-white rounded-lg border border-zinc-200 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">
            {showAll ? "No questions to display." : "Perfect score! You answered everything correctly."}
          </p>
        </div>
      )}

      {items.map((item) => {
        const globalIdx = breakdown.indexOf(item);
        return (
          <div
            key={item.questionId}
            className={`bg-white p-5 rounded-lg border transition-colors ${
              item.isCorrect ? "border-emerald-200" : "border-red-200"
            }`}
          >
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                item.isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
              }`}>
                {item.isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {item.isCorrect ? "Correct" : "Incorrect"}
              </span>
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wide">Question {globalIdx + 1}</span>
              <span className="ml-auto text-xs font-semibold text-zinc-500">
                {item.marksAwarded > 0 ? `+${item.marksAwarded}` : item.marksAwarded} marks
              </span>
            </div>

            <h3 className="text-sm font-semibold mb-4 leading-relaxed text-zinc-900">
              {item.question_text}
            </h3>

            {item.type === "written" ? (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5 text-zinc-500 font-bold text-[11px] uppercase tracking-wide">
                    <PenLine className="w-3.5 h-3.5" />
                    Your answer
                  </div>
                  <p className="text-xs text-zinc-700 leading-relaxed whitespace-pre-wrap p-3 bg-zinc-50 rounded-md border border-zinc-200">
                    {item.writtenAnswer || "(left blank)"}
                  </p>
                </div>

                {!!item.attachmentUrls?.length && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 text-zinc-500 font-bold text-[11px] uppercase tracking-wide">
                      Attached diagrams
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {item.attachmentUrls.map((url) => (
                        <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="block rounded-md overflow-hidden border border-zinc-200">
                          <img src={url} alt="Attached diagram" className="w-full h-20 object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {item.teacherReviewed && item.teacherFeedback && (
                  <div className="p-3.5 rounded-md border bg-blue-50/60 border-blue-100">
                    <div className="flex items-center gap-1.5 mb-1.5 font-bold text-[11px] uppercase tracking-wide text-blue-700">
                      <PenLine className="w-3.5 h-3.5" />
                      Teacher feedback
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">{item.teacherFeedback}</p>
                  </div>
                )}

                {item.grading_status === "pending" ? (
                  <div className="p-3.5 rounded-md border bg-zinc-50 border-zinc-200 flex items-center gap-2.5">
                    <Loader2 className="w-4 h-4 text-primary-600 animate-spin flex-shrink-0" />
                    <div>
                      <div className="font-bold text-[11px] uppercase tracking-wide text-zinc-700">
                        Grading your answer
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Feedback appears here automatically — no need to refresh.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {!!item.strengths?.length && (
                      <div className="p-3.5 rounded-md border bg-emerald-50/60 border-emerald-100">
                        <div className="flex items-center gap-1.5 mb-1.5 font-bold text-[11px] uppercase tracking-wide text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          What you did well
                        </div>
                        <ul className="space-y-1">
                          {item.strengths.map((point, i) => (
                            <li key={i} className="text-xs text-zinc-600 leading-relaxed flex gap-1.5">
                              <span className="text-emerald-500 select-none">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!!item.gaps?.length && (
                      <div className="p-3.5 rounded-md border bg-amber-50/60 border-amber-100">
                        <div className="flex items-center gap-1.5 mb-1.5 font-bold text-[11px] uppercase tracking-wide text-amber-700">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Where you can improve
                        </div>
                        <ul className="space-y-1">
                          {item.gaps.map((point, i) => (
                            <li key={i} className="text-xs text-zinc-600 leading-relaxed flex gap-1.5">
                              <span className="text-amber-500 select-none">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.nextStep && (
                      <div className="p-3.5 rounded-md border bg-primary-50/60 border-primary-100">
                        <div className="flex items-center gap-1.5 mb-1.5 font-bold text-[11px] uppercase tracking-wide text-primary-700">
                          <ArrowRight className="w-3.5 h-3.5" />
                          Do this next
                        </div>
                        <p className="text-xs text-zinc-600 leading-relaxed">{item.nextStep}</p>
                      </div>
                    )}

                    {/* Older attempts stored one prose blob instead of the
                        structured fields above. */}
                    {!item.strengths?.length && !item.gaps?.length && item.aiFeedback && (
                      <div className="p-3.5 rounded-md border bg-amber-50/60 border-amber-100">
                        <div className="flex items-center gap-1.5 mb-1.5 font-bold text-[11px] uppercase tracking-wide text-amber-700">
                          <Sparkles className="w-3.5 h-3.5" />
                          AI feedback
                        </div>
                        <p className="text-xs text-zinc-600 leading-relaxed">{item.aiFeedback}</p>
                      </div>
                    )}

                    {!!item.concepts?.length && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">
                          Concepts
                        </span>
                        {item.concepts.map((concept) => (
                          <span
                            key={concept}
                            className="px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-medium text-zinc-600"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        setTutorContext(
                          `${item.question_text}

My answer was: ${item.writtenAnswer ?? "(blank)"}` +
                            (item.gaps?.length ? `

Feedback said I missed: ${item.gaps.join("; ")}` : "")
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-white border border-zinc-200 hover:border-primary-300 hover:bg-primary-50/40 text-xs font-semibold text-zinc-700 transition-colors"
                    >
                      <MessageCircleQuestion className="w-3.5 h-3.5 text-primary-600" />
                      Ask the tutor why
                    </button>
                    <BookmarkButton questionId={item.questionId} />
                    <ReadAloud
                      text={[
                        item.question_text,
                        item.strengths?.length ? `What you did well: ${item.strengths.join(". ")}` : "",
                        item.gaps?.length ? `Where you can improve: ${item.gaps.join(". ")}` : "",
                        item.nextStep ? `Do this next: ${item.nextStep}` : "",
                      ]
                        .filter(Boolean)
                        .join(". ")}
                      label="question and feedback"
                    />
                    </div>
                  </>
                )}

                {/* Where the marks actually sat. This is the thing students
                    ask for — not "5/8" but which criterion they missed. */}
                {(() => {
                  const criteria = parseStoredRubric(item.rubric ?? "");
                  if (criteria.length === 0) return null;
                  return (
                    <div className="p-3.5 bg-white rounded-md border border-zinc-200">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 text-zinc-700 font-bold text-[11px] uppercase tracking-wide">
                          <ListChecks className="w-3.5 h-3.5" />
                          How the marks are awarded
                        </div>
                        <span className="text-[11px] text-zinc-400 tabular-nums">
                          {item.marksAwarded} of {item.fullMarks ?? "?"}
                        </span>
                      </div>
                      <ul className="space-y-1.5">
                        {criteria.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-zinc-600 leading-relaxed">
                            <span className="font-bold text-zinc-900 tabular-nums whitespace-nowrap">
                              {c.marks}
                            </span>
                            <span>{c.criterion}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                        Compare these against your answer above to see exactly where marks were lost.
                      </p>
                    </div>
                  );
                })()}

                {item.modelAnswer && (
                  <div className="p-3.5 bg-primary-50/60 rounded-md border border-primary-100">
                    <div className="flex items-center gap-1.5 mb-1.5 text-primary-700 font-bold text-[11px] uppercase tracking-wide">
                      <BookOpen className="w-3.5 h-3.5" />
                      Model answer
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">{item.modelAnswer}</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-sm">
                  {(["a","b","c","d"] as const).map(opt => {
                    const isCorrectOpt = item.correctAnswer === opt;
                    const isSelected = item.selectedAnswer === opt;

                    let cls = "bg-zinc-50 border-zinc-200 text-zinc-600";
                    if (isCorrectOpt) cls = "bg-emerald-50 border-emerald-300 text-emerald-800";
                    else if (isSelected && !isCorrectOpt) cls = "bg-red-50 border-red-300 text-red-800";

                    return (
                      <div key={opt} className={`p-3 rounded-md border flex items-center gap-2.5 ${cls}`}>
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold uppercase shrink-0 ${
                          isCorrectOpt ? "bg-emerald-600 text-white" : isSelected ? "bg-red-600 text-white" : "bg-zinc-200 text-zinc-600"
                        }`}>
                          {opt}
                        </div>
                        <span className="text-xs">{item[`option_${opt}` as keyof QuestionBreakdown]}</span>
                        {isCorrectOpt && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0 text-emerald-600" />}
                        {isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 ml-auto shrink-0 text-red-600" />}
                      </div>
                    );
                  })}
                </div>

                {item.explanation && (
                  <div className="mt-4 p-3.5 bg-primary-50/60 rounded-md border border-primary-100">
                    <div className="flex items-center gap-1.5 mb-1.5 text-primary-700 font-bold text-[11px] uppercase tracking-wide">
                      <BookOpen className="w-3.5 h-3.5" />
                      Explanation
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                )}
              </>
            )}

            {!item.selectedAnswer && !item.isCorrect && (
              <p className="mt-3 text-xs text-amber-700 font-medium flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                This question was left unanswered during the exam.
              </p>
            )}
          </div>
        );
      })}

      {/* Seeded with the student's own answer and the feedback, so the tutor
          can question their specific reasoning rather than the topic at large. */}
      <AiTutorModal
        isOpen={tutorContext !== null}
        onClose={() => setTutorContext(null)}
        contextTopic={tutorContext ?? undefined}
      />
    </div>
  );
}
