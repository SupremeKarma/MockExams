"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Plus, Trash2, Edit, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const examsRef = collection(db, 'exams');
      const q = query(examsRef, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExams(data);
    } catch (err) {
      console.error("Error fetching exams:", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (examId: string, currentStatus: boolean) => {
    try {
      const examRef = doc(db, 'exams', examId);
      await updateDoc(examRef, { is_published: !currentStatus });
      fetchExams();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const deleteExam = async (examId: string) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    try {
      const examRef = doc(db, 'exams', examId);
      await deleteDoc(examRef);
      fetchExams();
    } catch (err) {
      alert("Failed to delete exam");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Exams</h2>
        <Link href="/admin/exams/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all">
          <Plus className="w-4 h-4" /> Create Exam
        </Link>
      </div>

      <div className="overflow-x-auto glass-card rounded-2xl border border-white/10">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest">
            <tr>
              <th className="p-6">Title</th>
              <th className="p-6">Category</th>
              <th className="p-6">Duration</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {exams.map((exam) => (
              <tr key={exam.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-6 font-bold">{exam.title}</td>
                <td className="p-6 text-slate-400">{exam.category}</td>
                <td className="p-6 text-slate-400">{exam.duration_minutes}m</td>
                <td className="p-6">
                  <button onClick={() => togglePublish(exam.id, exam.is_published)} className="flex items-center gap-2">
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
                    <Link href={`/admin/exams/${exam.id}`} className="hover:text-white transition-colors" title="Edit"><Edit className="w-4 h-4" /></Link>
                    <button onClick={() => deleteExam(exam.id)} className="hover:text-rose-500 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
