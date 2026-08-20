"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  Layers, 
  GraduationCap, 
  Award, 
  Download, 
  CheckCircle2, 
  Clock, 
  FileText,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { bitSyllabusData } from "@/data/bitSyllabusData";

export default function SyllabusPage() {
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const activeSemData = bitSyllabusData.find(s => s.semester === selectedSemester) || bitSyllabusData[0];

  const totalCurriculumCredits = bitSyllabusData.reduce((acc, curr) => acc + curr.totalCredits, 0);
  const totalSubjectsCount = bitSyllabusData.reduce((acc, curr) => acc + curr.subjects.length, 0);

  return (
    <div className="min-h-screen bg-mesh text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-purple-950/40 backdrop-blur-xl shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black uppercase tracking-widest">
              <GraduationCap className="w-4 h-4" />
              <span>Official Academic Curriculum</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Purbanchal University <br />
              <span className="text-gradient">BIT Full Syllabus</span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
              Complete semester-wise course breakdown, credit hour weighting, chapter units, and laboratory specifications for the 4-year Bachelor of Information Technology (BIT) program.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 text-center">
                <div className="text-2xl sm:text-3xl font-black text-white">{totalCurriculumCredits}</div>
                <div className="text-xs text-slate-400 font-bold uppercase mt-1">Total Credits</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 text-center">
                <div className="text-2xl sm:text-3xl font-black text-white">{totalSubjectsCount}</div>
                <div className="text-xs text-slate-400 font-bold uppercase mt-1">Total Subjects</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 text-center">
                <div className="text-2xl sm:text-3xl font-black text-white">8</div>
                <div className="text-xs text-slate-400 font-bold uppercase mt-1">Semesters</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 text-center">
                <div className="text-2xl sm:text-3xl font-black text-white">4 Years</div>
                <div className="text-xs text-slate-400 font-bold uppercase mt-1">Duration</div>
              </div>
            </div>
          </div>
        </div>

        {/* Semester Tab Switcher */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Select Semester
            </h2>
            <span className="text-xs text-slate-400 font-bold">Semester {selectedSemester} ({activeSemData.totalCredits} Credit Hours)</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {bitSyllabusData.map((sem) => {
              const isSelected = selectedSemester === sem.semester;
              return (
                <button
                  key={sem.semester}
                  onClick={() => setSelectedSemester(sem.semester)}
                  className={`px-6 py-3 rounded-2xl font-black text-sm whitespace-nowrap transition-all border flex items-center gap-2 ${
                    isSelected
                      ? "bg-purple-600 text-white border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105"
                      : "bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border-white/5"
                  }`}
                >
                  <span>Semester {sem.semester}</span>
                  <span className="text-[11px] opacity-75">({sem.totalCredits} Cr)</span>
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
                className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl overflow-hidden shadow-xl"
              >
                <button
                  onClick={() => setExpandedSubject(isExpanded ? null : sub.code)}
                  className="w-full p-6 sm:p-7 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-850 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono font-bold text-xs">
                      {sub.code}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{sub.name}</h3>
                      <p className="text-xs sm:text-sm text-slate-400 line-clamp-1 mt-1">{sub.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-300">
                      {sub.credits} Credits
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-300">
                      {sub.type}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180 text-purple-400" : ""}`} />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 sm:px-8 pb-7 pt-2 border-t border-white/5 bg-slate-950/40 space-y-4">
                    <p className="text-sm text-slate-300 leading-relaxed">{sub.description}</p>

                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        Detailed Syllabus Units & Topics
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {sub.keyUnits.map((unit, uIdx) => (
                          <div key={uIdx} className="p-3 rounded-xl bg-slate-900 border border-white/5 text-xs text-slate-300 flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-md bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-[10px]">
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
  );
}
