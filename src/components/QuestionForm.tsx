import { Plus, Save, Loader2, Sigma, PenLine, ListChecks } from "lucide-react";
import MathRenderer from "./MathRenderer";

export interface QuestionFormData {
  type: "mcq" | "written";
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  model_answer: string;
  /** Optional marking criteria; the grader scores against these when present. */
  rubric: string;
  explanation: string;
  /** Optional topic tag; analytics groups by this when set. */
  topic: string;
  difficulty: string;
  marks: number;
  negativeMarks: number;
}

export const EMPTY_QUESTION: QuestionFormData = {
  type: "mcq",
  question_text: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_option: "a",
  model_answer: "",
  rubric: "",
  explanation: "",
  topic: "",
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
  const inputClass = "w-full p-3 bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-shadow text-sm text-zinc-900";

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg border border-zinc-200 space-y-6">
      {/* Question Type */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-zinc-600">Question type</label>
        <div className="flex bg-zinc-100 rounded-md p-1 w-fit">
          <button
            type="button"
            onClick={() => set("type", "mcq")}
            className={`px-3.5 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              data.type === "mcq" ? "bg-white text-primary-700 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <ListChecks className="w-3.5 h-3.5" /> Multiple choice
          </button>
          <button
            type="button"
            onClick={() => set("type", "written")}
            className={`px-3.5 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              data.type === "written" ? "bg-white text-violet-700 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <PenLine className="w-3.5 h-3.5" /> Written (AI-graded)
          </button>
        </div>
      </div>

      {/* Question Text */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-zinc-600 flex items-center gap-2">
          Question text
          <span className="px-2 py-0.5 bg-primary-50 text-primary-700 text-[10px] uppercase font-bold tracking-wide rounded flex items-center gap-1">
            <Sigma className="w-2.5 h-2.5" /> Supports LaTeX ($...$)
          </span>
        </label>
        <textarea
          required
          rows={3}
          value={data.question_text}
          onChange={e => set("question_text", e.target.value)}
          placeholder="Enter question. Use $x^2$ for inline and $$E=mc^2$$ for block math."
          className={`${inputClass} resize-none leading-relaxed`}
        />

        {/* Live Math Preview */}
        {data.question_text && (
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-md">
            <div className="text-[10px] font-bold uppercase text-emerald-700 tracking-wide mb-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Live render preview
            </div>
            <MathRenderer content={data.question_text} className="text-zinc-900 prose max-w-none" />
          </div>
        )}
      </div>

      {data.type === "mcq" ? (
        <>
          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["a", "b", "c", "d"] as const).map(opt => (
              <div key={opt} className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Option {opt}</label>
                <input
                  required={data.type === "mcq"}
                  type="text"
                  value={(data as any)[`option_${opt}`]}
                  onChange={e => set(`option_${opt}` as keyof QuestionFormData, e.target.value)}
                  placeholder={`Option ${opt.toUpperCase()}...`}
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          {/* Correct Option */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-zinc-600">Correct choice</label>
            <div className="flex gap-3">
              {(["a", "b", "c", "d"] as const).map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => set("correct_option", opt)}
                  className={`flex-1 py-3 rounded-md text-sm font-bold uppercase border transition-colors ${
                    data.correct_option === opt
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "bg-white border-zinc-200 text-zinc-500 hover:border-emerald-300 hover:text-emerald-600"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-zinc-600 flex items-center gap-2">
            Model answer
            <span className="px-2 py-0.5 bg-violet-50 text-violet-700 text-[10px] uppercase font-bold tracking-wide rounded">
              Graded by AI against this
            </span>
          </label>
          <textarea
            required={data.type === "written"}
            rows={6}
            value={data.model_answer}
            onChange={e => set("model_answer", e.target.value)}
            placeholder="Write out the full expected answer, just like a real exam answer key. Students type a real answer and Claude/Gemini grades it against this."
            className={`${inputClass} resize-none leading-relaxed`}
          />

          <label className="text-xs font-semibold text-zinc-600 flex items-center gap-2 pt-1">
            Marking rubric
            <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] uppercase font-bold tracking-wide rounded">
              Optional
            </span>
          </label>
          <textarea
            rows={4}
            value={data.rubric}
            onChange={e => set("rubric", e.target.value)}
            placeholder={"One criterion per line, with marks. For example:\n2 marks - states the correct definition\n2 marks - gives a worked example\n1 mark - notes the time complexity"}
            className={`${inputClass} resize-none leading-relaxed`}
          />
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Without a rubric the grader scores against the model answer alone. With one, it marks each criterion — more consistent, and the feedback cites the criteria a student missed.
          </p>
        </div>
      )}

      {/* Explanation */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-zinc-600 flex items-center justify-between">
          <span>Solution explanation</span>
          <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wide">Hidden from students during exam</span>
        </label>
        <textarea
          rows={4}
          value={data.explanation}
          onChange={e => set("explanation", e.target.value)}
          placeholder="Explain the derivation. LaTeX is supported here too."
          className={`${inputClass} resize-none`}
        />
        {data.explanation && (
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-md">
             <div className="text-[10px] font-bold uppercase text-zinc-500 tracking-wide mb-2">Solution render</div>
             <MathRenderer content={data.explanation} className="text-zinc-700" />
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="space-y-1.5 pt-2">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide flex items-center gap-2">
          Topic
          <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] normal-case font-bold tracking-wide rounded">
            Optional
          </span>
        </label>
        <input
          type="text"
          value={data.topic}
          onChange={e => set("topic", e.target.value)}
          placeholder="e.g. AVL rotations, Normalization, Pointer arithmetic"
          className={inputClass}
        />
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          Untagged questions are grouped by subject in student analytics. Tagging them lets weak-area detection pinpoint the exact concept.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Difficulty</label>
          <select
            value={data.difficulty}
            onChange={e => set("difficulty", e.target.value)}
            className={inputClass}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Marks</label>
          <input
            type="number" min="0.5" step="0.5"
            value={data.marks}
            onChange={e => set("marks", parseFloat(e.target.value))}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Negative marks</label>
          <input
            type="number" min="0" step="0.25"
            value={data.negativeMarks}
            onChange={e => set("negativeMarks", parseFloat(e.target.value))}
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className={`w-full py-3.5 text-white rounded-md font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-button ${
          mode === "edit"
            ? "bg-amber-600 hover:bg-amber-700"
            : "bg-primary-600 hover:bg-primary-700"
        }`}
      >
        {saving
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : mode === "edit" ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        <span>
          {mode === "edit" ? "Save changes" : "Add question"}
        </span>
      </button>
    </form>
  );
}
