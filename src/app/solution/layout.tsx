import "@/styles/reader/tokens.css";
import "@/styles/reader/reader.css";
import "@/styles/reader/content-rules.css";
import "@/styles/reader/access-control.css";
import "@/styles/reader/integration.css";

/**
 * Same reasoning as src/app/notes/layout.tsx and src/app/syllabus/layout.tsx:
 * this route owns its own header built from the Reader's design system, so
 * AppShell renders bare children for it (see the SOLUTION_PATTERN check
 * there).
 */
export default function SolutionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
