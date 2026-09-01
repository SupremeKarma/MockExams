"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Target,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowUpRight,
  Sparkles,
  Loader2,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PageHeader, SectionCard, StatCard } from "@/components/UIComponents";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

interface TopicPerformance {
  topicId: string;
  topicName: string;
  masteryPercentage: number;
  questionsAttempted: number;
  correctCount: number;
  accuracy: number;
  averageTimeSeconds: number;
  status: "Mastered" | "Proficient" | "Weak";
}

interface WeakArea {
  topicId: string;
  topicName: string;
  severity: "critical" | "high" | "medium";
  masteryPercentage: number;
  recommendedIntervention: string;
  estimatedRecoveryHours: number;
  prerequisitesMissing: string[];
}

interface ExamSummary {
  examId: string;
  examTitle: string;
  attempts: number;
  bestPercentage: number;
  cohortAveragePercentage: number | null;
}

interface StudentAnalytics {
  hasData: boolean;
  totalAttempts: number;
  questionsAnswered: number;
  overallMastery: number;
  averagePercentage: number;
  totalStudySeconds: number;
  topics: TopicPerformance[];
  weakAreas: WeakArea[];
  exams: ExamSummary[];
  coarseTopicsOnly: boolean;
}

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeFilter, setActiveFilter] = useState<"All" | "Weak" | "Mastered">("All");
  const [data, setData] = useState<StudentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);
      const token = await currentUser.getIdToken();
      const res = await fetch("/api/me/analytics", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to load analytics");
      setData(body);
    } catch (err) {
      console.error("Analytics load failed:", err);
      setError("Could not load your analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    load();
  }, [authLoading, user, load]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-zinc-50/40">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">
          Analysing your attempts
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <EmptyState
        title="Sign in to see your analytics"
        body="Your mastery breakdown is built from your own exam attempts."
        ctaHref="/login"
        ctaLabel="Log in"
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Something went wrong"
        body={error}
        ctaHref="/analytics"
        ctaLabel="Try again"
      />
    );
  }

  if (!data?.hasData) {
    return (
      <EmptyState
        title="No attempts yet"
        body="Sit your first mock exam and this page fills in with your real mastery, weak areas, and recommended next steps."
        ctaHref="/exams"
        ctaLabel="Browse exams"
      />
    );
  }

  const filteredTopics = data.topics.filter((topic) => {
    if (activeFilter === "Weak") return topic.status === "Weak";
    if (activeFilter === "Mastered") return topic.status === "Mastered";
    return true;
  });

  const averageSeconds =
    data.questionsAnswered > 0 ? Math.round(data.totalStudySeconds / data.questionsAnswered) : 0;

  // Gaps come from the detector, grouped so each subject card shows its own.
  const gapsByTopic = new Map(data.weakAreas.map((area) => [area.topicId, area]));

  return (
    <div className="min-h-screen bg-zinc-50/40 pb-20 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          badge="AI-Powered Diagnostics"
          title="Your learning analytics"
          subtitle="Built from your own attempts — mastery, weak areas, and what to do next."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Target className="w-4 h-4" />}
            label="Overall Mastery"
            value={`${data.overallMastery}%`}
            subValue={`Across ${data.topics.length} topic${data.topics.length === 1 ? "" : "s"}`}
          />
          <StatCard
            icon={<Clock className="w-4 h-4" />}
            label="Average Speed"
            value={`${averageSeconds}s`}
            subValue="Per question (approx.)"
          />
          <StatCard
            icon={<Zap className="w-4 h-4" />}
            label="Questions Answered"
            value={String(data.questionsAnswered)}
            subValue={`Over ${data.totalAttempts} attempt${data.totalAttempts === 1 ? "" : "s"}`}
          />
          <StatCard
            icon={<TrendingUp className="w-4 h-4" />}
            label="Average Score"
            value={`${data.averagePercentage}%`}
            subValue={`${formatDuration(data.totalStudySeconds)} practised`}
          />
        </div>

        {data.coarseTopicsOnly && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-blue-50/60 border border-blue-100">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-600 leading-relaxed">
              These topics are grouped by subject. Once written answers are graded — or questions are
              tagged with a topic — this breaks down to individual concepts automatically.
            </p>
          </div>
        )}

        {data.weakAreas.length > 0 && (
          <SectionCard
            title="What to fix first"
            description="Ranked by severity, worst first"
            actions={
              <Link
                href="/practice"
                className="px-3.5 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Target className="w-3.5 h-3.5" />
                Fix my weak spots
              </Link>
            }
          >
            <div className="space-y-2.5">
              {data.weakAreas.slice(0, 4).map((area) => (
                <div
                  key={area.topicId}
                  className="p-4 rounded-lg border border-zinc-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-zinc-900">{area.topicName}</h3>
                      <SeverityBadge severity={area.severity} />
                    </div>
                    <p className="text-xs text-zinc-500">
                      {area.recommendedIntervention} · about {area.estimatedRecoveryHours}h to recover
                    </p>
                    {area.prerequisitesMissing.length > 0 && (
                      <p className="text-xs text-amber-700">
                        Missing prerequisites: {area.prerequisitesMissing.join(", ")}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/practice?topic=${encodeURIComponent(area.topicId)}`}
                    className="px-3.5 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 flex-shrink-0 w-fit"
                  >
                    <span>Drill this</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        <SectionCard
          title="Topic mastery"
          description="Marks earned as a share of marks available"
          actions={
            <div className="flex gap-1.5">
              {(["All", "Weak", "Mastered"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border ${
                    activeFilter === filter
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white text-zinc-600 hover:bg-zinc-50 border-zinc-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          }
        >
          {filteredTopics.length === 0 ? (
            <p className="text-sm text-zinc-500 py-6 text-center">
              No topics in this category yet.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredTopics.map((topic, idx) => {
                const gap = gapsByTopic.get(topic.topicId);
                return (
                  <motion.div
                    key={topic.topicId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                    className="p-5 rounded-lg border border-zinc-200 bg-white space-y-4 hover:border-primary-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-sm font-semibold text-zinc-900">{topic.topicName}</h3>
                          {topic.status === "Weak" ? (
                            <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[11px] font-semibold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Needs attention
                            </span>
                          ) : topic.status === "Mastered" ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Mastered
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">
                              Proficient
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500">
                          {topic.questionsAttempted} question
                          {topic.questionsAttempted === 1 ? "" : "s"} answered · {topic.accuracy}% accuracy
                          {topic.averageTimeSeconds > 0 && ` · ~${topic.averageTimeSeconds}s each`}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-zinc-900 tabular-nums">
                            {topic.masteryPercentage}%
                          </div>
                          <div className="text-[10px] text-zinc-400 uppercase font-semibold">Mastery</div>
                        </div>

                        <Link
                          href={`/practice?topic=${encodeURIComponent(topic.topicId)}`}
                          className="px-3.5 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                        >
                          <span>Drill</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          topic.masteryPercentage >= 85
                            ? "bg-emerald-600"
                            : topic.masteryPercentage >= 70
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(100, topic.masteryPercentage)}%` }}
                      />
                    </div>

                    {gap && (
                      <div className="p-3.5 rounded-md bg-red-50/60 border border-red-100 space-y-1">
                        <span className="text-[11px] font-semibold uppercase text-red-700 tracking-wide flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Recommended next step
                        </span>
                        <p className="text-xs text-zinc-600 leading-relaxed">
                          {gap.recommendedIntervention}
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {data.exams.length > 0 && (
          <SectionCard title="Exams you've sat" description="Your best score against the cohort average">
            <div className="space-y-2.5">
              {data.exams.map((exam) => (
                <div
                  key={exam.examId}
                  className="p-4 rounded-lg border border-zinc-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="text-sm font-semibold text-zinc-900 truncate">{exam.examTitle}</h3>
                    <p className="text-xs text-zinc-500">
                      {exam.attempts} attempt{exam.attempts === 1 ? "" : "s"}
                      {exam.cohortAveragePercentage !== null &&
                        ` · cohort average ${exam.cohortAveragePercentage}%`}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-lg font-bold text-zinc-900 tabular-nums">
                        {exam.bestPercentage}%
                      </div>
                      <div className="text-[10px] text-zinc-400 uppercase font-semibold">Best</div>
                    </div>
                    <Link
                      href={`/exams/${exam.examId}/take`}
                      className="px-3.5 py-2 rounded-md border border-zinc-200 hover:border-primary-300 hover:bg-primary-50/40 text-zinc-700 font-semibold text-xs transition-colors"
                    >
                      Retake
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: "critical" | "high" | "medium" }) {
  const styles = {
    critical: "bg-red-50 text-red-700 border-red-200",
    high: "bg-amber-50 text-amber-700 border-amber-200",
    medium: "bg-zinc-100 text-zinc-600 border-zinc-200",
  } as const;

  return (
    <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold capitalize ${styles[severity]}`}>
      {severity}
    </span>
  );
}

function EmptyState({
  title,
  body,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="min-h-screen bg-zinc-50/40 flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200 text-primary-600 flex items-center justify-center mx-auto">
          <Sparkles className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-zinc-900">{title}</h1>
        <p className="text-sm text-zinc-500 leading-relaxed">{body}</p>
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors"
        >
          {ctaLabel}
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
