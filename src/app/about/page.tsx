"use client";

import { motion } from "framer-motion";
import { Brain, Target, Users, Shield, Globe, Zap, Cpu, Sparkles } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>The Future of Assessment</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-tight"
          >
            Empowering the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Next Generation</span> of Global Talent.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            MockExams is a sophisticated examination platform designed to facilitate rigorous academic evaluation. 
            We provide students with high-fidelity entrance simulations and entrance preparation systems.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatItem label="Questions Verified" value="25,000+" />
          <StatItem label="Categories" value="40+" />
          <StatItem label="Active Students" value="10k+" />
          <StatItem label="Accuracy Rate" value="99.9%" />
        </div>
      </section>

      {/* Core Values */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Built on Three Core Pillars</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ValueCard 
              icon={<Target className="w-8 h-8 text-primary" />}
              title="Expert Curation"
              description="Every question is manually verified by subject matter experts to ensure complete alignment with official curricula."
            />
            <ValueCard 
              icon={<Shield className="w-8 h-8 text-cyan-400" />}
              title="Uncompromising Integrity"
              description="Secure, proctored environments that ensure the value of your certification remains recognized worldwide."
            />
            <ValueCard 
              icon={<Globe className="w-8 h-8 text-emerald-400" />}
              title="Global Accessibility"
              description="From IOE Entrance in Nepal to SATs in New York, we localize every experience for the global student body."
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 bg-gradient-to-b from-transparent to-primary/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20">
          <div className="w-full md:w-1/2">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <div className="relative bg-slate-950 rounded-3xl overflow-hidden aspect-video border border-white/10">
                 <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
                    alt="Team Collaborating"
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                 <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-sm font-bold text-primary mb-2">OUR MISSION</p>
                    <h3 className="text-2xl font-bold">Bridging the gap in academic evaluation.</h3>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 space-y-8">
            <h2 className="text-4xl font-black tracking-tight">Why We Do What We Do</h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              Education is the single greatest equalizer. Yet, the path to elite universities and high-stakes 
              certifications is often gated by expensive coaching and lack of quality resources.
            </p>
            <p className="text-slate-400 leading-relaxed text-lg">
              At ExamAI, we believe every student, regardless of their zip code, deserves access to 
              world-class exam simulations. We are building the infrastructure that will power the 
              future of standardized testing.
            </p>
            <div className="pt-6">
               <div className="flex items-center gap-4 text-primary font-bold">
                  <div className="w-12 h-px bg-primary" />
                  <span>The ExamAI Leadership Team</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer-like About CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto glass-card p-12 rounded-[3rem] border-white/10">
          <h2 className="text-3xl font-bold mb-6">Ready to reach your potential?</h2>
          <p className="text-slate-400 mb-10">Join thousands of students who are already using MockExams to prepare for their future.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <button className="px-10 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 scale-100 hover:scale-105">
                Join our Community
             </button>
             <button className="px-10 py-4 glass border-white/10 text-white rounded-2xl font-bold hover:bg-white/5 transition-all">
                Partner with Us
             </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-5xl font-black mb-2 text-white">{value}</div>
      <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{label}</div>
    </div>
  );
}

function ValueCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="glass-card p-10 rounded-[2.5rem] border-white/5 hover:border-primary/30 transition-all group">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium">{description}</p>
    </div>
  );
}
