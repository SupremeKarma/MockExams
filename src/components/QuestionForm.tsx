import { Plus, Save, Loader2, Sigma } from "lucide-react";
import MathRenderer from "./MathRenderer";

export interface QuestionFormData {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation: string;
  difficulty: string;
  marks: number;
  negativeMarks: number;
}

export const EMPTY_QUESTION: QuestionFormData = {
  question_text: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_option: "a",
  explanation: "",
  difficulty: "medium",
  marks: 1,
  negativeMarks: 0.25,
};

interface QuestionFormProps {
  data: QuestionFormData;
  onChange: (data: QuestionFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  mode?: "create" | "edit";
}

export default function QuestionForm({ data, onChange, onSubmit, saving, mode = "create" }: QuestionFormProps) {
  const set = (key: keyof QuestionFormData, value: any) => onChange({ ...data, [key]: value });

  return (
    <form onSubmit={onSubmit} className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
      {/* Question Text */}
      <div className="space-y-4">
        <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
          Question Text 
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] uppercase font-black tracking-widest rounded flex items-center gap-1">
            <Sigma className="w-2.5 h-2.5" /> Supports LaTeX ($...$)
          </span>
        </label>
        <textarea
          required
          rows={3}
          value={data.question_text}
          onChange={e => set("question_text", e.target.value)}
          placeholder="Enter question. Use $x^2$ for inline and $$E=mc^2$$ for block math."
          className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all resize-none font-medium leading-relaxed"
        />
        
        {/* Live Math Preview */}
        {data.question_text && (
          <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2">
            <div className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
              Live Render Preview
            </div>
            <MathRenderer content={data.question_text} className="text-white prose prose-invert max-w-none" />
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(["a", "b", "c", "d"] as const).map(opt => (
          <div key={opt} className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Option {opt}</label>
            <input
              required
              type="text"
              value={(data as any)[`option_${opt}`]}
              onChange={e => set(`option_${opt}` as keyof QuestionFormData, e.target.value)}
              placeholder={`Option ${opt.toUpperCase()}...`}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all font-medium"
            />
          </div>
        ))}
      </div>

      {/* Correct Option */}
      <div className="space-y-4">
        <label className="text-sm font-bold text-slate-400">Correct Choice</label>
        <div className="flex gap-4">
          {(["a", "b", "c", "d"] as const).map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => set("correct_option", opt)}
              className={`flex-1 py-4 rounded-2xl text-sm font-black uppercase border transition-all ${
                data.correct_option === opt
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-500/20"
                  : "bg-white/5 border-white/10 text-slate-500 hover:border-emerald-500/50 hover:text-emerald-500"
              }`}
            >
              Option {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="space-y-4">
        <label className="text-sm font-bold text-slate-400 flex items-center justify-between">
          <span>Solution Mechanics</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider italic">Hidden from students during exam</span>
        </label>
        <textarea
          rows={4}
          value={data.explanation}
          onChange={e => set("explanation", e.target.value)}
          placeholder="Explain the derivation. LaTeX is supported here too."
          className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all resize-none font-medium text-slate-300"
        />
        {data.explanation && (
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
             <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">Solution Render</div>
             <MathRenderer content={data.explanation} className="text-slate-300" />
          </div>
        )}
      </div>

      {/* Meta Dynamics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="space-y-3">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Complexity</label>
          <select
            value={data.difficulty}
            onChange={e => set("difficulty", e.target.value)}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all font-bold appearance-none cursor-pointer"
          >
            <option value="easy">Easy Level</option>
            <option value="medium">Target Level</option>
            <option value="hard">Adv. Challenge</option>
          </select>
        </div>
        <div className="space-y-3">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Awarded Weight</label>
          <input
            type="number" min="0.5" step="0.5"
            value={data.marks}
            onChange={e => set("marks", parseFloat(e.target.value))}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all font-bold"
          />
        </div>
        <div className="space-y-3">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Penalty Bias</label>
          <input
            type="number" min="0" step="0.25"
            value={data.negativeMarks}
            onChange={e => set("negativeMarks", parseFloat(e.target.value))}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary/50 outline-none transition-all font-bold"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className={`w-full py-5 text-white rounded-[1.5rem] font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl ${
          mode === "edit"
            ? "bg-amber-500 hover:bg-amber-400 shadow-amber-500/20"
            : "bg-primary hover:opacity-90 shadow-primary/20"
        }`}
      >
        {saving
          ? <Loader2 className="w-5 h-5 animate-spin" />
          : mode === "edit" ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        <span className="uppercase tracking-widest text-xs font-black">
          {mode === "edit" ? "Finalize Updates" : "Commit Question to Exam"}
        </span>
      </button>
    </form>
  );
}

