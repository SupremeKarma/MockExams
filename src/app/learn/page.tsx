"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  Award, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Flame, 
  Cpu, 
  Calculator, 
  Zap, 
  Rocket, 
  Video,
  FileCheck2
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { entranceCoursesData, LectureItem } from "@/data/entranceCoursesData";

export default function LearnPage() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("sub-english");
  const [activeLecture, setActiveLecture] = useState<LectureItem | null>(null);

  const activeCourse = entranceCoursesData[0];
  const activeSubject = activeCourse.subjects.find(s => s.subjectId === selectedSubjectId) || activeCourse.subjects[0];

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case "Cpu":
        return <Cpu className="w-5 h-5 text-blue-600" />;
      case "Calculator":
        return <Calculator className="w-5 h-5 text-purple-600" />;
      case "Zap":
        return <Zap className="w-5 h-5 text-emerald-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-mesh text-slate-900 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Entrance Hero Banner */}
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black uppercase tracking-widest">
              <Award className="w-4 h-4" />
              <span>{activeCourse.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              {activeCourse.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {activeCourse.shortDesc}
            </p>

            {/* Program Stats Strip */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm font-bold text-slate-600">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>{activeCourse.subjectsCount} Core Subjects</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-600" />
                <span>{activeCourse.totalLectures} Video Lectures</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span>{activeCourse.totalQuestions}+ Practice MCQs</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/exams" className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                Take Timed Entrance Mock
              </Link>
              <Link href="/notes" className="px-8 py-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center gap-2">
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
              <span className="text-xs font-black uppercase tracking-wider text-amber-600">Structured Curriculum</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Course Syllabus & Modules</h2>
            </div>
            <span className="text-xs px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold">
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
                    }}
                    className={`w-full p-5 rounded-2xl text-left border transition-all duration-200 flex items-center justify-between group ${
                      isSelected
                        ? "bg-amber-50/70 border-amber-300 shadow-sm"
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                        {getSubjectIcon(sub.iconName)}
                      </div>
                      <div>
                        <h3 className={`text-sm sm:text-base font-bold ${isSelected ? "text-slate-900" : "text-slate-700"}`}>
                          {sub.subjectTitle}
                        </h3>
                        <p className="text-xs text-slate-500">{sub.lectureCount} Lectures • {sub.mcqCount} MCQs</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "text-amber-600 translate-x-1" : "text-slate-400 group-hover:translate-x-1"}`} />
                  </button>
                );
              })}
            </div>

            {/* Lectures & Topics List (Right 2 Columns) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    {getSubjectIcon(activeSubject.iconName)}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{activeSubject.subjectTitle}</h3>
                      <p className="text-xs text-slate-500">{activeSubject.lectures.length} High-Yield Modules</p>
                    </div>
                  </div>
                  <Link
                    href="/exams"
                    className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
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
                      className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 group-hover:text-amber-600 transition-colors">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                            {lec.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1">{lec.summary}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {lec.duration}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-mono text-[10px] font-bold">
                          Video
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-2xl text-slate-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-black uppercase text-amber-600">Lecture Overview</span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{activeLecture.title}</h3>
                </div>
                <button
                  onClick={() => setActiveLecture(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all"
                >
                  Close
                </button>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">{activeLecture.summary}</p>

              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Key High-Yield Concepts</h4>
                <div className="space-y-2">
                  {activeLecture.keyConcepts.map((concept, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{concept}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <Link
                  href="/exams"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-sm"
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
