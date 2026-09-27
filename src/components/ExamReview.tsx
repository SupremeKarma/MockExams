"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
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
import FormattedContent from "@/components/FormattedContent";
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

/**
 * Builds fluent spoken text for exam review including the question text,
 * student's submitted response, correct answer, rubric criteria/feedback,
 * and model answer.
 */
export function buildQuestionSpeechText(item: QuestionBreakdown, questionNumber: number): string {
  const parts: string[] = [];

  parts.push(`Question ${questionNumber}. ${item.question_text}`);

  if (item.type === "written") {
    // Written Answer speech
    if (item.writtenAnswer && item.writtenAnswer.trim()) {
      parts.push(`Your answer was: ${item.writtenAnswer}.`);
    } else {
      parts.push(`Your answer was left blank. Unanswered questions are counted as incorrect.`);
    }

    if (item.grading_status === "pending") {
      parts.push("Grading is currently in progress for this question.");
    } else {
      parts.push(`Marks awarded: ${item.marksAwarded} of ${item.fullMarks ?? item.marksAwarded}.`);
      if (item.strengths?.length) {
        parts.push(`What you did well: ${item.strengths.join(". ")}.`);
      }
      if (item.gaps?.length) {
        parts.push(`Where you can improve: ${item.gaps.join(". ")}.`);
      }
      if (item.nextStep) {
        parts.push(`Do this next: ${item.nextStep}.`);
      }
      if (!item.strengths?.length && !item.gaps?.length && item.aiFeedback) {
        parts.push(`Feedback: ${item.aiFeedback}.`);
      }
    }

    if (item.teacherReviewed && item.teacherFeedback) {
      parts.push(`Teacher feedback: ${item.teacherFeedback}.`);
    }

    if (item.modelAnswer) {
      parts.push(`Model answer: ${item.modelAnswer}.`);
    }
  } else {
    // MCQ Question speech
    const optionsText: string[] = [];
    (["a", "b", "c", "d"] as const).forEach((opt) => {
      const optVal = item[`option_${opt}` as keyof QuestionBreakdown];
      if (optVal) {
        optionsText.push(`Option ${opt.toUpperCase()}: ${optVal}`);
      }
    });
    if (optionsText.length > 0) {
      parts.push(`The options were: ${optionsText.join(". ")}.`);
    }

    if (item.selectedAnswer) {
      const selectedKey = `option_${item.selectedAnswer.toLowerCase()}` as keyof QuestionBreakdown;
      const selectedOptionText = item[selectedKey] || "";
      if (item.isCorrect) {
        parts.push(
          `Your answer was Option ${item.selectedAnswer.toUpperCase()}${
            selectedOptionText ? `: ${selectedOptionText}` : ""
          }. That is correct!`
        );
      } else {
        parts.push(
          `Your answer was Option ${item.selectedAnswer.toUpperCase()}${
            selectedOptionText ? `: ${selectedOptionText}` : ""
          }. That is incorrect.`
        );
      }
    } else {
      parts.push("You left this question unanswered. Unanswered questions are counted as incorrect.");
    }

    if (!item.isCorrect) {
      const correctKey = `option_${item.correctAnswer.toLowerCase()}` as keyof QuestionBreakdown;
      const correctOptionText = item[correctKey] || "";
      parts.push(
        `The correct answer is Option ${item.correctAnswer.toUpperCase()}${
          correctOptionText ? `: ${correctOptionText}` : ""
        }.`
      );
    }

    if (item.explanation) {
      parts.push(`Explanation: ${item.explanation}.`);
    }
  }

  return parts.filter(Boolean).join(" ");
}

interface ExamReviewProps {
  breakdown: QuestionBreakdown[];
}

