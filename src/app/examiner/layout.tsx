"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, ShieldAlert } from "lucide-react";

export default function ExaminerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isExaminer } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isExaminer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-amber-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Examiner Access Required</h1>
        <p className="text-slate-400 mb-8 max-w-md">
          This area is for certified examiners only. Contact an administrator to get examiner privileges.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-8 py-3 bg-primary text-white rounded-xl font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Examiner Portal</h1>
          <p className="text-slate-400 text-sm mt-1">Create, manage, and analyze your exams</p>
        </div>
      </div>
      {children}
    </div>
  );
}
