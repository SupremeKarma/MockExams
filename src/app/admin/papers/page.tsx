"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FileText, Upload, AlertTriangle, Loader2, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { PageHeader, SectionCard, PrimaryButton, EmptyState, Alert } from "@/components/UIComponents";
import { WorkspaceRail } from "@/components/workspace/WorkspaceRail";
import { ADMIN_WORKSPACE_ITEMS } from "@/components/workspace/rail-items";
import { EXAM_TYPES, type Course, type ExamType, type Paper } from "@/lib/examai/types";

const STATUS_STYLES: Record<Paper["status"], string> = {
  uploaded: "bg-zinc-100 text-zinc-700 border-zinc-200",
  extracted: "bg-sky-50 text-sky-700 border-sky-200",
  solving: "bg-amber-50 text-amber-700 border-amber-200",
  review: "bg-violet-50 text-violet-700 border-violet-200",
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

function StatusPill({ status }: { status: Paper["status"] }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

/**
 * Coverage is the one number worth showing in a list.
 *
 * A paper whose status is `extracted` tells you a job finished; it does not
 * tell you whether the job captured the whole paper. Surfacing "8/11" here
 * means a partial extraction is visible at a glance instead of only when
 * someone opens the paper and counts.
 */
function CoverageNote({ paper }: { paper: Paper }) {
  const coverage = paper.coverage;
  if (!coverage?.byGroup?.length) return <span className="text-zinc-400">—</span>;

  const extracted = coverage.byGroup.reduce((n, g) => n + g.questionsExtracted, 0);
  const printed = coverage.byGroup.reduce((n, g) => n + g.questionsPrinted, 0);
  const complete = coverage.status === "complete";

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
        complete ? "text-zinc-600" : "text-amber-700"
      }`}
    >
      {!complete && <AlertTriangle className="w-3.5 h-3.5" />}
      {extracted}/{printed} questions
    </span>
  );
}

export default function AdminPapersPage() {
  const { user } = useAuth();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [courseId, setCourseId] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [examType, setExamType] = useState<ExamType>("regular");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const authedFetch = useCallback(
    async (input: string, init?: RequestInit) => {
      if (!user) throw new Error("Not signed in.");
      const token = await user.getIdToken();
      return fetch(input, {
        ...init,
        headers: { ...(init?.headers ?? {}), Authorization: `Bearer ${token}` },
      });
    },
    [user]
  );

  /** Fetches only — no state writes, so callers decide whether the result is still wanted. */
  const fetchPapers = useCallback(async (): Promise<Paper[]> => {
    const response = await authedFetch("/api/admin/papers");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Could not load papers.");
    return (data.papers ?? []) as Paper[];
  }, [authedFetch]);

  const loadPapers = useCallback(async () => {
    try {
      setPapers(await fetchPapers());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load papers.");
    } finally {
      setLoading(false);
    }
  }, [fetchPapers]);

  useEffect(() => {
    if (!user) return;

    // `cancelled` guards against the component unmounting mid-request: without
    // it, navigating away during the fetch writes state on a dead component and
    // — worse — a slow first request can land after a newer one and show stale
    // papers.
    let cancelled = false;

    (async () => {
      try {
        const papers = await fetchPapers();
        if (!cancelled) {
          setPapers(papers);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load papers.");
      } finally {
        if (!cancelled) setLoading(false);
      }

      // Courses are public to read, so this goes straight to Firestore rather
      // than through an API route.
      const snap = await getDocs(collection(db, "courses"));
      if (cancelled) return;
      const list = snap.docs.map((d) => d.data() as Course);
      list.sort((a, b) => a.semester - b.semester || a.code.localeCompare(b.code));
      setCourses(list);
      setCourseId((current) => current || list[0]?.code || "");
    })();

    return () => {
      cancelled = true;
    };
  }, [user, fetchPapers]);

  const grouped = useMemo(() => {
    const bySemester = new Map<number, Course[]>();
    for (const course of courses) {
      const list = bySemester.get(course.semester) ?? [];
      list.push(course);
      bySemester.set(course.semester, list);
    }
    return [...bySemester.entries()].sort(([a], [b]) => a - b);
  }, [courses]);

  async function handleUpload() {
    if (!courseId || files.length === 0) return;
    setUploading(true);
    setNotice(null);
    setError(null);

    try {
      const form = new FormData();
      form.set("courseId", courseId);
      form.set("year", String(year));
      form.set("examType", examType);
      // Order matters — it is the paper's reading order.
      for (const file of files) form.append("pages", file);

      const response = await authedFetch("/api/admin/papers", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Upload failed.");

      setNotice(
        data.replaced
          ? `Replaced the scans on ${data.paperId} (${data.pages} page${data.pages === 1 ? "" : "s"}). Open it to extract.`
          : `Uploaded ${data.paperId} (${data.pages} page${data.pages === 1 ? "" : "s"}). Open it to extract.`
      );
      setFiles([]);
      await loadPapers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge="ExamAI"
        title="Past papers"
        subtitle="Upload a question paper's page scans, extract its questions, review, and publish."
      />

      {error && <Alert type="error" title={error} icon={<AlertTriangle className="w-4 h-4" />} />}
      {notice && <Alert type="success" title={notice} />}

      <div className="flex rounded-lg border border-zinc-200 bg-white overflow-hidden" style={{ minHeight: 560 }}>
        <WorkspaceRail items={ADMIN_WORKSPACE_ITEMS} ariaLabel="Admin workspace tools" />

        <main className="flex-1 min-w-0 overflow-y-auto p-6 space-y-6">
      <SectionCard
        title="Upload a paper"
        description="One image per page, attached in reading order. Split PDFs into pages first."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-xs font-semibold text-zinc-700">Course</span>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            >
              {grouped.length === 0 && <option value="">No courses seeded</option>}
              {grouped.map(([semester, list]) => (
                <optgroup key={semester} label={`Semester ${semester}`}>
                  {list.map((course) => (
                    <option key={course.code} value={course.code}>
                      {course.code} — {course.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-zinc-700">Year</span>
            <input
              type="number"
              value={year}
              min={2000}
              max={2100}
              onChange={(e) => setYear(Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-zinc-700">Exam type</span>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value as ExamType)}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            >
              {EXAM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4">
          <label className="block">
            <span className="text-xs font-semibold text-zinc-700">Page scans</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              className="mt-1 block w-full text-sm text-zinc-600 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-semibold"
            />
          </label>

          {files.length > 0 && (
            <ol className="mt-3 space-y-1 text-xs text-zinc-600">
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`} className="flex items-center gap-2">
                  <span className="font-mono text-zinc-400">p{index + 1}</span>
                  <span className="truncate">{file.name}</span>
                  <span className="text-zinc-400">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <PrimaryButton
            onClick={handleUpload}
            disabled={uploading || !courseId || files.length === 0}
            icon={uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          >
            {uploading ? "Uploading…" : "Upload pages"}
          </PrimaryButton>
          <p className="text-xs text-zinc-500">
            Uploading does not spend anything. Extraction is started from the paper itself.
          </p>
        </div>
      </SectionCard>

      <SectionCard title={`Papers (${papers.length})`}>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-zinc-500 py-8 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : papers.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-6 h-6" />}
            title="No papers yet"
            description="Upload a paper's page scans above to get started."
          />
        ) : (
          <div className="divide-y divide-zinc-100">
            {papers.map((paper) => (
              <Link
                key={paper.paperId}
                href={`/admin/papers/${paper.paperId}`}
                className="flex items-center justify-between gap-4 py-3 hover:bg-zinc-50 px-2 -mx-2 rounded-md"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-900">{paper.courseId}</span>
                    <span className="text-sm text-zinc-500">
                      {paper.year} · {paper.examType}
                    </span>
                    <StatusPill status={paper.status} />
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
                    <CoverageNote paper={paper} />
                    <span>
                      {paper.imagePaths?.length ?? 0} page
                      {(paper.imagePaths?.length ?? 0) === 1 ? "" : "s"}
                    </span>
                    {paper.totalCostUsd > 0 && <span>${paper.totalCostUsd.toFixed(4)}</span>}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </SectionCard>
        </main>
      </div>
    </div>
  );
}
