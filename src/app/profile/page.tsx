"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Shield, LogOut, Loader2, Award } from "lucide-react";
import Link from "next/link";
import React from "react";


export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Profile Sidebar */}
        <div className="w-full md:w-80 space-y-6">
          <div className="glass-card p-8 rounded-3xl text-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 relative border-4 border-white/5">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-primary" />
              )}
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full border-4 border-[#030711] flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-1">{user?.displayName || user?.email?.split('@')[0] || "Student"}</h2>
            <p className="text-sm text-slate-400 mb-6">{user?.email}</p>
            
            <button 
              onClick={() => signOut()}
              className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>

          <div className="glass-card p-6 rounded-3xl">
            <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-slate-500">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/5 text-xs font-medium rounded-lg border border-white/5">IOE Prep</span>
              <span className="px-3 py-1 bg-white/5 text-xs font-medium rounded-lg border border-white/5">Physics</span>
              <span className="px-3 py-1 bg-white/5 text-xs font-medium rounded-lg border border-white/5">Math</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-6 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Global Rank</div>
                <div className="text-lg font-bold">#142 <span className="text-[10px] text-emerald-400 font-medium ml-1">↑ 12</span></div>
              </div>
            </div>
            <div className="glass-card p-6 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Member Since</div>
                <div className="text-lg font-bold">March 2026</div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2rem]">
            <h3 className="text-xl font-bold mb-8">Personal Information</h3>
            <div className="space-y-6">
              <InfoRow icon={<User className="w-4 h-4" />} label="Display Name" value={user?.displayName || "Not set"} />
              <InfoRow icon={<Mail className="w-4 h-4" />} label="Email Address" value={user?.email || "Not set"} />
              <InfoRow icon={<Calendar className="w-4 h-4" />} label="Birth Date" value="Not provided" />
              <InfoRow icon={<Shield className="w-4 h-4" />} label="Account Type" value="Pro Academic Plan" />
            </div>
            
            <Link 
              href="/settings"
              className="mt-10 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors inline-block"
            >
              Edit Profile
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5">
      <div className="flex items-center gap-3 text-slate-400">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm font-bold text-slate-200">{value}</span>
    </div>
  );
}
