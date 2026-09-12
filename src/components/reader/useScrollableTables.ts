"use client";

import { useEffect } from "react";

/**
 * Mark tables that actually overflow, so the "swipe sideways" hint appears only
 * when there is something to swipe to.
 *
 * The design system hides `.table-hint` until its `.table-wrap` carries
 * `.is-scrollable`, which is a measurement only the browser can make: whether a
 * matrix overflows depends on the viewport, the reader's text size and their
 * chosen line width, all of which change after the server has rendered.
 *
 * Showing the hint unconditionally would be worse than not showing it — a
 * reader told to swipe a table that does not move learns to ignore the message,
 * including on the page where it matters.
 *
 * ## Why the elements are re-queried every time
 *
 * The article is injected with `dangerouslySetInnerHTML`, and React replaces
 * that subtree during hydration. Capturing the nodes once, on mount, put the
 * class on elements that were then thrown away — the measurement was correct
 * and the result invisible. Re-querying each pass costs nothing at this size
 * and cannot go stale.
 */
export function useScrollableTables(): void {
  useEffect(() => {
    let frame = 0;
    let observer: ResizeObserver | null = null;
    let watching: Element[] = [];

    const measure = () => {
      frame = 0;
      const wraps = Array.from(document.querySelectorAll<HTMLElement>(".table-wrap"));

      for (const wrap of wraps) {
        // A pixel of slack: sub-pixel layout rounding otherwise reports a
        // perfectly-fitting table as scrollable.
        const scrollable = wrap.scrollWidth - wrap.clientWidth > 1;
        wrap.classList.toggle("is-scrollable", scrollable);
        // The fade mask (`.is-scrollable:not(.at-end)`) says "there is more to
        // the right". Left on once the reader has swiped to the end, it dims
        // the last column of a matrix permanently and reads as a rendering
        // fault rather than a hint.
        wrap.classList.toggle(
          "at-end",
          !scrollable || wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 1
        );
      }

      // Re-attach the observer if the subtree was replaced under us.
      const targets: Element[] = [];
      for (const wrap of wraps) {
        targets.push(wrap);
        // Observe the TABLE as well: the wrapper is block-level and full-width,
        // so its own box does not change when the table inside it grows — which
        // is exactly the moment the table becomes scrollable.
        const table = wrap.querySelector("table");
        if (table) targets.push(table);
      }

      const changed =
        targets.length !== watching.length || targets.some((t, i) => t !== watching[i]);

      if (changed) {
        observer?.disconnect();
        observer = new ResizeObserver(schedule);
        for (const target of targets) observer.observe(target);
        watching = targets;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    // Hydration replaces the article subtree shortly after mount, so measure
    // again once that has settled.
    const settle = window.setTimeout(measure, 300);

    window.addEventListener("resize", schedule);
    // Scroll does not bubble, so this is a CAPTURE listener on the document
    // rather than one per wrapper: hydration replaces the article subtree, and
    // per-element listeners would be attached to nodes that no longer exist.
    document.addEventListener("scroll", schedule, { capture: true, passive: true });
    document.fonts?.ready.then(schedule).catch(() => {});

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      observer?.disconnect();
      window.removeEventListener("resize", schedule);
      document.removeEventListener("scroll", schedule, { capture: true });
    };
  }, []);
}
