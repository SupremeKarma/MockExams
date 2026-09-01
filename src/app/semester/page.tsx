"use client";

import { motion } from "framer-motion";
import { GraduationCap, ChevronRight } from "lucide-react";
import Link from "next/link";
import { bitSyllabusData } from "@/data/bitSyllabusData";
import ProgramGate from "@/components/ProgramGate";

export default function SemestersIndexPage() {
  return (
    <ProgramGate>
    <div className="min-h-screen bg-zinc-50/40 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-lg p-6 sm:p-8 border border-zinc-200 space-y-2.5 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[11px] font-bold uppercase tracking-wide">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Purbanchal University (PU) BIT</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Browse by semester
          </h1>

          <p className="text-zinc-500 text-sm">
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
              className="p-6 rounded-xl bg-white border border-zinc-200 hover:border-teal-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-base">
                    {sem.semester}
                  </span>
                  <span className="text-xs font-bold text-zinc-400">
                    {sem.totalCredits} Credits
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-zinc-900 group-hover:text-teal-700 transition-colors">
                    Semester {sem.semester}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">{sem.subjects.length} Core & Lab Subjects</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                  {sem.subjects.slice(0, 3).map((sub, sIdx) => (
                    <div key={sIdx} className="text-xs text-zinc-600 truncate font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                      <span>{sub.name}</span>
                    </div>
                  ))}
                  {sem.subjects.length > 3 && (
                    <p className="text-[11px] text-zinc-400 font-bold">+{sem.subjects.length - 3} more subjects</p>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100 mt-6">
                <Link
                  href={`/semester/${sem.semester}`}
                  className="w-full py-3 rounded-lg bg-zinc-50 hover:bg-teal-600 hover:text-white text-zinc-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs group-hover:bg-teal-600 group-hover:text-white"
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
    </ProgramGate>
  );
}
