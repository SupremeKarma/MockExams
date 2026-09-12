import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

import { getCourseByCode, getCourseTree } from "@/lib/examai/reader";
import { IconSprite } from "@/components/reader/IconSprite";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ course: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { course } = await params;
  const node = await getCourseByCode(course);
  return { title: node ? `${node.code} ${node.title} · ExamAI` : "Course · ExamAI" };
}

export default async function CoursePage({ params }: PageProps) {
  const { course } = await params;

  const node = await getCourseByCode(course);
  if (!node) notFound();

  const tree = await getCourseTree(node.path);
  if (!tree) notFound();

  const topics = tree.children.flatMap((u) => u.children);
  const written = topics.filter((t) => t.shortId).length;

  return (
    <>
      <IconSprite />
      <header className="app-header">
        <div className="app-header__inner">
          <span className="crumbs">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            {node.code}
          </span>
        </div>
      </header>

      <div className="shell">
        <main className="main sheet" id="main">
          <article className="prose">
            <header>
              <p className="course-meta">{node.code}</p>
              <h1>{node.title}</h1>
              <p className="course-meta">
                {tree.children.length} units · {topics.length} official topics ·{" "}
                {written} with notes
              </p>
            </header>

            {tree.children.map((unit) => (
              <section key={unit.path} style={{ marginBottom: 28 }}>
                <h2
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 650,
                    margin: "0 0 10px",
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                  }}
                >
                  <span className="code">{unit.code}</span>
                  {unit.title}
                  {unit.hours && (
                    <span className="course-meta">
                      {Number(unit.hours)} hrs
                    </span>
                  )}
                </h2>

                <ul className="tree">
                  {unit.children.length === 0 && (
                    <li>
                      {/* A prose-format unit has no topic nodes. Saying so is
                          better than rendering an empty list that looks like a
                          bug. */}
                      <span className="rail-note">
                        This unit lists its contents as prose, so it has no separate topics.
                      </span>
                    </li>
                  )}
                  {unit.children.map((topic) =>
                    topic.shortId ? (
                      <li key={topic.path}>
                        <Link
                          href={`/learn/${course.toLowerCase()}/${topic.slug}-${topic.shortId}`}
                          
                        >
                          <span className="code">{topic.code}</span>
                          {topic.title}
                        </Link>
                      </li>
                    ) : (
                      <li key={topic.path}>
                        <span className="rail-note" title="No note yet">
                          <span className="code">{topic.code}</span>
                          {topic.title}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </section>
            ))}
          </article>
        </main>
      </div>
    </>
  );
}
