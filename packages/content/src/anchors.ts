// Anchor diffing — what stops a publish from breaking shared deep links.
//
// A student bookmarks `#deadlock-detection`. Someone rewords that heading. The
// old link does not error: it lands silently at the top of the page, which
// reads as the reader's mistake rather than ours. Nothing in the system would
// report it, and the student has no way to know what they were meant to see.
//
// So publishing compares the anchors about to go live against the anchors
// currently live, and refuses when one would disappear uncovered by an alias.

export interface AnchorDiff {
  added: string[];
  removed: string[];
  kept: string[];
  /** Removed anchors with no alias mapping them onto a surviving anchor. */
  unmapped: string[];
}

/**
 * Compare published anchors with incoming ones.
 *
 * `aliases` maps an old anchor to the anchor it now lives at. An alias only
 * counts when its target actually exists in the new set — pointing an alias at
 * a heading that was itself removed just moves the broken link one hop along.
 */
export function diffAnchors(
  publishedAnchors: readonly string[],
  nextAnchors: readonly string[],
  aliases: ReadonlyMap<string, string> = new Map()
): AnchorDiff {
  const next = new Set(nextAnchors);
  const published = new Set(publishedAnchors);

  const added = [...next].filter((a) => !published.has(a));
  const removed = [...published].filter((a) => !next.has(a));
  const kept = [...published].filter((a) => next.has(a));

  const unmapped = removed.filter((anchor) => {
    const target = aliases.get(anchor);
    return !target || !next.has(target);
  });

  return { added, removed, kept, unmapped };
}
