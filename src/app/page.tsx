"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  GraduationCap, 
  Rocket, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Brain, 
  ChevronRight, 
  TrendingUp, 
  Sparkles, 
  FolderGit2, 
  Award, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-mesh overflow-hidden text-slate-900">
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          
          {/* Hero Content */}
          <div className="flex-1 text-center lg:text-left z-10 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-widest"
            >
              <GraduationCap className="w-4 h-4" />
              <span>AI-Powered Learning & Exam Intelligence</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 leading-[1.05]"
            >
              Master Your <br />
              <span className="text-gradient">Potential.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg md:text-xl text-slate-600 max-w-2xl font-medium leading-relaxed"
            >
              The 360° educational companion for university & entrance examinations. 
              FSRS v6 spaced repetition, verified semester notes, project blueprints, and real-time diagnostic analytics.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link 
                href="/exams" 
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                <span>Start Mock Exam</span>
              </Link>
              
              <Link 
                href="/flashcards" 
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-sm transition-all hover:border-slate-300 flex items-center justify-center gap-2"
              >
                <Brain className="w-5 h-5 text-indigo-600" />
                <span>FSRS Flashcards</span>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-bold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Purbanchal University (BIT)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>50,000+ Practice MCQs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>98% Retention Rate</span>
              </div>
            </div>
          </div>

          {/* Hero Feature Cards Grid */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/notes" className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-500/40 shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Semester Notes</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Sem 1 to 8 notes, runnable code examples, and theory FAQs.</p>
              </Link>

              <Link href="/flashcards" className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-500/40 shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">FSRS Flashcards</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">3D flip active recall cards with Spaced Repetition scheduling.</p>
              </Link>

              <Link href="/analytics" className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-500/40 shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">Diagnostics</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Weakness heatmaps & time speed benchmarks vs toppers.</p>
              </Link>

              <Link href="/projects" className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-500/40 shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FolderGit2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Project Ideas</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Categorized blueprints, system architectures, and viva prep.</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">The 3 Pillars of Mastery</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900">Study. Practice. Diagnose.</h2>
            <p className="text-slate-600 text-sm sm:text-base">A continuous feedback loop designed to increase test outcomes by +25% and reduce study fatigue.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black">1</div>
              <h3 className="text-xl font-bold text-slate-900">Active Study Hub</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Block-based notes with one-click copyable code, KaTeX mathematical formulations, and FSRS active recall decks.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-black">2</div>
              <h3 className="text-xl font-bold text-slate-900">High-Stakes CBT Engine</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                NTA/PU standardized question palettes, section timing, mark-for-review flags, and mobile thumb-friendly controllers.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black">3</div>
              <h3 className="text-xl font-bold text-slate-900">Diagnostic Analytics</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automated weakness detection that pinpoints exact concept gaps and creates instant 10-question recovery drills.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
