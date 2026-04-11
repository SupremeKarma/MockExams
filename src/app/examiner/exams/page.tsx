"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Plus, Trash2, Edit, CheckCircle, XCircle, Loader2, BarChart2 } from "lucide-react";
import Link from "next/link";

export default function ExaminerExamsPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchExams();
  }, [user]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "exams"),
        where("created_by", "==", user!.uid),
        orderBy("created_at", "desc")
      );
      const snap = await getDocs(q);
      setExams(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (examId: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "exams", examId), { is_published: !current });
      fetchExams();
    } catch {
      alert("Failed to update status");
    }
  };

  const deleteExam = async (examId: string) => {
    if (!confirm("Delete this exam? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "exams", examId));
      fetchExams();
    } catch {
      alert("Failed to delete exam");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Exams</h2>
        <Link href="/examiner/exams/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all text-sm">
          <Plus className="w-4 h-4" /> Create Exam
        </Link>
      </div>

      {exams.length === 0 ? (
        <div className="glass-card p-16 rounded-3xl border border-white/10 text-center text-slate-500">
          <p className="font-medium">No exams yet.</p>
          <p className="text-sm mt-1">Create your first exam to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto glass-card rounded-2xl border border-white/10">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="p-6">Title</th>
                <th className="p-6">Category</th>
                <th className="p-6">Questions</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {exams.map(exam => (
                <tr key={exam.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-6 font-bold">{exam.title}</td>
                  <td className="p-6 text-slate-400">{exam.category}</td>
                  <td className="p-6 text-slate-400">{exam.total_questions ?? 0}</td>
                  <td className="p-6">
                    <button onClick={() => togglePublish(exam.id, exam.is_published)}>
                      {exam.is_published ? (
                        <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold px-2 py-1 bg-emerald-400/10 rounded-lg">
                          <CheckCircle className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold px-2 py-1 bg-white/5 rounded-lg">
                          <XCircle className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-3 text-slate-400">
                      <Link href={`/examiner/exams/${exam.id}/results`} className="hover:text-primary transition-colors" title="Results"><BarChart2 className="w-4 h-4" /></Link>
                      <Link href={`/examiner/exams/${exam.id}`} className="hover:text-white transition-colors" title="Edit"><Edit className="w-4 h-4" /></Link>
                      <button onClick={() => deleteExam(exam.id)} className="hover:text-rose-500 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
