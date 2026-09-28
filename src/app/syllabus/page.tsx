"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { bitSyllabusData, type SubjectInfo } from "@/data/bitSyllabusData";
import { generateCourseMarkdown } from "@/lib/syllabusMarkdown";
import MarkdownViewer from "@/components/MarkdownViewer";

function SyllabusContent() {
  const searchParams = useSearchParams();
  const initialSemParam = searchParams ? Number(searchParams.get("sem")) : NaN;
  const initialSem = !isNaN(initialSemParam) && initialSemParam >= 1 && initialSemParam <= 8 ? initialSemParam : 7;
  const initialCourseParam = searchParams ? searchParams.get("course") || searchParams.get("code") : null;

  const [selectedSemester, setSelectedSemester] = useState<number>(initialSem);

  // Get courses specifically for the currently selected semester
  const semesterCourses = useMemo(() => {
    const sem = bitSyllabusData.find((s) => s.semester === selectedSemester);
    return sem?.subjects || [];
  }, [selectedSemester]);

  // Selected course code
  const [selectedCode, setSelectedCode] = useState<string>(() => {
    if (initialCourseParam) {
      const match = semesterCourses.find(
        (c) => c.code.toLowerCase() === initialCourseParam.toLowerCase() || c.name.toLowerCase() === initialCourseParam.toLowerCase()
      );
      if (match) return match.code;
    }
    return semesterCourses[0]?.code || "BIT401CO";
  });

  // Keep selectedCode valid when semester changes
  useEffect(() => {
    if (semesterCourses.length > 0) {
      const exists = semesterCourses.some((c) => c.code.toLowerCase() === selectedCode.toLowerCase());
      if (!exists) {
        setSelectedCode(semesterCourses[0].code);
      }
    }
  }, [semesterCourses, selectedCode]);

  // Selected course object
  const selectedCourse: SubjectInfo = useMemo(() => {
    return semesterCourses.find((c) => c.code.toLowerCase() === selectedCode.toLowerCase()) || semesterCourses[0] || {
      code: "BIT401CO",
      name: "Network Programming",
      credits: 3,
      type: "Core",
      description: "Client-server socket programming and network protocols.",
      keyUnits: ["Network Programming"],
    };
  }, [semesterCourses, selectedCode]);

  // Generate authoritative markdown for the selected course
  const courseMarkdown = useMemo(() => {
    return generateCourseMarkdown({
      code: selectedCourse.code,
      name: selectedCourse.name,
      programName: "Purbanchal University B.I.T.",
      semester: selectedSemester,
      credits: selectedCourse.credits,
      description: selectedCourse.description,
      keyUnits: selectedCourse.keyUnits,
      syllabusUnits: selectedCourse.syllabusUnits,
      labWork: selectedCourse.labWork,
      referenceBooks: selectedCourse.referenceBooks,
    });
  }, [selectedCourse, selectedSemester]);

  // View mode: rich outline view or official markdown view
  const [viewMode, setViewMode] = useState<"outline" | "markdown">("outline");
  const [isLearned, setIsLearned] = useState<boolean>(false);

  // Sync learned state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`syllabus_learned_${selectedCourse.code}`);
      setIsLearned(stored === "true");
    } catch {
      // Ignore in private browsing
    }
  }, [selectedCourse.code]);

  const toggleLearned = () => {
    const next = !isLearned;
    setIsLearned(next);
    try {
      localStorage.setItem(`syllabus_learned_${selectedCourse.code}`, String(next));
    } catch {
      // Ignore
    }
  };

  // Switch semester handler
  const handleSemesterChange = (newSem: number) => {
    setSelectedSemester(newSem);
    const targetSem = bitSyllabusData.find((s) => s.semester === newSem);
    if (targetSem && targetSem.subjects.length > 0) {
      setSelectedCode(targetSem.subjects[0].code);
      const url = new URL(window.location.href);
      url.searchParams.set("sem", String(newSem));
      url.searchParams.set("course", targetSem.subjects[0].code);
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Switch course handler
  const handleCourseChange = (newCode: string) => {
    setSelectedCode(newCode);
    const url = new URL(window.location.href);
    url.searchParams.set("sem", String(selectedSemester));
    url.searchParams.set("course", newCode);
    window.history.replaceState({}, "", url.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Previous and next course navigation
  const currentIndex = semesterCourses.findIndex((c) => c.code.toLowerCase() === selectedCourse.code.toLowerCase());
  const prevCourse = currentIndex > 0 ? semesterCourses[currentIndex - 1] : null;
  const nextCourse = currentIndex >= 0 && currentIndex < semesterCourses.length - 1 ? semesterCourses[currentIndex + 1] : null;

  const totalTeachingHours = selectedCourse.syllabusUnits
    ? selectedCourse.syllabusUnits.reduce((acc, u) => acc + (u.teachingHours || 0), 0)
    : 45;

  return (
    <>
      <a className="skip" href="#main">Skip to lesson</a>
      <div className="progress" aria-hidden="true"><span id="progress-bar"></span></div>

      {/* SVG Icon Symbols */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></symbol>
        <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></symbol>
        <symbol id="i-list" viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></symbol>
        <symbol id="i-tree" viewBox="0 0 24 24"><path d="M5 4v16M5 8h6M5 14h6M13 8h6M13 14h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m8.5 12.2 2.3 2.3 4.7-4.9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
        <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></symbol>
        <symbol id="i-bulb" viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></symbol>
        <symbol id="i-grid" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M4 10h16M4 16h16M10 4v16M16 4v16" fill="none" stroke="currentColor" strokeWidth="2" /></symbol>
        <symbol id="i-back" viewBox="0 0 24 24"><path d="M14 6 8 12l6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
        <symbol id="i-forward" viewBox="0 0 24 24"><path d="m10 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
        <symbol id="i-refresh" viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M18 3v4h-4M6 21v-4h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
        <symbol id="i-doc" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><polyline points="10 9 9 9 8 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></symbol>
      </svg>

      {/* Header */}
      <header className="app-header">
        <div className="app-header__inner">
          <div style={{ display: "flex", alignItems: "center", gap: "0.15rem", marginInlineEnd: "0.35rem" }}>
            <button className="icon-btn" type="button" onClick={() => window.history.back()} aria-label="Back">
              <svg className="icon"><use href="#i-back" /></svg>
            </button>
            <button className="icon-btn" type="button" onClick={() => window.history.forward()} aria-label="Forward">
              <svg className="icon"><use href="#i-forward" /></svg>
            </button>
            <button className="icon-btn" type="button" onClick={() => window.location.reload()} aria-label="Refresh">
              <svg className="icon"><use href="#i-refresh" /></svg>
            </button>
          </div>

          <button
            className="icon-btn rail-toggle"
            type="button"
            onClick={() => document.documentElement.toggleAttribute("data-rail-hidden")}
            aria-label="Show or hide the curriculum panel"
          >
            <svg className="icon"><use href="#i-menu" /></svg>
          </button>

          <span style={{ position: "relative", display: "inline-flex", alignItems: "center", marginInlineEnd: "0.5rem" }}>
            <span className="wordmark" aria-hidden="true" style={{ paddingInlineEnd: "1.15rem", whiteSpace: "nowrap" }}>
              PU BIT (Nepal)
            </span>
          </span>

          {/* Breadcrumb with isolated Semester and Subject dropdowns */}
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              {/* Semester Selector */}
              <li style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                <span aria-hidden="true" style={{ whiteSpace: "nowrap" }}>
                  Semester {selectedSemester}
                </span>
                <select
                  id="semester-select"
                  aria-label="Semester"
                  value={selectedSemester}
                  onChange={(e) => handleSemesterChange(Number(e.target.value))}
                  style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", fontSize: "1rem" }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
                <svg
                  className="icon"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  style={{
                    position: "absolute",
                    insetInlineEnd: 0,
                    width: "0.85rem",
                    height: "0.85rem",
                    color: "var(--ink-3)",
                    pointerEvents: "none",
                  }}
                >
                  <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </li>

              {/* Subject Selector: ONLY shows subjects belonging to the currently selected semester! */}
              <li style={{ position: "relative", display: "inline-flex", alignItems: "center", maxWidth: "260px" }}>
                <span aria-hidden="true" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selectedCourse.name}
                </span>
                <select
                  id="subject-select"
                  aria-label="Subject"
                  value={selectedCourse.code}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", fontSize: "1rem" }}
                >
                  {semesterCourses.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
                <svg
                  className="icon"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  style={{
                    position: "absolute",
                    insetInlineEnd: 0,
                    width: "0.85rem",
                    height: "0.85rem",
                    color: "var(--ink-3)",
                    pointerEvents: "none",
                  }}
                >
                  <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </li>

              <li>
                <a href="#main" aria-current="page">Syllabus</a>
              </li>
            </ol>
          </nav>

          {/* Quick Action Badges */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* View Mode Toggle: Outline vs Markdown (.md) */}
            <div
              style={{
                display: "inline-flex",
                background: "var(--paper-2)",
                borderRadius: "6px",
                padding: "2px",
                border: "1px solid var(--line-subtle)",
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode("outline")}
                style={{
                  padding: "0.25rem 0.65rem",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  background: viewMode === "outline" ? "var(--ink-1)" : "transparent",
                  color: viewMode === "outline" ? "var(--paper-1)" : "var(--ink-2)",
                }}
              >
                Outline View
              </button>
              <button
                type="button"
                onClick={() => setViewMode("markdown")}
                style={{
                  padding: "0.25rem 0.65rem",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  background: viewMode === "markdown" ? "var(--ink-1)" : "transparent",
                  color: viewMode === "markdown" ? "var(--paper-1)" : "var(--ink-2)",
                }}
              >
                Markdown (.md)
              </button>
            </div>

            {/* Jump to Notes */}
            <Link
              href={`/notes?sem=${selectedSemester}&subject=${encodeURIComponent(selectedCourse.name)}`}
              className="btn btn--quiet"
              style={{ fontSize: "0.78rem", padding: "0.25rem 0.65rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
            >
              <span>Study Notes &rarr;</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Shell */}
      <div className="shell">
        {/* Left Rail: Curriculum Units Tree */}
        <aside className="rail" aria-label="Curriculum">
          <div id="rail-content">
            <h2 className="course-title">{selectedCourse.name}</h2>
            <p className="course-meta">
              {selectedCourse.code}, Semester {selectedSemester}, {totalTeachingHours} teaching hours &middot; {selectedCourse.credits} credits
            </p>

            {/* Unit-wise and Topic-wise Accordion Tree */}
            <div className="unit-nav-tree" style={{ marginTop: "1rem" }}>
              {selectedCourse.syllabusUnits && selectedCourse.syllabusUnits.length > 0 ? (
                selectedCourse.syllabusUnits.map((unit, idx) => (
                  <details
                    key={idx}
                    open={true}
                    className="unit-accordion"
                    style={{
                      marginBottom: "0.75rem",
                      border: "1px solid var(--line-subtle)",
                      borderRadius: "6px",
                      background: "var(--paper-1)",
                      overflow: "hidden",
                    }}
                  >
                    <summary
                      style={{
                        padding: "0.5rem 0.65rem",
                        background: "var(--paper-2)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        color: "var(--ink-1)",
                        borderBottom: "1px solid var(--line-subtle)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", minWidth: 0, flex: 1, paddingRight: "0.3rem" }}>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            padding: "0.1rem 0.35rem",
                            background: "var(--ink-1)",
                            color: "var(--paper-1)",
                            borderRadius: "3px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          U{idx + 1}
                        </span>
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                          }}
                          title={unit.title}
                        >
                          {unit.title}
                        </span>
                      </div>
                      <span style={{ fontSize: "0.7rem", color: "var(--ink-3)", whiteSpace: "nowrap" }}>
                        {unit.teachingHours}h
                      </span>
                    </summary>

                    {/* Topics under this unit */}
                    <ul className="tree" style={{ padding: "0.35rem 0.5rem", margin: 0 }}>
                      {unit.subtopics && unit.subtopics.length > 0 ? (
                        unit.subtopics.map((sub, sIdx) => (
                          <li key={sIdx} style={{ marginBottom: "0.2rem" }}>
                            <a
                              href={`#unit-${idx + 1}-topic-${sIdx + 1}`}
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "0.4rem",
                                padding: "0.25rem 0.4rem",
                                fontSize: "0.78rem",
                                textDecoration: "none",
                              }}
                            >
                              <span className="code" style={{ fontSize: "0.7rem", minWidth: "1.7rem", paddingTop: "0.1rem" }}>
                                {idx + 1}.{sIdx + 1}
                              </span>
                              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={sub}>
                                {sub}
                              </span>
                            </a>
                          </li>
                        ))
                      ) : (
                        <li>
                          <a href={`#unit-${idx + 1}`}>
                            <span className="code">{idx + 1}.1</span> Overview
                          </a>
                        </li>
                      )}
                    </ul>
                  </details>
                ))
              ) : (
                <ul className="tree">
                  {selectedCourse.keyUnits.map((unit, idx) => (
                    <li key={idx}>
                      <a href={`#unit-${idx + 1}`}>
                        <span className="code">{idx + 1}</span> {unit}
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              {selectedCourse.labWork && selectedCourse.labWork.length > 0 && (
                <div style={{ marginTop: "0.5rem", padding: "0.25rem 0.5rem" }}>
                  <a href="#lab-work" style={{ fontSize: "0.82rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span className="code">&para;</span> Laboratory &amp; Practical
                  </a>
                </div>
              )}

              {selectedCourse.referenceBooks && selectedCourse.referenceBooks.length > 0 && (
                <div style={{ padding: "0.25rem 0.5rem" }}>
                  <a href="#reference-books" style={{ fontSize: "0.82rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span className="code">&sect;</span> Reference Textbooks
                  </a>
                </div>
              )}
            </div>

            <div style={{ marginTop: "1.25rem", padding: "0.75rem", background: "var(--paper-2)", borderRadius: "6px", fontSize: "0.78rem" }}>
              <div style={{ fontWeight: 600, marginBottom: "0.25rem", color: "var(--ink-1)" }}>Official Syllabus File (.md)</div>
              <p style={{ margin: "0 0 0.5rem", color: "var(--ink-3)", lineHeight: 1.4 }}>
                Full official markdown curriculum file for download and offline study.
              </p>
              <a
                href={`/syllabus/semester-${selectedSemester}/${selectedCourse.code}.md`}
                download={`${selectedCourse.code}_${selectedCourse.name.replace(/[^a-zA-Z0-9]/g, "_")}.md`}
                className="btn btn--quiet"
                style={{ width: "100%", justifyContent: "center", fontSize: "0.75rem", padding: "0.3rem" }}
              >
                Download .md File
              </a>
            </div>

            <p className="rail-note" style={{ marginTop: "1rem" }}>
              Official syllabus units and topics for {selectedCourse.code}, Purbanchal University BIT.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main id="main" className="sheet" tabIndex={-1}>
          {viewMode === "markdown" ? (
            /* Rendered Markdown Mode with Raw Copy/Download Controls */
            <div style={{ padding: "1.5rem" }}>
              <MarkdownViewer
                content={courseMarkdown}
                title={`${selectedCourse.name} (${selectedCourse.code})`}
                downloadFilename={`${selectedCourse.code}_Syllabus.md`}
                showActions={true}
              />
            </div>
          ) : (
            /* Rich Interactive Outline Mode */
            <article className="prose" lang="en">
              <h1 id="top">{selectedCourse.name} &mdash; Syllabus</h1>
              <div className="lesson-meta">
                <span className="trust" data-level="teacher-verified">Official PU Syllabus</span>
                <span>
                  {selectedCourse.code} &middot; Semester {selectedSemester} &middot; {selectedCourse.credits} credits &middot; {selectedCourse.type}
                </span>
              </div>

              {/* Course Objective */}
              <div className="block block--idea">
                <p className="block__label">
                  <svg className="icon" aria-hidden="true"><use href="#i-bulb" /></svg>
                  Course Objective &amp; Scope
                </p>
                <p>{selectedCourse.description}</p>
              </div>

              {/* Detailed Syllabus Chapters & Teaching Units with Topics */}
              {selectedCourse.syllabusUnits && selectedCourse.syllabusUnits.length > 0 ? (
                selectedCourse.syllabusUnits.map((unit, idx) => (
                  <section key={idx} style={{ marginBottom: "2.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        borderBottom: "2px solid var(--line-subtle)",
                        paddingBottom: "0.4rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <h2 id={`unit-${idx + 1}`} style={{ margin: 0, fontSize: "1.25rem", color: "var(--ink-1)" }}>
                        Unit {idx + 1}: {unit.title}
                      </h2>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.78rem", padding: "0.15rem 0.5rem", borderRadius: "12px", background: "var(--paper-2)", color: "var(--ink-2)", fontWeight: 600 }}>
                          {unit.teachingHours} Hours
                        </span>
                        <span style={{ fontSize: "0.78rem", padding: "0.15rem 0.5rem", borderRadius: "12px", background: "var(--paper-2)", color: "var(--ink-2)", fontWeight: 600 }}>
                          {unit.subtopics?.length || 0} Topics
                        </span>
                      </div>
                    </div>

                    {/* Topics List with Point-Wise Topic Cards */}
                    {unit.subtopics && unit.subtopics.length > 0 ? (
                      <div className="topics-container" style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                        {unit.subtopics.map((sub, sIdx) => (
                          <div
                            key={sIdx}
                            id={`unit-${idx + 1}-topic-${sIdx + 1}`}
                            style={{
                              padding: "0.65rem 0.85rem",
                              background: "var(--paper-1)",
                              border: "1px solid var(--line-subtle)",
                              borderRadius: "6px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "0.75rem",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", minWidth: 0, flex: 1 }}>
                              <span
                                style={{
                                  fontSize: "0.72rem",
                                  fontWeight: 700,
                                  padding: "0.15rem 0.4rem",
                                  background: "var(--paper-2)",
                                  color: "var(--ink-1)",
                                  borderRadius: "4px",
                                  border: "1px solid var(--line-subtle)",
                                  whiteSpace: "nowrap",
                                  marginTop: "0.1rem",
                                }}
                              >
                                Topic {idx + 1}.{sIdx + 1}
                              </span>
                              <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--ink-1)", lineHeight: 1.45 }}>
                                {sub}
                              </span>
                            </div>
                            <Link
                              href={`/notes?sem=${selectedSemester}&subject=${encodeURIComponent(selectedCourse.name)}`}
                              style={{
                                fontSize: "0.75rem",
                                color: "var(--accent-1, #2563eb)",
                                fontWeight: 600,
                                textDecoration: "none",
                                whiteSpace: "nowrap",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.2rem",
                              }}
                            >
                              <span>Notes</span>
                              <span>&rarr;</span>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: "var(--ink-3)", fontStyle: "italic" }}>No specific subtopics listed.</p>
                    )}
                  </section>
                ))
              ) : (
                selectedCourse.keyUnits.map((unit, idx) => (
                  <section key={idx} style={{ marginBottom: "2rem" }}>
                    <h2 id={`unit-${idx + 1}`}>Unit {idx + 1}: {unit}</h2>
                  </section>
                ))
              )}

              {/* Laboratory & Practical Work Guidelines */}
              {selectedCourse.labWork && selectedCourse.labWork.length > 0 && (
                <div id="lab-work" className="block block--example" style={{ marginTop: "2.5rem" }}>
                  <p className="block__label">
                    <svg className="icon" aria-hidden="true"><use href="#i-grid" /></svg>
                    Laboratory Guidelines &amp; Practical Work
                  </p>
                  <ul>
                    {selectedCourse.labWork.map((work, wIdx) => (
                      <li key={wIdx}>{work}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reference Textbooks & Materials */}
              {selectedCourse.referenceBooks && selectedCourse.referenceBooks.length > 0 && (
                <section id="reference-books" style={{ marginTop: "2.5rem" }}>
                  <h2>Reference Textbooks &amp; Materials</h2>
                  <ol>
                    {selectedCourse.referenceBooks.map((book, bIdx) => (
                      <li key={bIdx}>{book}</li>
                    ))}
                  </ol>
                </section>
              )}

              {/* Action Buttons */}
              <div className="lesson-end" style={{ marginTop: "3rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
                <Link
                  href={`/notes?sem=${selectedSemester}&subject=${encodeURIComponent(selectedCourse.name)}`}
                  className="btn btn--primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
                >
                  <svg className="icon" aria-hidden="true"><use href="#i-doc" /></svg>
                  <span>Open Full Study Notes</span>
                </Link>

                <button
                  className="btn btn--quiet"
                  type="button"
                  onClick={() => setViewMode("markdown")}
                >
                  View as Markdown (.md)
                </button>

                <button
                  className="btn btn--quiet"
                  type="button"
                  onClick={toggleLearned}
                  aria-pressed={isLearned ? "true" : "false"}
                >
                  <svg className="icon" aria-hidden="true"><use href="#i-check" /></svg>
                  <span>{isLearned ? "Syllabus Reviewed" : "Mark as Reviewed"}</span>
                </button>
              </div>

              {/* Previous / Next Course Pager */}
              <nav className="pager" aria-label="Course Pager" style={{ marginTop: "2.5rem" }}>
                {prevCourse ? (
                  <a
                    href="#main"
                    rel="prev"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCourseChange(prevCourse.code);
                    }}
                  >
                    <small>Previous Course</small>
                    {prevCourse.name}
                  </a>
                ) : (
                  <span />
                )}

                {nextCourse && (
                  <a
                    href="#main"
                    rel="next"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCourseChange(nextCourse.code);
                    }}
                  >
                    <small>Next Course</small>
                    {nextCourse.name}
                  </a>
                )}
              </nav>
            </article>
          )}
        </main>

        {/* Right Rail: On this page Table of Contents */}
        <aside className="toc" aria-label="On this page">
          <div id="toc-content">
            <h2>On this page</h2>
            <ol className="toc-list">
              <li><a href="#top">Course Overview</a></li>
              {selectedCourse.syllabusUnits && selectedCourse.syllabusUnits.length > 0 ? (
                selectedCourse.syllabusUnits.map((u, i) => (
                  <li key={i} style={{ marginBottom: "0.4rem" }}>
                    <a href={`#unit-${i + 1}`} style={{ fontWeight: 600 }}>
                      Unit {i + 1}: {u.title.substring(0, 32)}
                    </a>
                    {u.subtopics && u.subtopics.length > 0 && (
                      <ol style={{ paddingLeft: "0.75rem", marginTop: "0.2rem", fontSize: "0.74rem", listStyleType: "none" }}>
                        {u.subtopics.map((st, si) => (
                          <li key={si} style={{ marginBottom: "0.15rem" }}>
                            <a
                              href={`#unit-${i + 1}-topic-${si + 1}`}
                              style={{ color: "var(--ink-3)", textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                              title={st}
                            >
                              {i + 1}.{si + 1} {st}
                            </a>
                          </li>
                        ))}
                      </ol>
                    )}
                  </li>
                ))
              ) : (
                selectedCourse.keyUnits.map((u, i) => (
                  <li key={i}>
                    <a href={`#unit-${i + 1}`}>Unit {i + 1}: {u.substring(0, 36)}</a>
                  </li>
                ))
              )}
              {selectedCourse.labWork && selectedCourse.labWork.length > 0 && (
                <li><a href="#lab-work">Laboratory Work</a></li>
              )}
              {selectedCourse.referenceBooks && selectedCourse.referenceBooks.length > 0 && (
                <li><a href="#reference-books">Reference Books</a></li>
              )}
            </ol>

            <div className="toc-section" style={{ marginTop: "1.5rem" }}>
              <h2>Course Info</h2>
              <p style={{ margin: "0.25rem 0", fontSize: "0.85rem", color: "var(--ink-2)" }}>
                <strong>{selectedCourse.code}</strong> &middot; {selectedCourse.credits} Credits
              </p>
              <p style={{ margin: "0.25rem 0", fontSize: "0.82rem", color: "var(--ink-3)" }}>
                Type: {selectedCourse.type}
              </p>
              <p style={{ margin: "0.25rem 0", fontSize: "0.82rem", color: "var(--ink-3)" }}>
                Teaching Hours: {totalTeachingHours} Hrs
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Toolbar */}
      <nav className="toolbar" aria-label="Lesson tools">
        <button
          type="button"
          onClick={() => {
            const dialog = document.getElementById("rail-dialog") as HTMLDialogElement | null;
            dialog?.showModal();
          }}
        >
          <svg className="icon" aria-hidden="true"><use href="#i-tree" /></svg>
          Syllabus
        </button>
        <button
          type="button"
          onClick={() => {
            const dialog = document.getElementById("toc-dialog") as HTMLDialogElement | null;
            dialog?.showModal();
          }}
        >
          <svg className="icon" aria-hidden="true"><use href="#i-list" /></svg>
          Units
        </button>
        <button
          type="button"
          onClick={() => setViewMode(viewMode === "outline" ? "markdown" : "outline")}
        >
          <svg className="icon" aria-hidden="true"><use href="#i-doc" /></svg>
          <span>{viewMode === "outline" ? ".md View" : "Outline"}</span>
        </button>
        <button
          type="button"
          onClick={toggleLearned}
          aria-pressed={isLearned ? "true" : "false"}
        >
          <svg className="icon" aria-hidden="true"><use href="#i-check" /></svg>
          <span>{isLearned ? "Reviewed" : "Review"}</span>
        </button>
      </nav>

      {/* Mobile Drawer Dialog: Syllabus Courses & Units */}
      <dialog id="rail-dialog" className="drawer" aria-labelledby="rail-dialog-title">
        <div className="dialog__head">
          <h2 id="rail-dialog-title">Semester {selectedSemester} Courses</h2>
          <button
            className="icon-btn"
            type="button"
            onClick={() => {
              const dialog = document.getElementById("rail-dialog") as HTMLDialogElement | null;
              dialog?.close();
            }}
            aria-label="Close drawer"
          >
            <svg className="icon"><use href="#i-close" /></svg>
          </button>
        </div>
        <div className="dialog__body" style={{ padding: "1rem" }}>
          <h3 style={{ fontSize: "1rem", margin: "0 0 0.5rem" }}>Switch Course</h3>
          <ul className="tree">
            {semesterCourses.map((c) => (
              <li key={c.code}>
                <a
                  href="#main"
                  aria-current={c.code === selectedCourse.code ? "page" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCourseChange(c.code);
                    const dialog = document.getElementById("rail-dialog") as HTMLDialogElement | null;
                    dialog?.close();
                  }}
                  style={{
                    fontWeight: c.code === selectedCourse.code ? 700 : 400,
                  }}
                >
                  <span className="code">{c.code}</span> {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </dialog>

      {/* Mobile Table of Contents Bottom Sheet */}
      <dialog id="toc-dialog" className="bottom-sheet" aria-labelledby="toc-dialog-title">
        <div className="dialog__head">
          <h2 id="toc-dialog-title">{selectedCourse.name} &mdash; Units</h2>
          <button
            className="icon-btn"
            type="button"
            onClick={() => {
              const dialog = document.getElementById("toc-dialog") as HTMLDialogElement | null;
              dialog?.close();
            }}
            aria-label="Close contents"
          >
            <svg className="icon"><use href="#i-close" /></svg>
          </button>
        </div>
        <div className="dialog__body" style={{ padding: "1rem" }}>
          <ol className="toc-list" style={{ padding: 0 }}>
            {selectedCourse.syllabusUnits && selectedCourse.syllabusUnits.length > 0 ? (
              selectedCourse.syllabusUnits.map((u, i) => (
                <li key={i} style={{ marginBottom: "0.75rem" }}>
                  <a
                    href={`#unit-${i + 1}`}
                    style={{ fontWeight: 600, fontSize: "0.9rem" }}
                    onClick={() => {
                      const dialog = document.getElementById("toc-dialog") as HTMLDialogElement | null;
                      dialog?.close();
                    }}
                  >
                    Unit {i + 1}: {u.title} ({u.teachingHours} hrs)
                  </a>
                  {u.subtopics && u.subtopics.length > 0 && (
                    <ol style={{ paddingLeft: "1rem", marginTop: "0.3rem", fontSize: "0.8rem", listStyleType: "none" }}>
                      {u.subtopics.map((st, si) => (
                        <li key={si} style={{ marginBottom: "0.25rem" }}>
                          <a
                            href={`#unit-${i + 1}-topic-${si + 1}`}
                            onClick={() => {
                              const dialog = document.getElementById("toc-dialog") as HTMLDialogElement | null;
                              dialog?.close();
                            }}
                            style={{ color: "var(--ink-2)", textDecoration: "none" }}
                          >
                            {i + 1}.{si + 1} {st}
                          </a>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              ))
            ) : (
              selectedCourse.keyUnits.map((u, i) => (
                <li key={i} style={{ marginBottom: "0.5rem" }}>
                  <a
                    href={`#unit-${i + 1}`}
                    onClick={() => {
                      const dialog = document.getElementById("toc-dialog") as HTMLDialogElement | null;
                      dialog?.close();
                    }}
                  >
                    Unit {i + 1}: {u}
                  </a>
                </li>
              ))
            )}
          </ol>
        </div>
      </dialog>
    </>
  );
}

export default function SyllabusPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
          <p>Loading curriculum syllabus...</p>
        </div>
      }
    >
      <SyllabusContent />
    </Suspense>
  );
}
