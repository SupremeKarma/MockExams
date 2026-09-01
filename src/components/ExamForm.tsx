"use client";

import { Loader2, CheckCircle } from "lucide-react";

export interface ExamFormData {
  title: string;
  category: string;
  duration_minutes: number;
  passing_score: number;
  negativeMarkingEnabled: boolean;
  defaultMarksPerQuestion: number;
  defaultNegativeMarks: number;
  is_published: boolean;
  visibility: "public" | "org" | "private";
}

interface ExamFormProps {
  data: ExamFormData;
  onChange: (data: ExamFormData) => void;
  onSubmit: () => void;
  saving: boolean;
  submitLabel?: string;
  showVisibility?: boolean;
}

const CATEGORIES = ["Science", "Mathematics", "Engineering", "Medical", "Arts", "Competitive"];

export default function ExamForm({
  data,
  onChange,
  onSubmit,
  saving,
  submitLabel = "Save Changes",
  showVisibility = false,
}: ExamFormProps) {
  const set = (key: keyof ExamFormData, value: any) => onChange({ ...data, [key]: value });
  const inputClass = "w-full p-3 bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-shadow text-sm text-zinc-900";

  return (
    <div className="space-y-5">
      <div className="md:col-span-2 space-y-1.5">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Exam title</label>
        <input
          type="text"
          value={data.title}
          onChange={e => set("title", e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Category</label>
          <select
            value={data.category}
            onChange={e => set("category", e.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Duration (minutes)</label>
          <input
            type="number" min="5"
            value={data.duration_minutes}
            onChange={e => set("duration_minutes", parseInt(e.target.value))}
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Passing score (%)</label>
          <input
            type="number" min="0" max="100"
            value={data.passing_score}
            onChange={e => set("passing_score", parseInt(e.target.value))}
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Marks per question</label>
          <input
            type="number" min="0.5" step="0.5"
            value={data.defaultMarksPerQuestion}
            onChange={e => set("defaultMarksPerQuestion", parseFloat(e.target.value))}
            className={inputClass}
          />
        </div>

        {showVisibility && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Visibility</label>
            <select
              value={data.visibility}
              onChange={e => set("visibility", e.target.value)}
              className={inputClass}
            >
              <option value="public">Public — anyone can see it</option>
              <option value="org">Organization — org members only</option>
              <option value="private">Private — only you</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-4 pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <div
              onClick={() => set("negativeMarkingEnabled", !data.negativeMarkingEnabled)}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${data.negativeMarkingEnabled ? "bg-primary-600" : "bg-zinc-200"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${data.negativeMarkingEnabled ? "translate-x-4" : ""}`} />
            </div>
            <span className="text-xs font-semibold text-zinc-600">Negative marking</span>
          </label>
          {data.negativeMarkingEnabled && (
            <input
              type="number" min="0" step="0.25"
              value={data.defaultNegativeMarks}
              onChange={e => set("defaultNegativeMarks", parseFloat(e.target.value))}
              className="w-20 p-1.5 bg-white border border-zinc-200 rounded-md text-xs outline-none focus:border-primary-500"
              title="Marks deducted per wrong answer"
            />
          )}
        </div>

        <div className="flex items-center gap-4 pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <div
              onClick={() => set("is_published", !data.is_published)}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${data.is_published ? "bg-emerald-600" : "bg-zinc-200"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${data.is_published ? "translate-x-4" : ""}`} />
            </div>
            <span className="text-xs font-semibold text-zinc-600">
              {data.is_published ? "Published" : "Draft"}
            </span>
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-md font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50 shadow-button"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
        {submitLabel}
      </button>
    </div>
  );
}
