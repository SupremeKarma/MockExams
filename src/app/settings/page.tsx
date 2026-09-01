"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import {
  User as UserIcon,
  Mail,
  BookOpen,
  Save,
  Loader2,
  CheckCircle2,
  Camera,
  LogOut,
  Bell,
  Shield,
} from "lucide-react";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    studyGoal: "",
    targetExam: "IOE Entrance",
    emailNotifications: true,
  });

  useEffect(() => {
    if (!user) return;

    async function fetchProfile() {
      setLoading(true);
      try {
        const docRef = doc(db, "users", user!.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const d = docSnap.data();
          setForm({
            displayName: user?.displayName || d.displayName || "",
            bio: d.bio || "",
            studyGoal: d.studyGoal || "",
            targetExam: d.targetExam || "IOE Entrance",
            emailNotifications: d.emailNotifications ?? true,
          });
        } else {
          setForm(f => ({ ...f, displayName: user?.displayName || "" }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!form.displayName.trim()) {
      setError("Display name cannot be empty.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      if (form.displayName !== user.displayName) {
        await updateProfile(user, { displayName: form.displayName });
      }

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        displayName: form.displayName,
        bio: form.bio,
        studyGoal: form.studyGoal,
        targetExam: form.targetExam,
        emailNotifications: form.emailNotifications,
        updatedAt: serverTimestamp()
      }, { merge: true });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const _inputClass = "w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-shadow text-sm text-zinc-900";

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/40 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 mb-1">Profile settings</h1>
            <p className="text-zinc-500 text-sm">Manage your personal information and preferences.</p>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-white text-red-600 border border-red-200 hover:bg-red-50 transition-colors font-semibold text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Nav (Desktop) */}
          <div className="lg:col-span-1 space-y-1">
             <SettingsNavItem icon={<UserIcon className="w-4 h-4" />} label="General" active />
             <SettingsNavItem icon={<Bell className="w-4 h-4" />} label="Notifications" />
             <SettingsNavItem icon={<Shield className="w-4 h-4" />} label="Security" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}
              {/* Avatar Section */}
              <div className="bg-white p-6 rounded-lg border border-zinc-200 flex items-center gap-5">
                 <div className="relative">
                   <div className="w-16 h-16 rounded-lg bg-primary-50 flex items-center justify-center text-xl font-bold text-primary-700 border border-primary-100">
                      {form.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                   </div>
                   <button type="button" className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-zinc-900 text-white rounded-md hover:bg-zinc-700 transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                   </button>
                 </div>
                 <div>
                    <h3 className="text-sm font-semibold text-zinc-900 mb-0.5">Profile photo</h3>
                    <p className="text-xs text-zinc-500">Upload a picture to personalize your account.</p>
                 </div>
              </div>

              {/* Form Fields */}
              <div className="bg-white p-6 rounded-lg border border-zinc-200 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputGroup
                    label="Full name"
                    value={form.displayName}
                    onChange={v => setForm({...form, displayName: v})}
                    placeholder="e.g. John Doe"
                    icon={<UserIcon className="w-4 h-4" />}
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-zinc-500 tracking-wide">Email address</label>
                    <div className="flex items-center gap-2.5 p-3 bg-zinc-50 border border-zinc-200 rounded-md opacity-70 cursor-not-allowed">
                      <Mail className="w-4 h-4 text-zinc-400" />
                      <span className="text-sm text-zinc-600">{user?.email}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-zinc-500 tracking-wide">Bio / about me</label>
                  <textarea
                    value={form.bio}
                    onChange={e => setForm({...form, bio: e.target.value})}
                    className="w-full p-3 bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-shadow resize-none h-28 text-sm"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputGroup
                    label="Study goal"
                    value={form.studyGoal}
                    onChange={v => setForm({...form, studyGoal: v})}
                    placeholder="e.g. 500+ MCQs by June"
                    icon={<BookOpen className="w-4 h-4" />}
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-zinc-500 tracking-wide">Target exam</label>
                    <select
                      value={form.targetExam}
                      onChange={e => setForm({...form, targetExam: e.target.value})}
                      className="w-full p-3 bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-shadow text-sm"
                    >
                      <option value="IOE Entrance">IOE Entrance (Nepal)</option>
                      <option value="NEB Boards">NEB Grade 12 Boards</option>
                      <option value="Medical Entrance">CEE / Medical Entrance</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-600 text-white rounded-md font-semibold hover:bg-primary-700 transition-colors shadow-button disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving changes..." : success ? "Settings saved" : "Save profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsNavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-md font-semibold text-sm transition-colors ${active ? "bg-white text-primary-700 border border-zinc-200 shadow-xs" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"}`}>
      {icon}
      <span>{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600" />}
    </button>
  );
}

function InputGroup({ label, value, onChange, placeholder, icon }: { label: string, value: string, onChange: (v: string) => void, placeholder: string, icon: any }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase text-zinc-500 tracking-wide">{label}</label>
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-zinc-400">
          {icon}
        </div>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-shadow text-sm"
        />
      </div>
    </div>
  );
}
