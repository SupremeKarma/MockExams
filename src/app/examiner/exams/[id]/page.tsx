"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, orderBy, getDocs, updateDoc, deleteDoc, serverTimestamp, addDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import ExamForm, { ExamFormData } from "@/components/ExamForm";
import QuestionTable from "@/components/QuestionTable";
import { ArrowLeft, Plus, Sparkles, BookOpen, BarChart2, Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";

const DEFAULT_FORM: ExamFormData = {
  title: "", category: "Science", duration_minutes: 60,
  passing_score: 50, negativeMarkingEnabled: false,
  defaultMarksPerQuestion: 1, defaultNegativeMarks: 0.25,
  is_published: false, visibility: "public",
};

export default function ExaminerExamDetailPage({ params }: { params: any }) {
  const { id: examId } = use(params) as { id: string };
  const router = useRouter();
  const { user } = useAuth();

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [formData, setFormData] = useState<ExamFormData>(DEFAULT_FORM);

  useEffect(() => { if (user) fetchData(); }, [examId, user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const examSnap = await getDoc(doc(db, "exams", examId));
      if (!examSnap.exists()) { router.push("/examiner/exams"); return; }
      const data = { id: examSnap.id, ...examSnap.data() as any };

      // Examiners can only edit their own exams
      if (data.created_by !== user!.uid) { setUnauthorized(true); setLoading(false); return; }

      setExam(data);
      setFormData({
        title: data.title ?? "", category: data.category ?? "Science",
        duration_minutes: data.duration_minutes ?? 60, passing_score: data.passing_score ?? 50,
        negativeMarkingEnabled: data.negativeMarkingEnabled ?? false,
        defaultMarksPerQuestion: data.defaultMarksPerQuestion ?? 1,
        defaultNegativeMarks: data.defaultNegativeMarks ?? 0.25,
        is_published: data.is_published ?? false, visibility: data.visibility ?? "public",
      });

      const qSnap = await getDocs(query(
        collection(db, "questions"),
        where("exam_id", "==", examId),
        orderBy("order_in_exam", "asc")
      ));
      setQuestions(qSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "exams", examId), { ...formData, updated_at: serverTimestamp() });
      if (formData.is_published && !exam.is_published) {
        await addDoc(collection(db, "notifications"), {
          title: "New Exam Released!",
          message: `${formData.title} is now live.`,
          type: "success", link: "/exams", created_at: serverTimestamp()
        });
      }
      setExam((prev: any) => ({ ...prev, ...formData }));
      alert("Saved!");
    } catch { alert("Failed to save"); }
    finally { setSaving(false); }
  };

  const deleteQuestion = async (qId: string) => {
    if (!confirm("Delete this question?")) return;
    try {
      await deleteDoc(doc(db, "questions", qId));
      await updateDoc(doc(db, "exams", examId), {
        total_questions: Math.max(0, (exam.total_questions ?? 1) - 1),
        updated_at: serverTimestamp(),
      });
      setExam((prev: any) => ({ ...prev, total_questions: Math.max(0, (prev.total_questions ?? 1) - 1) }));
      setQuestions(prev => prev.filter(q => q.id !== qId));
    } catch { alert("Failed to delete"); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (unauthorized) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShieldAlert className="w-16 h-16 text-rose-500 mb-6" />
      <h2 className="text-2xl font-bold mb-3">Not Your Exam</h2>
      <p className="text-slate-400 mb-6">You can only edit exams you created.</p>
      <Link href="/examiner/exams" className="px-6 py-3 bg-primary text-white rounded-xl font-bold">Back to My Exams</Link>
    </div>
  );

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <Link href="/examiner/exams" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to My Exams
      </Link>

      <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> Exam Settings
        </h2>
        <ExamForm data={formData} onChange={setFormData} onSubmit={handleSave} saving={saving} showVisibility />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Questions <span className="ml-2 text-sm font-normal text-slate-400">({questions.length})</span></h2>
          <div className="flex gap-3">
            <Link href={`/examiner/exams/${examId}/results`} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
              <BarChart2 className="w-4 h-4" /> Results
            </Link>
            <Link href={`/examiner/exams/${examId}/questions/new`} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all">
              <Plus className="w-4 h-4" /> Add Question
            </Link>
          </div>
        </div>
        <QuestionTable questions={questions} examId={examId} basePath="/examiner/exams" onDelete={deleteQuestion} />
      </div>
    </div>
  );
}
