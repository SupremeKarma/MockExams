"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, ClipboardList, Loader2, Shuffle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Alert, PageHeader, PrimaryButton } from "@/components/UIComponents";
import { WorkspaceRail } from "@/components/admin/WorkspaceRail";
import type { Course } from "@/lib/examai/types";

interface AssembledQuestion {
  qId: string;
  paperId: string;
  year: number;
  examType: string;
  number: string;
  marks: number;
  textExact: string | null;
  type: string;
}

interface AssembleResult {
  courseId: string;
  requested: { targetMarks: number; targetQuestions: number };
  candidatePoolSize: number;
  papersUsed: number;
  questions: AssembledQuestion[];
  totalMarks: number;
}

/**
 * Assembles a mock exam from real, already-published, reviewer-approved
 * questions — not AI-generated. There is nowhere here to save or reshuffle
 * per admin: the tool has no per-user state, so it looks and behaves
 * identically for whoever opens it. See src/app/api/admin/mock-exams/route.ts.
 */
export default function MockExamsWorkspace() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState("");
  const [targetMarks, setTargetMarks] = useState(60);
  const [targetQuestions, setTargetQuestions] = useState(8);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [assembling, setAssembling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AssembleResult | null>(null);

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, "courses"));
      const list = snap.docs.map((d) => d.data() as Course);
      list.sort((a, b) => a.semester - b.semester || a.code.localeCompare(b.code));
      setCourses(list);
      setCourseId((current) => current || list[0]?.code || "");
      setLoadingCourses(false);
    })();
  }, []);

  const assemble = useCallback(async () => {
    if (!user || !courseId) return;
    setAssembling(true);
    setError(null);
    setResult(null);

    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/admin/mock-exams", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId, targetMarks, targetQuestions }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not assemble a mock exam.");
      setResult(data as AssembleResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not assemble a mock exam.");
    } finally {
      setAssembling(false);
    }
  }, [user, courseId, targetMarks, targetQuestions]);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="ExamAI"
        title="Mock exams"
        subtitle="Assemble a mock paper by sampling real, published questions from a course's past papers — no AI, no invented questions."
      />

      {error && <Alert type="error" title={error} icon={<AlertTriangle className="w-4 h-4" />} />}

      <div className="flex rounded-lg border border-zinc-200 bg-white overflow-hidden" style={{ minHeight: 560 }}>
        <WorkspaceRail />

        <main className="flex-1 min-w-0 overflow-y-auto p-6">
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            <label className="block">
              <span className="text-xs font-semibold text-zinc-700"># marks</span>
              <input
                type="number"
                min={1}
                max={500}
                value={targetMarks}
                onChange={(e) => setTargetMarks(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-zinc-700"># questions</span>
              <input
                type="number"
                min={1}
                max={100}
                value={targetQuestions}
                onChange={(e) => setTargetQuestions(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-zinc-700">Course</span>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                disabled={loadingCourses}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              >
                {courses.length === 0 && <option value="">No courses seeded</option>}
                {courses.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <PrimaryButton
            onClick={assemble}
            disabled={assembling || !courseId}
            icon={assembling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shuffle className="w-4 h-4" />}
          >
            {assembling ? "Assembling…" : "Assemble mock exam"}
          </PrimaryButton>

          {result && (
            <div className="mt-6 space-y-3">
              {result.questions.length === 0 ? (
                <div className="p-8 text-center text-sm text-zinc-500 border border-dashed border-zinc-300 rounded-lg">
                  No published, marked questions found for {result.courseId}. A paper needs to reach{" "}
                  <code className="bg-zinc-100 px-1 py-0.5 rounded text-xs">published</code> status before
                  it can feed a mock exam.
                </div>
              ) : (
                result.questions.map((q, i) => (
                  <div key={`${q.paperId}/${q.qId}`} className="rounded-lg border border-zinc-200 p-4">
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                      <span>
                        Q{i + 1} · from {q.paperId} · {q.year} {q.examType}
                      </span>
                      <span className="font-semibold text-zinc-600">{q.marks} marks</span>
                    </div>
                    <p className="text-sm text-zinc-900">
                      {q.textExact ?? <span className="text-zinc-400 italic">Text unreadable in the scan.</span>}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </main>

        <aside className="w-80 shrink-0 border-l border-zinc-200 p-5">
          <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2 mb-4">
            <ClipboardList className="w-4 h-4 text-zinc-400" /> Assembly summary
          </h2>

          {!result ? (
            <p className="text-xs text-zinc-400">
              Set the targets and assemble — this panel fills in with what was actually used once it runs.
            </p>
          ) : (
            <dl className="space-y-3 text-sm">
              <Row label="Course" value={result.courseId} />
              <Row label="Published papers drawn from" value={result.papersUsed} />
              <Row label="Candidate questions available" value={result.candidatePoolSize} />
              <Row
                label="Questions picked"
                value={`${result.questions.length} of ${result.requested.targetQuestions} requested`}
              />
              <Row
                label="Marks"
                value={`${result.totalMarks} of ${result.requested.targetMarks} requested`}
              />
              {result.totalMarks < result.requested.targetMarks && result.questions.length > 0 && (
                <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-2">
                  Short of the target — the published question pool for this course does not have enough
                  marked questions to fill it exactly.
                </p>
              )}
            </dl>
          )}
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-[11px] text-zinc-400 uppercase tracking-wide">{label}</dt>
      <dd className="text-zinc-900 font-medium">{value}</dd>
    </div>
  );
}
