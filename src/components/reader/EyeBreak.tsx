"use client";

import { useEffect, useRef, useState } from "react";

const TWENTY_MINUTES = 20 * 60 * 1000;

interface Props {
  enabled: boolean;
  onTurnOff: () => void;
}

/**
 * The 20-20-20 eye break reminder.
 *
 * Every twenty minutes of *reading*, a quiet message suggests looking about six
 * metres away for twenty seconds — the standard guidance for digital eye
 * strain. It is the counterweight to a product that wants students to stay a
 * long time: the goal is long STUDY sessions, not long sessions.
 *
 * Three deliberate restraints:
 *
 *   - It never blocks the page. It is a `role="status"` toast, so a screen
 *     reader announces it politely rather than interrupting.
 *   - The timer counts reading time, not wall-clock time. It pauses when the
 *     tab is hidden, so a page left open overnight does not greet the reader
 *     with a stale reminder in the morning.
 *   - It never appears during a mock exam — nothing interrupts a timed paper.
 *     (Mock exams arrive in Phase 5; the guard is here so it cannot be
 *     forgotten then.)
 */
export function EyeBreak({ enabled, onTurnOff }: Props) {
  const [due, setDue] = useState(false);
  const elapsed = useRef(0);
  // Seeded inside the effect, not at render: `Date.now()` during render is
  // impure, and on a server-rendered page it would also be the server's clock.
  const lastTick = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    // Nothing interrupts a timed paper.
    if (document.body.dataset.examInProgress === "true") return;

    lastTick.current = Date.now();

    const tick = () => {
      const now = Date.now();
      if (document.visibilityState === "visible") {
        elapsed.current += now - lastTick.current;
      }
      lastTick.current = now;

      if (elapsed.current >= TWENTY_MINUTES) {
        elapsed.current = 0;
        setDue(true);
      }
    };

    const onVisibility = () => {
      // Reset the reference point so time spent on another tab is not counted
      // as reading time the moment this one comes back.
      lastTick.current = Date.now();
    };

    const id = window.setInterval(tick, 30_000);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  // Derived at render rather than cleared through state: turning reminders off
  // should hide a visible toast immediately, and doing that with a setState in
  // an effect causes an extra render for no benefit.
  if (!enabled || !due) return null;

  return (
    <div className="break-toast" role="status">
      <p>
        <strong>Time for a short eye break.</strong> Look at something about 6 metres away for
        20 seconds.
      </p>
      <div className="actions">
        <button type="button" className="btn btn--primary" onClick={() => setDue(false)}>
          Done
        </button>
        <button
          type="button"
          className="btn btn--quiet"
          onClick={() => {
            setDue(false);
            onTurnOff();
          }}
        >
          Turn off reminders
        </button>
      </div>
    </div>
  );
}
