"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sarthi from "@/components/Sarthi";
import Footer from "@/components/Footer";
import QuickNavRail from "@/components/QuickNavRail";
import Sidebar from "@/components/Sidebar";

// Routes that get the role-aware sidebar app shell instead of the
// marketing top-nav + footer treatment. See ARCHITECTURE.md.
const SIDEBAR_PREFIXES = [
  "/dashboard",
  "/courses",
  "/exams",
  "/flashcards",
  "/analytics",
  "/tutor",
  "/study-plan",
  "/leaderboard",
  "/profile",
  "/settings",
  "/rewards",
  "/examiner",
  "/organization",
  "/admin",
];

// Routes excluded from the sidebar shell even though they share a prefix
// above (focus-mode exam taking, and the pre-membership org application form).
const SIDEBAR_EXCLUDED_EXACT_OR_PREFIX = ["/organization/apply"];
const FOCUS_MODE_PATTERN = /^\/exams\/[^/]+\/take$/;

// The Reader owns its whole viewport: a three-pane layout with two sticky
// navigation panes of its own, plus a sticky header the deep-link
// scroll-margin is calibrated against. Nesting that inside the marketing
// navbar and footer would give it two headers and break the sticky offsets.
// Only the Reader's own course pages — NOT the existing /learn hub, which is a
// marketing page that expects the navbar and footer.
const READER_PATTERN = /^\/learn\/[^/]+/;

// /notes, /syllabus, /solution, and /past-papers are built from the same
// reader.css design system (see their layout.tsx files) and supply their own
// header the same way.
const NOTES_PATTERN = /^\/notes(\/|$)/;
const SYLLABUS_PATTERN = /^\/syllabus(\/|$)/;
const SOLUTION_PATTERN = /^\/solution(\/|$)/;
const PAST_PAPERS_PATTERN = /^\/past-papers(\/|$)/;

// Only a solved paper's own detail page (/papers/{id}) — the /papers upload
// form above it stays on the marketing layout, since it's a form, not a
// document to read.
const SOLVED_PAPER_PATTERN = /^\/papers\/[^/]+$/;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  // Hidden by default per an earlier request; the header's 3-line button
  // brings it back on demand instead of it always taking up width.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isFocusMode = FOCUS_MODE_PATTERN.test(pathname);

  const isExcluded = SIDEBAR_EXCLUDED_EXACT_OR_PREFIX.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  const isSidebarRoute =
    !isFocusMode &&
    !isExcluded &&
    SIDEBAR_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (
    isFocusMode ||
    READER_PATTERN.test(pathname) ||
    NOTES_PATTERN.test(pathname) ||
    SYLLABUS_PATTERN.test(pathname) ||
    SOLUTION_PATTERN.test(pathname) ||
    PAST_PAPERS_PATTERN.test(pathname) ||
    SOLVED_PAPER_PATTERN.test(pathname)
  ) {
    // Exam-taking, the Reader, Notes, Syllabus, Solution, Past Papers, and a
    // solved paper's own page all supply their own sticky header — no chrome
    // at all.
    return <>{children}</>;
  }

  if (isSidebarRoute) {
    return (
      <>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary-600 focus:text-white focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <div className="flex flex-1 pt-14">
          {sidebarOpen && <Sidebar />}
          <main id="main-content" className="flex-1 min-w-0">{children}</main>
        </div>
        {/* Mounted once at the shell so a conversation survives navigation. */}
        <Sarthi />
      </>
    );
  }

  return (
    <>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary-600 focus:text-white focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
      <Navbar />
      <QuickNavRail />
      <main id="main-content" className="flex-1 pt-16">{children}</main>
      <Sarthi />
      <Footer />
    </>
  );
}
