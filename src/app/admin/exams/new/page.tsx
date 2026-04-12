"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Loader2, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import { motion } from "framer-motion";

export default function CreateExamPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Science",
    duration_minutes: 60,
    passing_score: 50,
    is_published: false,
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const examsRef = collection(db, 'exams');
      await addDoc(examsRef, {
        ...formData,
        created_by: user?.uid || "admin",
        total_questions: 0,
        visibility: "public",
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      alert("Exam blueprint initialized! Proceeding to question assembly.");
      router.push("/admin/exams");
    } catch (err) {
      console.error(err);
      alert("System fault during entity creation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-12"
      >
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
          <Plus className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-white">Initialize Simulation</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Exam Configuration Matrix v2.0</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass-card p-10 rounded-[2.5rem] border-white/5 shadow-2xl space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Primary Title</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Full-Stack Advanced Chemistry Simulation"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:border-indigo-500/50 transition-all outline-none font-bold text-white placeholder:text-slate-700"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Brief Overview / Lore</label>
            <textarea 
              rows={3}
              placeholder="Describe the scope and objective of this evaluation..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:border-indigo-500/50 transition-all outline-none font-medium text-white placeholder:text-slate-700 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Domain Classification</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-5 bg-slate-900 border border-white/10 rounded-[1.5rem] focus:border-indigo-500/50 transition-all outline-none font-bold text-white appearance-none"
              >
                <option value="Science">Theoretical Science</option>
                <option value="Mathematics">Applied Mathematics</option>
                <option value="Engineering">Structural Engineering</option>
                <option value="Medical">Clinical Medical</option>
                <option value="Competitive">Elite Competitive</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Temporal Limitation (Min)</label>
              <div className="relative">
                <input 
                  type="number" 
                  required
                  min="5"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                  className="w-full p-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:border-indigo-500/50 transition-all outline-none font-bold text-white"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-600 uppercase">Minutes</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Proficiency Threshold (%)</label>
              <input 
                type="number" 
                required
                min="0"
                max="100"
                value={formData.passing_score}
                onChange={(e) => setFormData({...formData, passing_score: parseInt(e.target.value)})}
                className="w-full p-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:border-indigo-500/50 transition-all outline-none font-bold text-white"
              />
            </div>
            
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-4 cursor-pointer group w-full p-5 bg-white/5 border border-white/10 rounded-[1.5rem] hover:bg-white/[0.08] transition-all">
                <input 
                  type="checkbox" 
                  checked={formData.is_published}
                  onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                  className="w-6 h-6 rounded-lg bg-slate-800 border-white/10 text-indigo-600 focus:ring-offset-0 focus:ring-0"
                />
                <span className="text-sm font-black text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">Immediate Production Release</span>
              </label>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-indigo-500 shadow-2xl shadow-indigo-600/30 transition-all disabled:opacity-50 flex items-center justify-center gap-4 active:scale-[0.98]"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
          Assemble Simulation Module
        </button>
      </form>
    </div>
  );
}
