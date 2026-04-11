"use client";

import { useState, useEffect, use } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { BookOpen, CheckCircle, XCircle, Trash2, Edit, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OrgExamsPage({ params }: { params: any }) {
  const { orgId } = use(params) as { orgId: string };
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchExams(); }, [orgId]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "exams"), where("org_id", "==", orgId)));
      setExams(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const togglePublish = async (examId: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "exams", examId), { is_published: !current });
      fetchExams();
    } catch { alert("Failed to update"); }
  };

  const deleteExam = async (examId: string) => {
    if (!confirm("Delete this exam?")) return;
    try {
      await deleteDoc(doc(db, "exams", examId));
      setExams(prev => prev.filter(e => e.id !== examId));
    } catch { alert("Failed to delete"); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link href={`/organization/${orgId}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
          <BookOpen className="text-emerald-400 w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Organization Exams</h1>
          <p className="text-slate-400 text-sm">All exams created within your organization</p>
        </div>
      </div>

      {exams.length === 0 ? (
        <div className="glass-card p-16 rounded-3xl border border-white/10 text-center text-slate-500">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No exams yet.</p>
          <p className="text-sm mt-1">Examiners in your organization can create exams from the Examiner Portal.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="p-5">Title</th>
                <th className="p-5">Category</th>
                <th className="p-5">Questions</th>
                <th className="p-5">Visibility</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {exams.map(exam => (
                <tr key={exam.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 font-bold">{exam.title}</td>
                  <td className="p-5 text-slate-400">{exam.category}</td>
                  <td className="p-5 text-slate-400">{exam.total_questions ?? 0}</td>
                  <td className="p-5">
                    <span className="text-xs font-bold px-2 py-1 bg-white/5 text-slate-400 rounded-lg capitalize">{exam.visibility ?? "public"}</span>
                  </td>
                  <td className="p-5">
                    <button onClick={() => togglePublish(exam.id, exam.is_published)}>
                      {exam.is_published ? (
                        <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold px-2 py-1 bg-emerald-400/10 rounded-lg"><CheckCircle className="w-3 h-3" /> Published</span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold px-2 py-1 bg-white/5 rounded-lg"><XCircle className="w-3 h-3" /> Draft</span>
                      )}
                    </button>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-3 text-slate-400">
                      <Link href={`/examiner/exams/${exam.id}`} className="hover:text-white transition-colors" title="Edit"><Edit className="w-4 h-4" /></Link>
                      <button onClick={() => deleteExam(exam.id)} className="hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
