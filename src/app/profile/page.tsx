"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Shield, LogOut, Loader2, Award } from "lucide-react";
import Link from "next/link";
import React from "react";


export default function ProfilePage() {
  const { user, loading, signOut, role } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Synchronizing Identity...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 pb-20 pt-32">
       {/* 🎨 Background Mesh */}
       <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-rose-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Profile Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-80 space-y-6"
          >
            <div className="glass-card p-10 rounded-[3rem] text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
              
              <div className="w-32 h-32 rounded-[2rem] bg-indigo-500/10 flex items-center justify-center mx-auto mb-8 relative border border-white/10 group-hover:scale-105 transition-transform duration-500 rotate-3 group-hover:rotate-0">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-[2rem] object-cover" />
                ) : (
                  <User className="w-14 h-14 text-indigo-400" />
                )}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-[#030711] flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                </div>
              </div>

              <h2 className="text-2xl font-black mb-1 tracking-tight">{user?.displayName || user?.email?.split('@')[0] || "User"}</h2>
              <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-8">
                {role === 'admin' ? 'System Administrator' : role === 'student' ? 'Elite Candidate' : 'Organization Leader'}
              </p>
              
              <button 
                onClick={() => signOut()}
                className="w-full py-4 bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all border border-white/5 hover:border-rose-500/20"
              >
                <LogOut className="w-4 h-4" /> Terminal Logoff
              </button>
            </div>

            <div className="glass-card p-8 rounded-[2rem] border-white/5">
              <h3 className="text-[10px] font-black mb-6 uppercase tracking-[0.3em] text-slate-500">Skills & Mastery</h3>
              <div className="flex flex-wrap gap-2">
                {["IOE Entrance", "Physics", "Mathematics", "Aptitude", "Mock Logic"].map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-indigo-500/5 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 space-y-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ProfileStat 
                icon={<Award className="w-6 h-6" />} 
                label="Global Rank" 
                value="#1,248" 
                trend="+85" 
                color="text-amber-400" 
                bg="bg-amber-500/10"
              />
              <ProfileStat 
                icon={<Shield className="w-6 h-6" />} 
                label="Reputation" 
                value="9.8k" 
                trend="Top 1%" 
                color="text-emerald-400" 
                bg="bg-emerald-500/10"
              />
            </div>

            <div className="glass-card p-10 rounded-[3rem] border-white/5">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-xl font-black tracking-tight">Personal Matrix</h3>
                <Link 
                  href="/settings"
                  className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
                >
                  Modify Data
                </Link>
              </div>

              <div className="space-y-8">
                <InfoItem icon={<User className="w-5 h-5" />} label="Display ID" value={user?.displayName || "Access Restricted"} />
                <InfoItem icon={<Mail className="w-5 h-5" />} label="Neural Email" value={user?.email || "Unknown"} />
                <InfoItem icon={<Calendar className="w-5 h-5" />} label="Creation Date" value="March 12, 2026" />
                <InfoItem 
                   icon={<Shield className="w-5 h-5" />} 
                   label="Clearance Level" 
                   value={role === 'admin' ? "Full Root Access" : "Standard Academic"} 
                />
              </div>
            </div>
            
            {/* Upgrade block removed */}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ProfileStat({ icon, label, value, trend, color, bg }: any) {
  return (
    <div className="glass-card p-8 rounded-[2.5rem] border-white/5 flex items-center gap-6 group hover:border-white/10 transition-all">
      <div className={`w-16 h-16 rounded-2xl ${bg} flex items-center justify-center ${color} shadow-inner`}>
        {icon}
      </div>
      <div>
        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{label}</div>
        <div className="text-2xl font-black text-white flex items-center gap-3">
          {value}
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">{trend}</span>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-4 group">
      <div className="flex items-center gap-6">
        <div className="p-3 bg-white/5 rounded-xl text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all border border-transparent group-hover:border-indigo-500/20">
          {icon}
        </div>
        <span className="text-sm font-bold text-slate-400 transition-colors group-hover:text-slate-300">{label}</span>
      </div>
      <span className="text-sm font-black text-white bg-white/5 px-4 py-1.5 rounded-xl border border-white/5">{value}</span>
    </div>
  );
}
