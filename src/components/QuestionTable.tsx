"use client";

import { Edit, Trash2, Brain } from "lucide-react";
import Link from "next/link";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-emerald-400 bg-emerald-400/10",
  medium: "text-amber-400 bg-amber-400/10",
  hard: "text-rose-400 bg-rose-400/10",
};

interface Question {
  id: string;
  question_text: string;
  correct_option: string;
  difficulty?: string;
}

interface QuestionTableProps {
  questions: Question[];
  examId: string;
  basePath: string; // e.g. "/admin/exams" or "/examiner/exams"
  onDelete: (qId: string) => void;
}

export default function QuestionTable({ questions, examId, basePath, onDelete }: QuestionTableProps) {
  if (questions.length === 0) {
    return (
      <div className="glass-card p-16 rounded-3xl border border-white/10 text-center text-slate-500">
        <Brain className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="font-medium">No questions yet.</p>
        <p className="text-sm mt-1">Add questions manually or generate them with AI.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest">
          <tr>
            <th className="p-5 w-12">#</th>
            <th className="p-5">Question</th>
            <th className="p-5 w-28">Difficulty</th>
            <th className="p-5 w-24">Correct</th>
            <th className="p-5 w-28 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {questions.map((q, idx) => (
            <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="p-5 text-slate-500 font-bold">{idx + 1}</td>
              <td className="p-5 max-w-xs">
                <p className="font-medium truncate">{q.question_text}</p>
              </td>
              <td className="p-5">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg capitalize ${DIFFICULTY_COLORS[q.difficulty ?? ""] ?? "text-slate-400 bg-white/5"}`}>
                  {q.difficulty ?? "—"}
                </span>
              </td>
              <td className="p-5">
                <span className="text-xs font-black uppercase px-3 py-1 bg-emerald-400/10 text-emerald-400 rounded-lg">
                  {q.correct_option}
                </span>
              </td>
              <td className="p-5 text-right">
                <div className="flex items-center justify-end gap-3 text-slate-400">
                  <Link
                    href={`${basePath}/${examId}/questions/${q.id}/edit`}
                    className="hover:text-white transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => onDelete(q.id)}
                    className="hover:text-rose-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
