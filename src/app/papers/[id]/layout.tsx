import "@/styles/reader/tokens.css";
import "@/styles/reader/reader.css";
import "@/styles/reader/integration.css";

/**
 * Same reasoning as src/app/notes/layout.tsx and friends: this route owns its
 * own header/rail/toc chrome built from the Reader's design system, so
 * AppShell renders bare children for it. Scoped to /papers/[id] only — the
 * /papers upload form keeps its plain marketing-style layout, since it is a
 * form, not something to read.
 */
export default function SolvedPaperLayout({ children }: { children: React.ReactNode }) {
  return children;
}
