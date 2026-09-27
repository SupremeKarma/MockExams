import { notFound, permanentRedirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import type { Metadata } from "next";

import { renderDocument } from "@examai/content";
import {
  getAdjacentTopics,
  getAncestors,
  getCourseTree,
  getDocumentByShortId,
  getNode,
  getSections,
  slugify,
} from "@/lib/examai/reader";
import { getAskedIn } from "@/lib/examai/asked-in";
import { getReaderUser } from "@/lib/examai/reader-auth";
import { ReaderShell } from "@/components/reader/ReaderShell";
import {
  COOKIE_NAME,
  looksLikeTv,
  parseReadingCookie,
} from "@/lib/examai/reading-settings";

// Server-rendered on purpose: the article text must be in the HTML with no
// JavaScript, both because the free preview is meant to rank and because a
// student on a slow connection should see it before the bundle arrives. Only
// the level-1 section (the `idea` block and anything else written directly
// under the H1) renders this way for a signed-out request — see the gating
// below, and docs/blueprint.md §13 for why that split is exactly the
// free/paid line the product draws.
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ course: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * URLs are `/learn/{course}/{topic-slug}-{shortId}`.
 *
 * The short id is what resolves; the slug is human-facing decoration. That
 * split means a retitled note keeps working on old links, and it is also why a
 * mismatched slug redirects rather than 404s — the link is valid, just stale.
 */
function splitSlug(slug: string): { slugPart: string; shortId: string } | null {
  const index = slug.lastIndexOf("-");
  if (index <= 0) return null;
  return { slugPart: slug.slice(0, index), shortId: slug.slice(index + 1) };
}

async function load(params: PageProps["params"]) {
  const { course, slug } = await params;
  const parts = splitSlug(slug);
  if (!parts) notFound();

  const document = await getDocumentByShortId(parts.shortId);
  if (!document) notFound();

  const node = await getNode(document.node_uuid);
  if (!node) notFound();

  return { course, slug, parts, document, node };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { document, node } = await load(params);
  return {
    title: `${document.title} · ${node.code ?? ""} · ExamAI`,
    description: `Beginner-friendly notes for ${node.code ?? ""} ${document.title}.`,
  };
}

export default async function TopicPage({ params, searchParams }: PageProps) {
  const { course, parts, document, node } = await load(params);

  const canonicalSlug = slugify(document.title);
  if (parts.slugPart !== canonicalSlug) {
    // The note was retitled. The link still identifies the right page, so send
    // the reader on rather than showing them a 404 for a link that works.
    permanentRedirect(`/learn/${course}/${canonicalSlug}-${parts.shortId}`);
  }

  const ancestors = await getAncestors(node.path);
  const coursePath = ancestors.find((a) => a.kind === "course")?.path ?? node.path;

  // Extraction tags questions at unit granularity, not topic — see
  // src/lib/examai/asked-in.ts — so a unit-level "asked in" question surfaces
  // on every topic page beneath it via the containing unit's uuid.
  const unitUuid = ancestors.find((a) => a.kind === "unit")?.uuid;
  const askedInNodeUuids = unitUuid ? [node.uuid, unitUuid] : [node.uuid];

  const [sections, tree, adjacent, askedIn, reader] = await Promise.all([
    getSections(document.version_uuid),
    getCourseTree(coursePath),
    getAdjacentTopics(coursePath, node.path),
    getAskedIn(askedInNodeUuids),
    getReaderUser(),
  ]);

  // The free preview is the level-1 section: whatever sits directly under the
  // H1, before the first H2 — which by the authoring convention (see
  // packages/content/src/types.ts's ALLOWED_BLOCKS and docs/DESIGN.md §5) is
  // exactly the `idea` block. Everything past the first H2 is gated. This
  // needs no new metadata: the split the business model wants already exists
  // in how documents are structured for the outline.
  const gated = reader === null;
  const visibleSections = gated ? sections.filter((s) => s.level === 1) : sections;

  const [cookieStore, headerList, query] = await Promise.all([
    cookies(),
    headers(),
    searchParams,
  ]);
  const stored = parseReadingCookie(cookieStore.get(COOKIE_NAME)?.value);

  // `?view=tv` is the shareable way into TV view — a student casting a link to
  // the living-room screen should not have to find a settings toggle with a
  // remote. It also moves Paper to Blackboard, per the TV guidance to prefer
  // light text on dark.
  const settings =
    query.view === "tv"
      ? {
          ...stored,
          viewing: "tv" as const,
          theme: stored.theme === null || stored.theme === "paper" ? ("blackboard" as const) : stored.theme,
        }
      : stored;

  // Rebuild the body from the stored sections rather than the version's raw
  // markdown. The sections are what was derived at publish time, so rendering
  // from them guarantees the page matches the outline and the anchors exactly.
  //
  // The H1's heading is dropped: the page header already renders the title, and
  // emitting it again here would print it twice. Its BODY is kept, because the
  // `idea` block sits under the H1 and is the first thing a student reads.
  const body = visibleSections
    .map((s) =>
      s.level === 1 ? s.body_md : `${"#".repeat(s.level)} ${s.heading}\n\n${s.body_md}`
    )
    .join("\n\n");

  const { html } = renderDocument(
    body,
    // The full section list, not just visibleSections: an anchor id it does
    // not find a heading for is simply unused, and this keeps the map correct
    // if a signed-in reader's later request renders the same html generator.
    sections.map((s) => ({ heading: s.heading, anchor: s.anchor })),
    { mode: settings.mode }
  );

  // Reading time from what is actually shown — a signed-out visitor's "About
  // 1 minute" should describe the preview they can see, not the full note.
  const words = visibleSections.reduce((n, s) => n + s.body_md.split(/\s+/).length, 0);
  const readingMinutes = Math.max(1, Math.round(words / 200));

  const canonicalPath = `/learn/${course}/${canonicalSlug}-${parts.shortId}`;

  return (
    <ReaderShell
      courseCode={course.toUpperCase()}
      document={document}
      node={node}
      ancestors={ancestors}
      sections={sections}
      tree={tree}
      adjacent={adjacent}
      articleHtml={html}
      askedIn={askedIn}
      settings={settings}
      tvSuggested={looksLikeTv(headerList.get("user-agent"))}
      readingMinutes={readingMinutes}
      gated={gated}
      signInHref={`/login?next=${encodeURIComponent(canonicalPath)}`}
      watermarkLabel={reader?.email ?? null}
    />
  );
}
