"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Search, 
  Code2, 
  Copy, 
  Check, 
  Sparkles, 
  ChevronDown, 
  ChevronRight, 
  HelpCircle, 
  Flame, 
  GraduationCap, 
  Layers,
  ArrowRight,
  Terminal,
  Brain
} from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { bitNotesData } from "@/data/bitNotesData";

export default function NotesPage() {
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"code" | "theory">("code");
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [openTheoryIndex, setOpenTheoryIndex] = useState<number | null>(null);

  const availableSubjects = useMemo(() => {
    const semData = bitNotesData[selectedSemester];
    return semData ? Object.keys(semData) : [];
  }, [selectedSemester]);

  const currentSubject = useMemo(() => {
    if (selectedSubject && availableSubjects.includes(selectedSubject)) {
      return selectedSubject;
    }
    return availableSubjects[0] || "";
  }, [selectedSubject, availableSubjects]);

  const activeNotes = useMemo(() => {
    const semData = bitNotesData[selectedSemester];
    if (!semData || !currentSubject) return null;
    return semData[currentSubject] || null;
  }, [selectedSemester, currentSubject]);

  const filteredTopics = useMemo(() => {
    if (!activeNotes) return [];
    if (!searchQuery.trim()) return activeNotes.topics;

    const q = searchQuery.toLowerCase();
    return activeNotes.topics.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.keyPoints.some(kp => kp.toLowerCase().includes(q)) ||
      (t.code && t.code.toLowerCase().includes(q))
    );
  }, [activeNotes, searchQuery]);

  const filteredTheory = useMemo(() => {
    if (!activeNotes) return [];
    if (!searchQuery.trim()) return activeNotes.theoryTopics;

    const q = searchQuery.toLowerCase();
    return activeNotes.theoryTopics.filter(tt => tt.toLowerCase().includes(q));
  }, [activeNotes, searchQuery]);

  const handleCopy = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "Very High":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold"><Flame className="w-3.5 h-3.5 text-rose-600" /> Very High Priority</span>;
      case "High":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold"><Sparkles className="w-3.5 h-3.5 text-amber-600" /> High Priority</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold"><Layers className="w-3.5 h-3.5 text-indigo-600" /> Medium Priority</span>;
    }
  };

  return (
    <div className="min-h-screen bg-mesh text-slate-900 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Banner */}
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-widest">
              <GraduationCap className="w-4 h-4" />
              <span>Purbanchal University BIT Study Hub</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Curated Notes & <br />
              <span className="text-gradient">Important Topics</span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Master recurring exam topics, verified code algorithms, key formulas, and high-frequency theory questions organized semester by semester.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/flashcards" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-bold text-white transition-all shadow-md">
                <Brain className="w-4 h-4" />
                Active Recall Flashcards
              </Link>
              <Link href="/syllabus" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-bold text-slate-700 transition-all">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                View Full Syllabus
              </Link>
              <Link href="/projects" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-bold text-slate-700 transition-all">
                <Code2 className="w-4 h-4 text-cyan-600" />
                Semester Projects
              </Link>
            </div>
          </div>
        </div>

        {/* Semester Selection Ribbon */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Select Semester
            </h2>
            <span className="text-xs text-slate-500 font-bold">8 Semesters Available</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
              const isSelected = selectedSemester === sem;
              return (
                <button
                  key={sem}
                  onClick={() => {
                    setSelectedSemester(sem);
                    setSelectedSubject("");
                  }}
                  className={`px-6 py-3 rounded-2xl font-black text-sm whitespace-nowrap transition-all duration-200 border flex items-center gap-2 ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-105"
                      : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  <span>Sem {sem}</span>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Subject Navigation & Search Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Sidebar: Subject Selector */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-3xl p-5 border border-slate-200 bg-white space-y-4 sticky top-28 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
                <span>Semester {selectedSemester} Subjects</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold">{availableSubjects.length}</span>
              </h3>

              <div className="space-y-2">
                {availableSubjects.map((subject) => {
                  const isActive = currentSubject === subject;
                  return (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 flex items-center justify-between group border ${
                        isActive
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold shadow-sm"
                          : "bg-white hover:bg-slate-50 border-slate-100 text-slate-700"
                      }`}
                    >
                      <span className="text-sm line-clamp-1">{subject}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "text-indigo-600 translate-x-1" : "text-slate-400 group-hover:translate-x-1"}`} />
                    </button>
                  );
                })}
              </div>

              {/* View Switcher: Code vs Theory */}
              <div className="pt-2 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                  <button
                    onClick={() => setActiveTab("code")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === "code"
                        ? "bg-white text-indigo-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    Code Topics
                  </button>
                  <button
                    onClick={() => setActiveTab("theory")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === "theory"
                        ? "bg-white text-indigo-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Theory FAQs
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search Input Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search algorithms, concepts, or theory in ${currentSubject || "this semester"}...`}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 text-sm shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-900 px-2 py-1 rounded-md bg-slate-100"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Subject Title & Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600">Semester {selectedSemester}</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{currentSubject}</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-bold">
                  {activeNotes?.topics.length || 0} Code Topics
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-bold">
                  {activeNotes?.theoryTopics.length || 0} Theory FAQs
                </span>
              </div>
            </div>

            {/* Content Display: Code Tab vs Theory Tab */}
            {activeTab === "code" ? (
              <div className="space-y-6">
                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic, idx) => (
                    <motion.div
                      key={topic.name}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Topic Card Header */}
                      <div className="p-6 sm:p-7 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center text-xs font-black">
                              {idx + 1}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{topic.name}</h3>
                          </div>
                        </div>
                        <div>{getImportanceBadge(topic.importance)}</div>
                      </div>

                      {/* Topic Key Points */}
                      {topic.keyPoints && topic.keyPoints.length > 0 && (
                        <div className="p-6 sm:p-7 bg-white border-b border-slate-100">
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            Core Concepts & Exam Keys
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {topic.keyPoints.map((point, pIdx) => (
                              <li key={pIdx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Code Block / Example */}
                      {topic.code && (
                        <div className="p-6 sm:p-7 space-y-3 bg-slate-900 text-slate-100 rounded-b-3xl">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-mono flex items-center gap-2">
                              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                              Executable Algorithm
                            </span>
                            <button
                              onClick={() => handleCopy(topic.code!, idx)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-slate-200 transition-all active:scale-95"
                            >
                              {copiedCodeIndex === idx ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Code</span>
                                </>
                              )}
                            </button>
                          </div>

                          <pre className="p-4 rounded-xl bg-slate-950 border border-white/5 overflow-x-auto text-xs sm:text-sm font-mono text-cyan-300 leading-relaxed shadow-inner">
                            <code>{topic.code}</code>
                          </pre>
                        </div>
                      )}

                      {/* Formula / Math Example */}
                      {topic.example && (
                        <div className="p-6 sm:p-7 bg-indigo-50/50 border-t border-slate-100">
                          <h4 className="text-xs font-black uppercase tracking-wider text-indigo-700 mb-2">Mathematical Formulation</h4>
                          <pre className="p-4 rounded-xl bg-white border border-indigo-100 text-xs sm:text-sm font-mono text-indigo-900 whitespace-pre-wrap">
                            {topic.example}
                          </pre>
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
                    <Code2 className="w-12 h-12 text-slate-400 mx-auto" />
                    <h3 className="text-lg font-bold text-slate-900">No code topics match your query</h3>
                    <p className="text-sm text-slate-500">Try a different search term or select another subject from the left panel.</p>
                  </div>
                )}
              </div>
            ) : (
              /* Theory Tab */
              <div className="space-y-3">
                {filteredTheory.length > 0 ? (
                  filteredTheory.map((question, qIdx) => {
                    const isOpen = openTheoryIndex === qIdx;
                    return (
                      <div
                        key={qIdx}
                        className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-sm"
                      >
                        <button
                          onClick={() => setOpenTheoryIndex(isOpen ? null : qIdx)}
                          className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3.5">
                            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                              Q{qIdx + 1}
                            </span>
                            <span className="text-sm sm:text-base font-bold text-slate-900">{question}</span>
                          </div>
                          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-indigo-600" : ""}`} />
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 text-xs sm:text-sm text-slate-700 space-y-3"
                            >
                              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">University Exam Guidance</span>
                                <p className="leading-relaxed text-slate-600">
                                  This question is a high-frequency recurring topic in Purbanchal University final examinations. When preparing your answer, ensure you define the primary concept clearly, illustrate with an architectural diagram or state chart, and provide clear comparative points with tabular contrast where applicable.
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
                    <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
                    <h3 className="text-lg font-bold text-slate-900">No theory questions found</h3>
                    <p className="text-sm text-slate-500">Try changing your search keywords.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
