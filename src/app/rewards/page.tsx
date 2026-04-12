"use client";

import { motion } from "framer-motion";
import { 
  Medal, 
  Trophy, 
  Star, 
  Zap, 
  Rocket, 
  ShieldCheck, 
  Gift,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Trophy as TrophyIcon
} from "lucide-react";
import Link from "next/link";

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-mesh py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Seasonal Achievements</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">Excellence Rewarded.</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            At ExamAI, we believe hard work deserves recognition. Climb the ranks, master your 
            subjects, and unlock premium benefits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          <RewardTier 
            icon={<Trophy className="text-amber-400" />}
            title="Top 1% Global"
            reward="Full Academic Scholarship"
            desc="The elite circle. Top 1% of students every semester receive $500 tuition reimbursement."
            color="border-amber-500/20 bg-amber-500/5"
            tag="Elite"
          />
          <RewardTier 
            icon={<Medal className="text-slate-300" />}
            title="Consistent Pro"
            reward="Masterclass Access"
            desc="Maintain a 90% average for 3 months to unlock exclusive 1-on-1 sessions with industry experts."
            color="border-slate-500/20 bg-slate-500/5"
            tag="Pro"
          />
          <RewardTier 
            icon={<Star className="text-orange-400" />}
            title="Community Leader"
            reward="Premium Badge & Swag"
            desc="Top contributors in discussions and leaderboard climbers get the Supreme Hoodie kit."
            color="border-orange-500/20 bg-orange-500/5"
            tag="Active"
          />
        </div>

        <div className="glass-card rounded-[3rem] p-12 md:p-20 border-white/10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6 text-primary font-black text-xs uppercase tracking-[0.3em]">
                <Zap className="w-4 h-4" />
                Current Season
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">Physics Mastery <br />Challenge 2026</h2>
              <p className="text-slate-400 text-lg mb-10 font-medium leading-relaxed">
                The top 100 students in the Engineering Physics category by the end of this month 
                will receive a signed certificate of excellence and a 1-year free subscription 
                to Supreme Analytics.
              </p>
              <div className="flex gap-4">
                <Link href="/exams" className="px-8 py-4 bg-white text-black rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all">
                  Start Challenge
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
              <MetricItem icon={<TrophyIcon />} value="100" label="Spots Remaining" />
              <MetricItem icon={<Rocket />} value="12" label="Days Left" />
              <MetricItem icon={<ShieldCheck />} value="Verified" label="Skill Level" />
              <MetricItem icon={<Gift />} value="$2,500" label="Prize Pool" />
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full -z-10" />
        </div>
      </div>
    </div>
  );
}

function RewardTier({ icon, title, reward, desc, color, tag }: any) {
  return (
    <div className={`p-10 rounded-[2.5rem] border ${color} transition-all hover:-translate-y-2 group`}>
      <div className="flex justify-between items-start mb-8">
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">
          {tag}
        </span>
      </div>
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">{title}</h3>
      <div className="text-2xl font-black text-white mb-6 leading-tight">{reward}</div>
      <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">{desc}</p>
      <div className="h-px bg-white/5 w-full mb-8" />
      <button className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
        Eligibility Rules <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function MetricItem({ icon, value, label }: any) {
  return (
    <div className="glass-card p-6 py-8 rounded-3xl border border-white/5 flex flex-col items-center text-center">
      <div className="text-slate-500 mb-4">{icon}</div>
      <div className="text-2xl font-black text-white mb-1">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</div>
    </div>
  );
}
