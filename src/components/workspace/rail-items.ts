import { ClipboardList, FileEdit, FilePlus, LayoutGrid, ListChecks, ScanLine } from "lucide-react";
import type { RailItem } from "./WorkspaceRail";

export const ADMIN_WORKSPACE_ITEMS: readonly RailItem[] = [
  { href: "/admin/courses", label: "Courses", icon: LayoutGrid },
  { href: "/admin/papers", label: "Past papers", icon: ScanLine },
  { href: "/admin/notes", label: "Notes", icon: FileEdit },
  { href: "/admin/mock-exams", label: "Mock exams", icon: ClipboardList },
];

export const EXAMINER_WORKSPACE_ITEMS: readonly RailItem[] = [
  { href: "/examiner/exams", label: "My exams", icon: ListChecks },
  { href: "/examiner/exams/new", label: "New exam", icon: FilePlus },
];
