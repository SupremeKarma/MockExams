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
  Search,
  Zap
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const { user, signOut, isAdmin, isExaminer } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Live Exams", href: "/exams", icon: Zap },
    { name: "Global Ranking", href: "/leaderboard", icon: Crown },
    { name: "Community Notes", href: "/notes", icon: Sparkles },
  ];

  if (isExaminer) {
    navLinks.push({ name: "Examiner", href: "/examiner", icon: LayoutDashboard });
  }

  if (isAdmin) {
    navLinks.push({ name: "Admin Nexus", href: "/admin", icon: Settings });
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 py-3" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded-3xl px-6 py-2 backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-12">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/30 group-hover:rotate-12 transition-transform duration-300">
                <BookOpen className="w-6 h-6 text-white" />
                <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
              </div>
              <span className="text-xl font-black text-white tracking-tighter">
                MOCK<span className="text-indigo-400 font-medium">EXAM</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-all"
                >
                  <link.icon className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 p-1 bg-slate-900 border border-white/5 rounded-2xl mr-4">
              <div className="flex items-center gap-2 px-4 py-1.5 text-xs font-black text-slate-400">
                <Search className="w-4 h-4" />
                <span className="hidden xl:inline">Search Exams...</span>
              </div>
            </div>

            {user ? (
              <div className="flex items-center gap-5">
                <button className="relative p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950"></span>
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 p-1.5 pr-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl hover:bg-indigo-500/20 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl overflow-hidden border border-indigo-500/50">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="User" />
                      ) : (
                        <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
                          {user.email?.[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-indigo-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-4 w-64 bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl p-4 overflow-hidden z-[60]"
                      >
                        <div className="px-4 py-6 border-b border-white/5 mb-2">
                           <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Authenticated Account</p>
                           <p className="text-sm font-bold text-white truncate">{user.email}</p>
                        </div>
                        <div className="space-y-1">
                          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                          </Link>
                          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                            <User className="w-4 h-4" /> Profile Matrix
                          </Link>
                          <button 
                            onClick={() => { signOut(); setIsProfileOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all"
                          >
                            <LogOut className="w-4 h-4" /> Terminal Logoff
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-black text-white px-6 py-2.5 rounded-xl hover:bg-white/5 transition-all">
                  Sign In
                </Link>
                <Link href="/signup" className="bg-indigo-600 text-white text-sm font-black px-8 py-2.5 rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-950 border-b border-white/5 pt-4 pb-12 px-4 space-y-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-4 px-6 py-4 rounded-3xl text-lg font-black text-slate-400 bg-white/5 hover:text-white active:scale-95 transition-all"
                onClick={() => setIsOpen(false)}
              >
                <link.icon className="w-6 h-6 text-indigo-400" />
                {link.name}
              </Link>
            ))}
            {!user && (
              <div className="grid grid-cols-2 gap-4 pt-8">
                <Link href="/login" className="flex items-center justify-center py-4 rounded-3xl text-sm font-black text-white bg-white/5">
                  Sign In
                </Link>
                <Link href="/signup" className="flex items-center justify-center py-4 rounded-3xl text-sm font-black text-white bg-indigo-600 shadow-xl shadow-indigo-500/20">
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;
