"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import ExamForm, { ExamFormData } from "@/components/ExamForm";
import { WorkspaceRail } from "@/components/workspace/WorkspaceRail";
import { EXAMINER_WORKSPACE_ITEMS } from "@/components/workspace/rail-items";
import { ArrowLeft, BookOpen, ClipboardList } from "lucide-react";
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
    <div className="space-y-6">
      <Link href="/examiner/exams" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to My Exams
      </Link>

      <div className="flex rounded-lg border border-zinc-200 bg-white overflow-hidden" style={{ minHeight: 560 }}>
        <WorkspaceRail items={EXAMINER_WORKSPACE_ITEMS} ariaLabel="Examiner workspace tools" />

        <main className="flex-1 min-w-0 overflow-y-auto p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <BookOpen className="text-primary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Create New Exam</h1>
              <p className="text-zinc-500 text-sm">Set up the exam container, then add questions.</p>
            </div>
          </div>

          <ExamForm
            data={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            saving={saving}
            submitLabel="Create Exam"
            showVisibility
          />
        </main>

        <aside className="w-80 shrink-0 border-l border-zinc-200 p-5">
          <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2 mb-4">
            <ClipboardList className="w-4 h-4 text-zinc-400" /> Exam summary
          </h2>

          <dl className="space-y-3 text-sm">
            <Row label="Title" value={formData.title.trim() || "Untitled"} />
            <Row label="Category" value={formData.category} />
            <Row label="Duration" value={`${formData.duration_minutes} min`} />
            <Row label="Passing score" value={`${formData.passing_score}%`} />
            <Row
              label="Marking"
              value={
                formData.negativeMarkingEnabled
                  ? `+${formData.defaultMarksPerQuestion} / -${formData.defaultNegativeMarks} per question`
                  : `+${formData.defaultMarksPerQuestion} per question`
              }
            />
            <Row label="Visibility" value={formData.visibility} />
            <Row label="Status" value={formData.is_published ? "Published" : "Draft"} />
          </dl>

          <p className="text-[11px] text-zinc-400 mt-5">
            This is the exam container — questions are added on the next screen once it&apos;s created.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] text-zinc-400 uppercase tracking-wide">{label}</dt>
      <dd className="text-zinc-900 font-medium capitalize">{value}</dd>
    </div>
  );
}
