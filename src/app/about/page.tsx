"use client";

import { motion } from "framer-motion";
import { Target, Shield, Globe, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Hero Section */}
      <section className="relative bg-mesh border-b border-zinc-200 pt-8 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>The future of assessment</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold mb-5 tracking-tight leading-tight"
          >
            Empowering the <span className="text-gradient">next generation</span> of global talent.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-base md:text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed"
          >
            MockExams is a sophisticated examination platform designed to facilitate rigorous academic evaluation.
            We provide students with high-fidelity entrance simulations and preparation systems.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-zinc-50/60 border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatItem label="Questions verified" value="25,000+" />
          <StatItem label="Categories" value="40+" />
          <StatItem label="Active students" value="10k+" />
          <StatItem label="Accuracy rate" value="99.9%" />
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Built on three core pillars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ValueCard
              icon={<Target className="w-5 h-5" />}
              tint="bg-primary-50 text-primary-600"
              title="Expert curation"
              description="Every question is manually verified by subject matter experts to ensure complete alignment with official curricula."
            />
            <ValueCard
              icon={<Shield className="w-5 h-5" />}
              tint="bg-sky-50 text-sky-600"
              title="Uncompromising integrity"
              description="Secure, proctored environments that ensure the value of your certification remains recognized worldwide."
            />
            <ValueCard
              icon={<Globe className="w-5 h-5" />}
              tint="bg-emerald-50 text-emerald-600"
              title="Global accessibility"
              description="From IOE Entrance in Nepal to SATs in New York, we localize every experience for the global student body."
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-zinc-50/60 border-y border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <div className="relative rounded-lg overflow-hidden aspect-video border border-zinc-200 shadow-sm">
               <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
                  alt="Team collaborating"
                  className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
               <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-xs font-bold text-primary-200 mb-1 uppercase tracking-wider">Our mission</p>
                  <h3 className="text-lg font-bold text-white">Bridging the gap in academic evaluation.</h3>
               </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-5">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Why we do what we do</h2>
            <p className="text-zinc-500 leading-relaxed text-sm">
              Education is the single greatest equalizer. Yet, the path to elite universities and high-stakes
              certifications is often gated by expensive coaching and lack of quality resources.
            </p>
            <p className="text-zinc-500 leading-relaxed text-sm">
              At MockExams, we believe every student, regardless of background, deserves access to
              world-class exam simulations. We are building the infrastructure that will power the
              future of standardized testing.
            </p>
            <div className="pt-2">
               <div className="flex items-center gap-3 text-primary-600 font-semibold text-sm">
                  <div className="w-10 h-px bg-primary-300" />
                  <span>The MockExams Leadership Team</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto rounded-lg bg-zinc-900 p-10 text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to reach your potential?</h2>
          <p className="text-zinc-400 mb-8 text-sm">Join thousands of students who are already using MockExams to prepare for their future.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
             <Link href="/signup" className="px-6 py-3 bg-primary-600 text-white rounded-md font-semibold text-sm hover:bg-primary-700 transition-colors shadow-button">
                Join our community
             </Link>
             <Link href="/organization/apply" className="px-6 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-md font-semibold text-sm hover:bg-zinc-700 transition-colors">
                Partner with us
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="text-center md:text-left">
      <div className="text-2xl md:text-3xl font-bold mb-1 text-zinc-900 tabular-nums">{value}</div>
      <div className="text-xs text-zinc-500 font-medium">{label}</div>
    </div>
  );
}

function ValueCard({ icon, title, description, tint }: { icon: any, title: string, description: string, tint: string }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-zinc-200 hover:border-primary-300 transition-colors">
      <div className={`w-10 h-10 rounded-md ${tint} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-base font-semibold mb-2 text-zinc-900">{title}</h3>
      <p className="text-zinc-500 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
