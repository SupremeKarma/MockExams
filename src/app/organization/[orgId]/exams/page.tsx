"use client";

import { useState, useEffect, use } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { BookOpen, CheckCircle, XCircle, Trash2, Edit, Loader2, ArrowLeft, MoreVertical, Search, Plus } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function OrgExamsPage({ params }: { params: any }) {
  const { orgId } = use(params) as { orgId: string };
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { fetchExams(); }, [orgId]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "exams"), where("org_id", "==", orgId)));
      setExams(snap.docs.map((d: any) => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const togglePublish = async (examId: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "exams", examId), { is_published: !current });
      fetchExams();
    } catch { alert("Failed to update status."); }
  };

  const deleteExam = async (examId: string) => {
    if (!confirm("This will permanently purge this knowledge asset. Proceed?")) return;
    try {
      await deleteDoc(doc(db, "exams", examId));
      setExams(prev => prev.filter(e => e.id !== examId));
    } catch { alert("Purge sequence failed."); }
  };

  const filteredExams = exams.filter(e => 
    e.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-slate-500 font-bold tracking-widest text-[10px] uppercase">Retrieving Asset Catalog...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-10 px-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
        <div className="space-y-4">
          <Link href={`/organization/${orgId}`} className="inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
            <ArrowLeft className="w-4 h-4" /> Command Dashboard
          </Link>
          <div>
            <h1 className="text-5xl font-black tracking-tight leading-none mb-4">Curriculum <span className="text-slate-500">Assets</span></h1>
            <p className="text-slate-400 font-medium max-w-lg">Manage, publish, and monitor institutional examination modules.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Filter catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all text-sm w-full sm:w-64"
            />
          </div>
          <Link href="/examiner/create" className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> NEW EXAM
          </Link>
        </div>
      </header>

      {filteredExams.length === 0 ? (
        <div className="glass-card p-24 rounded-[3rem] border border-white/10 text-center flex flex-col items-center gap-6 bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center opacity-30 grayscale">
            <BookOpen className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">No assets found</h3>
            <p className="text-slate-500 font-medium max-w-sm">No knowledge modules match your current filter or have been provisioned yet.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {filteredExams.map((exam, idx) => (
              <motion.div 
                key={exam.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card p-8 rounded-[2.5rem] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl ${exam.is_published ? 'bg-emerald-400/10 text-emerald-400' : 'bg-slate-400/10 text-slate-500'}`}>
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black group-hover:text-primary transition-colors">{exam.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 py-1 bg-white/5 rounded-full">{exam.category}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{exam.total_questions ?? 0} Questions</span>
                      <span className="text-slate-700">•</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 capitalize">{exam.visibility ?? "public"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between border-t border-white/5 md:border-0 pt-6 md:pt-0">
                  <div className="flex items-center gap-10">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2">Network Status</p>
                      <button 
                        onClick={() => togglePublish(exam.id, exam.is_published)}
                        className={`group/btn flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-black text-[10px] uppercase tracking-widest ${exam.is_published ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10'}`}
                      >
                        {exam.is_published ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {exam.is_published ? "PUBLISHED" : "DRAFT"}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/examiner/exams/${exam.id}`} 
                      className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-slate-500 hover:text-white"
                      title="Edit Asset"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => deleteExam(exam.id)}
                      className="p-4 bg-rose-500/5 hover:bg-rose-500/10 rounded-2xl border border-rose-500/10 transition-all text-rose-500/50 hover:text-rose-500"
                      title="Purge Asset"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
