"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileEdit,
  FileText,
  Loader2,
  Plus,
  Save,
  Send,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Alert, PageHeader, PrimaryButton, SecondaryButton } from "@/components/UIComponents";
import { WorkspaceRail } from "@/components/workspace/WorkspaceRail";
import { ADMIN_WORKSPACE_ITEMS } from "@/components/workspace/rail-items";
import type { Course } from "@/lib/examai/types";
import type { ValidationIssue, TocEntry, DocumentType } from "@examai/content";

interface NoteRow {
  uuid: string;
  short_id: string;
  type: string;
  title: string;
  path: string;
  code: string | null;
  node_title: string;
  version: number | null;
  status: string | null;
  trust_level: string | null;
}

interface SpineNode {
  path: string;
  code: string | null;
  title: string;
  kind: "unit" | "topic";
}

interface PreviewResult {
  valid: boolean;
  title: string;
  issues: ValidationIssue[];
  sectionCount: number;
  toc: TocEntry[];
  html: string;
}

const DOCUMENT_TYPES: DocumentType[] = ["topic_note", "guide", "paper_solution", "cheat_sheet"];

function template(course: string, node: SpineNode, type: DocumentType): string {
  const id = `${course.toLowerCase()}-${node.path.split(".").slice(-2).join("-")}`;
  return `---
id: ${id}
type: ${type}
course: ${course.toUpperCase()}
syllabus_path: ${node.path}
syllabus_code: "${node.code ?? ""}"
trust: ai_draft
---

# ${node.title}

:::idea
Plain-words idea goes here.
:::

## Section heading

Body text.
`;
}

