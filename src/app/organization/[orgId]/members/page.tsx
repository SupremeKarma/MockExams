"use client";

import { useState, useEffect, use } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, setDoc, limit } from "firebase/firestore";
import { Users, Plus, Trash2, Loader2, ArrowLeft, Mail, Shield, User, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const ROLE_COLORS: Record<string, string> = {
  org_admin: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  examiner: "text-primary bg-primary/10 border-primary/20",
  student: "text-slate-400 bg-white/5 border-white/10",
};

const STATUS_ICONS: Record<string, any> = {
  active: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
  invited: <Clock className="w-3.5 h-3.5 text-amber-400" />,
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
      setMembers(snap.docs.map((d: any) => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;
    setInviting(true);
    try {
      const usersSnap = await getDocs(
        query(collection(db, "users"), where("email", "==", email), limit(1))
      );
      
      if (!usersSnap.empty) {
        const targetUser = usersSnap.docs[0];
        const targetUid = targetUser.id;

        await setDoc(doc(db, "org_members", `${targetUid}_${orgId}`), {
          org_id: orgId,
          user_id: targetUid,
          role: inviteRole,
          status: "active",
          invited_email: email,
          joined_at: serverTimestamp(),
        });

        await updateDoc(doc(db, "users", targetUid), {
          role: inviteRole,
          org_id: orgId
        });
      } else {
        await addDoc(collection(db, "org_members"), {
          org_id: orgId,
          user_id: null,
          role: inviteRole,
          status: "invited",
          invited_email: email,
          joined_at: serverTimestamp(),
        });
      }

      setInviteEmail("");
      fetchMembers();
    } catch (err) {
      console.error(err);
    } finally {
      setInviting(false);
    }
  };

  const changeRole = async (memberId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, "org_members", memberId), { role: newRole });
      fetchMembers();
    } catch { console.error("Failed to update role"); }
  };

  const removeMember = async (memberId: string) => {
    if (!confirm("Permanently remove this member from your organization?")) return;
    try {
      await deleteDoc(doc(db, "org_members", memberId));
      setMembers(prev => prev.filter(m => m.id !== memberId));
    } catch { console.error("Failed to remove"); }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="text-slate-500 font-bold animate-pulse text-sm">LOADING ROSTER...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-10 px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
        <div className="space-y-4">
          <Link href={`/organization/${orgId}`} className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
            <ArrowLeft className="w-4 h-4" /> Exit to Dashboard
          </Link>
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              Team <span className="text-primary italic">Command</span>
            </h1>
            <p className="text-slate-400 font-medium max-w-md">Oversee institutional access, manage educator privileges, and monitor student enrollment.</p>
          </div>
        </div>

        {/* Invite Form inline/expanded */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 rounded-[2rem] border border-white/10 flex flex-col gap-4 min-w-[340px]"
        >
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
            <Plus className="w-3 h-3" /> Quick Add Member
          </h3>
          <form onSubmit={handleInvite} className="flex flex-col gap-3">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input
                type="email" required
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all text-sm font-medium"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
              >
                <option value="student">Student Account</option>
                <option value="examiner">Author (Examiner)</option>
              </select>
              <button type="submit" disabled={inviting}
                className="px-6 py-3 bg-primary text-white rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center min-w-[100px]"
              >
                {inviting ? <Loader2 className="w-5 h-5 animate-spin" /> : "SEND INVITE"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Members Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MemberStatBox label="Total Faculty" value={members.filter(m => m.role === 'examiner' || m.role === 'org_admin').length} icon={<Shield className="w-5 h-5" />} color="text-amber-400" />
        <MemberStatBox label="Enrolled Students" value={members.filter(m => m.role === 'student').length} icon={<User className="w-5 h-5" />} color="text-primary" />
        <MemberStatBox label="Pending invites" value={members.filter(m => m.status === 'invited').length} icon={<Clock className="w-5 h-5" />} color="text-slate-400" />
      </div>

      {/* Main Table */}
      <div className="glass-card rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl shadow-black/50">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <h2 className="text-xl font-black">Institutional Roster</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Sync</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.03] text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Profile info</th>
                <th className="px-8 py-5">Privileges</th>
                <th className="px-8 py-5">Access status</th>
                <th className="px-8 py-5 text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {members.map((m, idx) => (
                  <motion.tr 
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-white/[0.02] group transition-all"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center font-black text-xs text-white group-hover:border-primary/50 transition-colors shadow-inner`}>
                          {m.invited_email?.[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm tracking-tight">{m.invited_email}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Joined {new Date(m.joined_at?.toDate()).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <select
                        value={m.role}
                        onChange={e => changeRole(m.id, e.target.value)}
                        className={`text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1.5 rounded-xl border-2 outline-none cursor-pointer transition-all hover:scale-[1.05] active:scale-95 ${ROLE_COLORS[m.role] ?? "text-slate-400 bg-white/5 border-white/10"}`}
                      >
                        <option value="student">Student</option>
                        <option value="examiner">Examiner</option>
                        <option value="org_admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {STATUS_ICONS[m.status]}
                        <span className={`text-[10px] font-black uppercase tracking-widest ${m.status === 'active' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {m.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => removeMember(m.id)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all group/del"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {members.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-500">
                      <Users className="w-12 h-12 opacity-20" />
                      <p className="font-medium italic">No members documented in your roster yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MemberStatBox({ label, value, icon, color }: any) {
  return (
    <div className="glass-card p-6 rounded-[2rem] border border-white/10 flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
        <p className="text-3xl font-black">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  );
}
