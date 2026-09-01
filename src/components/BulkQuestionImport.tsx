"use client";

import { useMemo, useRef, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, doc, getDoc, writeBatch, serverTimestamp } from "firebase/firestore";
import { parseBulkQuestions, ParsedBlockResult } from "@/lib/bulkQuestionParser";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  ClipboardPaste,
  FileUp,
  Sparkles,
  X,
} from "lucide-react";

const PLACEHOLDER = `Q: What is the time complexity of binary search?
A) O(n)
B) O(log n)
C) O(n^2)
D) O(1)
ANSWER: B
EXPLAIN: Binary search halves the search space every iteration.
DIFFICULTY: easy
MARKS: 1

Q: Which data structure uses FIFO order?
A) Stack
B) Queue
C) Tree
D) Graph
ANSWER: B

Q: Explain the working of a He-Ne laser.
TYPE: written
MODEL_ANSWER: In a He-Ne laser, an electrical discharge excites helium atoms first; these excited helium atoms then collide with neon atoms and transfer energy to them efficiently, achieving the population inversion in neon's energy levels needed for stimulated emission. The actual laser light output comes from the neon transitions, producing coherent red light at 632.8nm.
DIFFICULTY: hard
MARKS: 4`;

interface BulkQuestionImportProps {
  examId: string;
  onImported: (count: number) => void;
}

export default function BulkQuestionImport({ examId, onImported }: BulkQuestionImportProps) {
  const [text, setText] = useState("");
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [pendingFileName, setPendingFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File | undefined) => {
    if (!file) return;
    setExtracting(true);
    setExtractError(null);
    setPendingFileName(file.name);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Please sign in again.");
      const idToken = await currentUser.getIdToken();

      const res = await fetch("/api/admin/extract-questions", {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Extraction failed.");
      }
      setText((prev) => (prev.trim() ? `${prev.trim()}\n\n${data.text}` : data.text));
    } catch (err: any) {
      setExtractError(err.message || "Couldn't read that file. Try pasting the text directly instead.");
    } finally {
      setExtracting(false);
      setPendingFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const results = useMemo<ParsedBlockResult[]>(() => {
    if (!text.trim()) return [];
    return parseBulkQuestions(text);
  }, [text]);

  const valid = results.filter((r) => r.question);
  const invalid = results.filter((r) => !r.question);

  const handleImport = async () => {
    if (valid.length === 0) return;
    setImporting(true);
    setError(null);
    try {
      const examRef = doc(db, "exams", examId);
      const examSnap = await getDoc(examRef);
      const currentTotal = examSnap.data()?.total_questions ?? 0;

      const batch = writeBatch(db);
      valid.forEach((r, idx) => {
        const q = r.question!;
        const qRef = doc(collection(db, "questions"));
        batch.set(qRef, {
          exam_id: examId,
          type: q.type,
          question_text: q.question_text,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_option: q.correct_option,
          model_answer: q.model_answer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          marks: q.marks,
          negativeMarks: q.negativeMarks,
          order_in_exam: currentTotal + idx + 1,
          created_at: serverTimestamp(),
        });
      });
      batch.update(examRef, {
        total_questions: currentTotal + valid.length,
        updated_at: serverTimestamp(),
      });

      await batch.commit();
      onImported(valid.length);
      setText("");
    } catch (err) {
      console.error(err);
      setError("Import failed. Check your connection and try again.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload a real question paper — Claude reads it and drops the
          structured text into the textarea below for review. */}
      <div className="bg-white rounded-lg border border-zinc-200 p-4 space-y-3">
        <label className="text-xs font-semibold text-zinc-600 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
          Import from a document (PDF, photo/scan, or .txt)
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={extracting}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-md bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {extracting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileUp className="w-3.5 h-3.5" />}
            {extracting ? `Reading ${pendingFileName ?? "file"}...` : "Upload question paper"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,image/jpeg,image/png,image/webp,image/gif,.txt,.md"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
          />
          <span className="text-[11px] text-zinc-400">Claude reads it and fills in the format below — you review before importing.</span>
        </div>
        {extractError && (
          <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-md text-red-700 text-[11px] font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span className="flex-1">{extractError}</span>
            <button type="button" onClick={() => setExtractError(null)} className="shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-600 flex items-center gap-1.5">
            <ClipboardPaste className="w-3.5 h-3.5 text-primary-600" />
            Or paste/edit questions directly
          </label>
          <button
            type="button"
            onClick={() => setText(PLACEHOLDER)}
            className="text-[11px] font-semibold text-primary-600 hover:underline"
          >
            Insert example format
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={14}
          className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-md focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-shadow text-xs font-mono leading-relaxed resize-y"
        />
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          One question per block, separated by a blank line. <strong className="text-zinc-600">Multiple choice:</strong> requires{" "}
          <code className="font-mono bg-zinc-100 px-1 rounded">Q:</code>,{" "}
          <code className="font-mono bg-zinc-100 px-1 rounded">A)</code>–<code className="font-mono bg-zinc-100 px-1 rounded">D)</code>,{" "}
          <code className="font-mono bg-zinc-100 px-1 rounded">ANSWER:</code>. <strong className="text-zinc-600">Written (long-answer):</strong> requires{" "}
          <code className="font-mono bg-zinc-100 px-1 rounded">Q:</code>,{" "}
          <code className="font-mono bg-zinc-100 px-1 rounded">TYPE: written</code>,{" "}
          <code className="font-mono bg-zinc-100 px-1 rounded">MODEL_ANSWER:</code> (the full expected answer — students type a real answer and Claude grades it against this). Optional either way:{" "}
          <code className="font-mono bg-zinc-100 px-1 rounded">EXPLAIN:</code>,{" "}
          <code className="font-mono bg-zinc-100 px-1 rounded">DIFFICULTY:</code>,{" "}
          <code className="font-mono bg-zinc-100 px-1 rounded">MARKS:</code>.
        </p>
      </div>

      {results.length > 0 && (
        <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-zinc-50">
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> {valid.length} ready
              </span>
              {invalid.length > 0 && (
                <span className="flex items-center gap-1.5 text-red-700">
                  <AlertCircle className="w-3.5 h-3.5" /> {invalid.length} need fixing
                </span>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100">
            {results.map((r, idx) => (
              <div key={idx} className="p-3.5">
                {r.question ? (
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-zinc-900 line-clamp-2">{r.question.question_text}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {r.question.type === "written" ? (
                          <span className="font-semibold text-violet-600">Written (AI-graded)</span>
                        ) : (
                          <>Correct: <span className="font-semibold text-emerald-600 uppercase">{r.question.correct_option}</span></>
                        )}
                        {" · "}{r.question.difficulty}{" · "}{r.question.marks} mark{r.question.marks === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded bg-red-50 text-red-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-zinc-700 line-clamp-1 font-mono">{r.raw.split("\n")[0] || "(empty block)"}</p>
                      <ul className="mt-1 space-y-0.5">
                        {r.errors.map((e, eIdx) => (
                          <li key={eIdx} className="text-[11px] text-red-600">• {e}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs font-semibold">{error}</div>
      )}

      <button
        type="button"
        onClick={handleImport}
        disabled={valid.length === 0 || importing}
        className="w-full py-3.5 bg-primary-600 text-white rounded-md font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-button"
      >
        {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
        {importing ? "Importing..." : `Import ${valid.length || ""} question${valid.length === 1 ? "" : "s"}`}
      </button>
    </div>
  );
}
