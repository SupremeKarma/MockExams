"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { bitSyllabusData } from "@/data/bitSyllabusData";
import { bitPastPapersData, type PastPaperQuestion } from "@/data/bitPastPapersData";
import { bitNotesData } from "@/data/bitNotesData";

function SolutionContent() {
  const searchParams = useSearchParams();
  const initialSemParam = searchParams ? Number(searchParams.get("sem")) : NaN;
  const initialSem = !isNaN(initialSemParam) && initialSemParam >= 1 && initialSemParam <= 8 ? initialSemParam : 7;
  const initialSubjParam = searchParams ? searchParams.get("subject") : null;
  const initialQidParam = searchParams ? searchParams.get("qid") : null;

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

  // Find all questions across past papers for this subject
  const subjectQuestions: { paperYear: number; question: PastPaperQuestion }[] = useMemo(() => {
    const list: { paperYear: number; question: PastPaperQuestion }[] = [];
    const matchedPapers = bitPastPapersData.filter((p) => {
      return (
        p.semester === selectedSemester &&
        (p.subject.toLowerCase() === selectedSubject.toLowerCase() ||
          selectedSubject.toLowerCase().includes(p.subject.toLowerCase()) ||
          p.subject.toLowerCase().includes(selectedSubject.toLowerCase()))
      );
    });

    matchedPapers.forEach((p) => {
      p.questions.forEach((q) => {
        list.push({ paperYear: p.year, question: q });
      });
    });

    return list;
  }, [selectedSemester, selectedSubject]);

  // Selected question ID
  const [selectedQid, setSelectedQid] = useState<string>(() => {
    if (initialQidParam) return initialQidParam;
    return subjectQuestions[0]?.question.id || "";
  });

  useEffect(() => {
    if (subjectQuestions.length > 0) {
      const exists = subjectQuestions.some((sq) => sq.question.id === selectedQid);
      if (!exists) {
        setSelectedQid(subjectQuestions[0].question.id);
      }
    } else {
      setSelectedQid("");
    }
  }, [subjectQuestions, selectedQid]);

  const activeQuestionItem = useMemo(() => {
    return subjectQuestions.find((sq) => sq.question.id === selectedQid) || subjectQuestions[0] || null;
  }, [subjectQuestions, selectedQid]);

  // Find corresponding topic from bitNotesData for deep theoretical answer
  const relatedNoteTopic = useMemo(() => {
    const semData = bitNotesData[selectedSemester];
    if (!semData) return null;
    const subNotes = Object.values(semData).find(
      (sn) =>
        sn.subjectName.toLowerCase() === selectedSubject.toLowerCase() ||
        selectedSubject.toLowerCase().includes(sn.subjectName.toLowerCase())
    );
    if (!subNotes) return null;

    if (activeQuestionItem) {
      const match = subNotes.topics.find((t) => {
        return (
          t.commonExamQuestions?.some((cq) =>
            cq.toLowerCase().includes(activeQuestionItem.question.questionText.slice(0, 20).toLowerCase())
          ) ||
          t.name.toLowerCase().includes(activeQuestionItem.question.chapterRef.toLowerCase()) ||
          activeQuestionItem.question.questionText.toLowerCase().includes(t.name.toLowerCase().slice(0, 15))
        );
      });
      if (match) return match;
    }
    return subNotes.topics[0] || null;
  }, [selectedSemester, selectedSubject, activeQuestionItem]);

  // Switch handlers
  const handleSemesterChange = (newSem: number) => {
    setSelectedSemester(newSem);
    const targetSem = bitSyllabusData.find((s) => s.semester === newSem);
    if (targetSem && targetSem.subjects.length > 0) {
      setSelectedSubject(targetSem.subjects[0].name);
      const url = new URL(window.location.href);
      url.searchParams.set("sem", String(newSem));
      url.searchParams.set("subject", targetSem.subjects[0].name);
      url.searchParams.delete("qid");
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleSubjectChange = (newSub: string) => {
    setSelectedSubject(newSub);
    const url = new URL(window.location.href);
    url.searchParams.set("sem", String(selectedSemester));
    url.searchParams.set("subject", newSub);
    url.searchParams.delete("qid");
    window.history.replaceState({}, "", url.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuestionSelect = (qid: string) => {
    setSelectedQid(qid);
    const url = new URL(window.location.href);
    url.searchParams.set("sem", String(selectedSemester));
    url.searchParams.set("subject", selectedSubject);
    url.searchParams.set("qid", qid);
    window.history.replaceState({}, "", url.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <a className="skip" href="#main">Skip to lesson</a>
      <div className="progress" aria-hidden="true"><span id="progress-bar"></span></div>

      {/* SVG Icon Symbols */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></symbol>
        <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m8.5 12.2 2.3 2.3 4.7-4.9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
        <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></symbol>
        <symbol id="i-back" viewBox="0 0 24 24"><path d="M14 6 8 12l6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
        <symbol id="i-forward" viewBox="0 0 24 24"><path d="m10 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
        <symbol id="i-refresh" viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M18 3v4h-4M6 21v-4h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
        <symbol id="i-pen" viewBox="0 0 24 24"><path d="m14.5 5.5 4 4L9 19H5v-4l9.5-9.5Z" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m13 7 4 4" fill="none" stroke="currentColor" strokeWidth="2" /></symbol>
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
              PU BIT Solutions
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
                <a href="#main" aria-current="page">Verified Solution</a>
              </li>
            </ol>
          </nav>

          {/* Quick Bridge Links */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Link
              href={`/past-papers?sem=${selectedSemester}&subject=${encodeURIComponent(selectedSubject)}`}
              className="btn btn--quiet"
              style={{ fontSize: "0.78rem", padding: "0.25rem 0.65rem" }}
            >
              Past Papers
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
        {/* Left Rail: Questions Navigator */}
        <aside className="rail" aria-label="Questions List">
          <div id="rail-content">
            <h2 className="course-title">{selectedSubject}</h2>
            <p className="course-meta">
              Semester {selectedSemester} &bull; {subjectQuestions.length} Model Answers
            </p>

            <div className="unit-nav-tree" style={{ marginTop: "1rem" }}>
              <ul className="tree">
                {subjectQuestions.map((sq, idx) => {
                  const isCurrent = sq.question.id === activeQuestionItem?.question.id;
                  return (
                    <li key={sq.question.id} style={{ marginBottom: "0.25rem" }}>
                      <a
                        href="#main"
                        aria-current={isCurrent ? "page" : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          handleQuestionSelect(sq.question.id);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.45rem",
                          padding: "0.35rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          textDecoration: "none",
                        }}
                      >
                        <span className="code" style={{ fontSize: "0.7rem", minWidth: "1.7rem" }}>
                          Q{idx + 1}
                        </span>
                        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {sq.question.questionText}
                        </span>
                        <span className="dot" data-state={isCurrent ? "progress" : "learned"} />
                      </a>
                    </li>
                  );
                })}
              </ul>

              {subjectQuestions.length === 0 && (
                <div style={{ marginTop: "1rem", padding: "0.75rem", background: "var(--paper-2)", borderRadius: "6px", fontSize: "0.8rem", color: "var(--ink-3)" }}>
                  No past question solutions indexed for this subject yet.
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area: Model Answer Formatted for Full University Marks */}
        <main id="main" className="sheet" tabIndex={-1}>
          {activeQuestionItem ? (
            <article className="prose" lang="en">
              {/* Question Banner */}
              <div style={{ padding: "1.25rem", background: "var(--paper-2)", border: "1px solid var(--line-subtle)", borderRadius: "8px", marginBottom: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.15rem 0.45rem", borderRadius: "4px", background: "var(--ink-1)", color: "var(--paper-1)" }}>
                    PU {activeQuestionItem.paperYear} Regular &bull; {activeQuestionItem.question.group}
                  </span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--ink-1)" }}>
                    Full Marks: {activeQuestionItem.question.marks}
                  </span>
                </div>
                <h1 style={{ margin: "0.5rem 0 0", fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.45, color: "var(--ink-1)" }}>
                  {activeQuestionItem.question.questionText}
                </h1>
                {activeQuestionItem.question.orQuestionText && (
                  <p style={{ margin: "0.5rem 0 0", fontSize: "0.88rem", color: "var(--ink-2)" }}>
                    <strong>Alternative:</strong> {activeQuestionItem.question.orQuestionText}
                  </p>
                )}
              </div>

              {/* Section 1: Core Concept Definition */}
              <section id="core-concept" style={{ marginBottom: "2rem" }}>
                <h2>1. Core Concept &amp; Direct Answer</h2>
                <div className="block block--idea">
                  <p className="block__label">
                    <svg className="icon" aria-hidden="true"><use href="#i-check" /></svg>
                    High-Yield Answer Summary
                  </p>
                  <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.6 }}>
                    {activeQuestionItem.question.solutionSummary}
                  </p>
                </div>
              </section>

              {/* Section 2: Detailed Point-Wise Examination Presentation */}
              <section id="point-wise" style={{ marginBottom: "2.5rem" }}>
                <h2>2. Detailed Point-Wise Examination Answer</h2>
                {relatedNoteTopic?.keyPoints && relatedNoteTopic.keyPoints.length > 0 ? (
                  <ul style={{ lineHeight: 1.65 }}>
                    {relatedNoteTopic.keyPoints.map((pt, pIdx) => (
                      <li key={pIdx} style={{ marginBottom: "0.75rem" }}>
                        {pt}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul style={{ lineHeight: 1.65 }}>
                    <li>
                      <strong>Definition &amp; Core Context:</strong> Answers must establish standard terminology and protocol standards per IEEE/RFC/ISO specifications.
                    </li>
                    <li>
                      <strong>Architectural Mechanism:</strong> Explain state diagrams, memory buffers, and algorithmic steps sequentially.
                    </li>
                    <li>
                      <strong>Comparative Analysis:</strong> Highlight performance implications, edge cases, and design trade-offs.
                    </li>
                  </ul>
                )}
              </section>

              {/* Section 3: Theory & Technical Exposition */}
              {relatedNoteTopic?.theory && (
                <section id="theory" style={{ marginBottom: "2.5rem" }}>
                  <h2>3. Theoretical Deep Dive &amp; Protocol Mechanism</h2>
                  <div style={{ whiteSpace: "pre-line", lineHeight: 1.7, fontSize: "0.95rem", color: "var(--ink-1)" }}>
                    {relatedNoteTopic.theory}
                  </div>
                </section>
              )}

              {/* Section 4: Implementation Code or Diagram */}
              {relatedNoteTopic?.code && (
                <section id="code" style={{ marginBottom: "2.5rem" }}>
                  <h2>4. Code Implementation &amp; System Calls</h2>
                  <pre
                    style={{
                      background: "var(--paper-2)",
                      border: "1px solid var(--line-subtle)",
                      borderRadius: "6px",
                      padding: "1rem",
                      overflowX: "auto",
                      fontSize: "0.85rem",
                      fontFamily: "var(--font-mono, monospace)",
                    }}
                  >
                    <code>{relatedNoteTopic.code}</code>
                  </pre>
                </section>
              )}

              {/* Section 5: Examiner Marking Scheme Rubric */}
              <section id="marking-scheme" style={{ marginBottom: "2.5rem" }}>
                <h2>5. University Examiner Marking Rubric</h2>
                <div style={{ padding: "1rem", background: "var(--paper-2)", borderRadius: "6px", border: "1px solid var(--line-subtle)" }}>
                  <div style={{ fontWeight: 700, marginBottom: "0.5rem", color: "var(--ink-1)" }}>
                    Score Distribution for {activeQuestionItem.question.marks} Marks:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.88rem", color: "var(--ink-2)", lineHeight: 1.6 }}>
                    <li><strong>Concept Definition &amp; Diagram:</strong> 40% of marks</li>
                    <li><strong>Step-by-Step Point-Wise Explanation:</strong> 40% of marks</li>
                    <li><strong>Real-World Example or Code Snippet:</strong> 20% of marks</li>
                  </ul>
                </div>

                {/* ExamAI Pro Evaluator Callout */}
                <div style={{ marginTop: "1.5rem", padding: "1.25rem", background: "linear-gradient(135deg, rgba(238, 242, 255, 0.95), rgba(245, 243, 255, 0.95))", border: "1px solid rgba(199, 210, 254, 0.7)", borderRadius: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, fontSize: "0.92rem", color: "#4338ca" }}>
                      <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#4f46e5" }}></span>
                      <span>Targeting 80/80 on this Subject?</span>
                    </div>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px", background: "#4f46e5", color: "white" }}>
                      EXAMAI PRO
                    </span>
                  </div>
                  <p style={{ margin: "0 0 1rem", fontSize: "0.86rem", color: "#475569", lineHeight: 1.5 }}>
                    Upgrade to ExamAI Pro to get unlimited Socratic tutoring on this question, direct AI examiner grading for your handwritten answers, and full past paper solution predictions.
                  </p>
                  <Link
                    href="/pricing"
                    className="btn btn--primary"
                    style={{ fontSize: "0.82rem", padding: "0.5rem 1rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <span>Upgrade to ExamAI Pro</span>
                    <span className="code">&rarr;</span>
                  </Link>
                </div>
              </section>

              {/* Navigation Actions */}
              <div className="lesson-end" style={{ marginTop: "2.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link
                  href={`/notes?sem=${selectedSemester}&subject=${encodeURIComponent(selectedSubject)}`}
                  className="btn btn--primary"
                >
                  Open Full Subject Notes &rarr;
                </Link>
                <Link
                  href={`/past-papers?sem=${selectedSemester}&subject=${encodeURIComponent(selectedSubject)}`}
                  className="btn btn--quiet"
                >
                  View Complete Past Paper
                </Link>
              </div>
            </article>
          ) : (
            <div style={{ padding: "3rem", textAlign: "center" }}>
              <h2>Select a Question</h2>
              <p style={{ color: "var(--ink-3)" }}>Please choose a subject and question from the left navigation rail.</p>
            </div>
          )}
        </main>

        {/* Right Rail: TOC */}
        <aside className="toc" aria-label="On this page">
          <div id="toc-content">
            <h2>Solution Structure</h2>
            <ol className="toc-list">
              <li><a href="#core-concept">1. Core Concept</a></li>
              <li><a href="#point-wise">2. Point-Wise Points</a></li>
              {relatedNoteTopic?.theory && <li><a href="#theory">3. Theoretical Details</a></li>}
              {relatedNoteTopic?.code && <li><a href="#code">4. Code Implementation</a></li>}
              <li><a href="#marking-scheme">5. Marking Rubric</a></li>
            </ol>

            <div className="toc-section" style={{ marginTop: "1.5rem" }}>
              <h2>Context</h2>
              <p style={{ margin: "0.25rem 0", fontSize: "0.85rem", color: "var(--ink-2)" }}>
                <strong>{selectedSubject}</strong>
              </p>
              <p style={{ margin: "0.25rem 0", fontSize: "0.82rem", color: "var(--ink-3)" }}>
                Chapter: {activeQuestionItem?.question.chapterRef || "PU Syllabus"}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default function SolutionPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
          <p>Loading verified model solution...</p>
        </div>
      }
    >
      <SolutionContent />
    </Suspense>
  );
}
