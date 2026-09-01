"use client";

import { Edit, Trash2, BookOpen } from "lucide-react";
import Link from "next/link";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-emerald-700 bg-emerald-50",
  medium: "text-amber-700 bg-amber-50",
  hard: "text-red-700 bg-red-50",
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
      <div className="bg-white p-12 rounded-lg border border-zinc-200 text-center text-zinc-500">
        <BookOpen className="w-10 h-10 mx-auto mb-3 text-zinc-300" />
        <p className="font-semibold text-sm text-zinc-900">No questions yet.</p>
        <p className="text-xs mt-1">Add questions manually to build your exam.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-zinc-200 shadow-xs overflow-x-auto">
      <table className="w-full text-left min-w-[560px]">
        <thead className="bg-zinc-50 text-zinc-500 text-[10px] uppercase tracking-wider border-b border-zinc-200">
          <tr>
            <th className="p-4 w-12">#</th>
            <th className="p-4">Question</th>
            <th className="p-4 w-28">Difficulty</th>
            <th className="p-4 w-24">Correct</th>
            <th className="p-4 w-28 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {questions.map((q, idx) => (
            <tr key={q.id} className="hover:bg-zinc-50 transition-colors">
              <td className="p-4 text-zinc-400 font-semibold text-sm">{idx + 1}</td>
              <td className="p-4 max-w-xs">
                <p className="font-medium text-sm text-zinc-900 truncate">{q.question_text}</p>
              </td>
              <td className="p-4">
                <span className={`text-[11px] font-semibold px-2 py-1 rounded-md capitalize ${DIFFICULTY_COLORS[q.difficulty ?? ""] ?? "text-zinc-500 bg-zinc-100"}`}>
                  {q.difficulty ?? "—"}
                </span>
              </td>
              <td className="p-4">
                <span className="text-[11px] font-semibold uppercase px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md">
                  {q.correct_option}
                </span>
              </td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-3 text-zinc-400">
                  <Link
                    href={`${basePath}/${examId}/questions/${q.id}/edit`}
                    className="hover:text-primary-600 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => onDelete(q.id)}
                    className="hover:text-red-600 transition-colors"
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
