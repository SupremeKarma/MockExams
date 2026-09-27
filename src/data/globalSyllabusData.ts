/**
 * Global Academic Syllabus Repository & Catalog
 *
 * Single Source of Truth driven by globalSyllabus.json
 * Grounded curricula benchmarked against:
 *  - Tribhuvan University (TU) Institute of Science and Technology (B.Sc. CSIT)
 *  - Cambridge Assessment International Education (CAIE A-Levels: 9618, 9709, 9702, 9701)
 *  - ACM / IEEE-CS / AAAI Joint Computing Curricula (CS2023 & CC2020)
 *  - US College Board Advanced Placement (AP Computer Science A, AP Calculus BC, AP Physics C)
 *  - GATE (Graduate Aptitude Test in Engineering, Computer Science & IT)
 */

import globalData from "./globalSyllabus.json";

export interface GlobalCourseUnit {
  unitId: string;
  title: string;
  teachingHours?: number;
  subtopics: string[];
}

export interface GlobalCourse {
  code: string;
  name: string;
  programId: string;
  programName: string;
  level: "Pre-University" | "Undergraduate" | "Graduate / Competitive" | string;
  category: "Computer Science" | "Mathematics" | "Physics" | "Chemistry" | "Software Engineering" | "Artificial Intelligence" | string;
  credits: number;
  semester?: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  learningOutcomes: string[];
  prerequisites: string[];
  syllabusUnits: GlobalCourseUnit[];
}

export interface GlobalProgram {
  id: string;
  name: string;
  organization: string;
  country: string;
  flag: string;
  level: string;
  description: string;
  totalCourses: number;
}

const PROGRAM_METAS: Record<string, { programName: string; level: string; organization: string }> = {
  TU_CSIT: {
    programName: "B.Sc. CSIT (Tribhuvan University)",
    level: "Undergraduate (4 Years / 8 Semesters)",
    organization: "Tribhuvan University (IOST)",
  },
  CAMBRIDGE_A_LEVELS: {
    programName: "Cambridge International AS & A Level (CAIE)",
    level: "Pre-University / Advanced Secondary",
    organization: "Cambridge Assessment International Education (CAIE)",
  },
  ACM_CS2023: {
    programName: "ACM / IEEE-CS Global Standard CS",
    level: "Undergraduate Core Curricula",
    organization: "Association for Computing Machinery & IEEE Computer Society",
  },
  US_AP: {
    programName: "College Board Advanced Placement (AP STEM)",
    level: "High School Advanced / College Equivalent",
    organization: "The College Board (USA)",
  },
  GATE_CS: {
    programName: "GATE Computer Science & IT (IISc & IITs)",
    level: "Graduate / Competitive Engineering",
    organization: "Indian Institute of Science (IISc) & IITs",
  },
};

function determineCategory(code: string, name: string): string {
  const upper = (code + " " + name).toUpperCase();
  if (upper.includes("MATH") || upper.includes("CALCULUS") || upper.includes("9709") || upper.includes("DISCRETE")) {
    return "Mathematics";
  }
  if (upper.includes("PHYSICS") || upper.includes("9702")) {
    return "Physics";
  }
  if (upper.includes("CHEMISTRY") || upper.includes("9701")) {
    return "Chemistry";
  }
  if (upper.includes("AI") || upper.includes("ARTIFICIAL INTELLIGENCE") || upper.includes("MACHINE LEARNING")) {
    return "Artificial Intelligence";
  }
  if (upper.includes("SOFTWARE") || upper.includes("SECURITY") || upper.includes("DEFENSIVE")) {
    return "Software Engineering";
  }
  return "Computer Science";
}

function determineLevel(programId: string): "Pre-University" | "Undergraduate" | "Graduate / Competitive" {
  if (programId === "CAMBRIDGE_A_LEVELS" || programId === "US_AP") return "Pre-University";
  if (programId === "GATE_CS") return "Graduate / Competitive";
  return "Undergraduate";
}

export const globalSyllabusCourses: GlobalCourse[] = globalData.courses.map((c: any) => {
  const meta = PROGRAM_METAS[c.programId] || {
    programName: c.programId,
    level: "Undergraduate",
    organization: "Global Academic Consortium",
  };

  return {
    code: c.code,
    name: c.name,
    programId: c.programId,
    programName: meta.programName,
    level: determineLevel(c.programId),
    category: determineCategory(c.code, c.name),
    credits: c.credits || 3,
    semester: c.semester,
    difficulty: (c.difficulty as "Beginner" | "Intermediate" | "Advanced") || "Intermediate",
    description: c.description || "",
    learningOutcomes: c.learningOutcomes || [],
    prerequisites: c.prerequisites || [],
    syllabusUnits: (c.syllabusUnits || []).map((u: any) => ({
      unitId: u.unitId,
      title: u.title,
      teachingHours: u.teachingHours,
      subtopics: u.subtopics || [],
    })),
  };
});

export const GLOBAL_COURSES: GlobalCourse[] = globalSyllabusCourses;

export const globalPrograms: GlobalProgram[] = globalData.programs.map((p: any) => {
  const count = globalSyllabusCourses.filter((c) => c.programId === p.id).length;
  const meta = PROGRAM_METAS[p.id];
  return {
    id: p.id,
    name: p.name,
    organization: meta?.organization || p.university || "Academic Board",
    country: p.country,
    flag: p.flag,
    level: meta?.level || p.degreeLevel || "Undergraduate",
    description: p.description,
    totalCourses: count,
  };
});
