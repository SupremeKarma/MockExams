import "@/styles/reader/tokens.css";
import "@/styles/reader/reader.css";
import "@/styles/reader/content-rules.css";
import "@/styles/reader/access-control.css";
import "@/styles/reader/integration.css";

/**
 * Same reasoning as src/app/notes/layout.tsx: this route owns its own header
 * built from the Reader's design system, so AppShell renders bare children
 * for it (see the SYLLABUS_PATTERN check there).
 */
export default function SyllabusLayout({ children }: { children: React.ReactNode }) {
  return children;
}
