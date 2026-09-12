/**
 * `{COURSE}_U{NN}` — the unit id vocabulary extraction tags questions with.
 *
 * Position-derived: NN is the unit's 1-indexed position among a course's
 * syllabus units, never the printed unit number. It only has to agree with
 * itself — examai-api/app/syllabus/tagging.py resolves a tag back to the
 * spine by rebuilding the same course-path + unit-number path, trusting NN to
 * mean "the Nth unit in this course's list."
 *
 * Treat the array order as the contract: reordering or deleting a unit after
 * questions have been tagged against it silently renumbers every unit after
 * it, and the old tags on those questions stop resolving to anything. See
 * scripts/dump-syllabus-units.ts and src/app/api/admin/courses/ for the two
 * places that write this vocabulary.
 */
export function deriveUnitId(courseCode: string, index: number): string {
  return `${courseCode.toUpperCase()}_U${String(index + 1).padStart(2, "0")}`;
}
