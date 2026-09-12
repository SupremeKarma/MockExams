/**
 * Emit the syllabus unit vocabulary that question tagging maps onto.
 *
 * Generated from src/data/bitSyllabusData.ts rather than hand-typed, so the
 * tagging vocabulary cannot drift from the syllabus the app already shows
 * students. Re-run whenever the syllabus data changes.
 *
 *   node scripts/dump-syllabus-units.ts            # all semesters
 *   node scripts/dump-syllabus-units.ts 6          # one semester
 *
 * Writes examai-ingest/schema/units.sem<N>.json
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { bitSyllabusData } from "../src/data/bitSyllabusData";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(HERE, "..", "examai-ingest", "schema");

/** Stable, human-readable unit id: <SUBJECT>_U<NN>. Position-derived, so
 *  reordering keyUnits renumbers — treat the syllabus array order as the
 *  contract, and never renumber after questions have been tagged. */
function unitId(subjectCode: string, index: number): string {
    return `${subjectCode}_U${String(index + 1).padStart(2, "0")}`;
}

const wanted = process.argv[2] ? Number(process.argv[2]) : null;

mkdirSync(OUT_DIR, { recursive: true });

for (const sem of bitSyllabusData) {
    if (wanted !== null && sem.semester !== wanted) continue;

    const subjects = sem.subjects
        // Project/practical papers have no written exam to extract questions from.
        .filter((s) => s.type !== "Project / Practical")
        .map((s) => ({
            subject_code: s.code,
            subject_name: s.name,
            credits: s.credits,
            units: s.keyUnits.map((u, i) => ({ unit_id: unitId(s.code, i), title: u })),
        }));

    const payload = {
        semester: sem.semester,
        generated_from: "src/data/bitSyllabusData.ts",
        subject_count: subjects.length,
        unit_count: subjects.reduce((n, s) => n + s.units.length, 0),
        subjects,
    };

    const out = path.join(OUT_DIR, `units.sem${sem.semester}.json`);
    writeFileSync(out, JSON.stringify(payload, null, 2) + "\n", "utf-8");
    console.log(
        `sem ${sem.semester}: ${payload.subject_count} subjects, ` +
        `${payload.unit_count} units -> ${path.relative(process.cwd(), out)}`,
    );
}
