"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Play,
  RefreshCw,
} from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { PageHeader, SectionCard, PrimaryButton, Alert } from "@/components/UIComponents";
import type { Job, Paper, Question } from "@/lib/examai/types";

interface PageUrl {
  path: string;
  url: string | null;
}

const TYPE_LABEL: Record<Question["type"], string> = {
  theory: "Theory",
  numerical: "Numerical",
  short_note: "Short note",
  comparison: "Comparison",
  diagram: "Diagram",
};

/**
 * Renders `[UNCLEAR: ...]` spans as visible marks rather than raw text.
 *
 * These are the words the model could not read. Leaving them as plain text
 * would let a reviewer skim past one — which is exactly the case where the
 * extracted question quietly does not match the paper.
 */
function QuestionText({ text }: { text: string | null }) {
  if (text === null) {
    return (
      <p className="text-sm italic text-red-600">
        Text could not be read from the scan. Check the original.
      </p>
    );
  }

  const segments = text.split(/(\[UNCLEAR:[^\]]*\])/g);
  return (
    <p className="text-sm text-zinc-800 leading-relaxed whitespace-pre-wrap">
      {segments.map((segment, i) =>
        segment.startsWith("[UNCLEAR:") ? (
          <mark key={i} className="bg-amber-100 text-amber-900 rounded px-1 font-medium">
            {segment}
          </mark>
        ) : (
          <span key={i}>{segment}</span>
        )
      )}
    </p>
  );
}

function QuestionCard({ question, depth = 0 }: { question: Question; depth?: number }) {
  return (
    <div className={depth > 0 ? "mt-3 pl-4 border-l-2 border-zinc-100" : ""}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs font-bold text-zinc-900">{question.qId}</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-zinc-600">
            {TYPE_LABEL[question.type] ?? question.type}
          </span>
          <span className="text-xs text-zinc-500">
            {question.marks === null ? "marks not printed" : `${question.marks} marks`}
          </span>
          {question.markSplit && (
            <span className="text-[11px] text-zinc-400 font-mono">
              {question.markSplit.join("+")}
            </span>
          )}
          {question.choiceRule && (
            <span className="text-[11px] px-1.5 py-0.5 rounded border border-violet-200 bg-violet-50 text-violet-700 font-semibold">
              choose {question.choiceRule.choose}
            </span>
          )}
          {question.unclear ? (
            <span className="text-[11px] px-1.5 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-800 font-semibold">
              needs review
            </span>
          ) : (
            <span className="text-[11px] px-1.5 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold">
              clean
            </span>
          )}
          {question.confidence !== "high" && (
            <span className="text-[11px] text-zinc-500">{question.confidence} confidence</span>
          )}
        </div>
        {question.sourcePage && (
          <span className="text-[11px] text-zinc-400 shrink-0">p{question.sourcePage}</span>
        )}
      </div>

      <div className="mt-2">
        <QuestionText text={question.textExact} />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {question.syllabusUnits.map((tag) => (
          <span
            key={tag.unitId}
            className={`text-[11px] px-1.5 py-0.5 rounded border font-mono ${
              tag.confidence === "low"
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-sky-200 bg-sky-50 text-sky-700"
            }`}
            title={`${tag.confidence} confidence, tagged by ${tag.taggedBy}`}
          >
            {tag.unitId}
          </span>
        ))}
        {question.syllabusUnits.length === 0 && (
          <span className="text-[11px] text-amber-700">no syllabus unit matched</span>
        )}
      </div>

      {/* The reason a question was flagged. Always shown — a flag with no
          reason costs the reviewer the time it was meant to save. */}
      {question.reviewNote && (
        <p className="mt-2 text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded px-2 py-1.5">
          {question.reviewNote}
        </p>
      )}

      {question.subParts?.map((sub) => (
        <QuestionCard key={sub.qId} question={sub} depth={depth + 1} />
      ))}
    </div>
  );
}

