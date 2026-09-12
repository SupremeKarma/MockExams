import "server-only";

import { adminDb } from "@/lib/firebase-admin";
import { readQuery } from "./content-db";
import type { ExamType } from "./types";

// "Asked in" — which real exam questions map to a syllabus node.
//
// The link (question_ref -> node) lives in Postgres, written by the
// extraction pipeline (examai-api/app/syllabus/tagging.py). A question's
// actual text and its paper's publish status live in Firestore (Phase 2a —
// see docs/decisions/0001). Postgres's `published_question_topics` view only
// ever reveals that a question exists for a node, never its content — see
// examai-api/migrations/005_question_topics_view.sql — so the real gate
// ("never show a question from an unpublished paper") is enforced here,
// against Firestore, not assumed from the Postgres side.
//
// Extraction tags questions at UNIT granularity only (the vocabulary in
// examai-ingest/schema/units.sem*.json has no per-topic ids), while a Reader
// page is always a single topic. Querying the topic's own uuid alone would
// therefore never match anything real. The caller passes the topic's uuid
// plus its containing unit's uuid, and a unit-level tag surfaces on every
// topic beneath that unit — coarser than "asked about exactly this topic",
// but an honest reflection of the granularity extraction actually produces
// today. Narrow this once tagging reaches topic level.

export interface AskedInQuestion {
  paperId: string;
  qId: string;
  number: string;
  marks: number | null;
  courseId: string;
  year: number;
  examType: ExamType;
}

/** Groups qIds by paperId. `question_ref` is `"{paperId}/{qId}"` — see tagging.py. */
function groupByPaper(refs: string[]): Map<string, string[]> {
  const byPaper = new Map<string, string[]>();
  for (const question_ref of refs) {
    const slash = question_ref.indexOf("/");
    if (slash < 0) continue;
    const paperId = question_ref.slice(0, slash);
    const qId = question_ref.slice(slash + 1);
    const existing = byPaper.get(paperId);
    if (existing) existing.push(qId);
    else byPaper.set(paperId, [qId]);
  }
  return byPaper;
}

export async function getAskedIn(nodeUuids: string[]): Promise<AskedInQuestion[]> {
  if (nodeUuids.length === 0) return [];

  const links = await readQuery<{ question_ref: string }>(
    `SELECT DISTINCT question_ref
       FROM examai.published_question_topics
      WHERE node_uuid = ANY($1::uuid[])
      ORDER BY question_ref`,
    [nodeUuids]
  );
  if (links.length === 0) return [];

  const results: AskedInQuestion[] = [];

  for (const [paperId, qIds] of groupByPaper(links.map((l) => l.question_ref))) {
    const paperSnap = await adminDb.collection("papers").doc(paperId).get();
    if (!paperSnap.exists) continue;

    const paper = paperSnap.data() as {
      status?: string;
      courseId?: string;
      year?: number;
      examType?: ExamType;
    };
    // The one check that matters: an unreviewed extraction or an unverified
    // solution must never reach a student, and "published" is the only status
    // that means review is done. See docs/schema.md and firestore.rules.
    if (paper.status !== "published") continue;

    const questionRefs = qIds.map((qId) =>
      adminDb.collection("papers").doc(paperId).collection("questions").doc(qId)
    );
    const snaps = await adminDb.getAll(...questionRefs);

    for (const snap of snaps) {
      if (!snap.exists) continue;
      const q = snap.data() as { number?: string; marks?: number | null };
      results.push({
        paperId,
        qId: snap.id,
        number: q.number ?? snap.id,
        marks: q.marks ?? null,
        courseId: paper.courseId ?? "",
        year: paper.year ?? 0,
        examType: paper.examType ?? "regular",
      });
    }
  }

  // Newest first — the most recent appearance is the most useful signal for
  // "is this still asked".
  results.sort((a, b) => b.year - a.year || a.number.localeCompare(b.number));
  return results;
}
