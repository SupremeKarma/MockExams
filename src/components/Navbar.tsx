"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  BookOpen, 
  Bell, 
  User, 
  Settings, 
  Crown,
  ChevronDown,
  Sparkles,
  Zap,
  Brain,
  BarChart3,
  FolderGit2,
  Globe2,
  Check
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { academicTaxonomyData } from "@/data/academicTaxonomyData";

export const Navbar = () => {
  const { user, signOut, isAdmin, isExaminer } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTaxonomyOpen, setIsTaxonomyOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("prog-bit");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentProgram = academicTaxonomyData.find(n => n.id === selectedProgram) || academicTaxonomyData.find(n => n.id === "prog-bit");

  const navLinks = [
    { name: "Live Exams", href: "/exams", icon: Zap },
    { name: "BIT Notes", href: "/notes", icon: Sparkles },
    { name: "Flashcards", href: "/flashcards", icon: Brain },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Projects", href: "/projects", icon: FolderGit2 },
    { name: "Syllabus", href: "/syllabus", icon: BookOpen },
    { name: "Entrance", href: "/learn", icon: Crown },
    { name: "Ranking", href: "/leaderboard", icon: Crown },
  ];

  if (isExaminer) {
    navLinks.push({ name: "Examiner", href: "/examiner", icon: LayoutDashboard });
  }

  if (isAdmin) {
    navLinks.push({ name: "Admin", href: "/admin", icon: Settings });
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-slate-950/90 backdrop-blur-2xl border-b border-white/10 py-2.5 shadow-2xl" 
          : "bg-slate-950/60 backdrop-blur-md border-b border-white/5 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo & University / Program Switcher */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="flex items-center group">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/30 group-hover:rotate-12 transition-transform duration-300">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tighter">
                MOCK<span className="text-indigo-400 font-medium">EXAMS</span>
              </span>
            </Link>

            {/* Multi-Tenant Global Taxonomy Badge */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsTaxonomyOpen(prev => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 transition-all"
              >
                <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="max-w-[160px] truncate">{currentProgram?.title || "PU • BIT"}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              <AnimatePresence>
                {isTaxonomyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 mt-2 w-72 p-2 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl space-y-1 z-50 text-xs"
                  >
                    <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Switch University / Board
                    </div>
                    {[
                      { id: "prog-bit", title: "PU • BIT (Nepal)", badge: "Active Focus" },
                      { id: "prog-csit", title: "TU • BSc.CSIT (Nepal)", badge: "Available" },
                      { id: "prog-cbse12", title: "CBSE • Class 12 (India)", badge: "Global" },
                      { id: "prog-alevels", title: "Cambridge • A-Levels (CIE)", badge: "Global" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedProgram(item.id);
                          setIsTaxonomyOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                          selectedProgram === item.id 
                            ? "bg-indigo-600/20 text-indigo-300 font-bold" 
                            : "hover:bg-white/5 text-slate-300"
                        }`}
                      >
                        <span>{item.title}</span>
                        {selectedProgram === item.id ? (
                          <Check className="w-3.5 h-3.5 text-indigo-400" />
                        ) : (
                          <span className="text-[10px] text-slate-500">{item.badge}</span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-all hover:scale-105"
              >
                <link.icon className="w-3.5 h-3.5 text-slate-500" />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Action Icons & User Profile */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(prev => !prev)}
                  className="flex items-center gap-2.5 p-1.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-xs font-black text-slate-950">
                    {user.displayName ? user.displayName[0].toUpperCase() : "U"}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-56 p-2 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl space-y-1 text-xs text-slate-300 z-50"
                    >
                      <div className="p-3 border-b border-white/5">
                        <p className="font-bold text-white truncate">{user.displayName || "Student"}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>
                      <Link href="/dashboard" className="p-2.5 rounded-xl hover:bg-white/5 flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                        Dashboard
                      </Link>
                      <Link href="/analytics" className="p-2.5 rounded-xl hover:bg-white/5 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-cyan-400" />
                        Diagnostics
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="w-full p-2.5 rounded-xl hover:bg-rose-500/10 text-rose-400 flex items-center gap-2 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(prev => !prev)}
              className="xl:hidden p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="xl:hidden border-t border-white/10 pt-4 pb-3 space-y-2"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm font-bold text-slate-300"
                >
                  <link.icon className="w-4 h-4 text-indigo-400" />
                  {link.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
