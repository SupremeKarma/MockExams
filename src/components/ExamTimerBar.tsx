// ExamTimerBar.tsx
// Sticky top bar that shows time remaining, question progress, and
// an unanswered-question warning toast. Drop into your exam layout.

"use client";

import { useEffect, useRef } from "react";
import { useExamTimer } from "@/hooks/useExamTimer";

interface ExamTimerBarProps {
  totalSeconds: number;
  totalQuestions: number;
  answeredCount: number;
  persistKey?: string;
  onExpire: () => void;
  onWarning?: () => void;
  onCritical?: () => void;
}

export function ExamTimerBar({
  totalSeconds,
  totalQuestions,
  answeredCount,
  persistKey,
  onExpire,
  onWarning,
  onCritical,
}: ExamTimerBarProps) {
  const toastShownRef = useRef(false);

  const { display, status, progress, start } = useExamTimer({
    durationSeconds: totalSeconds,
    warningThreshold: 300,
    criticalThreshold: 120,
    persistKey,
    onExpire,
    onWarning,
    onCritical: () => {
      onCritical?.();
      // Show unanswered toast once when critical
      if (!toastShownRef.current) {
        toastShownRef.current = true;
        const unanswered = totalQuestions - answeredCount;
        if (unanswered > 0) {
          showToast(`2 minutes left — ${unanswered} question${unanswered > 1 ? "s" : ""} unanswered`);
        }
      }
    },
  });

  // Auto-start on mount
  useEffect(() => {
    start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const unanswered = totalQuestions - answeredCount;
  const progressPct = Math.round((answeredCount / totalQuestions) * 100);

  const timerColour =
    status === "critical"
      ? "text-red-500"
      : status === "warning"
      ? "text-amber-500"
      : "text-foreground";

  const barColour =
    status === "critical"
      ? "bg-red-500"
      : status === "warning"
      ? "bg-amber-400"
      : "bg-blue-500";

  const pulse = status === "critical" ? "animate-pulse" : "";

  return (
    <div
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="timer"
      aria-live="polite"
      aria-label={`Time remaining: ${display}`}
    >
      {/* Main bar */}
      <div className="flex items-center justify-between px-4 py-2 gap-4">
        {/* Timer */}
        <div className={`flex items-center gap-2 font-mono text-lg font-semibold tabular-nums ${timerColour} ${pulse}`}>
          <ClockIcon status={status} />
          {display}
        </div>

        {/* Question progress */}
        <div className="flex items-center gap-3 flex-1 max-w-sm">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {answeredCount} / {totalQuestions}
          </span>
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${barColour}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">{progressPct}%</span>
        </div>

        {/* Unanswered pill */}
        {unanswered > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-medium">
            {unanswered} left
          </span>
        )}
      </div>

      {/* Thin progress line at very bottom of bar */}
      <div className="h-0.5 bg-muted w-full">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${barColour}`}
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
  );
}

// --- Minimal inline toast (no library needed) ---
function showToast(message: string) {
  if (typeof window === "undefined") return;
  const el = document.createElement("div");
  el.textContent = message;
  Object.assign(el.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    background: "#1a1a1a",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "10px",
    fontSize: "14px",
    fontFamily: "inherit",
    zIndex: "9999",
    boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
    opacity: "0",
    transition: "opacity 0.3s ease",
    maxWidth: "320px",
    lineHeight: "1.5",
  });
  document.body.appendChild(el);
  requestAnimationFrame(() => { el.style.opacity = "1"; });
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 400);
  }, 5000);
}

// --- Small clock icon that shifts colour with status ---
function ClockIcon({ status }: { status: string }) {
  const colour =
    status === "critical" ? "#EF4444"
    : status === "warning" ? "#F59E0B"
    : "currentColor";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colour} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
