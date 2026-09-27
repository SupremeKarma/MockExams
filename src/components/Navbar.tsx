"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { CreditsBadge } from "@/components/CreditsBadge";
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  User,
  Settings,
  Crown,
  ChevronDown,
  Sparkles,
  Zap,
  Brain,
  BarChart3,
  Globe2,
  Check,
  Quote,
  Gift,
  Building2,
  ClipboardList,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgram, CONTENT_AVAILABLE_PROGRAM_IDS } from "@/context/ProgramContext";

export const Navbar = () => {
  const { user, signOut, isAdmin, isExaminer, orgId, openAuthModal } = useAuth();
  const { activeProgram, setActiveProgramId, allPrograms } = useProgram();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTaxonomyOpen, setIsTaxonomyOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentProgram = activeProgram;

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Exams", href: "/exams", icon: Zap },
    { name: "Flashcards", href: "/flashcards", icon: Brain },
    { name: "AI Tutor", href: "/tutor", icon: Sparkles },
    { name: "Inspire", href: "/inspire", icon: Quote },
    { name: "Study Plan", href: "/study-plan", icon: Check },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "BIT Notes", href: "/notes", icon: BookOpen },
    { name: "Leaderboard", href: "/leaderboard", icon: Crown },
    { name: "Rewards", href: "/rewards", icon: Gift },
  ];

  if (isExaminer) {
    navLinks.push({ name: "Examiner", href: "/examiner", icon: ClipboardList });
  }

  if (orgId) {
    navLinks.push({ name: "Organization", href: `/organization/${orgId}`, icon: Building2 });
  }

  if (isAdmin) {
    navLinks.push({ name: "Admin", href: "/admin", icon: Settings });
  }

  // Only the first few sit directly in the bar — the rest go under "More", or
  // this row overflows the instant a signed-in user picks up an Examiner,
  // Organization, or Admin role on top of the base student links.
  const PRIMARY_COUNT = 5;
  const primaryLinks = navLinks.slice(0, PRIMARY_COUNT);
  const moreLinks = navLinks.slice(PRIMARY_COUNT);

  // Account links: reachable from the mobile drawer (no sidebar there) and
  // the desktop profile dropdown — not in the main nav list itself.
  const accountLinks = [
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-zinc-200 py-2"
          : "bg-white/90 backdrop-blur-md border-b border-zinc-100 py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          {/* Logo & University / Program Switcher */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/" className="flex items-center group">
              <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center mr-2.5">
                <BookOpen className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-base font-bold text-zinc-900 tracking-tight">
                MockExams
              </span>
            </Link>

            {/* Multi-Tenant Global Taxonomy Badge */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsTaxonomyOpen(prev => !prev)}
                aria-label="Change programme"
                aria-expanded={isTaxonomyOpen}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-700 transition-colors"
              >
                <Globe2 className="w-3.5 h-3.5 text-primary-600" />
                <span className="max-w-[160px] truncate">{currentProgram?.shortTitle || "PU • BIT"}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              <AnimatePresence>
                {isTaxonomyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 mt-2 w-72 p-1.5 rounded-lg bg-white border border-zinc-200 shadow-lg space-y-0.5 z-50 text-xs"
                  >
                    <div className="px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Switch university / board
                    </div>
                    {allPrograms.map((item) => {
                      const hasContent = CONTENT_AVAILABLE_PROGRAM_IDS.includes(item.id);
                      const isActive = activeProgram.id === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveProgramId(item.id);
                            setIsTaxonomyOpen(false);
                          }}
                          className={`w-full p-2 rounded-md flex items-center justify-between transition-colors ${
                            isActive
                              ? "bg-primary-50 text-primary-700 font-semibold"
                              : "hover:bg-zinc-50 text-zinc-700"
                          }`}
                        >
                          <span>{item.title}</span>
                          {isActive ? (
                            <Check className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                          ) : (
                            <span className={`text-[10px] shrink-0 ${hasContent ? "text-emerald-600 font-semibold" : "text-zinc-400"}`}>
                              {hasContent ? "Live" : "Coming soon"}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-4">
            {primaryLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-600 hover:text-primary-600 transition-colors"
              >
                <link.icon className="w-3.5 h-3.5 text-zinc-400" />
                {link.name}
              </Link>
            ))}

            {moreLinks.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setIsMoreOpen((prev) => !prev)}
                  aria-label="More navigation links"
                  aria-expanded={isMoreOpen}
                  className="flex items-center gap-1 text-[13px] font-medium text-zinc-600 hover:text-primary-600 transition-colors"
                >
                  More
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                <AnimatePresence>
                  {isMoreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-full right-0 mt-2 w-52 p-1.5 rounded-lg bg-white border border-zinc-200 shadow-lg space-y-0.5 z-50"
                    >
                      {moreLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setIsMoreOpen(false)}
                          className="p-2 rounded-md hover:bg-zinc-50 flex items-center gap-2 text-[13px] font-medium text-zinc-700"
                        >
                          <link.icon className="w-4 h-4 text-zinc-400" />
                          {link.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right Action Icons & User Profile */}
          <div className="flex items-center gap-2">
            {user && <CreditsBadge />}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(prev => !prev)}
                  aria-label="Account menu"
                  aria-expanded={isProfileOpen}
                  className="flex items-center gap-2 p-1 pr-2 rounded-md bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors"
                >
                  <div className="w-7 h-7 rounded-md bg-primary-600 flex items-center justify-center text-[11px] font-bold text-white">
                    {user.displayName ? user.displayName[0].toUpperCase() : "U"}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 p-1.5 rounded-lg bg-white border border-zinc-200 shadow-lg space-y-0.5 text-xs text-zinc-700 z-50"
                    >
                      <div className="p-2.5 border-b border-zinc-100 mb-1">
                        <p className="font-semibold text-zinc-900 truncate">{user.displayName || "Student"}</p>
                        <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                      </div>
                      <Link href="/dashboard" className="p-2 rounded-md hover:bg-zinc-50 flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4 text-primary-600" />
                        Dashboard
                      </Link>
                      <Link href="/analytics" className="p-2 rounded-md hover:bg-zinc-50 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-sky-600" />
                        Diagnostics
                      </Link>
                      <Link href="/profile" className="p-2 rounded-md hover:bg-zinc-50 flex items-center gap-2">
                        <User className="w-4 h-4 text-violet-600" />
                        Profile
                      </Link>
                      <Link href="/settings" className="p-2 rounded-md hover:bg-zinc-50 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-zinc-500" />
                        Settings
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="w-full p-2 rounded-md hover:bg-red-50 text-red-600 flex items-center gap-2 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className="px-3 py-2 text-[13px] font-semibold text-zinc-700 hover:text-primary-600 transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal("signup")}
                  className="px-3.5 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-semibold shadow-button transition-colors cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(prev => !prev)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              className="xl:hidden p-2 rounded-md bg-zinc-100 text-zinc-600 hover:text-zinc-900"
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
              className="xl:hidden border-t border-zinc-100 mt-3 pt-3 pb-2 space-y-1"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-md hover:bg-zinc-50 text-sm font-medium text-zinc-700"
                >
                  <link.icon className="w-4 h-4 text-primary-600" />
                  {link.name}
                </Link>
              ))}

              {user ? (
                <>
                  <div className="h-px bg-zinc-100 my-1.5" />
                  {accountLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-md hover:bg-zinc-50 text-sm font-medium text-zinc-700"
                    >
                      <link.icon className="w-4 h-4 text-zinc-500" />
                      {link.name}
                    </Link>
                  ))}
                  <button
                    onClick={() => { setIsOpen(false); signOut(); }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-md hover:bg-red-50 text-sm font-medium text-red-600 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="pt-2 border-t border-zinc-100 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      openAuthModal("login");
                    }}
                    className="w-full py-2.5 text-center text-sm font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      openAuthModal("signup");
                    }}
                    className="w-full py-2.5 text-center text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-button"
                  >
                    Get Started Free
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
