"use client";

import { AlertTriangle, Loader2, Printer } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import ExamPaperView, { type PaperMeta } from "@/components/ExamPaperView";
import MarkdownViewer from "@/components/MarkdownViewer";
import { auth } from "@/lib/firebase";
import { IconSprite, Icon } from "@/components/reader/IconSprite";
import { useScrollSpy } from "@/components/reader/useScrollSpy";

/**
 * A solved past paper, laid out the way a student writes an answer script:
 * question number, the question, the marks in the margin, then the answer, then
 * how the examiner splits those marks.
 *
 * The Reader's header/rail/toc chrome wraps this for navigation between
 * questions, but the paper itself (ExamPaperView) keeps its own print-replica
 * styling rather than becoming Reader "prose" — it exists specifically to look
 * like the original printed script, including under print-to-PDF.
 */

interface SolvedQuestion {
  number: string;
  group?: string;
  type: "mcq" | "written";
  question: string;
  marks: number | null;
  answer: string;
  explanation: string;
  rubric: string[];
  rubricBalanced?: boolean;
  confidence: "high" | "medium" | "low";
}

interface SolvedPaper {
  id: string;
  source: string;
  paper_type: string;
  meta?: PaperMeta;
  missing_numbers?: string[];
  questions: SolvedQuestion[];
  sources: { title: string; uri: string }[];
  grounded: boolean;
  low_confidence_count: number;
  created_at: string;
}

