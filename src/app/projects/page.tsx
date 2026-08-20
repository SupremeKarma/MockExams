"use client";

import { motion } from "framer-motion";
import { 
  Code2, 
  Search, 
  Layers, 
  GraduationCap, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Cpu, 
  ShieldCheck, 
  Smartphone, 
  Cloud, 
  Database,
  HelpCircle,
  FolderGit2
} from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { bitProjectsData, BitProject } from "@/data/bitProjectsData";

const CATEGORIES = [
  "All",
  "AI & Machine Learning",
  "Web & Fullstack",
  "IoT & Embedded",
  "Mobile Apps",
  "Cybersecurity & Blockchain"
];

export default function ProjectsPage() {
  const [selectedSemester, setSelectedSemester] = useState<number | "All">("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<BitProject | null>(null);

  const filteredProjects = useMemo(() => {
    return bitProjectsData.filter((p) => {
      const matchSemester = selectedSemester === "All" || p.semester === selectedSemester;
      const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchQuery = !searchQuery.trim() || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSemester && matchCategory && matchQuery;
    });
  }, [selectedSemester, selectedCategory, searchQuery]);

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Advanced":
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">Advanced</span>;
      case "Intermediate":
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">Intermediate</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">Beginner</span>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "AI & Machine Learning":
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case "IoT & Embedded":
        return <Cpu className="w-4 h-4 text-amber-400" />;
      case "Cybersecurity & Blockchain":
        return <ShieldCheck className="w-4 h-4 text-rose-400" />;
      case "Mobile Apps":
        return <Smartphone className="w-4 h-4 text-cyan-400" />;
      default:
        return <Code2 className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-mesh text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Hero Header */}
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-cyan-950/40 backdrop-blur-xl shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest">
              <FolderGit2 className="w-4 h-4" />
              <span>Purbanchal University BIT Projects Hub</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Semester Project <br />
              <span className="text-gradient">Ideas & Blueprints</span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
              Curated minor and capstone projects with suggested system architectures, tech stacks, core feature sets, and frequent viva-voce questions.
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects or tech stacks..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 shadow-md"
              />
            </div>

            {/* Semester Filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 w-full md:w-auto scrollbar-none">
              <button
                onClick={() => setSelectedSemester("All")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  selectedSemester === "All"
                    ? "bg-cyan-600 text-white shadow-lg"
                    : "bg-slate-900/60 text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                All Semesters
              </button>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                    selectedSemester === sem
                      ? "bg-cyan-600 text-white shadow-lg"
                      : "bg-slate-900/60 text-slate-400 hover:text-white border border-white/5"
                  }`}
                >
                  Sem {sem}
                </button>
              ))}
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? "bg-slate-100 text-slate-950 border-white shadow-md"
                    : "bg-slate-900/50 text-slate-400 hover:text-white border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj, idx) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 shadow-xl group hover:shadow-cyan-500/10"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-white/5 text-xs text-slate-300">
                    {getCategoryIcon(proj.category)}
                    <span>{proj.category}</span>
                  </div>
                  {getDifficultyBadge(proj.difficulty)}
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-400">Semester {proj.semester} Project</span>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">{proj.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">{proj.description}</p>
                </div>

                {/* Tech Stacks */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.techStack.map((tech) => (
                    <span key={tech} className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-white/5 text-[11px] font-mono text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
                <button
                  onClick={() => setSelectedProject(proj)}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5 transition-colors"
                >
                  View Blueprint & Viva FAQs
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xl text-slate-200"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase text-cyan-400">Semester {selectedProject.semester} • {selectedProject.category}</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedProject.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all"
                >
                  Close
                </button>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{selectedProject.description}</p>

              {/* Architecture Blueprint */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  System Architecture Overview
                </h4>
                <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">{selectedProject.architectureOverview}</p>
              </div>

              {/* Core Features */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Key Functional Modules</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedProject.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/40 border border-white/5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Viva Questions */}
              <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Expected Viva-Voce Defense Questions
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {selectedProject.vivaQuestions.map((q, qIdx) => (
                    <li key={qIdx} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">Q{qIdx + 1}:</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
