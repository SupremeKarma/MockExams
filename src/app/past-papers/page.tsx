"use client";

import { useEffect } from "react";

// Verbatim body content from docs/reference/ExamAI_Reader_Demo.html — pasted
// directly, not reinterpreted. tokens.css/reader.css/integration.css are
// already loaded by this route's layout.tsx, so no <style> block is needed
// here. Real note data gets wired back into this markup as a follow-up once
// this matches the demo exactly.
const BODY_HTML = `
<a class="skip" href="#main">Skip to lesson</a>
<div class="progress" aria-hidden="true"><span id="progress-bar"></span></div>

<style>
  /* Resting: points right, like the crumb's own ">" separator. Native
     <select> has no reliable cross-browser "open" state to hook, so :focus
     (the select stays focused while its option list is showing) stands in
     for it — rotate to point down only while that's true. Only the semester
     select gets this: the subject select sits inside .crumbs, where
     reader.css's own "li + li::before" rule already draws a ">" after it —
     a second chevron there doubled up the separator. */
  #semester-select + svg {
    transform: rotate(-90deg);
    transition: transform var(--dur-fast) var(--ease);
  }
  #semester-select:focus + svg {
    transform: rotate(0deg);
  }

  /* Desktop rail/toc toggles. ".only-drawer" (the existing hamburger) is
     hidden at 1280px+ because the rail already shows inline there — these are
     always-visible buttons that collapse the inline rail/toc instead of
     opening the mobile drawer/sheet. Which of the two side panels are visible
     combines with the reader.css breakpoints (768px, 1280px) in four ways, so
     .shell's grid-template-columns is computed in JS (see updateShellColumns
     in the script below) rather than fought over in CSS here — this stylesheet
     only owns hiding the panel itself. */
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
</style>

<svg width="0" height="0" style="position:absolute" aria-hidden="true">
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
  <symbol id="i-steps" viewBox="0 0 24 24"><path d="M4 18h4v-4h4v-4h4V6h4"/></symbol>
  <symbol id="i-box" viewBox="0 0 24 24"><rect x="3.5" y="5.5" width="17" height="13" rx="1.5"/><rect x="6" y="8" width="12" height="8" rx="1"/></symbol>
  <symbol id="i-tick" viewBox="0 0 24 24"><path d="m5 12.5 4.2 4.2L19 7"/></symbol>
  <symbol id="i-back" viewBox="0 0 24 24"><path d="M14 6 8 12l6 6"/></symbol>
  <symbol id="i-forward" viewBox="0 0 24 24"><path d="m10 6 6 6-6 6"/></symbol>
  <symbol id="i-refresh" viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/></symbol>
</svg>

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
    <button class="icon-btn only-drawer" type="button" data-open="rail-dialog" aria-label="Open syllabus">
      <svg class="icon"><use href="#i-menu"/></svg>
    </button>
    <button class="icon-btn rail-toggle" type="button" onclick="document.documentElement.toggleAttribute('data-rail-hidden')" aria-label="Show or hide the syllabus panel">
      <svg class="icon"><use href="#i-menu"/></svg>
    </button>
    <span style="position:relative;display:inline-flex;align-items:center;margin-inline-end:0.5rem">
      <span class="wordmark" aria-hidden="true" style="padding-inline-end:1.15rem;white-space:nowrap">Semester 4</span>
      <select id="semester-select" aria-label="Semester" onchange="this.previousElementSibling.textContent=this.selectedOptions[0].textContent" style="position:absolute;inset:0;opacity:0;cursor:pointer;font-size:1rem">
        <option value="1">Semester 1</option>
        <option value="2">Semester 2</option>
        <option value="3">Semester 3</option>
        <option value="4" selected>Semester 4</option>
        <option value="5">Semester 5</option>
        <option value="6">Semester 6</option>
        <option value="7">Semester 7</option>
        <option value="8">Semester 8</option>
      </select>
      <svg class="icon" aria-hidden="true" viewBox="0 0 24 24" style="position:absolute;inset-inline-end:0;width:0.85rem;height:0.85rem;color:var(--ink-3);pointer-events:none"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
    <nav class="crumbs" aria-label="Breadcrumb">
      <ol>
        <li style="position:relative;display:inline-flex;align-items:center">
          <span aria-hidden="true" style="white-space:nowrap">Operating System</span>
          <select id="subject-select" aria-label="Subject" onchange="this.previousElementSibling.textContent=this.selectedOptions[0].textContent" style="position:absolute;inset:0;opacity:0;cursor:pointer;font-size:1rem">
            <option selected>Operating System</option>
            <option>Database Management System</option>
          </select>
        </li>
        <li><a href="#main" aria-current="page">Deadlocks</a></li>
      </ol>
    </nav>
    <div class="header-actions">
      <button class="icon-btn" type="button" aria-label="Search this course">
        <svg class="icon"><use href="#i-search"/></svg>
      </button>
      <button class="btn only-tv" type="button" data-open="toc-dialog">Contents</button>
      <button class="icon-btn toc-toggle" type="button" onclick="document.documentElement.toggleAttribute('data-toc-hidden')" aria-label="Show or hide the on-this-page panel">
        <svg class="icon"><use href="#i-menu"/></svg>
      </button>
      <button class="icon-btn" type="button" data-open="settings-dialog" aria-label="Reading settings">Aa</button>
    </div>
  </div>
</header>

<div class="shell">
  <aside class="rail" aria-label="Syllabus">
    <div id="rail-content">
      <h2 class="course-title">Operating System</h2>
      <p class="course-meta">BIT253CO, semester 4, 45 teaching hours</p>
      <ul class="tree">
        <li><details><summary>Unit 2</summary><ul><li><a href="#main"><span class="code">2.f</span> SRTF scheduling<span class="dot" data-state="new"><span class="sr-only">Not started</span></span></a></li></ul></details></li>
        <li><details><summary>Unit 5</summary><ul><li><a href="#main"><span class="code">5.c</span> Disk scheduling<span class="dot" data-state="new"><span class="sr-only">Not started</span></span></a></li></ul></details></li>
        <li>
          <details open>
            <summary>Unit 6 Deadlocks</summary>
            <ul>
              <li><a href="#main"><span class="code">6.a</span> Introduction<span class="dot" data-state="learned"><span class="sr-only">Learned</span></span></a></li>
              <li><a href="#main" aria-current="page"><span class="code">6.d</span> Deadlock detection and recovery<span class="dot" data-state="progress" data-current-dot><span class="sr-only">In progress</span></span></a></li>
              <li><a href="#main"><span class="code">6.f</span> Banker's Algorithm (single and multiple resources)<span class="dot" data-state="new"><span class="sr-only">Not started</span></span></a></li>
            </ul>
          </details>
        </li>
        <li><details><summary>Unit 7 Real Time System</summary><ul><li><a href="#main"><span class="code">7</span> Real time systems<span class="dot" data-state="new"><span class="sr-only">Not started</span></span></a></li></ul></details></li>
      </ul>
      <p class="rail-note">Demo tree shows a few official topics. The real tree comes from the imported syllabus.</p>
    </div>
  </aside>

  <main id="main" class="sheet" tabindex="-1">
    <article class="prose" lang="en">
      <h1 id="top">Deadlock detection and recovery</h1>
      <div class="lesson-meta">
        <span class="trust" data-level="ai-draft">AI draft</span>
        <span>Topic 6.d in Unit 6, Deadlocks</span>
        <span class="asked"><svg class="icon" aria-hidden="true"><use href="#i-tick"/></svg>Asked in 2026, question 7 (8 marks)</span>
        <span>About 12 minutes</span>
      </div>

      <div class="block block--idea">
        <p class="block__label"><svg class="icon" aria-hidden="true"><use href="#i-bulb"/></svg>Idea in plain words</p>
        <p>Deadlock means some processes are stuck forever, each waiting for something another one is holding. With detection, the operating system lets that happen, checks for it now and then, and breaks it when it finds it.</p>
      </div>

      <h2 id="what-detection-means">What detection means</h2>
      <p>Prevention and avoidance try to stop a deadlock before it forms. Detection takes the opposite bet: allocate resources freely, because deadlocks are rare, and pay the cost only when one actually happens.</p>
      <p>That makes detection a two-part job. First the system must notice that a set of processes can never continue. Then it must recover, by ending processes or taking resources back.</p>

      <h2 id="wait-for-graph">Detecting with a wait-for graph</h2>
      <p>When every resource type has exactly one instance, the operating system can draw a <strong>wait-for graph</strong>. Start from the resource allocation graph and remove the resource boxes. An arrow from P1 to P2 now means P1 is waiting for something P2 holds.</p>
      <p><strong>If the wait-for graph contains a cycle, the processes in that cycle are deadlocked.</strong></p>

      <figure>
        <svg class="diagram-svg" viewBox="0 0 520 180" role="img" aria-labelledby="fig1-title">
          <title id="fig1-title">A resource graph with a cycle through P1, R1, P2 and R2, reduced to a wait-for graph where P1 and P2 wait for each other</title>
          <defs>
            <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head" d="M0 0 10 5 0 10z"/></marker>
            <marker id="ahc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head--cycle" d="M0 0 10 5 0 10z"/></marker>
          </defs>
          <line class="e" x1="70" y1="50" x2="126" y2="50" marker-end="url(#ah)"/>
          <line class="e" x1="166" y1="50" x2="190" y2="50" marker-end="url(#ah)"/>
          <line class="e" x1="200" y1="66" x2="168" y2="120" marker-end="url(#ah)"/>
          <line class="e" x1="126" y1="128" x2="62" y2="66" marker-end="url(#ah)"/>
          <circle class="p" cx="52" cy="50" r="18"/><text x="52" y="55" text-anchor="middle">P1</text>
          <rect class="r" x="128" y="32" width="36" height="36" rx="3"/><text x="146" y="55" text-anchor="middle">R1</text>
          <circle class="p" cx="210" cy="50" r="18"/><text x="210" y="55" text-anchor="middle">P2</text>
          <rect class="r" x="128" y="112" width="36" height="36" rx="3"/><text x="146" y="135" text-anchor="middle">R2</text>
          <text class="cap" x="131" y="174" text-anchor="middle">Resource graph</text>
          <path class="e e--cycle" d="M358 72 Q400 38 440 72" marker-end="url(#ahc)"/>
          <path class="e e--cycle" d="M442 90 Q400 124 360 90" marker-end="url(#ahc)"/>
          <circle class="p" cx="340" cy="80" r="18"/><text x="340" y="85" text-anchor="middle">P1</text>
          <circle class="p" cx="460" cy="80" r="18"/><text x="460" y="85" text-anchor="middle">P2</text>
          <text class="cap" x="400" y="174" text-anchor="middle">Wait-for graph</text>
        </svg>
        <figcaption>Removing the resource boxes leaves P1 waiting for P2 and P2 waiting for P1. That loop is the deadlock.</figcaption>
      </figure>

      <h2 id="detection-algorithm">Detecting with the detection algorithm</h2>
      <p>When a resource type has several instances, a cycle is not enough proof. The system uses an algorithm that looks like the Banker's safety check, but with the <strong>current requests</strong> instead of maximum needs.</p>

      <h3 id="the-steps">The steps</h3>
      <div class="block block--working">
        <p class="block__label"><svg class="icon" aria-hidden="true"><use href="#i-steps"/></svg>Method</p>
        <ol>
          <li>Set <code>Work = Available</code>. Mark <code>Finish[i] = true</code> for every process holding nothing, otherwise false.</li>
          <li>Find a process with <code>Finish[i] = false</code> and <code>Request[i] &le; Work</code>. If none exists, go to step 4.</li>
          <li>Pretend it finishes and returns what it holds, then go back to step 2.</li>
          <li>Every process still marked <code>false</code> is deadlocked.</li>
        </ol>
      </div>
      <div class="block block--formula" aria-label="Update rule">Work = Work + Allocation[i]</div>

      <h3 id="worked-example">Worked example</h3>
      <div class="block block--example">
        <p class="block__label"><svg class="icon" aria-hidden="true"><use href="#i-grid"/></svg>Example with resources A, B and C, Available = (0, 0, 0)</p>
        <div class="table-wrap">
          <table>
            <caption>Current allocation and requests</caption>
            <thead><tr><th>Process</th><th class="num">Allocation A B C</th><th class="num">Request A B C</th></tr></thead>
            <tbody>
              <tr><td>P0</td><td class="num">0 1 0</td><td class="num">0 0 0</td></tr>
              <tr><td>P1</td><td class="num">2 0 0</td><td class="num">2 0 2</td></tr>
              <tr><td>P2</td><td class="num">3 0 3</td><td class="num">0 0 0</td></tr>
              <tr><td>P3</td><td class="num">2 1 1</td><td class="num">1 0 0</td></tr>
              <tr><td>P4</td><td class="num">0 0 2</td><td class="num">0 0 2</td></tr>
            </tbody>
          </table>
        </div>
        <p class="table-hint">Swipe the table sideways to see every column.</p>
        <p>Work grows as each process can finish: (0, 0, 0), then P0 gives (0, 1, 0), P2 gives (3, 1, 3), P3 gives (5, 2, 4), P1 gives (7, 2, 4), and P4 gives (7, 2, 6).</p>
      </div>
      <div class="block block--answer">
        <p class="block__label"><svg class="icon" aria-hidden="true"><use href="#i-box"/></svg>Answer</p>
        <p>All processes finish in the order P0, P2, P3, P1, P4, so there is no deadlock.</p>
      </div>

      <h2 id="when-to-run">When to run detection</h2>
      <ul>
        <li>Every time a request cannot be granted straight away. This catches deadlocks early but costs the most.</li>
        <li>At fixed intervals, for example once an hour.</li>
        <li>When CPU utilisation suddenly drops, which is a common sign that processes are stuck.</li>
      </ul>

      <h2 id="recovery">Recovering from deadlock</h2>
      <h3 id="process-termination">Process termination</h3>
      <p>Abort every deadlocked process, which is quick but throws away all their work. Or abort them one at a time until the cycle breaks, choosing by priority, work already done, and resources held.</p>
      <h3 id="resource-preemption">Resource preemption</h3>
      <p>Take resources away from some processes and give them to others. This needs three decisions: which victim to choose, how to <strong>roll back</strong> the victim to a safe earlier state, and how to prevent <strong>starvation</strong> so the same process is not picked every time.</p>

      <div class="block block--tip">
        <p class="block__label"><svg class="icon" aria-hidden="true"><use href="#i-pen"/></svg>Exam tip</p>
        <p>For 8 marks, write the definition, both detection methods with a small example, then both recovery methods. Examiners look for rollback and starvation under preemption.</p>
      </div>

      <div class="block block--warning">
        <p class="block__label"><svg class="icon" aria-hidden="true"><use href="#i-alert"/></svg>Common mistake</p>
        <p>Writing the Banker's safety algorithm as the detection algorithm. Banker's uses <code>Need = Max &minus; Allocation</code> to avoid deadlock before it happens. Detection uses the current <code>Request</code> matrix after it may have happened.</p>
      </div>

      <div class="lesson-end">
        <button class="btn btn--primary" type="button" data-learned aria-pressed="false">
          <svg class="icon" aria-hidden="true"><use href="#i-check"/></svg><span>Mark as learned</span>
        </button>
        <button class="btn btn--quiet" type="button">Report a mistake</button>
      </div>

      <nav class="pager" aria-label="Topics">
        <a href="#main" rel="prev"><small>Previous topic</small>In Unit 6</a>
        <a href="#main" rel="next"><small>Next topic</small>In Unit 6</a>
      </nav>
    </article>
  </main>

  <aside class="toc" aria-label="On this page">
    <div id="toc-content">
      <h2>On this page</h2>
      <ol class="toc-list">
        <li><a href="#what-detection-means">What detection means</a></li>
        <li><a href="#wait-for-graph">Detecting with a wait-for graph</a></li>
        <li><a href="#detection-algorithm">Detecting with the detection algorithm</a></li>
        <li class="lvl-3"><a href="#the-steps">The steps</a></li>
        <li class="lvl-3"><a href="#worked-example">Worked example</a></li>
        <li><a href="#when-to-run">When to run detection</a></li>
        <li><a href="#recovery">Recovering from deadlock</a></li>
        <li class="lvl-3"><a href="#process-termination">Process termination</a></li>
        <li class="lvl-3"><a href="#resource-preemption">Resource preemption</a></li>
      </ol>
      <div class="toc-section">
        <h2>Asked in exams</h2>
        <p>2026, question 7 (8 marks)</p>
      </div>
    </div>
  </aside>
</div>

<nav class="toolbar" aria-label="Lesson tools">
  <button type="button" data-open="rail-dialog"><svg class="icon" aria-hidden="true"><use href="#i-tree"/></svg>Syllabus</button>
  <button type="button" data-open="toc-dialog"><svg class="icon" aria-hidden="true"><use href="#i-list"/></svg>Contents</button>
  <button type="button" data-open="settings-dialog"><span aria-hidden="true" style="font:700 1.05rem/1.2rem var(--font-book)">Aa</span>Reading</button>
  <button type="button" data-learned aria-pressed="false"><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg><span>Learned</span></button>
</nav>

<dialog id="rail-dialog" class="drawer" aria-labelledby="rail-dialog-title">
  <div class="dialog__head"><h2 id="rail-dialog-title">Syllabus</h2><button class="icon-btn" type="button" data-close aria-label="Close syllabus"><svg class="icon"><use href="#i-close"/></svg></button></div>
  <div class="dialog__body" data-clone="rail-content"></div>
</dialog>

<dialog id="toc-dialog" class="bottom-sheet" aria-labelledby="toc-dialog-title">
  <div class="dialog__head"><h2 id="toc-dialog-title">Contents</h2><button class="icon-btn" type="button" data-close aria-label="Close contents"><svg class="icon"><use href="#i-close"/></svg></button></div>
  <div class="dialog__body toc" style="display:block;position:static;max-block-size:none;border:0;padding-top:1rem" data-clone="toc-content"></div>
</dialog>

<dialog id="settings-dialog" class="panel" aria-labelledby="settings-title">
  <div class="dialog__head"><h2 id="settings-title">Reading settings</h2><button class="icon-btn" type="button" data-close aria-label="Close reading settings"><svg class="icon"><use href="#i-close"/></svg></button></div>
  <div class="dialog__body">
    <fieldset class="setting">
      <legend>Theme</legend>
      <div class="swatches">
        <label class="swatch"><input type="radio" name="theme" value="paper"><span class="swatch__chip" style="background:#FBFBF8;color:#1A2230">Aa</span>Paper</label>
        <label class="swatch"><input type="radio" name="theme" value="warm"><span class="swatch__chip" style="background:#EFE6D2;color:#2B241B">Aa</span>Warm</label>
        <label class="swatch"><input type="radio" name="theme" value="blackboard"><span class="swatch__chip" style="background:#1B2320;color:#E7E5DD">Aa</span>Blackboard</label>
        <label class="swatch"><input type="radio" name="theme" value="night"><span class="swatch__chip" style="background:#000000;color:#C9C4B8">Aa</span>Night</label>
      </div>
    </fieldset>

    <div class="setting">
      <span class="legend" id="size-label">Text size</span>
      <div class="stepper" role="group" aria-labelledby="size-label">
        <button class="btn" type="button" data-size-step="-1" aria-label="Smaller text">A&minus;</button>
        <output id="size-output" aria-live="polite">Default</output>
        <button class="btn" type="button" data-size-step="1" aria-label="Larger text">A+</button>
      </div>
    </div>

    <fieldset class="setting">
      <legend>Font</legend>
      <div class="segmented">
        <label><input type="radio" name="font" value="book">Book</label>
        <label><input type="radio" name="font" value="clear">Clear</label>
      </div>
    </fieldset>

    <fieldset class="setting">
      <legend>Line width</legend>
      <div class="segmented">
        <label><input type="radio" name="width" value="narrow">Narrow</label>
        <label><input type="radio" name="width" value="normal">Normal</label>
        <label><input type="radio" name="width" value="wide">Wide</label>
      </div>
    </fieldset>

    <fieldset class="setting">
      <legend>Line spacing</legend>
      <div class="segmented">
        <label><input type="radio" name="spacing" value="normal">Normal</label>
        <label><input type="radio" name="spacing" value="relaxed">Relaxed</label>
      </div>
    </fieldset>

    <label class="switch hide-small"><span>Focus mode<small>Hide the syllabus and contents panels</small></span><input type="checkbox" data-toggle="focus"></label>
    <label class="switch"><span>TV and projector view<small>Large text for reading across a room</small></span><input type="checkbox" data-toggle="viewing"></label>
    <label class="switch"><span>Eye break reminder<small>Every 20 minutes, a quiet reminder to look away</small></span><input type="checkbox" data-toggle="breaks" checked></label>
    <p class="status-line" id="settings-status" aria-live="polite"></p>
    <button class="btn" type="button" id="preview-break">Preview the reminder</button>
  </div>
</dialog>

<div class="break-toast" id="break-toast" role="status" hidden>
  <svg class="icon" aria-hidden="true" style="margin-top:.15rem"><use href="#i-bulb"/></svg>
  <div>
    <strong>Time for an eye break</strong>
    <p>Look at something about 6 metres away for 20 seconds, then carry on from here.</p>
    <div class="actions">
      <button class="btn btn--primary" type="button" id="break-done">Done</button>
      <button class="btn btn--quiet" type="button" id="break-off">Turn off reminders</button>
    </div>
  </div>
</div>
`;

