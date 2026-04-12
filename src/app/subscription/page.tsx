"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2,
  Globe,
  Infinity,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-black text-white selection:bg-indigo-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.3em] mb-12"
        >
          <ShieldCheck className="w-5 h-5" /> Platform Security: UNLOCKED
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-8xl font-black mb-8 tracking-tighter"
        >
          Access is now <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">Universal.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-400 text-xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed"
        >
          We've removed all tier-based restrictions. Every simulation, every note, and every AI metric is now available to all users at zero cost.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-20 text-left">
           <UnlockedFeature 
             icon={<Zap className="w-8 h-8 text-indigo-400" />}
             title="Unlimited Mocks"
             desc="Access all 500+ premium simulation sessions instantly."
           />
           <UnlockedFeature 
             icon={<Sparkles className="w-8 h-8 text-cyan-400" />}
             title="AI Analytics"
             desc="Advanced performance metrics and cognitive tracking enabled."
           />
           <UnlockedFeature 
             icon={<Infinity className="w-8 h-8 text-emerald-400" />}
             title="Forever Free"
             desc="No credit cards. No subscriptions. No limits."
           />
        </div>

        <Link 
          href="/dashboard"
          className="group px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all flex items-center gap-4 shadow-2xl shadow-white/10"
        >
          Return to Dashboard <CheckCircle2 className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

function UnlockedFeature({ icon, title, desc }: any) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
      <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform">
        {icon}
      </div>
      <h4 className="text-xl font-black mb-2 text-white">{title}</h4>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
