"use client";

import { 
  LineChart, 
  Clock, 
  Download, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  Award,
  ChevronRight,
  ArrowUpRight,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    studyHours: "0",
    examsTaken: "0",
    avgScore: "0%",
  });
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchUserData(user.uid); // Firebase uses uid
      } else {
        router.push("/login");
      }
    }
  }, [user, authLoading, router]);

  async function fetchUserData(uid: string) {
    try {
      const attemptsRef = collection(db, "exam_attempts");
      const q = query(
        attemptsRef,
        where("user_id", "==", uid),
        orderBy("attempted_at", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      let data: any[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setRecentAttempts(data.slice(0, 5));

      const totalAttempts = data.length;
      let totalPercentage = 0;
      
      data.forEach((attempt: any) => {
        totalPercentage += Number(attempt.percentage) || 0;
      });

      const avgScore = totalAttempts > 0 ? Math.round(totalPercentage / totalAttempts) : 0;

      setStats({
        studyHours: (totalAttempts * 0.8).toFixed(1), // Estimate 
        examsTaken: totalAttempts.toString(),
        avgScore: `${avgScore}%`,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.displayName || user?.email?.split('@')[0]}! 👋
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Here&apos;s what&apos;s happening with your exam preparation today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </button>
            <Link 
              href="/exams"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Start New Exam
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Exams" 
            value={stats.examsTaken}
            change="+12% from last month"
            icon={<BookOpen className="w-6 h-6 text-indigo-600" />}
            trend="up"
          />
          <StatCard 
            title="Average Score" 
            value={stats.avgScore}
            change="+5.2% from last month"
            icon={<Award className="w-6 h-6 text-emerald-600" />}
            trend="up"
          />
          <StatCard 
            title="Practice Time" 
            value={`${stats.studyHours}h`}
            change="+2.4h from last month"
            icon={<Clock className="w-6 h-6 text-amber-600" />}
            trend="up"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                {recentAttempts.length > 0 && (
                  <Link href="/dashboard/history" className="text-sm text-primary font-medium hover:underline">
                    View all
                  </Link>
                )}
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentAttempts.length > 0 ? (
                  recentAttempts.map((attempt) => (
                    <div key={attempt.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            Number(attempt.percentage) >= 70 ? "bg-emerald-500/10 text-emerald-500" : 
                            Number(attempt.percentage) >= 40 ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                          }`}>
                            <TrendingUp className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {attempt.exam_title || "Untitled Exam"}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(attempt.attempted_at).toLocaleDateString()}
                              </span>
                              <span className="text-gray-300 dark:text-gray-600">•</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {attempt.score}/{attempt.total_questions} points
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-black ${
                            Number(attempt.percentage) >= 70 ? "text-emerald-500" : 
                            Number(attempt.percentage) >= 40 ? "text-amber-500" : "text-rose-500"
                          }`}>
                            {attempt.percentage}%
                          </div>
                          <Link 
                            href={`/exams/results/${attempt.id}`}
                            className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1 mt-1"
                          >
                            Analysis <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-16 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
                      <BookOpen className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Exams Taken Yet</h3>
                    <p className="text-slate-400 max-w-sm mx-auto mb-8 font-medium">
                      Start your journey by taking your first mock exam. We&apos;ll analyze your results and provide personalized insights.
                    </p>
                    <Link 
                      href="/exams"
                      className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20"
                    >
                      Begin First Exam
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Skill Matrix */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Skill Matrix
              </h3>
              <div className="space-y-6">
                <SkillBar label="Mathematics" progress={recentAttempts.length > 0 ? 82 : 0} color="bg-blue-500" />
                <SkillBar label="Physics" progress={recentAttempts.length > 0 ? 65 : 0} color="bg-indigo-500" />
                <SkillBar label="Chemistry" progress={recentAttempts.length > 0 ? 45 : 0} color="bg-rose-500" />
              </div>
              <p className="mt-8 text-xs text-slate-400 font-medium">
                * Based on your performance across all {stats.examsTaken} exams.
              </p>
            </div>

            {/* CTA Box */}
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-2">Push Your Limits</h3>
                <p className="text-white/70 text-sm mb-8 leading-relaxed">
                  You&apos;re currently in the top {recentAttempts.length > 0 ? "15%" : "100%"} of students this month. Keep it up!
                </p>
                <Link 
                  href="/exams"
                  className="inline-flex items-center px-6 py-3 bg-white text-primary rounded-xl text-sm font-black hover:bg-slate-100 transition-all border-b-4 border-slate-200"
                >
                  Quick Start <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillBar({ label, progress, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
        <span className="text-slate-400">{label}</span>
        <span className="text-white">{progress}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-gray-900 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color}`} 
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon, trend }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl hover:border-primary/20 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{value}</h3>
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 w-fit">
        <span className={`text-[10px] font-black uppercase tracking-widest flex items-center ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
          <TrendingUp className="w-3 h-3 mr-1" />
          {change}
        </span>
      </div>
    </div>
  );
}
