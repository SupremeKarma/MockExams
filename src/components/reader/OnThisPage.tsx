"use client";

import type { ReaderSection } from "@/lib/examai/reader";

interface Props {
  sections: ReaderSection[];
  activeAnchor: string | null;
  /** Hide the heading when the surrounding dialog already names the panel. */
  showTitle?: boolean;
  onNavigate?: () => void;
}

/**
 * The "On this page" outline.
 *
 * Built from the sections derived at publish time, not read back out of the
 * DOM — so it shows exactly the heading tree that was stored, and a heading the
 * parser rejected can never appear here as though it were fine.
 */
export function OnThisPage({ sections, activeAnchor, showTitle = true, onNavigate }: Props) {
  if (sections.length === 0) return null;

  const handleClick = (anchor: string) => (event: React.MouseEvent) => {
    // Native anchor navigation pushes a history entry per heading, so a reader
    // who skims an outline has to press Back a dozen times to leave the page.
    // replaceState keeps the URL shareable without that.
    event.preventDefault();
    const target = document.getElementById(anchor);
    if (!target) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${anchor}`);

    // Move focus too, or a keyboard user's next Tab continues from wherever
    // they were rather than from the heading they just chose.
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });

    onNavigate?.();
  };

  // No inner <nav aria-label="On this page"> here: both call sites already sit
  // in a container carrying that name — the `.toc` aside and the Contents
  // dialog — so a nav would announce the same landmark name twice. `.toc h2`
  // is the styled title selector; `.toc-section` is a block container for the
  // rail's prose, not a heading class.
  return (
    <>
      {showTitle && <h2>On this page</h2>}
      <ol className="toc-list">
        {sections.map((section) => (
          <li key={section.anchor} className={section.level === 3 ? "lvl-3" : undefined}>
            <a
              href={`#${section.anchor}`}
              onClick={handleClick(section.anchor)}
              aria-current={activeAnchor === section.anchor ? "location" : undefined}
            >
              {section.heading}
            </a>
          </li>
        ))}
      </ol>
    </>
  );
}
