"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  GraduationCap, 
  Search, 
  PlayCircle, 
  Clock, 
  Award, 
  BarChart3, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Cpu, 
  Calculator, 
  Zap, 
  Rocket, 
  ArrowRight,
  Video,
  FileCheck2,
  Users
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { entranceCoursesData, EntranceSubjectModule, LectureItem } from "@/data/entranceCoursesData";

export default function LearnPage() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("sub-english");
  const [activeLecture, setActiveLecture] = useState<LectureItem | null>(null);
  const [expandedSubjectAccordion, setExpandedSubjectAccordion] = useState<string>("sub-english");

  const activeCourse = entranceCoursesData[0];
  const activeSubject = activeCourse.subjects.find(s => s.subjectId === selectedSubjectId) || activeCourse.subjects[0];

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case "Cpu":
        return <Cpu className="w-5 h-5 text-blue-400" />;
      case "Calculator":
        return <Calculator className="w-5 h-5 text-purple-400" />;
      case "Zap":
        return <Zap className="w-5 h-5 text-emerald-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-mesh text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Entrance Hero Banner */}
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-amber-950/30 backdrop-blur-xl shadow-2xl">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-widest">
              <Award className="w-4 h-4" />
              <span>{activeCourse.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              {activeCourse.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
              {activeCourse.shortDesc}
            </p>

            {/* Program Stats Strip */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm font-bold text-slate-300">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>{activeCourse.subjectsCount} Core Subjects</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-400" />
                <span>{activeCourse.totalLectures} Video Lectures</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>{activeCourse.totalQuestions}+ Practice MCQs</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/exams" className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm transition-all shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95 flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                Take Timed Entrance Mock
              </Link>
              <Link href="/notes" className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-sm transition-all flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Browse Notes Repository
              </Link>
            </div>
          </div>
        </div>

        {/* Course Curriculum & Syllabus Accordion */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">Structured Curriculum</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Course Syllabus & Modules</h2>
            </div>
            <span className="text-xs px-3.5 py-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-300 font-bold">
              Updated for PU / TU / KU Entrance Patterns
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Subject Selectors (Left Column) */}
            <div className="lg:col-span-1 space-y-3">
              {activeCourse.subjects.map((sub) => {
                const isSelected = selectedSubjectId === sub.subjectId;
                return (
                  <button
                    key={sub.subjectId}
                    onClick={() => {
                      setSelectedSubjectId(sub.subjectId);
                      setExpandedSubjectAccordion(sub.subjectId);
                    }}
                    className={`w-full p-5 rounded-2xl text-left border transition-all duration-200 flex items-center justify-between group ${
                      isSelected
                        ? "bg-slate-850 border-amber-500/50 shadow-xl shadow-amber-500/5"
                        : "bg-slate-900/60 border-white/5 hover:bg-slate-850 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center">
                        {getSubjectIcon(sub.iconName)}
                      </div>
                      <div>
                        <h3 className={`text-sm sm:text-base font-bold ${isSelected ? "text-white" : "text-slate-300"}`}>
                          {sub.subjectTitle}
                        </h3>
                        <p className="text-xs text-slate-500">{sub.lectureCount} Lectures • {sub.mcqCount} MCQs</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "text-amber-400 translate-x-1" : "text-slate-600 group-hover:translate-x-1"}`} />
                  </button>
                );
              })}
            </div>

            {/* Lectures & Topics List (Right 2 Columns) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    {getSubjectIcon(activeSubject.iconName)}
                    <div>
                      <h3 className="text-xl font-bold text-white">{activeSubject.subjectTitle}</h3>
                      <p className="text-xs text-slate-400">{activeSubject.lectures.length} High-Yield Modules</p>
                    </div>
                  </div>
                  <Link
                    href="/exams"
                    className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    Practice Subject MCQs
                  </Link>
                </div>

                <div className="space-y-3">
                  {activeSubject.lectures.map((lec, idx) => (
                    <motion.div
                      key={lec.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setActiveLecture(lec)}
                      className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-white/20 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-amber-400 group-hover:border-amber-500/40 transition-colors">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-200 group-hover:text-white transition-colors">
                            {lec.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1">{lec.summary}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {lec.duration}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 font-mono text-[10px]">
                          Video Included
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lecture Quick Review Modal */}
        {activeLecture && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xl text-slate-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-black uppercase text-amber-400">Lecture Overview</span>
                  <h3 className="text-2xl font-bold text-white mt-1">{activeLecture.title}</h3>
                </div>
                <button
                  onClick={() => setActiveLecture(null)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all"
                >
                  Close
                </button>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">{activeLecture.summary}</p>

              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Key High-Yield Concepts</h4>
                <div className="space-y-2">
                  {activeLecture.keyConcepts.map((concept, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-white/5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{concept}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <Link
                  href="/exams"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all"
                >
                  Launch Practice Exam on this Module
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
