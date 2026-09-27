"use client";

import { useEffect } from "react";

// Started as a direct copy of src/app/notes/page.tsx's approach: verbatim
// body content in the Reader's design system, wired the same way. Real
// syllabus data (programs, semesters, courses, units) gets wired back into
// this markup as a follow-up, same as /notes did.
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
    <button class="icon-btn only-drawer" type="button" data-open="rail-dialog" aria-label="Open curriculum">
      <svg class="icon"><use href="#i-menu"/></svg>
    </button>
    <button class="icon-btn rail-toggle" type="button" onclick="document.documentElement.toggleAttribute('data-rail-hidden')" aria-label="Show or hide the curriculum panel">
      <svg class="icon"><use href="#i-menu"/></svg>
    </button>
    <span style="position:relative;display:inline-flex;align-items:center;margin-inline-end:0.5rem">
      <span class="wordmark" aria-hidden="true" style="padding-inline-end:1.15rem;white-space:nowrap">PU BIT (Nepal)</span>
      <select id="program-select" aria-label="Program" onchange="this.previousElementSibling.textContent=this.selectedOptions[0].textContent" style="position:absolute;inset:0;opacity:0;cursor:pointer;font-size:1rem">
        <option selected>PU BIT (Nepal)</option>
        <option>TU B.Sc. CSIT (Nepal)</option>
        <option>Cambridge A-Levels</option>
        <option>ACM/IEEE CS2023</option>
        <option>US College Board AP</option>
        <option>GATE CS &amp; IT</option>
      </select>
      <svg class="icon" aria-hidden="true" viewBox="0 0 24 24" style="position:absolute;inset-inline-end:0;width:0.85rem;height:0.85rem;color:var(--ink-3);pointer-events:none"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
    <nav class="crumbs" aria-label="Breadcrumb">
      <ol>
        <li style="position:relative;display:inline-flex;align-items:center">
          <span aria-hidden="true" style="white-space:nowrap">Semester 7</span>
          <select id="semester-select" aria-label="Semester" onchange="this.previousElementSibling.textContent=this.selectedOptions[0].textContent" style="position:absolute;inset:0;opacity:0;cursor:pointer;font-size:1rem">
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
            <option value="7" selected>Semester 7</option>
            <option value="8">Semester 8</option>
          </select>
        </li>
        <li style="position:relative;display:inline-flex;align-items:center">
          <span aria-hidden="true" style="white-space:nowrap">Network Programming</span>
          <select id="subject-select" aria-label="Subject" onchange="this.previousElementSibling.textContent=this.selectedOptions[0].textContent" style="position:absolute;inset:0;opacity:0;cursor:pointer;font-size:1rem">
            <optgroup label="Semester 7">
              <option selected>Network Programming</option>
              <option>Digital Governance</option>
              <option>Machine Learning</option>
              <option>Business Intelligence and Data Science</option>
              <option>Deep Learning</option>
              <option>Digital Commerce</option>
              <option>Multimedia and Application</option>
              <option>GIS</option>
              <option>Remote Sensing</option>
              <option>Data Center and Disaster Recovery</option>
            </optgroup>
            <optgroup label="Semester 8">
              <option>Principles of Management and Entrepreneurship in IT</option>
              <option>Distributed and Cloud Computing</option>
              <option>Apprentice Project</option>
              <option>Natural Language Processing</option>
              <option>Supply Chain Analytics</option>
              <option>Big Data</option>
              <option>Mobile App Development</option>
              <option>Incident Response and Management System</option>
              <option>Climate Change Risk Management</option>
              <option>Disaster Governance</option>
            </optgroup>
          </select>
        </li>
        <li><a href="#main" aria-current="page">Syllabus</a></li>
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
  <aside class="rail" aria-label="Curriculum">
    <div id="rail-content">
      <h2 class="course-title">Network Programming</h2>
      <p class="course-meta">BIT401CO, semester 7, 45 teaching hours</p>
      <ul class="tree">
        <li><a href="#unit-1" aria-current="page"><span class="code">1</span> Introduction to Network Programming</a></li>
        <li><a href="#unit-2"><span class="code">2</span> Elementary Operating System Calls</a></li>
        <li><a href="#unit-3"><span class="code">3</span> TCP/UDP Transport Layer Protocols</a></li>
        <li><a href="#unit-4"><span class="code">4</span> Elementary Socket Calls</a></li>
        <li><a href="#unit-5"><span class="code">5</span> Elementary TCP-UDP Socket</a></li>
        <li><a href="#unit-6"><span class="code">6</span> I/O Multiplexing</a></li>
        <li><a href="#unit-7"><span class="code">7</span> Socket Options</a></li>
        <li><a href="#unit-8"><span class="code">8</span> Name and Address Conversion</a></li>
        <li><a href="#unit-9"><span class="code">9</span> Unix Domain Protocol</a></li>
        <li><a href="#unit-10"><span class="code">10</span> Daemon Processes, Inetd Superservers</a></li>
        <li><a href="#unit-11"><span class="code">11</span> Broadcast and Multicast</a></li>
        <li><a href="#unit-12"><span class="code">12</span> IP Layers and Raw Socket</a></li>
      </ul>
      <p class="rail-note">Official syllabus units for BIT401CO, Purbanchal University BIT (May 2022 revision).</p>
    </div>
  </aside>

  <main id="main" class="sheet" tabindex="-1">
    <article class="prose" lang="en">
      <h1 id="top">Network Programming &mdash; Syllabus</h1>
      <div class="lesson-meta">
        <span class="trust" data-level="teacher-verified">Official syllabus</span>
        <span>BIT401CO &middot; Semester 7 &middot; 3 credits &middot; 45 teaching hours</span>
      </div>

      <div class="block block--idea">
        <p class="block__label"><svg class="icon" aria-hidden="true"><use href="#i-bulb"/></svg>Course objective</p>
        <p>At the end of this course, students will be able to design and implement network client-server applications.</p>
      </div>

      <h2 id="unit-1">Unit 1: Introduction to network programming <small>&mdash; 5 hrs</small></h2>
      <ul>
        <li>Introduction to computer network: client/server model, Protocol Suite (ISO/OSI, TCP/IP), Unix Standards (POSIX, OpenGroup, IETF)</li>
        <li>Network Utilities (telnet, route, ipconfig, ifconfig, ping, netstat, and ftp)</li>
        <li>Introduction to programming: wrapper functions, header files, libraries and ports numbers, IP address</li>
        <li>Iterative server, concurrent server, networked servers</li>
      </ul>

      <h2 id="unit-2">Unit 2: Elementary operating system calls <small>&mdash; 6 hrs</small></h2>
      <ul>
        <li>System call, program, thread, process, Kernel</li>
        <li><code>fork()</code>, <code>exec()</code> and its family, <code>waitpid()</code>, <code>wait()</code></li>
        <li><code>pipe()</code>, <code>Fifo()</code>, signals (SIGCHLD, SIGINT, SIGIO)</li>
        <li>IPC Names, creating and opening IPC channels, IPC permissions</li>
      </ul>

      <h2 id="unit-3">Unit 3: TCP/UDP transport layer protocols <small>&mdash; 4 hrs</small></h2>
      <ul>
        <li>TCP: features, connection establishment and termination, states in communication (LISTEN, TIME_WAIT, ESTABLISHED, BLOCKED)</li>
        <li>UDP: features, uses, comparison with TCP</li>
        <li>TCP and UDP buffer sizes and limitations</li>
        <li>SCTP overview</li>
      </ul>

      <h2 id="unit-4">Unit 4: Elementary socket calls <small>&mdash; 5 hrs</small></h2>
      <ul>
        <li>Socket address structure: for IPV4, IPV6, UNIX domain socket and generic socket address structure, value-result argument</li>
        <li>Byte ordering and manipulating functions: <code>htonl()</code>, <code>htons()</code>, <code>ntohl()</code>, <code>ntohs()</code>, <code>inet_addr()</code>, <code>inet_aton()</code>, <code>inet_ntoa()</code>, <code>inet_pton()</code></li>
      </ul>

      <h2 id="unit-5">Unit 5: Elementary TCP-UDP socket <small>&mdash; 6 hrs</small></h2>
      <ul>
        <li><code>socket()</code>, <code>connect()</code>, <code>bind()</code>, <code>listen()</code>, <code>accept()</code>, <code>read()</code>, <code>write()</code>, <code>close()</code></li>
        <li><code>sendto()</code>, <code>recvfrom()</code></li>
      </ul>

      <h2 id="unit-6">Unit 6: I/O multiplexing <small>&mdash; 4 hrs</small></h2>
      <ul>
        <li>Introduction, I/O models: blocking I/O, non-blocking I/O, I/O multiplexing, signal driven I/O (SIGIO) and asynchronous I/O model</li>
        <li><code>select()</code>, <code>poll()</code>, <code>shutdown()</code></li>
      </ul>

      <h2 id="unit-7">Unit 7: Socket options <small>&mdash; 2 hrs</small></h2>
      <ul>
        <li><code>getsockopt()</code> and <code>setsockopt()</code> functions</li>
        <li>IPV4, IPV6, TCP socket options (SO_REUSEADDR, TCP_NODELAY)</li>
      </ul>

      <h2 id="unit-8">Unit 8: Name and address conversion <small>&mdash; 2 hrs</small></h2>
      <ul>
        <li>Domain Name System, <code>gethostbyname()</code>, <code>gethostbyaddr()</code>, <code>uname()</code>, <code>getservbyname()</code> and <code>getservbyport()</code></li>
        <li><code>gethostname()</code> functions, socket timeouts</li>
      </ul>

      <h2 id="unit-9">Unit 9: Unix domain protocol <small>&mdash; 3 hrs</small></h2>
      <ul>
        <li>Introduction, Unix domain socket address structure</li>
        <li><code>socketpair</code> function</li>
        <li>Unix domain stream client-server, UNIX domain datagram client/server</li>
      </ul>

      <h2 id="unit-10">Unit 10: Daemon processes, Inetd superservers <small>&mdash; 2 hrs</small></h2>
      <ul>
        <li>Introduction, Syslog facility (<code>syslog</code> function)</li>
        <li><code>daemon_init</code> function</li>
        <li>inetd daemon configuration</li>
      </ul>

      <h2 id="unit-11">Unit 11: Broadcast and multicast <small>&mdash; 3 hrs</small></h2>
      <ul>
        <li>Introduction, Broadcast and multicast addresses</li>
        <li>Comparison between broadcast, unicast and multicast socket options</li>
        <li>Unicast versus Broadcast, multicast versus broadcast on LAN</li>
      </ul>

      <h2 id="unit-12">Unit 12: IP layers and raw socket <small>&mdash; 3 hrs</small></h2>
      <ul>
        <li>Introduction, raw socket creation</li>
        <li>Input and output packet processing (ping example implementation)</li>
      </ul>

      <div class="block block--example">
        <p class="block__label"><svg class="icon" aria-hidden="true"><use href="#i-grid"/></svg>Lab work</p>
        <ul>
          <li>Linux command line utilities and shell programming</li>
          <li>IPC mechanisms: <code>Pipe()</code>, <code>Fifo()</code>, MessageQueue</li>
          <li>TCP, UDP and Unix Domain socket client server programs</li>
          <li>TCP echo server and client program</li>
          <li><code>Fork()</code> system call process management</li>
          <li><code>Wait()</code> and <code>waitpid()</code> system call handling</li>
          <li><code>Uname()</code>, <code>gethostbyaddr()</code>, <code>gethostbyname()</code>, <code>gethostname()</code> system calls</li>
          <li>Shell programming for network diagnostics</li>
        </ul>
      </div>

      <h2 id="reference-books">Reference books</h2>
      <ul>
        <li>Stevens, W. R., <em>Unix Network Programming, Vol 1: Networking APIs &mdash; Sockets and XTI</em>, Prentice Hall.</li>
        <li>Stevens, W. R., <em>Unix Network Programming, Vol 2: Interprocess Communications</em>, Prentice Hall.</li>
        <li>Comer, Douglas E., <em>Internetworking with TCP/IP: Principles, Protocols, and Architecture, Vol 3</em>, Prentice Hall.</li>
      </ul>

      <div class="lesson-end">
        <button class="btn btn--primary" type="button" data-learned aria-pressed="false">
          <svg class="icon" aria-hidden="true"><use href="#i-check"/></svg><span>Mark as learned</span>
        </button>
        <button class="btn btn--quiet" type="button">Report a mistake</button>
      </div>

      <nav class="pager" aria-label="Topics">
        <a href="#main" rel="prev"><small>Previous subject</small>In Semester 7</a>
        <a href="#main" rel="next"><small>Next subject</small>Digital Governance</a>
      </nav>
    </article>
  </main>

  <aside class="toc" aria-label="On this page">
    <div id="toc-content">
      <h2>On this page</h2>
      <ol class="toc-list">
        <li><a href="#unit-1">Unit 1: Introduction</a></li>
        <li><a href="#unit-2">Unit 2: OS calls</a></li>
        <li><a href="#unit-3">Unit 3: TCP/UDP protocols</a></li>
        <li><a href="#unit-4">Unit 4: Socket calls</a></li>
        <li><a href="#unit-5">Unit 5: TCP-UDP socket</a></li>
        <li><a href="#unit-6">Unit 6: I/O multiplexing</a></li>
        <li><a href="#unit-7">Unit 7: Socket options</a></li>
        <li><a href="#unit-8">Unit 8: Address conversion</a></li>
        <li><a href="#unit-9">Unit 9: Unix domain protocol</a></li>
        <li><a href="#unit-10">Unit 10: Daemon processes</a></li>
        <li><a href="#unit-11">Unit 11: Broadcast &amp; multicast</a></li>
        <li><a href="#unit-12">Unit 12: Raw socket</a></li>
        <li><a href="#reference-books">Reference books</a></li>
      </ol>
      <div class="toc-section">
        <h2>Course info</h2>
        <p>BIT401CO &middot; 3 credits &middot; 45 hours &middot; Core</p>
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
  <div class="dialog__head"><h2 id="rail-dialog-title">Curriculum</h2><button class="icon-btn" type="button" data-close aria-label="Close curriculum"><svg class="icon"><use href="#i-close"/></svg></button></div>
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

    <label class="switch hide-small"><span>Focus mode<small>Hide the curriculum and contents panels</small></span><input type="checkbox" data-toggle="focus"></label>
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

export default function SyllabusPage() {
  useEffect(() => {
    // Same interactivity wiring as src/app/notes/page.tsx — see the comments
    // there for why this runs through useEffect rather than a <script> tag.
    var root = document.documentElement;
    var sizes = ["s", "m", "l", "xl", "xxl"];
    var sizeNames: Record<string, string> = { s: "Smaller", m: "Default", l: "Large", xl: "Larger", xxl: "Largest" };
    var statusLine = document.getElementById("settings-status");

    document.querySelectorAll("[data-clone]").forEach(function (slot) {
      var source = document.getElementById(slot.getAttribute("data-clone")!);
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
      ].filter(Boolean).join(" ");
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
