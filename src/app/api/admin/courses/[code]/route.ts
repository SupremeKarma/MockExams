import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireStaff } from "@/lib/examai/admin-auth";
import { deriveUnitId } from "@/lib/examai/syllabus-units";
import type { Course, Curriculum } from "@/lib/examai/types";
import { parseUnits } from "../route";

export const dynamic = "force-dynamic";

const CURRICULA: readonly Curriculum[] = ["new_course", "old_course"];

interface Params {
  params: Promise<{ code: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const { code } = await params;
  const snap = await adminDb.collection("courses").doc(code.toUpperCase()).get();
  if (!snap.exists) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json({ course: snap.data() });
}

/**
 * Update a course.
 *
 * `code` is the document id and is never editable here — changing it would
 * mean every paper filed under the old code (Paper.courseId) silently points
 * at a course that no longer exists. Retiring a code and introducing a new
 * one is a create, not a rename.
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const { code } = await params;
  const ref = adminDb.collection("courses").doc(code.toUpperCase());
  const existing = await ref.get();
  if (!existing.exists) return NextResponse.json({ error: "Not found." }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const current = existing.data() as Course;
  const name = String(body.name ?? current.name).trim();
  const semester = Number(body.semester ?? current.semester);
  const credits = Number(body.credits ?? current.credits);
  const curriculum = (body.curriculum ?? current.curriculum) as Curriculum;
  const units = parseUnits(
    body.syllabusUnits ?? current.syllabusUnits.map((u) => ({ title: u.title }))
  );

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

  const updated: Course = {
    ...current,
    name,
    semester,
    credits,
    curriculum,
    syllabusUnits: units.map((u, i) => ({ unitId: deriveUnitId(current.code, i), title: u.title })),
  };

  await ref.set(updated);
  return NextResponse.json({ course: updated });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const { code } = await params;
  await adminDb.collection("courses").doc(code.toUpperCase()).delete();
  return NextResponse.json({ deleted: true });
}
