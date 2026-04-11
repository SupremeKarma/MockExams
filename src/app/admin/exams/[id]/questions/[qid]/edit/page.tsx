"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditQuestionPage({ params }: { params: any }) {
  const { id: examId, qid } = use(params) as { id: string; qid: string };
  const router = useRouter();

  const [form, setForm] = useState({
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "a",
    explanation: "",
    difficulty: "medium",
    marks: 1,
    negativeMarks: 0.25,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const snap = await getDoc(doc(db, "questions", qid));
        if (!snap.exists()) { router.push(`/admin/exams/${examId}`); return; }
        const d = snap.data();
        setForm({
          question_text: d.question_text ?? "",
          option_a: d.option_a ?? "",
          option_b: d.option_b ?? "",
          option_c: d.option_c ?? "",
          option_d: d.option_d ?? "",
          correct_option: d.correct_option ?? "a",
          explanation: d.explanation ?? "",
          difficulty: d.difficulty ?? "medium",
          marks: d.marks ?? 1,
          negativeMarks: d.negativeMarks ?? 0.25,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [qid, examId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoc(doc(db, "questions", qid), {
        ...form,
        updated_at: serverTimestamp(),
      });
      router.push(`/admin/exams/${examId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update question");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link
        href={`/admin/exams/${examId}`}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Exam
      </Link>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-400/20 flex items-center justify-center">
          <Save className="text-amber-400 w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Edit Question</h1>
          <p className="text-slate-400 text-sm">Update the question, options, or explanation.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
        {/* Question Text */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Question Text</label>
          <textarea
            required
            rows={3}
            value={form.question_text}
            onChange={e => set("question_text", e.target.value)}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all resize-none"
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(["a","b","c","d"] as const).map(opt => (
            <div key={opt} className="space-y-2">
              <label className="text-sm font-medium text-slate-400 uppercase">Option {opt}</label>
              <input
                required
                type="text"
                value={(form as any)[`option_${opt}`]}
                onChange={e => set(`option_${opt}`, e.target.value)}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all"
              />
            </div>
          ))}
        </div>

        {/* Correct Option */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-400">Correct Answer</label>
          <div className="flex gap-3">
            {(["a","b","c","d"] as const).map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => set("correct_option", opt)}
                className={`flex-1 py-3 rounded-2xl text-sm font-black uppercase border transition-all ${
                  form.correct_option === opt
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "bg-white/5 border-white/10 text-slate-400 hover:border-emerald-500/50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Explanation */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">
            Solution / Explanation
            <span className="ml-2 text-xs text-slate-500">(shown to students after exam)</span>
          </label>
          <textarea
            rows={4}
            value={form.explanation}
            onChange={e => set("explanation", e.target.value)}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all resize-none"
          />
        </div>

        {/* Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Difficulty</label>
            <select
              value={form.difficulty}
              onChange={e => set("difficulty", e.target.value)}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Marks</label>
            <input
              type="number" min="0.5" step="0.5"
              value={form.marks}
              onChange={e => set("marks", parseFloat(e.target.value))}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Negative Marks</label>
            <input
              type="number" min="0" step="0.25"
              value={form.negativeMarks}
              onChange={e => set("negativeMarks", parseFloat(e.target.value))}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Update Question
        </button>
      </form>
    </div>
  );
}
