"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import type {
  AdjacentTopic,
  ReaderDocument,
  ReaderSection,
  SpineNode,
  TreeNode,
} from "@/lib/examai/reader";
import type { AskedInQuestion } from "@/lib/examai/asked-in";
import type { ReadingSettings } from "@/lib/examai/reading-settings";

import { AskedIn } from "./AskedIn";
import { EyeBreak } from "./EyeBreak";
import { ReadMoreGate } from "./ReadMoreGate";
import { Icon, IconSprite } from "./IconSprite";
import { OnThisPage } from "./OnThisPage";
import { ReadingSettingsDialog } from "./ReadingSettings";
import { SyllabusTree } from "./SyllabusTree";
import { Watermark } from "./Watermark";
import { useDialog } from "./useDialog";
import { useHashLanding } from "./useHashLanding";
import { useScrollSpy } from "./useScrollSpy";
import { useScrollableTables } from "./useScrollableTables";

interface Props {
  courseCode: string;
  document: ReaderDocument;
  node: SpineNode;
  ancestors: SpineNode[];
  sections: ReaderSection[];
  tree: TreeNode | null;
  adjacent: { previous: AdjacentTopic | null; next: AdjacentTopic | null };
  articleHtml: string;
  askedIn: AskedInQuestion[];
  gated: boolean;
  signInHref: string;
  settings: ReadingSettings;
  /** True when the user agent looks like a TV — suggests, never switches. */
  tvSuggested: boolean;
  readingMinutes: number;
  /** The signed-in reader's email, tiled faintly across the lesson; null when signed out (nothing to trace, and the preview is already public). */
  watermarkLabel: string | null;
}

/**
 * How far through the lesson the reader is.
 *
 * Styled by reader.css as a hairline across the top. Worth the listener on a
 * note this long: without it there is no cue whether the worked example is two
 * screens away or ten.
 */
function ReadingProgress() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPercent(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // reader.css drives this with `transform: scaleX(var(--progress, 0))`, so the
  // value has to be the CUSTOM PROPERTY, not a width. Setting inline-size left
  // the span at scaleX(0) — a progress bar that was always invisible.
  return (
    <div className="progress" aria-hidden="true">
      <span style={{ "--progress": (percent / 100).toFixed(3) } as React.CSSProperties} />
    </div>
  );
}

const TRUST_LABEL: Record<ReaderDocument["trust_level"], { text: string; level: string }> = {
  ai_draft: { text: "AI draft", level: "ai-draft" },
  code_verified: { text: "Code-verified", level: "code-verified" },
  teacher_verified: { text: "Teacher-verified", level: "teacher-verified" },
};

