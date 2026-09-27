"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { bitSyllabusData } from "@/data/bitSyllabusData";
import {
  GraduationCap,
  BookOpen,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  FileCode,
  FileText,
  Clock,
  Layers,
  Cpu,
  CheckCircle2,
} from "lucide-react";

export default function CoursesPage() {
  const [selectedSemester, setSelectedSemester] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allCourses = useMemo(() => {
    return bitSyllabusData.flatMap((sem) =>
      sem.subjects.map((sub) => ({
        ...sub,
        semester: sem.semester,
        unitsCount: (sub.syllabusUnits && sub.syllabusUnits.length > 0)
          ? sub.syllabusUnits.length
          : sub.keyUnits.length,
      }))
    );
  }, []);

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      if (selectedSemester !== "all" && course.semester !== selectedSemester) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = course.name.toLowerCase().includes(q);
        const matchesCode = course.code.toLowerCase().includes(q);
        const matchesDesc = (course.description || "").toLowerCase().includes(q);
        return matchesName || matchesCode || matchesDesc;
      }
      return true;
    });
  }, [allCourses, selectedSemester, searchQuery]);

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Hero Banner */}
        <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-primary-900 via-primary-800 to-indigo-900 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-emerald-300" />
              <span>Purbanchal University Accredited Curriculum</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Academic Courses &amp; Official Study Notes
            </h1>
            <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
              Explore university courses across all 8 semesters of the revised Bachelor of Information Technology (BIT) curriculum, with full markdown (.md) syllabus outlines, lesson checklists, and verified exam study notes.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
            <GraduationCap className="w-80 h-80 text-white" />
          </div>
        </div>

        {/* Featured Deadlock Notes Callout */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold uppercase tracking-wide">
                <Cpu className="w-3.5 h-3.5 text-amber-600" />
                <span>Featured Unit Notes</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
                Operating Systems: Deadlock &amp; Banker&apos;s Algorithm
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Comprehensive study notes for Unit 6 covering Coffman Conditions, Resource Allocation Graphs (RAG), Banker&apos;s Safety &amp; Request Algorithm with full C++ implementations, and university exam numerical problems.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Course: BIT253CO (Semester 4)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Format: Renderable .md with Download
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Includes Solved Exam Matrices
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
              <Link
                href="/courses/BIT253CO?tab=notes"
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <FileCode className="w-4 h-4" />
                <span>View Deadlock Notes (.md)</span>
              </Link>
              <Link
                href="/courses/BIT253CO"
                className="px-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50 font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <span>Full OS Syllabus</span>
                <ArrowRight className="w-4 h-4 text-zinc-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by code, title, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-zinc-900 placeholder:text-zinc-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-zinc-400 shrink-0 ml-1" />
            <button
              type="button"
              onClick={() => setSelectedSemester("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedSemester === "all"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              All Semesters
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <button
                key={sem}
                type="button"
                onClick={() => setSelectedSemester(sem)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  selectedSemester === sem
                    ? "bg-primary-600 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                Sem {sem}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold px-1">
            <span>Showing {filteredCourses.length} accredited courses</span>
            <span>Program: Bachelor of Information Technology</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course) => {
              const isOperatingSystems =
                course.code === "BIT253CO" || course.name.toLowerCase().includes("operating system");

              return (
                <div
                  key={course.code}
                  className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group ${
                    isOperatingSystems
                      ? "border-amber-300 ring-1 ring-amber-200"
                      : "border-zinc-200 hover:border-primary-300"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-bold">
                          {course.code}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-[11px] font-semibold">
                          Sem {course.semester}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-400">
                        {course.credits} Credits
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-zinc-900 group-hover:text-primary-600 transition-colors">
                        {course.name}
                      </h3>
                      {isOperatingSystems && (
                        <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                          <Cpu className="w-3 h-3 text-amber-600" />
                          <span>Deadlock Notes Available</span>
                        </div>
                      )}
                      <p className="text-xs text-zinc-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-zinc-400" />
                        {course.unitsCount} Units
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-zinc-400" />
                        Official .md
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
                    <Link
                      href={`/courses/${course.code}?tab=notes`}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                        isOperatingSystems
                          ? "bg-amber-100 hover:bg-amber-200 text-amber-800"
                          : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>{isOperatingSystems ? "Deadlock Notes" : "Notes"}</span>
                    </Link>

                    <Link
                      href={`/courses/${course.code}`}
                      className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                    >
                      <span>Syllabus</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
