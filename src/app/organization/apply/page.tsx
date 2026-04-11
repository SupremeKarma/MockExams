"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Building2, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

const EMPTY = {
  org_name: "", org_type: "school", contact_name: "", contact_email: "", phone: "", message: "",
};

export default function OrganizationApplyPage() {
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "org_requests"), {
        org_name: form.org_name,
        org_type: form.org_type,
        contact_name: form.contact_name,
        contact_email: form.contact_email || user.email,
        phone: form.phone,
        message: form.message,
        status: "pending",
        submitted_by: user.uid,
        submitted_at: serverTimestamp(),
        reviewed_by: null,
        reviewed_at: null,
        rejection_reason: null,
      });

      // Notify admins
      await addDoc(collection(db, "notifications"), {
        title: "New Organization Request",
        message: `${form.org_name} has applied for an organization account.`,
        type: "info",
        link: "/admin/organizations",
        created_at: serverTimestamp(),
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit request. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-14 h-14 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Request Submitted!</h1>
        <p className="text-slate-400 mb-8 leading-relaxed max-w-md mx-auto">
          Your organization application for <strong className="text-white">{form.org_name}</strong> is under review.
          An administrator will respond within 1–2 business days.
        </p>
        <Link href="/dashboard" className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:opacity-90 transition-all">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
          <Building2 className="text-emerald-400 w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Apply for Organization Account</h1>
          <p className="text-slate-400 text-sm">Schools, coaching centers, and institutions can apply for a dedicated portal.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-400">Organization Name <span className="text-rose-400">*</span></label>
            <input required type="text" value={form.org_name} onChange={e => set("org_name", e.target.value)}
              placeholder="e.g. Sunrise Coaching Center"
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Organization Type <span className="text-rose-400">*</span></label>
            <select value={form.org_type} onChange={e => set("org_type", e.target.value)}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all">
              <option value="school">School</option>
              <option value="coaching">Coaching Center</option>
              <option value="corporate">Corporate / Training</option>
              <option value="individual">Individual Instructor</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Phone Number</label>
            <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
              placeholder="+977-98XXXXXXXX"
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Contact Name <span className="text-rose-400">*</span></label>
            <input required type="text" value={form.contact_name} onChange={e => set("contact_name", e.target.value)}
              placeholder="Full name of the contact person"
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Contact Email <span className="text-rose-400">*</span></label>
            <input required type="email" value={form.contact_email} onChange={e => set("contact_email", e.target.value)}
              placeholder={user?.email ?? "contact@organization.com"}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all" />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-400">
              Message <span className="text-rose-400">*</span>
              <span className="ml-2 text-xs text-slate-500">— Tell us about your organization and how you plan to use the platform</span>
            </label>
            <textarea required rows={4} value={form.message} onChange={e => set("message", e.target.value)}
              placeholder="We are a coaching center with 200 students preparing for IOE entrance. We need..."
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all resize-none" />
          </div>
        </div>

        <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl text-sm text-slate-400 leading-relaxed">
          By submitting, you agree to our terms of service. Your request will be reviewed by an administrator within 1–2 business days. You'll be notified via email.
        </div>

        <button type="submit" disabled={saving || !user}
          className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Building2 className="w-5 h-5" />}
          {saving ? "Submitting…" : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
