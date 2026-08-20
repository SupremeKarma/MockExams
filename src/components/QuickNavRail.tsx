"use client";

import { useState } from "react";
import { BookOpen, Zap, MessageCircle, ArrowUp, GraduationCap, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function QuickNavRail() {
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed right-3.5 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-2 p-2 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl">
      {/* 1. Semester Past Questions Quick Link */}
      <div className="relative group">
        <Link
          href="/semester/1"
          onMouseEnter={() => setHoveredPanel("semesters")}
          onMouseLeave={() => setHoveredPanel(null)}
          className="w-11 h-11 rounded-xl bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white flex items-center justify-center transition-all shadow-2xs group-hover:scale-105"
          aria-label="Semester Past Questions"
        >
          <GraduationCap className="w-5 h-5" />
        </Link>
        <AnimatePresence>
          {hoveredPanel === "semesters" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg pointer-events-none"
            >
              Semester Past Questions (PU BIT)
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Entrance Masterclass Quick Link */}
      <div className="relative group">
        <Link
          href="/learn"
          onMouseEnter={() => setHoveredPanel("entrance")}
          onMouseLeave={() => setHoveredPanel(null)}
          className="w-11 h-11 rounded-xl bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white flex items-center justify-center transition-all shadow-2xs group-hover:scale-105"
          aria-label="Entrance Masterclass"
        >
          <BookOpen className="w-5 h-5" />
        </Link>
        <AnimatePresence>
          {hoveredPanel === "entrance" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg pointer-events-none"
            >
              Entrance Masterclass (IOE/CEE/CSIT)
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. CBT Mock Test Quick Link */}
      <div className="relative group">
        <Link
          href="/exams"
          onMouseEnter={() => setHoveredPanel("cbt")}
          onMouseLeave={() => setHoveredPanel(null)}
          className="w-11 h-11 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white flex items-center justify-center transition-all shadow-2xs group-hover:scale-105"
          aria-label="CBT Mock Tests"
        >
          <Zap className="w-5 h-5" />
        </Link>
        <AnimatePresence>
          {hoveredPanel === "cbt" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg pointer-events-none"
            >
              CBT Live Mock Tests
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. WhatsApp Support */}
      <div className="relative group">
        <a
          href="https://wa.me/9779761499683"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredPanel("whatsapp")}
          onMouseLeave={() => setHoveredPanel(null)}
          className="w-11 h-11 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white flex items-center justify-center transition-all shadow-2xs group-hover:scale-105"
          aria-label="WhatsApp Hotline"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
        <AnimatePresence>
          {hoveredPanel === "whatsapp" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg pointer-events-none"
            >
              Student Support Hotline (+977 9761499683)
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all shadow-2xs mt-2"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </div>
  );
}
