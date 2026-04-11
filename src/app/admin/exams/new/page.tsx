"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Loader2, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function CreateExamPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Science",
    duration_minutes: 60,
    passing_score: 50,
    is_published: false
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
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      alert("Exam created successfully! You can now add questions to it.");
      router.push("/admin/exams");
    } catch (err) {
      console.error(err);
      alert("Failed to create exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Create New Exam</h2>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl border-white/5 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Exam Title</label>
          <input 
            type="text" 
            required
            placeholder="e.g. IOE Entrance Physics Mock Test 1"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 transition-all outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 transition-all outline-none"
            >
              <option value="Science">Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Engineering">Engineering</option>
              <option value="Medical">Medical</option>
              <option value="Arts">Arts</option>
              <option value="Competitive">Competitive</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Duration (Minutes)</label>
            <input 
              type="number" 
              required
              min="5"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 transition-all outline-none"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          Create Exam Container
        </button>
      </form>
    </div>
  );
}
