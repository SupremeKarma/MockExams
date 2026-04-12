"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  FileText, 
  CheckCircle, 
  PlusCircle, 
  Search, 
  Filter, 
  ChevronRight,
  TrendingUp,
  BarChart3,
  Settings,
  ShieldCheck,
  Brain,
  Zap,
  LayoutDashboard,
  Database,
  Globe,
  BookOpen,
  ArrowRight,
  Target,
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy, limit, doc, updateDoc } from "firebase/firestore";

export default function AdminDashboard() {
  const { user, isAdmin: isAuthAdmin, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    totalExams: 0,
    totalAttempts: 0,
    totalQuestions: 0,
    totalUsers: 0
  });
  const [recentExams, setRecentExams] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !isAuthAdmin) return;

    async function fetchStats() {
      try {
        const [examsSnap, attemptsSnap, questionsSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, "exams")),
          getDocs(collection(db, "exam_attempts")),
          getDocs(collection(db, "questions")),
          getDocs(collection(db, "users"))
        ]);

        setStats({
          totalExams: examsSnap.size,
          totalAttempts: attemptsSnap.size,
          totalQuestions: questionsSnap.size,
          totalUsers: usersSnap.size
        });

        // Use standard queries but handle them carefully
        // If sorting fails due to missing index, we fall back to unsorted
        try {
          const qExams = query(collection(db, "exams"), orderBy("updated_at", "desc"), limit(4));
          const recentExamsSnap = await getDocs(qExams);
          setRecentExams(recentExamsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
        } catch (e) {
          console.warn("Index not found for sorted exams, showing first 4:", e);
          const qExamsSimple = query(collection(db, "exams"), limit(4));
          const recentExamsSnapSimple = await getDocs(qExamsSimple);
          setRecentExams(recentExamsSnapSimple.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
        }

        try {
          const qUsers = query(collection(db, "users"), orderBy("created_at", "desc"), limit(5));
          const recentUsersSnap = await getDocs(qUsers);
          setRecentUsers(recentUsersSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
        } catch (e) {
          console.warn("Index not found for sorted users, showing first 5:", e);
          const qUsersSimple = query(collection(db, "users"), limit(5));
          const recentUsersSnapSimple = await getDocs(qUsersSimple);
          setRecentUsers(recentUsersSnapSimple.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
        }

      } catch (err) {
        console.error("Critical error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [authLoading, isAuthAdmin]);

  const changeUserRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setRecentUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error("Failed to update user role:", err);
      alert("Role update failed. Check console for details.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 relative mb-8">
          <div className="absolute inset-0 rounded-3xl bg-primary/20 animate-ping"></div>
          <div className="relative z-10 w-full h-full glass rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-primary animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Scanning Security Clearance</h2>
        <p className="text-slate-500 font-medium">Synchronizing administrative metadata and repository nodes...</p>
      </div>
    );
  }

  if (!isAuthAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-rose-500/10 rounded-[2rem] flex items-center justify-center mb-10 border border-rose-500/20">
          <X className="w-12 h-12 text-rose-500" />
        </div>
        <h1 className="text-4xl font-black text-gradient mb-4">Access Denied</h1>
        <p className="text-slate-500 max-w-md mx-auto font-medium leading-relaxed mb-12">
          Your current security clearance level is insufficient to access the platform's Command Center. 
          Please contact the system architect if you believe this is an error.
        </p>
        <Link 
          href="/dashboard" 
          className="px-12 py-4 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-black uppercase tracking-widest mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>System Administrator</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Command <span className="text-gradient">Center</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1">Supervising all platform activities from one central hub.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3"
          >
            <Link 
              href="/admin/exams/new" 
              className="px-6 py-3 bg-primary text-white rounded-2xl font-black flex items-center gap-2 hover:bg-primary-dark transition-all shadow-xl shadow-primary/20"
            >
              <PlusCircle className="w-5 h-5" />
              Build New Exam
            </Link>
            <button className="p-3 glass border-white/10 text-white rounded-2xl hover:bg-white/5 transition-all">
              <Settings className="w-6 h-6" />
            </button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <AdminStatCard icon={<Database />} label="Total Repository" value={stats.totalExams} subValue="Exams Managed" color="text-indigo-400" />
          <AdminStatCard icon={<Zap />} label="Active Traffic" value={stats.totalAttempts} subValue="Results Processed" color="text-amber-400" />
          <AdminStatCard icon={<Brain />} label="Knowledge Base" value={stats.totalQuestions} subValue="Questions Stored" color="text-emerald-400" />
          <AdminStatCard icon={<Users />} label="Member Base" value={stats.totalUsers} subValue="Total Users" color="text-rose-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Assets & Users */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card rounded-[2.5rem] border border-white/10 overflow-hidden">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                  <LayoutDashboard className="w-5 h-5 text-primary" />
                  Recent Infrastructure Updates
                </h2>
                <Link href="/admin/exams" className="text-sm font-bold text-primary hover:underline">View Repository</Link>
              </div>
              <div className="divide-y divide-white/5">
                {recentExams.map((exam) => (
                  <div key={exam.id} className="p-8 flex items-center justify-between hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs text-slate-500 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                         {exam.category?.substring(0, 2).toUpperCase() || "EX"}
                       </div>
                       <div>
                         <h4 className="font-bold text-white mb-1">{exam.title}</h4>
                         <p className="text-xs text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                           ID: {exam.id}
                         </p>
                       </div>
                    </div>
                    <Link href={`/admin/exams/${exam.id}`} className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-card rounded-[2.5rem] border border-white/10 overflow-hidden">
               <div className="p-8 border-b border-white/5">
                 <h2 className="text-xl font-bold text-white">Latest Registrations</h2>
               </div>
               <div className="divide-y divide-white/5">
                 {recentUsers.map(u => (
                    <div key={u.id} className="p-6 flex items-center justify-between hover:bg-white/[0.01]">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center font-bold text-xs uppercase">
                            {u.displayName?.[0] || u.email?.[0] || "U"}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-white">{u.displayName || "New Member"}</p>
                            <p className="text-[11px] text-slate-500 font-medium">{u.email}</p>
                          </div>
                       </div>
                       <div className="text-right flex items-center gap-3">
                          <select
                            value={u.role || 'student'}
                            onChange={(e) => changeUserRole(u.id, e.target.value)}
                            className="bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                          >
                            <option value="student" className="bg-slate-900">Student</option>
                            <option value="examiner" className="bg-slate-900">Examiner</option>
                            <option value="org_admin" className="bg-slate-900">Org Admin</option>
                            <option value="admin" className="bg-slate-900">Admin</option>
                          </select>
                       </div>
                    </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Quick Actions & System Health */}
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-[2rem] border border-white/10">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" /> System Metrics
                </h3>
                <div className="space-y-6">
                    <HealthBar label="Database Pulse" status="Healthy" progress={98} color="bg-emerald-500" />
                    <HealthBar label="API Latency" status="Optimal" progress={95} color="bg-primary" />
                    <HealthBar label="Auth Service" status="Active" progress={100} color="bg-indigo-500" />
                </div>
            </div>

            <div className="bg-gradient-to-br from-rose-600 to-rose-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-rose-500/20">
                <div className="relative z-10">
                    <h3 className="text-xl font-black mb-1">Global Lockdown</h3>
                    <p className="text-rose-100/70 text-xs font-medium mb-6 leading-relaxed">
                        Immediately disable all public exam access and institutional logins across the entire platform.
                    </p>
                    <button className="w-full py-4 bg-white text-rose-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95">
                        Enter Security Mode
                    </button>
                </div>
                <ShieldCheck className="absolute -bottom-8 -right-8 w-32 h-32 opacity-10 -rotate-12" />
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
               <AdminNavCard 
                 icon={<Users className="w-8 h-8" />}
                 title="Manage Users"
                 desc="Permissions & Accounts"
                 href="/admin/users"
                 color="bg-blue-500/10 text-blue-500"
               />
               <AdminNavCard 
                 icon={<FileText className="w-8 h-8" />}
                 title="Exam Studio"
                 desc="Content Management"
                 href="/admin/exams"
                 color="bg-emerald-500/10 text-emerald-500"
               />
               <AdminNavCard 
                 icon={<Database className="w-8 h-8" />}
                 title="Organizations"
                 desc="Entity Control"
                 href="/admin/organizations"
                 color="bg-amber-500/10 text-amber-500"
               />
               <AdminNavCard 
                 icon={<Settings className="w-8 h-8" />}
                 title="Settings"
                 desc="System Configuration"
                 href="/admin/settings"
                 color="bg-purple-500/10 text-purple-500"
               />
             </div>

            <div className="grid grid-cols-1 gap-4">
                <ManagementTile 
                    title="User Directory" 
                    path="/admin/users"
                    icon={<Users className="w-5 h-5 text-primary" />}
                />
                <ManagementTile 
                    title="Organizations" 
                    path="/admin/organizations"
                    icon={<Globe className="w-5 h-5 text-emerald-400" />}
                />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function AdminStatCard({ icon, label, value, subValue, color }: any) {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card p-8 rounded-[2rem] border border-white/10 transition-all hover:border-white/20 group"
        >
            <div className="flex items-start justify-between mb-6">
                <div className={`p-4 bg-white/5 rounded-2xl ${color} group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <div className="flex flex-col items-end text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{label}</p>
                    <span className="text-[10px] font-bold text-slate-600 truncate max-w-[100px]">{subValue}</span>
                </div>
            </div>
            <h3 className="text-4xl font-black text-white tracking-tight">{value}</h3>
        </motion.div>
    );
}

function HealthBar({ label, status, progress, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-slate-400">{label}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${status === 'Healthy' || status === 'Active' || status === 'Optimal' ? 'text-emerald-400' : 'text-rose-400'}`}>{status}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${progress}%` }}
                   className={`h-full ${color}`} 
                />
            </div>
        </div>
    );
}

function ManagementTile({ title, path, icon }: any) {
    return (
        <Link 
            href={path} 
            className="glass-card p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all group flex items-center justify-between"
        >
            <div className="flex items-center gap-4">
               <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                  {icon}
               </div>
               <h3 className="font-bold text-white text-sm">{title}</h3>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-all group-hover:translate-x-1" />
        </Link>
    );
}

function AdminNavCard({ icon, title, desc, href, color }: any) {
    return (
        <Link href={href}>
            <motion.div 
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card p-8 rounded-[2rem] border border-white/10 hover:border-white/20 transition-all h-full group"
            >
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">{desc}</p>
                <div className="mt-8 flex items-center gap-2 text-white/40 group-hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                    Access Tools <ChevronRight className="w-3 h-3" />
                </div>
            </motion.div>
        </Link>
    );
}
