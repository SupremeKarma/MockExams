"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, writeBatch } from "firebase/firestore";
import { Brain, Sparkles, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AIGeneratorPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [examType, setExamType] = useState("IOE Entrance");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedQuestions([]);
    try {
      // In a real app, this hits /api/ai/generate
      const response = await fetch("/api/ai/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, examType, count })
      });
      const data = await response.json();
      setGeneratedQuestions(data.questions);
    } catch (err) {
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const saveToExam = async () => {
    setIsSaving(true);
    try {
      // 1. Create a dummy exam as a placeholder for these questions
      const examRef = await addDoc(collection(db, 'exams'), {
        title: `${topic} (${examType}) - AI Generated`,
        category: examType,
        duration_minutes: count * 2,
        is_published: false,
        total_questions: generatedQuestions.length,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      // 2. Add questions to the questions collection
      const batch = writeBatch(db);
      const questionsRef = collection(db, 'questions');

      generatedQuestions.forEach((q) => {
        const qRef = doc(questionsRef);
        batch.set(qRef, {
          exam_id: examRef.id,
          question_text: q.question_text,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_option: q.correct_option,
          explanation: q.explanation,
          difficulty: q.difficulty || 'medium',
          created_at: serverTimestamp()
        });
      });

      await batch.commit();

      alert("Exam created as draft!");
      router.push("/admin/exams");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Sparkles className="text-primary w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Question Factory</h1>
          <p className="text-slate-400">Transform any topic into a high-quality mock exam instantly.</p>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl border-transparent bg-gradient-to-br from-primary/5 to-secondary/5 border-white/5 border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Exam Context</label>
            <select 
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 transition-all outline-none"
            >
              <option value="IOE Entrance">IOE Entrance (Nepal)</option>
              <option value="NEB Boards">NEB Board Exams</option>
              <option value="SAT/GRE">SAT / GRE</option>
              <option value="Medical Entrance">Medical Entrance</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Number of Questions</label>
            <input 
              type="number" 
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 transition-all outline-none"
              min="1" max="50"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-400">Topic / Syllabus Focus</label>
            <input 
              type="text" 
              placeholder="e.g. Thermodynamics, Quantum Physics, Integral Calculus..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 transition-all outline-none font-medium"
            />
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !topic}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5 group-hover:scale-110 transition-transform" />}
          Engineer Exam Questions
        </button>
      </div>

      {generatedQuestions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Generated {generatedQuestions.length} Problems
            </h2>
            <button 
              onClick={saveToExam}
              disabled={isSaving}
              className="px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all disabled:opacity-50 text-sm"
            >
              {isSaving ? "Saving..." : "Save as New Exam Draft"}
            </button>
          </div>

          <div className="space-y-4">
            {generatedQuestions.map((q, i) => (
              <div key={i} className="p-6 glass-card rounded-2xl border-white/10 border">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-black text-primary uppercase">Q{i+1}</span>
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-[10px] text-slate-500 font-bold px-2 py-0.5 border border-white/5 rounded-full uppercase">Correct: {q.correct_option}</span>
                </div>
                <h3 className="text-lg font-medium mb-4">{q.question_text}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-400">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">a) {q.option_a}</div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">b) {q.option_b}</div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">c) {q.option_c}</div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">d) {q.option_d}</div>
                </div>
                <div className="mt-4 p-4 bg-primary/10 rounded-xl text-xs text-primary leading-relaxed border border-primary/20 italic">
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
