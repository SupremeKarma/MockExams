"use client";

import { FileText, Loader2, Upload, ArrowRight, Sparkles, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

interface PaperSummary {
  id: string;
  source: string;
  paper_type: string;
  questions: { number: string }[];
  low_confidence_count: number;
  grounded: boolean;
  created_at: string;
}

type PaperType = "semester" | "entrance";

export default function PapersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [papers, setPapers] = useState<PaperSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [solving, setSolving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [paperType, setPaperType] = useState<PaperType>("semester");

  const load = useCallback(async () => {
    const current = auth.currentUser;
    if (!current) return;
    try {
      const token = await current.getIdToken();
      const res = await fetch("/api/me/papers", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.ok) setPapers((await res.json()).papers ?? []);
    } catch (err) {
      console.error("Paper list failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    load();
  }, [authLoading, user, load]);

  const solve = async (file?: File) => {
    const current = auth.currentUser;
    if (!current || solving) return;
    if (!file && !text.trim()) {
      setError("Paste the paper or choose a file first.");
      return;
    }

    setSolving(true);
    setError(null);

    try {
      const token = await current.getIdToken();
      let res: Response;

      if (file) {
        const form = new FormData();
        form.append("file", file);
        form.append("paperType", paperType);
        res = await fetch("/api/me/papers", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
      } else {
        res = await fetch("/api/me/papers", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ text, paperType }),
        });
      }

      const data = await res.json();

      // Out of credits is an expected state, not a failure.
      if (res.status === 402) {
        setError(data.message ?? "You're out of credits.");
        return;
      }
      if (!res.ok) throw new Error(data.error ?? "Could not solve that paper.");

      router.push(`/papers/${data.id}`);
    } catch (err) {
      console.error("Solve failed:", err);
      setError("Could not solve that paper. Please try again.");
    } finally {
      setSolving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/40">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50/40 flex items-center justify-center px-4">
        <div className="max-w-sm text-center space-y-3">
          <h1 className="text-xl font-bold text-zinc-900">Sign in to solve a paper</h1>
          <p className="text-sm text-zinc-500">
            Upload your college&apos;s past paper and get a full model solution.
          </p>
          <Link
            href="/login"
            className="inline-block px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm"
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/40 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200 text-primary-600 flex items-center justify-center mx-auto">
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Solve a past paper</h1>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Upload your college&apos;s question paper — a PDF, a photo of the printed sheet, or
            pasted text — and get a full model solution with the marks broken down.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-zinc-200 space-y-4">
          <div className="flex gap-1.5">
            {(
              [
                { id: "semester", label: "Semester paper", hint: "All written answers" },
                { id: "entrance", label: "Entrance paper", hint: "Multiple choice" },
              ] as const
            ).map(({ id, label, hint }) => (
              <button
                key={id}
                onClick={() => setPaperType(id)}
                aria-pressed={paperType === id}
                className={`flex-1 px-3 py-2.5 rounded-md border text-left transition-colors ${
                  paperType === id
                    ? "bg-primary-50 border-primary-300"
                    : "bg-white border-zinc-200 hover:border-primary-300"
                }`}
              >
                <div className="text-xs font-bold text-zinc-900">{label}</div>
                <div className="text-[11px] text-zinc-500">{hint}</div>
              </button>
            ))}
          </div>

          <textarea
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the question paper here — including the marks beside each question, so the solution can break them down."
            className="w-full rounded-md border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-600/10 resize-y"
          />

          {error && (
            <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => solve()}
              disabled={solving}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm disabled:opacity-50"
            >
              {solving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {solving ? "Solving — this takes a moment…" : "Solve this paper"}
            </button>

            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.txt,.md,image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) solve(file);
                e.target.value = "";
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={solving}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md border border-zinc-200 bg-white text-zinc-700 font-semibold text-sm hover:border-primary-300 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" /> Upload PDF or photo
            </button>
          </div>
        </div>

        {papers.length > 0 && (
          <section className="space-y-2.5">
            <h2 className="text-sm font-bold text-zinc-900">Your solved papers</h2>
            {papers.map((p) => (
              <Link
                key={p.id}
                href={`/papers/${p.id}`}
                className="block p-4 rounded-lg bg-white border border-zinc-200 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 truncate">{p.source}</p>
                    <p className="text-xs text-zinc-500">
                      {p.questions?.length ?? 0} questions · {p.paper_type}
                      {p.low_confidence_count > 0 && ` · ${p.low_confidence_count} to verify`}
                      {!p.grounded && " · unverified"}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 flex-shrink-0" />
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
