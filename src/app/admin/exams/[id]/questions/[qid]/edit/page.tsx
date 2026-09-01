"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import QuestionForm, { EMPTY_QUESTION, QuestionFormData } from "@/components/QuestionForm";

export default function EditQuestionPage({ params }: { params: any }) {
  const { id: examId, qid } = use(params) as { id: string; qid: string };
  const router = useRouter();

  const [form, setForm] = useState<QuestionFormData>(EMPTY_QUESTION);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const snap = await getDoc(doc(db, "questions", qid));
        if (!snap.exists()) { router.push(`/admin/exams/${examId}`); return; }
        const d = snap.data();
        setForm({
          type: d.type ?? "mcq",
          question_text: d.question_text ?? "",
          option_a: d.option_a ?? "",
          option_b: d.option_b ?? "",
          option_c: d.option_c ?? "",
          option_d: d.option_d ?? "",
          correct_option: d.correct_option ?? "a",
          model_answer: d.model_answer ?? "",
          rubric: d.rubric ?? "", topic: d.topic ?? "",
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
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Exam
      </Link>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-amber-400/20 flex items-center justify-center">
          <Save className="text-amber-700 w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Edit Question</h1>
          <p className="text-zinc-500 text-sm">Update the question, options, or explanation.</p>
        </div>
      </div>

      <QuestionForm data={form} onChange={setForm} onSubmit={handleSubmit} saving={saving} mode="edit" />
    </div>
  );
}
