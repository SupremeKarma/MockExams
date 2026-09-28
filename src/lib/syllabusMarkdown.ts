import { bitSyllabusData, SubjectInfo } from "@/data/bitSyllabusData";
import { globalSyllabusCourses, globalPrograms, GlobalCourse } from "@/data/globalSyllabusData";

export interface ExaminationScheme {
  theoryHours: number;
  tutorialHours: number;
  practicalHours: number;
  totalHours: number;
  internalTheory: number;
  internalPractical: number;
  finalTheory: number;
  finalPractical: number;
  totalMarks: number;
}

/**
 * Returns authentic examination and teaching scheme for a given course code.
 * Grounded in Purbanchal University & standard university academic regulations.
 */
export function getCourseExaminationScheme(code: string, credits: number = 3): ExaminationScheme {
  const upper = code.toUpperCase();

  // Project courses
  if (upper === "BIT453CO" || upper.includes("APPRENTICE")) {
    return {
      theoryHours: 0,
      tutorialHours: 0,
      practicalHours: 3,
      totalHours: 6,
      internalTheory: 0,
      internalPractical: 60,
      finalTheory: 0,
      finalPractical: 40,
      totalMarks: 100,
    };
  }

  // Internship
  if (upper === "BIT403CO" || upper.includes("INTERNSHIP")) {
    return {
      theoryHours: 0,
      tutorialHours: 0,
      practicalHours: 0,
      totalHours: 45,
      internalTheory: 40,
      internalPractical: 0,
      finalTheory: 60,
      finalPractical: 0,
      totalMarks: 100,
    };
  }

  // Pure Theory subjects (like Digital Governance, Society and Ethics, Management)
  if (
    upper === "BIT402CO" ||
    upper === "BIT451MS" ||
    upper === "BIT104HS" ||
    upper.endsWith("HS") ||
    upper === "BIT428CO" ||
    upper === "BIT485CO" ||
    upper === "BIT486CO" ||
    upper === "BIT487CO"
  ) {
    return {
      theoryHours: 3,
      tutorialHours: 1,
      practicalHours: 0,
      totalHours: 4,
      internalTheory: 20,
      internalPractical: 0,
      finalTheory: 80,
      finalPractical: 0,
      totalMarks: 100,
    };
  }

  // Standard Engineering / CS courses with Laboratory (Theory 80 + Practical 50 + Internal 20 = 150)
  return {
    theoryHours: 3,
    tutorialHours: 1,
    practicalHours: 2,
    totalHours: 6,
    internalTheory: 20,
    internalPractical: 50,
    finalTheory: 80,
    finalPractical: 0,
    totalMarks: 150,
  };
}

/**
 * Generates an official, beautifully formatted Markdown (.md) representation of a single course syllabus.
 */
export function generateCourseMarkdown(course: {
  code: string;
  name: string;
  programName?: string;
  semester?: number;
  credits: number;
  description: string;
  learningOutcomes?: string[];
  prerequisites?: string[];
  syllabusUnits?: Array<{
    title: string;
    teachingHours?: number;
    subtopics?: string[];
  }>;
  keyUnits?: string[];
  labWork?: string[];
  referenceBooks?: string[];
}): string {
  const scheme = getCourseExaminationScheme(course.code, course.credits);
  const units =
    course.syllabusUnits ||
    (course.keyUnits || []).map((u, i) => ({
      title: u,
      teachingHours: Math.round(45 / Math.max(1, (course.keyUnits || []).length)),
      subtopics: [u],
    }));

  const lines: string[] = [];

  lines.push(`# ${course.name} (${course.code})`);
  lines.push(`**Program**: ${course.programName || "Purbanchal University B.I.T."} | **Semester**: ${course.semester || "N/A"} | **Credits**: ${course.credits}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 1. Teaching Schedule & Examination Scheme (ESE)");
  lines.push("");
  lines.push("| Component | Lecture (L) | Tutorial (T) | Practical (P) | Total Hours/Week | Internal Assessment | End Semester Exam (Final) | Total Marks |");
  lines.push("| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |");
  lines.push(
    `| **Hours / Marks** | ${scheme.theoryHours} Hrs | ${scheme.tutorialHours} Hrs | ${scheme.practicalHours} Hrs | **${scheme.totalHours} Hrs** | Theory: ${scheme.internalTheory}, Lab: ${scheme.internalPractical} | Theory: ${scheme.finalTheory}, Lab: ${scheme.finalPractical} | **${scheme.totalMarks}** |`
  );
  lines.push("");
  lines.push("### Evaluation Breakdown:");
  lines.push(`- **Continuous Internal Assessment**: ${scheme.internalTheory + scheme.internalPractical} Marks (${scheme.internalTheory} Theory + ${scheme.internalPractical} Practical/Lab)`);
  lines.push(`- **End Semester Final Examination (ESE)**: ${scheme.finalTheory + scheme.finalPractical} Marks (${scheme.finalTheory} Theory + ${scheme.finalPractical} Practical/Defense)`);
  lines.push(`- **Total Marks for Course**: **${scheme.totalMarks} Marks**`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 2. Course Description & Objectives");
  lines.push("");
  lines.push(`${course.description}`);
  lines.push("");
  if (course.learningOutcomes && course.learningOutcomes.length > 0) {
    lines.push("### Course Learning Outcomes (CLOs):");
    course.learningOutcomes.forEach((lo) => {
      lines.push(`- ${lo}`);
    });
    lines.push("");
  }
  if (course.prerequisites && course.prerequisites.length > 0) {
    lines.push(`**Prerequisites**: ${course.prerequisites.join(", ")}`);
    lines.push("");
  }
  lines.push("---");
  lines.push("");
  lines.push("## 3. Detailed Syllabus Chapters & Teaching Units");
  lines.push("");

  units.forEach((unit, idx) => {
    const hoursStr = unit.teachingHours ? ` [${unit.teachingHours} Hours]` : "";
    lines.push(`### Unit ${idx + 1}: ${unit.title}${hoursStr}`);
    if (unit.subtopics && unit.subtopics.length > 0) {
      unit.subtopics.forEach((st, sIdx) => {
        lines.push(`- **Topic ${idx + 1}.${sIdx + 1}**: ${st}`);
      });
    }
    lines.push("");
  });

  if (course.labWork && course.labWork.length > 0) {
    lines.push("---");
    lines.push("");
    lines.push("## 4. Laboratory & Practical Guidelines");
    lines.push("");
    course.labWork.forEach((item, lIdx) => {
      if (/^\d+\./.test(item.trim())) {
        lines.push(item);
      } else {
        lines.push(`${lIdx + 1}. ${item}`);
      }
    });
    lines.push("");
  } else if (scheme.practicalHours > 0) {
    lines.push("---");
    lines.push("");
    lines.push("## 4. Laboratory & Practical Guidelines");
    lines.push("");
    lines.push("Students are required to perform hands-on lab experiments matching each unit's syllabus content:");
    lines.push("1. Comprehensive setup of laboratory runtime and tooling environment.");
    lines.push("2. Implementation and execution of standard algorithms and models.");
    lines.push("3. Verification and test evaluation with documented log outputs.");
    lines.push("4. Preparation and submission of an individualized Laboratory Report notebook.");
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push("## 5. Reference Textbooks & Materials");
  lines.push("");
  if (course.referenceBooks && course.referenceBooks.length > 0) {
    course.referenceBooks.forEach((book, bIdx) => {
      if (/^\d+\./.test(book.trim())) {
        lines.push(book);
      } else {
        lines.push(`${bIdx + 1}. ${book}`);
      }
    });
  } else {
    lines.push("1. Prescribed University Syllabus Textbooks and Academic Reference Manuals.");
    lines.push("2. Official Standard Specifications and Industry Standard Guidelines.");
    lines.push("3. Relevant Research Papers, Technical Documentation, and Laboratory Manuals.");
  }
  lines.push("");

  return lines.join("\n");
}

