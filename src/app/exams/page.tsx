"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Clock,
  ArrowRight,
  Zap,
  Layers,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { PageHeader, SectionCard } from "@/components/UIComponents";

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
    <div className="min-h-screen bg-zinc-50/40 pb-20 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-7xl mx-auto space-y-6">

        <PageHeader
          badge="AI-Adaptive Exam Engine"
          title="Ace your exams"
          subtitle="Precision-engineered adaptive tests that adjust difficulty to your skill level, with instant feedback powered by AI diagnostics."
        />

        {/* Controls */}
        <SectionCard>
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-md pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-zinc-900 placeholder:text-zinc-400 transition-shadow"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border ${
                    selectedCategory === cat
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white text-zinc-600 hover:bg-zinc-50 border-zinc-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-0.5 p-1 bg-zinc-100 rounded-md">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-white text-primary-700 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-white text-primary-700 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </SectionCard>

        {/* Exam Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-[300px] bg-white border border-zinc-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : filteredExams.length > 0 ? (
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            : "flex flex-col gap-3"
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
            className="flex flex-col items-center justify-center py-20 text-center rounded-lg bg-white border border-dashed border-zinc-300 p-8 space-y-3"
          >
            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
               <Layers className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900">No matching exams found</h3>
            <p className="text-zinc-500 text-xs">Try modifying your search or filter.</p>
            <button
              onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
              className="px-4 py-2 bg-primary-600 text-white rounded-md text-xs font-semibold hover:bg-primary-700 transition-colors"
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
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        className="group bg-white border border-zinc-200 hover:border-primary-300 rounded-lg p-4 transition-colors flex items-center justify-between shadow-xs hover:shadow-sm"
      >
        <div className="flex items-center gap-4">
           <div className={`w-11 h-11 rounded-md flex items-center justify-center font-bold text-sm shrink-0 ${
             exam.category === 'Medical' ? 'bg-red-50 text-red-700' :
             exam.category === 'Science' ? 'bg-primary-50 text-primary-700' :
             'bg-emerald-50 text-emerald-700'
           }`}>
             {exam.category?.charAt(0)}
           </div>
           <div>
             <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-primary-600 transition-colors">{exam.title}</h3>
             <div className="flex items-center gap-2 mt-1">
               <span className="text-xs font-medium text-zinc-500">{exam.category}</span>
               <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
               <span className="text-xs font-medium text-zinc-500 flex items-center gap-1"><Clock className="w-3 h-3 text-zinc-400" /> {exam.duration_minutes}m</span>
             </div>
           </div>
        </div>
        <Link
          href={`/exams/${exam.id}/take`}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
        >
          Start <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -2 }}
      className="group flex flex-col justify-between bg-white border border-zinc-200 hover:border-primary-300 rounded-lg p-5 transition-colors shadow-xs hover:shadow-sm"
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div
            className={`p-2.5 rounded-md font-bold text-sm ${
              exam.category === "Medical"
                ? "bg-red-50 text-red-600"
                : exam.category === "Engineering"
                  ? "bg-emerald-50 text-emerald-600"
                  : exam.category === "Mathematics"
                    ? "bg-violet-50 text-violet-600"
                    : "bg-primary-50 text-primary-600"
            }`}
          >
            <Zap className="w-4 h-4" />
          </div>
          <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[11px] font-semibold">
            {exam.category}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">
            {exam.title}
          </h3>
          <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">
            {exam.description || "Comprehensive test covering key concepts and exam patterns."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 bg-zinc-50 rounded-md border border-zinc-100 text-center">
            <p className="text-[10px] font-semibold text-zinc-500 uppercase">Duration</p>
            <p className="text-sm font-bold text-zinc-900">{exam.duration_minutes}m</p>
          </div>
          <div className="p-2.5 bg-zinc-50 rounded-md border border-zinc-100 text-center">
            <p className="text-[10px] font-semibold text-zinc-500 uppercase">Questions</p>
            <p className="text-sm font-bold text-zinc-900">{exam.questions_count || 10}</p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-100 mt-4">
        <Link
          href={`/exams/${exam.id}/take`}
          className="w-full py-2.5 rounded-md font-semibold text-xs flex items-center justify-center gap-2 transition-colors bg-primary-600 hover:bg-primary-700 text-white"
        >
          <span>Start Exam</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
