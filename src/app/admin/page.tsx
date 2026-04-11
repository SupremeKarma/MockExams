"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Target, Brain, ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getCountFromServer } from "firebase/firestore";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    exams: 0,
    attempts: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const usersRef = collection(db, 'users');
        const examsRef = collection(db, 'exams');
        const attemptsRef = collection(db, 'exam_attempts');
        
        const [userSnap, examSnap, attemptSnap] = await Promise.all([
          getCountFromServer(usersRef),
          getCountFromServer(examsRef),
          getCountFromServer(attemptsRef),
          // Also fetch recent users
          getDocs(query(collection(db, 'users'), orderBy('created_at', 'desc'), limit(5)))
        ]);
        
        setStats({
          users: userSnap.data().count,
          exams: examSnap.data().count,
          attempts: attemptSnap.data().count,
        });

        const usersDocs = await getDocs(query(collection(db, 'users'), orderBy('created_at', 'desc'), limit(5)));
        setRecentUsers(usersDocs.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight flex items-center gap-3">
            System <span className="text-primary">Command</span>
            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Healthy
            </div>
          </h2>
          <p className="text-slate-400 font-medium mt-1">Supervising all platform activities from one central hub.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/settings" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all">
            <Target className="w-5 h-5 text-slate-400" />
          </Link>
          <Link href="/admin/users" className="px-6 py-3 bg-white text-black rounded-2xl font-bold hover:bg-slate-200 transition-all">
            Manage All Users
          </Link>
        </div>
      </div>
      
      {/* Platform Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          title="Global Aspirants" 
          value={loading ? "..." : stats.users.toLocaleString()} 
          icon={<Users className="w-6 h-6" />} 
          color="text-blue-500" 
          bgColor="bg-blue-500/10" 
          trend="+12% this week"
        />
        <StatCard 
          title="Curriculum Base" 
          value={loading ? "..." : stats.exams.toLocaleString()} 
          icon={<BookOpen className="w-6 h-6" />} 
          color="text-emerald-500" 
          bgColor="bg-emerald-500/10" 
          trend="+3 new exams"
        />
        <StatCard 
          title="Practice Sessions" 
          value={loading ? "..." : stats.attempts.toLocaleString()} 
          icon={<Target className="w-6 h-6" />} 
          color="text-amber-500" 
          bgColor="bg-amber-500/10" 
          trend="89 completions today"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Registrations */}
        <div className="lg:col-span-2 glass-card rounded-[2.5rem] border border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <h3 className="text-xl font-black">Latest Registrations</h3>
            <Link href="/admin/users" className="text-primary text-xs font-bold hover:underline">Full Database</Link>
          </div>
          <div className="px-2">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                  <th className="p-6">User / Identity</th>
                  <th className="p-6">Role</th>
                  <th className="p-6 text-right">Join Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentUsers.length > 0 ? (
                  recentUsers.map(u => (
                    <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center font-bold text-xs">
                            {u.displayName?.[0] || u.email?.[0] || "U"}
                          </div>
                          <div>
                            <p className="font-bold text-sm tracking-tight">{u.displayName || "New User"}</p>
                            <p className="text-[11px] text-slate-500 font-medium">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          u.role === 'admin' ? 'bg-primary/20 text-primary' : 
                          u.role === 'examiner' ? 'bg-amber-400/20 text-amber-400' : 'bg-emerald-400/20 text-emerald-400'
                        }`}>
                          {u.role || 'Student'}
                        </span>
                      </td>
                      <td className="p-6 text-right text-xs font-bold text-slate-400">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Recent'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-20 text-center text-slate-500 font-medium italic">Scanning for new activity...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-xl font-black mb-6">Management</h3>
            <div className="space-y-3">
              <ActionButton 
                href="/admin/exams/generate" 
                icon={<Brain className="w-5 h-5" />} 
                title="AI Command" 
                desc="Global AI Exam Setup"
                color="text-primary"
              />
              <ActionButton 
                href="/admin/organizations" 
                icon={<Building2 className="w-5 h-5" />} 
                title="Institutes" 
                desc="Review Org Requests"
                color="text-emerald-400"
              />
              <ActionButton 
                href="/admin/stats/advanced" 
                icon={<TrendingUp className="w-5 h-5" />} 
                title="Intelligence" 
                desc="Deep Platform Analytics"
                color="text-amber-400"
              />
            </div>
          </div>

          {/* System Announcement Box */}
          <div className="bg-primary/20 p-8 rounded-[2.5rem] border border-primary/20 relative overflow-hidden group hover:bg-primary/30 transition-colors">
            <div className="relative z-10">
              <h4 className="font-bold text-primary text-sm uppercase tracking-widest mb-2">New Release</h4>
              <p className="text-white text-lg font-black leading-tight mb-4">V3.0 Deployment Pipeline is live.</p>
              <button className="text-xs font-bold px-4 py-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20">Check Changelog</button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary blur-3xl opacity-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ href, icon, title, desc, color }: any) {
  return (
    <Link href={href} className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group border border-transparent hover:border-white/10">
      <div className="flex items-center gap-4">
        <div className={`p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors ${color}`}>
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-sm tracking-tight">{title}</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{desc}</p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-all translate-x-0 group-hover:translate-x-1" />
    </Link>
  );
}

function StatCard({ title, value, icon, color, bgColor, trend }: any) {
  return (
    <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all group">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-xl ${bgColor} ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</h3>
      <div className="text-4xl font-black tracking-tighter mb-4">{value}</div>
      <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full w-fit">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span className="text-[10px] font-bold text-slate-400">{trend}</span>
      </div>
    </div>
  );
}
