"use client";

import { BookOpen, Search, User, Bell, X, ShieldCheck, GraduationCap, Building2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/components/NotificationProvider";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, isAdmin, isExaminer, orgId } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  if (pathname?.includes("/take")) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-4 glass border-b border-white/5" : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter">MockExams</span>
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/exams">Exams</NavLink>
          <NavLink href="/notes">Notes</NavLink>
          <NavLink href="/leaderboard">Leaderboard</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/about">About</NavLink>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors hidden sm:block">
            <Search className="w-5 h-5 text-slate-400" />
          </button>

          {/* Notifications */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors relative"
              >
                <Bell className={`w-5 h-5 ${unreadCount > 0 ? "text-primary" : "text-slate-400"}`} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-[#030711]" />
                )}
              </button>

              {showNotifs && (
                <div className="absolute top-full right-0 mt-4 w-80 glass-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden py-2 z-50">
                  <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Notifications</span>
                    <button onClick={() => setShowNotifs(false)}><X className="w-3 h-3" /></button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-500 italic">No notifications yet.</div>
                    ) : (
                      notifications.map(n => (
                        <Link
                          key={n.id}
                          href={n.link || "#"}
                          className="flex gap-3 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                          onClick={() => setShowNotifs(false)}
                        >
                          <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                            n.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary/10 text-primary'
                          }`}>
                            <Bell className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold">{n.title}</div>
                            <div className="text-xs text-slate-400 line-clamp-2">{n.message}</div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                  <Link
                    href="/dashboard"
                    className="block p-3 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                  >
                    View All Activity
                  </Link>
                </div>
              )}
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              {/* Role-aware portal links */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-bold hover:bg-rose-500/20 transition-all"
                  title="Admin Panel"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin
                </Link>
              )}

              {isExaminer && !isAdmin && (
                <Link
                  href="/examiner"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs font-bold hover:bg-amber-500/20 transition-all"
                  title="Examiner Portal"
                >
                  <GraduationCap className="w-3.5 h-3.5" /> My Exams
                </Link>
              )}

              {orgId && (
                <Link
                  href={`/organization/${orgId}`}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-500/20 transition-all"
                  title="My Organization"
                >
                  <Building2 className="w-3.5 h-3.5" /> My Org
                </Link>
              )}

              <Link
                href="/dashboard"
                className="px-4 py-2 hover:text-white transition-colors text-slate-400 font-medium text-sm"
              >
                Dashboard
              </Link>

              <Link
                href="/profile"
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
                title="Profile"
              >
                <User className="w-5 h-5" />
              </Link>

              <button
                onClick={handleSignOut}
                className="px-4 py-2 glass border-white/10 text-white rounded-lg font-bold hover:bg-white/5 transition-all text-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2 hover:text-white transition-colors text-slate-400 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 bg-white text-black rounded-lg font-bold hover:bg-slate-200 transition-all shadow-lg"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-slate-400 hover:text-white font-medium transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
    </Link>
  );
}
