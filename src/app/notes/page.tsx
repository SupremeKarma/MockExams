"use client";

import { motion } from "framer-motion";
import { 
  Book, 
  Search, 
  FileText, 
  Download, 
  Eye, 
  Filter, 
  Bookmark,
  ChevronRight,
  Star,
  Clock,
  Layers
} from "lucide-react";
import { useState } from "react";

// Mock data for the template
const CATEGORIES = ["All", "Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "Engineering", "Medicine"];

const RESOURCES = [
  {
    id: "1",
    title: "Quantum Physics: A Modern Introduction",
    author: "Dr. Elena Vance",
    type: "Book",
    format: "PDF",
    category: "Physics",
    rating: 4.8,
    downloads: "1.2k",
    date: "2024-03-15",
    color: "from-blue-500/20 to-indigo-500/20",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "2",
    title: "Organic Chemistry Mechanism Cheat Sheet",
    author: "Prof. Michael Chen",
    type: "Notes",
    format: "PDF",
    category: "Chemistry",
    rating: 4.9,
    downloads: "2.5k",
    date: "2024-02-28",
    color: "from-emerald-500/20 to-teal-500/20",
    image: "https://images.unsplash.com/photo-1603126738553-690559eb8a18?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "3",
    title: "Advanced Calculus: Solved Problems",
    author: "Sarah Jenkins",
    type: "Notes",
    format: "EPUB",
    category: "Mathematics",
    rating: 4.7,
    downloads: "850",
    date: "2024-03-10",
    color: "from-purple-500/20 to-pink-500/20",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "4",
    title: "Data Structures & Algorithms in Java",
    author: "Robert Sedgewick",
    type: "Book",
    format: "PDF",
    category: "Computer Science",
    rating: 4.9,
    downloads: "5.1k",
    date: "2023-11-20",
    color: "from-orange-500/20 to-red-500/20",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "5",
    title: "Cell Biology & Genetics: Semester 1",
    author: "University Notes",
    type: "Notes",
    format: "PDF",
    category: "Biology",
    rating: 4.5,
    downloads: "1.8k",
    date: "2024-01-05",
    color: "from-lime-500/20 to-green-500/20",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "6",
    title: "Structural Engineering Handbook",
    author: "Edwin H. Gaylord",
    type: "Book",
    format: "PDF",
    category: "Engineering",
    rating: 4.6,
    downloads: "620",
    date: "2023-12-12",
    color: "from-cyan-500/20 to-blue-500/20",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "7",
    title: "Medical Biochemistry: Key Diagrams",
    author: "Dr. S. K. Mahato",
    type: "Notes",
    format: "PDF",
    category: "Medicine",
    rating: 4.9,
    downloads: "3.2k",
    date: "2024-03-20",
    color: "from-rose-500/20 to-orange-500/20",
    image: "https://images.unsplash.com/photo-1579152276502-5423bc46b737?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "8",
    title: "Introduction to Algorithms",
    author: "CLRS",
    type: "Book",
    format: "PDF",
    category: "Computer Science",
    rating: 5.0,
    downloads: "10k+",
    date: "2023-05-15",
    color: "from-blue-600/20 to-indigo-600/20",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "9",
    title: "Nepal's Constitution: Notes for Lok Sewa",
    author: "Public Service Prep",
    type: "Notes",
    format: "PDF",
    category: "Other",
    rating: 4.7,
    downloads: "4.1k",
    date: "2024-02-10",
    color: "from-red-500/20 to-amber-500/20",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "10",
    title: "Discrete Mathematics & Its Applications",
    author: "Kenneth Rosen",
    type: "Book",
    format: "EPUB",
    category: "Mathematics",
    rating: 4.8,
    downloads: "2.8k",
    date: "2023-09-22",
    color: "from-emerald-500/20 to-cyan-500/20",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "11",
    title: "Pathology Core Concepts for MBBS",
    author: "Dr. Anjali Verma",
    type: "Notes",
    format: "PDF",
    category: "Medicine",
    rating: 4.6,
    downloads: "1.5k",
    date: "2024-03-01",
    color: "from-purple-500/20 to-pink-500/20",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "12",
    title: "Civil Engineering Estimation & Costing",
    author: "B. N. Dutta",
    type: "Book",
    format: "PDF",
    category: "Engineering",
    rating: 4.7,
    downloads: "1.2k",
    date: "2023-11-30",
    color: "from-slate-500/20 to-blue-500/20",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb1930060?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "13",
    title: "General Knowledge for Lok Sewa 2081",
    author: "K. P. Oli (Mock)",
    type: "Book",
    format: "PDF",
    category: "Other",
    rating: 4.5,
    downloads: "8.5k",
    date: "2024-01-20",
    color: "from-amber-600/20 to-red-600/20",
    image: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "14",
    title: "Signals and Systems: Handwritten Notes",
    author: "Aman Mahato",
    type: "Notes",
    format: "PDF",
    category: "Engineering",
    rating: 5.0,
    downloads: "3.4k",
    date: "2024-03-25",
    color: "from-indigo-600/20 to-purple-600/20",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "15",
    title: "Molecular Basis of Inheritance",
    author: "Biology Hub",
    type: "Notes",
    format: "PDF",
    category: "Biology",
    rating: 4.7,
    downloads: "1.1k",
    date: "2024-02-15",
    color: "from-green-600/20 to-teal-600/20",
    image: "https://images.unsplash.com/photo-1532187863486-abf9d3a44462?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "16",
    title: "University Physics with Modern Physics",
    author: "Young & Freedman",
    type: "Book",
    format: "PDF",
    category: "Physics",
    rating: 4.9,
    downloads: "15k+",
    date: "2023-01-01",
    color: "from-blue-700/20 to-cyan-700/20",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "17",
    title: "Abstract Algebra: Course Companion",
    author: "Prof. S. R. Srinivasan",
    type: "Book",
    format: "PDF",
    category: "Mathematics",
    rating: 4.6,
    downloads: "450",
    date: "2023-11-15",
    color: "from-fuchsia-600/20 to-pink-600/20",
    image: "https://images.unsplash.com/photo-1543004299-82bc60c5c64c?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "18",
    title: "React Native: The Ultimate Guide",
    author: "Meta Engineers",
    type: "Book",
    format: "EPUB",
    category: "Computer Science",
    rating: 4.8,
    downloads: "7.2k",
    date: "2024-03-10",
    color: "from-cyan-400/20 to-blue-400/20",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "19",
    title: "Anatomy Atlas for Medical Students",
    author: "Dr. Rachel Green",
    type: "Book",
    format: "PDF",
    category: "Medicine",
    rating: 5.0,
    downloads: "4.8k",
    date: "2024-03-22",
    color: "from-red-600/20 to-rose-600/20",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "20",
    title: "Machine Learning: Simplified Notes",
    author: "DataSci Academy",
    type: "Notes",
    format: "PDF",
    category: "Computer Science",
    rating: 4.7,
    downloads: "2.3k",
    date: "2024-03-05",
    color: "from-violet-600/20 to-indigo-600/20",
    image: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=400"
  }
];

export default function NotesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = RESOURCES.filter(res => {
    const matchesCategory = activeCategory === "All" || res.category === activeCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         res.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-4 pb-20">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <section className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
                Study Hub: <span className="text-primary">Notes & Books</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-xl">
                Access a massive library of peer-reviewed notes, textbooks, and exam-focused study materials to excel in your academic journey.
              </p>
            </div>
            
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search notes, authors, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 glass border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600"
              />
            </div>
          </motion.div>
        </section>

        {/* Categories Section */}
        <section className="mb-12 overflow-x-auto no-scrollbar py-2">
          <div className="flex items-center gap-3">
            {CATEGORIES.map((cat, idx) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all ${
                  activeCategory === cat 
                  ? "bg-primary text-white shadow-lg shadow-primary/25" 
                  : "glass border-white/5 text-slate-400 hover:text-white hover:border-white/20"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar / Filters (Desktop) */}
          <aside className="hidden lg:block space-y-8">
            <div className="glass border-white/5 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Filters</h3>
                <Filter className="w-4 h-4 text-slate-500" />
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Resource Type</h4>
                  <div className="space-y-3">
                    <FilterItem label="Textbooks" count={124} />
                    <FilterItem label="Handwritten Notes" count={89} />
                    <FilterItem label="Cheat Sheets" count={42} />
                    <FilterItem label="Past Papers" count={256} />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">File Format</h4>
                  <div className="space-y-3">
                    <FilterItem label="PDF Documents" count={380} />
                    <FilterItem label="EPUB Books" count={95} />
                    <FilterItem label="Word / Docs" count={45} />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Study Level</h4>
                  <div className="space-y-3">
                    <FilterItem label="High School" count={210} />
                    <FilterItem label="Undergraduate" count={145} />
                    <FilterItem label="Graduate" count={67} />
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Upsell Card */}
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl transition-all group-hover:scale-150" />
              <div className="relative z-10">
                <Bookmark className="text-primary w-8 h-8 mb-4" />
                <h3 className="font-bold text-xl mb-2">Pro Library</h3>
                <p className="text-slate-400 text-sm mb-4">Get unlimited access to premium verified textbooks and offline downloads.</p>
                <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                  Upgrade Now <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>

          {/* Resources Grid */}
          <div className="lg:col-span-3">
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredResources.map((res, idx) => (
                  <ResourceCard key={res.id} res={res} index={idx} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 glass border-white/5 rounded-3xl">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">No resources found</h3>
                <p className="text-slate-500">Try adjusting your filters or search keywords.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourceCard({ res, index }: { res: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative h-full flex flex-col glass border-white/5 rounded-[2.5rem] overflow-hidden hover:border-primary/30 transition-all duration-500"
    >
      {/* Card Image Wrapper */}
      <div className="h-48 overflow-hidden relative">
        <div className={`absolute inset-0 bg-gradient-to-br ${res.color} mix-blend-overlay z-10`} />
        <img 
          src={res.image} 
          alt={res.title}
          className="w-full h-full object-cover grayscale-[20%] group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] uppercase font-bold tracking-widest text-white border border-white/10">
            {res.type}
          </span>
        </div>
        <div className="absolute top-4 right-4 z-20">
          <button className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white/70 hover:text-primary border border-white/10 transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold text-primary uppercase tracking-tighter px-2 py-0.5 bg-primary/10 rounded">
            {res.category}
          </span>
          <div className="flex items-center text-yellow-500 text-[10px] font-bold ml-auto">
            <Star className="w-3 h-3 fill-current mr-1" />
            {res.rating}
          </div>
        </div>

        <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors flex-1 line-clamp-2">
          {res.title}
        </h3>
        
        <p className="text-slate-500 text-sm mb-6">
          By <span className="text-slate-400">{res.author}</span>
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-slate-500">
            <Download className="w-3 h-3" />
            <span className="text-[10px] font-medium">{res.downloads}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] font-medium">{res.date}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex-1 py-3 bg-white/5 border border-white/5 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
            <Eye className="w-4 h-4 text-slate-400" /> Preview
          </button>
          <button className="px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/80 transition-shadow shadow-lg shadow-primary/20 flex items-center justify-center">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function FilterItem({ label, count }: { label: string, count: number }) {
  return (
    <label className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded border border-white/10 group-hover:border-primary transition-colors" />
        <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{label}</span>
      </div>
      <span className="text-[10px] font-mono text-slate-600">{count}</span>
    </label>
  );
}
