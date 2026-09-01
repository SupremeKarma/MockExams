"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Target,
  Sparkles,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import MathRenderer from "@/components/MathRenderer";
import ReadAloud from "@/components/ReadAloud";

interface PracticeQuestion {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  marks: number;
  difficulty: string | null;
  topicName: string;
  rationale: string;
}

interface FocusTopic {
  topicId: string;
  topicName: string;
  masteryPercentage: number;
}

interface PracticeSet {
  questions: PracticeQuestion[];
  focusTopics: FocusTopic[];
  reason?: string;
}

interface GradeResult {
  questionId: string;
  correct: boolean;
  correctOption: string;
  explanation: string | null;
  topicName: string;
}

const OPTIONS = ["a", "b", "c", "d"] as const;

function PracticeInner() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic") ?? undefined;
  const isDaily = searchParams.get("daily") === "1";

  const [set, setSet] = useState<PracticeSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<GradeResult[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Lazy init: calling Date.now() during render is impure and re-runs on
  // every render rather than once when the set is first shown.
  const [startedAt, setStartedAt] = useState(() => Date.now());

  const load = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);
      setResults(null);
      setAnswers({});
      setIndex(0);

      const token = await currentUser.getIdToken();
      const query = isDaily
        ? "?daily=1"
        : topicId
          ? `?topic=${encodeURIComponent(topicId)}`
          : "";
      const res = await fetch(`/api/me/practice${query}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to build a practice set");

      setSet(body);
      setStartedAt(Date.now());
    } catch (err) {
      console.error("Practice load failed:", err);
      setError("Could not build a practice set. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [topicId, isDaily]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    load();
  }, [authLoading, user, load]);

  const submit = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      setSubmitting(true);
      const token = await currentUser.getIdToken();
      const res = await fetch("/api/me/practice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answers,
          time_spent_seconds: Math.round((Date.now() - startedAt) / 1000),
          daily: isDaily,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Could not grade this session");
      setResults(body.results);
    } catch (err) {
      console.error("Practice submit failed:", err);
      setError("Could not save this session. Your answers are still on screen.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <Centered>
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">
          Building your practice set
        </p>
      </Centered>
    );
  }

  if (!user) {
    return (
      <Centered>
        <h1 className="text-xl font-bold text-zinc-900">Sign in to practise</h1>
        <p className="text-sm text-zinc-500">Practice sets are built from your own weak areas.</p>
        <PrimaryLink href="/login">Log in</PrimaryLink>
      </Centered>
    );
  }

  if (error && !set) {
    return (
      <Centered>
        <h1 className="text-xl font-bold text-zinc-900">Something went wrong</h1>
        <p className="text-sm text-zinc-500">{error}</p>
        <button
          onClick={load}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm"
        >
          <RotateCcw className="w-4 h-4" /> Try again
        </button>
      </Centered>
    );
  }

  if (!set || set.questions.length === 0) {
    return (
      <Centered>
        <h1 className="text-xl font-bold text-zinc-900">
          {set?.reason === "daily_done" ? "Today's Daily 10 is done" : "Nothing to drill yet"}
        </h1>
        <p className="text-sm text-zinc-500 max-w-md">
          {set?.reason === "daily_done"
            ? "Come back tomorrow to keep your streak going — or run an untimed practice set now."
            : set?.reason === "no_questions"
              ? "There are no multiple-choice questions in the bank yet."
              : "Sit a mock exam first — practice sets are built from the weak areas your attempts reveal."}
        </p>
        <PrimaryLink href={set?.reason === "daily_done" ? "/practice" : "/exams"}>
          {set?.reason === "daily_done" ? "Practise anyway" : "Browse exams"}
        </PrimaryLink>
      </Centered>
    );
  }

  // ---- Results view ----
  if (results) {
    const correctCount = results.filter((r) => r.correct).length;
    return (
      <div className="min-h-screen bg-zinc-50/40 pb-20 px-4 sm:px-6 pt-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200 text-primary-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900">
              {correctCount} of {results.length} correct
            </h1>
            <p className="text-sm text-zinc-500">
              This session counted towards your mastery — your analytics are already updated.
            </p>
          </div>

          <div className="space-y-3">
            {results.map((result, i) => {
              const question = set.questions.find((q) => q.id === result.questionId);
              if (!question) return null;
              const chosen = answers[result.questionId];

              return (
                <div
                  key={result.questionId}
                  className="p-5 rounded-lg border border-zinc-200 bg-white space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    {result.correct ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1 min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">
                        Question {i + 1} · {result.topicName}
                      </p>
                      <MathRenderer
                        content={question.question_text}
                        className="text-sm text-zinc-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {OPTIONS.map((opt) => {
                      const isCorrect = result.correctOption === opt;
                      const isChosen = chosen === opt;
                      let cls = "bg-zinc-50 border-zinc-200 text-zinc-600";
                      if (isCorrect) cls = "bg-emerald-50 border-emerald-300 text-emerald-800";
                      else if (isChosen) cls = "bg-red-50 border-red-300 text-red-800";

                      return (
                        <div key={opt} className={`px-3 py-2 rounded-md border text-xs ${cls}`}>
                          <span className="font-bold uppercase mr-1.5">{opt}.</span>
                          {question[`option_${opt}` as keyof PracticeQuestion] as string}
                        </div>
                      );
                    })}
                  </div>

                  {result.explanation && (
                    <div className="p-3.5 bg-primary-50/60 rounded-md border border-primary-100">
                      <div className="flex items-center gap-1.5 mb-1.5 text-primary-700 font-bold text-[11px] uppercase tracking-wide">
                        <BookOpen className="w-3.5 h-3.5" />
                        Explanation
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed">{result.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={load}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm"
            >
              <RotateCcw className="w-4 h-4" /> Another set
            </button>
            <Link
              href="/analytics"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md border border-zinc-200 bg-white hover:border-primary-300 text-zinc-700 font-semibold text-sm"
            >
              See updated analytics
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---- Drill view ----
  const question = set.questions[index];
  const answeredCount = Object.keys(answers).length;
  const isLast = index === set.questions.length - 1;

  return (
    <div className="min-h-screen bg-zinc-50/40 pb-20 px-4 sm:px-6 pt-8">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-bold uppercase tracking-widest">
            <Target className="w-3.5 h-3.5" />
            {isDaily
              ? "Daily 10"
              : set.reason === "no_weak_areas_yet"
                ? "Mixed practice"
                : "Targeting your weak spots"}
          </div>
          {set.focusTopics.length > 0 && (
            <p className="text-xs text-zinc-500">
              Focusing on{" "}
              {set.focusTopics
                .slice(0, 3)
                .map((topic) => `${topic.topicName} (${Math.round(topic.masteryPercentage)}%)`)
                .join(", ")}
            </p>
          )}
        </div>

        <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary-600 transition-all"
            style={{ width: `${((index + 1) / set.questions.length) * 100}%` }}
          />
        </div>

        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg border border-zinc-200 bg-white space-y-5"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-zinc-400">
              <span>
                Question {index + 1} of {set.questions.length}
              </span>
              <span>
                {question.topicName}
                {question.difficulty ? ` · ${question.difficulty}` : ""}
              </span>
            </div>
            <MathRenderer content={question.question_text} className="text-base text-zinc-900" />
            <div className="flex items-center gap-2 flex-wrap">
              <ReadAloud
                text={`${question.question_text}. Option A: ${question.option_a}. Option B: ${question.option_b}. Option C: ${question.option_c}. Option D: ${question.option_d}.`}
                label="question and options"
              />
              <p className="text-[11px] text-zinc-400 italic">{question.rationale}</p>
            </div>
          </div>

          <div className="space-y-2">
            {OPTIONS.map((opt) => {
              const value = question[`option_${opt}` as keyof PracticeQuestion] as string;
              if (!value) return null;
              const selected = answers[question.id] === opt;

              return (
                <button
                  key={opt}
                  onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: opt }))}
                  className={`w-full text-left px-4 py-3 rounded-md border text-sm transition-colors ${
                    selected
                      ? "bg-primary-50 border-primary-400 text-primary-900"
                      : "bg-white border-zinc-200 text-zinc-700 hover:border-primary-300"
                  }`}
                >
                  <span className="font-bold uppercase mr-2">{opt}.</span>
                  {value}
                </button>
              );
            })}
          </div>
        </motion.div>

        {error && (
          <p className="text-xs text-red-600 text-center">{error}</p>
        )}

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
            disabled={index === 0}
            className="px-4 py-2.5 rounded-md border border-zinc-200 bg-white text-zinc-700 font-semibold text-sm disabled:opacity-40"
          >
            Back
          </button>

          <span className="text-xs text-zinc-400">
            {answeredCount} of {set.questions.length} answered
          </span>

          {isLast ? (
            <button
              onClick={submit}
              disabled={submitting || answeredCount === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Finish & check
            </button>
          ) : (
            <button
              onClick={() => setIndex((prev) => Math.min(set.questions.length - 1, prev + 1))}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50/40 flex flex-col items-center justify-center gap-3 px-4 text-center">
      {children}
    </div>
  );
}

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors"
    >
      {children}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <Centered>
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </Centered>
      }
    >
      <PracticeInner />
    </Suspense>
  );
}
