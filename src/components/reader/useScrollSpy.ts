"use client";

import { useEffect, useState } from "react";

/**
 * Which heading the reader is currently under.
 *
 * This is a POSITION query, not a visibility one, and that distinction is why
 * it is not an IntersectionObserver. An observer only calls back when an
 * element crosses a threshold, so anything that changes the answer *without* a
 * crossing leaves the highlight stale — which is exactly what happened here:
 * KaTeX and the webfont loaded after first paint, every heading moved several
 * hundred pixels, and no callback fired. The outline confidently highlighted
 * the wrong section until the next scroll.
 *
 * So: read positions, and recompute on the events that can change them —
 * scroll, resize, and late-loading assets. The cost is bounded and small (one
 * `getBoundingClientRect` per heading, and a note has ten or so), and it is
 * throttled to one measurement per animation frame so a fast scroll cannot
 * queue up work.
 */
export function useScrollSpy(anchors: string[], headerOffset = 72): string | null {
  const [active, setActive] = useState<string | null>(null);

  // Depend on the CONTENT of the list, not its identity: callers naturally pass
  // a freshly-mapped array, and depending on the array itself re-runs this on
  // every render.
  const key = anchors.join("|");

  useEffect(() => {
    const anchorList = key ? key.split("|") : [];
    if (anchorList.length === 0) return;

    let frame = 0;

    const measure = () => {
      frame = 0;

      const elements = anchorList
        .map((anchor) => document.getElementById(anchor))
        .filter((el): el is HTMLElement => el !== null);
      if (elements.length === 0) return;

      // The last heading whose top has passed under the sticky header is the
      // section being read. A small tolerance past the header stops the
      // highlight flickering between two headings when one sits exactly on the
      // boundary.
      const cutoff = headerOffset + 8;
      let current: HTMLElement | null = null;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= cutoff) current = el;
        else break; // elements are in document order
      }

      // Before the first heading: the reader is still in the intro, so the
      // first entry is the honest answer rather than nothing.
      setActive((current ?? elements[0]).id);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    // A deep link wins until the reader scrolls — it is what they asked for.
    // Both paths go through the frame callback rather than updating state
    // straight from the effect body, which would render twice on every mount.
    const fromHash = window.location.hash.slice(1);
    if (fromHash && anchorList.includes(fromHash)) {
      frame = requestAnimationFrame(() => {
        frame = 0;
        setActive(fromHash);
      });
    } else {
      schedule();
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Late layout shifts: webfonts and KaTeX both move every heading well after
    // first paint.
    window.addEventListener("load", schedule);
    document.fonts?.ready.then(schedule).catch(() => {});

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, [key, headerOffset]);

  return active;
}
