"use client";

/**
 * Renders an uploaded paper the way it was printed: the centred header block,
 * the instruction lines, then each Group with its own instruction and marks
 * line, and the marks in the right margin.
 *
 * Two modes share this layout so a student sees the same paper either way:
 *   - "paper"     the question paper alone, for attempting under timed conditions
 *   - "solutions" the same paper with each answer and mark breakdown underneath
 *
 * Group headings come from the paper itself. Where a paper has none, questions
 * fall back to a single unnamed group rather than inventing "12-mark questions"
 * headings that never appeared on the original.
 */

import { ShieldQuestion } from "lucide-react";

export interface PaperMeta {
  university: string;
  programme: string;
  subjectCode: string;
  subjectName: string;
  year: string;
  fullMarks: string;
  passMarks: string;
  timeAllowed: string;
  instructions: string[];
}

export interface PaperQuestion {
  number: string;
  group?: string;
  groupInstruction?: string;
  groupMarks?: string;
  type: "mcq" | "written";
  question: string;
  marks: number | null;
  answer: string;
  explanation: string;
  rubric: string[];
  rubricBalanced?: boolean;
  confidence: "high" | "medium" | "low";
}

interface ExamPaperViewProps {
  meta?: PaperMeta;
  questions: PaperQuestion[];
  mode: "paper" | "solutions";
  fallbackTitle: string;
}

interface Group {
  name: string;
  instruction: string;
  marks: string;
  questions: PaperQuestion[];
}

/** Group by the paper's own headings, preserving the printed order. */
function buildGroups(questions: PaperQuestion[]): Group[] {
  const groups: Group[] = [];
  for (const q of questions) {
    const name = q.group?.trim() ?? "";
    const last = groups[groups.length - 1];
    if (last && last.name === name) {
      last.questions.push(q);
      continue;
    }
    groups.push({
      name,
      instruction: q.groupInstruction?.trim() ?? "",
      marks: q.groupMarks?.trim() ?? "",
      questions: [q],
    });
  }
  return groups;
}

export function ExamPaperView({ meta, questions, mode, fallbackTitle }: ExamPaperViewProps) {
  const groups = buildGroups(questions);
  const hasHeader = Boolean(meta?.university || meta?.subjectName);

  return (
    <article className="bg-white border border-zinc-300 shadow-sm print:border-0 print:shadow-none font-serif">
      <header className="px-8 sm:px-12 pt-8 pb-5 text-center space-y-1">
        {hasHeader ? (
          <>
            <h1 className="text-base font-bold tracking-[0.15em] text-zinc-900 uppercase">
              {meta!.university}
            </h1>
            {meta!.year && <p className="text-sm text-zinc-800">{meta!.year}</p>}
            {meta!.programme && <p className="text-xs text-zinc-700">{meta!.programme}</p>}

            <div className="pt-2">
              <p className="text-sm font-bold text-zinc-900">
                {meta!.subjectCode}
                {meta!.subjectCode && meta!.subjectName ? ": " : ""}
                {meta!.subjectName}
              </p>
            </div>

            <div className="flex justify-between text-xs text-zinc-800 pt-2 border-b border-zinc-900 pb-2">
              <span>{meta!.timeAllowed && `Time: ${meta!.timeAllowed}`}</span>
              <span>
                {meta!.fullMarks && `Full Marks: ${meta!.fullMarks}`}
                {meta!.passMarks && ` / Pass Marks: ${meta!.passMarks}`}
              </span>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-base font-bold tracking-[0.15em] text-zinc-900 uppercase">
              {mode === "paper" ? "Question Paper" : "Model Solution"}
            </h1>
            <p className="text-sm text-zinc-600 border-b border-zinc-900 pb-2">{fallbackTitle}</p>
          </>
        )}

        {meta?.instructions?.length ? (
          <div className="pt-3 space-y-0.5 text-left">
            {meta.instructions.map((line, i) => (
              <p key={i} className="text-[11px] italic text-zinc-600">
                {line}
              </p>
            ))}
          </div>
        ) : null}
      </header>

      <div className="px-8 sm:px-12 pb-10 space-y-7">
        {groups.map((group, gi) => (
          <section key={`${group.name}-${gi}`} className="space-y-4">
            {group.name && (
              <div className="text-center pt-2">
                <h2 className="text-sm font-bold text-zinc-900 underline underline-offset-4">
                  {group.name}
                </h2>
              </div>
            )}

            {(group.instruction || group.marks) && (
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-xs font-bold text-zinc-900">{group.instruction}</p>
                <p className="text-xs font-bold text-zinc-900 tabular-nums whitespace-nowrap">
                  {group.marks}
                </p>
              </div>
            )}

            <ol className="space-y-5">
              {group.questions.map((q) => (
                <li key={q.number} className="print:break-inside-avoid">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm text-zinc-900 leading-relaxed">
                      <span className="font-bold mr-2 tabular-nums">{q.number}.</span>
                      {q.question}
                    </p>
                    {q.marks !== null && (
                      <span className="text-xs text-zinc-700 tabular-nums whitespace-nowrap">
                        [{q.marks}]
                      </span>
                    )}
                  </div>

                  {mode === "solutions" && (
                    <div className="mt-3 ml-6 space-y-3 font-sans">
                      <p className="text-sm text-zinc-800 leading-7 whitespace-pre-wrap">
                        {q.answer}
                      </p>

                      {q.explanation && (
                        <p className="text-xs text-zinc-500 leading-relaxed italic">
                          {q.explanation}
                        </p>
                      )}

                      {q.rubric.length > 0 && (
                        <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500 mb-1">
                            How the {q.marks} marks are awarded
                          </p>
                          {q.rubricBalanced === false && (
                            <p className="text-[11px] text-amber-700 mb-1.5">
                              These criteria do not add up to {q.marks} marks — treat the split as a
                              guide, not a precise breakdown.
                            </p>
                          )}
                          <ul className="space-y-0.5">
                            {q.rubric.map((r, i) => (
                              <li key={i} className="text-[11px] text-zinc-600">
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {q.confidence === "low" && (
                        <p className="text-[11px] text-amber-700 flex items-start gap-1.5">
                          <ShieldQuestion className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          Verify this one with your teacher — the question or the answer was unclear.
                        </p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </article>
  );
}

export default ExamPaperView;
