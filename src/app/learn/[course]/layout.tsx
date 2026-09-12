// KaTeX's stylesheet is imported HERE, in a layout, so Next emits it as a
// <link> in the document head. That is the root-cause fix for half the deep
// link problem: loaded any later, KaTeX restyles every formula after first
// paint, every heading below one moves, and a link to a deep section lands
// hundreds of pixels past its target.
import "katex/dist/katex.min.css";

import "@/styles/reader/tokens.css";
import "@/styles/reader/reader.css";
// Kept last, and kept separate, so tokens.css and reader.css stay identical to
// the design system and can be replaced wholesale when it is revised.
import "@/styles/reader/integration.css";

/**
 * The Reader owns its own layout: AppShell returns bare children for
 * /learn/{course}, because this section supplies its own sticky header, and
 * nesting it under the marketing navbar would give the page two headers and
 * break the scroll offsets the deep-link landing is calibrated against.
 *
 * The design system's CSS is scoped to this route rather than imported into
 * globals.css. DESIGN.md §10 describes global adoption, and that is the right
 * destination — but the live app already ships its own token set keyed on
 * `data-theme="dark"|"light"`, while this one uses paper/warm/blackboard/night.
 * Importing both globally today would leave the rest of the product reading
 * from whichever rule happened to win. Restyling the app onto these tokens is
 * its own piece of work, not a side effect of shipping the Reader.
 */
export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
