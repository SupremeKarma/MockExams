"use client";

import { motion } from "framer-motion";
import {
  Layers,
  GraduationCap,
  ChevronDown,
  Sparkles,
  Search,
  Globe,
  BookOpen,
  ArrowRight,
  Clock,
  Compass,
  CheckCircle,
} from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { bitSyllabusData } from "@/data/bitSyllabusData";
import { globalPrograms, globalSyllabusCourses, GlobalCourse } from "@/data/globalSyllabusData";

type ProgramTab = "PU_BIT" | "TU_CSIT" | "CAMBRIDGE_A_LEVELS" | "ACM_CS2023" | "US_AP" | "GATE_CS";

export default function SyllabusPage() {
  const [selectedProgram, setSelectedProgram] = useState<ProgramTab>("PU_BIT");
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  // Derive courses for current program
  const coursesForProgram = useMemo(() => {
    if (selectedProgram === "PU_BIT") {
      const activeSem = bitSyllabusData.find((s) => s.semester === selectedSemester) || bitSyllabusData[0];
      return activeSem.subjects.map((sub) => ({
        code: sub.code,
        name: sub.name,
        programId: "BIT",
        programName: "Purbanchal University BIT",
        level: "Undergraduate",
        category: "Computer Science",
        credits: sub.credits,
        semester: selectedSemester,
        difficulty: "Intermediate",
        description: sub.description,
        learningOutcomes: [
          "Demonstrate thorough mastery of the syllabus curriculum concepts.",
          "Prepare for university examinations using verified past questions.",
        ],
        prerequisites: ["None"],
        syllabusUnits: sub.keyUnits.map((u, i) => ({
          unitId: `${sub.code}_U${i + 1}`,
          title: u,
          teachingHours: 5,
          subtopics: [u],
        })),
      })) as GlobalCourse[];
    }

    return globalSyllabusCourses.filter((c) => c.programId === selectedProgram);
  }, [selectedProgram, selectedSemester]);

  // Apply search query
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return coursesForProgram;
    const q = searchQuery.toLowerCase();
    return coursesForProgram.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.syllabusUnits.some(
          (u) =>
            u.title.toLowerCase().includes(q) ||
            u.subtopics.some((st) => st.toLowerCase().includes(q))
        )
    );
  }, [coursesForProgram, searchQuery]);

  const activeProgramMeta = useMemo(() => {
    if (selectedProgram === "PU_BIT") {
      return {
        id: "PU_BIT",
        name: "Purbanchal University BIT",
        organization: "Purbanchal University (Faculty of Science & Technology)",
        country: "Nepal",
        flag: "🇳🇵",
        level: "Undergraduate (4 Years / 8 Semesters)",
        description: "Official 8-semester Bachelor of Information Technology curriculum with 138 total credits.",
        totalCredits: 138,
        totalSubjects: 42,
      };
    }
    const found = globalPrograms.find((p) => p.id === selectedProgram) || globalPrograms[0];
    return {
      ...found,
      totalCredits: coursesForProgram.reduce((acc, c) => acc + (c.credits || 3), 0),
      totalSubjects: coursesForProgram.length,
    };
  }, [selectedProgram, coursesForProgram]);

  return (
    <div className="min-h-screen bg-zinc-50/40 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Hero */}
        <div className="relative rounded-2xl p-6 sm:p-8 overflow-hidden border border-zinc-200 bg-white shadow-xs">
          <div className="relative z-10 max-w-4xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-bold uppercase tracking-wide">
              <Globe className="w-3.5 h-3.5" />
              <span>Global Academic &amp; Examination Syllabi</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight">
              {activeProgramMeta.flag} {activeProgramMeta.name}
            </h1>

            <p className="text-sm text-zinc-600 leading-relaxed">
              {activeProgramMeta.description} Benchmark knowledge areas, chapter units, credit weightings, and learning outcomes.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                <div className="text-xl font-bold text-zinc-900 tabular-nums">
                  {activeProgramMeta.totalCredits}
                </div>
                <div className="text-[10px] text-zinc-500 font-semibold uppercase mt-0.5">Credit Hours</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                <div className="text-xl font-bold text-zinc-900 tabular-nums">
                  {coursesForProgram.length}
                </div>
                <div className="text-[10px] text-zinc-500 font-semibold uppercase mt-0.5">Listed Courses</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                <div className="text-sm font-bold text-zinc-900 truncate">
                  {activeProgramMeta.organization}
                </div>
                <div className="text-[10px] text-zinc-500 font-semibold uppercase mt-0.5">Institution</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                <div className="text-sm font-bold text-zinc-900">
                  {activeProgramMeta.country}
                </div>
                <div className="text-[10px] text-zinc-500 font-semibold uppercase mt-0.5">Jurisdiction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Program Switcher Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wide text-zinc-500 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-primary-600" />
              Select Curriculum / Academic Board
            </h2>
            <span className="text-xs text-zinc-400 font-medium">6 Global Standard Curricula</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "PU_BIT", label: "🇳🇵 PU BIT (Nepal)", badge: "8 Sem" },
              { id: "TU_CSIT", label: "🇳🇵 TU B.Sc. CSIT (Nepal)", badge: "8 Sem" },
              { id: "CAMBRIDGE_A_LEVELS", label: "🇬🇧 Cambridge A-Levels", badge: "CAIE" },
              { id: "ACM_CS2023", label: "🌍 ACM/IEEE CS2023", badge: "Global" },
              { id: "US_AP", label: "🇺🇸 US College Board AP", badge: "AP STEM" },
              { id: "GATE_CS", label: "🇮🇳 GATE CS & IT", badge: "India" },
            ].map((prog) => {
              const isSelected = selectedProgram === prog.id;
              return (
                <button
                  key={prog.id}
                  onClick={() => {
                    setSelectedProgram(prog.id as ProgramTab);
                    setExpandedSubject(null);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all border flex items-center gap-2 shadow-2xs ${
                    isSelected
                      ? "bg-primary-600 text-white border-primary-600 shadow-xs"
                      : "bg-white text-zinc-700 hover:bg-zinc-50 border-zinc-200"
                  }`}
                >
                  <span>{prog.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    isSelected ? "bg-primary-700 text-white" : "bg-zinc-100 text-zinc-500"
                  }`}>
                    {prog.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Semester Filter (For PU BIT only) & Search Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          {selectedProgram === "PU_BIT" ? (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-zinc-500 mr-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-primary-600" /> Sem:
              </span>
              {bitSyllabusData.map((sem) => (
                <button
                  key={sem.semester}
                  onClick={() => {
                    setSelectedSemester(sem.semester);
                    setExpandedSubject(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                    selectedSemester === sem.semester
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-600 hover:bg-zinc-50 border-zinc-200"
                  }`}
                >
                  Sem {sem.semester}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs font-bold text-zinc-500 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary-600" />
              Showing all core subjects for {activeProgramMeta.name}
            </div>
          )}

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subject, course code, unit..."
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Subjects & Units List */}
        <div className="space-y-4">
          {filteredCourses.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-zinc-200">
              <p className="text-sm font-bold text-zinc-700">No syllabus matches found for &quot;{searchQuery}&quot;</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs font-bold text-primary-600 hover:underline"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            filteredCourses.map((sub, idx) => {
              const isExpanded = expandedSubject === sub.code;
              return (
                <motion.div
                  key={sub.code}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                  className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs hover:border-primary-400 transition-all"
                >
                  <button
                    onClick={() => setExpandedSubject(isExpanded ? null : sub.code)}
                    className="w-full p-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/50 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <span className="px-3 py-1.5 rounded-xl bg-primary-50 border border-primary-200 text-primary-700 font-mono font-bold text-xs">
                        {sub.code}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-zinc-900">{sub.name}</h3>
                        <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{sub.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                      <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-[11px] font-bold text-zinc-700">
                        {sub.credits} Credits
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-[11px] font-bold text-zinc-700">
                        {sub.syllabusUnits.length} Units
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-zinc-400 transition-transform ${
                          isExpanded ? "rotate-180 text-primary-600" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-zinc-100 bg-zinc-50/40 space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs text-zinc-700 leading-relaxed">{sub.description}</p>
                        {sub.learningOutcomes && sub.learningOutcomes.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                              Core Learning Outcomes:
                            </span>
                            <ul className="mt-1 space-y-1">
                              {sub.learningOutcomes.map((lo, i) => (
                                <li key={i} className="text-xs text-zinc-600 flex items-start gap-1.5">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                  <span>{lo}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Detailed Syllabus Units */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary-700 mb-3 flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5" />
                          Detailed Syllabus Chapters &amp; Teaching Units
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {sub.syllabusUnits.map((unit, uIdx) => (
                            <div
                              key={unit.unitId || uIdx}
                              className="p-3.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 space-y-2 shadow-2xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-zinc-900 flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-md bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[10px]">
                                    {uIdx + 1}
                                  </span>
                                  {unit.title}
                                </span>
                                {unit.teachingHours && (
                                  <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {unit.teachingHours}h
                                  </span>
                                )}
                              </div>
                              {unit.subtopics && unit.subtopics.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {unit.subtopics.map((st, sIdx) => (
                                    <span
                                      key={sIdx}
                                      className="px-2 py-0.5 rounded bg-zinc-50 border border-zinc-100 text-[10px] text-zinc-600"
                                    >
                                      {st}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Course Action Link */}
                      <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
                        <span className="text-xs text-zinc-500">
                          Prerequisites: {sub.prerequisites?.join(", ") || "None"}
                        </span>
                        <Link
                          href={`/courses/${sub.code}`}
                          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <span>Explore Full Course Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
