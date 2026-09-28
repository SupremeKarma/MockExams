import { NextRequest, NextResponse } from "next/server";
import { bitSyllabusData } from "@/data/bitSyllabusData";
import { globalSyllabusCourses } from "@/data/globalSyllabusData";
import { generateCourseMarkdown, getCourseExaminationScheme } from "@/lib/syllabusMarkdown";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const normalizedCode = code.toUpperCase();
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");

    // 1. Look in PU BIT Syllabus Data
    let matchedCourse: {
      code: string;
      name: string;
      credits: number;
      type?: string;
      description: string;
      semester?: number;
      programName?: string;
      keyUnits?: string[];
      syllabusUnits?: any[];
    } | null = null;

    for (const sem of bitSyllabusData) {
      const found = sem.subjects.find((s) => s.code.toUpperCase() === normalizedCode);
      if (found) {
        matchedCourse = {
          ...found,
          semester: sem.semester,
          programName: "Purbanchal University B.I.T.",
        };
        break;
      }
    }

    // 2. If not found in PU BIT, check Global Syllabus
    if (!matchedCourse) {
      const gFound = globalSyllabusCourses.find(
        (c) => c.code.toUpperCase() === normalizedCode
      );
      if (gFound) {
        matchedCourse = {
          code: gFound.code,
          name: gFound.name,
          credits: gFound.credits,
          description: gFound.description,
          programName: gFound.programName,
          semester: gFound.semester,
          syllabusUnits: gFound.syllabusUnits,
        };
      }
    }

    if (!matchedCourse) {
      return NextResponse.json(
        { error: `Course with code '${code}' not found in syllabus registry.` },
        { status: 404 }
      );
    }

    const mdContent = generateCourseMarkdown(matchedCourse);

    // If requested with format=md or Accept: text/markdown, serve raw text for in-app client reader
    if (
      format === "md" ||
      request.headers.get("accept")?.includes("text/markdown")
    ) {
      return new NextResponse(mdContent, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
        },
      });
    }

    // Default JSON response for in-app reader
    const scheme = getCourseExaminationScheme(matchedCourse.code, matchedCourse.credits);
    return NextResponse.json({
      success: true,
      code: matchedCourse.code,
      name: matchedCourse.name,
      credits: matchedCourse.credits,
      semester: matchedCourse.semester,
      programName: matchedCourse.programName,
      examinationScheme: scheme,
      markdownContent: mdContent,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch syllabus markdown" },
      { status: 500 }
    );
  }
}
