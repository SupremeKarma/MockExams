"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Globe2, 
  Building2, 
  ChevronDown,
  ArrowRight,
  GraduationCap,
  Loader2,
  AlertCircle,
  Clock,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// High-level filter configuration
const COUNTRIES = [
  "Global (All)", "Nepal", "India", "USA", "UK", "Australia"
];

const EDUCATION_LEVELS = [
  { id: "all", name: "All Levels", icon: Globe2 },
  { id: "early-childhood", name: "Early Childhood (Pre-K to Grade 5)", icon: Building2 },
  { id: "middle-school", name: "Middle School (Grades 6-8)", icon: Building2 },
  { id: "high-school", name: "High School & Boards (SEE/NEB/CBSE)", icon: GraduationCap },
  { id: "university-entrance", name: "University Entrance (IOE/CEE/SAT/JEE)", icon: Building2 },
  { id: "professional", name: "Professional & Licensing (Medical/Engineering)", icon: Briefcase },
  { id: "government", name: "Government & Public Service (Lok Sewa)", icon: Building2 },
  { id: "corporate", name: "Corporate Certifications (IT/Management)", icon: Building2 },
  { id: "senior", name: "Senior Cognitive & Lifelong", icon: Clock },
];

export default function GlobalExamsPortal() {
  const [activeCountry, setActiveCountry] = useState("Nepal"); // Default to Nepal since it's the target market
  const [activeLevel, setActiveLevel] = useState("university-entrance");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const MOCK_EXAMS = [
    {
      id: "real-ioe-entrance",
      title: "IOE Entrance Model Exam 2081",
      category: "University Entrance",
      difficulty: "Hard",
      price: "Free Access",
      is_published: true,
      country: "Nepal",
      level: "university-entrance",
      is_featured: true
    },
    {
      id: "neb-physics-12",
      title: "NEB Grade 12 Physics Final Prep",
      category: "High School & Boards",
      difficulty: "Medium",
      price: "Premium",
      is_published: true,
      country: "Nepal",
      level: "high-school"
    },
    {
      id: "neb-math-12",
      title: "NEB Grade 12 Mathematics Mock",
      category: "High School & Boards",
      difficulty: "Hard",
      price: "Free Access",
      is_published: true,
      country: "Nepal",
      level: "high-school"
    },
    {
      id: "iom-mbbs-mock",
      title: "IOM MBBS Entrance Mock Test",
      category: "University Entrance",
      difficulty: "Hard",
      price: "Premium",
      is_published: true,
      country: "Nepal",
      level: "university-entrance"
    },
    {
      id: "sat-practice-1",
      title: "SAT Digital Practice Test 1",
      category: "University Entrance",
      difficulty: "Medium",
      price: "Free Access",
      is_published: true,
      country: "USA",
      level: "university-entrance"
    },
    {
      id: "ielts-academic-mock",
      title: "IELTS Academic Full Mock Test",
      category: "Professional & Licensing",
      difficulty: "Medium",
      price: "Premium",
      is_published: true,
      country: "UK",
      level: "professional"
    },
    {
      id: "upsc-prelims-gs",
      title: "UPSC Prelims General Studies (Mock 1)",
      category: "Government & Public Service",
      difficulty: "Hard",
      price: "Free Access",
      is_published: true,
      country: "India",
      level: "government"
    },
    {
      id: "lok-sewa-kharidar",
      title: "Lok Sewa Aayog Kharidar Mock",
      category: "Government & Public Service",
      difficulty: "Hard",
      price: "Premium",
      is_published: true,
      country: "Nepal",
      level: "government"
    },
    {
      id: "see-comp-science",
      title: "SEE Computer Science Board Prep",
      category: "High School & Boards",
      difficulty: "Easy",
      price: "Free Access",
      is_published: true,
      country: "Nepal",
      level: "high-school"
    },
    {
      id: "jee-mains-phys",
      title: "JEE Mains Physics Mock 2024",
      category: "University Entrance",
      difficulty: "Hard",
      price: "Premium",
      is_published: true,
      country: "India",
      level: "university-entrance"
    },
    {
      id: "mcat-full-length",
      title: "MCAT Biology & Biochem Foundation",
      category: "University Entrance",
      difficulty: "Hard",
      price: "Premium",
      is_published: true,
      country: "USA",
      level: "university-entrance"
    },
    {
      id: "pte-scored-practice",
      title: "PTE Pearson Official Mock B",
      category: "Professional & Licensing",
      difficulty: "Medium",
      price: "Premium",
      is_published: true,
      country: "Australia",
      level: "professional"
    },
    {
      id: "medical-licensing-nepal",
      title: "NMC Licensing Exam Prep",
      category: "Professional & Licensing",
      difficulty: "Hard",
      price: "Premium",
      is_published: true,
      country: "Nepal",
      level: "professional"
    },
    {
      id: "gre-quant-reasoning",
      title: "GRE Quantitative Reasoning Mastery",
      category: "University Entrance",
      difficulty: "Hard",
      price: "Premium",
      is_published: true,
      country: "Global (All)",
      level: "university-entrance"
    },
    {
      id: "gmat-data-insights",
      title: "GMAT Focus Edition: Data Insights",
      category: "University Entrance",
      difficulty: "Hard",
      price: "Premium",
      is_published: true,
      country: "Global (All)",
      level: "university-entrance"
    },
    {
      id: "nclex-rn-sim",
      title: "NCLEX-RN Adaptive Simulation",
      category: "Professional & Licensing",
      difficulty: "Hard",
      price: "Premium",
      is_published: true,
      country: "Global (All)",
      level: "professional"
    },
    {
      id: "bar-exam-mbe",
      title: "Multistate Bar Exam (MBE) Prep",
      category: "Professional & Licensing",
      difficulty: "Hardest",
      price: "Premium",
      is_published: true,
      country: "USA",
      level: "professional"
    },
    {
      id: "toefl-ibt-reading",
      title: "TOEFL iBT Reading & Listening",
      category: "Professional & Licensing",
      difficulty: "Medium",
      price: "Free Access",
      is_published: true,
      country: "Global (All)",
      level: "professional"
    }
  ];

  useEffect(() => {
    async function fetchExams() {
      setLoading(true);
      try {
        const examsRef = collection(db, "exams");
        const q = query(examsRef, where("is_published", "==", true));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setExams(data);
      } catch (err) {
        console.error("Error fetching exams:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchExams();
  }, []);

  // Soft-filtering on client side to handle legacy DB structure without breaking
  const filteredExams = [...MOCK_EXAMS, ...exams].filter(exam => {
    const matchesSearch = exam.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (exam.category && exam.category.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCountry = activeCountry === "Global (All)" || exam.country === activeCountry || !exam.country;
    const matchesLevel = activeLevel === "all" || exam.level === activeLevel || !exam.level;

    return matchesSearch && matchesCountry && matchesLevel;
  });

  return (
    <div className="w-full min-h-screen bg-slate-950">
      {/* 🚀 Giant Global Hero */}
      <div className="bg-slate-900 border-b border-slate-800 pt-16 pb-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700 text-slate-300 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 shadow-inner">
            <Globe2 className="w-4 h-4 text-primary" />
            <span>The World's Exam Authority</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-white max-w-4xl">
            One platform. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Every certification.</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-12">
            Select your country and educational demographic to discover standardized tests, local board exams, 
            university entrances, and professional licenses tailored exclusively to your jurisdiction.
          </p>

          {/* 🌍 Jurisdiction Selectors */}
          <div className="w-full max-w-3xl flex flex-col sm:flex-row gap-4 bg-slate-950 p-4 rounded-3xl border border-slate-800 shadow-2xl">
            
            {/* Country Dropdown */}
            <div className="relative w-full sm:w-1/3">
              <button 
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="w-full flex items-center justify-between px-6 py-4 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-2xl text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Jurisdiction</span>
                    <span className="font-bold text-white leading-none">{activeCountry}</span>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCountryDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full lg:left-0 left-0 right-0 mt-3 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    {COUNTRIES.map(country => (
                      <button
                        key={country}
                        onClick={() => { setActiveCountry(country); setIsCountryDropdownOpen(false); }}
                        className={`w-full flex items-center pl-12 pr-6 py-4 text-left transition-colors font-bold ${activeCountry === country ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-slate-300 hover:bg-slate-800 border-l-4 border-transparent'}`}
                      >
                        {country}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Global Search */}
            <div className="relative w-full sm:w-2/3">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search specific exam, e.g. 'IOE Entrance'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full pl-14 pr-6 py-5 sm:py-0 bg-slate-900 border border-slate-700 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-white font-medium"
              />
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* 📚 Left Sidebar: Education Tiers */}
        <div className="w-full lg:w-1/4 shrink-0">
          <div className="sticky top-28 bg-slate-900 p-6 rounded-[2rem] border border-slate-800">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 px-2">Educational Pipeline</h3>
            <div className="flex flex-col gap-2">
              {EDUCATION_LEVELS.map(level => {
                const Icon = level.icon;
                const isActive = activeLevel === level.id;
                return (
                  <button
                    key={level.id}
                    onClick={() => setActiveLevel(level.id)}
                    className={`flex items-start gap-3 p-4 rounded-2xl text-left transition-all group ${
                      isActive 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "hover:bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${isActive ? "text-white" : "text-slate-500 group-hover:text-white"}`} />
                    <span className="font-bold text-sm leading-tight">{level.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 📊 Right Content: Exam Repository */}
        <div className="w-full lg:w-3/4">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {EDUCATION_LEVELS.find(l => l.id === activeLevel)?.name.split("(")[0]}
              </h2>
              <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Showing exams relevant to {activeCountry}
              </p>
            </div>
            <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold text-slate-300">
              {filteredExams.length} Exams Listed
            </div>
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-6 bg-slate-900 rounded-[2rem] border border-dashed border-slate-800">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-slate-400 font-bold">Querying the global registry...</p>
            </div>
          ) : filteredExams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredExams.map((exam) => (
                <ExamCard 
                  key={exam.id}
                  id={exam.id}
                  title={exam.title}
                  category={exam.category || "General"}
                  difficulty={exam.difficulty || "Medium"}
                  price={exam.price === 0 ? "Free Access" : "Premium"}
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center bg-slate-900 rounded-[2rem] border border-slate-800 flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-950 rounded-full flex items-center justify-center mb-6 border border-slate-800">
                <AlertCircle className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">No Exams Registered Yet</h3>
              <p className="text-slate-400 max-w-sm mb-8">
                We are actively adding new exams for <span className="text-white font-bold">{activeCountry}</span> in this educational tier.
              </p>
              <button onClick={() => { setSearchQuery(""); setActiveLevel("all"); }} className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all shadow-xl">
                Browse All Global Exams
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------
// Specialized Exam Card
// ----------------------------------------------------

interface ExamCardProps {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  price: string;
}

function ExamCard({ id, title, category, difficulty, price }: ExamCardProps) {
  return (
    <Link href={`/exams/${id}/take`}>
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className="bg-slate-900 flex flex-col p-8 rounded-[2rem] border border-slate-800 hover:border-primary/50 hover:bg-slate-800/80 transition-all cursor-pointer h-full shadow-lg"
      >
        <div className="flex items-start justify-between mb-6">
          <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${
            difficulty.toLowerCase() === "hard" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : 
            difficulty.toLowerCase() === "medium" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : 
            "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
          }`}>
            {difficulty}
          </span>
          <span className="text-sm font-black text-slate-300">
            {price}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold mb-4 text-white leading-tight">
          {title}
        </h3>
        
        <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {category}
          </span>
          
          <div className="flex items-center gap-2 text-primary font-bold text-sm hover:translate-x-1 transition-transform">
            Start Exam <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
