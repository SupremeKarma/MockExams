"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ScanLine } from "lucide-react";

const ITEMS = [
  { href: "/admin/courses", label: "Courses", icon: LayoutGrid },
  { href: "/admin/papers", label: "Past papers", icon: ScanLine },
] as const;

/**
 * The persistent left rail for ExamAI's admin content workspaces.
 *
 * One shared component rather than each workspace drawing its own icon
 * strip, so switching between Courses, Papers, and whatever joins them later
 * (Notes, Exams) stays one click from any of them.
 */
export function WorkspaceRail() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin workspace tools"
      className="flex flex-col items-center gap-1 w-14 shrink-0 border-r border-zinc-200 bg-white py-4"
    >
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname?.startsWith(href) ?? false;
        return (
          <Link
            key={href}
            href={href}
            title={label}
            aria-current={active ? "page" : undefined}
            className={`flex items-center justify-center w-10 h-10 rounded-md transition-colors ${
              active ? "bg-primary-50 text-primary-600" : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="sr-only">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