export default function SolvedPaperPage({ params }: { params: any }) {
  const { id } = use(params) as { id: string };
  const { user, loading: authLoading } = useAuth();
  const [paper, setPaper] = useState<SolvedPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"paper" | "solutions" | "markdown">("solutions");
  const [railHidden, setRailHidden] = useState(false);
  const [tocHidden, setTocHidden] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1400);

  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const paperMarkdown = useMemo(() => {
    if (!paper) return "";
    const lines: string[] = [];
    const title = paper.meta?.subjectName || paper.source;
    lines.push(`# ${title}`);
    lines.push(`**University / Examination Board**: ${paper.meta?.university || "Purbanchal University"}`);
    if (paper.meta?.year) lines.push(`**Examination Year**: ${paper.meta.year}`);
    if (paper.meta?.fullMarks) {
      lines.push(`**Full Marks**: ${paper.meta.fullMarks} | **Pass Marks**: ${paper.meta.passMarks || "N/A"}`);
    }
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push("## Examination Questions & Verified Solutions");
    lines.push("");

    paper.questions.forEach((q) => {
      lines.push(`### Question ${q.number} ${q.marks ? `[${q.marks} Marks]` : ""}`);
      lines.push(`${q.question}`);
      lines.push("");
      lines.push("**Verified Answer / Model Solution:**");
      lines.push(`${q.answer}`);
      lines.push("");
      if (q.explanation) {
        lines.push(`> **Examiner Rubric & Marking Scheme:**`);
        lines.push(`> ${q.explanation}`);
        lines.push("");
      }
      lines.push("---");
      lines.push("");
    });

    return lines.join("\n");
  }, [paper]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const token = await auth.currentUser!.getIdToken();
        const res = await fetch("/api/me/papers", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "Could not load this paper");
        const found = (body.papers ?? []).find((p: SolvedPaper) => p.id === id);
        if (!found) {
          setError("That paper is not in your library.");
          return;
        }
        setPaper(found);
      } catch (err) {
        console.error("Solved paper load failed:", err);
        setError("Could not load this paper.");
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading, user, id]);

  const questionAnchors = useMemo(
    () => (paper ? paper.questions.map((q) => `q-${q.number}`) : []),
    [paper]
  );
  const activeAnchor = useScrollSpy(mode === "markdown" ? [] : questionAnchors);

  const showRail = viewportWidth >= 1280 && !railHidden;
  const showToc = viewportWidth >= 768 && !tocHidden;
  const shellStyle = {
    gridTemplateColumns: [showRail ? "var(--rail-w)" : null, "minmax(0, 1fr)", showToc ? "var(--toc-w)" : null]
      .filter(Boolean)
      .join(" "),
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/40">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!user || error || !paper) {
    return (
      <div className="min-h-screen bg-zinc-50/40 flex items-center justify-center px-4">
        <div className="max-w-sm text-center space-y-3">
          <h1 className="text-xl font-bold text-zinc-900">
            {!user ? "Sign in to view this paper" : error ?? "Not found"}
          </h1>
          <Link
            href={user ? "/papers" : "/login"}
            className="inline-block px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm"
          >
            {user ? "Back to your papers" : "Log in"}
          </Link>
        </div>
      </div>
    );
  }

  const title = paper.meta?.subjectName || paper.source;

  return (
    <>
      <IconSprite />
      <a href="#main" className="skip">Skip to paper</a>

      <header className="app-header">
        <div className="app-header__inner">
          <button
            type="button"
            className="icon-btn"
            style={{ display: viewportWidth >= 1280 ? "inline-grid" : "none" }}
            onClick={() => setRailHidden((v) => !v)}
            aria-label="Show or hide the question list"
          >
            <Icon name="i-menu" />
          </button>
          <Link href="/papers" className="wordmark">Papers</Link>
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li><span>{title}</span></li>
            </ol>
          </nav>
          <div className="header-actions">
            <div className="segmented" style={{ display: "flex" }}>
              {(
                [
                  { id: "paper", label: "Question paper" },
                  { id: "solutions", label: "With solutions" },
                  { id: "markdown", label: "Official .md" },
                ] as const
              ).map(({ id, label }) => (
                <label key={id} className={mode === id ? "is-checked" : undefined}>
                  <input
                    type="radio"
                    name="paper-mode"
                    checked={mode === id}
                    onChange={() => setMode(id)}
                  />
                  {label}
                </label>
              ))}
            </div>
            <button type="button" className="icon-btn" onClick={() => window.print()} aria-label="Print or save as PDF">
              <Printer className="icon" />
            </button>
            <button
              type="button"
              className="icon-btn"
              style={{ display: viewportWidth >= 768 ? "inline-grid" : "none" }}
              onClick={() => setTocHidden((v) => !v)}
              aria-label="Show or hide the on-this-page panel"
            >
              <Icon name="i-list" />
            </button>
          </div>
        </div>
      </header>

      <div className="shell" style={shellStyle}>
        {showRail && (
          <aside className="rail" aria-label="Questions">
            <h2 className="course-title">{title}</h2>
            <p className="course-meta">{paper.questions.length} questions &middot; {paper.paper_type}</p>
            {mode !== "markdown" && (
              <ul className="tree">
                {paper.questions.map((q) => (
                  <li key={q.number}>
                    <a href={`#q-${q.number}`} aria-current={activeAnchor === `q-${q.number}` ? "page" : undefined}>
                      <span className="code">{q.number}</span>
                      {q.question.length > 60 ? `${q.question.slice(0, 60)}…` : q.question}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        )}

        <main id="main" className="sheet">
          <div style={{ maxWidth: "var(--measure)", marginInline: "auto" }}>
            {!!paper.missing_numbers?.length && (
              <div className="block block--warning">
                <p className="block__label">
                  <AlertTriangle className="icon" /> Incomplete paper
                </p>
                <p>
                  Question{paper.missing_numbers.length === 1 ? "" : "s"}{" "}
                  {paper.missing_numbers.join(", ")} could not be solved and{" "}
                  {paper.missing_numbers.length === 1 ? "is" : "are"} missing below. Solve it again,
                  or work {paper.missing_numbers.length === 1 ? "that one" : "those"} through with
                  Sarthi.
                </p>
              </div>
            )}

            {!paper.grounded && (
              <div className="block block--tip">
                <p className="block__label">Unverified</p>
                <p>
                  These solutions were written without consulting external sources. Check anything
                  you are unsure of against your textbook or teacher before memorising it.
                </p>
              </div>
            )}
          </div>

          {mode === "markdown" ? (
            <div style={{ maxWidth: "var(--measure)", marginInline: "auto" }}>
              <MarkdownViewer
                content={paperMarkdown}
                title={title}
                downloadFilename={`${paper.id}.md`}
                showActions={true}
              />
            </div>
          ) : (
            <ExamPaperView
              meta={paper.meta}
              questions={paper.questions}
              mode={mode}
              fallbackTitle={paper.source}
            />
          )}
        </main>

        {showToc && (
          <aside className="toc" aria-label="On this page">
            {mode !== "markdown" && (
              <>
                <h2>On this page</h2>
                <ol className="toc-list">
                  {paper.questions.map((q) => (
                    <li key={q.number}>
                      <a href={`#q-${q.number}`} aria-current={activeAnchor === `q-${q.number}` ? "location" : undefined}>
                        Q{q.number}
                      </a>
                    </li>
                  ))}
                </ol>
              </>
            )}
            {paper.sources.length > 0 && mode === "solutions" && (
              <div className="asked-in">
                <h2>Sources consulted</h2>
                <ul className="asked-in-list">
                  {paper.sources.slice(0, 8).map((s) => (
                    <li key={s.uri}>
                      <span className="asked-in-paper">{s.title || s.uri}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        )}
      </div>

      <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--ink-3)", padding: "1rem" }}>
        Solutions are generated for your own revision. Check anything marked uncertain before
        relying on it in an exam.
      </p>
    </>
  );
}
