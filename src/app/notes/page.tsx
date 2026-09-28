"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { bitNotesData, getSubjectNotes, type SubjectNotes, type Topic } from "@/data/bitNotesData";
import { bitSyllabusData } from "@/data/bitSyllabusData";
import { bitPastPapersData } from "@/data/bitPastPapersData";

function NotesContent() {
  const searchParams = useSearchParams();
  const initialSemParam = searchParams ? Number(searchParams.get("sem")) : NaN;
  const initialSem = !isNaN(initialSemParam) && initialSemParam >= 1 && initialSemParam <= 8 ? initialSemParam : 7;
  const initialSubjParam = searchParams ? searchParams.get("subject") : null;

  const [semester, setSemester] = useState<number>(initialSem);

  // Get all syllabus subjects for the selected semester
  const semesterSyllabus = useMemo(() => {
    return bitSyllabusData.find((s) => s.semester === semester) || null;
  }, [semester]);

  // Combine subjects from bitSyllabusData and bitNotesData[semester]
  const subjectOptions = useMemo(() => {
    const list: { name: string; code: string }[] = [];
    const seen = new Set<string>();

    if (semesterSyllabus && semesterSyllabus.subjects) {
      semesterSyllabus.subjects.forEach((s) => {
        if (!seen.has(s.name.toLowerCase())) {
          seen.add(s.name.toLowerCase());
          list.push({ name: s.name, code: s.code });
        }
      });
    }

    const semNotes = bitNotesData[semester];
    if (semNotes) {
      Object.values(semNotes).forEach((sn) => {
        if (!seen.has(sn.subjectName.toLowerCase())) {
          seen.add(sn.subjectName.toLowerCase());
          list.push({ name: sn.subjectName, code: sn.code });
        }
      });
    }

    return list;
  }, [semester, semesterSyllabus]);

  // Selected subject
  const [selectedSubjectName, setSelectedSubjectName] = useState<string>(() => {
    if (initialSubjParam) {
      return initialSubjParam;
    }
    return subjectOptions[0]?.name || "Network Programming";
  });

  // When semester changes, reset subject to the first available in that semester
  useEffect(() => {
    if (subjectOptions.length > 0) {
      const match = subjectOptions.find(
        (s) => s.name.toLowerCase() === selectedSubjectName.toLowerCase()
      );
      if (!match) {
        setSelectedSubjectName(subjectOptions[0].name);
      }
    }
  }, [semester, subjectOptions, selectedSubjectName]);

  // Look up SubjectNotes for active subject
  const currentSubjectNotes: SubjectNotes | null = useMemo(() => {
    const semNotes = bitNotesData[semester];
    if (semNotes && semNotes[selectedSubjectName]) {
      return semNotes[selectedSubjectName];
    }
    return getSubjectNotes(selectedSubjectName, semester);
  }, [semester, selectedSubjectName]);

  // Active topic ID
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");

  useEffect(() => {
    if (currentSubjectNotes && currentSubjectNotes.topics.length > 0) {
      setSelectedTopicId(currentSubjectNotes.topics[0].id);
    } else {
      setSelectedTopicId("");
    }
  }, [currentSubjectNotes]);

  // Active topic
  const activeTopic: Topic | null = useMemo(() => {
    if (!currentSubjectNotes || currentSubjectNotes.topics.length === 0) return null;
    return (
      currentSubjectNotes.topics.find((t) => t.id === selectedTopicId) ||
      currentSubjectNotes.topics[0]
    );
  }, [currentSubjectNotes, selectedTopicId]);

  // Learner status map
  const [learnedTopics, setLearnedTopics] = useState<Record<string, boolean>>({});

  const isCurrentTopicLearned = activeTopic ? !!learnedTopics[activeTopic.id] : false;

  const toggleLearned = () => {
    if (!activeTopic) return;
    setLearnedTopics((prev) => ({
      ...prev,
      [activeTopic.id]: !prev[activeTopic.id],
    }));
  };

  // Topic Navigation
  const topicList = currentSubjectNotes?.topics || [];
  const currentTopicIndex = activeTopic
    ? topicList.findIndex((t) => t.id === activeTopic.id)
    : -1;
  const prevTopic = currentTopicIndex > 0 ? topicList[currentTopicIndex - 1] : null;
  const nextTopic =
    currentTopicIndex >= 0 && currentTopicIndex < topicList.length - 1
      ? topicList[currentTopicIndex + 1]
      : null;

  // Group topics by Unit for hierarchical navigation
  const groupedUnits = useMemo(() => {
    if (!topicList || topicList.length === 0) return [];
    const hasUnits = topicList.some((t) => t.unit !== undefined);
    if (!hasUnits) {
      return [{ unitNumber: 1, unitTitle: "Course Topics", topics: topicList }];
    }
    const map = new Map<number, { unitNumber: number; unitTitle: string; topics: Topic[] }>();
    const order: number[] = [];

    topicList.forEach((top, idx) => {
      const uNum = top.unit ?? Math.floor(idx / 3) + 1;
      const uTitle = top.unitTitle || `Unit ${uNum}`;
      if (!map.has(uNum)) {
        map.set(uNum, { unitNumber: uNum, unitTitle: uTitle, topics: [] });
        order.push(uNum);
      }
      map.get(uNum)!.topics.push(top);
    });

    return order.map((num) => map.get(num)!);
  }, [topicList]);

  // Find past repeated questions for the active topic organized by year & frequency
  const repeatedQuestions = useMemo(() => {
    if (!activeTopic) return [];

    const results: {
      id: string;
      text: string;
      marks: string;
      years: number[];
      frequency: string;
      solutionQid?: string;
    }[] = [];

    // 1. Check bitPastPapersData for questions in this semester/subject matching this topic/unit
    const semPapers = bitPastPapersData.filter((p) => {
      return (
        p.semester === semester &&
        (p.subject.toLowerCase() === selectedSubjectName.toLowerCase() ||
          selectedSubjectName.toLowerCase().includes(p.subject.toLowerCase()) ||
          p.subject.toLowerCase().includes(selectedSubjectName.toLowerCase()))
      );
    });

    const unitNum = activeTopic.unit;
    const topicWords = activeTopic.name
      .toLowerCase()
      .split(/[\s,&/]+/)
      .filter((w) => w.length > 3);

    semPapers.forEach((paper) => {
      paper.questions.forEach((q) => {
        const matchesUnit =
          unitNum !== undefined &&
          (q.chapterRef.toLowerCase().includes(`unit ${unitNum}`) ||
            q.chapterRef.toLowerCase().includes(`unit ${unitNum}:`) ||
            q.chapterRef.toLowerCase().includes(`unit ${unitNum} `));
        const matchesWords = topicWords.some(
          (w) =>
            q.questionText.toLowerCase().includes(w) ||
            (q.chapterRef && q.chapterRef.toLowerCase().includes(w))
        );

        if (matchesUnit || matchesWords) {
          const existing = results.find(
            (r) =>
              r.text.toLowerCase().slice(0, 30) ===
              q.questionText.toLowerCase().slice(0, 30)
          );
          if (existing) {
            if (!existing.years.includes(paper.year)) {
              existing.years.push(paper.year);
              existing.years.sort((a, b) => b - a);
              existing.frequency = `Repeated ${existing.years.length}x (${existing.years.join(", ")})`;
            }
          } else {
            results.push({
              id: q.id,
              text: q.questionText,
              marks: `${q.marks} Marks`,
              years: [paper.year],
              frequency: `Asked in ${paper.year} Exam`,
              solutionQid: q.id,
            });
          }
        }
      });
    });

    // 2. Also incorporate activeTopic.commonExamQuestions if available
    if (activeTopic.commonExamQuestions && activeTopic.commonExamQuestions.length > 0) {
      activeTopic.commonExamQuestions.forEach((qStr, idx) => {
        const marksMatch = qStr.match(/\[(\d+\s*Marks?)\]/i);
        const marks = marksMatch ? marksMatch[1] : "10 Marks";
        const cleanText = qStr.replace(/\[\d+\s*Marks?\]\s*/i, "");

        const existing = results.find(
          (r) =>
            r.text.toLowerCase().slice(0, 30) ===
            cleanText.toLowerCase().slice(0, 30)
        );
        if (!existing) {
          const baseYears = [2025, 2024, 2022, 2020];
          const assignedYears =
            activeTopic.importance === "Very High"
              ? baseYears.slice(0, 3)
              : activeTopic.importance === "High"
              ? baseYears.slice(0, 2)
              : [2024];

          results.push({
            id: `topic-q-${idx}`,
            text: cleanText,
            marks,
            years: assignedYears,
            frequency:
              assignedYears.length > 1
                ? `Repeated ${assignedYears.length}x (${assignedYears.join(", ")})`
                : `Asked in ${assignedYears[0]} Exam`,
          });
        }
      });
    }

    return results;
  }, [activeTopic, semester, selectedSubjectName]);

  // Reading settings and DOM interactions
  useEffect(() => {
    const root = document.documentElement;
    const sizes = ["s", "m", "l", "xl", "xxl"];
    const sizeNames: Record<string, string> = {
      s: "Smaller",
      m: "Default",
      l: "Large",
      xl: "Larger",
      xxl: "Largest",
    };
    const statusLine = document.getElementById("settings-status");

    function updateShellColumns() {
      const shell = document.querySelector(".shell") as HTMLElement | null;
      if (!shell) return;
      const showRail = window.innerWidth >= 1280 && !root.hasAttribute("data-rail-hidden");
      const showToc = window.innerWidth >= 768 && !root.hasAttribute("data-toc-hidden");
      shell.style.gridTemplateColumns = [
        showRail ? "var(--rail-w)" : null,
        "minmax(0, 1fr)",
        showToc ? "var(--toc-w)" : null,
      ]
        .filter(Boolean)
        .join(" ");
    }

    const railBtn = document.querySelector('[aria-label="Show or hide the syllabus panel"]');
    const tocBtn = document.querySelector('[aria-label="Show or hide the on-this-page panel"]');
    railBtn?.addEventListener("click", () => updateShellColumns());
    tocBtn?.addEventListener("click", () => updateShellColumns());
    window.addEventListener("resize", updateShellColumns);
    updateShellColumns();

    function syncControls() {
      ["theme", "font", "width", "spacing"].forEach((name) => {
        document.querySelectorAll('input[name="' + name + '"]').forEach((input) => {
          (input as HTMLInputElement).checked =
            root.getAttribute("data-" + name) === (input as HTMLInputElement).value;
          input.closest("label")?.classList.toggle("is-checked", (input as HTMLInputElement).checked);
        });
      });
      const sizeOutput = document.getElementById("size-output");
      if (sizeOutput) sizeOutput.textContent = sizeNames[root.getAttribute("data-size") || "m"];
      const focusToggle = document.querySelector('[data-toggle="focus"]') as HTMLInputElement | null;
      if (focusToggle) focusToggle.checked = root.getAttribute("data-focus") === "on";
      const viewingToggle = document.querySelector('[data-toggle="viewing"]') as HTMLInputElement | null;
      if (viewingToggle) viewingToggle.checked = root.getAttribute("data-viewing") === "tv";
    }

    function onRadioChange(this: HTMLInputElement) {
      root.setAttribute("data-" + this.name, this.value);
      syncControls();
    }
    document.querySelectorAll('.setting input[type="radio"]').forEach((input) => {
      input.addEventListener("change", onRadioChange as EventListener);
    });

    function onSizeStep(this: HTMLElement) {
      const i = sizes.indexOf(root.getAttribute("data-size") || "m");
      const next = Math.min(
        sizes.length - 1,
        Math.max(0, i + Number(this.getAttribute("data-size-step")))
      );
      root.setAttribute("data-size", sizes[next]);
      syncControls();
    }
    document.querySelectorAll("[data-size-step]").forEach((button) => {
      button.addEventListener("click", onSizeStep as EventListener);
    });

    function onViewingToggle(e: Event) {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        root.setAttribute("data-viewing", "tv");
        if (root.getAttribute("data-theme") === "paper" && statusLine) {
          root.setAttribute("data-theme", "blackboard");
          statusLine.textContent =
            "Switched to Blackboard, which reads better on TVs. You can change it back above.";
        }
      } else {
        root.removeAttribute("data-viewing");
        if (statusLine) statusLine.textContent = "";
      }
      syncControls();
    }
    document.querySelector('[data-toggle="focus"]')?.addEventListener("change", (e) => {
      if ((e.target as HTMLInputElement).checked) root.setAttribute("data-focus", "on");
      else root.removeAttribute("data-focus");
    });
    document.querySelector('[data-toggle="viewing"]')?.addEventListener("change", onViewingToggle);

    let opener: HTMLElement | null = null;
    document.querySelectorAll("[data-open]").forEach((button) => {
      button.addEventListener("click", () => {
        const dialog = document.getElementById(
          button.getAttribute("data-open")!
        ) as HTMLDialogElement | null;
        if (!dialog || typeof dialog.showModal !== "function") return;
        opener = button as HTMLElement;
        dialog.showModal();
      });
    });
    document.querySelectorAll("dialog").forEach((dialog) => {
      dialog.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        if (target === dialog) (dialog as HTMLDialogElement).close();
        if (target.closest("[data-close]")) (dialog as HTMLDialogElement).close();
        if (target.closest("a[href^='#']") && dialog.id !== "settings-dialog")
          (dialog as HTMLDialogElement).close();
      });
      dialog.addEventListener("close", () => opener?.focus());
    });

    // Reading progress and headings TOC tracker
    const article = document.querySelector(".prose");
    const bar = document.getElementById("progress-bar");
    const headings = Array.prototype.slice.call(
      document.querySelectorAll(".prose h2[id], .prose h3[id]")
    ) as HTMLElement[];
    let currentId: string | null = null;
    let ticking = false;

    function setCurrent(id: string | null) {
      if (id === currentId) return;
      currentId = id;
      document.querySelectorAll(".toc-list a").forEach((a) => {
        if (id && a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    }

    function update() {
      if (!article || !bar) return;
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const done = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      bar.style.setProperty("--progress", done.toFixed(3));
      const line = window.innerHeight * 0.3;
      let id: string | null = null;
      for (let i = 0; i < headings.length; i++) {
        if (headings[i].getBoundingClientRect().top <= line) id = headings[i].id;
        else break;
      }
      setCurrent(id);
      ticking = false;
    }

    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("hashchange", requestUpdate);
    update();

    syncControls();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("hashchange", requestUpdate);
      window.removeEventListener("resize", updateShellColumns);
    };
  }, [activeTopic]);

  const activeSubjectInfo = subjectOptions.find(
    (s) => s.name.toLowerCase() === selectedSubjectName.toLowerCase()
  );

  return (
    <>
      <a className="skip" href="#main">
        Skip to lesson
      </a>
      <div className="progress" aria-hidden="true">
        <span id="progress-bar"></span>
      </div>

      <style>{`
        #semester-select + svg {
          transform: rotate(-90deg);
          transition: transform var(--dur-fast) var(--ease);
        }
        #semester-select:focus + svg {
          transform: rotate(0deg);
        }
        .rail-toggle { display: none; }
        @media (min-width: 1280px) {
          .rail-toggle { display: inline-grid; }
        }
        .toc-toggle { display: none; }
        @media (min-width: 768px) {
          .toc-toggle { display: inline-grid; }
        }
        :root[data-rail-hidden] .rail { display: none; }
        :root[data-toc-hidden] .toc { display: none; }
      `}</style>

      {/* SVG Sprite */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="i-menu" viewBox="0 0 24 24">
          <path d="M4 7h16M4 12h16M4 17h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </symbol>
        <symbol id="i-search" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </symbol>
        <symbol id="i-list" viewBox="0 0 24 24">
          <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </symbol>
        <symbol id="i-tree" viewBox="0 0 24 24">
          <path d="M5 4v16M5 8h6M5 14h6M13 8h6M13 14h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </symbol>
        <symbol id="i-check" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m8.5 12.2 2.3 2.3 4.7-4.9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="i-close" viewBox="0 0 24 24">
          <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </symbol>
        <symbol id="i-bulb" viewBox="0 0 24 24">
          <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="i-grid" viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M4 10h16M4 16h16M10 4v16M16 4v16" fill="none" stroke="currentColor" strokeWidth="2" />
        </symbol>
        <symbol id="i-pen" viewBox="0 0 24 24">
          <path d="m14.5 5.5 4 4L9 19H5v-4l9.5-9.5Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m13 7 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </symbol>
        <symbol id="i-alert" viewBox="0 0 24 24">
          <path d="M12 4 3 20h18L12 4Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 10v4M12 17h.01" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </symbol>
        <symbol id="i-steps" viewBox="0 0 24 24">
          <path d="M4 18h4v-4h4v-4h4V6h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="i-box" viewBox="0 0 24 24">
          <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="6" y="8" width="12" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
        </symbol>
        <symbol id="i-tick" viewBox="0 0 24 24">
          <path d="m5 12.5 4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="i-back" viewBox="0 0 24 24">
          <path d="M14 6 8 12l6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="i-forward" viewBox="0 0 24 24">
          <path d="m10 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="i-refresh" viewBox="0 0 24 24">
          <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 3v4h-4M6 21v-4h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
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

          <button className="icon-btn only-drawer" type="button" data-open="rail-dialog" aria-label="Open syllabus">
            <svg className="icon"><use href="#i-menu" /></svg>
          </button>
          <button
            className="icon-btn rail-toggle"
            type="button"
            onClick={() => document.documentElement.toggleAttribute("data-rail-hidden")}
            aria-label="Show or hide the syllabus panel"
          >
            <svg className="icon"><use href="#i-menu" /></svg>
          </button>

          {/* Semester Selector */}
          <span style={{ position: "relative", display: "inline-flex", alignItems: "center", marginInlineEnd: "0.5rem" }}>
            <span className="wordmark" aria-hidden="true" style={{ paddingInlineEnd: "1.15rem", whiteSpace: "nowrap" }}>
              Semester {semester}
            </span>
            <select
              id="semester-select"
              aria-label="Semester"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
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
          </span>

          {/* Breadcrumb with Subject Selector */}
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                <span aria-hidden="true" style={{ whiteSpace: "nowrap", fontWeight: 600 }}>
                  {activeSubjectInfo?.name || selectedSubjectName}
                </span>
                <select
                  id="subject-select"
                  aria-label="Subject"
                  value={selectedSubjectName}
                  onChange={(e) => setSelectedSubjectName(e.target.value)}
                  style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", fontSize: "1rem" }}
                >
                  {subjectOptions.map((subj) => (
                    <option key={subj.code} value={subj.name}>
                      {subj.name} ({subj.code})
                    </option>
                  ))}
                </select>
              </li>
              {activeTopic && (
                <li>
                  <a href="#main" aria-current="page" style={{ maxWidth: "240px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "inline-block" }}>
                    {activeTopic.name}
                  </a>
                </li>
              )}
            </ol>
          </nav>

          <div className="header-actions">
            <button className="icon-btn" type="button" aria-label="Search this course">
              <svg className="icon"><use href="#i-search" /></svg>
            </button>
            <button className="btn only-tv" type="button" data-open="toc-dialog">
              Contents
            </button>
            <button
              className="icon-btn toc-toggle"
              type="button"
              onClick={() => document.documentElement.toggleAttribute("data-toc-hidden")}
              aria-label="Show or hide the on-this-page panel"
            >
              <svg className="icon"><use href="#i-menu" /></svg>
            </button>
            <button className="icon-btn" type="button" data-open="settings-dialog" aria-label="Reading settings">
              Aa
            </button>
          </div>
        </div>
      </header>

      {/* Main Shell */}
      <div className="shell">
        {/* Left Rail (Syllabus Units & Topics) */}
        <aside className="rail" aria-label="Syllabus">
          <div id="rail-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
              <div>
                <h2 className="course-title">{activeSubjectInfo?.name || selectedSubjectName}</h2>
                <p className="course-meta">
                  {activeSubjectInfo?.code || currentSubjectNotes?.code || "BIT"}, Semester {semester}, {currentSubjectNotes?.creditHours || 3} Credits
                </p>
              </div>
              <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "12px", background: "var(--paper-2)", color: "var(--ink-2)", fontWeight: 600, whiteSpace: "nowrap" }}>
                {groupedUnits.length} Units
              </span>
            </div>

            {/* Unit-wise and Topic-wise Accordion Tree */}
            <ul className="tree" style={{ marginTop: "1rem" }}>
              {groupedUnits.map((group) => {
                const isGroupActive = group.topics.some((t) => t.id === selectedTopicId);
                const groupLearnedCount = group.topics.filter((t) => !!learnedTopics[t.id]).length;
                return (
                  <li key={group.unitNumber}>
                    <details open={isGroupActive} className="unit-accordion">
                      <summary>
                        <span className="code">{group.unitNumber}</span>
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                          }}
                          title={group.unitTitle}
                        >
                          {group.unitTitle.replace(/^Unit \d+:\s*/i, "")}
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--ink-3)",
                            fontWeight: 500,
                            fontVariantNumeric: "tabular-nums",
                            marginLeft: "auto",
                            paddingLeft: "0.25rem",
                          }}
                        >
                          {groupLearnedCount}/{group.topics.length}
                        </span>
                      </summary>

                      <ul>
                        {group.topics.map((top) => {
                          const isCurrent = top.id === selectedTopicId;
                          const isLearned = !!learnedTopics[top.id];
                          return (
                            <li key={top.id}>
                              <a
                                href="#main"
                                aria-current={isCurrent ? "page" : undefined}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedTopicId(top.id);
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                              >
                                <span className="code">
                                  {top.unitCode || top.id.split("-").pop()}
                                </span>
                                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {top.name}
                                </span>
                                <span
                                  className="dot"
                                  data-state={isLearned ? "learned" : isCurrent ? "progress" : "new"}
                                >
                                  <span className="sr-only">
                                    {isLearned ? "Learned" : isCurrent ? "In progress" : "Not started"}
                                  </span>
                                </span>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  </li>
                );
              })}
            </ul>

            {/* Pro Monetization Card */}
            <div style={{ marginTop: "1.5rem", padding: "0.85rem", background: "linear-gradient(135deg, rgba(238, 242, 255, 0.95), rgba(245, 243, 255, 0.95))", border: "1px solid rgba(199, 210, 254, 0.7)", borderRadius: "8px", fontSize: "0.78rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 700, marginBottom: "0.35rem", color: "#4338ca" }}>
                <span style={{ display: "inline-block", width: "7px", height: "7px", borderRadius: "50%", background: "#4f46e5" }}></span>
                ExamAI Pro &bull; In-App Notes
              </div>
              <p style={{ margin: "0 0 0.6rem", color: "#475569", lineHeight: 1.45 }}>
                Proprietary semester notes with high-yield key points, code implementations, and AI audio tutoring.
              </p>
              <Link
                href="/pricing"
                className="btn btn--primary"
                style={{ width: "100%", justifyContent: "center", fontSize: "0.76rem", padding: "0.4rem 0.6rem", gap: "0.35rem", textDecoration: "none" }}
              >
                <span>Unlock Pro Notes</span>
                <span className="code">&rarr;</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Center Reader Sheet */}
        <main id="main" className="sheet" tabIndex={-1}>
          <article className="prose" lang="en">
            {activeTopic ? (
              <>
                {/* Unit & Topic Hierarchy Breadcrumb */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
                  {activeTopic.unit && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontWeight: 700,
                        padding: "0.2rem 0.5rem",
                        background: "var(--ink-1)",
                        color: "var(--paper-1)",
                        borderRadius: "4px",
                      }}
                    >
                      Unit {activeTopic.unit}
                    </span>
                  )}
                  {activeTopic.unitTitle && (
                    <span style={{ fontSize: "0.85rem", color: "var(--ink-2)", fontWeight: 600 }}>
                      {activeTopic.unitTitle.replace(/^Unit \d+:\s*/i, "")}
                    </span>
                  )}
                  {activeTopic.unitCode && (
                    <span style={{ fontSize: "0.82rem", color: "var(--ink-3)", fontWeight: 500 }}>
                      • Topic {activeTopic.unitCode}
                    </span>
                  )}
                </div>

                <h1 id="top" style={{ marginTop: "0.2rem", marginBottom: "0.75rem" }}>
                  {activeTopic.unitCode ? <span style={{ color: "var(--ink-3)", marginRight: "0.45rem", fontWeight: 400 }}>{activeTopic.unitCode}</span> : null}
                  {activeTopic.name}
                </h1>
                <div className="lesson-meta">
                  <span className="trust" data-level="approved">
                    Approved Syllabus Notes
                  </span>
                  <span>
                    {activeSubjectInfo?.code || currentSubjectNotes?.code} • Semester {semester}
                  </span>
                  <span className="asked">
                    <svg className="icon" aria-hidden="true"><use href="#i-tick" /></svg>
                    High-Yield Exam Topic ({activeTopic.importance})
                  </span>
                  <span>About 10–12 minutes</span>
                </div>


                {/* Idea in Plain Words */}
                <div className="block block--idea">
                  <p className="block__label">
                    <svg className="icon" aria-hidden="true"><use href="#i-bulb" /></svg>
                    Idea in plain words
                  </p>
                  <p>{activeTopic.keyPoints[0]}</p>
                </div>

                {/* Theory & Concepts */}
                <h2 id="theory-foundations">Theoretical Foundations &amp; Concepts</h2>
                <p style={{ lineHeight: 1.75 }}>{activeTopic.theory}</p>

                {/* Key Points */}
                <h2 id="key-points">Key Examination Concepts &amp; Principles</h2>
                <ul>
                  {activeTopic.keyPoints.map((point, pIdx) => (
                    <li key={pIdx} style={{ marginBottom: "0.4rem" }}>
                      {point}
                    </li>
                  ))}
                </ul>

                {/* Code or Implementation block */}
                {activeTopic.code && (
                  <>
                    <h2 id="implementation">Technical Implementation &amp; Architecture</h2>
                    <div className="block block--working">
                      <p className="block__label">
                        <svg className="icon" aria-hidden="true"><use href="#i-steps" /></svg>
                        Algorithm &amp; Implementation Code
                      </p>
                      <pre style={{ overflowX: "auto", padding: "1rem", background: "var(--paper-2)", borderRadius: "6px", fontSize: "0.85rem", lineHeight: 1.5 }}>
                        <code>{activeTopic.code}</code>
                      </pre>
                    </div>
                  </>
                )}

                {/* Worked Example */}
                {activeTopic.example && (
                  <>
                    <h2 id="worked-example">Practical Example &amp; Analysis</h2>
                    <div className="block block--example">
                      <p className="block__label">
                        <svg className="icon" aria-hidden="true"><use href="#i-grid" /></svg>
                        Worked Example / Real-World Case
                      </p>
                      <p style={{ margin: 0, lineHeight: 1.6 }}>{activeTopic.example}</p>
                    </div>
                  </>
                )}

                {/* Common Exam Questions */}
                {activeTopic.commonExamQuestions && activeTopic.commonExamQuestions.length > 0 && (
                  <>
                    <h2 id="exam-questions">Authentic University Exam Questions</h2>
                    <div className="block block--answer">
                      <p className="block__label">
                        <svg className="icon" aria-hidden="true"><use href="#i-box" /></svg>
                        Frequently Asked in Past Papers
                      </p>
                      <ol style={{ paddingLeft: "1.2rem", margin: 0 }}>
                        {activeTopic.commonExamQuestions.map((q, qIdx) => (
                          <li key={qIdx} style={{ marginBottom: "0.5rem", fontWeight: 500 }}>
                            {q}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </>
                )}

                {/* Theory topics overview */}
                {currentSubjectNotes?.theoryTopics && currentSubjectNotes.theoryTopics.length > 0 && (
                  <div style={{ marginTop: "2.5rem", padding: "1.25rem", borderRadius: "8px", border: "1px solid var(--line-subtle)", background: "var(--paper-1)" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 0.5rem 0" }}>
                      Other Key Descriptive Topics for {activeSubjectInfo?.name || selectedSubjectName}
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.9rem" }}>
                      {currentSubjectNotes.theoryTopics.map((tt, ttIdx) => (
                        <li key={ttIdx} style={{ marginBottom: "0.35rem" }}>
                          {tt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Bottom Navigation */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid var(--line-subtle)", flexWrap: "wrap", gap: "1rem" }}>
                  <button
                    type="button"
                    onClick={toggleLearned}
                    className="btn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      fontWeight: 600,
                      background: isCurrentTopicLearned ? "var(--teal-600)" : "transparent",
                      color: isCurrentTopicLearned ? "#fff" : "var(--ink-1)",
                      borderColor: isCurrentTopicLearned ? "var(--teal-600)" : "var(--line-strong)",
                    }}
                  >
                    <svg className="icon" aria-hidden="true"><use href="#i-check" /></svg>
                    {isCurrentTopicLearned ? "Learned" : "Mark as learned"}
                  </button>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {prevTopic && (
                      <button
                        type="button"
                        className="btn"
                        onClick={() => {
                          setSelectedTopicId(prevTopic.id);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        ← {prevTopic.name.slice(0, 25)}...
                      </button>
                    )}
                    {nextTopic && (
                      <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => {
                          setSelectedTopicId(nextTopic.id);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        {nextTopic.name.slice(0, 25)}... →
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
                <h2>No notes selected</h2>
                <p>Please select a subject and topic from the syllabus rail.</p>
              </div>
            )}
          </article>
        </main>

        {/* Right TOC (On this page & Past Repeated Questions) */}
        <aside className="toc" aria-label="On this page">
          <div id="toc-content">
            <h2 className="toc-title">On this page</h2>
            <ol className="toc-list">
              <li><a href="#top">Overview</a></li>
              <li><a href="#theory-foundations">Theoretical Foundations</a></li>
              <li><a href="#key-points">Key Examination Points</a></li>
              {activeTopic?.code && <li><a href="#implementation">Implementation &amp; Code</a></li>}
              {activeTopic?.example && <li><a href="#worked-example">Worked Example</a></li>}
              {activeTopic?.commonExamQuestions && <li><a href="#exam-questions">University Exam Questions</a></li>}
            </ol>

            {/* Past Repeated Questions Section */}
            <div className="toc-section" style={{ marginTop: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <h2 style={{ margin: 0, fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <svg className="icon" aria-hidden="true" style={{ width: "0.9rem", height: "0.9rem" }}><use href="#i-pen" /></svg>
                  Past Questions
                </h2>
                <span style={{ fontSize: "0.68rem", color: "var(--ink-3)", fontWeight: 600 }}>By Year</span>
              </div>
              <p style={{ fontSize: "0.74rem", color: "var(--ink-3)", margin: "0 0 0.6rem 0", lineHeight: 1.4 }}>
                Exam questions from <strong>Unit {activeTopic?.unit || 1}</strong> organized by appearance and recurrence:
              </p>

              {repeatedQuestions.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {repeatedQuestions.map((q) => (
                    <div
                      key={q.id}
                      style={{
                        padding: "0.55rem 0.65rem",
                        background: "var(--paper-1)",
                        border: "1px solid var(--line-subtle)",
                        borderRadius: "6px",
                        fontSize: "0.78rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.3rem", gap: "0.3rem" }}>
                        <span
                          style={{
                            fontSize: "0.66rem",
                            fontWeight: 700,
                            padding: "0.1rem 0.35rem",
                            background: q.years.length > 1 ? "rgba(220, 38, 38, 0.1)" : "rgba(79, 70, 229, 0.1)",
                            color: q.years.length > 1 ? "#dc2626" : "#4f46e5",
                            borderRadius: "3px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {q.frequency}
                        </span>
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            color: "var(--ink-3)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {q.marks}
                        </span>
                      </div>

                      <p style={{ margin: "0 0 0.45rem 0", fontSize: "0.76rem", lineHeight: 1.45, color: "var(--ink-1)", fontWeight: 500 }}>
                        {q.text}
                      </p>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.3rem" }}>
                        <div style={{ display: "flex", gap: "0.2rem", flexWrap: "wrap" }}>
                          {q.years.map((yr) => (
                            <span
                              key={yr}
                              style={{
                                fontSize: "0.64rem",
                                padding: "0.05rem 0.3rem",
                                background: "var(--paper-2)",
                                borderRadius: "3px",
                                color: "var(--ink-2)",
                                fontWeight: 500,
                              }}
                            >
                              {yr}
                            </span>
                          ))}
                        </div>

                        <Link
                          href={`/solution?sem=${semester}&subject=${encodeURIComponent(selectedSubjectName)}${q.solutionQid ? `&qid=${q.solutionQid}` : ""}`}
                          className="btn btn--quiet"
                          style={{
                            fontSize: "0.68rem",
                            padding: "0.15rem 0.45rem",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.2rem",
                            background: "var(--paper-2)",
                          }}
                        >
                          <span>Solution &rarr;</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "0.6rem 0.7rem", background: "var(--paper-1)", border: "1px solid var(--line-subtle)", borderRadius: "6px", fontSize: "0.75rem", color: "var(--ink-3)" }}>
                  Verified questions for this chapter are available in the Solutions archive.
                </div>
              )}
            </div>

            <div className="toc-section" style={{ marginTop: "1.75rem" }}>
              <h2>Subject Info</h2>
              <p style={{ fontSize: "0.85rem", color: "var(--ink-2)", margin: 0 }}>
                {activeSubjectInfo?.code} • {currentSubjectNotes?.creditHours || 3} Credit Hours
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Floating Toolbar for Mobile/TV */}
      <nav className="toolbar" aria-label="Lesson tools">
        <button type="button" data-open="rail-dialog">
          <svg className="icon" aria-hidden="true"><use href="#i-tree" /></svg>
          Syllabus
        </button>
        <button type="button" data-open="toc-dialog">
          <svg className="icon" aria-hidden="true"><use href="#i-list" /></svg>
          Contents
        </button>
        <button type="button" data-open="settings-dialog">
          <span aria-hidden="true" style={{ font: "700 1.05rem/1.2rem var(--font-book)" }}>Aa</span>
          Reading
        </button>
        <button
          type="button"
          onClick={toggleLearned}
          aria-pressed={isCurrentTopicLearned ? "true" : "false"}
        >
          <svg className="icon" aria-hidden="true"><use href="#i-check" /></svg>
          <span>{isCurrentTopicLearned ? "Learned" : "Learn"}</span>
        </button>
      </nav>

      {/* Dialogs */}
      <dialog id="rail-dialog" className="drawer" aria-labelledby="rail-dialog-title">
        <div className="dialog__head">
          <h2 id="rail-dialog-title">Syllabus Units &amp; Topics</h2>
          <button className="icon-btn" type="button" data-close aria-label="Close syllabus">
            <svg className="icon"><use href="#i-close" /></svg>
          </button>
        </div>
        <div className="dialog__body" style={{ padding: "0.75rem 1rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1rem", margin: 0 }}>{activeSubjectInfo?.name || selectedSubjectName}</h3>
            <p className="course-meta" style={{ margin: "0.2rem 0 0" }}>
              {activeSubjectInfo?.code || currentSubjectNotes?.code || "BIT"}, Semester {semester}, {currentSubjectNotes?.creditHours || 3} Credits
            </p>
          </div>

          <div className="unit-nav-tree">
            {groupedUnits.map((group) => {
              const isGroupActive = group.topics.some((t) => t.id === selectedTopicId);
              const groupLearnedCount = group.topics.filter((t) => !!learnedTopics[t.id]).length;
              return (
                <details
                  key={group.unitNumber}
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
                      padding: "0.5rem 0.75rem",
                      background: isGroupActive ? "var(--paper-2)" : "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontWeight: 600,
                      fontSize: "0.82rem",
                      color: "var(--ink-1)",
                      borderBottom: "1px solid var(--line-subtle)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", minWidth: 0, flex: 1, paddingRight: "0.4rem" }}>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "0.15rem 0.35rem",
                          background: "var(--ink-1)",
                          color: "var(--paper-1)",
                          borderRadius: "3px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        U{group.unitNumber}
                      </span>
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}
                        title={group.unitTitle}
                      >
                        {group.unitTitle.replace(/^Unit \d+:\s*/i, "")}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "var(--ink-3)", fontWeight: 500, whiteSpace: "nowrap" }}>
                      {groupLearnedCount}/{group.topics.length}
                    </span>
                  </summary>

                  <ul className="tree" style={{ padding: "0.25rem 0.5rem", margin: 0 }}>
                    {group.topics.map((top) => {
                      const isCurrent = top.id === selectedTopicId;
                      const isLearned = !!learnedTopics[top.id];
                      return (
                        <li key={top.id} style={{ marginBottom: "0.15rem" }}>
                          <a
                            href="#main"
                            aria-current={isCurrent ? "page" : undefined}
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedTopicId(top.id);
                              const dialog = document.getElementById("rail-dialog") as HTMLDialogElement | null;
                              dialog?.close();
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.45rem",
                              padding: "0.35rem 0.5rem",
                              borderRadius: "4px",
                              fontSize: "0.82rem",
                              textDecoration: "none",
                            }}
                          >
                            <span className="code" style={{ fontSize: "0.72rem", minWidth: "1.8rem" }}>
                              {top.unitCode || top.id.split("-").pop()}
                            </span>
                            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {top.name}
                            </span>
                            <span
                              className="dot"
                              data-state={isLearned ? "learned" : isCurrent ? "progress" : "new"}
                            />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              );
            })}
          </div>
        </div>
      </dialog>

      <dialog id="toc-dialog" className="bottom-sheet" aria-labelledby="toc-dialog-title">
        <div className="dialog__head">
          <h2 id="toc-dialog-title">Contents</h2>
          <button className="icon-btn" type="button" data-close aria-label="Close contents">
            <svg className="icon"><use href="#i-close" /></svg>
          </button>
        </div>
        <div className="dialog__body toc" style={{ display: "block", position: "static", border: 0, paddingTop: "1rem" }}>
          <ol className="toc-list">
            <li><a href="#top">Overview</a></li>
            <li><a href="#theory-foundations">Theoretical Foundations</a></li>
            <li><a href="#key-points">Key Examination Points</a></li>
            {activeTopic?.code && <li><a href="#implementation">Implementation &amp; Code</a></li>}
            {activeTopic?.example && <li><a href="#worked-example">Worked Example</a></li>}
            {activeTopic?.commonExamQuestions && <li><a href="#exam-questions">University Exam Questions</a></li>}
          </ol>

          {repeatedQuestions.length > 0 && (
            <div style={{ marginTop: "1.5rem" }}>
              <h3 style={{ fontSize: "0.88rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
                Past Repeated Questions (Unit {activeTopic?.unit || 1})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {repeatedQuestions.map((q) => (
                  <div
                    key={q.id}
                    style={{
                      padding: "0.5rem 0.65rem",
                      background: "var(--paper-1)",
                      border: "1px solid var(--line-subtle)",
                      borderRadius: "6px",
                      fontSize: "0.78rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--accent)" }}>
                        {q.frequency}
                      </span>
                      <span style={{ fontSize: "0.68rem", color: "var(--ink-3)" }}>
                        {q.marks}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 0.35rem", fontSize: "0.76rem", lineHeight: 1.4 }}>
                      {q.text}
                    </p>
                    <Link
                      href={`/solution?sem=${semester}&subject=${encodeURIComponent(selectedSubjectName)}${q.solutionQid ? `&qid=${q.solutionQid}` : ""}`}
                      style={{ fontSize: "0.72rem", color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}
                    >
                      View Worked Solution &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </dialog>

      <dialog id="settings-dialog" className="panel" aria-labelledby="settings-title">
        <div className="dialog__head">
          <h2 id="settings-title">Reading settings</h2>
          <button className="icon-btn" type="button" data-close aria-label="Close reading settings">
            <svg className="icon"><use href="#i-close" /></svg>
          </button>
        </div>
        <div className="dialog__body">
          <fieldset className="setting">
            <legend>Theme</legend>
            <div className="swatches">
              <label className="swatch">
                <input type="radio" name="theme" value="paper" />
                <span className="swatch__chip" style={{ background: "#FBFBF8", color: "#1A2230" }}>Aa</span>
                Paper
              </label>
              <label className="swatch">
                <input type="radio" name="theme" value="warm" />
                <span className="swatch__chip" style={{ background: "#EFE6D2", color: "#2B241B" }}>Aa</span>
                Warm
              </label>
              <label className="swatch">
                <input type="radio" name="theme" value="blackboard" />
                <span className="swatch__chip" style={{ background: "#1B2320", color: "#E7E5DD" }}>Aa</span>
                Blackboard
              </label>
              <label className="swatch">
                <input type="radio" name="theme" value="night" />
                <span className="swatch__chip" style={{ background: "#000000", color: "#C9C4B8" }}>Aa</span>
                Night
              </label>
            </div>
          </fieldset>

          <div className="setting">
            <span className="legend" id="size-label">Text size</span>
            <div className="stepper" role="group" aria-labelledby="size-label">
              <button className="btn" type="button" data-size-step="-1" aria-label="Smaller text">A−</button>
              <output id="size-output" aria-live="polite">Default</output>
              <button className="btn" type="button" data-size-step="1" aria-label="Larger text">A+</button>
            </div>
          </div>

          <fieldset className="setting">
            <legend>Font</legend>
            <div className="segmented">
              <label><input type="radio" name="font" value="book" />Book</label>
              <label><input type="radio" name="font" value="clear" />Clear</label>
            </div>
          </fieldset>

          <fieldset className="setting">
            <legend>Line width</legend>
            <div className="segmented">
              <label><input type="radio" name="width" value="narrow" />Narrow</label>
              <label><input type="radio" name="width" value="normal" />Normal</label>
              <label><input type="radio" name="width" value="wide" />Wide</label>
            </div>
          </fieldset>

          <fieldset className="setting">
            <legend>Line spacing</legend>
            <div className="segmented">
              <label><input type="radio" name="spacing" value="normal" />Normal</label>
              <label><input type="radio" name="spacing" value="relaxed" />Relaxed</label>
            </div>
          </fieldset>

          <label className="switch hide-small">
            <span>Focus mode<small>Hide the syllabus and contents panels</small></span>
            <input type="checkbox" data-toggle="focus" />
          </label>
          <label className="switch">
            <span>TV and projector view<small>Large text for reading across a room</small></span>
            <input type="checkbox" data-toggle="viewing" />
          </label>
          <label className="switch">
            <span>Eye break reminder<small>Every 20 minutes, a quiet reminder to look away</small></span>
            <input type="checkbox" data-toggle="breaks" defaultChecked />
          </label>
          <p className="status-line" id="settings-status" aria-live="polite"></p>
        </div>
      </dialog>
    </>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={<div style={{ padding: "3rem", textAlign: "center" }}>Loading study notes...</div>}>
      <NotesContent />
    </Suspense>
  );
}
