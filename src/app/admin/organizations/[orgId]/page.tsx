"use client";

import { useState, useEffect, use } from "react";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ArrowLeft,
  Users,
  BookOpen,
  ShieldAlert,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";

export default function AdminOrgDetailPage({ params }: { params: any }) {
  const { orgId } = use(params) as { orgId: string };
  const [org, setOrg] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [orgId]);

  const fetchData = async () => {
    try {
      const orgSnap = await getDoc(doc(db, "organizations", orgId));
      if (!orgSnap.exists()) return;
      setOrg({ id: orgSnap.id, ...orgSnap.data() });

      const [membersSnap, examsSnap] = await Promise.all([
        getDocs(query(collection(db, "org_members"), where("org_id", "==", orgId))),
        getDocs(query(collection(db, "exams"), where("org_id", "==", orgId))),
      ]);

      setMembers(membersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setExams(examsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleSuspend = async () => {
    if (!org) return;
    const newStatus = org.status === "suspended" ? "approved" : "suspended";
    if (!confirm(`${newStatus === "suspended" ? "Suspend" : "Restore"} this organization?`)) return;
    try {
      await updateDoc(doc(db, "organizations", orgId), { status: newStatus, updated_at: serverTimestamp() });
      setOrg((prev: any) => ({ ...prev, status: newStatus }));
    } catch { alert("Failed to update"); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!org) return (
    <div className="text-center py-20 text-zinc-500">
      <ShieldAlert className="w-12 h-12 mx-auto mb-4 text-rose-500 opacity-60" />
      <p>Organization not found.</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <Link href="/admin/organizations" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Organizations
      </Link>

      {/* Org Header */}
      <div className="glass-card p-6 rounded-lg border border-zinc-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{org.name}</h2>
            <p className="text-zinc-500 text-sm mt-1 capitalize">{org.type} · {org.email}</p>
            <span className={`mt-2 inline-block text-xs font-bold px-2 py-1 rounded-lg ${
              org.status === "approved" ? "bg-emerald-50 text-emerald-700" :
              org.status === "suspended" ? "bg-red-50 text-red-700" :
              "bg-amber-50 text-amber-700"
            }`}>{org.status}</span>
          </div>
          <button
            onClick={toggleSuspend}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              org.status === "suspended"
                ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 hover:bg-emerald-500/20"
                : "bg-rose-500/10 text-red-700 border border-rose-500/20 hover:bg-rose-500/20"
            }`}
          >
            {org.status === "suspended" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {org.status === "suspended" ? "Restore" : "Suspend"}
          </button>
        </div>
      </div>

      {/* Members */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" /> Members ({members.length})
        </h3>
        {members.length === 0 ? (
          <div className="glass-card p-8 rounded-lg border border-zinc-200 text-center text-zinc-500 text-sm">No members yet.</div>
        ) : (
          <div className="glass-card rounded-lg border border-zinc-200 overflow-x-auto">
            <table className="w-full text-left min-w-[560px]">
              <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-widest">
                <tr>
                  <th className="p-4">User ID</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {members.map(m => (
                  <tr key={m.id} className="hover:bg-zinc-100">
                    <td className="p-4 font-mono text-xs text-zinc-500">{m.user_id}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg capitalize ${
                        m.role === "org_admin" ? "bg-amber-50 text-amber-700" :
                        m.role === "examiner" ? "bg-primary/10 text-primary" :
                        "bg-zinc-50 text-zinc-500"
                      }`}>{m.role}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${m.status === "active" ? "text-emerald-700 bg-emerald-50" : "text-zinc-500 bg-zinc-50"}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-500 text-sm">{m.invited_email ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Exams */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-700" /> Exams ({exams.length})
        </h3>
        {exams.length === 0 ? (
          <div className="glass-card p-8 rounded-lg border border-zinc-200 text-center text-zinc-500 text-sm">No exams created yet.</div>
        ) : (
          <div className="space-y-2">
            {exams.map(exam => (
              <div key={exam.id} className="flex items-center justify-between p-4 glass-card rounded-xl border border-zinc-200">
                <div>
                  <p className="font-medium">{exam.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{exam.category} · {exam.total_questions ?? 0} questions</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${exam.is_published ? "bg-emerald-50 text-emerald-700" : "bg-zinc-50 text-zinc-500"}`}>
                  {exam.is_published ? "Published" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
