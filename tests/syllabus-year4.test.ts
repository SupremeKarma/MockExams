import { describe, it, expect } from "vitest";
import { bitSyllabusData } from "../src/data/bitSyllabusData";
import { generateCourseMarkdown, generateSemesterMarkdown } from "../src/lib/syllabusMarkdown";

describe("Year IV BIT Syllabus Data & Markdown Rendering", () => {
  const sem7 = bitSyllabusData.find((s) => s.semester === 7);
  const sem8 = bitSyllabusData.find((s) => s.semester === 8);

  it("contains all 11 courses in Semester 7 and 10 courses in Semester 8", () => {
    expect(sem7).toBeDefined();
    expect(sem8).toBeDefined();
    expect(sem7?.subjects).toHaveLength(11);
    expect(sem8?.subjects).toHaveLength(10);
  });

  it("verifies BIT401CO (Network Programming) has 12 authentic units totaling 45 hours, lab work and references", () => {
    const netProg = sem7?.subjects.find((s) => s.code === "BIT401CO");
    expect(netProg).toBeDefined();
    expect(netProg?.syllabusUnits).toHaveLength(12);

    const totalHours = netProg?.syllabusUnits?.reduce((sum, u) => sum + (u.teachingHours || 0), 0);
    expect(totalHours).toBe(45);

    expect(netProg?.labWork).toBeDefined();
    expect(netProg?.labWork?.length).toBeGreaterThanOrEqual(6);
    expect(netProg?.labWork?.some((l) => l.includes("Pipe()") || l.includes("Fifo()"))).toBe(true);

    expect(netProg?.referenceBooks).toBeDefined();
    expect(netProg?.referenceBooks?.some((b) => b.includes("Unix Network Programming"))).toBe(true);

    const md = generateCourseMarkdown({
      code: netProg!.code,
      name: netProg!.name,
      programName: "Purbanchal University BIT",
      semester: 7,
      credits: netProg!.credits,
      description: netProg!.description,
      keyUnits: netProg!.keyUnits,
      syllabusUnits: netProg!.syllabusUnits,
      labWork: netProg!.labWork,
      referenceBooks: netProg!.referenceBooks,
    });

    expect(md).toContain("### Unit 1: Introduction to Network Programming [5 Hours]");
    expect(md).toContain("## 4. Laboratory & Practical Guidelines");
    expect(md).toContain("Pipe()");
    expect(md).toContain("## 5. Reference Textbooks & Materials");
    expect(md).toContain("Stevens, W. R.");
    // Confirm generic fallback is NOT rendered
    expect(md).not.toContain("Comprehensive setup of laboratory runtime and tooling environment");
  });

  it("verifies BIT421CO (Machine Learning) has 6 units totaling 45 hours and real references", () => {
    const ml = sem7?.subjects.find((s) => s.code === "BIT421CO");
    expect(ml).toBeDefined();
    expect(ml?.syllabusUnits).toHaveLength(6);

    const totalHours = ml?.syllabusUnits?.reduce((sum, u) => sum + (u.teachingHours || 0), 0);
    expect(totalHours).toBe(45);

    expect(ml?.labWork?.length).toBeGreaterThan(0);
    expect(ml?.referenceBooks?.some((b) => b.includes("Tom M.") || b.includes("Mitchell"))).toBe(true);

    const md = generateCourseMarkdown({
      code: ml!.code,
      name: ml!.name,
      programName: "Purbanchal University BIT",
      semester: 7,
      credits: ml!.credits,
      description: ml!.description,
      keyUnits: ml!.keyUnits,
      syllabusUnits: ml!.syllabusUnits,
      labWork: ml!.labWork,
      referenceBooks: ml!.referenceBooks,
    });

    expect(md).toContain("Supervised Learning [12 Hours]");
    expect(md).toContain("Deep Learning [11 Hours]");
  });

  it("verifies BIT451MS (Principles of Management and Entrepreneurship in IT) has 9 units and real references", () => {
    const mgt = sem8?.subjects.find((s) => s.code === "BIT451MS");
    expect(mgt).toBeDefined();
    expect(mgt?.syllabusUnits).toHaveLength(9);
    expect(mgt?.referenceBooks?.some((b) => b.includes("Koontz") || b.includes("Management"))).toBe(true);

    const md = generateCourseMarkdown({
      code: mgt!.code,
      name: mgt!.name,
      programName: "Purbanchal University BIT",
      semester: 8,
      credits: mgt!.credits,
      description: mgt!.description,
      keyUnits: mgt!.keyUnits,
      syllabusUnits: mgt!.syllabusUnits,
      labWork: mgt!.labWork,
      referenceBooks: mgt!.referenceBooks,
    });

    expect(md).toContain("The Foundation of Entrepreneurship [5 Hours]");
    expect(md).toContain("Koontz, Harold");
  });

  it("verifies generateSemesterMarkdown renders the complete semester syllabus without error", () => {
    const sem7Md = generateSemesterMarkdown("PU_BIT", 7);
    expect(sem7Md).toContain("Semester 7 Official Syllabus Curriculum");
    expect(sem7Md).toContain("BIT401CO");
    expect(sem7Md).toContain("BIT402CO");
    expect(sem7Md).toContain("BIT421CO");

    const sem8Md = generateSemesterMarkdown("PU_BIT", 8);
    expect(sem8Md).toContain("Semester 8 Official Syllabus Curriculum");
    expect(sem8Md).toContain("BIT451MS");
    expect(sem8Md).toContain("BIT471CO");
    expect(sem8Md).toContain("BIT479CO");
  });
});
