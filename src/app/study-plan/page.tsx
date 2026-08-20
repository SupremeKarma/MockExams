"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Target,
  BookOpen,
  Zap,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Edit2,
  Plus,
  Brain,
  Code2,
  Sparkles,
  Download,
  Share2,
  Bell,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

interface StudySession {
  id: string;
  day: string;
  time: string;
  duration: number;
  subject: string;
  topic: string;
  type: "lecture" | "practice" | "flashcards" | "project";
  difficulty: "Easy" | "Medium" | "Hard";
  status: "completed" | "pending" | "in-progress";
}

interface WeeklyPlan {
  weekNumber: number;
  startDate: string;
  focus: string;
  goals: string[];
  sessions: StudySession[];
  completionRate: number;
}

const SAMPLE_WEEKLY_PLAN: WeeklyPlan = {
  weekNumber: 1,
  startDate: "Aug 20 - Aug 26, 2026",
  focus: "Data Structures: Arrays & Linked Lists",
  goals: [
    "Complete array operations (insert, delete, search)",
    "Understand singly and doubly linked lists",
    "Solve 15+ LeetCode problems",
    "Implement custom array and linked list classes",
  ],
  sessions: [
    {
      id: "1",
      day: "Monday",
      time: "08:00 AM",
      duration: 60,
      subject: "Data Structures",
      topic: "Arrays - Fundamentals & Operations",
      type: "lecture",
      difficulty: "Easy",
      status: "completed",
    },
    {
      id: "2",
      day: "Monday",
      time: "04:00 PM",
      duration: 45,
      subject: "Data Structures",
      topic: "Array Practice Problems (Level 1-2)",
      type: "practice",
      difficulty: "Easy",
      status: "completed",
    },
    {
      id: "3",
      day: "Tuesday",
      time: "09:00 AM",
      duration: 60,
      subject: "Data Structures",
      topic: "Linked Lists - Singly & Doubly",
      type: "lecture",
      difficulty: "Medium",
      status: "in-progress",
    },
    {
      id: "4",
      day: "Tuesday",
      time: "05:00 PM",
      duration: 30,
      subject: "Programming in C",
      topic: "Pointer Arithmetic Review",
      type: "flashcards",
      difficulty: "Medium",
      status: "pending",
    },
    {
      id: "5",
      day: "Wednesday",
      time: "02:00 PM",
      duration: 90,
      subject: "Data Structures",
      topic: "Linked Lists - Advanced Operations",
      type: "practice",
      difficulty: "Medium",
      status: "pending",
    },
    {
      id: "6",
      day: "Thursday",
      time: "08:00 AM",
      duration: 120,
      subject: "Data Structures",
      topic: "Build Custom Linked List Implementation",
      type: "project",
      difficulty: "Hard",
      status: "pending",
    },
    {
      id: "7",
      day: "Friday",
      time: "04:00 PM",
      duration: 60,
      subject: "Data Structures",
      topic: "LeetCode Hard Problems - Linked Lists",
      type: "practice",
      difficulty: "Hard",
      status: "pending",
    },
    {
      id: "8",
      day: "Saturday",
      time: "10:00 AM",
      duration: 90,
      subject: "Database",
      topic: "Normalization - BCNF & Decomposition",
      type: "lecture",
      difficulty: "Hard",
      status: "pending",
    },
  ],
  completionRate: 25,
};

const WEAK_AREAS = [
  {
    id: "1",
    subject: "Mathematics-I",
    topic: "Integration by Partial Fractions",
    priority: "Very High",
    recommendedAction: "Daily flashcards + 2 problem sets",
  },
  {
    id: "2",
    subject: "Data Structures",
    topic: "AVL Tree Rotations",
    priority: "High",
    recommendedAction: "Visual learning + animated examples",
  },
  {
    id: "3",
    subject: "DBMS",
    topic: "Query Optimization",
    priority: "High",
    recommendedAction: "Practice 10 real-world scenarios",
  },
];

const RECOMMENDATIONS = [
  {
    id: "1",
    title: "Focus on Weak Areas First",
    description: "Allocate 40% of your study time to weak areas to maximize improvement",
    action: "View Analytics",
    icon: AlertTriangle,
  },
  {
    id: "2",
    title: "Increase Study Duration",
    description: "Your current weekly study is 7.5 hours. Aim for 12 hours to reach your goal",
    action: "Adjust Plan",
    icon: Clock,
  },
  {
    id: "3",
    title: "Start Revision Early",
    description: "Begin flashcard revision 2 weeks before exams for better retention",
    action: "Set Reminder",
    icon: Bell,
  },
];

