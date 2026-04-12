"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  GraduationCap, 
  Search, 
  Filter, 
  PlayCircle, 
  Clock, 
  Award, 
  BarChart3,
  Bookmark,
  ChevronRight,
  TrendingUp,
  Brain,
  Video,
  FileText,
  Star
} from "lucide-react";
import Link from "next/link";
import React, { useState, cloneElement } from "react";

const CATEGORIES = [
  "All Subjects",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Science",
  "English",
  "Applied Mechanics"
];

const COURSES = [
  {
    id: 1,
    title: "Complete IOE Entrance Preparation",
    category: "Entrance",
    instructor: "Er. Sandesh Shrestha",
    lessons: 48,
    duration: "24h 30m",
    rating: 4.9,
    reviews: 1240,
    image: "/course-math.jpg",
    level: "Advanced",
    progress: 65,
    isTrending: true
  },
  {
    id: 2,
    title: "Engineering Mathematics II: Mastery",
    category: "Mathematics",
    instructor: "Dr. Ramesh Pariyar",
    lessons: 32,
    duration: "18h 15m",
    rating: 4.8,
    reviews: 850,
    image: "/course-phy.jpg",
    level: "Intermediate",
    progress: 12
  },
  {
    id: 3,
    title: "Physics Mechanics Special Course",
    category: "Physics",
    instructor: "Er. Anil Thapa",
    lessons: 24,
    duration: "12h 45m",
    rating: 4.7,
    reviews: 620,
    image: "/course-chem.jpg",
    level: "All Levels",
  }
];

export default function LearnPage() {
  const [activeCategory, setActiveCategory] = useState("All Subjects");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-mesh pb-20 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-4">
              <GraduationCap className="w-4 h-4" />
              <span>Learning Center</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
              Expand Your <br />
              <span className="text-gradient">Knowledge Base.</span>
            </h1>
            <p className="text-slate-400 max-w-xl font-medium leading-relaxed">
              Curated courses and study materials designed to complement your mock exam practice. Level up your weak areas with expert-led content.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col sm:flex-row gap-4 w-full md:w-auto"
          >
            <div className="relative group flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Search courses, topics..."
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-slate-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="px-6 py-4 glass border-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </motion.div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <QuickStat icon={<PlayCircle />} label="Course Progress" value="12 Courses" color="text-primary" />
          <QuickStat icon={<Clock />} label="Study Hours" value="48.5h" color="text-amber-400" />
          <QuickStat icon={<Award />} label="Certificates" value="3 Earned" color="text-emerald-400" />
          <QuickStat icon={<BarChart3 />} label="Skill Rank" value="Top 5%" color="text-rose-400" />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card p-6 rounded-3xl border-white/10 border">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500 mb-6 px-2">Disciplines</h3>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                      activeCategory === cat 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {cat}
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeCategory === cat ? "translate-x-1" : "opacity-0 group-hover:opacity-100"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
              <div className="relative z-10">
                <Brain className="w-10 h-10 mb-6 opacity-80" />
                <h3 className="text-xl font-black mb-2">Smart Study AI</h3>
                <p className="text-indigo-100 text-xs font-medium leading-relaxed mb-6">
                  Let our AI analyze your mock exam performance and recommend the perfect courses for you.
                </p>
                <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-sm hover:bg-slate-50 transition-all border-b-4 border-slate-200">
                  Enable AI Tutor
                </button>
              </div>
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Main Course Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <TrendingUp className="text-primary w-6 h-6" />
                Recommended for You
              </h2>
              <Link href="#" className="text-sm font-bold text-primary hover:underline">View all courses</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {COURSES.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function CourseCard({ course }: { course: any }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card rounded-[2.5rem] overflow-hidden border border-white/10 flex flex-col group h-full"
    >
      <div className="relative aspect-video bg-white/5 overflow-hidden">
        {/* Placeholder for image */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
           <Video className="w-12 h-12 text-white/10 group-hover:scale-110 transition-transform duration-500" />
        </div>
        
        {course.isTrending && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-tighter shadow-lg">
            Trending
          </div>
        )}
        
        <button className="absolute top-4 right-4 p-3 rounded-2xl glass border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
          <Bookmark className="w-5 h-5" />
        </button>

        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-widest">
            <span className="px-2 py-0.5 rounded bg-primary/20 border border-primary/30 text-white">{course.category}</span>
            <span>•</span>
            <span>{course.level}</span>
          </div>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-4 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-white/10" />
          <span className="text-sm text-slate-400 font-medium">{course.instructor}</span>
          <div className="ml-auto flex items-center gap-1 text-amber-400 font-black text-sm">
            <Star className="w-4 h-4 fill-current" />
            {course.rating}
          </div>
        </div>

        {course.progress !== undefined && (
          <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
              <span className="text-slate-500">Progress</span>
              <span className="text-white">{course.progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${course.progress}%` }} />
            </div>
          </div>
        )}

        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-widest underline decoration-white/5 underline-offset-4">
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> {course.lessons}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {course.duration}
            </div>
          </div>
          
          <button className="p-3 bg-white text-black rounded-2xl hover:bg-slate-200 transition-all shadow-lg active:scale-95 flex items-center justify-center">
            <PlayCircle className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function QuickStat({ icon, label, value, color }: any) {
  return (
    <div className="glass-card p-6 rounded-3xl border border-white/10 flex items-center gap-6 group hover:border-white/20 transition-all">
      <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${color}`}>
        {cloneElement(icon, { className: "w-7 h-7" })}
      </div>
      <div>
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-xl font-black text-white">{value}</h4>
      </div>
    </div>
  );
}
