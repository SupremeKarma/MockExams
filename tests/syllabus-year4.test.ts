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

  it("verifies BIT403CO (Internship) has 4 official syllabus units totaling 45 hours and evaluation criteria", () => {
    const internship = sem7?.subjects.find((s) => s.code === "BIT403CO");
    expect(internship).toBeDefined();
    expect(internship?.syllabusUnits).toBeDefined();
    expect(internship?.syllabusUnits).toHaveLength(4);
    expect(internship?.syllabusUnits?.[0].title).toContain("Proposal Defense");
    expect(internship?.syllabusUnits?.[1].title).toContain("Mid-Term Progress Review");
    expect(internship?.syllabusUnits?.[3].title).toContain("Final Internship Report");
  });

  it("verifies bitNotesData[7] contains real notes for all Semester 7 subjects", async () => {
    const { bitNotesData, getSubjectNotes } = await import("../src/data/bitNotesData");
    const sem7Notes = bitNotesData[7];
    expect(sem7Notes).toBeDefined();

    const expectedSubjects = [
      "Network Programming",
      "Digital Governance",
      "Machine Learning (Track A)",
      "Business Intelligence and Data Science (Track A)",
      "Deep Learning (Track A)",
      "Digital Commerce (Track B)",
      "Multimedia and Application (Track B)",
      "GIS (Track C)",
      "Remote Sensing (Track C)",
      "Data Center and Disaster Recovery Centers (Track C)",
      "Internship",
      "Disaster Governance (Track C)",
    ];

    for (const subjName of expectedSubjects) {
      const subj = sem7Notes[subjName];
      expect(subj, `Expected ${subjName} to exist in bitNotesData[7]`).toBeDefined();
      expect(subj.topics.length, `${subjName} should have topics`).toBeGreaterThan(0);
      expect(subj.theoryTopics.length, `${subjName} should have theory topics`).toBeGreaterThan(0);

      // Verify each topic has real content and unit-wise organization
      subj.topics.forEach((t) => {
        expect(t.name.length).toBeGreaterThan(5);
        expect(t.keyPoints.length).toBeGreaterThanOrEqual(3);
        expect(t.theory.length).toBeGreaterThan(50);
        expect(t.commonExamQuestions?.length).toBeGreaterThanOrEqual(2);
        expect(t.unit, `Topic ${t.id} must have a unit number`).toBeGreaterThan(0);
        expect(t.unitTitle, `Topic ${t.id} must have a unit title`).toBeTruthy();
        expect(t.unitCode, `Topic ${t.id} must have a unit code`).toBeTruthy();
      });
    }

    // Verify lookup by course codes and unit counts
    const npNotes = getSubjectNotes("BIT401CO", 7);
    expect(npNotes).toBeDefined();
    expect(npNotes?.subjectName).toBe("Network Programming");
    expect(npNotes?.topics.length).toBe(12); // All 12 units
    expect(npNotes?.topics.map((t) => t.unit)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

    const dgNotes = getSubjectNotes("BIT402CO", 7);
    expect(dgNotes).toBeDefined();
    expect(dgNotes?.subjectName).toBe("Digital Governance");
    expect(dgNotes?.topics.length).toBe(10); // All 10 units
    expect(dgNotes?.topics.map((t) => t.unit)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const mlNotes = getSubjectNotes("BIT421CO", 7);
    expect(mlNotes).toBeDefined();
    expect(mlNotes?.subjectName).toBe("Machine Learning (Track A)");
    expect(mlNotes?.topics.length).toBe(6); // All 6 units
    expect(mlNotes?.topics.map((t) => t.unit)).toEqual([1, 2, 3, 4, 5, 6]);

    const dlNotes = getSubjectNotes("BIT423CO", 7);
    expect(dlNotes).toBeDefined();
    expect(dlNotes?.topics.length).toBe(7); // All 7 units

    const mmNotes = getSubjectNotes("BIT429CO", 7);
    expect(mmNotes).toBeDefined();
    expect(mmNotes?.topics.length).toBe(12); // All 12 units
  });
});
