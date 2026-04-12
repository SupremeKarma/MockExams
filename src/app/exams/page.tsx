"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Star,
  Layers,
  Sparkles,
  Trophy,
  Flame,
  LayoutGrid,
  List as ListIcon
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, onSnapshot } from "firebase/firestore";

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
        // Simplified query to avoid missing index error (ID: 55)
        // We filter visibility and sort by date client-side to ensure immediate usability
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
          console.warn("Firestore listener cleanup suppressed internal error:", e);
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
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30">
      {/* 🌌 Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* 🚀 Header & Filtering */}
        <div className="relative mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center lg:text-left mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              <Sparkles className="w-3 h-3" /> Explore Repository
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
              Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">Exam Matrix.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">
              Precision-engineered mock sessions calibrated for the 2026 academic cycle. Select your domain and initiate evaluation.
            </p>
          </motion.div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between p-6 bg-slate-900/40 border border-white/5 rounded-[2rem] backdrop-blur-xl shadow-2xl">
            <div className="relative w-full lg:w-[400px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search simulations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-2 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] font-black text-slate-500">
                <kbd>/</kbd> SEED
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    selectedCategory === cat 
                      ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]" 
                      : "bg-white/5 text-slate-500 border border-white/5 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2 p-1 bg-slate-950/50 border border-white/5 rounded-xl">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <ListIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 📦 Exam Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-[400px] bg-white/5 border border-white/5 rounded-[2.5rem] animate-pulse"></div>
            ))}
          </div>
        ) : filteredExams.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" 
            : "flex flex-col gap-6"
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
            className="flex flex-col items-center justify-center py-40 text-center"
          >
            <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mb-8 border border-indigo-500/20">
               <Layers className="w-12 h-12 text-indigo-400 opacity-50" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Simulation Void Detected</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No matches found in current neural repository</p>
            <button 
              onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
              className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-slate-300 hover:text-white transition-all uppercase tracking-widest"
            >
              Reset Matrix
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ExamCard({ exam, index, viewMode }: any) {
  const isPremium = false; // All exams are now standard/free

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group relative bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 rounded-3xl p-6 transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-8">
           <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${
             exam.category === 'Medical' ? 'bg-rose-500/10 text-rose-400' :
             exam.category === 'Science' ? 'bg-indigo-500/10 text-indigo-400' :
             'bg-emerald-500/10 text-emerald-400'
           }`}>
             {exam.category?.charAt(0)}
           </div>
           <div>
             <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{exam.title}</h3>
             <div className="flex items-center gap-4 mt-2">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{exam.category}</span>
               <span className="w-1 h-1 rounded-full bg-slate-700"></span>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5"><Clock className="w-3 h-3" /> {exam.duration_minutes}m Session</span>
             </div>
           </div>
        </div>
        <Link 
          href={`/exams/${exam.id}/take`}
          className="h-14 px-8 bg-white/5 hover:bg-indigo-600 border border-white/5 hover:border-indigo-500 rounded-2xl text-xs font-black text-white transition-all flex items-center gap-3 active:scale-95"
        >
          Initiate <ArrowRight className="w-4 h-4" />
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
      className={`glass-card group relative flex flex-col h-full bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 rounded-[2.5rem] p-8 transition-all hover:translate-y-[-8px] hover:shadow-[0_20px_60px_rgba(79,70,229,0.2)] overflow-hidden`}
    >
      {/* Visual Accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity -z-10 ${
        isPremium ? "bg-amber-500" : "bg-indigo-500"
      }`}></div>

      <div className="flex justify-between items-start mb-8">
        <div className={`p-4 rounded-2xl border transition-colors ${
          exam.category === 'Medical' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
          exam.category === 'Engineering' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
          'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
        }`}>
          <Zap className="w-6 h-6" />
        </div>
        
        {/* Premium badge removed */}
      </div>

      <div className="space-y-4 mb-10 flex-grow">
        <h3 className="text-2xl font-black text-white leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-cyan-400 transition-all duration-500">
          {exam.title}
        </h3>
        <p className="text-slate-400 text-sm font-medium leading-relaxed line-clamp-2">
          {exam.description || "Synthesizing full-spectrum evaluation metrics for domain mastery."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center transition-colors group-hover:bg-white/[0.08]">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Time Alloc</p>
          <p className="text-lg font-black text-white tabular-nums">{exam.duration_minutes}m</p>
        </div>
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center transition-colors group-hover:bg-white/[0.08]">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Questions</p>
          <p className="text-lg font-black text-white tabular-nums">{exam.questions_count || 10}</p>
        </div>
      </div>

      <Link 
        href={`/exams/${exam.id}/take`}
        className="w-full h-16 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all relative overflow-hidden group/btn bg-indigo-600 text-white shadow-[0_10px_30px_rgba(79,70,229,0.2)] hover:bg-indigo-500"
      >
        <span className="relative z-10 flex items-center gap-3">
          Initiate Sequence <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
        </span>
        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500"></div>
      </Link>
    </motion.div>
  );
}
