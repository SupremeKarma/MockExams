"use client";

import { useEffect, useState, useMemo } from "react";
import { bitSyllabusData } from "@/data/bitSyllabusData";
import type { SubjectInfo } from "@/data/bitSyllabusData";

function generateSubjectHTML(subject: SubjectInfo, semester: number): string {
  // Generate table of contents entries
  const tocItems: string[] = [];
  if (subject.syllabusUnits && subject.syllabusUnits.length > 0) {
    subject.syllabusUnits.forEach((unit, idx) => {
      tocItems.push(
        `<li><a href="#unit-${idx + 1}">Unit ${idx + 1}: ${unit.title.substring(0, 40)}</a></li>`
      );
    });
  } else {
    subject.keyUnits.forEach((unit, idx) => {
      tocItems.push(`<li><a href="#unit-${idx + 1}">Unit ${idx + 1}: ${unit.substring(0, 40)}</a></li>`);
    });
  }

  // Generate unit sections
  let unitSections = "";
  if (subject.syllabusUnits && subject.syllabusUnits.length > 0) {
    unitSections = subject.syllabusUnits
      .map((unit, idx) => {
        const subtopicsHTML = unit.subtopics
          ?.map((sub) => `<li>${sub}</li>`)
          .join("\n");
        return `<h2 id="unit-${idx + 1}">Unit ${idx + 1}: ${unit.title} <small>&mdash; ${unit.teachingHours} hrs</small></h2>
      <ul>${subtopicsHTML || ""}</ul>`;
      })
      .join("\n");
  } else {
    unitSections = subject.keyUnits
      .map(
        (unit, idx) =>
          `<h2 id="unit-${idx + 1}">Unit ${idx + 1}: ${unit}</h2>`
      )
      .join("\n");
  }

  // Generate lab work section
  const labWorkHTML =
    subject.labWork && subject.labWork.length > 0
      ? `<div class="block block--example">
        <p class="block__label"><svg class="icon" aria-hidden="true"><use href="#i-grid"/></svg>Lab work</p>
        <ul>${subject.labWork.map((work) => `<li>${work}</li>`).join("\n")}</ul>
      </div>`
      : "";

  // Generate reference books section
  const refBooksHTML =
    subject.referenceBooks && subject.referenceBooks.length > 0
      ? `<h2 id="reference-books">Reference books</h2>
      <ul>${subject.referenceBooks.map((book) => `<li>${book}</li>`).join("\n")}</ul>`
      : "";

  return `<article class="prose" lang="en">
      <h1 id="top">${subject.name} &mdash; Syllabus</h1>
      <div class="lesson-meta">
        <span class="trust" data-level="teacher-verified">Official syllabus</span>
        <span>${subject.code} &middot; Semester ${semester} &middot; ${subject.credits} credits · ${subject.type}</span>
      </div>

      <div class="block block--idea">
        <p class="block__label"><svg class="icon" aria-hidden="true"><use href="#i-bulb"/></svg>Course objective</p>
        <p>${subject.description}</p>
      </div>

      ${unitSections}
      ${labWorkHTML}
      ${refBooksHTML}

      <div class="lesson-end">
        <button class="btn btn--primary" type="button" data-learned aria-pressed="false">
          <svg class="icon" aria-hidden="true"><use href="#i-check"/></svg><span>Mark as learned</span>
        </button>
        <button class="btn btn--quiet" type="button">Report a mistake</button>
      </div>

      <nav class="pager" aria-label="Topics">
        <a href="#main" rel="prev"><small>Previous subject</small>In Semester ${semester}</a>
        <a href="#main" rel="next"><small>Next subject</small>${subject.name}</a>
      </nav>
    </article>`;
}

function generateRailContent(subject: SubjectInfo, semester: number): string {
  // Generate rail navigation tree
  let unitList = "";
  if (subject.syllabusUnits && subject.syllabusUnits.length > 0) {
    unitList = subject.syllabusUnits
      .map(
        (unit, idx) =>
          `<li><a href="#unit-${idx + 1}"><span class="code">${idx + 1}</span> ${unit.title}</a></li>`
      )
      .join("\n");
  } else {
    unitList = subject.keyUnits
      .map(
        (unit, idx) =>
          `<li><a href="#unit-${idx + 1}"><span class="code">${idx + 1}</span> ${unit}</a></li>`
      )
      .join("\n");
  }

  const totalHours = subject.syllabusUnits
    ?.reduce((sum, unit) => sum + unit.teachingHours, 0)
    .toString() || "45";

  return `<h2 class="course-title">${subject.name}</h2>
      <p class="course-meta">${subject.code}, semester ${semester}, ${totalHours} teaching hours</p>
      <ul class="tree">${unitList}</ul>
      <p class="rail-note">Official syllabus units for ${subject.code}, Purbanchal University BIT (May 2022 revision).</p>`;
}

