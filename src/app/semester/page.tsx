"use client";

import { motion } from "framer-motion";
import { BookOpen, GraduationCap, ChevronRight, Layers, Sparkles, FileText } from "lucide-react";
import Link from "next/link";
import { bitSyllabusData } from "@/data/bitSyllabusData";

export default function SemestersIndexPage() {
  return (
    <div className="min-h-screen bg-mesh text-slate-900 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-black uppercase tracking-widest">
            <GraduationCap className="w-4 h-4" />
            <span>Purbanchal University (PU) BIT</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Browse By <span className="text-gradient">Semester</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base font-medium">
            Access past question papers, important high-yield exam topics, and semester course materials for all 8 semesters.
          </p>
        </div>

        {/* 8 Semesters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bitSyllabusData.map((sem, idx) => (
            <motion.div
              key={sem.semester}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-teal-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-black text-base">
                    {sem.semester}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {sem.totalCredits} Credits
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    Semester {sem.semester}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{sem.subjects.length} Core & Lab Subjects</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {sem.subjects.slice(0, 3).map((sub, sIdx) => (
                    <div key={sIdx} className="text-xs text-slate-600 truncate font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                      <span>{sub.name}</span>
                    </div>
                  ))}
                  {sem.subjects.length > 3 && (
                    <p className="text-[11px] text-slate-400 font-bold">+{sem.subjects.length - 3} more subjects</p>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6">
                <Link
                  href={`/semester/${sem.semester}`}
                  className="w-full py-3 rounded-2xl bg-slate-50 hover:bg-teal-600 hover:text-white text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs group-hover:bg-teal-600 group-hover:text-white"
                >
                  <span>Explore Semester {sem.semester}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