/**
 * Generates official Markdown (.md) representation of a whole semester curriculum.
 */
export function generateSemesterMarkdown(programId: string, semesterNum: number): string {
  if (programId === "PU_BIT") {
    const sem = bitSyllabusData.find((s) => s.semester === semesterNum);
    if (!sem) return `# Semester ${semesterNum} Not Found`;

    const lines: string[] = [];
    lines.push(`# Purbanchal University — Faculty of Science & Technology`);
    lines.push(`## Bachelor in Information Technology (BIT)`);
    lines.push(`### Semester ${semesterNum} Official Syllabus Curriculum`);
    lines.push("");
    lines.push(`**Total Semester Credits**: ${sem.totalCredits} | **Total Listed Courses**: ${sem.subjects.length}`);
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push("## Semester Course Structure & Examination Scheme (ESE)");
    lines.push("");
    lines.push("| Course Code | Course Title | Type | Credits | Lecture (Hrs) | Tutorial (Hrs) | Practical (Hrs) | Total Hrs/Wk | Internal Marks | Final ESE Marks | Total Marks |");
    lines.push("| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |");

    sem.subjects.forEach((sub) => {
      const sch = getCourseExaminationScheme(sub.code, sub.credits);
      lines.push(
        `| **${sub.code}** | ${sub.name} | ${sub.type} | ${sub.credits} | ${sch.theoryHours} | ${sch.tutorialHours} | ${sch.practicalHours} | ${sch.totalHours} | ${sch.internalTheory + sch.internalPractical} | ${sch.finalTheory + sch.finalPractical} | **${sch.totalMarks}** |`
      );
    });

    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push("## Detailed Course Syllabi");
    lines.push("");

    sem.subjects.forEach((sub) => {
      lines.push(
        generateCourseMarkdown({
          code: sub.code,
          name: sub.name,
          programName: "Purbanchal University BIT",
          semester: semesterNum,
          credits: sub.credits,
          description: sub.description,
          keyUnits: sub.keyUnits,
          syllabusUnits: sub.syllabusUnits,
          labWork: sub.labWork,
          referenceBooks: sub.referenceBooks,
        })
      );
      lines.push("");
      lines.push("---");
      lines.push("");
    });
    return lines.join("\n");
  }

  // Global Program Fallback
  const progCourses = globalSyllabusCourses.filter((c) => c.programId === programId);
  const progMeta = globalPrograms.find((p) => p.id === programId);

  const lines: string[] = [];
  lines.push(`# ${progMeta?.name || programId}`);
  lines.push(`**Organization**: ${progMeta?.organization || ""} | **Country**: ${progMeta?.country || ""}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Curriculum Overview & Courses");
  lines.push("");

  progCourses.forEach((c) => {
    lines.push(generateCourseMarkdown(c));
    lines.push("");
    lines.push("---");
    lines.push("");
  });

  return lines.join("\n");
}

/**
 * Generates official Markdown (.md) representation of an entire degree curriculum.
 */
export function generateProgramMarkdown(programId: string): string {
  if (programId === "PU_BIT") {
    let md = "# Purbanchal University — Faculty of Science & Technology\n## Bachelor in Information Technology (BIT)\n### Complete 8-Semester Curriculum & Examination Scheme\n\n";
    for (const sem of bitSyllabusData) {
      md += generateSemesterMarkdown("PU_BIT", sem.semester);
      md += "\n\n---\n\n";
    }
    return md;
  }
  return generateSemesterMarkdown(programId, 1);
}
