"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Rocket,
  Zap,
  BarChart3,
  Brain,
  TrendingUp,
  FolderGit2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const trustBadges = [
  { icon: CheckCircle2, label: "Purbanchal University (BIT)" },
  { icon: CheckCircle2, label: "50,000+ Practice MCQs" },
  { icon: CheckCircle2, label: "98% Retention Rate" },
];

const heroCards = [
  { href: "/notes", icon: BookOpen, tint: "bg-primary-50 text-primary-600", title: "Semester Notes", desc: "Sem 1 to 8 notes, runnable code examples, and theory FAQs." },
  { href: "/flashcards", icon: Brain, tint: "bg-violet-50 text-violet-600", title: "FSRS Flashcards", desc: "3D flip active recall cards with spaced repetition scheduling." },
  { href: "/analytics", icon: BarChart3, tint: "bg-sky-50 text-sky-600", title: "Diagnostics", desc: "Weakness heatmaps and time/speed benchmarks vs. toppers." },
  { href: "/projects", icon: FolderGit2, tint: "bg-amber-50 text-amber-600", title: "Project Ideas", desc: "Categorized blueprints, system architectures, and viva prep." },
];

const pillars = [
  { n: "01", title: "Active Study Hub", desc: "Block-based notes with one-click copyable code, KaTeX mathematical formulations, and FSRS active recall decks." },
  { n: "02", title: "High-Stakes CBT Engine", desc: "Standardized question palettes, section timing, mark-for-review flags, and mobile thumb-friendly controls." },
  { n: "03", title: "Diagnostic Analytics", desc: "Automated weakness detection that pinpoints exact concept gaps and builds instant 10-question recovery drills." },
];

const metrics = [
  { value: "50K+", label: "Practice questions" },
  { value: "12K+", label: "Active students" },
  { value: "98%", label: "Retention rate" },
  { value: "4.9/5", label: "Average rating" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">

      {/* Hero */}
      <section className="relative bg-mesh border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
          <div className="flex flex-col lg:flex-row items-center gap-14">

            <div className="flex-1 text-center lg:text-left z-10 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>AI-powered learning &amp; exam intelligence</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.08]"
              >
                Master your exams,<br />
                <span className="text-gradient">measurably.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-base md:text-lg text-zinc-500 max-w-xl leading-relaxed mx-auto lg:mx-0"
              >
                The 360° educational companion for university &amp; entrance examinations —
                FSRS v6 spaced repetition, verified semester notes, project blueprints, and
                real-time diagnostic analytics, in one platform.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1"
              >
                <Link
                  href="/exams"
                  className="w-full sm:w-auto px-5 py-3 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow-button transition-colors flex items-center justify-center gap-2"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Start Mock Exam</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/flashcards"
                  className="w-full sm:w-auto px-5 py-3 rounded-md bg-white hover:bg-zinc-50 text-zinc-800 font-semibold text-sm border border-zinc-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Brain className="w-4 h-4 text-primary-600" />
                  <span>Try FSRS Flashcards</span>
                </Link>
              </motion.div>

              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs text-zinc-500 font-medium">
                {trustBadges.map((b) => (
                  <div key={b.label} className="flex items-center gap-1.5">
                    <b.icon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero feature card grid */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {heroCards.map((c) => (
                  <Link
                    key={c.title}
                    href={c.href}
                    className="p-5 rounded-lg bg-white border border-zinc-200 hover:border-primary-300 shadow-xs hover:shadow-sm transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center mb-3 ${c.tint}`}>
                      <c.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-primary-600 transition-colors">{c.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{c.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics strip */}
      <section className="border-b border-zinc-200 bg-zinc-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((m) => (
            <div key={m.label} className="text-center md:text-left">
              <div className="text-2xl md:text-3xl font-bold text-zinc-900 tabular-nums">{m.value}</div>
              <div className="text-xs text-zinc-500 font-medium mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Pillars */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase text-primary-600 tracking-wider">The three pillars of mastery</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">Study. Practice. Diagnose.</h2>
            <p className="text-zinc-500 text-sm sm:text-base">
              A continuous feedback loop designed to increase test outcomes by 25% and reduce study fatigue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pillars.map((p) => (
              <div key={p.n} className="p-6 rounded-lg bg-white border border-zinc-200 space-y-3 shadow-xs">
                <div className="text-xs font-bold text-primary-600 tabular-nums">{p.n}</div>
                <h3 className="text-lg font-semibold text-zinc-900">{p.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto rounded-xl bg-zinc-900 text-white p-10 sm:p-14 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Trusted by students preparing for BIT, CSIT, CBSE &amp; A-Levels</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Ready to raise your score?</h2>
            <p className="text-zinc-400 text-sm">Start a free mock exam in under a minute — no credit card required.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/signup"
              className="px-5 py-3 rounded-md bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Get Started Free
            </Link>
            <Link
              href="/exams"
              className="px-5 py-3 rounded-md bg-zinc-800 text-white font-semibold text-sm hover:bg-zinc-700 transition-colors border border-zinc-700 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Explore Exams
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
