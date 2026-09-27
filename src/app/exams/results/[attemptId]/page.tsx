"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, collection, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Calendar,
  Clock,
  ShieldAlert,
  Compass,
  Sparkles,
  ArrowRight,
  Download,
  Printer,
  FileText as FileTextIcon,
} from "lucide-react";
import Link from "next/link";
import { ExamReview } from "@/components/ExamReview";
import { parseStoredRubric } from "@/lib/rubric-authoring";

export default function ExamResultsPage({ params }: { params: any }) {
  const router = useRouter();
  const { attemptId } = use(params) as { attemptId: string };
  const { user, loading: authLoading, isAdmin } = useAuth();

  const [attempt, setAttempt] = useState<any>(null);
  const [recommendedPaths, setRecommendedPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    // Written answers are graded after submission, so watch the document
    // rather than reading it once — feedback streams in as it lands.
    const unsubscribe = onSnapshot(
      doc(db, "exam_attempts", attemptId),
      (snap) => {
        if (!snap.exists()) {
          setError("Result not found.");
          setLoading(false);
          return;
        }

        const data = { id: snap.id, ...snap.data() } as any;

        if (data.user_id !== user!.uid && !isAdmin) {
          setUnauthorized(true);
          setLoading(false);
          return;
        }

        setAttempt(data);
        setLoading(false);

        // Fetch recommended learning paths
        getDocs(collection(db, "learningPaths"))
          .then((pathsSnap) => {
            const list = pathsSnap.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            }));
            setRecommendedPaths(list.slice(0, 2));
          })
          .catch((e) => console.warn("Could not load recommended paths:", e));
      },
      (err) => {
        console.error("Error watching results:", err);
        setError("Failed to load results. Please try again.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [attemptId, user, authLoading, isAdmin, router]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-white">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">Retrieving your results</p>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-white">
        <ShieldAlert className="w-12 h-12 text-red-500 mb-5" />
        <h1 className="text-xl font-bold mb-2 text-zinc-900">Access denied</h1>
        <p className="text-zinc-500 max-w-sm mb-6 text-sm">You can only view your own exam performance data. If you believe this is an error, please contact support.</p>
        <Link href="/dashboard" className="px-6 py-3 bg-primary-600 text-white rounded-md font-semibold text-sm shadow-button hover:bg-primary-700 transition-colors">
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
        <AlertCircle className="w-12 h-12 text-red-500 mb-5" />
        <h1 className="text-xl font-bold mb-4 text-zinc-900">{error || "Something went wrong"}</h1>
        <Link href="/dashboard" className="px-6 py-3 bg-primary-600 text-white rounded-md font-semibold text-sm hover:bg-primary-700 transition-colors">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const breakdown = attempt.answers_json?.breakdown ?? [];
  const dateStr = attempt.attempted_at ? new Date(attempt.attempted_at).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }) : "Recent attempt";

  const timeStr = attempt.attempted_at ? new Date(attempt.attempted_at).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  }) : "";

  const resultMarkdown = buildResultMarkdown(attempt, breakdown, dateStr, timeStr);

  return (
    <div className="min-h-screen bg-zinc-50/40 pb-16 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          href="/dashboard/history"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-6 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to history
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 md:p-10 rounded-lg border border-zinc-200 shadow-xs"
        >
          <header className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold uppercase tracking-wider mb-4">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Attempt finalized
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight text-zinc-900 leading-tight">
              {attempt.exam_title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-500 text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {dateStr}
              </div>
              {timeStr && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {timeStr}
                </div>
              )}
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <ResultStat
              label="Final score"
              value={`${attempt.score}/${attempt.total_questions || attempt.total_marks || '?'}`}
              color="text-primary-600"
              subValue="Points"
            />
            <ResultStat
              label="Accuracy"
              value={`${Number(attempt.percentage || 0).toFixed(1)}%`}
              subValue="Percentage"
            />
            <ResultStat
              label="Time spent"
              value={formatDuration(attempt.time_spent_seconds || 0)}
              subValue="Duration"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-3 justify-center mb-10">
            <Link
              href={`/exams/${attempt.exam_id}/take`}
              className="px-6 py-3 bg-primary-600 text-white rounded-md font-semibold text-sm shadow-button hover:bg-primary-700 transition-colors text-center flex-1"
            >
              Retake exam
            </Link>
            <Link
              href="/exams"
              className="px-6 py-3 bg-white border border-zinc-200 text-zinc-700 rounded-md font-semibold text-sm hover:bg-zinc-50 transition-colors text-center flex-1"
            >
              Browse more exams
            </Link>
          </div>

          {/* Recommended Learning Path based on attempt performance */}
          {recommendedPaths.length > 0 && (
            <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-primary-50/50 to-white border border-primary-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-800 text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-primary-600" />
                    Adaptive Recommendation
                  </div>
                  <h3 className="text-base font-bold text-zinc-900">
                    Target Weak Topics with Structured Learning
                  </h3>
                  <p className="text-xs text-zinc-600">
                    Strengthen concepts tested in this exam by progressing through accredited university course sequences.
                  </p>
                </div>
                <Link
                  href="/learning-paths"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary-700 hover:text-primary-800 shrink-0"
                >
                  View All Paths <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {recommendedPaths.map((path) => (
                  <Link
                    key={path.id}
                    href={`/learning-paths/${path.id}`}
                    className="p-4 rounded-xl bg-white border border-zinc-200 hover:border-primary-500 transition-all flex flex-col justify-between group shadow-xs hover:shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-indigo-600 flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5" />
                          {path.difficulty || "Intermediate"}
                        </span>
                        <span className="text-zinc-400 font-medium">{path.estimatedHours || 50}h sequence</span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-900 group-hover:text-primary-600 transition-colors">
                        {path.name}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                        {path.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-primary-600">
                      <span>Begin Sequence</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-100" />
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 whitespace-nowrap">Detailed review</h2>
              <div className="h-px flex-1 bg-zinc-100" />
            </div>

            <div className="flex flex-wrap justify-end gap-2 print:hidden">
              <button
                type="button"
                onClick={() => downloadResult(attempt.exam_title, resultMarkdown)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-zinc-600 border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Save result
              </button>
              <button
                type="button"
                onClick={() => exportResultAsWord(attempt.exam_title, resultMarkdown)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-zinc-600 border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors"
              >
                <FileTextIcon className="w-3.5 h-3.5" />
                Export as Word
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-zinc-600 border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save as PDF
              </button>
            </div>

            <ExamReview breakdown={breakdown} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Minimal Markdown → HTML for the Word export below. Only covers what
 * buildResultMarkdown actually emits (headings, bold, tables, blockquotes,
 * list items, hr) — this is not a general renderer.
 */
function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const html: string[] = [];
  let inTable = false;
  let inList = false;

  const inline = (text: string) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw.replace(/^&gt;\s?/, "").trimEnd();

    if (/^\|.*\|$/.test(line)) {
      if (/^\|[\s-]+\|$/.test(line.replace(/[^|-]/g, (c) => (c === "|" ? "|" : "-")))) continue; // header divider row
      const cells = line.slice(1, -1).split("|").map((c) => inline(c.trim()));
      if (!inTable) {
        html.push("<table border=\"1\" cellspacing=\"0\" cellpadding=\"4\" style=\"border-collapse:collapse;width:100%\">");
        html.push("<tr>" + cells.map((c) => `<th>${c}</th>`).join("") + "</tr>");
        inTable = true;
      } else {
        html.push("<tr>" + cells.map((c) => `<td>${c}</td>`).join("") + "</tr>");
      }
      continue;
    }
    if (inTable) {
      html.push("</table>");
      inTable = false;
    }

    if (line.startsWith("### ")) { closeList(); html.push(`<h3>${inline(line.slice(4))}</h3>`); continue; }
    if (line.startsWith("## ")) { closeList(); html.push(`<h2>${inline(line.slice(3))}</h2>`); continue; }
    if (line.startsWith("# ")) { closeList(); html.push(`<h1>${inline(line.slice(2))}</h1>`); continue; }
    if (line === "---") { closeList(); html.push("<hr/>"); continue; }
    if (line.startsWith("- ")) {
      if (!inList) { html.push("<ul>"); inList = true; }
      html.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }
    closeList();
    if (line.startsWith(">")) { html.push(`<blockquote>${inline(line.replace(/^>\s?/, ""))}</blockquote>`); continue; }
    if (line.trim() === "") { html.push("<p></p>"); continue; }
    html.push(`<p>${inline(line)}</p>`);
  }
  if (inTable) html.push("</table>");
  closeList();

  return html.join("\n");
}

/**
 * A .doc file that's actually HTML — Word opens HTML saved with a .doc
 * extension and the right MIME/namespace declarations natively, so this needs
 * no docx-generation library, matching how the rest of the app keeps exports
 * dependency-free (see MarkdownViewer's own Copy/Download).
 */
function exportResultAsWord(examTitle: string, markdown: string) {
  const body = markdownToHtml(markdown);
  const doc = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${examTitle}</title></head>
<body style="font-family:Calibri,Arial,sans-serif;font-size:11pt">${body}</body>
</html>`;
  const blob = new Blob(["﻿", doc], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${examTitle.replace(/[^a-z0-9]+/gi, "_")}_result.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Saves the result as a plain text file the student can revise from later.
 * It's written in Markdown internally (that's just a sane plain-text format
 * for headings/tables), but nothing about the UI calls that out — the student
 * just gets "their result", not a file-format decision to make.
 */
function downloadResult(examTitle: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${examTitle.replace(/[^a-z0-9]+/gi, "_")}_result.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function ResultStat({ label, value, color = "text-zinc-900", subValue }: any) {
  return (
    <div className="p-6 bg-zinc-50 rounded-lg border border-zinc-200 text-center flex flex-col items-center justify-center">
      <div className={`text-2xl font-bold mb-1 tabular-nums ${color}`}>{value}</div>
      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">{label}</div>
      {subValue && <div className="text-[10px] text-zinc-400 font-semibold uppercase">{subValue}</div>}
    </div>
  );
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

/**
 * Every field ExamReview shows on screen, restated as Markdown — not a
 * summary. A student saving this for revision should never have to come back
 * to the site to see something that was visible in the interactive view.
 */
function buildResultMarkdown(attempt: any, breakdown: any[], dateStr: string, timeStr: string): string {
  const lines: string[] = [];

  lines.push(`# ${attempt.exam_title}`);
  lines.push("");
  lines.push(`**Date**: ${dateStr}${timeStr ? ` at ${timeStr}` : ""}`);
  lines.push(
    `**Score**: ${attempt.score}/${attempt.total_questions || attempt.total_marks || "?"} ` +
      `(${Number(attempt.percentage || 0).toFixed(1)}%)`
  );
  lines.push(`**Time spent**: ${formatDuration(attempt.time_spent_seconds || 0)}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(
    `## Answer review (${breakdown.filter((b) => b.isCorrect).length} correct · ` +
      `${breakdown.filter((b) => !b.isCorrect).length} incorrect)`
  );
  lines.push("");

  breakdown.forEach((item, idx) => {
    lines.push(`### Question ${idx + 1} — ${item.isCorrect ? "Correct" : "Incorrect"} (${item.marksAwarded > 0 ? "+" : ""}${item.marksAwarded} marks)`);
    lines.push("");
    lines.push(item.question_text);
    lines.push("");

    if (item.type === "written") {
      lines.push("**Your answer:**");
      lines.push("");
      lines.push(item.writtenAnswer ? `> ${item.writtenAnswer.replace(/\n/g, "\n> ")}` : "> *(left blank)*");
      lines.push("");

      if (item.attachmentUrls?.length) {
        lines.push("**Attached diagrams:**");
        item.attachmentUrls.forEach((url: string, i: number) => lines.push(`- [Diagram ${i + 1}](${url})`));
        lines.push("");
      }

      if (item.teacherReviewed && item.teacherFeedback) {
        lines.push(`**Teacher feedback:** ${item.teacherFeedback}`);
        lines.push("");
      }

      if (item.grading_status === "pending") {
        lines.push("*Grading in progress at the time this was saved.*");
        lines.push("");
      } else {
        if (item.strengths?.length) {
          lines.push("**What you did well:**");
          item.strengths.forEach((s: string) => lines.push(`- ${s}`));
          lines.push("");
        }
        if (item.gaps?.length) {
          lines.push("**Where you can improve:**");
          item.gaps.forEach((g: string) => lines.push(`- ${g}`));
          lines.push("");
        }
        if (item.nextStep) {
          lines.push(`**Do this next:** ${item.nextStep}`);
          lines.push("");
        }
        if (!item.strengths?.length && !item.gaps?.length && item.aiFeedback) {
          lines.push(`**AI feedback:** ${item.aiFeedback}`);
          lines.push("");
        }
        if (item.concepts?.length) {
          lines.push(`**Concepts:** ${item.concepts.join(", ")}`);
          lines.push("");
        }
      }

      const criteria = parseStoredRubric(item.rubric ?? "");
      if (criteria.length > 0) {
        lines.push(`**How the marks are awarded** (${item.marksAwarded} of ${item.fullMarks ?? "?"}):`);
        lines.push("");
        lines.push("| Marks | Criterion |");
        lines.push("|---|---|");
        criteria.forEach((c) => lines.push(`| ${c.marks} | ${c.criterion} |`));
        lines.push("");
      }

      if (item.modelAnswer) {
        lines.push("**Model answer:**");
        lines.push("");
        lines.push(`> ${item.modelAnswer.replace(/\n/g, "\n> ")}`);
        lines.push("");
      }
    } else {
      (["a", "b", "c", "d"] as const).forEach((opt) => {
        const label = item[`option_${opt}`];
        if (!label) return;
        const isCorrectOpt = item.correctAnswer === opt;
        const isSelected = item.selectedAnswer === opt;
        const marker = isCorrectOpt ? "✅" : isSelected ? "❌" : "▫️";
        lines.push(`- ${marker} **${opt.toUpperCase()}.** ${label}`);
      });
      lines.push("");
      if (item.explanation) {
        lines.push(`**Explanation:** ${item.explanation}`);
        lines.push("");
      }
    }

    if (!item.selectedAnswer && !item.isCorrect) {
      lines.push("*This question was left unanswered during the exam.*");
      lines.push("");
    }

    lines.push("---");
    lines.push("");
  });

  return lines.join("\n");
}
