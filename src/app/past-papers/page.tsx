"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { bitSyllabusData } from "@/data/bitSyllabusData";
import { bitPastPapersData, type FullPastPaper, type PastPaperQuestion } from "@/data/bitPastPapersData";
import MathRenderer from "@/components/MathRenderer";

function PastPapersContent() {
  const searchParams = useSearchParams();
  const initialSemParam = searchParams ? Number(searchParams.get("sem")) : NaN;
  const initialSem = !isNaN(initialSemParam) && initialSemParam >= 1 && initialSemParam <= 8 ? initialSemParam : 7;
  const initialSubjParam = searchParams ? searchParams.get("subject") : null;
  const initialPaperParam = searchParams ? searchParams.get("paper") : null;

  const [selectedSemester, setSelectedSemester] = useState<number>(initialSem);

  // Available subjects for the currently selected semester
  const semesterSubjects = useMemo(() => {
    const sem = bitSyllabusData.find((s) => s.semester === selectedSemester);
    return sem?.subjects || [];
  }, [selectedSemester]);

  // Selected subject name
  const [selectedSubject, setSelectedSubject] = useState<string>(() => {
    if (initialSubjParam) {
      const match = semesterSubjects.find(
        (s) => s.name.toLowerCase() === initialSubjParam.toLowerCase() || s.code.toLowerCase() === initialSubjParam.toLowerCase()
      );
      if (match) return match.name;
    }
    return semesterSubjects[0]?.name || "Network Programming";
  });

  // Keep selectedSubject valid when semester changes
  useEffect(() => {
    if (semesterSubjects.length > 0) {
      const exists = semesterSubjects.some(
        (s) => s.name.toLowerCase() === selectedSubject.toLowerCase() || s.code.toLowerCase() === selectedSubject.toLowerCase()
      );
      if (!exists) {
        setSelectedSubject(semesterSubjects[0].name);
      }
    }
  }, [semesterSubjects, selectedSubject]);

  // All past papers matching the semester and subject
  const availablePapers = useMemo(() => {
    return bitPastPapersData.filter((p) => {
      const matchSem = p.semester === selectedSemester;
      const matchSub =
        p.subject.toLowerCase() === selectedSubject.toLowerCase() ||
        selectedSubject.toLowerCase().includes(p.subject.toLowerCase()) ||
        p.subject.toLowerCase().includes(selectedSubject.toLowerCase());
      return matchSem && matchSub;
    });
  }, [selectedSemester, selectedSubject]);

  // Selected paper
  const [selectedPaperId, setSelectedPaperId] = useState<string>(() => {
    if (initialPaperParam) return initialPaperParam;
    return availablePapers[0]?.id || "";
  });

  useEffect(() => {
    if (availablePapers.length > 0) {
      const exists = availablePapers.some((p) => p.id === selectedPaperId);
      if (!exists) {
        setSelectedPaperId(availablePapers[0].id);
      }
    } else {
      setSelectedPaperId("");
    }
  }, [availablePapers, selectedPaperId]);

  const activePaper: FullPastPaper | null = useMemo(() => {
    return availablePapers.find((p) => p.id === selectedPaperId) || availablePapers[0] || null;
  }, [availablePapers, selectedPaperId]);

  // Handlers
  const handleSemesterChange = (newSem: number) => {
    setSelectedSemester(newSem);
    const targetSem = bitSyllabusData.find((s) => s.semester === newSem);
    if (targetSem && targetSem.subjects.length > 0) {
      setSelectedSubject(targetSem.subjects[0].name);
      const url = new URL(window.location.href);
      url.searchParams.set("sem", String(newSem));
      url.searchParams.set("subject", targetSem.subjects[0].name);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleSubjectChange = (newSub: string) => {
    setSelectedSubject(newSub);
    const url = new URL(window.location.href);
    url.searchParams.set("sem", String(selectedSemester));
    url.searchParams.set("subject", newSub);
    window.history.replaceState({}, "", url.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Group questions by exam group
  const groupedQuestions = useMemo(() => {
    if (!activePaper) return {};
    const groups: Record<string, PastPaperQuestion[]> = {};
    activePaper.questions.forEach((q) => {
      const g = q.group || "All Questions";
      if (!groups[g]) groups[g] = [];
      groups[g].push(q);
    });
    return groups;
  }, [activePaper]);

  return (
    <>
      <a className="skip" href="#main">Skip to lesson</a>
      <div className="progress" aria-hidden="true"><span id="progress-bar"></span></div>

      {/* SVG Icon Symbols */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></symbol>
        <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></symbol>
        <symbol id="i-list" viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m8.5 12.2 2.3 2.3 4.7-4.9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
        <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></symbol>
        <symbol id="i-back" viewBox="0 0 24 24"><path d="M14 6 8 12l6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
        <symbol id="i-forward" viewBox="0 0 24 24"><path d="m10 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
        <symbol id="i-refresh" viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M18 3v4h-4M6 21v-4h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
        <symbol id="i-doc" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></symbol>
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
            aria-label="Show or hide syllabus panel"
          >
            <svg className="icon"><use href="#i-menu" /></svg>
          </button>

          <span style={{ position: "relative", display: "inline-flex", alignItems: "center", marginInlineEnd: "0.5rem" }}>
            <span className="wordmark" aria-hidden="true" style={{ paddingInlineEnd: "1.15rem", whiteSpace: "nowrap" }}>
              PU BIT Past Papers
            </span>
          </span>

          {/* Breadcrumb Navigation */}
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

              {/* Subject Selector: ONLY shows subjects of the selected semester */}
              <li style={{ position: "relative", display: "inline-flex", alignItems: "center", maxWidth: "260px" }}>
                <span aria-hidden="true" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selectedSubject}
                </span>
                <select
                  id="subject-select"
                  aria-label="Subject"
                  value={selectedSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", fontSize: "1rem" }}
                >
                  {semesterSubjects.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name} ({s.code})
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
                <a href="#main" aria-current="page">Past Question Papers</a>
              </li>
            </ol>
          </nav>

          {/* Quick Nav Bridge Links */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Link
              href={`/syllabus?sem=${selectedSemester}&code=${encodeURIComponent(semesterSubjects.find(s => s.name === selectedSubject)?.code || "")}`}
              className="btn btn--quiet"
              style={{ fontSize: "0.78rem", padding: "0.25rem 0.65rem" }}
            >
              Syllabus
            </Link>
            <Link
              href={`/notes?sem=${selectedSemester}&subject=${encodeURIComponent(selectedSubject)}`}
              className="btn btn--quiet"
              style={{ fontSize: "0.78rem", padding: "0.25rem 0.65rem" }}
            >
              Study Notes
            </Link>
          </div>
        </div>
      </header>

      {/* Main Shell */}
      <div className="shell">
        {/* Left Rail: Papers & Question List */}
        <aside className="rail" aria-label="Past Papers">
          <div id="rail-content">
            <h2 className="course-title">{selectedSubject}</h2>
            <p className="course-meta">
              Semester {selectedSemester} &middot; {availablePapers.length} Question Papers on Record
            </p>

            {/* Paper Switcher Tabs */}
            {availablePapers.length > 1 && (
              <div style={{ margin: "1rem 0 0.5rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {availablePapers.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPaperId(p.id)}
                    style={{
                      padding: "0.25rem 0.6rem",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      border: "1px solid var(--line-subtle)",
                      background: p.id === activePaper?.id ? "var(--ink-1)" : "var(--paper-1)",
                      color: p.id === activePaper?.id ? "var(--paper-1)" : "var(--ink-2)",
                      cursor: "pointer",
                    }}
                  >
                    {p.year} Regular
                  </button>
                ))}
              </div>
            )}

            {/* Questions Tree */}
            {activePaper ? (
              <div className="unit-nav-tree" style={{ marginTop: "1rem" }}>
                {Object.entries(groupedQuestions).map(([groupTitle, questions], gIdx) => (
                  <details
                    key={gIdx}
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
                      <span>{groupTitle}</span>
                      <span style={{ fontSize: "0.7rem", color: "var(--ink-3)" }}>
                        {questions.length} Qs
                      </span>
                    </summary>

                    <ul className="tree" style={{ padding: "0.25rem 0.5rem", margin: 0 }}>
                      {questions.map((q, qIdx) => (
                        <li key={q.id} style={{ marginBottom: "0.2rem" }}>
                          <a
                            href={`#q-${q.id}`}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "0.4rem",
                              padding: "0.25rem 0.4rem",
                              fontSize: "0.78rem",
                              textDecoration: "none",
                            }}
                          >
                            <span className="code" style={{ fontSize: "0.7rem", minWidth: "1.6rem" }}>
                              Q{qIdx + 1}
                            </span>
                            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {q.questionText}
                            </span>
                            <span className="dot" data-state="learned" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            ) : (
              <div style={{ marginTop: "1.5rem", padding: "1rem", background: "var(--paper-2)", borderRadius: "6px", fontSize: "0.82rem", color: "var(--ink-3)" }}>
                No past question paper records uploaded for this subject yet.
              </div>
            )}

            {/* Pro Monetization Card */}
            <div style={{ marginTop: "1.5rem", padding: "0.85rem", background: "linear-gradient(135deg, rgba(238, 242, 255, 0.95), rgba(245, 243, 255, 0.95))", border: "1px solid rgba(199, 210, 254, 0.7)", borderRadius: "8px", fontSize: "0.78rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 700, marginBottom: "0.35rem", color: "#4338ca" }}>
                <span style={{ display: "inline-block", width: "7px", height: "7px", borderRadius: "50%", background: "#4f46e5" }}></span>
                ExamAI Pro &bull; Past Paper Solver
              </div>
              <p style={{ margin: "0 0 0.6rem", color: "#475569", lineHeight: 1.45 }}>
                Get turn-by-turn interactive Socratic AI tutor answers, code breakdowns, and scoring rubrics for every question.
              </p>
              <Link
                href="/pricing"
                className="btn btn--primary"
                style={{ width: "100%", justifyContent: "center", fontSize: "0.76rem", padding: "0.4rem 0.6rem", gap: "0.35rem", textDecoration: "none" }}
              >
                <span>Unlock Pro Solutions</span>
                <span className="code">&rarr;</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content Area: Authentic Past Paper */}
        <main id="main" className="sheet" tabIndex={-1}>
          {activePaper ? (
            <article className="prose" lang="en">
              {/* Paper Board Header */}
              <div
                style={{
                  border: "2px solid var(--ink-1)",
                  padding: "1.25rem",
                  borderRadius: "8px",
                  background: "var(--paper-1)",
                  marginBottom: "2rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-2)" }}>
                  Purbanchal University &middot; Faculty of Science &amp; Technology
                </div>
                <h1 style={{ margin: "0.5rem 0 0.25rem", fontSize: "1.5rem", fontWeight: 800 }}>
                  Bachelor in Information Technology (BIT) &mdash; Semester {activePaper.semester}
                </h1>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--ink-1)" }}>
                  {activePaper.subject} ({activePaper.subjectCode}) &mdash; {activePaper.year} Regular
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    marginTop: "0.85rem",
                    paddingTop: "0.65rem",
                    borderTop: "1px dashed var(--line-subtle)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "var(--ink-2)",
                  }}
                >
                  <span>Full Marks: {activePaper.totalMarks}</span>
                  <span>Pass Marks: {activePaper.passMarks}</span>
                  <span>Time: {activePaper.timeHours} Hours</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="block block--example" style={{ marginBottom: "2rem" }}>
                <p className="block__label">
                  <svg className="icon" aria-hidden="true"><use href="#i-check" /></svg>
                  Examination Candidate Instructions
                </p>
                <p style={{ margin: 0, fontSize: "0.88rem" }}>
                  Candidates are required to give their answers in their own words as far as practicable. Figures in the margin indicate full marks.
                </p>
              </div>

              {/* Questions Rendered by Group */}
              {Object.entries(groupedQuestions).map(([groupTitle, questions], gIdx) => (
                <section key={gIdx} style={{ marginBottom: "2.5rem" }}>
                  <div
                    style={{
                      borderBottom: "2px solid var(--ink-1)",
                      paddingBottom: "0.35rem",
                      marginBottom: "1.25rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{groupTitle}</h2>
                    <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--ink-3)" }}>
                      Attempt all questions
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {questions.map((q, qIdx) => (
                      <div
                        key={q.id}
                        id={`q-${q.id}`}
                        style={{
                          padding: "1.2rem",
                          border: "1px solid var(--line-subtle)",
                          borderRadius: "8px",
                          background: "var(--paper-1)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.6rem" }}>
                          <span style={{ fontSize: "0.8rem", fontWeight: 800, padding: "0.2rem 0.5rem", borderRadius: "4px", background: "var(--ink-1)", color: "var(--paper-1)" }}>
                            Q{qIdx + 1}
                          </span>
                          <span style={{ fontSize: "0.8rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: "4px", background: "var(--paper-2)", color: "var(--ink-1)", border: "1px solid var(--line-subtle)" }}>
                            [{q.marks} Marks]
                          </span>
                        </div>

                        <div style={{ fontSize: "1rem", fontWeight: 600, lineHeight: 1.5, color: "var(--ink-1)", margin: "0 0 0.5rem" }}>
                          <MathRenderer content={q.questionText} inline={true} />
                        </div>

                        {q.orQuestionText && (
                          <div style={{ margin: "0.75rem 0", padding: "0.6rem", background: "var(--paper-2)", borderRadius: "6px", borderLeft: "3px solid var(--accent-1, #2563eb)" }}>
                            <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--ink-3)" }}>OR:</span>
                            <div style={{ margin: "0.2rem 0 0", fontSize: "0.92rem", fontWeight: 600 }}>
                              <MathRenderer content={q.orQuestionText} inline={true} />
                            </div>
                          </div>
                        )}

                        <div style={{ marginTop: "1rem", padding: "0.75rem", background: "var(--paper-2)", borderRadius: "6px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                            <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--ink-2)" }}>
                              Verified Model Answer Key &bull; {q.chapterRef}
                            </span>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                              <Link
                                href={`/solution?sem=${selectedSemester}&subject=${encodeURIComponent(selectedSubject)}&qid=${q.id}`}
                                style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-1, #2563eb)", textDecoration: "none" }}
                              >
                                View Model Answer &rarr;
                              </Link>
                              <Link
                                href="/pricing"
                                style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4f46e5", background: "rgba(99, 102, 241, 0.12)", padding: "0.15rem 0.45rem", borderRadius: "4px", textDecoration: "none" }}
                              >
                                Pro AI Tutor &infin;
                              </Link>
                            </div>
                          </div>
                          <div style={{ margin: 0, fontSize: "0.88rem", color: "var(--ink-1)", lineHeight: 1.5 }}>
                            <MathRenderer content={q.solutionSummary} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </article>
          ) : (
            <div style={{ padding: "3rem", textAlign: "center" }}>
              <h2>Select a Subject</h2>
              <p style={{ color: "var(--ink-3)" }}>Please choose a subject from the header to view verified past examination papers.</p>
            </div>
          )}
        </main>

        {/* Right Rail: TOC */}
        <aside className="toc" aria-label="On this page">
          <div id="toc-content">
            <h2>Exam Sections</h2>
            <ol className="toc-list">
              {Object.keys(groupedQuestions).map((groupTitle, idx) => (
                <li key={idx}>
                  <a href={`#main`}>{groupTitle}</a>
                </li>
              ))}
            </ol>

            <div className="toc-section" style={{ marginTop: "1.5rem" }}>
              <h2>Subject Info</h2>
              <p style={{ margin: "0.25rem 0", fontSize: "0.85rem", color: "var(--ink-2)" }}>
                <strong>{selectedSubject}</strong>
              </p>
              <p style={{ margin: "0.25rem 0", fontSize: "0.82rem", color: "var(--ink-3)" }}>
                Semester {selectedSemester} &bull; PU Syllabus
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default function PastPapersPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
          <p>Loading past question papers...</p>
        </div>
      }
    >
      <PastPapersContent />
    </Suspense>
  );
}