export function ExamReview({ breakdown }: ExamReviewProps) {
  const [showAll, setShowAll] = useState(false);
  const [tutorContext, setTutorContext] = useState<string | null>(null);

  // An unanswered question receives 0 marks and is strictly counted as incorrect.
  const wrongAnswers = breakdown.filter((b) => !b.isCorrect);
  const correctAnswers = breakdown.filter((b) => b.isCorrect);
  const unansweredCount = breakdown.filter(
    (b) =>
      !b.isCorrect &&
      ((b.type === "written" && (!b.writtenAnswer || !b.writtenAnswer.trim())) ||
        (b.type !== "written" && !b.selectedAnswer))
  ).length;

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
            ({wrongAnswers.length} incorrect{unansweredCount > 0 ? ` incl. ${unansweredCount} unanswered` : ""} · {correctAnswers.length} correct)
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
            Incorrect & Unanswered ({wrongAnswers.length})
          </button>
          <button
            onClick={() => setShowAll(true)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border ${
              showAll
                ? "bg-primary-50 text-primary-700 border-primary-200"
                : "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            All questions ({breakdown.length})
          </button>
        </div>
      </div>

      {items.length === 0 && (
        <div className="p-10 bg-white rounded-lg border border-zinc-200 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">
            {showAll ? "No questions to display." : "Perfect score! You answered every question correctly."}
          </p>
        </div>
      )}

      {items.map((item) => {
        const globalIdx = breakdown.indexOf(item);
        const isUnanswered =
          !item.isCorrect &&
          ((item.type === "written" && (!item.writtenAnswer || !item.writtenAnswer.trim())) ||
            (item.type !== "written" && !item.selectedAnswer));

        return (
          <div
            key={item.questionId}
            className={`bg-white p-5 rounded-lg border transition-colors ${
              item.isCorrect ? "border-emerald-200" : isUnanswered ? "border-amber-200" : "border-red-200"
            }`}
          >
            <div className="flex items-center gap-2.5 mb-3.5">
              <span
                className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                  item.isCorrect
                    ? "bg-emerald-50 text-emerald-700"
                    : isUnanswered
                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {item.isCorrect ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : isUnanswered ? (
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                ) : (
                  <XCircle className="w-3 h-3" />
                )}
                {item.isCorrect ? "Correct" : isUnanswered ? "Unanswered (Incorrect)" : "Incorrect"}
              </span>
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wide">Question {globalIdx + 1}</span>
              <div className="ml-auto flex items-center gap-2">
                <ReadAloud
                  text={buildQuestionSpeechText(item, globalIdx + 1)}
                  label={`Question ${globalIdx + 1} and answers`}
                  buttonText="Listen"
                  title="Listen to question, answers, and feedback in female voice"
                />
                <span className="text-xs font-semibold text-zinc-500">
                  {item.marksAwarded > 0 ? `+${item.marksAwarded}` : item.marksAwarded} marks
                </span>
              </div>
            </div>

            <div className="text-base sm:text-lg font-semibold mb-4 leading-relaxed text-zinc-900">
              <FormattedContent content={item.question_text} size="lg" />
            </div>

            {item.type === "written" ? (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5 text-zinc-500 font-bold text-[11px] uppercase tracking-wide">
                    <PenLine className="w-3.5 h-3.5" />
                    Your answer
                  </div>
                  <div className="p-4 bg-zinc-50/80 rounded-lg border border-zinc-200 text-sm sm:text-base text-zinc-800 leading-relaxed">
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
                  <div className="p-4 rounded-lg border bg-blue-50/70 border-blue-200 text-sm sm:text-base text-zinc-800 leading-relaxed">
                    <div className="flex items-center gap-1.5 mb-2 font-bold text-xs uppercase tracking-wider text-blue-700">
                      <PenLine className="w-4 h-4" />
                      Teacher feedback
                    </div>
                    <FormattedContent content={item.teacherFeedback} size="base" />
                  </div>
                )}

                {item.grading_status === "pending" ? (
                  <div className="p-4 rounded-lg border bg-zinc-50 border-zinc-200 flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-primary-600 animate-spin flex-shrink-0" />
                    <div>
                      <div className="font-bold text-xs uppercase tracking-wide text-zinc-700">
                        Grading your answer
                      </div>
                      <p className="text-sm text-zinc-500 leading-relaxed">
                        Feedback appears here automatically — no need to refresh.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {!!item.strengths?.length && (
                      <div className="p-4 rounded-lg border bg-emerald-50/70 border-emerald-200">
                        <div className="flex items-center gap-1.5 mb-2 font-bold text-xs uppercase tracking-wider text-emerald-800">
                          <CheckCircle2 className="w-4 h-4" />
                          What you did well
                        </div>
                        <ul className="space-y-1.5">
                          {item.strengths.map((point, i) => (
                            <li key={i} className="text-sm text-zinc-700 leading-relaxed flex items-start gap-2">
                              <span className="text-emerald-500 font-bold select-none">•</span>
                              <div className="flex-1">
                                <FormattedContent content={point} size="sm" />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!!item.gaps?.length && (
                      <div className="p-4 rounded-lg border bg-amber-50/70 border-amber-200">
                        <div className="flex items-center gap-1.5 mb-2 font-bold text-xs uppercase tracking-wider text-amber-800">
                          <AlertTriangle className="w-4 h-4" />
                          Where you can improve
                        </div>
                        <ul className="space-y-1.5">
                          {item.gaps.map((point, i) => (
                            <li key={i} className="text-sm text-zinc-700 leading-relaxed flex items-start gap-2">
                              <span className="text-amber-500 font-bold select-none">•</span>
                              <div className="flex-1">
                                <FormattedContent content={point} size="sm" />
                              </div>
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
                      text={buildQuestionSpeechText(item, globalIdx + 1)}
                      label={`Question ${globalIdx + 1}, your answer, and feedback`}
                      buttonText="Listen to feedback & answer"
                      title="Listen to question, your written answer, feedback, and model answer"
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
                      <ul className="space-y-2">
                        {criteria.map((c, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-700 leading-relaxed">
                            <span className="font-bold text-zinc-900 tabular-nums whitespace-nowrap px-1.5 py-0.5 rounded bg-zinc-100 text-xs">
                              {c.marks}
                            </span>
                            <div className="flex-1">
                              <FormattedContent content={c.criterion} size="sm" />
                            </div>
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed">
                        Compare these against your answer above to see exactly where marks were lost.
                      </p>
                    </div>
                  );
                })()}

                {item.modelAnswer && (
                  <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50/70 via-primary-50/40 to-white rounded-xl border border-primary-200/90 shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-primary-200/60">
                      <div className="flex items-center gap-2 text-primary-900 font-bold text-xs sm:text-sm uppercase tracking-wider">
                        <div className="p-1.5 rounded-md bg-primary-100 text-primary-700">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <span>Model Answer / Benchmark Solution</span>
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary-100/90 text-primary-800 border border-primary-200/70">
                        Full Marks Standard
                      </span>
                    </div>
                    <div className="text-sm sm:text-base text-zinc-800 leading-relaxed">
                      <FormattedContent content={item.modelAnswer} size="base" />
                    </div>
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
                        <div className="text-sm sm:text-base flex-1 text-zinc-800">
                          <FormattedContent content={item[`option_${opt}`] || ""} size="base" />
                        </div>
                        {isCorrectOpt && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0 text-emerald-600" />}
                        {isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 ml-auto shrink-0 text-red-600" />}
                      </div>
                    );
                  })}
                </div>

                {item.explanation && (
                  <div className="mt-4 p-4 sm:p-5 bg-primary-50/50 rounded-xl border border-primary-200">
                    <div className="flex items-center gap-2 mb-2.5 text-primary-900 font-bold text-xs sm:text-sm uppercase tracking-wider">
                      <div className="p-1 rounded bg-primary-100 text-primary-700">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <span>Explanation</span>
                    </div>
                    <div className="text-sm sm:text-base text-zinc-800 leading-relaxed">
                      <FormattedContent content={item.explanation} size="base" />
                    </div>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      setTutorContext(
                        `${item.question_text}\n\nThe options were:\nA: ${item.option_a}\nB: ${item.option_b}\nC: ${item.option_c}\nD: ${item.option_d}\n\nMy answer was: Option ${item.selectedAnswer ? item.selectedAnswer.toUpperCase() : "(blank)"}.\nThe correct answer is Option ${item.correctAnswer.toUpperCase()}.` +
                          (item.explanation ? `\n\nExplanation: ${item.explanation}` : "")
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-white border border-zinc-200 hover:border-primary-300 hover:bg-primary-50/40 text-xs font-semibold text-zinc-700 transition-colors"
                  >
                    <MessageCircleQuestion className="w-3.5 h-3.5 text-primary-600" />
                    Ask the tutor why
                  </button>
                  <BookmarkButton questionId={item.questionId} />
                  <ReadAloud
                    text={buildQuestionSpeechText(item, globalIdx + 1)}
                    label={`Question ${globalIdx + 1}, options, and answer`}
                    buttonText="Listen to question & answer"
                    title="Listen to question, options, chosen answer, and explanation"
                  />
                </div>
              </>
            )}

            {isUnanswered && (
              <p className="mt-3 text-xs text-amber-800 font-medium flex items-center gap-1.5 p-2.5 bg-amber-50 rounded-md border border-amber-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                This question was left unanswered during the exam and is counted as incorrect (0 marks).
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
