import type { AskedInQuestion } from "@/lib/examai/asked-in";

interface Props {
  questions: AskedInQuestion[];
  showTitle?: boolean;
}

const EXAM_TYPE_LABEL: Record<AskedInQuestion["examType"], string> = {
  regular: "Regular",
  back: "Back",
  make_up: "Make-up",
  model: "Model",
};

/**
 * Real exam appearances for the current topic.
 *
 * Renders nothing when there are none, rather than an empty section — an
 * empty "Asked in" reads as "never asked", a claim only a fully-tagged corpus
 * can make. See src/lib/examai/asked-in.ts for why this is fetched
 * server-side rather than queried from this (client) component.
 */
export function AskedIn({ questions, showTitle = true }: Props) {
  if (questions.length === 0) return null;

  return (
    <div className="asked-in">
      {showTitle && <h2>Asked in exams</h2>}
      <ul className="asked-in-list">
        {questions.map((q) => (
          <li key={`${q.paperId}/${q.qId}`}>
            <span className="asked-in-paper">
              {q.courseId} {q.year} {EXAM_TYPE_LABEL[q.examType]}
            </span>
            <span className="asked-in-number">
              Q{q.number}
              {q.marks != null ? ` · ${q.marks} marks` : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
