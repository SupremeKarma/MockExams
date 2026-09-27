import "@/styles/reader/tokens.css";
import "@/styles/reader/reader.css";
import "@/styles/reader/integration.css";

/**
 * Same reasoning as src/app/notes/layout.tsx, src/app/syllabus/layout.tsx,
 * and src/app/solution/layout.tsx: this route owns its own header built from
 * the Reader's design system, so AppShell renders bare children for it (see
 * the PAST_PAPERS_PATTERN check there).
 */
export default function PastPapersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
