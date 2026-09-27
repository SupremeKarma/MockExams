"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  TrendingUp,
  BookOpen,
  FileText,
  Award,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Flame,
  CheckCircle2,
  Compass,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface TopicHeatmapItem {
  topicId: string;
  name: string;
  courseCode: string;
  accuracy: number;
  questionsAttempted: number;
  masteryLevel: "Mastered" | "Proficient" | "Needs Review";
}

interface ExamTrendItem {
  examId: string;
  title: string;
  courseCode: string;
  percentage: number;
  date: string;
}

interface RecommendedPath {
  pathId: string;
  title: string;
  description: string;
  targetWeakTopic: string;
  difficulty: string;
  href: string;
}

export const StudentDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    if (authLoading || !user) {
      if (!authLoading && !user) setLoading(false);
      return;
    }

    async function loadDashboardData() {
      try {
        setLoading(true);
        const token = await user?.getIdToken();

        // 1. Fetch live attempts and course enrollments directly from Firestore
        const qAttempts = query(
          collection(db, "exam_attempts"),
          where("user_id", "==", user?.uid)
        );
        const qEnrollments = query(
          collection(db, "studentCourseEnrollments"),
          where("userId", "==", user?.uid)
        );

        const [attemptsSnap, enrollSnap] = await Promise.all([
          getDocs(qAttempts),
          getDocs(qEnrollments),
        ]);

        const rawAttempts = attemptsSnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => {
            const timeA = new Date(a.attempted_at || 0).getTime();
            const timeB = new Date(b.attempted_at || 0).getTime();
            return timeB - timeA;
          });

        setAttempts(rawAttempts);
        setEnrollments(enrollSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

        // 2. Fetch server-aggregated analytics & certificates
        if (token) {
          const [analyticsRes, certRes] = await Promise.all([
            fetch("/api/me/analytics", {
              headers: { Authorization: `Bearer ${token}` },
              cache: "no-store",
            }).catch(() => null),
            fetch("/api/me/certificates", {
              headers: { Authorization: `Bearer ${token}` },
              cache: "no-store",
            }).catch(() => null),
          ]);

          if (analyticsRes && analyticsRes.ok) {
            setAnalyticsData(await analyticsRes.json());
          }
          if (certRes && certRes.ok) {
            const certData = await certRes.json();
            setCertificates(certData.certificates || []);
          }
        }
      } catch (err) {
        console.error("StudentDashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user, authLoading]);

  // Extract Topic Heatmap (Topics × Accuracy)
  const topicHeatmap = useMemo<TopicHeatmapItem[]>(() => {
    if (analyticsData?.topics && analyticsData.topics.length > 0) {
      return analyticsData.topics.map((t: any) => {
        let courseCode = "CORE";
        const upper = t.topicName.toUpperCase();
        if (upper.includes("BIT101") || upper.includes("ALGEBRA") || upper.includes("CALCULUS")) courseCode = "BIT101MS";
        else if (upper.includes("BIT102") || upper.includes("C PROG") || upper.includes("C ")) courseCode = "BIT102CO";
        else if (upper.includes("BIT201") || upper.includes("DSA") || upper.includes("STRUCTURE")) courseCode = "BIT201CO";
        else if (upper.includes("BIT202") || upper.includes("DBMS") || upper.includes("DATABASE") || upper.includes("SQL")) courseCode = "BIT202CO";
        else if (upper.includes("BIT301") || upper.includes("NETWORK") || upper.includes("IP")) courseCode = "BIT301CO";
        else if (upper.includes("BIT302") || upper.includes("SECURITY") || upper.includes("CRYPTO")) courseCode = "BIT302CO";

        return {
          topicId: t.topicId,
          name: t.topicName,
          courseCode,
          accuracy: Math.round(t.accuracy || 0),
          questionsAttempted: t.questionsAttempted || 0,
          masteryLevel: t.accuracy >= 85 ? "Mastered" : t.accuracy >= 70 ? "Proficient" : "Needs Review",
        };
      });
    }

    // Fallback computed from raw attempt breakdowns
    const topicMap = new Map<string, { correct: number; total: number; name: string }>();
    attempts.forEach((att) => {
      const breakdown = att?.answers_json?.breakdown;
      if (Array.isArray(breakdown)) {
        breakdown.forEach((item: any) => {
          const name = item.topic || att.exam_title || "General";
          const current = topicMap.get(name) || { correct: 0, total: 0, name };
          current.total += 1;
          if (item.isCorrect) current.correct += 1;
          topicMap.set(name, current);
        });
      }
    });

    return Array.from(topicMap.values()).map((item, idx) => {
      const accuracy = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
      return {
        topicId: `topic-${idx}`,
        name: item.name,
        courseCode: "DEGREE",
        accuracy,
        questionsAttempted: item.total,
        masteryLevel: accuracy >= 85 ? "Mastered" : accuracy >= 70 ? "Proficient" : "Needs Review",
      };
    });
  }, [analyticsData, attempts]);

  // Extract Weak Topics and Map to Curated Learning Paths
  const weakTopicRecommendations = useMemo<RecommendedPath[]>(() => {
    const weakList = topicHeatmap.filter((t) => t.accuracy < 70);
    const recommendations: RecommendedPath[] = [];

    weakList.slice(0, 3).forEach((item) => {
      const lower = item.name.toLowerCase();
      if (lower.includes("c ") || lower.includes("programming") || lower.includes("math") || lower.includes("algebra")) {
        recommendations.push({
          pathId: "bit-first-year-foundations",
          title: "First-Year Computing Foundations",
          description: `Reinforce ${item.name} with systematic fundamental drills and past university question reviews.`,
          targetWeakTopic: item.name,
          difficulty: "Beginner to Intermediate",
          href: "/learning-paths/bit-first-year-foundations",
        });
      } else if (lower.includes("data") || lower.includes("structure") || lower.includes("algorithm") || lower.includes("software")) {
        recommendations.push({
          pathId: "bit-software-engineering-core",
          title: "Software Engineering Core",
          description: `Targeting weak concept ${item.name} with rigorous DSA and architecture modules.`,
          targetWeakTopic: item.name,
          difficulty: "Intermediate",
          href: "/learning-paths/bit-software-engineering-core",
        });
      } else if (lower.includes("sql") || lower.includes("dbms") || lower.includes("database")) {
        recommendations.push({
          pathId: "bit-data-systems-mastery",
          title: "Data Systems Mastery",
          description: `Boost ${item.name} mastery with schema normalization and relational SQL paper solutions.`,
          targetWeakTopic: item.name,
          difficulty: "Advanced",
          href: "/learning-paths/bit-data-systems-mastery",
        });
      } else {
        recommendations.push({
          pathId: "bit-networking-intelligence",
          title: "Networking & Distributed Systems",
          description: `Cover ${item.name} via protocol analysis and verified university exam papers.`,
          targetWeakTopic: item.name,
          difficulty: "Advanced",
          href: "/learning-paths/bit-networking-intelligence",
        });
      }
    });

    // Provide default fallback recommendations if user has high mastery
    if (recommendations.length === 0) {
      recommendations.push({
        pathId: "bit-software-engineering-core",
        title: "Software Engineering Core",
        description: "Maintain peak readiness across Data Structures, Algorithms, and Software Engineering principles.",
        targetWeakTopic: "Core Curriculum",
        difficulty: "Intermediate",
        href: "/learning-paths/bit-software-engineering-core",
      });
      recommendations.push({
        pathId: "bit-cybersecurity-specialization",
        title: "Cybersecurity & Information Defense",
        description: "Explore cryptographic protocols, network defense mechanisms, and ethical penetration testing.",
        targetWeakTopic: "Specialized Elective",
        difficulty: "Advanced",
        href: "/learning-paths/bit-cybersecurity-specialization",
      });
    }

    return recommendations;
  }, [topicHeatmap]);

  // Exam Score Trend Over Time Per Course
  const examTrends = useMemo<ExamTrendItem[]>(() => {
    return attempts.slice(0, 8).map((att) => {
      const title = att.exam_title || "Mock Assessment";
      let courseCode = "EXAM";
      const match = title.match(/BIT\d{3}[A-Z]{2}/i);
      if (match) courseCode = match[0].toUpperCase();

      return {
        examId: att.exam_id || att.id,
        title,
        courseCode,
        percentage: Math.round(Number(att.percentage) || 0),
        date: att.attempted_at ? new Date(att.attempted_at).toLocaleDateString() : "Recent",
      };
    });
  }, [attempts]);

  // High-level Stats Calculation
  const stats = useMemo(() => {
    const totalAttemptsCount = attempts.length;
    const totalTimeSeconds = attempts.reduce((acc, curr) => acc + (Number(curr.time_spent_seconds) || 0), 0);
    const studyHours = (totalTimeSeconds / 3600).toFixed(1);
    const overallMastery = analyticsData?.overallMastery ?? (
      totalAttemptsCount > 0
        ? Math.round(attempts.reduce((acc, curr) => acc + (Number(curr.percentage) || 0), 0) / totalAttemptsCount)
        : 0
    );

    return {
      examsCount: totalAttemptsCount,
      studyHours: `${studyHours}h`,
      mastery: `${overallMastery}%`,
      activeCourses: enrollments.length,
      certificatesCount: certificates.length,
    };
  }, [attempts, enrollments, certificates, analyticsData]);

  if (loading) {
    return (
      <div className="p-8 space-y-4 animate-pulse">
        <div className="h-28 bg-zinc-100 rounded-2xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-zinc-100 rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-zinc-100 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner & KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Exams Completed</p>
            <h3 className="text-2xl font-extrabold text-zinc-900 mt-1 tabular-nums">{stats.examsCount}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Live assessment history</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Total Practice Time</p>
            <h3 className="text-2xl font-extrabold text-zinc-900 mt-1 tabular-nums">{stats.studyHours}</h3>
            <p className="text-[11px] text-blue-600 font-semibold mt-0.5">Time on diagnostic test sets</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Overall Mastery</p>
            <h3 className="text-2xl font-extrabold text-zinc-900 mt-1 tabular-nums">{stats.mastery}</h3>
            <p className="text-[11px] text-purple-600 font-semibold mt-0.5">Across all attempted modules</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Mastery Certificates</p>
            <h3 className="text-2xl font-extrabold text-zinc-900 mt-1 tabular-nums">{stats.certificatesCount}</h3>
            <p className="text-[11px] text-amber-600 font-semibold mt-0.5">
              {enrollments.some((e) => (e.completionPercentage || 0) >= 90)
                ? "Eligible for graduation award"
                : "Threshold: 90% syllabus"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 1. Course Progress Heatmap (Topics × Accuracy) */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
                <BarChart3 className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-zinc-900">Course Progress Heatmap</h2>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Real-time syllabus concept performance: Topics × Accuracy breakdown
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-zinc-600">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span>≥ 85% Mastered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-amber-500" />
              <span>70-84% Proficient</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-red-500" />
              <span>&lt; 70% Weak</span>
            </div>
          </div>
        </div>

        {topicHeatmap.length === 0 ? (
          <div className="p-8 text-center bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200">
            <Sparkles className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-zinc-800">No topic performance data yet</p>
            <p className="text-xs text-zinc-500 mt-1 mb-4">
              Complete mock exams or course chapters to render your personalized diagnostic heatmap.
            </p>
            <Link
              href="/exams"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors inline-block"
            >
              Take a Diagnostic Exam
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topicHeatmap.map((topic) => {
              const bgBadge =
                topic.accuracy >= 85
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : topic.accuracy >= 70
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-red-50 text-red-700 border-red-200";

              const heatBarColor =
                topic.accuracy >= 85
                  ? "bg-emerald-500"
                  : topic.accuracy >= 70
                  ? "bg-amber-500"
                  : "bg-red-500";

              return (
                <div
                  key={topic.topicId}
                  className="p-4 rounded-xl border border-zinc-200 hover:border-primary-400 transition-all bg-zinc-50/40 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-200/80 text-zinc-700 uppercase">
                        {topic.courseCode}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${bgBadge}`}>
                        {topic.accuracy}%
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 line-clamp-1">{topic.name}</h3>
                    <p className="text-[11px] text-zinc-500">
                      {topic.questionsAttempted} question{topic.questionsAttempted === 1 ? "" : "s"} answered
                    </p>
                  </div>
                  <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full rounded-full transition-all ${heatBarColor}`}
                      style={{ width: `${Math.max(5, topic.accuracy)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Weak Topics with Recommended Learning Paths */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Compass className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-zinc-900">Weak Topics & Recommended Learning Paths</h2>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Curated degree pathways specifically formulated to bridge identified conceptual gaps
            </p>
          </div>
          <Link
            href="/learning-paths"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            Explore All Paths <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weakTopicRecommendations.map((path) => (
            <div
              key={path.pathId}
              className="p-5 rounded-xl border border-zinc-200 bg-linear-to-br from-white to-zinc-50/50 hover:border-primary-400 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Fix: {path.targetWeakTopic}
                  </span>
                  <span className="text-[11px] font-medium text-zinc-500">{path.difficulty}</span>
                </div>
                <h3 className="text-base font-bold text-zinc-900">{path.title}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">{path.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-zinc-500">Degree Alignment: BIT Curricula</span>
                <Link
                  href={path.href}
                  className="px-3.5 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  Enroll In Path <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Exam Score Trends & 4. Certificate Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exam Score Trends Over Time */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <TrendingUp className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Exam Score Trajectory</h2>
                <p className="text-xs text-zinc-500">Chronological performance trend per course examination</p>
              </div>
            </div>
            <Link href="/exams" className="text-xs font-bold text-primary-600 hover:text-primary-700">
              Take New Exam →
            </Link>
          </div>

          {examTrends.length === 0 ? (
            <div className="p-8 text-center bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200">
              <p className="text-xs text-zinc-500">No examination attempts recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {examTrends.map((trend) => (
                <div
                  key={trend.examId}
                  className="p-3.5 rounded-xl bg-zinc-50/60 border border-zinc-100 flex items-center justify-between hover:bg-zinc-100/60 transition-colors"
                >
                  <div className="space-y-0.5 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700">
                        {trend.courseCode}
                      </span>
                      <h4 className="text-sm font-bold text-zinc-900 truncate">{trend.title}</h4>
                    </div>
                    <p className="text-[11px] text-zinc-400">{trend.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className={`text-base font-extrabold tabular-nums ${
                        trend.percentage >= 80
                          ? "text-emerald-600"
                          : trend.percentage >= 60
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    >
                      {trend.percentage}%
                    </span>
                    <p className="text-[10px] font-semibold text-zinc-400">Score</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certificate Tracker */}
        <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <GraduationCap className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Certificate Tracker</h2>
                <p className="text-xs text-zinc-500">Verified credentials</p>
              </div>
            </div>
            <Link href="/certificates" className="text-xs font-bold text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {certificates.length > 0 ? (
              certificates.slice(0, 3).map((cert: any) => (
                <div
                  key={cert.id || cert.code}
                  className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-200 text-purple-800">
                      {cert.code}
                    </span>
                    <span className="text-xs font-extrabold text-purple-700">{cert.percentage}%</span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 line-clamp-1">{cert.exam_title}</h4>
                  <p className="text-[10px] text-zinc-500">Issued: {new Date(cert.issued_at).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center bg-zinc-50 rounded-xl border border-zinc-100">
                <Award className="w-6 h-6 text-zinc-400 mx-auto mb-1" />
                <p className="text-xs font-bold text-zinc-700">No certificates yet</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Achieve ≥ 80% on mock exams or ≥ 90% syllabus completion to unlock certificates.
                </p>
              </div>
            )}

            {/* Course near-completion tracker */}
            {enrollments.length > 0 && (
              <div className="pt-2 border-t border-zinc-100">
                <p className="text-[11px] font-bold text-zinc-600 mb-2">Progress to Degree Awards:</p>
                {enrollments.slice(0, 2).map((e: any) => (
                  <div key={e.courseId} className="space-y-1 mb-2">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-zinc-700">{e.courseId}</span>
                      <span className="text-primary-600 tabular-nums">{e.completionPercentage || 0}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full"
                        style={{ width: `${e.completionPercentage || 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
