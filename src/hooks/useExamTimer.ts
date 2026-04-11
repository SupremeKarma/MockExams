// useExamTimer.ts
// Drop-in replacement for any existing timer logic in your ExamAI project.
// Handles: drift correction, tab visibility, page unload persistence,
// warning thresholds, and clean teardown.

import { useState, useEffect, useRef, useCallback } from "react";

export type TimerStatus = "idle" | "running" | "warning" | "critical" | "expired";

export interface UseExamTimerOptions {
  /** Total exam duration in seconds */
  durationSeconds: number;
  /** Seconds remaining at which status becomes "warning". Default: 300 (5 min) */
  warningThreshold?: number;
  /** Seconds remaining at which status becomes "critical". Default: 120 (2 min) */
  criticalThreshold?: number;
  /** Called once when timer reaches zero */
  onExpire?: () => void;
  /** Called when timer crosses into warning zone */
  onWarning?: () => void;
  /** Called when timer crosses into critical zone */
  onCritical?: () => void;
  /** Storage key for persisting timer across page refreshes. Omit to disable. */
  persistKey?: string;
}

export interface UseExamTimerReturn {
  secondsRemaining: number;
  status: TimerStatus;
  /** MM:SS formatted string */
  display: string;
  /** 0–1 progress value (1 = full time remaining) */
  progress: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function useExamTimer({
  durationSeconds,
  warningThreshold = 300,
  criticalThreshold = 120,
  onExpire,
  onWarning,
  onCritical,
  persistKey,
}: UseExamTimerOptions): UseExamTimerReturn {
  const getInitialSeconds = (): number => {
    if (persistKey) {
      try {
        const stored = sessionStorage.getItem(persistKey);
        if (stored) {
          const { secondsRemaining, savedAt } = JSON.parse(stored);
          const elapsed = Math.floor((Date.now() - savedAt) / 1000);
          const adjusted = secondsRemaining - elapsed;
          if (adjusted > 0) return adjusted;
        }
      } catch {
        // ignore parse errors
      }
    }
    return durationSeconds;
  };

  const [secondsRemaining, setSecondsRemaining] = useState<number>(getInitialSeconds);
  const [status, setStatus] = useState<TimerStatus>("idle");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startSecondsRef = useRef<number>(secondsRemaining);
  const firedWarning = useRef(false);
  const firedCritical = useRef(false);
  const firedExpire = useRef(false);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const persist = useCallback(
    (secs: number) => {
      if (!persistKey) return;
      try {
        sessionStorage.setItem(
          persistKey,
          JSON.stringify({ secondsRemaining: secs, savedAt: Date.now() })
        );
      } catch {
        // storage full or unavailable
      }
    },
    [persistKey]
  );

  const tick = useCallback(() => {
    if (startTimeRef.current === null) return;

    // Drift-corrected: calculate actual elapsed instead of trusting interval accuracy
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const remaining = Math.max(0, startSecondsRef.current - elapsed);

    setSecondsRemaining(remaining);
    persist(remaining);

    // Threshold callbacks — fire once each
    if (remaining <= warningThreshold && !firedWarning.current) {
      firedWarning.current = true;
      onWarning?.();
    }
    if (remaining <= criticalThreshold && !firedCritical.current) {
      firedCritical.current = true;
      onCritical?.();
    }

    // Status
    if (remaining === 0) {
      setStatus("expired");
      clearTimer();
      if (!firedExpire.current) {
        firedExpire.current = true;
        if (persistKey) sessionStorage.removeItem(persistKey);
        onExpire?.();
      }
    } else if (remaining <= criticalThreshold) {
      setStatus("critical");
    } else if (remaining <= warningThreshold) {
      setStatus("warning");
    }
  }, [warningThreshold, criticalThreshold, onWarning, onCritical, onExpire, clearTimer, persist, persistKey]);

  const start = useCallback(() => {
    if (intervalRef.current !== null) return; // already running
    startTimeRef.current = Date.now();
    startSecondsRef.current = secondsRemaining;
    setStatus(
      secondsRemaining <= criticalThreshold
        ? "critical"
        : secondsRemaining <= warningThreshold
        ? "warning"
        : "running"
    );
    intervalRef.current = setInterval(tick, 500); // 500ms for smoother UI
  }, [secondsRemaining, criticalThreshold, warningThreshold, tick]);

  const pause = useCallback(() => {
    clearTimer();
    setStatus("idle");
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    firedWarning.current = false;
    firedCritical.current = false;
    firedExpire.current = false;
    startTimeRef.current = null;
    setSecondsRemaining(durationSeconds);
    setStatus("idle");
    if (persistKey) sessionStorage.removeItem(persistKey);
  }, [clearTimer, durationSeconds, persistKey]);

  // Handle tab visibility change — pause drift accumulation
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && intervalRef.current !== null) {
        // Tab hidden: persist current state, clear interval
        persist(secondsRemaining);
        clearTimer();
      } else if (!document.hidden && status === "running") {
        // Tab visible again: recalculate from persisted/saved time
        start();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [status, secondsRemaining, start, clearTimer, persist]);

  // Persist on page unload
  useEffect(() => {
    const handleUnload = () => persist(secondsRemaining);
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [secondsRemaining, persist]);

  // Cleanup on unmount
  useEffect(() => () => clearTimer(), [clearTimer]);

  return {
    secondsRemaining,
    status,
    display: formatTime(secondsRemaining),
    progress: secondsRemaining / durationSeconds,
    start,
    pause,
    reset,
  };
}
