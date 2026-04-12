"use client";

import { useEffect, useState, use } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getCountFromServer } from "firebase/firestore";
import { Users, BookOpen, Target, ArrowRight, Loader2, ShieldAlert, BarChart3, Settings, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function OrgDashboardPage({ params }: { params: any }) {
  const { orgId } = use(params) as { orgId: string };
  const { isAdmin, orgId: userOrgId } = useAuth();
  const [org, setOrg] = useState<any>(null);
  const [stats, setStats] = useState({ members: 0, exams: 0, attempts: 0 });
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => { fetchData(); }, [orgId]);

  const fetchData = async () => {
    try {
      if (!isAdmin && userOrgId !== orgId) { setUnauthorized(true); setLoading(false); return; }

      const orgSnap = await getDoc(doc(db, "organizations", orgId));
      if (!orgSnap.exists()) { setLoading(false); return; }
      const orgData = orgSnap.data();
      setOrg({ id: orgSnap.id, ...orgData });

      const [membersCount, examsCount] = await Promise.all([
        getCountFromServer(query(collection(db, "org_members"), where("org_id", "==", orgId))),
        getCountFromServer(query(collection(db, "exams"), where("org_id", "==", orgId))),
      ]);

      setStats({ 
        members: membersCount.data().count, 
        exams: examsCount.data().count, 
        attempts: 124 // Placeholder for demo, connect to real attempts collection later
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-slate-500 font-bold tracking-widest text-[10px] uppercase">Booting Command Center...</p>
    </div>
  );

  if (unauthorized) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-[2rem] bg-rose-500/10 flex items-center justify-center mb-6">
        <ShieldAlert className="w-10 h-10 text-rose-500" />
      </div>
      <h2 className="text-3xl font-black mb-3">Unauthorized <span className="text-rose-500">Access</span></h2>
      <p className="text-slate-400 font-medium max-w-sm">Encryption keys mismatch. You do not have host privileges for this organization's data node.</p>
      <Link href="/dashboard" className="mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all">Return to Home</Link>
    </div>
  );

  return (
    <div className="space-y-12 py-10 px-6 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/5">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">Institutional Portal</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none">{org?.type} Verified</span>
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tighter leading-none mb-4">{org?.name}</h1>
            <p className="text-slate-400 font-medium flex items-center gap-2">
              <span className="w-8 h-[2px] bg-primary/30" />
              Central Operations Management Profile
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-slate-400 hover:text-white">
            <Settings className="w-5 h-5" />
          </button>
          <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
            <ExternalLink className="w-5 h-5" /> ORG SETTINGS
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Users className="w-6 h-6" />} label="Total Strength" value={stats.members.toString()} suffix="Members" color="text-primary" bg="bg-primary/10" primary />
        <StatCard icon={<BookOpen className="w-6 h-6" />} label="Knowledge Assets" value={stats.exams.toString()} suffix="Exams" color="text-emerald-400" bg="bg-emerald-400/10" />
        <StatCard icon={<BarChart3 className="w-6 h-6" />} label="Engagement" value={stats.attempts.toString()} suffix="Attempts" color="text-amber-400" bg="bg-amber-400/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions Panel */}
        <div className="glass-card p-10 rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-colors" />
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
            Core <span className="text-primary">Directives</span>
          </h3>
          <div className="space-y-4 relative z-10">
            {[
              { href: `/organization/${orgId}/members`, label: "Roster Management", desc: "Provision access and define hierarchy", icon: <Users className="w-5 h-5" />, color: "text-primary bg-primary/10" },
              { href: `/organization/${orgId}/exams`, label: "Curriculum Assets", desc: "Manage institutional exam repositories", icon: <BookOpen className="w-5 h-5" />, color: "text-emerald-400 bg-emerald-400/10" },
              { href: `/organization/${orgId}/analytics`, label: "Intelligence Hub", desc: "Advanced performance diagnostics", icon: <Target className="w-5 h-5" />, color: "text-amber-400 bg-amber-400/10" },
            ].map((action, idx) => (
              <Link key={action.href} href={action.href} className="flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 rounded-[2rem] border border-white/5 transition-all group/action">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover/action:scale-110 ${action.color}`}>{action.icon}</div>
                  <div>
                    <h4 className="font-bold text-lg group-hover/action:text-primary transition-colors">{action.label}</h4>
                    <p className="text-sm text-slate-500 font-medium">{action.desc}</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover/action:bg-white group-hover/action:text-black transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Updates / Activity Placeholder */}
        <div className="glass-card p-10 rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/[0.01] to-transparent flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black">Live <span className="text-slate-500">Feed</span></h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 py-1 bg-white/5 rounded-full">Coming Soon</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-30 grayscale">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
              <BarChart3 className="w-10 h-10" />
            </div>
            <p className="text-sm font-medium max-w-[200px]">Real-time organization activity logs will populate here shortly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, suffix, color, bg, primary = false }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`glass-card p-8 rounded-[2.5rem] border ${primary ? 'border-primary/20 bg-primary/[0.02]' : 'border-white/5'}`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-xl ${bg} ${color}`}>{icon}</div>
      <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black tracking-tighter">{value}</span>
        <span className="text-xs font-bold text-slate-500 lowercase tracking-tight">{suffix}</span>
      </div>
    </motion.div>
  );
}