function JobPanel({ job }: { job: Job | null }) {
  if (!job) {
    return <p className="text-sm text-zinc-500">Extraction has not been run for this paper yet.</p>;
  }

  const { done, total } = job.progress ?? { done: 0, total: 0 };
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold capitalize">{job.stage}</span>
        <span
          className={`text-[11px] px-1.5 py-0.5 rounded border font-semibold ${
            job.status === "succeeded"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : job.status === "failed"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-sky-200 bg-sky-50 text-sky-700"
          }`}
        >
          {job.status}
        </span>
        {job.attempts > 1 && (
          <span className="text-xs text-zinc-500">attempt {job.attempts}</span>
        )}
      </div>

      {job.status === "running" && (
        <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
          <div
            className="h-full bg-primary-600 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      {job.error && (
        <Alert type="error" title="Extraction failed" description={job.error} />
      )}

      {job.logs?.length > 0 && (
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 max-h-56 overflow-y-auto">
          {job.logs.map((entry, i) => (
            <div key={i} className="font-mono text-[11px] leading-relaxed">
              <span
                className={
                  entry.level === "error"
                    ? "text-red-600"
                    : entry.level === "warn"
                      ? "text-amber-700"
                      : "text-zinc-500"
                }
              >
                {entry.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPaperDetailPage() {
  const { paperId } = useParams<{ paperId: string }>();
  const { user } = useAuth();

  const [paper, setPaper] = useState<Paper | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pageUrls, setPageUrls] = useState<PageUrl[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Fetches only — no state writes, so callers decide whether the result is still wanted. */
  const fetchPaper = useCallback(async () => {
    if (!user) return null;
    const token = await user.getIdToken();
    const response = await fetch(`/api/admin/papers/${paperId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Could not load that paper.");
    return data as { paper: Paper; questions: Question[]; pageUrls: PageUrl[] };
  }, [user, paperId]);

  const load = useCallback(async () => {
    try {
      const data = await fetchPaper();
      if (!data) return;
      setPaper(data.paper);
      setQuestions(data.questions ?? []);
      setPageUrls(data.pageUrls ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load that paper.");
    } finally {
      setLoading(false);
    }
  }, [fetchPaper]);

  useEffect(() => {
    // `cancelled` guards the unmount race: without it, leaving the page during
    // the fetch writes state on a dead component.
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchPaper();
        if (cancelled || !data) return;
        setPaper(data.paper);
        setQuestions(data.questions ?? []);
        setPageUrls(data.pageUrls ?? []);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load that paper.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchPaper]);

  // Live job progress. The job id is derived (`<paperId>__extract`), so this
  // subscribes to one document rather than querying — no index needed, and the
  // listener attaches before the job exists without erroring.
  useEffect(() => {
    if (!paperId) return;
    const unsubscribe = onSnapshot(
      doc(db, "jobs", `${paperId}__extract`),
      (snap) => {
        const next = snap.exists() ? (snap.data() as Job) : null;
        setJob(next);
        // When a run finishes, pull the questions it wrote. The questions live
        // in a subcollection this page reads through the API (for signed scan
        // URLs), so the listener is the trigger rather than the data source.
        if (next?.status === "succeeded") void load();
      },
      (err) => console.error("Job listener failed:", err)
    );
    return unsubscribe;
  }, [paperId, load]);

  async function startExtraction(force = false) {
    if (!user) return;
    setStarting(true);
    setError(null);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/admin/papers/${paperId}/extract`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ force }),
      });
      const data = await response.json();

      if (response.status === 409 && data.error === "needs_confirmation") {
        if (window.confirm(data.message)) return startExtraction(true);
        return;
      }
      if (!response.ok) throw new Error(data.error ?? "Could not start extraction.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start extraction.");
    } finally {
      setStarting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-500 py-16 justify-center">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading…
      </div>
    );
  }

  if (!paper) {
    return <Alert type="error" title={error ?? "No such paper."} />;
  }

  const flagged = questions.filter((q) => q.unclear).length;
  const running = job?.status === "running";
  const coverageComplete = paper.coverage?.status === "complete";

  return (
    <div className="space-y-6">
      <Link
        href="/admin/papers"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft className="w-4 h-4" /> All papers
      </Link>

      <PageHeader
        badge={paper.status}
        title={`${paper.courseId} · ${paper.year}`}
        subtitle={`${paper.examType} · ${paper.fullMarks || "?"} full marks · ${
          paper.imagePaths?.length ?? 0
        } page scan(s)`}
        actions={
          <PrimaryButton
            onClick={() => startExtraction(false)}
            disabled={starting || running}
            icon={
              starting || running ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : questions.length > 0 ? (
                <RefreshCw className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )
            }
          >
            {running ? "Extracting…" : questions.length > 0 ? "Re-extract" : "Extract questions"}
          </PrimaryButton>
        }
      />

      {error && <Alert type="error" title={error} icon={<AlertTriangle className="w-4 h-4" />} />}

      {/* Coverage is stated before anything else, because a paper that extracted
          cleanly but incompletely otherwise looks finished. */}
      {questions.length > 0 &&
        (coverageComplete ? (
          <Alert
            type="success"
            title={`Coverage complete — every printed question was extracted.`}
            description={
              flagged > 0
                ? `${flagged} of ${questions.length} question(s) still need a human look.`
                : `All ${questions.length} questions extracted cleanly.`
            }
            icon={<CheckCircle2 className="w-4 h-4" />}
          />
        ) : (
          <Alert
            type="warning"
            title={`Coverage is ${paper.coverage.status} — do not publish this paper yet.`}
            description={paper.coverage.missingRanges?.join(" · ") || paper.coverage.notes}
            icon={<AlertTriangle className="w-4 h-4" />}
          />
        ))}

      {paper.extractionNotes && (
        <Alert
          type={paper.extractionNotes.includes("RECONCILE") ? "warning" : "info"}
          title="Extraction notes"
          description={paper.extractionNotes}
        />
      )}

      <SectionCard title="Extraction job">
        <JobPanel job={job} />
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Original scans" description="What the extraction read.">
          <div className="space-y-3">
            {pageUrls.map((page, index) => (
              <div key={page.path}>
                <p className="text-[11px] font-mono text-zinc-400 mb-1">page {index + 1}</p>
                {page.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={page.url}
                    alt={`Page ${index + 1} of ${paper.paperId}`}
                    className="w-full rounded-md border border-zinc-200"
                  />
                ) : (
                  <p className="text-xs text-red-600">Scan unavailable.</p>
                )}
              </div>
            ))}
            {pageUrls.length === 0 && (
              <p className="text-sm text-zinc-500">No scans uploaded.</p>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title={`Extracted questions (${questions.length})`}
          description={
            paper.groups?.length
              ? paper.groups
                  .map(
                    (g) =>
                      `Group ${g.label}: answer ${g.answerCount} of ${g.questionsPrinted} · ${g.marksTotal} marks`
                  )
                  .join(" · ")
              : undefined
          }
        >
          {questions.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Nothing extracted yet. Use “Extract questions” above.
            </p>
          ) : (
            <div className="divide-y divide-zinc-100">
              {questions.map((question) => (
                <div key={question.qId} className="py-4 first:pt-0 last:pb-0">
                  <QuestionCard question={question} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
