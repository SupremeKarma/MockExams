"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  doc, getDoc, collection, query, where, orderBy, getDocs,
  updateDoc, deleteDoc, serverTimestamp, addDoc
} from "firebase/firestore";
import {
  ArrowLeft, Plus, Brain, Edit, Trash2, Loader2,
  CheckCircle, XCircle, BookOpen, Sparkles
} from "lucide-react";
import Link from "next/link";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-emerald-400 bg-emerald-400/10",
  medium: "text-amber-400 bg-amber-400/10",
  hard: "text-rose-400 bg-rose-400/10",
};

export default function ExamDetailPage({ params }: { params: any }) {
  const { id: examId } = use(params) as { id: string };
  const router = useRouter();

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Science",
    duration_minutes: 60,
    passing_score: 50,
    negativeMarkingEnabled: false,
    defaultMarksPerQuestion: 1,
    defaultNegativeMarks: 0.25,
    is_published: false,
  });

  useEffect(() => {
    fetchData();
  }, [examId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const examSnap = await getDoc(doc(db, "exams", examId));
      if (!examSnap.exists()) { router.push("/admin/exams"); return; }
      const data = { id: examSnap.id, ...examSnap.data() };
      setExam(data);
      setFormData({
        title: data.title ?? "",
        category: data.category ?? "Science",
        duration_minutes: data.duration_minutes ?? 60,
        passing_score: data.passing_score ?? 50,
        negativeMarkingEnabled: data.negativeMarkingEnabled ?? false,
        defaultMarksPerQuestion: data.defaultMarksPerQuestion ?? 1,
        defaultNegativeMarks: data.defaultNegativeMarks ?? 0.25,
        is_published: data.is_published ?? false,
      });

      const q = query(
        collection(db, "questions"),
        where("exam_id", "==", examId),
        orderBy("order_in_exam", "asc")
      );
      const qSnap = await getDocs(q);
      setQuestions(qSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExam = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "exams", examId), {
        ...formData,
        updated_at: serverTimestamp(),
      });

      // If just published, notify everyone
      if (formData.is_published && !exam.is_published) {
        await addDoc(collection(db, "notifications"), {
          title: "New Exam Released! 🚀",
          message: `${formData.title} is now live and ready for practice.`,
          type: "success",
          link: `/exams`,
          created_at: serverTimestamp()
        });
      }

      setExam({ ...exam, ...formData });
      alert("Exam saved!");
    } catch (err) {
      alert("Failed to save exam");
    } finally {
      setSaving(false);
    }
  };

  const deleteQuestion = async (qId: string) => {
    if (!confirm("Delete this question? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "questions", qId));
      await updateDoc(doc(db, "exams", examId), {
        total_questions: Math.max(0, (exam.total_questions ?? 1) - 1),
        updated_at: serverTimestamp(),
      });
      setExam((prev: any) => ({ ...prev, total_questions: Math.max(0, (prev.total_questions ?? 1) - 1) }));
      setQuestions(prev => prev.filter(q => q.id !== qId));
    } catch (err) {
      alert("Failed to delete question");
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
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Back link */}
      <Link
        href="/admin/exams"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Exams
      </Link>

      {/* Exam Settings */}
      <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> Exam Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-400">Exam Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Category</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all"
            >
              {["Science","Mathematics","Engineering","Medical","Arts","Competitive"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Duration (minutes)</label>
            <input
              type="number" min="5"
              value={formData.duration_minutes}
              onChange={e => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Passing Score (%)</label>
            <input
              type="number" min="0" max="100"
              value={formData.passing_score}
              onChange={e => setFormData({ ...formData, passing_score: parseInt(e.target.value) })}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Marks Per Question</label>
            <input
              type="number" min="0.5" step="0.5"
              value={formData.defaultMarksPerQuestion}
              onChange={e => setFormData({ ...formData, defaultMarksPerQuestion: parseFloat(e.target.value) })}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => setFormData(f => ({ ...f, negativeMarkingEnabled: !f.negativeMarkingEnabled }))}
                className={`w-12 h-6 rounded-full transition-colors relative ${formData.negativeMarkingEnabled ? "bg-primary" : "bg-white/10"}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.negativeMarkingEnabled ? "translate-x-6" : ""}`} />
              </div>
              <span className="text-sm font-medium text-slate-300">Negative Marking</span>
            </label>
            {formData.negativeMarkingEnabled && (
              <input
                type="number" min="0" step="0.25"
                value={formData.defaultNegativeMarks}
                onChange={e => setFormData({ ...formData, defaultNegativeMarks: parseFloat(e.target.value) })}
                className="w-24 p-2 bg-white/5 border border-white/10 rounded-xl text-sm outline-none"
                title="Marks deducted per wrong answer"
              />
            )}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => setFormData(f => ({ ...f, is_published: !f.is_published }))}
                className={`w-12 h-6 rounded-full transition-colors relative ${formData.is_published ? "bg-emerald-500" : "bg-white/10"}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.is_published ? "translate-x-6" : ""}`} />
              </div>
              <span className="text-sm font-medium text-slate-300">
                {formData.is_published ? "Published" : "Draft"}
              </span>
            </label>
          </div>
        </div>

        <button
          onClick={handleSaveExam}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Questions
            <span className="ml-3 text-sm font-normal text-slate-400">
              ({questions.length} total)
            </span>
          </h2>
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/exams/${examId}/generate`}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-xl text-sm font-bold hover:bg-primary/20 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Generate with AI
            </Link>
            <Link
              href={`/admin/exams/${examId}/questions/new`}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Question
            </Link>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="glass-card p-16 rounded-3xl border border-white/10 text-center text-slate-500">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No questions yet.</p>
            <p className="text-sm mt-1">Add questions manually or generate them with AI.</p>
          </div>
        ) : (
          <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest">
                <tr>
                  <th className="p-5 w-12">#</th>
                  <th className="p-5">Question</th>
                  <th className="p-5 w-24">Difficulty</th>
                  <th className="p-5 w-24">Correct</th>
                  <th className="p-5 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {questions.map((q, idx) => (
                  <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-5 text-slate-500 font-bold">{idx + 1}</td>
                    <td className="p-5 max-w-xs">
                      <p className="font-medium truncate">{q.question_text}</p>
                    </td>
                    <td className="p-5">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg capitalize ${DIFFICULTY_COLORS[q.difficulty] ?? "text-slate-400 bg-white/5"}`}>
                        {q.difficulty ?? "—"}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className="text-xs font-black uppercase px-3 py-1 bg-emerald-400/10 text-emerald-400 rounded-lg">
                        {q.correct_option}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-3 text-slate-400">
                        <Link
                          href={`/admin/exams/${examId}/questions/${q.id}/edit`}
                          className="hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteQuestion(q.id)}
                          className="hover:text-rose-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
