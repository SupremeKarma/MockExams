"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  FileText, 
  Download, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap,
  Layers, 
  Code2,
  Calendar,
  Clock,
  Printer
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useMemo } from "react";
import { bitNotesData } from "@/data/bitNotesData";
import { bitSyllabusData } from "@/data/bitSyllabusData";
import { bitPastPapersData, FullPastPaper } from "@/data/bitPastPapersData";

export default function SemesterDetailPage() {
  const params = useParams();
  const semesterNum = Number(params.id) || 1;

  const [activeTab, setActiveTab] = useState<"past-questions" | "important-topics">("past-questions");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedPaper, setSelectedPaper] = useState<FullPastPaper | null>(null);

  // Get syllabus data for semester
  const semSyllabus = useMemo(() => {
    return bitSyllabusData.find(s => s.semester === semesterNum) || bitSyllabusData[0];
  }, [semesterNum]);

  // Subject options
  const subjectList = useMemo(() => {
    return semSyllabus.subjects.map(s => s.name);
  }, [semSyllabus]);

  // Filtered past papers
  const filteredPapers = useMemo(() => {
    return bitPastPapersData.filter(p => {
      const matchSem = p.semester === semesterNum;
      const matchSub = selectedSubject === "all" || p.subject.toLowerCase() === selectedSubject.toLowerCase();
      return matchSem && matchSub;
    });
  }, [semesterNum, selectedSubject]);

  // Topics for semester
  const semTopics = useMemo(() => {
    const semData = bitNotesData[semesterNum] || {};
    const topicsArr: { subjectName: string; code: string; topic: any }[] = [];
    
    Object.values(semData).forEach(sub => {
      if (selectedSubject === "all" || sub.subjectName.toLowerCase() === selectedSubject.toLowerCase()) {
        sub.topics.forEach(top => {
          topicsArr.push({
            subjectName: sub.subjectName,
            code: sub.code,
            topic: top
          });
        });
      }
    });

    return topicsArr;
  }, [semesterNum, selectedSubject]);

  return (
    <div className="min-h-screen bg-mesh text-slate-900 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Semester Navigation Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
            <Link
              key={s}
              href={`/semester/${s}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                s === semesterNum
                  ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
              }`}
            >
              Semester {s}
            </Link>
          ))}
        </div>

        {/* Hero Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-black uppercase tracking-wider mb-2">
                <GraduationCap className="w-4 h-4" />
                <span>Purbanchal University (PU) BIT</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Semester {semesterNum} Repository
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">
                {filteredPapers.length} past question papers & {semTopics.length} high-yield topics available
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/notes"
                className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                <span>All Notes</span>
              </Link>
              <Link
                href="/syllabus"
                className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span>Full Syllabus</span>
              </Link>
            </div>
          </div>

          {/* Core Action Tabs */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveTab("past-questions")}
              className={`px-6 py-3 rounded-2xl font-black text-xs transition-all shadow-sm flex items-center gap-2 border ${
                activeTab === "past-questions"
                  ? "bg-teal-600 text-white border-teal-600 shadow-teal-600/20"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Past Questions Papers</span>
            </button>

            <button
              onClick={() => setActiveTab("important-topics")}
              className={`px-6 py-3 rounded-2xl font-black text-xs transition-all shadow-sm flex items-center gap-2 border ${
                activeTab === "important-topics"
                  ? "bg-teal-600 text-white border-teal-600 shadow-teal-600/20"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Important High-Yield Topics</span>
            </button>
          </div>
        </div>

        {/* Subject Filter Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Subject:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
          >
            <option value="all">All Subjects ({semSyllabus.subjects.length})</option>
            {subjectList.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        {/* TAB 1: Past Questions Papers */}
        {activeTab === "past-questions" && (
          <div className="space-y-6">
            {filteredPapers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPapers.map((paper, idx) => (
                  <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-teal-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-mono font-bold">
                          {paper.subjectCode}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                          Year {paper.year}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {paper.subject}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Purbanchal University Examination</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Full Marks</p>
                          <p className="text-xs font-black text-slate-800">{paper.totalMarks}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Pass Marks</p>
                          <p className="text-xs font-black text-slate-800">{paper.passMarks}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Duration</p>
                          <p className="text-xs font-black text-slate-800">{paper.timeHours} Hrs</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Sample Questions</p>
                        <div className="space-y-1.5">
                          {paper.questions.slice(0, 2).map((q, qIdx) => (
                            <div key={qIdx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 line-clamp-2">
                              <span className="font-bold text-teal-700 mr-1">Q{qIdx + 1}:</span>
                              {q.questionText}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedPaper(paper)}
                        className="text-xs font-bold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1.5"
                      >
                        <span>View Full Paper & Solutions</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-16 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-3">
                <FileText className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
                <h3 className="text-lg font-bold text-slate-900">No Past Questions Found for Selected Filter</h3>
                <p className="text-xs text-slate-500">Select "All Subjects" or check other semesters.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Important High-Yield Topics */}
        {activeTab === "important-topics" && (
          <div className="space-y-6">
            {semTopics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {semTopics.map((item, idx) => (
                  <motion.div
                    key={item.topic.id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-teal-500 shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                        {item.subjectName}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                        {item.topic.importance || "High Yield"}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{item.topic.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.topic.theory}</p>
                    </div>

                    {item.topic.keyPoints && item.topic.keyPoints.length > 0 && (
                      <div className="space-y-1.5 p-3 rounded-2xl bg-teal-50/50 border border-teal-100">
                        <p className="text-[10px] font-black uppercase text-teal-800 tracking-wider">Exam Highlights</p>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {item.topic.keyPoints.slice(0, 3).map((kp: string, kIdx: number) => (
                            <li key={kIdx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                              <span>{kp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2 flex justify-between items-center">
                      <Link
                        href="/notes"
                        className="text-xs font-bold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
                      >
                        <span>Open Code Sandbox</span>
                        <Code2 className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href="/flashcards"
                        className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 font-bold text-[11px] hover:bg-teal-100 transition-colors"
                      >
                        Drill Card
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-16 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-3">
                <Sparkles className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
                <h3 className="text-lg font-bold text-slate-900">No Topics Found</h3>
                <p className="text-xs text-slate-500">Check notes repository for all semester course notes.</p>
              </div>
            )}
          </div>
        )}

        {/* Paper Detail Modal */}
        {selectedPaper && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-2xl text-slate-800"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-mono font-bold text-xs">
                      {selectedPaper.subjectCode}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">Year {selectedPaper.year} Examination</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">{selectedPaper.subject}</h2>
                </div>
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase">Full Marks</span>
                  <p className="font-black text-slate-900 text-sm">{selectedPaper.totalMarks}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase">Pass Marks</span>
                  <p className="font-black text-slate-900 text-sm">{selectedPaper.passMarks}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase">Time Limit</span>
                  <p className="font-black text-slate-900 text-sm">{selectedPaper.timeHours} Hours</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Official Exam Questions & Solutions</h3>
                <div className="space-y-4">
                  {selectedPaper.questions.map((q, idx) => (
                    <div key={q.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-700">{q.group}</span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                          {q.marks} Marks
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                        <span className="text-teal-700 font-bold mr-1.5">Q{idx + 1}.</span>
                        {q.questionText}
                      </p>

                      {q.orQuestionText && (
                        <div className="pt-2 border-t border-slate-200 mt-2">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">OR</p>
                          <p className="text-xs sm:text-sm text-slate-700">{q.orQuestionText}</p>
                        </div>
                      )}

                      {q.solutionSummary && (
                        <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-100 space-y-1">
                          <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider">Solution / Marking Guide:</span>
                          <p className="text-xs text-slate-700 font-mono leading-relaxed">{q.solutionSummary}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center gap-3">
                <Link
                  href="/notes"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-all shadow-sm"
                >
                  Open Full Notes in Sandbox
                </Link>
                <Link
                  href="/flashcards"
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
                >
                  Review Flashcards
                </Link>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
