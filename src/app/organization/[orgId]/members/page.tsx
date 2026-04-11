"use client";

import { useState, useEffect, use } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { Users, Plus, Trash2, Loader2, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

const ROLE_COLORS: Record<string, string> = {
  org_admin: "text-amber-400 bg-amber-400/10",
  examiner: "text-primary bg-primary/10",
  student: "text-slate-400 bg-white/5",
};

export default function OrgMembersPage({ params }: { params: any }) {
  const { orgId } = use(params) as { orgId: string };
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("student");
  const [inviting, setInviting] = useState(false);

  useEffect(() => { fetchMembers(); }, [orgId]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "org_members"), where("org_id", "==", orgId)));
      setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      await addDoc(collection(db, "org_members"), {
        org_id: orgId,
        user_id: null,
        role: inviteRole,
        status: "invited",
        invited_email: inviteEmail.trim().toLowerCase(),
        joined_at: serverTimestamp(),
      });
      setInviteEmail("");
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("Failed to send invite");
    } finally {
      setInviting(false);
    }
  };

  const changeRole = async (memberId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, "org_members", memberId), { role: newRole });
      fetchMembers();
    } catch { alert("Failed to update role"); }
  };

  const removeMember = async (memberId: string) => {
    if (!confirm("Remove this member?")) return;
    try {
      await deleteDoc(doc(db, "org_members", memberId));
      setMembers(prev => prev.filter(m => m.id !== memberId));
    } catch { alert("Failed to remove"); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href={`/organization/${orgId}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Users className="text-primary w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Member Management</h1>
          <p className="text-slate-400 text-sm">Invite and manage your organization's members</p>
        </div>
      </div>

      {/* Invite Form */}
      <form onSubmit={handleInvite} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="font-bold flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> Invite by Email</h3>
        <div className="flex gap-3">
          <input
            type="email" required
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            placeholder="student@school.edu"
            className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary/50 outline-none transition-all text-sm"
          />
          <select
            value={inviteRole}
            onChange={e => setInviteRole(e.target.value)}
            className="p-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary/50 outline-none transition-all text-sm"
          >
            <option value="student">Student</option>
            <option value="examiner">Examiner</option>
          </select>
          <button type="submit" disabled={inviting}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50">
            {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Invite
          </button>
        </div>
        <p className="text-xs text-slate-500">The invited person will be auto-joined to your organization when they sign up or log in with this email.</p>
      </form>

      {/* Members List */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <span className="font-bold">{members.length} Members</span>
        </div>
        {members.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">No members yet. Invite someone above.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="p-4">Email / User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-white/[0.02]">
                  <td className="p-4">
                    <p className="text-sm font-medium">{m.invited_email ?? "—"}</p>
                    {m.user_id && <p className="text-xs text-slate-500 font-mono">{m.user_id}</p>}
                  </td>
                  <td className="p-4">
                    <select
                      value={m.role}
                      onChange={e => changeRole(m.id, e.target.value)}
                      className={`text-xs font-bold px-2 py-1 rounded-lg border-0 outline-none cursor-pointer ${ROLE_COLORS[m.role] ?? "text-slate-400 bg-white/5"}`}
                    >
                      <option value="student">Student</option>
                      <option value="examiner">Examiner</option>
                      <option value="org_admin">Org Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${m.status === "active" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => removeMember(m.id)} className="text-slate-500 hover:text-rose-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
