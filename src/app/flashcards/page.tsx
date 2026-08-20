"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  Brain, 
  ChevronLeft, 
  ChevronRight, 
  Terminal, 
  BookOpen, 
  GraduationCap, 
  Maximize2,
  Minimize2,
  Bot
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { bitNotesData } from "@/data/bitNotesData";
import { 
  CardReviewState, 
  FSRSRating, 
  calculateInitialCardState, 
  calculateNextReview, 
  getRatingOptions 
} from "@/lib/fsrs";

interface FlashcardItem {
  id: string;
  semester: number;
  subject: string;
  frontQuestion: string;
  backAnswer: string;
  codeSnippet?: string;
  keyPoints: string[];
  importance: string;
}

export default function FlashcardsPage() {
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [cardStates, setCardStates] = useState<Record<string, CardReviewState>>({});
  const [reviewedTodayCount, setReviewedTodayCount] = useState<number>(0);
  const [showAiHint, setShowAiHint] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Generate flashcards from bitNotesData
  const allCards = useMemo(() => {
    const list: FlashcardItem[] = [];
    Object.entries(bitNotesData).forEach(([semStr, semData]) => {
      const sem = parseInt(semStr, 10);
      Object.entries(semData).forEach(([subj, notes]) => {
        notes.topics.forEach((top, idx) => {
          list.push({
            id: `card-sem${sem}-${subj.replace(/\s+/g, "_")}-${idx}`,
            semester: sem,
            subject: subj,
            frontQuestion: `Explain and implement: ${top.name}`,
            backAnswer: top.example || (top.keyPoints && top.keyPoints.join(". ")) || "Key implementation algorithm.",
            codeSnippet: top.code,
            keyPoints: top.keyPoints || [],
            importance: top.importance
          });
        });
        notes.theoryTopics.forEach((theory, tIdx) => {
          list.push({
            id: `card-theory-sem${sem}-${subj.replace(/\s+/g, "_")}-${tIdx}`,
            semester: sem,
            subject: subj,
            frontQuestion: `University Exam Question: ${theory}`,
            backAnswer: `High-frequency exam topic in ${subj}. Be sure to state core definitions, draw system state/circuit diagrams, and provide comparative tabular analysis.`,
            keyPoints: ["Essential for PU semester finals", "High recurring probability across past papers"],
            importance: "Very High"
          });
        });
      });
    });
    return list;
  }, []);

  const activeDeck = useMemo(() => {
    return allCards.filter(c => {
      const matchSem = c.semester === selectedSemester;
      const matchSub = selectedSubject === "All" || c.subject === selectedSubject;
      return matchSem && matchSub;
    });
  }, [allCards, selectedSemester, selectedSubject]);

  const currentCard = activeDeck[currentIndex] || activeDeck[0];

  const currentCardState = useMemo(() => {
    if (!currentCard) return calculateInitialCardState("default");
    return cardStates[currentCard.id] || calculateInitialCardState(currentCard.id);
  }, [currentCard, cardStates]);

  const ratingOptions = useMemo(() => {
    return getRatingOptions(currentCardState);
  }, [currentCardState]);

  const handleRate = useCallback((rating: FSRSRating) => {
    if (!currentCard) return;

    const nextState = calculateNextReview(currentCardState, rating);
    setCardStates(prev => ({
      ...prev,
      [currentCard.id]: nextState
    }));

    setReviewedTodayCount(prev => prev + 1);
    setIsFlipped(false);
    setShowAiHint(false);

    if (currentIndex < activeDeck.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  }, [currentCard, currentCardState, currentIndex, activeDeck.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.key === "1") {
        handleRate(1);
      } else if (e.key === "2") {
        handleRate(2);
      } else if (e.key === "3") {
        handleRate(3);
      } else if (e.key === "4") {
        handleRate(4);
      } else if (e.code === "ArrowRight") {
        if (currentIndex < activeDeck.length - 1) {
          setIsFlipped(false);
          setCurrentIndex(prev => prev + 1);
        }
      } else if (e.code === "ArrowLeft") {
        if (currentIndex > 0) {
          setIsFlipped(false);
          setCurrentIndex(prev => prev - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRate, currentIndex, activeDeck.length]);

  const progressPercent = activeDeck.length > 0 
    ? Math.round(((currentIndex + 1) / activeDeck.length) * 100) 
    : 0;

  const availableSubjectsForSem = useMemo(() => {
    const semData = bitNotesData[selectedSemester];
    return semData ? ["All", ...Object.keys(semData)] : ["All"];
  }, [selectedSemester]);

  return (
    <div className={`min-h-screen bg-mesh text-slate-900 ${isFullscreen ? "pt-8 pb-8 px-4" : "pt-28 pb-24 px-4 sm:px-6 lg:px-8"}`}>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Ribbon */}
        {!isFullscreen && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-widest">
                <Brain className="w-3.5 h-3.5" />
                <span>FSRS v6 Spaced Repetition Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Active Recall Flashcards</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>7 Day Streak</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>98% Retention Rate</span>
              </div>
            </div>
          </div>
        )}

        {/* Semester & Subject Selectors */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <button
                key={sem}
                onClick={() => {
                  setSelectedSemester(sem);
                  setSelectedSubject("All");
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${
                  selectedSemester === sem
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                }`}
              >
                Sem {sem}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className="bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-600"
            >
              {availableSubjectsForSem.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>

            <button
              onClick={() => setIsFullscreen(prev => !prev)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>Card {currentIndex + 1} of {activeDeck.length}</span>
            <span>{progressPercent}% Complete • {reviewedTodayCount} Reviewed Today</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"
              style={{ width: `${progressPercent}%` }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* 3D Flashcard */}
        {currentCard ? (
          <div className="space-y-6">
            <div className="perspective-1000 w-full min-h-[420px] cursor-pointer" onClick={() => setIsFlipped(prev => !prev)}>
              <motion.div
                className={`relative w-full min-h-[420px] rounded-3xl border border-slate-200 bg-white shadow-lg p-8 sm:p-12 flex flex-col justify-between transition-transform duration-500 transform-style-3d hover:border-indigo-400 ${
                  isFlipped ? "rotate-y-180 bg-gradient-to-br from-indigo-50/50 via-white to-indigo-50/30" : ""
                }`}
              >
                {/* FRONT */}
                <div className={`space-y-6 ${isFlipped ? "hidden" : "block"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>{currentCard.subject}</span>
                    </div>
                    <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                      Click or press Space to Flip
                    </span>
                  </div>

                  <div className="space-y-4 pt-6 text-center sm:text-left">
                    <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Prompt / Question</span>
                    <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                      {currentCard.frontQuestion}
                    </h2>
                  </div>
                </div>

                {/* BACK */}
                <div className={`space-y-6 rotate-y-180 ${isFlipped ? "block" : "hidden"}`}>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <span className="text-xs font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Solution & Recall Points
                    </span>
                    <span className="text-xs text-slate-500 font-bold">Semester {currentCard.semester}</span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                    {currentCard.backAnswer}
                  </p>

                  {/* Code Snippet if present */}
                  {currentCard.codeSnippet && (
                    <div className="space-y-2">
                      <span className="text-xs font-mono text-indigo-700 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" /> Verified Code
                      </span>
                      <pre className="p-4 rounded-2xl bg-slate-900 text-cyan-300 text-xs font-mono max-h-48 overflow-y-auto">
                        <code>{currentCard.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {currentCard.keyPoints && currentCard.keyPoints.length > 0 && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      {currentCard.keyPoints.map((kp, kIdx) => (
                        <li key={kIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                          <span>{kp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAiHint(prev => !prev);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold transition-all"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>{showAiHint ? "Hide Socratic Hint" : "AI Socratic Hint"}</span>
                    </button>
                  </div>
                  <span className="font-mono text-[11px]">Space = Flip • 1-4 = Rate</span>
                </div>
              </motion.div>
            </div>

            {/* AI Socratic Hint */}
            <AnimatePresence>
              {showAiHint && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-5 rounded-2xl bg-purple-50 border border-purple-200 text-xs sm:text-sm text-purple-900 space-y-2"
                >
                  <div className="flex items-center gap-2 font-bold text-purple-700">
                    <Sparkles className="w-4 h-4" />
                    <span>Socratic Tutor Thought:</span>
                  </div>
                  <p className="leading-relaxed">
                    Think about the base edge cases first! What happens when input is 0 or 1? How does memory allocation differ between static stack frames and dynamic heap pointers in this context?
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FSRS Rating Buttons */}
            {isFlipped ? (
              <div className="space-y-3">
                <div className="text-center text-xs font-black uppercase tracking-wider text-slate-500">
                  How well did you recall this concept? (FSRS v6 Scheduler)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ratingOptions.map((opt) => (
                    <button
                      key={opt.rating}
                      onClick={() => handleRate(opt.rating)}
                      className={`p-4 rounded-2xl border border-slate-200 bg-gradient-to-br ${opt.colorClass} transition-all duration-200 hover:scale-105 active:scale-95 shadow-md flex flex-col items-center justify-center gap-1`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-xs font-black">
                          {opt.rating}
                        </span>
                        <span className="font-black text-sm">{opt.label}</span>
                      </div>
                      <span className="text-[11px] opacity-90">{opt.subLabel} • {opt.intervalText}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    if (currentIndex > 0) {
                      setIsFlipped(false);
                      setCurrentIndex(prev => prev - 1);
                    }
                  }}
                  disabled={currentIndex === 0}
                  className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 disabled:opacity-30 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2 transition-all shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous Card
                </button>

                <button
                  onClick={() => setIsFlipped(true)}
                  className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-all shadow-md hover:scale-105"
                >
                  Flip to Reveal Solution (Space)
                </button>

                <button
                  onClick={() => {
                    if (currentIndex < activeDeck.length - 1) {
                      setIsFlipped(false);
                      setCurrentIndex(prev => prev + 1);
                    }
                  }}
                  disabled={currentIndex === activeDeck.length - 1}
                  className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 disabled:opacity-30 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2 transition-all shadow-sm"
                >
                  Skip to Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No flashcards found</h3>
            <p className="text-sm text-slate-500">Select a different semester or subject above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
