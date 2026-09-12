"use client";

import Link from "next/link";
import { useMemo } from "react";

import type { TreeNode } from "@/lib/examai/reader";

interface Props {
  tree: TreeNode;
  currentPath: string;
  /** Topics the student has marked learned, by syllabus path. */
  learned?: ReadonlySet<string>;
}

/**
 * The left pane: the official syllabus, not a list of pages we happen to have.
 *
 * Topics with no note yet are still shown, dimmed and unlinked. Hiding them
 * would make the syllabus look complete and quietly mislead a student about
 * what is left to revise — the gaps are information.
 *
 * Progress is shown by a dot whose STATE differs by shape, not only colour
 * (DESIGN.md §9), and each dot carries screen-reader text, so the status is
 * never carried by colour alone.
 */
export function SyllabusTree({ tree, currentPath, learned }: Props) {
  // The unit containing the current topic starts open; the rest start closed,
  // so a nine-unit course does not open as a wall of forty links.
  const openUnits = useMemo(() => {
    const open = new Set<string>();
    for (const unit of tree.children) {
      if (currentPath === unit.path || currentPath.startsWith(`${unit.path}.`)) {
        open.add(unit.path);
      }
    }
    return open;
  }, [tree, currentPath]);

  const courseCode = (tree.code ?? "").toLowerCase();

  return (
    <>
      <p className="course-title">{tree.title}</p>
      <p className="course-meta">
        {tree.code} · {tree.children.length} units
      </p>

      <nav aria-label="Syllabus">
        <ul className="tree">
          {tree.children.map((unit) => {
            const withNotes = unit.children.filter((t) => t.shortId).length;

            return (
              <li key={unit.path}>
                <details open={openUnits.has(unit.path)}>
                  <summary>
                    Unit {unit.code} {unit.title}
                  </summary>

                  {unit.children.length === 0 ? (
                    <ul>
                      <li>
                        <span className="rail-note">
                          This unit lists its contents as prose, so it has no separate topics.
                        </span>
                      </li>
                    </ul>
                  ) : (
                    <ul>
                      {unit.children.map((topic) => {
                        const isCurrent = topic.path === currentPath;
                        const state = isCurrent
                          ? "progress"
                          : learned?.has(topic.path)
                            ? "learned"
                            : "new";
                        const stateLabel =
                          state === "progress"
                            ? "In progress"
                            : state === "learned"
                              ? "Learned"
                              : "Not started";

                        const inner = (
                          <>
                            <span className="code">{topic.code}</span>
                            {topic.title}
                            <span className="dot" data-state={state}>
                              <span className="sr-only">{stateLabel}</span>
                            </span>
                          </>
                        );

                        if (!topic.shortId) {
                          return (
                            <li key={topic.path}>
                              <span className="rail-note" title="No note yet">
                                <span className="code">{topic.code}</span>
                                {topic.title}
                              </span>
                            </li>
                          );
                        }

                        return (
                          <li key={topic.path}>
                            <Link
                              href={`/learn/${courseCode}/${topic.slug}-${topic.shortId}`}
                              aria-current={isCurrent ? "page" : undefined}
                            >
                              {inner}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </details>
                <span className="sr-only">
                  {withNotes} of {unit.children.length} topics have notes
                </span>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