export default function PastPapersPage() {
  useEffect(() => {
    // Verbatim IIFE from the demo's <script> block — dangerouslySetInnerHTML
    // never executes <script> tags, so this runs the identical logic through
    // useEffect instead, once, after BODY_HTML is in the DOM.
    var root = document.documentElement;
    var sizes = ["s", "m", "l", "xl", "xxl"];
    var sizeNames: Record<string, string> = { s: "Smaller", m: "Default", l: "Large", xl: "Larger", xxl: "Largest" };
    var statusLine = document.getElementById("settings-status");

    document.querySelectorAll("[data-clone]").forEach(function (slot) {
      var source = document.getElementById(slot.getAttribute("data-clone")!);
      if (source) (slot.appendChild(source.cloneNode(true)) as Element).removeAttribute("id");
    });

    // The rail and toc toggles each just hide their own panel (see the
    // <style> block); which columns .shell should actually have is the
    // product of that with the reader.css breakpoints (768px, 1280px), which
    // is four combinations — simpler to compute directly than to fight the
    // cascade with more attribute selectors.
    function updateShellColumns() {
      const shell = document.querySelector(".shell") as HTMLElement | null;
      if (!shell) return;
      const showRail = window.innerWidth >= 1280 && !root.hasAttribute("data-rail-hidden");
      const showToc = window.innerWidth >= 768 && !root.hasAttribute("data-toc-hidden");
      shell.style.gridTemplateColumns = [
        showRail ? "var(--rail-w)" : null,
        "minmax(0, 1fr)",
        showToc ? "var(--toc-w)" : null,
      ].filter(Boolean).join(" ");
    }
    document.querySelector('[aria-label="Show or hide the syllabus panel"]')?.addEventListener("click", () => updateShellColumns());
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
      var i = sizes.indexOf(root.getAttribute("data-size") || "m");
      var next = Math.min(sizes.length - 1, Math.max(0, i + Number(this.getAttribute("data-size-step"))));
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
          statusLine.textContent = "Switched to Blackboard, which reads better on TVs. You can change it back above.";
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

    var opener: HTMLElement | null = null;
    document.querySelectorAll("[data-open]").forEach((button) => {
      button.addEventListener("click", () => {
        const dialog = document.getElementById(button.getAttribute("data-open")!) as HTMLDialogElement | null;
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
        if (target.closest("a[href^='#']") && dialog.id !== "settings-dialog") (dialog as HTMLDialogElement).close();
      });
      dialog.addEventListener("close", () => opener?.focus());
    });

    var article = document.querySelector(".prose");
    var bar = document.getElementById("progress-bar");
    var headings = Array.prototype.slice.call(document.querySelectorAll(".prose h2[id], .prose h3[id]")) as HTMLElement[];
    var currentId: string | null = null;
    var ticking = false;
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
      var rect = article.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var done = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      bar.style.setProperty("--progress", done.toFixed(3));
      var line = window.innerHeight * 0.3;
      var id: string | null = null;
      for (var i = 0; i < headings.length; i++) {
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

    function checkTables() {
      document.querySelectorAll(".table-wrap").forEach((wrap) => {
        var scrollable = wrap.scrollWidth > wrap.clientWidth + 1;
        wrap.classList.toggle("is-scrollable", scrollable);
        wrap.classList.toggle("at-end", !scrollable || wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 1);
      });
    }
    document.querySelectorAll(".table-wrap").forEach((wrap) => {
      wrap.addEventListener("scroll", checkTables, { passive: true });
    });
    window.addEventListener("resize", checkTables);
    const mo = new MutationObserver(checkTables);
    mo.observe(document.documentElement, { attributes: true });
    checkTables();

    function onLearnedClick(this: HTMLElement) {
      var learned = this.getAttribute("aria-pressed") !== "true";
      document.querySelectorAll("[data-learned]").forEach((b) => {
        b.setAttribute("aria-pressed", String(learned));
        var label = b.querySelector("span");
        if (label) label.textContent = b.closest(".toolbar") ? "Learned" : learned ? "Learned" : "Mark as learned";
      });
      document.querySelectorAll("[data-current-dot]").forEach((dot) => {
        dot.setAttribute("data-state", learned ? "learned" : "progress");
        if (dot.firstElementChild) dot.firstElementChild.textContent = learned ? "Learned" : "In progress";
      });
    }
    document.querySelectorAll("[data-learned]").forEach((button) => {
      button.addEventListener("click", onLearnedClick as EventListener);
    });

    const toast = document.getElementById("break-toast");
    const breaksToggle = document.querySelector('[data-toggle="breaks"]') as HTMLInputElement | null;
    let timer: number | undefined;
    const TWENTY_MINUTES = 20 * 60 * 1000;
    function schedule() {
      window.clearTimeout(timer);
      if (breaksToggle?.checked) timer = window.setTimeout(showToast, TWENTY_MINUTES);
    }
    function showToast() {
      if (toast) toast.hidden = false;
    }
    function hideToast() {
      if (toast) toast.hidden = true;
    }
    document.getElementById("preview-break")?.addEventListener("click", () => {
      const dialog = document.getElementById("settings-dialog") as HTMLDialogElement | null;
      opener = null;
      if (dialog?.open) dialog.close();
      showToast();
      document.getElementById("break-done")?.focus();
    });
    document.getElementById("break-done")?.addEventListener("click", () => {
      hideToast();
      schedule();
    });
    document.getElementById("break-off")?.addEventListener("click", () => {
      if (breaksToggle) breaksToggle.checked = false;
      hideToast();
      schedule();
    });
    breaksToggle?.addEventListener("change", schedule);
    schedule();

    syncControls();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("hashchange", requestUpdate);
      window.removeEventListener("resize", checkTables);
      window.removeEventListener("resize", updateShellColumns);
      mo.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: BODY_HTML }} />;
}
