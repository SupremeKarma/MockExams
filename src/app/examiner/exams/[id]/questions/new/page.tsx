"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import QuestionForm, { QuestionFormData, EMPTY_QUESTION } from "@/components/QuestionForm";
import BulkQuestionImport from "@/components/BulkQuestionImport";
import { ArrowLeft, Plus, ClipboardPaste, PenLine } from "lucide-react";
import Link from "next/link";

export default function ExaminerNewQuestionPage({ params }: { params: any }) {
  const { id: examId } = use(params) as { id: string };
  const router = useRouter();
  const [mode, setMode] = useState<"single" | "bulk">("bulk");
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
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href={`/examiner/exams/${examId}`} className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to exam
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-primary-50 flex items-center justify-center">
            <Plus className="text-primary-600 w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Add questions</h1>
            <p className="text-zinc-500 text-sm">Bulk-paste many at once, or add one at a time.</p>
          </div>
        </div>

        <div className="flex bg-zinc-100 rounded-md p-1 shrink-0">
          <button
            onClick={() => setMode("bulk")}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              mode === "bulk" ? "bg-white text-primary-700 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <ClipboardPaste className="w-3.5 h-3.5" /> Bulk import
          </button>
          <button
            onClick={() => setMode("single")}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              mode === "single" ? "bg-white text-primary-700 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <PenLine className="w-3.5 h-3.5" /> Single question
          </button>
        </div>
      </div>

      {mode === "bulk" ? (
        <BulkQuestionImport
          examId={examId}
          onImported={(count) => {
            alert(`Imported ${count} question${count === 1 ? "" : "s"}.`);
            router.push(`/examiner/exams/${examId}`);
          }}
        />
      ) : (
        <QuestionForm data={form} onChange={setForm} onSubmit={handleSubmit} saving={saving} mode="create" />
      )}
    </div>
  );
}
