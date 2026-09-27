"use client";

import { AlertTriangle, ArrowLeft, Loader2, Printer, FileText } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import ExamPaperView, { type PaperMeta } from "@/components/ExamPaperView";
import MarkdownViewer from "@/components/MarkdownViewer";
import { auth } from "@/lib/firebase";

/**
 * A solved past paper, laid out the way a student writes an answer script:
 * question number, the question, the marks in the margin, then the answer, then
 * how the examiner splits those marks.
 *
 * Styled to survive print-to-PDF so it can be revised from on paper.
 */

interface SolvedQuestion {
  number: string;
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

  return (
    <div className="min-h-screen bg-zinc-100 py-8 px-4 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-3 print:hidden">
          <Link
            href="/papers"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-primary-600"
          >
            <ArrowLeft className="w-4 h-4" /> Your papers
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:border-primary-300"
          >
            <Printer className="w-3.5 h-3.5" /> Print or save as PDF
          </button>
        </div>

        {!!paper.missing_numbers?.length && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200 print:hidden">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-900 leading-relaxed">
              <strong>
                Question{paper.missing_numbers.length === 1 ? "" : "s"}{" "}
                {paper.missing_numbers.join(", ")} could not be solved
              </strong>{" "}
              and {paper.missing_numbers.length === 1 ? "is" : "are"} missing below. This paper is
              incomplete — solve it again, or work {paper.missing_numbers.length === 1 ? "that one" : "those"} through
              with Sarthi.
            </p>
          </div>
        )}

        {!paper.grounded && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-amber-50 border border-amber-200 print:hidden">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-relaxed">
              These solutions were written without consulting external sources. They are a strong
              starting point, but check anything you are unsure of against your textbook or teacher
              before memorising it.
            </p>
          </div>
        )}

        {/* Toggle: attempt the paper cold, or study it with solutions. */}
        <div className="flex gap-1.5 print:hidden">
          {(
            [
              { id: "paper", label: "Question paper" },
              { id: "solutions", label: "With solutions" },
              { id: "markdown", label: "Official .md View" },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              aria-pressed={mode === id}
              className={`px-3.5 py-2 rounded-md border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                mode === id
                  ? "bg-primary-50 border-primary-300 text-primary-700"
                  : "bg-white border-zinc-200 text-zinc-600 hover:border-primary-300"
              }`}
            >
              {id === "markdown" && <FileText className="w-3.5 h-3.5" />}
              <span>{label}</span>
            </button>
          ))}
        </div>

        {mode === "markdown" ? (
          <MarkdownViewer
            content={paperMarkdown}
            title={paper.meta?.subjectName || paper.source}
            downloadFilename={`${paper.id}.md`}
            showActions={true}
          />
        ) : (
          <ExamPaperView
            meta={paper.meta}
            questions={paper.questions}
            mode={mode}
            fallbackTitle={paper.source}
          />
        )}

        {paper.sources.length > 0 && mode === "solutions" && (
          <div className="px-1 print:hidden">
            <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400 mb-1">
              Sources consulted
            </p>
            <ul className="space-y-0.5">
              {paper.sources.slice(0, 8).map((sourceItem) => (
                <li key={sourceItem.uri} className="text-[11px] text-zinc-500 truncate">
                  {sourceItem.title || sourceItem.uri}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-[11px] text-zinc-400 text-center print:hidden">
          Solutions are generated for your own revision. Check anything marked uncertain before
          relying on it in an exam.
        </p>
      </div>
    </div>
  );
}