export function ReaderShell({
  courseCode,
  document: doc,
  node,
  ancestors,
  sections,
  tree,
  adjacent,
  articleHtml,
  askedIn,
  gated,
  signInHref,
  settings: initialSettings,
  tvSuggested,
  readingMinutes,
  watermarkLabel,
}: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [railOpen, setRailOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [learned, setLearned] = useState(false);
  const [tvBannerDismissed, setTvBannerDismissed] = useState(false);

  // Corrects any residual deep-link drift, and bails out the instant the reader
  // takes over. The layout shift itself is fixed at the source — see
  // src/app/fonts.ts and the /learn layout's KaTeX import.
  useHashLanding();

  // Reveals the "swipe sideways" hint only on tables that really overflow.
  useScrollableTables();

  // The root layout renders <html data-*> from the COOKIE, which is what stops
  // a theme flash. A `?view=tv` link asks for something the cookie does not
  // know about yet, so the attributes are reconciled here. Only ever a no-op
  // unless the two disagree.
  useEffect(() => {
    const root = document.documentElement;
    if (settings.viewing === "tv") root.setAttribute("data-viewing", "tv");
    else root.removeAttribute("data-viewing");
    if (settings.theme) root.setAttribute("data-theme", settings.theme);
  }, [settings.viewing, settings.theme]);

  const headings = sections.filter((s) => s.level > 1);
  const activeAnchor = useScrollSpy(headings.map((h) => h.anchor));

  const {
    ref: railRef,
    handleClose: onRailClose,
    handleClick: onRailBackdrop,
  } = useDialog(railOpen, () => setRailOpen(false));
  const {
    ref: tocRef,
    handleClose: onTocClose,
    handleClick: onTocBackdrop,
  } = useDialog(tocOpen, () => setTocOpen(false));

  const unit = ancestors.find((a) => a.kind === "unit");
  const trust = TRUST_LABEL[doc.trust_level] ?? TRUST_LABEL.ai_draft;

  const turnOffEyeBreaks = useCallback(
    () => setSettings((s) => ({ ...s, eyeBreaks: false })),
    []
  );

  const topicHref = (topic: AdjacentTopic) =>
    `/learn/${courseCode.toLowerCase()}/${topic.slug}-${topic.shortId}`;

  return (
    <>
      <IconSprite />
      <ReadingProgress />

      <a href="#main" className="skip">
        Skip to the lesson
      </a>

      <header className="app-header">
        <div className="app-header__inner">
          <button
            type="button"
            className="icon-btn only-drawer"
            aria-label="Open syllabus"
            aria-expanded={railOpen}
            onClick={() => setRailOpen(true)}
          >
            <Icon name="i-tree" />
          </button>

          {/* The demo's wordmark is a link, not a logo: on a narrow screen the
              breadcrumb truncates to nothing, and this stays as the one
              reliable way back out of a topic. */}
          <Link href="/learn" className="wordmark">
            ExamAI
          </Link>

          <nav aria-label="Breadcrumb" className="crumbs">
            <ol>
              <li>
                <Link href={`/learn/${courseCode.toLowerCase()}`}>{courseCode}</Link>
              </li>
              {unit && (
                <li>
                  Unit {unit.code} {unit.title}
                </li>
              )}
            </ol>
          </nav>

          <div className="header-actions">
            {/* `.only-tv` is hidden unless data-viewing="tv", so this is the
                big remote-friendly Contents button for TV, not a way in.
                Entering TV view is a Reading setting or a ?view=tv link. */}
            <button type="button" className="btn only-tv" onClick={() => setTocOpen(true)}>
              <Icon name="i-list" />
              Contents
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label="Reading settings"
              onClick={() => setSettingsOpen(true)}
            >
              <span aria-hidden="true" style={{ font: "700 1.05rem/1.2rem var(--font-book)" }}>
                Aa
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* TV view is SUGGESTED, never switched on automatically: user-agent
          detection guesses wrong often enough that silently reflowing a laptop
          into 29px type would be worse than a missed TV. */}
      {tvSuggested && settings.viewing !== "tv" && !tvBannerDismissed && (
        <div className="break-toast" role="status">
          <p>
            <strong>This looks like a TV.</strong> TV view uses larger text, keeps clear of the
            screen edges and switches to the Blackboard theme.
          </p>
          <div className="actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                setSettings((s) => ({ ...s, viewing: "tv", theme: "blackboard" }));
                document.documentElement.setAttribute("data-viewing", "tv");
                document.documentElement.setAttribute("data-theme", "blackboard");
                setTvBannerDismissed(true);
              }}
            >
              Use TV view
            </button>
            <button
              type="button"
              className="btn btn--quiet"
              onClick={() => setTvBannerDismissed(true)}
            >
              No thanks
            </button>
          </div>
        </div>
      )}

      <div className="shell">
        <aside className="rail" aria-label="Syllabus">
          <div className="rail-content">
            {tree && <SyllabusTree tree={tree} currentPath={node.path} />}
          </div>
        </aside>

        <main className="main sheet" id="main">
          {watermarkLabel && <Watermark label={watermarkLabel} />}
          <article className="prose">
            <h1>{doc.title}</h1>

            <div className="lesson-meta">
              <span className="trust" data-level={trust.level}>
                {trust.text}
              </span>
              <span>
                Topic {node.code} in Unit {unit?.code}, {unit?.title}
              </span>
              <span>About {readingMinutes} minutes</span>
            </div>

            {/* Server-rendered HTML from the shared content package — the same
                renderer the admin preview uses, so what a reviewer approved is
                exactly what a student reads. */}
            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: articleHtml }}
            />

            {gated && <ReadMoreGate signInHref={signInHref} />}

            <div className="lesson-end">
              <button
                type="button"
                className={learned ? "btn" : "btn btn--primary"}
                aria-pressed={learned}
                onClick={() => setLearned((v) => !v)}
              >
                <Icon name="i-check" />
                {learned ? "Marked as learned" : "Mark as learned"}
              </button>
            </div>

            <nav className="pager" aria-label="Nearby topics">
              {adjacent.previous ? (
                <Link href={topicHref(adjacent.previous)} rel="prev">
                  <small>Previous</small>
                  {adjacent.previous.code} {adjacent.previous.title}
                </Link>
              ) : (
                <span />
              )}
              {adjacent.next && (
                <Link href={topicHref(adjacent.next)} rel="next">
                  <small>Next</small>
                  {adjacent.next.code} {adjacent.next.title}
                </Link>
              )}
            </nav>
          </article>
        </main>

        <aside className="toc" aria-label="On this page">
          <div className="toc-content">
            <OnThisPage sections={headings} activeAnchor={activeAnchor} />
            <AskedIn questions={askedIn} />
          </div>
        </aside>
      </div>

      <nav className="toolbar" aria-label="Lesson tools">
        <button type="button" onClick={() => setRailOpen(true)}>
          <Icon name="i-tree" />
          Syllabus
        </button>
        <button type="button" onClick={() => setTocOpen(true)}>
          <Icon name="i-list" />
          Contents
        </button>
        <button type="button" onClick={() => setSettingsOpen(true)}>
          <span aria-hidden="true" style={{ font: "700 1.05rem/1.2rem var(--font-book)" }}>
            Aa
          </span>
          Reading
        </button>
        <button type="button" aria-pressed={learned} onClick={() => setLearned((v) => !v)}>
          <Icon name="i-check" />
          <span>Learned</span>
        </button>
      </nav>

      <dialog
        ref={railRef}
        className="rail-dialog drawer"
        aria-labelledby="rail-dialog-title"
        onClose={onRailClose}
        onClick={onRailBackdrop}
      >
        <div className="dialog__head">
          <h2 id="rail-dialog-title">Syllabus</h2>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close syllabus"
            onClick={() => setRailOpen(false)}
          >
            <Icon name="i-close" />
          </button>
        </div>
        <div className="dialog__body">
          {tree && <SyllabusTree tree={tree} currentPath={node.path} />}
        </div>
      </dialog>

      <dialog
        ref={tocRef}
        className="toc-dialog bottom-sheet"
        aria-labelledby="toc-dialog-title"
        onClose={onTocClose}
        onClick={onTocBackdrop}
      >
        <div className="dialog__head">
          <h2 id="toc-dialog-title">On this page</h2>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close contents"
            onClick={() => setTocOpen(false)}
          >
            <Icon name="i-close" />
          </button>
        </div>
        <div className="dialog__body toc">
          <OnThisPage
            sections={headings}
            activeAnchor={activeAnchor}
            showTitle={false}
            onNavigate={() => setTocOpen(false)}
          />
          <AskedIn questions={askedIn} />
        </div>
      </dialog>

      <ReadingSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onChange={setSettings}
      />

      <EyeBreak enabled={settings.eyeBreaks} onTurnOff={turnOffEyeBreaks} />
    </>
  );
}