export default function NotesWorkspace() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [shortId, setShortId] = useState<string | null>(null);
  const [source, setSource] = useState("");
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState("");
  const [newNodePath, setNewNodePath] = useState("");
  const [newType, setNewType] = useState<DocumentType>("topic_note");
  const [spineNodes, setSpineNodes] = useState<SpineNode[]>([]);
  const [loadingNodes, setLoadingNodes] = useState(false);

  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const loadNotes = useCallback(async () => {
    try {
      const response = await authedFetch("/api/admin/notes");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not load notes.");
      setNotes((data.notes ?? []) as NoteRow[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load notes.");
    } finally {
      setLoadingNotes(false);
    }
  }, [authedFetch]);

  useEffect(() => {
    if (!user) return;
    loadNotes();

    (async () => {
      const snap = await getDocs(collection(db, "courses"));
      const list = snap.docs.map((d) => d.data() as Course);
      list.sort((a, b) => a.semester - b.semester || a.code.localeCompare(b.code));
      setCourses(list);
      setNewCourse((c) => c || list[0]?.code || "");
    })();
  }, [user, loadNotes]);

  useEffect(() => {
    if (!newCourse || !user) {
      setSpineNodes([]);
      return;
    }
    setLoadingNodes(true);
    authedFetch(`/api/admin/notes/nodes?course=${encodeURIComponent(newCourse)}`)
      .then((r) => r.json())
      .then((data) => {
        setSpineNodes((data.nodes ?? []) as SpineNode[]);
        setNewNodePath((data.nodes?.[0]?.path as string | undefined) ?? "");
      })
      .finally(() => setLoadingNodes(false));
  }, [newCourse, user, authedFetch]);

  const runPreview = useCallback(
    async (text: string) => {
      setChecking(true);
      try {
        const response = await authedFetch("/api/admin/notes/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source: text }),
        });
        const data = await response.json();
        if (response.ok) setPreview(data as PreviewResult);
      } finally {
        setChecking(false);
      }
    },
    [authedFetch]
  );

  function onSourceChange(text: string) {
    setSource(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runPreview(text), 700);
  }

  function startNew() {
    const node = spineNodes.find((n) => n.path === newNodePath);
    if (!node) return;
    setShortId(null);
    setEditing(true);
    setTab("edit");
    setPreview(null);
    setNotice(null);
    const text = template(newCourse, node, newType);
    setSource(text);
    runPreview(text);
  }

  async function openNote(note: NoteRow) {
    setEditing(true);
    setTab("edit");
    setPreview(null);
    setError(null);
    setNotice(null);
    setShortId(note.short_id);
    try {
      const response = await authedFetch(`/api/admin/notes/${note.short_id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not load this note.");
      setSource(data.source as string);
      runPreview(data.source as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load this note.");
    }
  }

  async function save(publish: boolean) {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const response = await authedFetch("/api/admin/notes/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, publish }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed.");

      setShortId(data.shortId);
      setNotice(publish ? `Published — v${data.version}, /${data.shortId}` : `Saved as draft — v${data.version}`);
      await loadNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  const errorCount = preview?.issues.filter((i) => i.severity === "error").length ?? 0;
  const warningCount = preview?.issues.filter((i) => i.severity === "warning").length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        badge="ExamAI"
        title="Notes"
        subtitle="Author and publish topic notes — the same parser and publish pipeline as scripts/publish-notes.mjs, no filesystem involved."
        actions={
          !editing ? (
            <PrimaryButton onClick={() => setEditing(true)} icon={<Plus className="w-4 h-4" />}>
              New note
            </PrimaryButton>
          ) : (
            <SecondaryButton onClick={() => setEditing(false)}>Back to list</SecondaryButton>
          )
        }
      />

      {error && <Alert type="error" title={error} icon={<AlertTriangle className="w-4 h-4" />} />}
      {notice && <Alert type="success" title={notice} />}

      <div className="flex rounded-lg border border-zinc-200 bg-white overflow-hidden" style={{ minHeight: 600 }}>
        <WorkspaceRail items={ADMIN_WORKSPACE_ITEMS} ariaLabel="Admin workspace tools" />

        {!editing ? (
          <main className="flex-1 min-w-0 overflow-y-auto">
            {loadingNotes ? (
              <div className="flex items-center gap-2 text-sm text-zinc-500 py-16 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : notes.length === 0 ? (
              <div className="p-10 text-center text-sm text-zinc-500">
                No notes published yet. Click "New note" to write one, or run{" "}
                <code className="bg-zinc-100 px-1 py-0.5 rounded text-xs">node scripts/publish-notes.mjs</code>{" "}
                against <code className="bg-zinc-100 px-1 py-0.5 rounded text-xs">content/notes/</code>.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {notes.map((note) => (
                  <button
                    key={note.uuid}
                    type="button"
                    onClick={() => openNote(note)}
                    className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-zinc-50"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="font-semibold text-sm text-zinc-900 truncate">{note.title}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {note.code ?? note.path} · {note.node_title} · v{note.version ?? 0}
                      </p>
                    </div>
                    <StatusPill status={note.status} />
                  </button>
                ))}
              </div>
            )}
          </main>
        ) : (
          <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
            {!shortId && !source && (
              <div className="p-6 border-b border-zinc-100 grid gap-4 sm:grid-cols-4">
                <label className="block">
                  <span className="text-xs font-semibold text-zinc-700">Course</span>
                  <select
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  >
                    {courses.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold text-zinc-700">Unit / topic</span>
                  <select
                    value={newNodePath}
                    disabled={loadingNodes || spineNodes.length === 0}
                    onChange={(e) => setNewNodePath(e.target.value)}
                    className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  >
                    {spineNodes.length === 0 && (
                      <option value="">{loadingNodes ? "Loading…" : "No spine nodes for this course"}</option>
                    )}
                    {spineNodes.map((n) => (
                      <option key={n.path} value={n.path}>
                        {n.kind === "unit" ? "Unit " : ""}
                        {n.code ?? n.path} — {n.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-zinc-700">Type</span>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as DocumentType)}
                    className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  >
                    {DOCUMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="sm:col-span-4">
                  <PrimaryButton onClick={startNew} disabled={!newNodePath}>
                    Start writing
                  </PrimaryButton>
                </div>
              </div>
            )}

            {(shortId || source) && (
              <>
                <div className="flex items-center gap-1 border-b border-zinc-100 px-4 pt-2">
                  <TabButton active={tab === "edit"} onClick={() => setTab("edit")} icon={<FileEdit className="w-3.5 h-3.5" />}>
                    Edit
                  </TabButton>
                  <TabButton active={tab === "preview"} onClick={() => setTab("preview")} icon={<Eye className="w-3.5 h-3.5" />}>
                    Preview
                  </TabButton>
                </div>

                {tab === "edit" ? (
                  <textarea
                    value={source}
                    onChange={(e) => onSourceChange(e.target.value)}
                    spellCheck={false}
                    className="flex-1 min-h-0 w-full p-4 font-mono text-xs leading-relaxed resize-none outline-none"
                  />
                ) : (
                  <div className="flex-1 min-h-0 overflow-y-auto p-6">
                    {preview?.html ? (
                      <div
                        className="prose prose-sm max-w-none"
                        // The same renderDocument() output the Reader shows — this
                        // is deliberately unstyled by the Reader's design system
                        // (that CSS is scoped to /learn), so it previews structure
                        // and content, not final typography.
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{ __html: preview.html }}
                      />
                    ) : (
                      <p className="text-sm text-zinc-400">Fix validation errors to see a preview.</p>
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        )}

        {editing && (shortId || source) && (
          <aside className="w-80 shrink-0 border-l border-zinc-200 p-5 overflow-y-auto">
            <h2 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              {checking ? (
                <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
              ) : preview?.valid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
              {checking ? "Checking…" : preview?.valid ? "Valid" : "Needs fixes"}
            </h2>

            {preview && (
              <div className="space-y-3 text-sm mb-5">
                <Row label="Title" value={preview.title || "—"} />
                <Row label="Sections" value={String(preview.sectionCount)} />
                {(errorCount > 0 || warningCount > 0) && (
                  <Row
                    label="Issues"
                    value={`${errorCount} error${errorCount === 1 ? "" : "s"}, ${warningCount} warning${warningCount === 1 ? "" : "s"}`}
                  />
                )}
              </div>
            )}

            {preview && preview.issues.length > 0 && (
              <ul className="space-y-1.5 mb-5">
                {preview.issues.map((issue, i) => (
                  <li
                    key={i}
                    className={`text-xs px-2.5 py-1.5 rounded-md border ${
                      issue.severity === "error"
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-amber-50 border-amber-200 text-amber-700"
                    }`}
                  >
                    {issue.line ? `Line ${issue.line}: ` : ""}
                    {issue.message}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-col gap-2">
              <PrimaryButton
                onClick={() => save(true)}
                disabled={saving || !preview?.valid}
                icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              >
                Publish
              </PrimaryButton>
              <SecondaryButton
                onClick={() => save(false)}
                icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              >
                Save as draft
              </SecondaryButton>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] text-zinc-400 uppercase tracking-wide">{label}</dt>
      <dd className="text-zinc-900 font-medium">{value}</dd>
    </div>
  );
}

function StatusPill({ status }: { status: string | null }) {
  const config: Record<string, string> = {
    published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    draft: "bg-zinc-100 text-zinc-700 border-zinc-200",
    archived: "bg-zinc-50 text-zinc-400 border-zinc-200",
    in_review: "bg-amber-50 text-amber-700 border-amber-200",
  };
  const label = status ?? "none";
  return (
    <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold ${config[label] ?? config.draft}`}>
      {label}
    </span>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 -mb-px ${
        active ? "border-primary-600 text-primary-600" : "border-transparent text-zinc-500 hover:text-zinc-800"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
