"use client";

import { useEffect, useState, use } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getCountFromServer } from "firebase/firestore";
import { Users, BookOpen, Target, ArrowRight, Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

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
      setOrg({ id: orgSnap.id, ...orgSnap.data() });

      const [membersCount, examsSnap] = await Promise.all([
        getCountFromServer(query(collection(db, "org_members"), where("org_id", "==", orgId))),
        getCountFromServer(query(collection(db, "exams"), where("org_id", "==", orgId))),
      ]);

      setStats({ members: membersCount.data().count, exams: examsSnap.data().count, attempts: 0 });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (unauthorized) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShieldAlert className="w-16 h-16 text-rose-500 mb-6" />
      <h2 className="text-2xl font-bold mb-3">Access Denied</h2>
      <p className="text-slate-400">You don't have access to this organization.</p>
    </div>
  );

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold">{org?.name}</h2>
        <p className="text-slate-400 text-sm mt-1 capitalize">{org?.type} · {org?.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Users className="w-6 h-6" />} label="Members" value={stats.members.toString()} color="text-primary" bg="bg-primary/10" />
        <StatCard icon={<BookOpen className="w-6 h-6" />} label="Exams" value={stats.exams.toString()} color="text-emerald-400" bg="bg-emerald-400/10" />
        <StatCard icon={<Target className="w-6 h-6" />} label="Attempts" value={stats.attempts.toString()} color="text-amber-400" bg="bg-amber-400/10" />
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { href: `/organization/${orgId}/members`, label: "Manage Members", desc: "Invite and manage your team", icon: <Users className="w-5 h-5" />, color: "bg-primary/10 text-primary group-hover:bg-primary" },
            { href: `/organization/${orgId}/exams`, label: "Org Exams", desc: "View all organization exams", icon: <BookOpen className="w-5 h-5" />, color: "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500" },
            { href: `/organization/${orgId}/analytics`, label: "Analytics", desc: "Performance insights", icon: <Target className="w-5 h-5" />, color: "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500" },
          ].map(action => (
            <Link key={action.href} href={action.href} className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-all group-hover:text-white ${action.color}`}>{action.icon}</div>
                <div>
                  <h4 className="font-bold">{action.label}</h4>
                  <p className="text-sm text-slate-400">{action.desc}</p>
                </div>
              </div>
              <ArrowRight className="text-slate-500 group-hover:text-white transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, bg }: any) {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${bg} ${color}`}>{icon}</div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{label}</h3>
      <div className="text-3xl font-black">{value}</div>
    </div>
  );
}
