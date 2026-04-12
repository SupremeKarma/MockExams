"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  GraduationCap, 
  Rocket, 
  ShieldCheck, 
  Zap, 
  MousePointer2, 
  BarChart3, 
  Brain,
  ChevronRight,
  TrendingUp,
  Globe,
  Award
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-mesh overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          
          {/* Hero Content */}
          <div className="flex-1 text-center lg:text-left z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-black uppercase tracking-widest mb-8"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Supreme Exam Intelligence Platform</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.1] mb-8"
            >
              Master Your <br />
              <span className="text-gradient">Potential.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl font-medium leading-relaxed"
            >
              The advanced ecosystem designed for modern engineering students. 
              Combine deep analytics with curated question banks to achieve exam perfection.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Link href="/dashboard" className="px-10 py-5 bg-white text-black rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 group">
                <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Get Started
              </Link>
              <Link href="/exams" className="px-10 py-5 glass border-white/10 text-white rounded-2xl font-black transition-all hover:bg-white/5 active:scale-95 flex items-center justify-center gap-2 group">
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Explore Repository
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-12 flex items-center gap-6 text-slate-500 font-bold text-xs uppercase tracking-widest"
            >
              <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] text-white font-black">
                     {String.fromCharCode(64 + i)}
                   </div>
                 ))}
              </div>
              <span>Trusted by 5,000+ Students</span>
            </motion.div>
          </div>

          {/* Hero Image / Visualization */}
          <motion.div 
            initial={{ opacity: 0, x: 100, rotate: 10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-1 relative w-full aspect-square max-w-xl group"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full group-hover:bg-primary/30 transition-colors duration-1000" />
            <div className="relative glass-card rounded-[3rem] border-white/10 overflow-hidden shadow-2xl shadow-black/50 aspect-square">
               <Image 
                  src="/hero.png" 
                  alt="Supreme Dashboard Representation" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-[10s]"
                  priority
               />
               
               {/* Overlay labels */}
               <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-12 left-12 p-4 glass rounded-3xl border-white/20 shadow-xl"
               >
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
               </motion.div>

               <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-12 right-12 p-4 glass rounded-3xl border-white/20 shadow-xl"
               >
                  <Award className="w-6 h-6 text-primary" />
               </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Stats Bar */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
            <MetricStat label="Questions Served" value="1.2M+" />
            <MetricStat label="Active Chapters" value="450+" />
            <MetricStat label="Accuracy Gained" value="42%" />
            <MetricStat label="Member Base" value="50k+" />
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
                <h2 className="text-3xl md:text-5xl font-black mb-6">Built for <span className="text-gradient">Excellence.</span></h2>
                <p className="text-slate-400 max-w-2xl mx-auto font-medium">Platform architecture focused on raw performance and academic results.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<Zap className="text-amber-400" />}
                    title="Real-time Engine"
                    description="Our low-latency engine provides instant correctness validation and explanation triggers."
                />
                <FeatureCard 
                    icon={<Brain className="text-indigo-400" />}
                    title="Cognitive Analysis"
                    description="Deep-dive into your study patterns with AI-driven gap identification and focus suggestions."
                />
                <FeatureCard 
                    icon={<Globe className="text-emerald-400" />}
                    title="Resource Sync"
                    description="Seamlessly synchronize your performance across all devices with instant cloud backup."
                />
            </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
       <section className="py-32 relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="glass-card rounded-[4rem] p-12 md:p-24 border-white/10 relative overflow-hidden flex flex-col items-center text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-primary/50" />
                <h2 className="text-4xl md:text-6xl font-black mb-8 max-w-3xl leading-tight">Ready to transcend your limits?</h2>
                <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl font-medium">Join 50,000+ students already mastering their curriculum with MockExams.</p>
                
                <div className="flex gap-4">
                  <Link href="/signup" className="px-12 py-5 bg-primary text-white rounded-2xl font-black hover:scale-105 transition-all shadow-2xl shadow-primary/20">
                    Create Free Account
                  </Link>
                </div>

                {/* Decorative mesh inside card */}
                <div className="absolute -bottom-1/2 -left-1/4 w-1/2 h-full bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute -top-1/2 -right-1/4 w-1/2 h-full bg-secondary/10 blur-[120px] rounded-full" />
            </div>
          </div>
       </section>
    </div>
  );
}

function MetricStat({ label, value }: { label: string, value: string }) {
    return (
        <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter">{value}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</div>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all group hover:-translate-y-2 duration-500">
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform group-hover:bg-primary/10 group-hover:border-primary/20">
                {icon}
            </div>
            <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-slate-400 font-medium leading-relaxed">{description}</p>
            <div className="mt-8 flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all">
                Learn More <ChevronRight className="w-4 h-4" />
            </div>
        </div>
    )
}
