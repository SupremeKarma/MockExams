"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, doc, updateDoc, addDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { Building2, CheckCircle, XCircle, Clock, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";

type TabKey = "pending" | "approved" | "rejected";

export default function AdminOrganizationsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("pending");
  const [processing, setProcessing] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "org_requests"), orderBy("submitted_at", "desc")));
      setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleApprove = async (req: any) => {
    if (!confirm(`Approve organization "${req.org_name}"?`)) return;
    setProcessing(req.id);
    try {
      // 1. Create the organization document
      const orgRef = await addDoc(collection(db, "organizations"), {
        name: req.org_name,
        slug: req.org_name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        email: req.contact_email,
        phone: req.phone ?? null,
        type: req.org_type,
        status: "approved",
        created_by: req.submitted_by,
        subscription_plan: "free",
        settings: { allow_public_signup: false, custom_branding: false },
        created_at: serverTimestamp(),
        approved_at: serverTimestamp(),
        approved_by: "admin",
      });

      // 2. Create org_members entry for the requester (org_admin role)
      await addDoc(collection(db, "org_members"), {
        org_id: orgRef.id,
        user_id: req.submitted_by,
        role: "org_admin",
        status: "active",
        invited_email: req.contact_email,
        joined_at: serverTimestamp(),
      });

      // 3. Update user role to org_admin
      await updateDoc(doc(db, "users", req.submitted_by), { role: "org_admin" });

      // 4. Mark request as approved
      await updateDoc(doc(db, "org_requests", req.id), {
        status: "approved",
        reviewed_at: serverTimestamp(),
        org_id: orgRef.id,
      });

      // 5. Notify the requester
      await addDoc(collection(db, "notifications"), {
        title: "Organization Approved!",
        message: `Your organization "${req.org_name}" has been approved. You can now access your organization portal.`,
        type: "success",
        link: `/organization/${orgRef.id}`,
        created_at: serverTimestamp(),
      });

      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to approve organization");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (req: any) => {
    if (!rejectReason.trim()) { alert("Please enter a rejection reason"); return; }
    setProcessing(req.id);
    try {
      await updateDoc(doc(db, "org_requests", req.id), {
        status: "rejected",
        reviewed_at: serverTimestamp(),
        rejection_reason: rejectReason,
      });
      setRejectTarget(null);
      setRejectReason("");
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to reject");
    } finally {
      setProcessing(null);
    }
  };

  const filtered = requests.filter(r => r.status === activeTab);

  const TAB_ICONS: Record<TabKey, React.ReactNode> = {
    pending: <Clock className="w-4 h-4" />,
    approved: <CheckCircle className="w-4 h-4" />,
    rejected: <XCircle className="w-4 h-4" />,
  };

  const TAB_COLORS: Record<TabKey, string> = {
    pending: "text-amber-400 border-amber-400",
    approved: "text-emerald-400 border-emerald-400",
    rejected: "text-rose-400 border-rose-400",
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
          <Building2 className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Organization Requests</h2>
          <p className="text-slate-400 text-sm">Review and approve organization applications</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-0">
        {(["pending","approved","rejected"] as TabKey[]).map(tab => {
          const count = requests.filter(r => r.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold capitalize border-b-2 transition-all -mb-px ${
                activeTab === tab
                  ? `${TAB_COLORS[tab]} bg-white/5`
                  : "text-slate-500 border-transparent hover:text-white"
              }`}
            >
              {TAB_ICONS[tab]} {tab}
              <span className="text-xs px-1.5 py-0.5 bg-white/10 rounded-md">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Request Cards */}
      {filtered.length === 0 ? (
        <div className="glass-card p-16 rounded-3xl border border-white/10 text-center text-slate-500">
          <p>No {activeTab} requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(req => (
            <div key={req.id} className="glass-card p-6 rounded-2xl border border-white/10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{req.org_name}</h3>
                    <span className="text-xs font-bold px-2 py-0.5 bg-white/5 text-slate-400 rounded-lg capitalize">{req.org_type}</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-1">Contact: <span className="text-slate-300">{req.contact_name}</span> · {req.contact_email}</p>
                  {req.phone && <p className="text-sm text-slate-400 mb-1">Phone: {req.phone}</p>}
                  <p className="text-sm text-slate-400 mt-3 leading-relaxed">{req.message}</p>
                  {req.rejection_reason && (
                    <p className="text-sm text-rose-400 mt-2 italic">Rejection reason: {req.rejection_reason}</p>
                  )}
                  <p className="text-xs text-slate-600 mt-3">
                    Submitted {req.submitted_at?.toDate?.()?.toLocaleDateString() ?? "—"}
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {req.status === "approved" && req.org_id && (
                    <Link href={`/admin/organizations/${req.org_id}`} className="flex items-center gap-1 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-bold hover:bg-emerald-500/20 transition-all">
                      View Org <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}

                  {req.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(req)}
                        disabled={processing === req.id}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-400 transition-all disabled:opacity-50"
                      >
                        {processing === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectTarget(req.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-sm font-bold hover:bg-rose-500/20 transition-all"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Reject reason input */}
              {rejectTarget === req.id && (
                <div className="mt-4 p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl space-y-3">
                  <p className="text-sm font-medium text-rose-400">Rejection reason (will be shown to applicant)</p>
                  <textarea
                    rows={2}
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder="e.g. Insufficient information provided. Please reapply with more details..."
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm outline-none resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(req)}
                      disabled={processing === req.id}
                      className="px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-400 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {processing === req.id ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                      Confirm Reject
                    </button>
                    <button onClick={() => { setRejectTarget(null); setRejectReason(""); }} className="px-4 py-2 bg-white/5 text-slate-400 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
