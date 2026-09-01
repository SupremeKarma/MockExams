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

      alert("Exam created. Proceeding to question assembly.");
      router.push("/admin/exams");
    } catch (err) {
      console.error(err);
      alert("Something went wrong creating the exam.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3 bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-shadow text-sm text-zinc-900 placeholder:text-zinc-400";

  return (
    <div className="max-w-3xl mx-auto pb-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="w-10 h-10 rounded-md bg-primary-600 flex items-center justify-center text-white">
          <Plus className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Create new exam</h2>
          <p className="text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">Exam configuration</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-zinc-200 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Full-Stack Advanced Chemistry Simulation"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Description</label>
            <textarea
              rows={3}
              placeholder="Describe the scope and objective of this evaluation..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className={inputClass}
              >
                <option value="Science">Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Engineering">Engineering</option>
                <option value="Medical">Medical</option>
                <option value="Competitive">Competitive</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Duration (minutes)</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="5"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Passing score (%)</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={formData.passing_score}
                onChange={(e) => setFormData({...formData, passing_score: parseInt(e.target.value)})}
                className={inputClass}
              />
            </div>

            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-3 cursor-pointer group w-full p-3 bg-zinc-50 border border-zinc-200 rounded-md hover:bg-zinc-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                  className="w-4 h-4 rounded text-primary-600 border-zinc-300 focus:ring-primary-500"
                />
                <span className="text-xs font-semibold text-zinc-600 group-hover:text-zinc-900 transition-colors">Publish immediately</span>
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-primary-600 text-white rounded-md font-semibold text-sm hover:bg-primary-700 shadow-button transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Create exam
        </button>
      </form>
    </div>
  );
}
