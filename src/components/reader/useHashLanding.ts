"use client";

import { useEffect } from "react";

/**
 * Make a deep link land on its heading, and then get out of the way.
 *
 * The layout shift that made this necessary is now fixed at the source —
 * `next/font` reserves the metrics for both faces (src/app/fonts.ts) and
 * KaTeX's stylesheet is emitted into the document head (the /learn layout), so
 * headings no longer move hundreds of pixels after first paint. This remains as
 * a belt-and-braces correction for the shift that is left: a lazily-decoded
 * image, or a font that misses its swap deadline on a slow connection.
 *
 * Three guards, because a correction that fires at the wrong moment is worse
 * than the wrong landing it was fixing:
 *
 *   1. **Abort the moment the reader acts.** Yanking the page while somebody is
 *      already reading is disorienting in a way a slightly-off landing is not.
 *      Any scroll, key, wheel or touch cancels the remaining corrections.
 *   2. **Instant under `prefers-reduced-motion`.** A corrective jump should
 *      never animate for a reader who asked for no motion.
 *   3. **Move focus to the heading.** Scrolling moves the viewport but leaves
 *      the keyboard caret and the screen reader's cursor at the top of the
 *      document, so those readers land on the page but not on the section —
 *      the very thing the link promised.
 */
export function useHashLanding(): void {
  useEffect(() => {
    const anchor = decodeURIComponent(window.location.hash.slice(1));
    if (!anchor) return;

    let cancelled = false;
    let focused = false;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    const land = () => {
      if (cancelled) return;
      const target = document.getElementById(anchor);
      if (!target) return;

      // `scroll-margin-top` on the heading keeps it clear of the sticky header,
      // so this is a plain scrollIntoView rather than manual arithmetic — one
      // definition of the offset, in CSS, next to the header height it depends
      // on.
      target.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "auto" });

      if (!focused) {
        focused = true;
        // -1 so it is focusable programmatically without entering the tab order
        // and adding a stop every sighted keyboard user has to pass through.
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };

    // The reader taking over always wins.
    const cancel = () => {
      cancelled = true;
      teardown();
    };

    const teardown = () => {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", cancel);
      window.removeEventListener("pointerdown", cancel);
    };

    window.addEventListener("wheel", cancel, { passive: true, once: true });
    window.addEventListener("touchstart", cancel, { passive: true, once: true });
    window.addEventListener("keydown", cancel, { once: true });
    window.addEventListener("pointerdown", cancel, { once: true });

    land();
    const raf = requestAnimationFrame(land);
    const timer = window.setTimeout(land, 250);
    document.fonts?.ready.then(land).catch(() => {});

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      teardown();
    };
  }, []);
}
