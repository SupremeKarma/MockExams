"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
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
  Terminal,
  Brain,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { bitNotesData, type SubjectNotes, type Topic } from "@/data/bitNotesData";
import ProgramGate from "@/components/ProgramGate";
import MarkdownViewer from "@/components/MarkdownViewer";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { FileText, Download } from "lucide-react";

export default function NotesPage() {
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"code" | "theory" | "markdown">("code");
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [openTheoryIndex, setOpenTheoryIndex] = useState<number | null>(null);

  const [firestoreCourses, setFirestoreCourses] = useState<Record<string, { code: string; name: string; creditHours: number; theoryTopics: string[] }>>({});
  const [firestoreTopics, setFirestoreTopics] = useState<Record<string, Topic[]>>({});
  const [isFirestoreLoaded, setIsFirestoreLoaded] = useState(false);

  // 1. Listen to courses in studentNotes for the selected semester
  useEffect(() => {
    try {
      const q = query(
        collection(db, "studentNotes"),
        where("semester", "==", selectedSemester)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const coursesMap: Record<string, { code: string; name: string; creditHours: number; theoryTopics: string[] }> = {};
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const subjectKey = data.subjectKey || data.name || docSnap.id;
            coursesMap[subjectKey] = {
              code: data.code || docSnap.id,
              name: data.name || subjectKey,
              creditHours: data.creditHours || 3,
              theoryTopics: data.theoryTopics || []
            };
          });
          setFirestoreCourses(coursesMap);
          setIsFirestoreLoaded(true);
        }
      }, (err) => {
        console.warn("Firestore studentNotes listener error, falling back to static data:", err);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn("Failed to attach studentNotes listener:", err);
    }
  }, [selectedSemester]);

  // Available subjects: prefer Firestore courses if loaded, else fallback to bitNotesData
  const availableSubjects = useMemo(() => {
    if (isFirestoreLoaded && Object.keys(firestoreCourses).length > 0) {
      return Object.keys(firestoreCourses);
    }
    const semData = bitNotesData[selectedSemester];
    return semData ? Object.keys(semData) : [];
  }, [selectedSemester, isFirestoreLoaded, firestoreCourses]);

  const currentSubject = useMemo(() => {
    if (selectedSubject && availableSubjects.includes(selectedSubject)) {
      return selectedSubject;
    }
    return availableSubjects[0] || "";
  }, [selectedSubject, availableSubjects]);

  // Determine current course code
  const currentCourseCode = useMemo(() => {
    if (firestoreCourses[currentSubject]) {
      return firestoreCourses[currentSubject].code;
    }
    const semData = bitNotesData[selectedSemester];
    return semData?.[currentSubject]?.code || currentSubject;
  }, [currentSubject, firestoreCourses, selectedSemester]);

  // 2. Listen to topics for current course code from Firestore
  useEffect(() => {
    if (!currentCourseCode) return;
    try {
      const topicsRef = collection(db, "studentNotes", currentCourseCode, "topics");
      const unsubscribe = onSnapshot(topicsRef, (snapshot) => {
        if (!snapshot.empty) {
          const topicsList: Topic[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            topicsList.push({
              id: data.topicId || docSnap.id,
              name: data.name || "",
              importance: data.importance || "Medium",
              keyPoints: data.keyPoints || [],
              theory: data.theory || "",
              code: data.code || undefined,
              example: data.example || undefined,
              commonExamQuestions: data.commonExamQuestions || []
            });
          });
          setFirestoreTopics((prev) => ({
            ...prev,
            [currentSubject]: topicsList
          }));
        }
      }, (err) => {
        console.warn("Firestore topics listener error, using fallback:", err);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn("Failed to attach topics listener:", err);
    }
  }, [currentCourseCode, currentSubject]);

  const activeNotes = useMemo((): SubjectNotes | null => {
    // If Firestore has loaded topics and course details for currentSubject
    if (firestoreCourses[currentSubject] && firestoreTopics[currentSubject]) {
      const c = firestoreCourses[currentSubject];
      return {
        subjectName: c.name,
        code: c.code,
        creditHours: c.creditHours,
        theoryTopics: c.theoryTopics,
        topics: firestoreTopics[currentSubject]
      };
    }
    // Zero-downtime fallback to hardcoded bitNotesData
    const semData = bitNotesData[selectedSemester];
    if (!semData || !currentSubject) return null;
    return semData[currentSubject] || null;
  }, [selectedSemester, currentSubject, firestoreCourses, firestoreTopics]);

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

  const notesMarkdown = useMemo(() => {
    if (!activeNotes) return "";
    const lines: string[] = [];
    lines.push(`# ${currentSubject} (${currentCourseCode})`);
    lines.push(`**Semester**: ${selectedSemester} | **Credits**: ${activeNotes.creditHours || 3}`);
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push("## 1. Core Code Algorithms & Practical Implementations");
    lines.push("");

    activeNotes.topics.forEach((t, i) => {
      lines.push(`### 1.${i + 1} ${t.name} [Priority: ${t.importance}]`);
      if (t.keyPoints && t.keyPoints.length > 0) {
        lines.push("**Key Concepts & Exam Notes:**");
        t.keyPoints.forEach((kp) => lines.push(`- ${kp}`));
        lines.push("");
      }
      if (t.code) {
        const lang = t.codeExamples?.[0]?.language || "cpp";
        lines.push("```" + lang);
        lines.push(t.code);
        lines.push("```");
        lines.push("");
      }
      lines.push("---");
      lines.push("");
    });

    if (activeNotes.theoryTopics && activeNotes.theoryTopics.length > 0) {
      lines.push("## 2. High-Frequency Theory Questions & University Solutions");
      lines.push("");
      activeNotes.theoryTopics.forEach((tt, i) => {
        lines.push(`### Q${i + 1}: ${tt}`);
        lines.push(`> **University Exam Solution Guide**: High-frequency recurring topic for Purbanchal University assessments. Structure your answer with clear definitions, architecture diagram/state flow, and key points.`);
        lines.push("");
      });
    }

    return lines.join("\n");
  }, [activeNotes, currentSubject, currentCourseCode, selectedSemester]);

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
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-200 text-xs font-bold"><Layers className="w-3.5 h-3.5 text-primary-600" /> Medium Priority</span>;
    }
  };

  return (
    <ProgramGate>
    <div className="min-h-screen bg-zinc-50/40 pb-20 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Banner */}
        <div className="relative rounded-lg p-6 sm:p-8 overflow-hidden border border-zinc-200 bg-white">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-[11px] font-bold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Purbanchal University BIT</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight leading-tight">
              Study notes &amp; important topics
            </h1>

            <p className="text-sm text-zinc-500 leading-relaxed">
              High-frequency exam topics, verified code algorithms, key formulas, and theory questions organized by semester.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <Link href="/flashcards" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-sm font-semibold text-white transition-colors shadow-button">
                <Brain className="w-4 h-4" />
                Flashcard drills
              </Link>
              <Link href="/projects" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white hover:bg-zinc-50 border border-zinc-200 text-sm font-semibold text-zinc-700 transition-colors">
                <Code2 className="w-4 h-4 text-sky-600" />
                Projects
              </Link>
            </div>
          </div>
        </div>

        {/* Semester Selection Ribbon */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary-600" />
              Select semester
            </h2>
            <span className="text-xs text-zinc-500 font-medium">8 semesters available</span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
              const isSelected = selectedSemester === sem;
              return (
                <button
                  key={sem}
                  onClick={() => {
                    setSelectedSemester(sem);
                    setSelectedSubject("");
                  }}
                  className={`px-4 py-2 rounded-md font-semibold text-xs whitespace-nowrap transition-colors border flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white hover:bg-zinc-50 text-zinc-600 border-zinc-200"
                  }`}
                >
                  <span>Sem {sem}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subject Navigation & Search Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

          {/* Sidebar: Subject Selector */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-lg p-4 border border-zinc-200 bg-white space-y-4 sticky top-20 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center justify-between">
                <span>Semester {selectedSemester} Subjects</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-bold">{availableSubjects.length}</span>
              </h3>

              <div className="space-y-2">
                {availableSubjects.map((subject) => {
                  const isActive = currentSubject === subject;
                  return (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`w-full text-left p-3.5 rounded-lg transition-all duration-200 flex items-center justify-between group border ${
                        isActive
                          ? "bg-primary-50 border-primary-200 text-primary-700 font-bold shadow-sm"
                          : "bg-white hover:bg-zinc-50 border-zinc-100 text-zinc-700"
                      }`}
                    >
                      <span className="text-sm line-clamp-1">{subject}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "text-primary-600 translate-x-1" : "text-zinc-400 group-hover:translate-x-1"}`} />
                    </button>
                  );
                })}
              </div>

              {/* View Switcher: Code vs Theory vs Markdown */}
              <div className="pt-2 border-t border-zinc-100">
                <div className="grid grid-cols-1 gap-1.5 p-1 rounded-xl bg-zinc-100 border border-zinc-200">
                  <button
                    onClick={() => setActiveTab("code")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-start gap-2 ${
                      activeTab === "code"
                        ? "bg-white text-primary-700 shadow-sm"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5 text-primary-600" />
                    <span>Code Topics</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("theory")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-start gap-2 ${
                      activeTab === "theory"
                        ? "bg-white text-primary-700 shadow-sm"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-primary-600" />
                    <span>Theory FAQs</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("markdown")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-start gap-2 ${
                      activeTab === "markdown"
                        ? "bg-white text-primary-700 shadow-sm"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-primary-600" />
                    <span>Official .md Notes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search Input Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search algorithms, concepts, or theory in ${currentSubject || "this semester"}...`}
                className="w-full pl-12 pr-4 py-4 rounded-lg bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 text-sm shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500 hover:text-zinc-900 px-2 py-1 rounded-md bg-zinc-100"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Subject Title & Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Semester {selectedSemester}</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mt-1">{currentSubject}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 font-bold">
                  {activeNotes?.topics.length || 0} Code Topics
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 font-bold">
                  {activeNotes?.theoryTopics.length || 0} Theory FAQs
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "markdown" ? "code" : "markdown")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                    activeTab === "markdown"
                      ? "bg-primary-600 text-white border-primary-600 shadow-xs"
                      : "bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{activeTab === "markdown" ? "Interactive Mode" : "Official .md Notes"}</span>
                </button>
              </div>
            </div>

            {/* Content Display: Markdown Document vs Code Tab vs Theory Tab */}
            {activeTab === "markdown" ? (
              <div className="space-y-4">
                <MarkdownViewer
                  content={notesMarkdown}
                  title={`${currentSubject} (${currentCourseCode}) Study Notes`}
                  downloadFilename={`${currentCourseCode || currentSubject}_Notes.md`}
                  showActions={true}
                />
              </div>
            ) : activeTab === "code" ? (
              <div className="space-y-6">
                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic, idx) => (
                    <motion.div
                      key={topic.name}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Topic Card Header */}
                      <div className="p-6 sm:p-7 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-primary-50 border border-primary-200 text-primary-600 flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900">{topic.name}</h3>
                          </div>
                        </div>
                        <div>{getImportanceBadge(topic.importance)}</div>
                      </div>

                      {/* Topic Key Points */}
                      {topic.keyPoints && topic.keyPoints.length > 0 && (
                        <div className="p-6 sm:p-7 bg-white border-b border-zinc-100">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            Core Concepts & Exam Keys
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {topic.keyPoints.map((point, pIdx) => (
                              <li key={pIdx} className="text-xs sm:text-sm text-zinc-700 flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Code Block / Example */}
                      {topic.code && (
                        <div className="p-6 sm:p-7 space-y-3 bg-zinc-900 text-zinc-100 rounded-b-xl">
                          <div className="flex items-center justify-between text-xs text-zinc-400">
                            <span className="font-mono flex items-center gap-2">
                              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                              Executable Algorithm
                            </span>
                            <button
                              onClick={() => handleCopy(topic.code!, idx)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-zinc-200 transition-all active:scale-95"
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

                          <pre className="p-4 rounded-xl bg-zinc-950 border border-white/5 overflow-x-auto text-xs sm:text-sm font-mono text-cyan-300 leading-relaxed shadow-inner">
                            <code>{topic.code}</code>
                          </pre>
                        </div>
                      )}

                      {/* Formula / Math Example */}
                      {topic.example && (
                        <div className="p-6 sm:p-7 bg-primary-50/50 border-t border-zinc-100">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-primary-700 mb-2">Mathematical Formulation</h4>
                          <pre className="p-4 rounded-xl bg-white border border-primary-100 text-xs sm:text-sm font-mono text-primary-900 whitespace-pre-wrap">
                            {topic.example}
                          </pre>
                        </div>
                      )}

                      {/* Asked in Exams Section */}
                      {topic.commonExamQuestions && topic.commonExamQuestions.length > 0 && (
                        <div className="p-6 sm:p-7 bg-amber-50/40 border-t border-amber-100">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-amber-600" />
                            Asked in Past University Exams
                          </h4>
                          <ul className="space-y-2">
                            {topic.commonExamQuestions.map((qText, qIdx) => (
                              <li key={qIdx} className="text-xs sm:text-sm text-zinc-800 flex items-start gap-2.5 bg-white p-3 rounded-lg border border-amber-200/60 shadow-xs">
                                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px] shrink-0 mt-0.5">
                                  Q{qIdx + 1}
                                </span>
                                <span className="font-medium">{qText}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="p-12 text-center rounded-xl bg-white border border-dashed border-zinc-200 space-y-3">
                    <Code2 className="w-12 h-12 text-zinc-400 mx-auto" />
                    <h3 className="text-lg font-bold text-zinc-900">No code topics match your query</h3>
                    <p className="text-sm text-zinc-500">Try a different search term or select another subject from the left panel.</p>
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
                        className="rounded-lg border border-zinc-200 bg-white overflow-hidden transition-all shadow-sm"
                      >
                        <button
                          onClick={() => setOpenTheoryIndex(isOpen ? null : qIdx)}
                          className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-zinc-50 transition-colors"
                        >
                          <div className="flex items-center gap-3.5">
                            <span className="w-7 h-7 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                              Q{qIdx + 1}
                            </span>
                            <span className="text-sm sm:text-base font-bold text-zinc-900">{question}</span>
                          </div>
                          <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform ${isOpen ? "rotate-180 text-primary-600" : ""}`} />
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-6 pb-6 pt-2 border-t border-zinc-100 bg-zinc-50/50 text-xs sm:text-sm text-zinc-700 space-y-3"
                            >
                              <div className="p-4 rounded-xl bg-white border border-zinc-200 space-y-2">
                                <span className="text-xs font-bold text-primary-700 uppercase tracking-wide">University Exam Guidance</span>
                                <p className="leading-relaxed text-zinc-600">
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
                  <div className="p-12 text-center rounded-xl bg-white border border-dashed border-zinc-200 space-y-3">
                    <HelpCircle className="w-12 h-12 text-zinc-400 mx-auto" />
                    <h3 className="text-lg font-bold text-zinc-900">No theory questions found</h3>
                    <p className="text-sm text-zinc-500">Try changing your search keywords.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </ProgramGate>
  );
}
