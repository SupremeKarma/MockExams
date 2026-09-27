"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Zap,
  Brain,
  BookOpen,
  Sparkles,
  Calendar,
  BarChart3,
  Crown,
  Gift,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Building2,
  ShieldCheck,
  GraduationCap,
  Compass,
  Users,
  Layers,
  Cpu,
} from "lucide-react";
import { useEffect, useState } from "react";

const CORE_LINKS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Syllabus", href: "/syllabus", icon: Layers },
  { name: "Courses", href: "/courses", icon: GraduationCap },
  { name: "Learning Paths", href: "/learning-paths", icon: Compass },
  { name: "Exams", href: "/exams", icon: Zap },
  { name: "Flashcards", href: "/flashcards", icon: Brain },
  { name: "Notes", href: "/notes", icon: BookOpen },
  { name: "AI Tutor", href: "/tutor", icon: Sparkles },
  { name: "Study Plan", href: "/study-plan", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Leaderboard", href: "/leaderboard", icon: Crown },
  { name: "Rewards", href: "/rewards", icon: Gift },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isAdmin, isExaminer, orgId } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("sidebar-collapsed");
    if (stored === "1") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem("sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  };

  const isActive = (href: string) => {
    if (pathname === href) return true;
    if (href === "/dashboard") return false;
    if (href === "/courses") {
      return pathname.startsWith("/courses") || pathname.startsWith("/dashboard/courses");
    }
    return pathname.startsWith(href);
  };

  const workspaceLinks = [
    (isExaminer || isAdmin) && { name: "Teacher Classes", href: "/teacher/classes", icon: Users },
    isExaminer && { name: "Examiner Console", href: "/examiner", icon: ClipboardList },
    orgId && { name: "Organization", href: `/organization/${orgId}`, icon: Building2 },
    isAdmin && { name: "Admin", href: "/admin", icon: ShieldCheck },
  ].filter(Boolean) as { name: string; href: string; icon: any }[];

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] border-r border-zinc-200 bg-white transition-all duration-200 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-0.5">
        {CORE_LINKS.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              title={collapsed ? link.name : undefined}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors ${
                active
                  ? "bg-primary-50 text-primary-700"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <link.icon className={`w-4 h-4 shrink-0 ${active ? "text-primary-600" : "text-zinc-400"}`} />
              {!collapsed && <span className="truncate">{link.name}</span>}
            </Link>
          );
        })}

        {/* Featured OS Deadlock Notes */}
        <div className={`pt-3 pb-1 ${collapsed ? "px-0" : "px-2.5"}`}>
          {!collapsed ? (
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Featured Notes
            </span>
          ) : (
            <div className="h-px bg-amber-200 mx-1" />
          )}
        </div>
        <Link
          href="/courses/BIT253CO?tab=notes"
          title={collapsed ? "OS Deadlock Notes" : undefined}
          className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
            pathname.includes("BIT253CO")
              ? "bg-amber-100/80 text-amber-900 border border-amber-300 font-bold"
              : "text-zinc-700 hover:bg-amber-50 hover:text-amber-900"
          } ${collapsed ? "justify-center" : ""}`}
        >
          <Cpu className="w-4 h-4 shrink-0 text-amber-600" />
          {!collapsed && (
            <div className="flex items-center justify-between flex-1 truncate">
              <span className="truncate">OS Deadlock Notes</span>
              <span className="text-[10px] bg-amber-200/90 text-amber-800 font-extrabold px-1.5 py-0.5 rounded-full shrink-0">
                Unit 6
              </span>
            </div>
          )}
        </Link>

        {workspaceLinks.length > 0 && (
          <>
            <div className={`pt-4 pb-1.5 ${collapsed ? "px-0" : "px-2.5"}`}>
              {!collapsed ? (
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Workspace</span>
              ) : (
                <div className="h-px bg-zinc-200 mx-1" />
              )}
            </div>
            {workspaceLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={collapsed ? link.name : undefined}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-primary-50 text-primary-700"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <link.icon className={`w-4 h-4 shrink-0 ${active ? "text-primary-600" : "text-zinc-400"}`} />
                  {!collapsed && <span className="truncate">{link.name}</span>}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="border-t border-zinc-100 p-2.5 space-y-0.5">
        <Link
          href="/profile"
          title={collapsed ? "Profile" : undefined}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors ${
            isActive("/profile") ? "bg-primary-50 text-primary-700" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          } ${collapsed ? "justify-center" : ""}`}
        >
          <User className={`w-4 h-4 shrink-0 ${isActive("/profile") ? "text-primary-600" : "text-zinc-400"}`} />
          {!collapsed && <span>Profile</span>}
        </Link>
        <Link
          href="/settings"
          title={collapsed ? "Settings" : undefined}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors ${
            isActive("/settings") ? "bg-primary-50 text-primary-700" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          } ${collapsed ? "justify-center" : ""}`}
        >
          <Settings className={`w-4 h-4 shrink-0 ${isActive("/settings") ? "text-primary-600" : "text-zinc-400"}`} />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button
          onClick={toggleCollapsed}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {collapsed ? <ChevronRight className="w-4 h-4 shrink-0" /> : <ChevronLeft className="w-4 h-4 shrink-0" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
