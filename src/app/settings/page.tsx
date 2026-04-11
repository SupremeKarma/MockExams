"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { 
  User as UserIcon, 
  Mail, 
  Target, 
  BookOpen, 
  Save, 
  Loader2, 
  CheckCircle2,
  Camera,
  LogOut,
  Bell,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSuccess(false);
    try {
      // 1. Update Firebase Auth Profile (DisplayName)
      if (form.displayName !== user.displayName) {
        await updateProfile(user, { displayName: form.displayName });
      }

      // 2. Update Firestore Profile
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        displayName: form.displayName,
        bio: form.bio,
        studyGoal: form.studyGoal,
        targetExam: form.targetExam,
        emailNotifications: form.emailNotifications,
        updated_at: new Date().toISOString()
      }, { merge: true });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Profile Settings</h1>
          <p className="text-slate-400 font-medium">Manage your personal information and preferences.</p>
        </div>
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all font-bold"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav (Desktop) */}
        <div className="lg:col-span-1 space-y-2">
           <SettingsNavItem icon={<UserIcon className="w-4 h-4" />} label="General" active />
           <SettingsNavItem icon={<Bell className="w-4 h-4" />} label="Notifications" />
           <SettingsNavItem icon={<Shield className="w-4 h-4" />} label="Security" />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Section */}
            <div className="glass-card p-8 rounded-[2rem] border border-white/10 flex items-center gap-8 group">
               <div className="relative">
                 <div className="w-24 h-24 rounded-[2rem] bg-primary/20 flex items-center justify-center text-3xl font-black text-primary border-2 border-primary/20 group-hover:border-primary/50 transition-all">
                    {form.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                 </div>
                 <button type="button" className="absolute -bottom-2 -right-2 p-2 bg-white text-black rounded-xl shadow-lg hover:scale-110 transition-all">
                    <Camera className="w-4 h-4" />
                 </button>
               </div>
               <div>
                  <h3 className="text-lg font-bold mb-1">Profile Photo</h3>
                  <p className="text-sm text-slate-400">Upload a picture to personalize your account.</p>
               </div>
            </div>

            {/* Form Fields */}
            <div className="glass-card p-8 rounded-[2rem] border border-white/10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup 
                  label="Full Name" 
                  value={form.displayName} 
                  onChange={v => setForm({...form, displayName: v})}
                  placeholder="e.g. John Doe"
                  icon={<UserIcon className="w-4 h-4" />}
                />
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Email Address</label>
                  <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl opacity-60 cursor-not-allowed">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium">{user?.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Bio / About Me</label>
                <textarea 
                  value={form.bio}
                  onChange={e => setForm({...form, bio: e.target.value})}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all resize-none h-32 text-sm"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup 
                  label="Study Goal" 
                  value={form.studyGoal} 
                  onChange={v => setForm({...form, studyGoal: v})}
                  placeholder="e.g. 500+ MCQs by June"
                  icon={<BookOpen className="w-4 h-4" />}
                />
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Target Exam</label>
                  <select 
                    value={form.targetExam}
                    onChange={e => setForm({...form, targetExam: e.target.value})}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all text-sm appearance-none"
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
              className="w-full flex items-center justify-center gap-3 py-5 bg-primary text-white rounded-[1.5rem] font-black hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : success ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saving ? "Saving Changes..." : success ? "Settings Saved!" : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function SettingsNavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${active ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-white hover:bg-white/5"}`}>
      {icon}
      <span className="text-sm">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
    </button>
  );
}

function InputGroup({ label, value, onChange, placeholder, icon }: { label: string, value: string, onChange: (v: string) => void, placeholder: string, icon: any }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">{label}</label>
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-500">
          {icon}
        </div>
        <input 
          type="text" 
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all text-sm font-medium"
        />
      </div>
    </div>
  );
}
