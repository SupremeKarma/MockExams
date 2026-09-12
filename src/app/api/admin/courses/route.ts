import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireStaff } from "@/lib/examai/admin-auth";
import { deriveUnitId } from "@/lib/examai/syllabus-units";
import type { Course, Curriculum } from "@/lib/examai/types";

export const dynamic = "force-dynamic";

const CODE_RE = /^[A-Z0-9]{4,12}$/;
const CURRICULA: readonly Curriculum[] = ["new_course", "old_course"];

/** Courses for the admin workspace, grouped and sorted the way the UI wants them. */
export async function GET(request: NextRequest) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const snap = await adminDb.collection("courses").get();
    const courses = snap.docs
      .map((d: { data: () => Course }) => d.data())
      .sort((a: Course, b: Course) => a.semester - b.semester || a.code.localeCompare(b.code));

    return NextResponse.json({ courses }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("ExamAI course list failed:", err);
    return NextResponse.json({ error: "Could not load courses." }, { status: 500 });
  }
}

interface UnitInput {
  title: string;
}

/** Every unit needs a non-empty title; anything else about the request is rejected wholesale. */
export function parseUnits(raw: unknown): UnitInput[] | null {
  if (!Array.isArray(raw)) return null;
  const units: UnitInput[] = [];
  for (const entry of raw) {
    const title = typeof (entry as { title?: unknown })?.title === "string"
      ? (entry as { title: string }).title.trim()
      : "";
    if (!title) return null;
    units.push({ title });
  }
  return units;
}

export async function POST(request: NextRequest) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const code = String(body.code ?? "").trim().toUpperCase();
  const name = String(body.name ?? "").trim();
  const semester = Number(body.semester);
  const programId = String(body.programId ?? "BIT").trim().toUpperCase();
  const credits = Number(body.credits ?? 3);
  const curriculum = body.curriculum as Curriculum;
  const units = parseUnits(body.syllabusUnits ?? []);

  if (!CODE_RE.test(code)) {
    return NextResponse.json(
      { error: "Course code must be 4-12 uppercase letters/digits, e.g. BIT253CO." },
      { status: 400 }
    );
  }
  if (!name) return NextResponse.json({ error: "Course name is required." }, { status: 400 });
  if (!Number.isInteger(semester) || semester < 1 || semester > 8) {
    return NextResponse.json({ error: "Semester must be between 1 and 8." }, { status: 400 });
  }
  if (!Number.isFinite(credits) || credits <= 0) {
    return NextResponse.json({ error: "Credits must be a positive number." }, { status: 400 });
  }
  if (!CURRICULA.includes(curriculum)) {
    return NextResponse.json({ error: "Curriculum must be new_course or old_course." }, { status: 400 });
  }
  if (units === null) {
    return NextResponse.json({ error: "Every syllabus unit needs a title." }, { status: 400 });
  }

  const ref = adminDb.collection("courses").doc(code);
  const existing = await ref.get();
  if (existing.exists) {
    return NextResponse.json(
      { error: `${code} already exists. Edit it instead of creating it again.` },
      { status: 409 }
    );
  }

  const course: Course = {
    code,
    name,
    semester,
    programId,
    credits,
    curriculum,
    // unitId is DERIVED from position, never taken from the request — it is
    // the vocabulary extraction tags questions with (see
    // examai-api/app/syllabus/tagging.py). A hand-typed id that does not match
    // "{CODE}_U{NN}" would validate here and then silently never resolve to a
    // spine node.
    syllabusUnits: units.map((u, i) => ({ unitId: deriveUnitId(code, i), title: u.title })),
  };

  await ref.set(course);
  return NextResponse.json({ course });
}
