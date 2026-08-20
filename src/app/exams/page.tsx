"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Clock, 
  ArrowRight, 
  Zap, 
  Layers, 
  Sparkles, 
  LayoutGrid, 
  List as ListIcon 
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function ExamsListingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Science", "Mathematics", "Engineering", "Medical", "Competitive"];

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    const fetchExams = async () => {
      try {
        const q = query(
          collection(db, "exams"), 
          where("is_published", "==", true)
        );
      
        unsubscribe = onSnapshot(q, (snapshot) => {
           if (!active) return;
           const examsData = snapshot.docs
             .map(doc => ({
               id: doc.id,
               ...doc.data()
             }))
             .filter((exam: any) => exam.visibility === "public")
             .sort((a: any, b: any) => {
                const timeA = a.created_at?.toMillis?.() || 0;
                const timeB = b.created_at?.toMillis?.() || 0;
                return timeB - timeA;
             });

           setExams(examsData);
           setLoading(false);
        }, (error) => {
           if (!active) return;
           console.error("Error fetching exams logic:", error);
           setLoading(false);
        });
      } catch (err) {
        if (!active) return;
        console.error("Failed to initialize exam stream:", err);
        setLoading(false);
      }
    };

    fetchExams();

    return () => {
      active = false;
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (e) {
          console.warn("Firestore listener cleanup error:", e);
        }
      }
    };
  }, []);

  const filteredExams = exams.filter(exam => {
    const matchesSearch = (exam.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (exam.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || exam.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-mesh text-slate-900 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Verified Test Simulation Engine</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Advanced <span className="text-gradient">Exam Matrix</span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Precision-engineered mock sessions calibrated for the 2026 academic cycle. Select your subject and initiate your timed evaluation.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search simulations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-600 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedCategory === cat 
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                    : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Exam Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-[360px] bg-white border border-slate-200 rounded-3xl animate-pulse shadow-sm"></div>
            ))}
          </div>
        ) : filteredExams.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
            : "flex flex-col gap-4"
          }>
            <AnimatePresence mode="popLayout">
              {filteredExams.map((exam, index) => (
                <ExamCard key={exam.id} exam={exam} index={index} viewMode={viewMode} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center rounded-3xl bg-white border border-dashed border-slate-200 p-8 space-y-4"
          >
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100">
               <Layers className="w-8 h-8 text-indigo-600 opacity-60" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No matching exams found</h3>
            <p className="text-slate-500 text-xs font-medium">Try modifying your search filter keywords.</p>
            <button 
              onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ExamCard({ exam, index, viewMode }: any) {
  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group bg-white border border-slate-200 hover:border-indigo-400 rounded-3xl p-6 transition-all flex items-center justify-between shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-6">
           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${
             exam.category === 'Medical' ? 'bg-rose-50 text-rose-700' :
             exam.category === 'Science' ? 'bg-indigo-50 text-indigo-700' :
             'bg-emerald-50 text-emerald-700'
           }`}>
             {exam.category?.charAt(0)}
           </div>
           <div>
             <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{exam.title}</h3>
             <div className="flex items-center gap-3 mt-1.5">
               <span className="text-xs font-bold text-slate-500">{exam.category}</span>
               <span className="w-1 h-1 rounded-full bg-slate-300"></span>
               <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {exam.duration_minutes}m Session</span>
             </div>
           </div>
        </div>
        <Link 
          href={`/exams/${exam.id}/take`}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm active:scale-95"
        >
          Start Exam <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="group flex flex-col justify-between bg-white border border-slate-200 hover:border-indigo-400 rounded-3xl p-7 transition-all shadow-sm hover:shadow-md"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className={`p-3.5 rounded-2xl border ${
            exam.category === 'Medical' ? 'bg-rose-50 border-rose-200 text-rose-700' :
            exam.category === 'Engineering' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
            'bg-indigo-50 border-indigo-200 text-indigo-700'
          }`}>
            <Zap className="w-5 h-5" />
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            {exam.category}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
            {exam.title}
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed line-clamp-2">
            {exam.description || "Synthesizing full-spectrum evaluation metrics for domain mastery."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Duration</p>
            <p className="text-base font-black text-slate-900">{exam.duration_minutes}m</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Questions</p>
            <p className="text-base font-black text-slate-900">{exam.questions_count || 10}</p>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 mt-6">
        <Link 
          href={`/exams/${exam.id}/take`}
          className="w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
        >
          <span>Start Assessment</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
