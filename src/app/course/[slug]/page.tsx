"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  Award, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Flame, 
  Cpu, 
  Calculator, 
  Zap, 
  Rocket, 
  Video,
  FileCheck2,
  Building2,
  Laptop,
  GraduationCap,
  Sparkles,
  Lock,
  PlayCircle,
  Folder,
  FolderOpen,
  ChevronDown,
  ShieldCheck,
  MessageCircle,
  Share2
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";

interface LectureUnit {
  id: string;
  title: string;
  duration: string;
  hasVideo: boolean;
  isLocked: boolean;
  type: "Video Included" | "MCQ Practice" | "Formula Notes";
  summary: string;
  keyPoints: string[];
}

interface SubjectSection {
  id: string;
  title: string;
  lecturesCount: number;
  icon: string;
  lectures: LectureUnit[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "sec-eng": true,
    "sec-it": false,
    "sec-math": false,
    "sec-live": false,
  });

  const [activeLecture, setActiveLecture] = useState<LectureUnit | null>(null);

  const toggleSection = (secId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [secId]: !prev[secId]
    }));
  };

  const sections: SubjectSection[] = [
    {
      id: "sec-eng",
      title: "English",
      lecturesCount: 9,
      icon: "BookOpen",
      lectures: [
        {
          id: "eng-1",
          title: "Practice Question & Diagnostic Assessment",
          duration: "22m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Comprehensive baseline assessment covering vocabulary, reading comprehension, and error identification.",
          keyPoints: ["Diagnostic analysis", "High-frequency question patterns", "Score benchmarking"]
        },
        {
          id: "eng-2",
          title: "Sentence Connectives & Conjunctions",
          duration: "34m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Mastering coordinating (FANBOYS), subordinating, and correlative conjunctions in sentence synthesis.",
          keyPoints: ["FANBOYS rules", "Subordinating adverbial clauses", "Compound vs Complex transitions"]
        },
        {
          id: "eng-3",
          title: "Prepositions & Phrasal Verbs - Part 1",
          duration: "28m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Spatial and temporal prepositions (in, on, at, by, upon) and tricky idiom combinations.",
          keyPoints: ["Prepositions of time & place", "Fixed preposition pairs", "Trap elimination techniques"]
        },
        {
          id: "eng-4",
          title: "Prepositions - Part 2 (Advanced Combinations)",
          duration: "30m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Advanced prepositional idioms and contextual sentence completion drills.",
          keyPoints: ["Dependent prepositions with adjectives/verbs", "Common entrance errors"]
        },
        {
          id: "eng-5",
          title: "Tenses & Conditional Clauses",
          duration: "36m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Sequence of tenses, hypothetical conditionals (Zero, 1st, 2nd, 3rd), and inversion structures.",
          keyPoints: ["Conditional types 0, 1, 2, 3", "Past perfect subjunctive", "Time markers"]
        },
        {
          id: "eng-6",
          title: "Parts of Speech & Word Transformations",
          duration: "25m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Nouns, pronouns, adjectives, adverbs, and gerunds vs participles.",
          keyPoints: ["Gerund vs Present Participle", "Adjective vs Adverb syntax", "Prefix/Suffix root derivations"]
        },
        {
          id: "eng-7",
          title: "Subject-Verb Agreement (Syntax Mastery)",
          duration: "31m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Singular/plural rules, collective nouns, proximity rule with either/or, and intervening phrases.",
          keyPoints: ["Rule of proximity", "Indefinite pronoun numbers", "Compound subjects"]
        },
        {
          id: "eng-8",
          title: "Synonyms and Antonyms - High Frequency Set",
          duration: "29m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Etymology, Latin and Greek roots, and contextual nuance matching.",
          keyPoints: ["Root words (chrono, bio, auto, tele)", "Contextual antonyms", "Negative prefix recognition"]
        },
        {
          id: "eng-9",
          title: "Stress, Intonation & Phonetics",
          duration: "24m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Primary and secondary word stress, syllable divisions, and vowel pronunciation rules.",
          keyPoints: ["2-syllable noun vs verb stress shift", "Suffix stress rules (-tion, -ic, -ity)", "Silent letters"]
        }
      ]
    },
    {
      id: "sec-it",
      title: "IT & Computer Fundamentals",
      lecturesCount: 10,
      icon: "Cpu",
      lectures: [
        {
          id: "it-1",
          title: "Introduction to Computer & Von Neumann Architecture",
          duration: "28m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Stored-program concept, CPU registers (PC, MAR, MDR, IR), ALU, and system buses.",
          keyPoints: ["Von Neumann vs Harvard", "Instruction Cycle (Fetch-Decode-Execute)", "Bus architecture"]
        },
        {
          id: "it-2",
          title: "Generations of Computer & Hardware Evolution",
          duration: "26m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Vacuum tubes, transistors, ICs, VLSI, and AI-era parallel computing architectures.",
          keyPoints: ["1st to 5th generations", "Core component transitions", "Speed & power metrics"]
        },
        {
          id: "it-3",
          title: "Computer Fundamentals & Memory Hierarchy",
          duration: "35m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Primary (RAM, ROM, Cache, Registers) vs Secondary (SSD, HDD, NVMe) memory systems.",
          keyPoints: ["SRAM vs DRAM", "Cache L1/L2/L3 access latency", "Virtual memory paging"]
        },
        {
          id: "it-4",
          title: "High-Yield IT Entrance MCQs Practice",
          duration: "40m",
          hasVideo: true,
          isLocked: false,
          type: "MCQ Practice",
          summary: "Timed interactive problem-solving session with 50 high-frequency computing questions.",
          keyPoints: ["Speed solving techniques", "Option elimination", "Common trap analysis"]
        },
        {
          id: "it-5",
          title: "Application Packages & System Software",
          duration: "27m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Compilers, interpreters, assemblers, linkers, loaders, and productivity software.",
          keyPoints: ["Compiler vs Interpreter differences", "OS kernel roles", "Device drivers"]
        },
        {
          id: "it-6",
          title: "Computer Networks & OSI 7-Layer Model",
          duration: "38m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Physical, Data Link, Network, Transport, Session, Presentation, Application layers.",
          keyPoints: ["OSI vs TCP/IP", "IP addressing (IPv4 vs IPv6)", "Topologies (Star, Mesh, Ring)"]
        },
        {
          id: "it-7",
          title: "Networking MCQs Practice Session",
          duration: "32m",
          hasVideo: true,
          isLocked: false,
          type: "MCQ Practice",
          summary: "Targeted problem set on ports, protocols (HTTP, DNS, TCP, UDP), and subnetting.",
          keyPoints: ["Well-known port numbers", "TCP 3-way handshake", "Subnet masks"]
        },
        {
          id: "it-8",
          title: "System Analysis and Design (SDLC)",
          duration: "30m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Waterfall, Agile, Spiral, prototyping models, DFDs, and ER diagrams.",
          keyPoints: ["SDLC phases", "DFD Level 0/1 conventions", "Agile sprint cycles"]
        },
        {
          id: "it-9",
          title: "Database Management Systems (DBMS)",
          duration: "36m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Relational schema, primary/foreign keys, ACID transactions, and SQL queries.",
          keyPoints: ["ACID properties", "Keys & constraints", "Normalization (1NF to 3NF)"]
        },
        {
          id: "it-10",
          title: "Number Systems, 2's Complement & Boolean Logic MCQs",
          duration: "42m",
          hasVideo: true,
          isLocked: false,
          type: "MCQ Practice",
          summary: "Binary, octal, hexadecimal radix conversions, Boolean theorems, and logic gates.",
          keyPoints: ["2's complement arithmetic", "De Morgan's Laws", "Universal NAND/NOR gates"]
        }
      ]
    },
    {
      id: "sec-math",
      title: "Entrance Mathematics",
      lecturesCount: 13,
      icon: "Calculator",
      lectures: [
        {
          id: "math-1",
          title: "Practice Questions & Baseline Diagnostic",
          duration: "30m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "High-speed algebraic and trigonometric diagnostic problem drills.",
          keyPoints: ["Formula checklists", "Time management shortcuts"]
        },
        {
          id: "math-2",
          title: "Matrices & Determinants - Part 1",
          duration: "38m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Matrix multiplication conditions, transpose properties, symmetric and skew-symmetric matrices.",
          keyPoints: ["Matrix properties", "Determinant row/column operations"]
        },
        {
          id: "math-3",
          title: "Inverse Matrix & Adjoint Method",
          duration: "35m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Cofactors, adj(A), inverse A^-1 = adj(A)/|A|, and Cramer's rule for linear systems.",
          keyPoints: ["Adjoint formulas", "Cramer's Determinants (D, Dx, Dy, Dz)"]
        },
        {
          id: "math-4",
          title: "Trigonometric Ratios & Compound Angles",
          duration: "40m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Multiple and sub-multiple angle formulas, transformation of sums into products.",
          keyPoints: ["sin(A±B), cos(A±B)", "tan(2A) identities", "Maximum/minimum trigonometric values"]
        },
        {
          id: "math-5",
          title: "Inverse Trigonometric Functions",
          duration: "36m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Principal value branches, domain and range, tan^-1(x) + tan^-1(y) addition formulas.",
          keyPoints: ["Principal ranges", "Addition & subtraction identities"]
        },
        {
          id: "math-6",
          title: "Complex Numbers & De Moivre's Theorem",
          duration: "44m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Modulus, argument, polar and Euler forms, cube roots of unity (1, ω, ω^2).",
          keyPoints: ["1 + ω + ω^2 = 0", "Euler form e^(iθ)", "De Moivre powers"]
        }
      ]
    },
    {
      id: "sec-live",
      title: "IOE | CSIT | BIT Live Masterclasses",
      lecturesCount: 33,
      icon: "Zap",
      lectures: [
        {
          id: "live-1",
          title: "Comprehensive Entrance Problem Solving Workshop",
          duration: "65m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Integrated cross-subject problem solving marathon recorded live from Bagbazar classroom.",
          keyPoints: ["Mixed-subject entrance drills", "Time-saving estimation tricks"]
        },
        {
          id: "live-2",
          title: "Physics & Mechanics Master Session",
          duration: "70m",
          hasVideo: true,
          isLocked: false,
          type: "Video Included",
          summary: "Projectile motion, circular dynamics, rotational moment of inertia, and gravitation.",
          keyPoints: ["Conservation of angular momentum", "Escape velocity formulas"]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-mesh text-slate-900 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Breadcrumb Strip */}
        <nav aria-label="breadcrumb">
          <ol className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <li><Link href="/" className="hover:text-orange-600 transition-colors">Home</Link></li>
            <li><span>/</span></li>
            <li><Link href="/learn" className="hover:text-orange-600 transition-colors">Courses</Link></li>
            <li><span>/</span></li>
            <li className="text-slate-900 font-black">BIT</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col: Info */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-black uppercase tracking-widest">
                <Award className="w-4 h-4 text-orange-600" />
                <span>Entrance Program</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                BIT <span className="text-gradient">Entrance Preparation</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                Complete structured preparation program with top-notch video lectures, high-yield concept summaries, formula handbooks, and live timed test simulators.
              </p>

              {/* Stats Strip */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>4 Core Subjects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-orange-600" />
                  <span>65 Video Lectures</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Secured MCQ Exams</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  <span>Bagbazar & Online</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/exams"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <Rocket className="w-4 h-4" />
                  Attempt Live CBT Mock Test
                </Link>
                <Link
                  href="/semester/1"
                  className="px-8 py-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  Semester 1 Question Bank
                </Link>
              </div>
            </div>

            {/* Right Col: Course Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-md hover:shadow-lg transition-all space-y-5 p-6">
                
                {/* Course Banner Box */}
                <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 flex flex-col justify-between shadow-inner relative overflow-hidden">
                  <div className="space-y-1 relative z-10">
                    <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                      Purbanchal & TU Focused
                    </span>
                    <h3 className="text-2xl font-black">BIT Masterclass</h3>
                    <p className="text-xs text-blue-100">Full Video Curriculum & Question Simulator</p>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold relative z-10 pt-2 border-t border-white/20">
                    <span>65 Video Modules</span>
                    <span>100% Free Access</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-black text-slate-900">What&apos;s Included in this Course:</h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Full syllabus coverage across English, Math, IT & Logic</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>65 high-definition chapter-by-chapter video lessons</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Real computer-based test (CBT) simulator with instant analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Downloadable formula sheets & high-yield revision notes</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <a
                    href="https://wa.me/9779761499683"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    Chat with Counselor on WhatsApp
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Curriculum Syllabus Accordion Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-orange-600">Syllabus Explorer</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
                <GraduationCap className="w-7 h-7 text-blue-600" />
                Course Curriculum Syllabus
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-bold hidden sm:inline-block">
              Click any lecture to preview key concepts
            </span>
          </div>

          <div className="space-y-4">
            {sections.map((sec) => {
              const isOpen = expandedSections[sec.id];
              return (
                <div 
                  key={sec.id}
                  className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-all"
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleSection(sec.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                        {isOpen ? <FolderOpen className="w-5 h-5" /> : <Folder className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{sec.title}</h3>
                        <p className="text-xs text-slate-500">{sec.lecturesCount} Structured Modules</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                        {sec.lectures.length} Lectures
                      </span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-orange-600" : ""}`} />
                    </div>
                  </button>

                  {/* Accordion Body */}
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-3 bg-slate-50/50">
                      {sec.lectures.map((lec, idx) => (
                        <div
                          key={lec.id}
                          onClick={() => setActiveLecture(lec)}
                          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-orange-400 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs group"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 group-hover:text-orange-600 transition-colors">
                              {idx + 1}
                            </div>
                            <div>
                              <h4 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-slate-900 transition-colors flex items-center gap-2">
                                {lec.title}
                              </h4>
                              <p className="text-xs text-slate-500 line-clamp-1">{lec.summary}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto text-xs text-slate-500">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {lec.duration}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              lec.type === "MCQ Practice"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}>
                              {lec.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Lecture Concept Review Modal */}
        {activeLecture && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-2xl text-slate-800"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-black uppercase text-orange-600">Lecture Concept Summary</span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{activeLecture.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Estimated Duration: {activeLecture.duration}</p>
                </div>
                <button
                  onClick={() => setActiveLecture(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all"
                >
                  Close
                </button>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">{activeLecture.summary}</p>

              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Core High-Yield Highlights</h4>
                <div className="space-y-2">
                  {activeLecture.keyPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center gap-3">
                <Link
                  href="/flashcards"
                  className="text-xs font-bold text-teal-700 hover:text-teal-800"
                >
                  Practice Flashcards
                </Link>
                <Link
                  href="/exams"
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-sm"
                >
                  Launch Timed MCQ Test
                </Link>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
