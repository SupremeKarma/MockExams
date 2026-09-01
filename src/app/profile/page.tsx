"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Shield, LogOut, Loader2, Award } from "lucide-react";
import Link from "next/link";
import React from "react";
import { SectionCard } from "@/components/UIComponents";

export default function ProfilePage() {
  const { user, loading, signOut, role } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-white">
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      <p className="text-zinc-400 font-semibold uppercase tracking-widest text-[11px]">Loading profile</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50/40 pb-20 pt-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Profile Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-80 space-y-4"
          >
            <div className="bg-white p-8 rounded-lg border border-zinc-200 text-center">
              <div className="w-20 h-20 rounded-lg bg-primary-50 flex items-center justify-center mx-auto mb-5 relative border border-primary-100">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-lg object-cover" />
                ) : (
                  <User className="w-9 h-9 text-primary-600" />
                )}
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-emerald-500 rounded-md border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>

              <h2 className="text-lg font-bold text-zinc-900 mb-1">{user?.displayName || user?.email?.split('@')[0] || "User"}</h2>
              <p className="text-[11px] font-bold text-primary-600 uppercase tracking-wider mb-6">
                {role === 'admin' ? 'System Administrator' : role === 'student' ? 'Student' : 'Organization Leader'}
              </p>

              <button
                onClick={() => signOut()}
                className="w-full py-2.5 bg-zinc-50 hover:bg-red-50 text-zinc-600 hover:text-red-600 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-zinc-200 hover:border-red-200"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>

            <SectionCard title="Skills & mastery">
              <div className="flex flex-wrap gap-1.5">
                {["IOE Entrance", "Physics", "Mathematics", "Aptitude", "Mock Logic"].map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-primary-50 text-primary-700 text-[11px] font-semibold rounded-full border border-primary-100">
                    {tag}
                  </span>
                ))}
              </div>
            </SectionCard>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex-1 w-full space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ProfileStat
                icon={<Award className="w-5 h-5" />}
                label="Global Rank"
                value="#1,248"
                trend="+85"
                tint="bg-amber-50 text-amber-600"
              />
              <ProfileStat
                icon={<Shield className="w-5 h-5" />}
                label="Reputation"
                value="9.8k"
                trend="Top 1%"
                tint="bg-emerald-50 text-emerald-600"
              />
            </div>

            <SectionCard
              title="Personal information"
              actions={
                <Link
                  href="/settings"
                  className="px-3.5 py-1.5 bg-white border border-zinc-200 rounded-md text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  Edit
                </Link>
              }
            >
              <div className="space-y-1 -m-5 mt-0">
                <InfoItem icon={<User className="w-4 h-4" />} label="Display name" value={user?.displayName || "Not set"} />
                <InfoItem icon={<Mail className="w-4 h-4" />} label="Email" value={user?.email || "Unknown"} />
                <InfoItem icon={<Calendar className="w-4 h-4" />} label="Member since" value="March 12, 2026" />
                <InfoItem
                   icon={<Shield className="w-4 h-4" />}
                   label="Access level"
                   value={role === 'admin' ? "Full admin access" : "Standard student"}
                />
              </div>
            </SectionCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ProfileStat({ icon, label, value, trend, tint }: any) {
  return (
    <div className="bg-white p-5 rounded-lg border border-zinc-200 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-md ${tint} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <div className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wide mb-0.5">{label}</div>
        <div className="text-lg font-bold text-zinc-900 flex items-center gap-2">
          {value}
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{trend}</span>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-3 px-5 border-b border-zinc-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-zinc-50 rounded-md text-zinc-400">
          {icon}
        </div>
        <span className="text-xs font-medium text-zinc-500">{label}</span>
      </div>
      <span className="text-sm font-semibold text-zinc-900">{value}</span>
    </div>
  );
}
