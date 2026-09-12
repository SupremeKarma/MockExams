"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Alert, PageHeader, PrimaryButton, SecondaryButton } from "@/components/UIComponents";
import { WorkspaceRail } from "@/components/admin/WorkspaceRail";
import { deriveUnitId } from "@/lib/examai/syllabus-units";
import type { Course, Curriculum } from "@/lib/examai/types";

const CURRICULA: { value: Curriculum; label: string }[] = [
  { value: "new_course", label: "New course" },
  { value: "old_course", label: "Old course (backlog)" },
];

interface UnitRow {
  title: string;
}

interface FormState {
  code: string;
  name: string;
  semester: number;
  programId: string;
  credits: number;
  curriculum: Curriculum;
  units: UnitRow[];
}

function blankForm(): FormState {
  return {
    code: "",
    name: "",
    semester: 1,
    programId: "BIT",
    credits: 3,
    curriculum: "new_course",
    units: [],
  };
}

function toForm(course: Course): FormState {
  return {
    code: course.code,
    name: course.name,
    semester: course.semester,
    programId: course.programId,
    credits: course.credits,
    curriculum: course.curriculum,
    units: course.syllabusUnits.map((u) => ({ title: u.title })),
  };
}

export default function CoursesWorkspace() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [selected, setSelected] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(blankForm());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const loadCourses = useCallback(async () => {
    try {
      const response = await authedFetch("/api/admin/courses");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not load courses.");
      setCourses((data.courses ?? []) as Course[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load courses.");
    } finally {
      setLoading(false);
    }
  }, [authedFetch]);

  useEffect(() => {
    if (!user) return;
    loadCourses();
  }, [user, loadCourses]);

  const grouped = useMemo(() => {
    const bySemester = new Map<number, Course[]>();
    for (const course of courses) {
      const list = bySemester.get(course.semester) ?? [];
      list.push(course);
      bySemester.set(course.semester, list);
    }
    return [...bySemester.entries()].sort(([a], [b]) => a - b);
  }, [courses]);

  function selectNew() {
    setSelected("new");
    setForm(blankForm());
    setNotice(null);
    setError(null);
  }

  function selectCourse(course: Course) {
    setSelected(course.code);
    setForm(toForm(course));
    setNotice(null);
    setError(null);
  }

  function closePanel() {
    setSelected(null);
  }

  function updateUnit(index: number, title: string) {
    setForm((f) => ({
      ...f,
      units: f.units.map((u, i) => (i === index ? { title } : u)),
    }));
  }

  function addUnit() {
    setForm((f) => ({ ...f, units: [...f.units, { title: "" }] }));
  }

  function removeUnit(index: number) {
    setForm((f) => ({ ...f, units: f.units.filter((_, i) => i !== index) }));
  }

  function moveUnit(index: number, direction: -1 | 1) {
    setForm((f) => {
      const target = index + direction;
      if (target < 0 || target >= f.units.length) return f;
      const units = [...f.units];
      [units[index], units[target]] = [units[target], units[index]];
      return { ...f, units };
    });
  }

  async function save() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      const isNew = selected === "new";
      const response = await authedFetch(
        isNew ? "/api/admin/courses" : `/api/admin/courses/${form.code}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: form.code,
            name: form.name,
            semester: form.semester,
            programId: form.programId,
            credits: form.credits,
            curriculum: form.curriculum,
            syllabusUnits: form.units,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed.");

      setNotice(isNew ? `Created ${data.course.code}.` : `Saved ${data.course.code}.`);
      setSelected(data.course.code);
      setForm(toForm(data.course));
      await loadCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!selected || selected === "new") return;
    if (!confirm(`Delete ${selected}? This does not remove papers already filed under it.`)) return;

    setDeleting(true);
    setError(null);
    try {
      const response = await authedFetch(`/api/admin/courses/${selected}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Delete failed.");
      setSelected(null);
      await loadCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge="ExamAI"
        title="Courses"
        subtitle="The syllabus vocabulary papers are filed under and questions are tagged against."
        actions={
          <PrimaryButton onClick={selectNew} icon={<Plus className="w-4 h-4" />}>
            New course
          </PrimaryButton>
        }
      />

      {error && <Alert type="error" title={error} icon={<AlertTriangle className="w-4 h-4" />} />}
      {notice && <Alert type="success" title={notice} />}

      <div className="flex rounded-lg border border-zinc-200 bg-white overflow-hidden" style={{ minHeight: 560 }}>
        <WorkspaceRail />

        <main className="flex-1 min-w-0 overflow-y-auto">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-zinc-500 py-16 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading…
            </div>
          ) : courses.length === 0 ? (
            <div className="p-10 text-center text-sm text-zinc-500">
              No courses yet. Seed from the syllabus with{" "}
              <code className="bg-zinc-100 px-1 py-0.5 rounded text-xs">npm run seed-examai</code>, or add
              one here.
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {grouped.map(([semester, list]) => (
                <div key={semester} className="p-4">
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                    Semester {semester}
                  </h3>
                  <div className="space-y-1">
                    {list.map((course) => (
                      <button
                        key={course.code}
                        type="button"
                        onClick={() => selectCourse(course)}
                        className={`w-full text-left px-3 py-2.5 rounded-md flex items-center justify-between gap-3 transition-colors ${
                          selected === course.code
                            ? "bg-primary-50 border border-primary-200"
                            : "border border-transparent hover:bg-zinc-50"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-zinc-900">{course.code}</span>
                            <span className="text-sm text-zinc-500 truncate">{course.name}</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {course.syllabusUnits.length} unit{course.syllabusUnits.length === 1 ? "" : "s"} ·{" "}
                            {course.credits} credits · {course.curriculum === "old_course" ? "old course" : "new course"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {selected && (
          <aside className="w-96 shrink-0 border-l border-zinc-200 p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-zinc-900">
                {selected === "new" ? "New course" : form.code}
              </h2>
              <button
                type="button"
                onClick={closePanel}
                className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-xs font-semibold text-zinc-700">Course code</span>
                <input
                  value={form.code}
                  disabled={selected !== "new"}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="BIT253CO"
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm disabled:bg-zinc-50 disabled:text-zinc-500"
                />
                {selected !== "new" && (
                  <span className="text-[11px] text-zinc-400 mt-1 block">
                    Fixed once created — papers are filed against it.
                  </span>
                )}
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-zinc-700">Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Operating System"
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-semibold text-zinc-700">Semester</span>
                  <select
                    value={form.semester}
                    onChange={(e) => setForm((f) => ({ ...f, semester: Number(e.target.value) }))}
                    className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  >
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-zinc-700">Credits</span>
                  <input
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={form.credits}
                    onChange={(e) => setForm((f) => ({ ...f, credits: Number(e.target.value) }))}
                    className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-semibold text-zinc-700">Curriculum</span>
                <select
                  value={form.curriculum}
                  onChange={(e) => setForm((f) => ({ ...f, curriculum: e.target.value as Curriculum }))}
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                >
                  {CURRICULA.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-zinc-700">Program</span>
                <input
                  value={form.programId}
                  onChange={(e) => setForm((f) => ({ ...f, programId: e.target.value.toUpperCase() }))}
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
              </label>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-700">Syllabus units</span>
                  <button
                    type="button"
                    onClick={addUnit}
                    className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add unit
                  </button>
                </div>

                {form.units.length === 0 ? (
                  <p className="text-xs text-zinc-400">
                    No units yet — a course with none is valid (a project/practical paper), but nothing
                    extracted from it can be tagged to a specific unit.
                  </p>
                ) : (
                  <ol className="space-y-1.5">
                    {form.units.map((unit, index) => (
                      <li key={index} className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-zinc-400 w-16 shrink-0">
                          {form.code ? deriveUnitId(form.code, index) : `U${String(index + 1).padStart(2, "0")}`}
                        </span>
                        <input
                          value={unit.title}
                          onChange={(e) => updateUnit(index, e.target.value)}
                          placeholder="Unit title"
                          className="flex-1 min-w-0 rounded-md border border-zinc-300 px-2.5 py-1.5 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => moveUnit(index, -1)}
                          disabled={index === 0}
                          className="p-1 rounded text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
                          aria-label="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveUnit(index, 1)}
                          disabled={index === form.units.length - 1}
                          className="p-1 rounded text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
                          aria-label="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeUnit(index)}
                          className="p-1 rounded text-red-400 hover:text-red-600"
                          aria-label="Remove unit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ol>
                )}
                {selected !== "new" && form.units.length > 0 && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-2 mt-2">
                    Reordering or removing a unit renumbers every unit after it — any already-extracted
                    question tagged to one of those units stops resolving to it.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <PrimaryButton
                  onClick={save}
                  disabled={saving || !form.code || !form.name}
                  icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                >
                  {saving ? "Saving…" : "Save"}
                </PrimaryButton>
                {selected !== "new" && (
                  <SecondaryButton
                    onClick={remove}
                    icon={deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  >
                    Delete
                  </SecondaryButton>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
