"use client";

import { motion } from "framer-motion";
import {
  Layers,
  GraduationCap,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { bitSyllabusData } from "@/data/bitSyllabusData";
import ProgramGate from "@/components/ProgramGate";

export default function SyllabusPage() {
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const activeSemData = bitSyllabusData.find(s => s.semester === selectedSemester) || bitSyllabusData[0];

  const totalCurriculumCredits = bitSyllabusData.reduce((acc, curr) => acc + curr.totalCredits, 0);
  const totalSubjectsCount = bitSyllabusData.reduce((acc, curr) => acc + curr.subjects.length, 0);

  return (
    <ProgramGate>
    <div className="min-h-screen bg-zinc-50/40 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="relative rounded-lg p-6 sm:p-8 overflow-hidden border border-zinc-200 bg-white">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-[11px] font-bold uppercase tracking-wide">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Official academic curriculum</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight leading-tight">
              Purbanchal University BIT full syllabus
            </h1>

            <p className="text-sm text-zinc-500 leading-relaxed">
              Complete semester-wise course breakdown, credit hour weighting, chapter units, and laboratory specifications for the 4-year Bachelor of Information Technology (BIT) program.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-md bg-zinc-50 border border-zinc-200 text-center">
                <div className="text-xl font-bold text-zinc-900 tabular-nums">{totalCurriculumCredits}</div>
                <div className="text-[10px] text-zinc-500 font-semibold uppercase mt-0.5">Total credits</div>
              </div>
              <div className="p-3.5 rounded-md bg-zinc-50 border border-zinc-200 text-center">
                <div className="text-xl font-bold text-zinc-900 tabular-nums">{totalSubjectsCount}</div>
                <div className="text-[10px] text-zinc-500 font-semibold uppercase mt-0.5">Total subjects</div>
              </div>
              <div className="p-3.5 rounded-md bg-zinc-50 border border-zinc-200 text-center">
                <div className="text-xl font-bold text-zinc-900 tabular-nums">8</div>
                <div className="text-[10px] text-zinc-500 font-semibold uppercase mt-0.5">Semesters</div>
              </div>
              <div className="p-3.5 rounded-md bg-zinc-50 border border-zinc-200 text-center">
                <div className="text-xl font-bold text-zinc-900">4 years</div>
                <div className="text-[10px] text-zinc-500 font-semibold uppercase mt-0.5">Duration</div>
              </div>
            </div>
          </div>
        </div>

        {/* Semester Tab Switcher */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wide text-zinc-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-violet-600" />
              Select semester
            </h2>
            <span className="text-xs text-zinc-500 font-medium">Semester {selectedSemester} ({activeSemData.totalCredits} credit hours)</span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {bitSyllabusData.map((sem) => {
              const isSelected = selectedSemester === sem.semester;
              return (
                <button
                  key={sem.semester}
                  onClick={() => setSelectedSemester(sem.semester)}
                  className={`px-4 py-2 rounded-md font-semibold text-xs whitespace-nowrap transition-colors border flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-white text-zinc-600 hover:bg-zinc-50 border-zinc-200"
                  }`}
                >
                  <span>Sem {sem.semester}</span>
                  <span className="text-[11px] opacity-80">({sem.totalCredits} Cr)</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subjects List */}
        <div className="space-y-4">
          {activeSemData.subjects.map((sub, idx) => {
            const isExpanded = expandedSubject === sub.code;
            return (
              <motion.div
                key={sub.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setExpandedSubject(isExpanded ? null : sub.code)}
                  className="w-full p-6 sm:p-7 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <span className="px-3 py-1.5 rounded-xl bg-violet-50 border border-violet-200 text-violet-700 font-mono font-bold text-xs">
                      {sub.code}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900">{sub.name}</h3>
                      <p className="text-xs sm:text-sm text-zinc-500 line-clamp-1 mt-1">{sub.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-xs font-bold text-zinc-700">
                      {sub.credits} Credits
                    </span>
                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-xs font-bold text-zinc-700">
                      {sub.type}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform ${isExpanded ? "rotate-180 text-violet-600" : ""}`} />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 sm:px-8 pb-7 pt-2 border-t border-zinc-100 bg-zinc-50/50 space-y-4">
                    <p className="text-sm text-zinc-700 leading-relaxed">{sub.description}</p>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-violet-700 mb-3 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        Detailed Syllabus Units & Topics
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {sub.keyUnits.map((unit, uIdx) => (
                          <div key={uIdx} className="p-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-700 flex items-center gap-2.5 shadow-2xs">
                            <span className="w-5 h-5 rounded-md bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-[10px]">
                              {uIdx + 1}
                            </span>
                            <span>{unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
    </ProgramGate>
  );
}
