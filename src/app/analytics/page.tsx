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
  GraduationCap,
  Award,
  Compass,
  BarChart3,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState, useMemo } from "react";
import { PageHeader, SectionCard, StatCard } from "@/components/UIComponents";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

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
  latestPercentage?: number;
  cohortAveragePercentage: number | null;
  lastAttemptedAt?: string;
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

interface Certificate {
  id: string;
  code: string;
  exam_title: string;
  percentage: number;
  issued_at: string;
}

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

function mapTopicToPath(topicName: string) {
  const lower = topicName.toLowerCase();
  if (lower.includes("programming") || lower.includes("c ") || lower.includes("math") || lower.includes("calculus")) {
    return {
      pathId: "bit-first-year-foundations",
      title: "First-Year Foundations",
      action: "Enroll in Foundations Path",
    };
  }
  if (lower.includes("data") || lower.includes("structure") || lower.includes("algorithm") || lower.includes("software")) {
    return {
      pathId: "bit-software-engineering-core",
      title: "Software Engineering Core",
      action: "Bridge via SE Core Path",
    };
  }
  if (lower.includes("database") || lower.includes("dbms") || lower.includes("sql")) {
    return {
      pathId: "bit-data-systems-mastery",
      title: "Data Systems Mastery",
      action: "Practice SQL in Data Systems Path",
    };
  }
  if (lower.includes("network") || lower.includes("security") || lower.includes("crypto")) {
    return {
      pathId: "bit-networking-intelligence",
      title: "Networking & Security",
      action: "Take Network Systems Path",
    };
  }
  return {
    pathId: "bit-software-engineering-core",
    title: "Curated Degree Path",
    action: "Enroll in Recommended Path",
  };
}

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeFilter, setActiveFilter] = useState<"All" | "Weak" | "Mastered">("All");
  const [data, setData] = useState<StudentAnalytics | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);
      const token = await currentUser.getIdToken();

      const [analyticsRes, certRes] = await Promise.all([
        fetch("/api/me/analytics", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }),
        fetch("/api/me/certificates", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }),
      ]);

      const body = await analyticsRes.json();
      if (!analyticsRes.ok) throw new Error(body.error ?? "Failed to load analytics");
      setData(body);

      if (certRes.ok) {
        const certData = await certRes.json();
        setCertificates(certData.certificates ?? []);
      }

      // Query Firestore course enrollments for certificate tracking
      const qEnroll = query(
        collection(db, "studentCourseEnrollments"),
        where("userId", "==", currentUser.uid)
      );
      const enrollSnap = await getDocs(qEnroll);
      setEnrollments(enrollSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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

  const filteredTopics = useMemo(() => {
    if (!data?.topics) return [];
    return data.topics.filter((topic) => {
      if (activeFilter === "Weak") return topic.status === "Weak";
      if (activeFilter === "Mastered") return topic.status === "Mastered";
      return true;
    });
  }, [data, activeFilter]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-zinc-50/40">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">
          Analysing your attempts &amp; course progress
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <EmptyState
        title="Sign in to see your analytics"
        body="Your mastery breakdown is built from your own exam attempts and course progression."
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
        body="Sit your first mock exam or enroll in courses, and this page fills in with your real mastery heatmap, weak areas, and recommended learning paths."
        ctaHref="/exams"
        ctaLabel="Browse exams"
      />
    );
  }

  const averageSeconds =
    data.questionsAnswered > 0 ? Math.round(data.totalStudySeconds / data.questionsAnswered) : 0;

  const gapsByTopic = new Map(data.weakAreas.map((area) => [area.topicId, area]));

  return (
    <div className="min-h-screen bg-zinc-50/40 pb-20 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          badge="AI-Powered Diagnostics &amp; Degree Progress"
          title="Your Learning Analytics"
          subtitle="Built from your own attempts — mastery, topic heatmap, weak areas, and degree certificate progression."
        />

        {/* Top KPIs */}
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

        {/* 1. Course Progress Heatmap (Topics × Accuracy) */}
        <SectionCard
          title="Course Progress Heatmap"
          description="Visual intensity matrix: Topics × Accuracy breakdown across syllabus subjects"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-zinc-600 pb-2 border-b border-zinc-100">
              <span>Color gradient indicates performance level:</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
                  <span>≥ 85% Mastered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block" />
                  <span>70-84% Proficient</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-red-500 inline-block" />
                  <span>&lt; 70% Weak Spot</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.topics.map((t) => {
                const heatColor =
                  t.accuracy >= 85
                    ? "border-emerald-200 bg-emerald-50/40 text-emerald-950"
                    : t.accuracy >= 70
                    ? "border-amber-200 bg-amber-50/40 text-amber-950"
                    : "border-red-200 bg-red-50/40 text-red-950";

                const barColor =
                  t.accuracy >= 85
                    ? "bg-emerald-500"
                    : t.accuracy >= 70
                    ? "bg-amber-500"
                    : "bg-red-500";

                return (
                  <div
                    key={t.topicId}
                    className={`p-4 rounded-xl border ${heatColor} transition-all hover:shadow-xs flex flex-col justify-between`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900 line-clamp-1">{t.topicName}</span>
                        <span className="text-xs font-extrabold tabular-nums px-2 py-0.5 rounded-full bg-white border border-zinc-200">
                          {t.accuracy}%
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        {t.questionsAttempted} question{t.questionsAttempted === 1 ? "" : "s"} · {t.masteryPercentage}% mastery
                      </p>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-200/80 overflow-hidden mt-3">
                      <div
                        className={`h-full rounded-full ${barColor}`}
                        style={{ width: `${Math.max(5, t.accuracy)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionCard>

        {/* 2. Weak Topics with Recommended Learning Paths */}
        {data.weakAreas.length > 0 && (
          <SectionCard
            title="Weak Areas &amp; Recommended Learning Paths"
            description="Identified conceptual gaps mapped to curated degree pathways"
            actions={
              <Link
                href="/learning-paths"
                className="px-3.5 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                Browse All Learning Paths
              </Link>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.weakAreas.slice(0, 4).map((area) => {
                const pathRec = mapTopicToPath(area.topicName);
                return (
                  <div
                    key={area.topicId}
                    className="p-5 rounded-xl border border-zinc-200 bg-white space-y-3 hover:border-primary-400 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-zinc-900">{area.topicName}</h3>
                          <SeverityBadge severity={area.severity} />
                        </div>
                        <span className="text-xs font-bold text-red-600">
                          {area.masteryPercentage}% mastery
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed">
                        {area.recommendedIntervention}
                      </p>
                      {area.prerequisitesMissing.length > 0 && (
                        <p className="text-[11px] text-amber-700 font-medium">
                          Prerequisites needed: {area.prerequisitesMissing.join(", ")}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase font-bold text-zinc-400">Path Solution</p>
                        <p className="text-xs font-bold text-zinc-800 truncate">{pathRec.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/practice?topic=${encodeURIComponent(area.topicId)}`}
                          className="px-2.5 py-1.5 rounded-md border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold text-xs"
                        >
                          Drill
                        </Link>
                        <Link
                          href={`/learning-paths/${pathRec.pathId}`}
                          className="px-3 py-1.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs flex items-center gap-1"
                        >
                          <span>Path</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        )}

        {/* 3. Detailed Topic Mastery Breakdown */}
        <SectionCard
          title="Topic Mastery Details"
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

        {/* 4. Exam Trend (Scores Over Time Per Course) & Certificate Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exam Trend Section */}
          <div className="lg:col-span-2">
            <SectionCard
              title="Exam Score Trend Over Time"
              description="Chronological attempt results against cohort benchmarks"
            >
              <div className="space-y-3">
                {data.exams.map((exam) => (
                  <div
                    key={exam.examId}
                    className="p-4 rounded-xl border border-zinc-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-300 transition-colors"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <h3 className="text-sm font-bold text-zinc-900 truncate">{exam.examTitle}</h3>
                      <p className="text-xs text-zinc-500">
                        {exam.attempts} attempt{exam.attempts === 1 ? "" : "s"}
                        {exam.cohortAveragePercentage !== null &&
                          ` · cohort average ${exam.cohortAveragePercentage}%`}
                        {exam.lastAttemptedAt &&
                          ` · sat on ${new Date(exam.lastAttemptedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-lg font-bold text-zinc-900 tabular-nums">
                          {exam.bestPercentage}%
                        </div>
                        <div className="text-[10px] text-zinc-400 uppercase font-semibold">Best Score</div>
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
          </div>

          {/* Certificate Tracker */}
          <div>
            <SectionCard
              title="Certificate Tracker"
              description="Mastery credentials &amp; syllabus awards"
            >
              <div className="space-y-4">
                {certificates.length > 0 ? (
                  certificates.map((cert) => (
                    <div
                      key={cert.id || cert.code}
                      className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-200 text-purple-800">
                          {cert.code}
                        </span>
                        <span className="text-xs font-extrabold text-purple-700">{cert.percentage}%</span>
                      </div>
                      <h4 className="text-xs font-bold text-zinc-900 line-clamp-1">{cert.exam_title}</h4>
                      <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-500">
                        <span>Issued: {new Date(cert.issued_at).toLocaleDateString()}</span>
                        <Link
                          href={`/verify/${cert.code}`}
                          className="font-bold text-primary-600 hover:underline flex items-center gap-0.5"
                        >
                          Verify <ArrowUpRight className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                    <Award className="w-6 h-6 text-zinc-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-zinc-700">No Exam Certificates Yet</p>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Score 80%+ on any past university paper to auto-generate a verifiable mastery credential.
                    </p>
                  </div>
                )}

                {/* Course Syllabus Certificate Eligibility */}
                <div className="pt-2 border-t border-zinc-100 space-y-2.5">
                  <h4 className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-primary-600" />
                    Degree Module Completion
                  </h4>
                  {enrollments.length === 0 ? (
                    <p className="text-[11px] text-zinc-400">
                      Enroll in university courses from your dashboard to track syllabus completion.
                    </p>
                  ) : (
                    enrollments.map((en) => {
                      const pct = en.completionPercentage || 0;
                      const eligible = pct >= 90;
                      return (
                        <div key={en.courseId} className="p-3 rounded-lg border border-zinc-100 bg-zinc-50/50 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-zinc-800">{en.courseId}</span>
                            <span className={`font-bold tabular-nums ${eligible ? "text-emerald-600" : "text-zinc-600"}`}>
                              {pct}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${eligible ? "bg-emerald-500" : "bg-primary-600"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-zinc-500">
                            {eligible ? "Eligible for certificate" : "Target: 90% for syllabus completion certificate"}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
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
