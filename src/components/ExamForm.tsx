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

  return (
    <div className="space-y-6">
      <div className="md:col-span-2 space-y-2">
        <label className="text-sm font-medium text-slate-400">Exam Title</label>
        <input
          type="text"
          value={data.title}
          onChange={e => set("title", e.target.value)}
          className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Category</label>
          <select
            value={data.category}
            onChange={e => set("category", e.target.value)}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Duration (minutes)</label>
          <input
            type="number" min="5"
            value={data.duration_minutes}
            onChange={e => set("duration_minutes", parseInt(e.target.value))}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Passing Score (%)</label>
          <input
            type="number" min="0" max="100"
            value={data.passing_score}
            onChange={e => set("passing_score", parseInt(e.target.value))}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Marks Per Question</label>
          <input
            type="number" min="0.5" step="0.5"
            value={data.defaultMarksPerQuestion}
            onChange={e => set("defaultMarksPerQuestion", parseFloat(e.target.value))}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all"
          />
        </div>

        {showVisibility && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Visibility</label>
            <select
              value={data.visibility}
              onChange={e => set("visibility", e.target.value)}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all"
            >
              <option value="public">Public — anyone can see it</option>
              <option value="org">Organization — org members only</option>
              <option value="private">Private — only you</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => set("negativeMarkingEnabled", !data.negativeMarkingEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${data.negativeMarkingEnabled ? "bg-primary" : "bg-white/10"}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${data.negativeMarkingEnabled ? "translate-x-6" : ""}`} />
            </div>
            <span className="text-sm font-medium text-slate-300">Negative Marking</span>
          </label>
          {data.negativeMarkingEnabled && (
            <input
              type="number" min="0" step="0.25"
              value={data.defaultNegativeMarks}
              onChange={e => set("defaultNegativeMarks", parseFloat(e.target.value))}
              className="w-24 p-2 bg-white/5 border border-white/10 rounded-xl text-sm outline-none"
              title="Marks deducted per wrong answer"
            />
          )}
        </div>

        <div className="flex items-center gap-4 pt-2">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => set("is_published", !data.is_published)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${data.is_published ? "bg-emerald-500" : "bg-white/10"}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${data.is_published ? "translate-x-6" : ""}`} />
            </div>
            <span className="text-sm font-medium text-slate-300">
              {data.is_published ? "Published" : "Draft"}
            </span>
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={saving}
        className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
        {submitLabel}
      </button>
    </div>
  );
}
