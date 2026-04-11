"use client";

import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Rocket, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
          <GraduationCap className="w-4 h-4" />
          <span>Premier Academic Platform</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Master Your Exams with <br />
          <span className="text-gradient">MockExams</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
          The ultimate platform for students to practice, track, and excel. 
          Real-time analytics, peer benchmarks, and comprehensive expert-curated content.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group">
            <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            Start Practicing
          </Link>
          <Link href="/exams" className="px-8 py-4 glass text-white rounded-xl font-semibold transition-all hover:bg-white/5 flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5" />
            Explore Exams
          </Link>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-6xl w-full">
        <FeatureCard 
          icon={<Zap className="text-amber-400" />}
          title="Instant Feedback"
          description="Get detailed explanations and performance metrics immediately after submitting your exam."
          delay={0.2}
        />
        <FeatureCard 
          icon={<GraduationCap className="text-blue-400" />}
          title="Expert Content"
          description="Identify your weak areas with detailed performance insights and focused study recommendations."
          delay={0.4}
        />
        <FeatureCard 
          icon={<ShieldCheck className="text-emerald-400" />}
          title="Certified Banks"
          description="Access high-quality question banks verified by subject experts and based on official curriculum."
          delay={0.6}
        />
      </div>

      {/* Dashboard Preview / Call to Action */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-40 w-full max-w-5xl glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to rank #1?</h2>
            <p className="text-slate-400 text-lg mb-8">
              Join thousands of students who have improved their scores by over 40% using our platform.
            </p>
            <Link href="/signup" className="px-8 py-4 bg-white text-black rounded-xl font-bold transition-transform hover:scale-105 inline-block">
              Create Your Free Account
            </Link>
          </div>
          <div className="flex-1 glass p-6 rounded-2xl border-white/5 shadow-2xl">
            <div className="space-y-4">
              <div className="h-4 bg-white/10 rounded-full w-3/4" />
              <div className="h-4 bg-white/10 rounded-full w-1/2" />
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="h-20 bg-primary/20 rounded-xl" />
                <div className="h-20 bg-secondary/20 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Background glow for card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[100px] pointer-events-none" />
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className="glass-card p-8 rounded-2xl hover:border-primary/30 transition-colors group"
    >
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
