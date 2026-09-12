"use client";

import { useState, useEffect } from "react";
import {
  Users,
  FileText,
  PlusCircle,
  ChevronRight,
  Settings,
  ShieldCheck,
  Brain,
  Zap,
  Database,
  Globe,
  ScanLine,
  LayoutGrid,
  ClipboardList,
  FileEdit,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  doc,
  updateDoc,
} from "firebase/firestore";
import { PageHeader, StatCard, SectionCard, PrimaryButton } from "@/components/UIComponents";

export default function AdminDashboard() {
  const { user: _user, isAdmin: isAuthAdmin, loading: authLoading } = useAuth();
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
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
        <div className="relative w-10 h-10 mb-4">
          <div className="absolute inset-0 border-2 border-primary-100 rounded-full" />
          <div className="absolute inset-0 border-2 border-t-primary-600 rounded-full animate-spin" />
        </div>
        <h2 className="text-sm font-semibold text-zinc-900 mb-1">Verifying access</h2>
        <p className="text-zinc-500 text-xs">Synchronizing administrative metadata...</p>
      </div>
    );
  }

  if (!isAuthAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
        <div className="w-14 h-14 bg-red-50 rounded-lg flex items-center justify-center mb-6 border border-red-200">
          <X className="w-7 h-7 text-red-600" />
        </div>
        <h1 className="text-xl font-bold text-zinc-900 mb-2">Access denied</h1>
        <p className="text-zinc-500 max-w-md mx-auto text-sm leading-relaxed mb-6">
          Your account doesn&apos;t have administrator access. Contact a platform admin if you believe this is an error.
        </p>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 bg-primary-600 text-white rounded-md font-semibold text-sm hover:bg-primary-700 transition-colors"
        >
          Return to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/40 pb-20 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-7xl mx-auto space-y-6">

        <PageHeader
          badge="System Administrator"
          title="Command center"
          subtitle="Supervise all platform activity — exams, users, and organizations — from one hub."
          actions={
            <>
              <PrimaryButton href="/admin/exams/new" icon={<PlusCircle className="w-4 h-4" />}>
                Build new exam
              </PrimaryButton>
              <Link href="/admin/organizations" className="p-2.5 rounded-md bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </Link>
            </>
          }
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Database className="w-4 h-4" />} label="Total Repository" value={stats.totalExams} subValue="Exams managed" />
          <StatCard icon={<Zap className="w-4 h-4" />} label="Active Traffic" value={stats.totalAttempts} subValue="Results processed" />
          <StatCard icon={<Brain className="w-4 h-4" />} label="Knowledge Base" value={stats.totalQuestions} subValue="Questions stored" />
          <StatCard icon={<Users className="w-4 h-4" />} label="Member Base" value={stats.totalUsers} subValue="Total users" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Assets & Users */}
          <div className="lg:col-span-2 space-y-4">
            <SectionCard
              title="Recent infrastructure updates"
              actions={<Link href="/admin/exams" className="text-xs font-semibold text-primary-600 hover:underline">View repository</Link>}
            >
              <div className="divide-y divide-zinc-100 -m-5">
                {recentExams.map((exam) => (
                  <div key={exam.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors group">
                    <div className="flex items-center gap-3.5">
                       <div className="w-10 h-10 rounded-md bg-zinc-100 flex items-center justify-center font-bold text-xs text-zinc-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                         {exam.category?.substring(0, 2).toUpperCase() || "EX"}
                       </div>
                       <div>
                         <h4 className="font-semibold text-sm text-zinc-900 mb-0.5">{exam.title}</h4>
                         <p className="text-xs text-zinc-400 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                           ID: {exam.id}
                         </p>
                       </div>
                    </div>
                    <Link href={`/admin/exams/${exam.id}`} className="p-2 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
                {recentExams.length === 0 && (
                  <div className="p-8 text-center text-zinc-400 text-xs">No exams yet.</div>
                )}
              </div>
            </SectionCard>

            <SectionCard title="Latest registrations">
              <div className="divide-y divide-zinc-100 -m-5">
                 {recentUsers.map(u => (
                    <div key={u.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-md bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-xs uppercase">
                            {u.displayName?.[0] || u.email?.[0] || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-zinc-900">{u.displayName || "New Member"}</p>
                            <p className="text-[11px] text-zinc-400">{u.email}</p>
                          </div>
                       </div>
                       <select
                          value={u.role || 'student'}
                          onChange={(e) => changeUserRole(u.id, e.target.value)}
                          className="bg-zinc-50 border border-zinc-200 text-zinc-700 text-[11px] font-semibold px-2.5 py-1.5 rounded-md focus:outline-none focus:border-primary-500 cursor-pointer"
                        >
                          <option value="student">Student</option>
                          <option value="examiner">Examiner</option>
                          <option value="org_admin">Org Admin</option>
                          <option value="admin">Admin</option>
                        </select>
                    </div>
                 ))}
                 {recentUsers.length === 0 && (
                  <div className="p-8 text-center text-zinc-400 text-xs">No users yet.</div>
                 )}
               </div>
            </SectionCard>
          </div>

          {/* Quick Actions & System Health */}
          <div className="space-y-4">
            <SectionCard title="System metrics">
                <div className="space-y-4">
                    <HealthBar label="Database Pulse" status="Healthy" progress={98} color="bg-emerald-600" />
                    <HealthBar label="API Latency" status="Optimal" progress={95} color="bg-primary-600" />
                    <HealthBar label="Auth Service" status="Active" progress={100} color="bg-sky-600" />
                </div>
            </SectionCard>

            <div className="rounded-lg bg-red-600 p-5 text-white relative overflow-hidden">
                <div className="relative z-10 space-y-3">
                    <h3 className="text-sm font-bold">Global lockdown</h3>
                    <p className="text-red-100 text-xs leading-relaxed">
                        Immediately disable all public exam access and institutional logins across the platform.
                    </p>
                    <button className="w-full py-2.5 bg-white text-red-700 rounded-md font-semibold text-xs hover:bg-red-50 transition-colors">
                        Enter security mode
                    </button>
                </div>
                <ShieldCheck className="absolute -bottom-6 -right-6 w-24 h-24 opacity-10" />
            </div>

             <div className="grid grid-cols-2 gap-3">
               <AdminNavCard icon={<Users className="w-5 h-5" />} title="Users" desc="Permissions" href="/admin/users" tint="bg-sky-50 text-sky-600" />
               <AdminNavCard icon={<FileText className="w-5 h-5" />} title="Exams" desc="Content" href="/admin/exams" tint="bg-emerald-50 text-emerald-600" />
               <AdminNavCard icon={<ScanLine className="w-5 h-5" />} title="Past papers" desc="ExamAI" href="/admin/papers" tint="bg-rose-50 text-rose-600" />
               <AdminNavCard icon={<LayoutGrid className="w-5 h-5" />} title="Courses" desc="ExamAI" href="/admin/courses" tint="bg-indigo-50 text-indigo-600" />
               <AdminNavCard icon={<FileEdit className="w-5 h-5" />} title="Notes" desc="ExamAI" href="/admin/notes" tint="bg-sky-50 text-sky-600" />
               <AdminNavCard icon={<ClipboardList className="w-5 h-5" />} title="Mock exams" desc="ExamAI" href="/admin/mock-exams" tint="bg-teal-50 text-teal-600" />
               <AdminNavCard icon={<Database className="w-5 h-5" />} title="Orgs" desc="Entities" href="/admin/organizations" tint="bg-amber-50 text-amber-600" />
               <AdminNavCard icon={<Settings className="w-5 h-5" />} title="Settings" desc="Config" href="/settings" tint="bg-violet-50 text-violet-600" />
             </div>

            <div className="space-y-2">
                <ManagementTile
                    title="User Directory"
                    path="/admin/users"
                    icon={<Users className="w-4 h-4 text-primary-600" />}
                />
                <ManagementTile
                    title="Organizations"
                    path="/admin/organizations"
                    icon={<Globe className="w-4 h-4 text-emerald-600" />}
                />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function HealthBar({ label, status, progress, color }: any) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-end">
                <span className="text-xs font-medium text-zinc-500">{label}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${status === 'Healthy' || status === 'Active' || status === 'Optimal' ? 'text-emerald-600' : 'text-red-600'}`}>{status}</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
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
            className="bg-white p-3.5 rounded-lg border border-zinc-200 hover:border-primary-300 transition-colors group flex items-center justify-between"
        >
            <div className="flex items-center gap-3">
               <div className="p-2 bg-zinc-50 rounded-md group-hover:bg-primary-50 transition-colors">
                  {icon}
               </div>
               <h3 className="font-semibold text-zinc-900 text-sm">{title}</h3>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-primary-600 transition-all group-hover:translate-x-0.5" />
        </Link>
    );
}

function AdminNavCard({ icon, title, desc, href, tint }: any) {
    return (
        <Link href={href}>
            <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
                className="bg-white p-4 rounded-lg border border-zinc-200 hover:border-primary-300 transition-colors h-full"
            >
                <div className={`w-9 h-9 rounded-md ${tint} flex items-center justify-center mb-3`}>
                    {icon}
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-0.5">{title}</h3>
                <p className="text-zinc-500 text-xs">{desc}</p>
            </motion.div>
        </Link>
    );
}
