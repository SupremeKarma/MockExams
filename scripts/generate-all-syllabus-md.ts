import fs from "fs";
import path from "path";
import { bitSyllabusData } from "../src/data/bitSyllabusData";
import { generateCourseMarkdown, generateSemesterMarkdown } from "../src/lib/syllabusMarkdown";

const publicDir = path.resolve("./public/syllabus");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate for all semesters (1-8)
for (const sem of bitSyllabusData) {
  const semDir = path.join(publicDir, `semester-${sem.semester}`);
  if (!fs.existsSync(semDir)) {
    fs.mkdirSync(semDir, { recursive: true });
  }

  // Generate full semester markdown
  const fullSemMd = generateSemesterMarkdown("PU_BIT", sem.semester);
  fs.writeFileSync(path.join(publicDir, `PU_BIT_Semester_${sem.semester}.md`), fullSemMd, "utf8");

  // Generate individual course markdown files
  for (const sub of sem.subjects) {
    const courseMd = generateCourseMarkdown({
      code: sub.code,
      name: sub.name,
      programName: "Purbanchal University B.I.T.",
      semester: sem.semester,
      credits: sub.credits,
      description: sub.description,
      keyUnits: sub.keyUnits,
      syllabusUnits: sub.syllabusUnits,
      labWork: sub.labWork,
      referenceBooks: sub.referenceBooks,
    });

    // 1. Direct course code filename (e.g., BIT401CO.md)
    fs.writeFileSync(path.join(publicDir, `${sub.code}.md`), courseMd, "utf8");

    // 2. Semester-specific descriptive filename
    const safeName = sub.name.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_");
    fs.writeFileSync(path.join(semDir, `${sub.code}_${safeName}.md`), courseMd, "utf8");
    fs.writeFileSync(path.join(semDir, `${sub.code}.md`), courseMd, "utf8");
  }
  console.log(`Generated Semester ${sem.semester} (${sem.subjects.length} courses)`);
}

console.log("All syllabus markdown files generated successfully!");
