"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import QuestionForm, { QuestionFormData, EMPTY_QUESTION } from "@/components/QuestionForm";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

export default function ExaminerNewQuestionPage({ params }: { params: any }) {
  const { id: examId } = use(params) as { id: string };
  const router = useRouter();
  const [form, setForm] = useState<QuestionFormData>(EMPTY_QUESTION);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const examRef = doc(db, "exams", examId);
      const examSnap = await getDoc(examRef);
      const currentTotal = examSnap.data()?.total_questions ?? 0;

      await addDoc(collection(db, "questions"), {
        exam_id: examId, ...form,
        order_in_exam: currentTotal + 1,
        created_at: serverTimestamp(),
      });
      await updateDoc(examRef, { total_questions: currentTotal + 1, updated_at: serverTimestamp() });
      router.push(`/examiner/exams/${examId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to save question");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link href={`/examiner/exams/${examId}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Exam
      </Link>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Plus className="text-primary w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Add New Question</h1>
          <p className="text-slate-400 text-sm">Fill in the question details and solution.</p>
        </div>
      </div>
      <QuestionForm data={form} onChange={setForm} onSubmit={handleSubmit} saving={saving} mode="create" />
    </div>
  );
}