export default function StudyPlanPage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [showWeeklyBreakdown, setShowWeeklyBreakdown] = useState(false);

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const sessionsForSelectedDay = selectedDay
    ? SAMPLE_WEEKLY_PLAN.sessions.filter((s) => s.day === selectedDay)
    : [];

  const getTypeIcon = (type: StudySession["type"]) => {
    switch (type) {
      case "lecture":
        return <BookOpen className="w-4 h-4" />;
      case "practice":
        return <Code2 className="w-4 h-4" />;
      case "flashcards":
        return <Brain className="w-4 h-4" />;
      case "project":
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: StudySession["type"]) => {
    switch (type) {
      case "lecture":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "practice":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "flashcards":
        return "bg-pink-50 text-pink-700 border-pink-200";
      case "project":
        return "bg-green-50 text-green-700 border-green-200";
    }
  };

  const getStatusColor = (status: StudySession["status"]) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case "in-progress":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "pending":
        return "bg-slate-50 border-slate-200 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-mesh text-slate-900 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="rounded-3xl p-8 sm:p-12 overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-widest">
              <Calendar className="w-4 h-4" />
              <span>Personalized Study Scheduler</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
                Your <span className="text-gradient">Weekly Study Plan</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                AI-generated personalized study schedule optimized for your weak areas, goals, and available time.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <button className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button className="px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share Plan
              </button>
            </div>
          </div>
        </div>

        {/* Weekly Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
              <span>Progress This Week</span>
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{SAMPLE_WEEKLY_PLAN.completionRate}%</div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${SAMPLE_WEEKLY_PLAN.completionRate}%` }}
              />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
              <span>Study Sessions</span>
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{SAMPLE_WEEKLY_PLAN.sessions.length}</div>
            <p className="text-xs text-slate-500">8 hours 15 minutes total</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
              <span>Weak Areas to Fix</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{WEAK_AREAS.length}</div>
            <p className="text-xs text-slate-500">Targeted drills scheduled</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
              <span>Focus Area</span>
              <Brain className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-lg font-black text-slate-900 line-clamp-1">{SAMPLE_WEEKLY_PLAN.focus}</div>
            <p className="text-xs text-slate-500 line-clamp-1">{SAMPLE_WEEKLY_PLAN.startDate}</p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center gap-2 p-2 bg-white border border-slate-200 rounded-2xl w-fit mx-auto shadow-sm">
          <button
            onClick={() => setViewMode("week")}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === "week"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            Weekly Overview
          </button>
          <button
            onClick={() => setViewMode("day")}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === "day"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            Day View
          </button>
        </div>

        {/* Weekly Calendar View */}
        {viewMode === "week" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {weekDays.slice(0, 6).map((day) => {
                const daySessions = SAMPLE_WEEKLY_PLAN.sessions.filter((s) => s.day === day);
                const completedSessions = daySessions.filter((s) => s.status === "completed").length;

                return (
                  <motion.button
                    key={day}
                    onClick={() => {
                      setSelectedDay(day);
                      setViewMode("day");
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-indigo-400 text-left transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600">{day}</h3>
                      {completedSessions > 0 && (
                        <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                          {completedSessions}/{daySessions.length}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {daySessions.slice(0, 2).map((session) => (
                        <div
                          key={session.id}
                          className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-2 ${getTypeColor(session.type)}`}
                        >
                          {getTypeIcon(session.type)}
                          <span className="line-clamp-1">{session.topic}</span>
                        </div>
                      ))}
                      {daySessions.length > 2 && (
                        <p className="text-xs text-slate-500 font-medium">+{daySessions.length - 2} more</p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Day Detail View */}
        {viewMode === "day" && selectedDay && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div>
                <button
                  onClick={() => setViewMode("week")}
                  className="text-xs font-bold text-indigo-600 mb-2 flex items-center gap-1 hover:underline"
                >
                  ← Back to Weekly
                </button>
                <h2 className="text-3xl font-black text-slate-900">{selectedDay}</h2>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-bold uppercase">
                  {sessionsForSelectedDay.filter((s) => s.status === "completed").length} of{" "}
                  {sessionsForSelectedDay.length} completed
                </p>
                <div className="w-32 h-2 rounded-full bg-slate-100 mt-2 overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{
                      width: `${
                        (sessionsForSelectedDay.filter((s) => s.status === "completed").length /
                          sessionsForSelectedDay.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {sessionsForSelectedDay.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-6 rounded-3xl border transition-all ${getStatusColor(session.status)}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2.5 rounded-xl border ${getTypeColor(session.type)}`}>
                          {getTypeIcon(session.type)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{session.topic}</h3>
                          <p className="text-xs opacity-75">{session.subject}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/50 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {session.time} • {session.duration}m
                        </span>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            session.difficulty === "Easy"
                              ? "bg-emerald-100 text-emerald-800"
                              : session.difficulty === "Medium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {session.difficulty}
                        </span>
                      </div>
                    </div>

                    {session.status === "completed" ? (
                      <div className="p-3 rounded-2xl bg-white/50 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      </div>
                    ) : (
                      <button className="px-4 py-2 rounded-xl bg-white/50 hover:bg-white font-bold text-xs transition-all">
                        Start
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Weak Areas Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
                Weak Areas Requiring Attention
              </h2>
              <p className="text-sm text-slate-600 mt-1">Focus on these topics for maximum improvement</p>
            </div>
            <Link href="/analytics" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
              View Full Analytics <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {WEAK_AREAS.map((area, idx) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-rose-300 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{area.subject}</h3>
                    <p className="text-sm text-slate-600">{area.topic}</p>
                  </div>
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full ${
                      area.priority === "Very High"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {area.priority}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-4">{area.recommendedAction}</p>

                <div className="flex gap-2">
                  <Link href="/flashcards" className="flex-1 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-all text-center">
                    Drill Flashcards
                  </Link>
                  <button className="flex-1 px-3 py-2 rounded-xl bg-slate-50 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all">
                    Schedule Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">AI Personalized Recommendations</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {RECOMMENDATIONS.map((rec, idx) => {
              const Icon = rec.icon;
              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-indigo-400 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{rec.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
                  </div>

                  <button className="w-full px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all">
                    {rec.action}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white border border-indigo-500 space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black">Ready to Ace Your Exams?</h2>
            <p className="text-base opacity-90 max-w-2xl">
              This study plan is optimized using AI to help you focus on what matters most. Stick to the schedule and
              watch your scores improve dramatically.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/exams" className="px-6 py-3 rounded-xl bg-white text-indigo-600 font-bold text-sm hover:bg-slate-50 transition-all">
              Start Taking Exams
            </Link>
            <Link href="/flashcards" className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold text-sm transition-all">
              Begin Flashcards
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
