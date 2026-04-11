"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import ExamForm, { ExamFormData } from "@/components/ExamForm";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

const DEFAULT: ExamFormData = {
  title: "",
  category: "Science",
  duration_minutes: 60,
  passing_score: 50,
  negativeMarkingEnabled: false,
  defaultMarksPerQuestion: 1,
  defaultNegativeMarks: 0.25,
  is_published: false,
  visibility: "public",
};

export default function ExaminerNewExamPage() {
  const router = useRouter();
  const { user, orgId } = useAuth();
  const [formData, setFormData] = useState<ExamFormData>(DEFAULT);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title.trim()) { alert("Please enter a title"); return; }
    setSaving(true);
    try {
      const ref = await addDoc(collection(db, "exams"), {
        ...formData,
        created_by: user?.uid ?? "admin",
        org_id: orgId ?? null,
        total_questions: 0,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      router.push(`/examiner/exams/${ref.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create exam");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link href="/examiner/exams" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to My Exams
      </Link>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
          <BookOpen className="text-primary w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Create New Exam</h1>
          <p className="text-slate-400 text-sm">Set up the exam container, then add questions.</p>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl border border-white/10">
        <ExamForm
          data={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel="Create Exam"
          showVisibility
        />
      </div>
    </div>
  );
}
