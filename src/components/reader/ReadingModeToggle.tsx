"use client";

export type ReadingMode = "beginner" | "revision";

// Beginner shows the plain-words idea and worked examples expanded; Revision
// collapses them to leave method and key points.
//
// It is the SAME document rendered differently, never a second copy. Two copies
// drift, and the one a student revises from is always the stale one.
export function ReadingModeToggle({
  mode,
  onChange,
}: {
  mode: ReadingMode;
  onChange: (mode: ReadingMode) => void;
}) {
  return (
    <div className="ex-modes" role="group" aria-label="Reading mode">
      {(["beginner", "revision"] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          aria-pressed={mode === value}
          className={mode === value ? "is-active" : undefined}
        >
          {value === "beginner" ? "Beginner" : "Revision"}
        </button>
      ))}
    </div>
  );
}
