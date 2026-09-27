import "@/styles/reader/tokens.css";
import "@/styles/reader/reader.css";
import "@/styles/reader/integration.css";

/**
 * Notes now owns its own layout, the same way /learn/{course} does (see that
 * route's layout.tsx): AppShell renders bare children for /notes because this
 * page supplies its own header built from the Reader's design system, and
 * nesting it under the marketing navbar or the dashboard sidebar would give
 * the page two headers.
 */
export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
