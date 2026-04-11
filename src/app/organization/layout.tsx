"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, ShieldAlert } from "lucide-react";

export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, role, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  const canAccess = isAdmin || role === "org_admin";

  if (!canAccess) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <ShieldAlert className="w-16 h-16 text-rose-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4">Organization Access Required</h1>
      <p className="text-slate-400 mb-8 max-w-md">
        You need an organization account to access this area.
      </p>
      <div className="flex gap-4">
        <button onClick={() => router.push("/organization/apply")} className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-400 transition-all">
          Apply for Org Account
        </button>
        <button onClick={() => router.push("/dashboard")} className="px-8 py-3 bg-white/5 text-slate-300 rounded-xl font-bold hover:bg-white/10 transition-all">
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gradient">Organization Portal</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your members, exams, and analytics</p>
      </div>
      {children}
    </div>
  );
}