function generateTocContent(subject: SubjectInfo): string {
  const tocItems: string[] = [];

  if (subject.syllabusUnits && subject.syllabusUnits.length > 0) {
    subject.syllabusUnits.forEach((unit, idx) => {
      tocItems.push(
        `<li><a href="#unit-${idx + 1}">Unit ${idx + 1}: ${unit.title.substring(0, 40)}</a></li>`
      );
    });
  } else {
    subject.keyUnits.forEach((unit, idx) => {
      tocItems.push(
        `<li><a href="#unit-${idx + 1}">Unit ${idx + 1}: ${unit.substring(0, 40)}</a></li>`
      );
    });
  }

  tocItems.push(`<li><a href="#reference-books">Reference books</a></li>`);

  return `<h2>On this page</h2>
      <ol class="toc-list">${tocItems.join("\n")}</ol>
      <div class="toc-section">
        <h2>Course info</h2>
        <p>${subject.code} &middot; ${subject.credits} credits · ${subject.type}</p>
      </div>`;
}

export default function SyllabusPage() {
  const [selectedSemester, setSelectedSemester] = useState(7);
  const [selectedCode, setSelectedCode] = useState("BIT401CO");
  const [bodyHTML, setBodyHTML] = useState("");
  const [railHTML, setRailHTML] = useState("");
  const [tocHTML, setTocHTML] = useState("");

  // Get all courses for current semester
  const semesterCourses = useMemo(() => {
    const sem = bitSyllabusData.find((s) => s.semester === selectedSemester);
    return sem?.subjects || [];
  }, [selectedSemester]);

  // Get selected course
  const selectedCourse = useMemo(() => {
    return semesterCourses.find((c) => c.code === selectedCode) || semesterCourses[0];
  }, [semesterCourses, selectedCode]);

  // Generate HTML when course changes
  useEffect(() => {
    if (selectedCourse) {
      setBodyHTML(generateSubjectHTML(selectedCourse, selectedSemester));
      setRailHTML(generateRailContent(selectedCourse, selectedSemester));
      setTocHTML(generateTocContent(selectedCourse));
    }
  }, [selectedCourse, selectedSemester]);

  // Generate subject options by semester
  const subjectOptions = bitSyllabusData
    .map(
      (sem) =>
        `<optgroup label="Semester ${sem.semester}">${sem.subjects
          .map((s) => `<option value="${s.code}">${s.name}</option>`)
          .join("")}</optgroup>`
    )
    .join("");

  const ICON_SVG = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></symbol>
    <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></symbol>
    <symbol id="i-list" viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/></symbol>
    <symbol id="i-tree" viewBox="0 0 24 24"><path d="M5 4v16M5 8h6M5 14h6M13 8h6M13 14h6"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="m8.5 12.2 2.3 2.3 4.7-4.9"/></symbol>
    <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></symbol>
    <symbol id="i-bulb" viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z"/></symbol>
    <symbol id="i-grid" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M4 16h16M10 4v16M16 4v16"/></symbol>
    <symbol id="i-pen" viewBox="0 0 24 24"><path d="m14.5 5.5 4 4L9 19H5v-4l9.5-9.5Z"/><path d="m13 7 4 4"/></symbol>
    <symbol id="i-alert" viewBox="0 0 24 24"><path d="M12 4 3 20h18L12 4Z"/><path d="M12 10v4M12 17h.01"/></symbol>
    <symbol id="i-back" viewBox="0 0 24 24"><path d="M14 6 8 12l6 6"/></symbol>
    <symbol id="i-forward" viewBox="0 0 24 24"><path d="m10 6 6 6-6 6"/></symbol>
    <symbol id="i-refresh" viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/></symbol>
  </svg>`;

  const STYLES = `<style>
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
  </style>`;

  useEffect(() => {
    // Setup interactivity
    const root = document.documentElement;
    const sizes = ["s", "m", "l", "xl", "xxl"];
    const sizeNames: Record<string, string> = {
      s: "Smaller",
      m: "Default",
      l: "Large",
      xl: "Larger",
      xxl: "Largest",
    };

    document.querySelectorAll("[data-clone]").forEach(function (slot) {
      const source = document.getElementById(slot.getAttribute("data-clone")!);
      if (source) (slot.appendChild(source.cloneNode(true)) as Element).removeAttribute("id");
    });

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

    document.querySelector('[aria-label="Show or hide the curriculum panel"]')?.addEventListener("click", () => updateShellColumns());
    document.querySelector('[aria-label="Show or hide the on-this-page panel"]')?.addEventListener("click", () => updateShellColumns());
    window.addEventListener("resize", updateShellColumns);
    updateShellColumns();

    function syncControls() {
      ["theme", "font", "width", "spacing"].forEach(function (name) {
        document.querySelectorAll('input[name="' + name + '"]').forEach(function (input) {
          (input as HTMLInputElement).checked = root.getAttribute("data-" + name) === (input as HTMLInputElement).value;
          input.closest("label")?.classList.toggle("is-checked", (input as HTMLInputElement).checked);
        });
      });
    }

    document.querySelectorAll('.setting input[type="radio"]').forEach((input) => {
      input.addEventListener("change", (e: Event) => {
        const target = e.target as HTMLInputElement;
        root.setAttribute("data-" + target.name, target.value);
        syncControls();
      });
    });

    document.querySelectorAll("[data-size-step]").forEach((button) => {
      button.addEventListener("click", (e: Event) => {
        const target = e.target as HTMLElement;
        const i = sizes.indexOf(root.getAttribute("data-size") || "m");
        const next = Math.min(sizes.length - 1, Math.max(0, i + Number(target.getAttribute("data-size-step"))));
        root.setAttribute("data-size", sizes[next]);
        syncControls();
      });
    });

    document.querySelectorAll("[data-learned]").forEach((button) => {
      button.addEventListener("click", (e: Event) => {
        const target = e.target as HTMLElement;
        const learned = target.getAttribute("aria-pressed") !== "true";
        document.querySelectorAll("[data-learned]").forEach((b) => {
          b.setAttribute("aria-pressed", String(learned));
          const label = b.querySelector("span");
          if (label) label.textContent = (b.closest(".toolbar") ? "Learned" : learned ? "Learned" : "Mark as learned");
        });
      });
    });

    syncControls();

    return () => {
      window.removeEventListener("resize", updateShellColumns);
    };
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
        <a class="skip" href="#main">Skip to lesson</a>
        <div class="progress" aria-hidden="true"><span id="progress-bar"></span></div>
        ${STYLES}
        ${ICON_SVG}
        <header class="app-header">
          <div class="app-header__inner">
            <div style="display:flex;align-items:center;gap:0.15rem;margin-inline-end:0.35rem">
              <button class="icon-btn" type="button" onclick="history.back()" aria-label="Back">
                <svg class="icon"><use href="#i-back"/></svg>
              </button>
              <button class="icon-btn" type="button" onclick="history.forward()" aria-label="Forward">
                <svg class="icon"><use href="#i-forward"/></svg>
              </button>
              <button class="icon-btn" type="button" onclick="location.reload()" aria-label="Refresh">
                <svg class="icon"><use href="#i-refresh"/></svg>
              </button>
            </div>
            <span style="position:relative;display:inline-flex;align-items:center;margin-inline-end:0.5rem">
              <span class="wordmark" aria-hidden="true" style="padding-inline-end:1.15rem;white-space:nowrap">PU BIT (Nepal)</span>
            </span>
            <nav class="crumbs" aria-label="Breadcrumb">
              <ol>
                <li style="position:relative;display:inline-flex;align-items:center">
                  <span aria-hidden="true" style="white-space:nowrap">Semester ${selectedSemester}</span>
                  <select id="semester-select" aria-label="Semester" onchange="window.location.href='?sem='+this.value" style="position:absolute;inset:0;opacity:0;cursor:pointer;font-size:1rem">
                    ${Array.from({ length: 8 }, (_, i) => `<option value="${i + 1}" ${selectedSemester === i + 1 ? "selected" : ""}>Semester ${i + 1}</option>`).join("")}
                  </select>
                  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24" style="position:absolute;inset-inline-end:0;width:0.85rem;height:0.85rem;color:var(--ink-3);pointer-events:none"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </li>
                <li style="position:relative;display:inline-flex;align-items:center">
                  <span aria-hidden="true" style="white-space:nowrap">${selectedCourse?.name || "Loading..."}</span>
                  <select id="subject-select" aria-label="Subject" onchange="window.location.href='?sem=${selectedSemester}&course='+this.value" style="position:absolute;inset:0;opacity:0;cursor:pointer;font-size:1rem" value="${selectedCode}">
                    ${subjectOptions}
                  </select>
                </li>
                <li><a href="#main" aria-current="page">Syllabus</a></li>
              </ol>
            </nav>
          </div>
        </header>
        <div class="shell">
          <aside class="rail" aria-label="Curriculum">
            <div id="rail-content">${railHTML}</div>
          </aside>
          <main id="main" class="sheet" tabindex="-1">
            ${bodyHTML}
          </main>
          <aside class="toc" aria-label="On this page">
            <div id="toc-content">${tocHTML}</div>
          </aside>
        </div>
        <nav class="toolbar" aria-label="Lesson tools">
          <button type="button"><svg class="icon" aria-hidden="true"><use href="#i-tree"/></svg>Syllabus</button>
          <button type="button"><svg class="icon" aria-hidden="true"><use href="#i-list"/></svg>Contents</button>
          <button type="button" data-learned aria-pressed="false"><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg><span>Learned</span></button>
        </nav>
      `,
      }}
    />
  );
}
