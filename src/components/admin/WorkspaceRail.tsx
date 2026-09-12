"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, LayoutGrid, PanelLeftClose, PanelLeftOpen, ScanLine } from "lucide-react";

const ITEMS = [
  { href: "/admin/courses", label: "Courses", icon: LayoutGrid },
  { href: "/admin/papers", label: "Past papers", icon: ScanLine },
  { href: "/admin/mock-exams", label: "Mock exams", icon: ClipboardList },
] as const;

interface Props {
  /**
   * Extra content shown under the tool switcher once the rail is expanded —
   * a workspace's own quick-navigation (Courses passes a semester list).
   * Collapsed, only the icon strip shows; there is nothing fake here to
   * collapse away (no upload/AI panel exists to back it), so a workspace
   * with nothing to add here simply omits the prop rather than the rail
   * inventing a section with nothing in it.
   */
  children?: ReactNode;
}

/**
 * The persistent left rail for ExamAI's admin content workspaces.
 *
 * One shared component rather than each workspace drawing its own icon
 * strip, so switching between Courses, Papers, and whatever joins them later
 * (Notes, Exams) stays one click from any of them. Expand/collapse state is
 * per-tab (not persisted) — reopening the admin fresh each time in the
 * compact icon-only state is the safer default on a phone-width viewport.
 */
export function WorkspaceRail({ children }: Props) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <nav
      aria-label="Admin workspace tools"
      className={`flex flex-col shrink-0 border-r border-zinc-200 bg-white py-3 transition-[width] ${
        expanded ? "w-56" : "w-14 items-center"
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        title={expanded ? "Collapse" : "Expand"}
        className={`flex items-center justify-center w-10 h-10 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 mb-2 ${
          expanded ? "self-end mr-2" : ""
        }`}
      >
        {expanded ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
      </button>

      <div className={expanded ? "px-2 space-y-0.5" : "flex flex-col items-center gap-1"}>
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href) ?? false;
          return (
            <Link
              key={href}
              href={href}
              title={expanded ? undefined : label}
              aria-current={active ? "page" : undefined}
              className={`flex items-center rounded-md transition-colors ${
                expanded ? "gap-2.5 px-2.5 py-2 text-sm font-medium" : "justify-center w-10 h-10"
              } ${active ? "bg-primary-50 text-primary-600" : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {expanded ? <span>{label}</span> : <span className="sr-only">{label}</span>}
            </Link>
          );
        })}
      </div>

      {expanded && children && (
        <div className="mt-4 pt-4 border-t border-zinc-100 px-2 flex-1 min-h-0 overflow-y-auto">
          {children}
        </div>
      )}
    </nav>
  );
}
