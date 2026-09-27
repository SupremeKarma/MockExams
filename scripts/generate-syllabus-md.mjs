import fs from "fs";
import path from "path";
import { bitSyllabusData } from "../src/data/bitSyllabusData.ts";

const outDir = path.resolve("./public/syllabus");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generate semester markdown files
for (const sem of bitSyllabusData) {
  let md = `# Purbanchal University — Faculty of Science & Technology\n`;
  md += `## Bachelor in Information Technology (BIT)\n`;
  md += `### Semester ${sem.semester} Official Curriculum & ESE Examination Scheme\n\n`;
  md += `**Total Semester Credits**: ${sem.totalCredits} | **Total Listed Courses**: ${sem.subjects.length}\n\n`;
  md += `| Course Code | Course Title | Type | Credits | Total Marks |\n`;
  md += `| :--- | :--- | :---: | :---: | :---: |\n`;
  for (const s of sem.subjects) {
    const isLab = !s.name.includes("Society") && !s.name.includes("Technical Communication") && !s.name.includes("Digital Governance");
    const totalMarks = s.name.includes("Project") || s.name.includes("Internship") ? 100 : (isLab ? 150 : 100);
    md += `| **${s.code}** | ${s.name} | ${s.type} | ${s.credits} | ${totalMarks} |\n`;
  }
  md += `\n---\n\n## Detailed Course Outlines\n\n`;
  for (const s of sem.subjects) {
    md += `### ${s.name} (${s.code})\n`;
    md += `**Credits**: ${s.credits} | **Type**: ${s.type}\n\n`;
    md += `${s.description}\n\n`;
    md += `#### Key Syllabus Units:\n`;
    s.keyUnits.forEach((u, i) => {
      md += `${i + 1}. **${u}**\n`;
    });
    md += `\n---\n\n`;
  }

  const filePath = path.join(outDir, `PU_BIT_Semester_${sem.semester}.md`);
  fs.writeFileSync(filePath, md, "utf8");
  console.log(`Generated: ${filePath}`);
}

console.log("All semester markdown files created successfully!");
