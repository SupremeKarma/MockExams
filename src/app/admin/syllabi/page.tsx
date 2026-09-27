"use client";

import { useState, useMemo } from "react";
import { Search, BookOpen, Clock, FileText, Wrench, AlertCircle } from "lucide-react";
import { PageHeader, PrimaryButton, Alert } from "@/components/UIComponents";
import { bitSyllabusData } from "@/data/bitSyllabusData";
import type { SubjectInfo } from "@/data/bitSyllabusData";

export default function SyllabuiBrowserPage() {
  const [selectedSemester, setSelectedSemester] = useState(7);
  const [selectedCourse, setSelectedCourse] = useState<SubjectInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Get courses for selected semester
  const semesterData = useMemo(() => {
    return bitSyllabusData.find(s => s.semester === selectedSemester);
  }, [selectedSemester]);

  // Filter courses by search
  const filteredCourses = useMemo(() => {
    if (!semesterData) return [];
    const term = searchTerm.toLowerCase();
    return semesterData.subjects.filter(
      c =>
        c.code.toLowerCase().includes(term) ||
        c.name.toLowerCase().includes(term)
    );
  }, [semesterData, searchTerm]);

  // Set first course as selected when semester changes
  const displayCourse = selectedCourse || (filteredCourses.length > 0 ? filteredCourses[0] : null);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="ExamAI"
        title="Syllabus Browser"
        subtitle="View detailed course syllabus with teaching hours, subtopics, lab work, and reference materials"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Semester Selector */}
          <div className="bg-white rounded-lg border border-zinc-200 p-4">
            <h3 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-3">
              Semesters
            </h3>
            <div className="space-y-1">
              {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
                <button
                  key={sem}
                  onClick={() => {
                    setSelectedSemester(sem);
                    setSelectedCourse(null);
                    setSearchTerm("");
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    selectedSemester === sem
                      ? "bg-primary-50 text-primary-900 border border-primary-200"
                      : "text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  Semester {sem}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg border border-zinc-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Course List */}
          <div className="bg-white rounded-lg border border-zinc-200 p-4">
            <h3 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-3">
              Courses
            </h3>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {filteredCourses.length === 0 ? (
                <p className="text-xs text-zinc-400">No courses found</p>
              ) : (
                filteredCourses.map((course) => (
                  <button
                    key={course.code}
                    onClick={() => setSelectedCourse(course)}
                    className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors ${
                      displayCourse?.code === course.code
                        ? "bg-primary-50 text-primary-900 border border-primary-200"
                        : "text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    <div className="font-semibold">{course.code}</div>
                    <div className="text-xs text-zinc-500 truncate">{course.name}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {!displayCourse ? (
            <div className="bg-white rounded-lg border border-zinc-200 p-12 text-center">
              <AlertCircle className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <p className="text-zinc-500">Select a course to view its detailed syllabus</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-zinc-200 p-8 space-y-8">
              {/* Course Header */}
              <div className="border-b border-zinc-200 pb-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-zinc-900">{displayCourse.name}</h1>
                    <p className="text-lg text-zinc-600 mt-1">{displayCourse.code}</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="inline-block bg-blue-50 px-3 py-1 rounded-lg">
                      <p className="text-sm font-semibold text-blue-900">{displayCourse.credits} Credits</p>
                    </div>
                    <div className="inline-block bg-green-50 px-3 py-1 rounded-lg">
                      <p className="text-sm font-semibold text-green-900">{displayCourse.type}</p>
                    </div>
                  </div>
                </div>
                <p className="text-base text-zinc-700">{displayCourse.description}</p>
              </div>

              {/* Key Units */}
              {displayCourse.keyUnits.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                    <h2 className="text-xl font-semibold text-zinc-900">Key Learning Units</h2>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <ul className="space-y-2">
                      {displayCourse.keyUnits.map((unit, idx) => (
                        <li key={idx} className="flex gap-3 text-sm">
                          <span className="text-blue-600 font-semibold min-w-fit">Unit {idx + 1}:</span>
                          <span className="text-zinc-700">{unit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* Detailed Syllabus Units */}
              {displayCourse.syllabusUnits && displayCourse.syllabusUnits.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-primary-600" />
                    <h2 className="text-xl font-semibold text-zinc-900">Detailed Syllabus ({displayCourse.syllabusUnits.length} topics)</h2>
                  </div>
                  <div className="space-y-6">
                    {displayCourse.syllabusUnits.map((unit, idx) => (
                      <div
                        key={idx}
                        className="border border-zinc-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-lg font-semibold text-zinc-900">
                            Unit {idx + 1}: {unit.title}
                          </h3>
                          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-lg shrink-0">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-900">{unit.teachingHours}h</span>
                          </div>
                        </div>

                        {unit.subtopics && unit.subtopics.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold text-zinc-700 mb-2">Topics:</h4>
                            <ul className="space-y-1.5 ml-4">
                              {unit.subtopics.map((subtopic, sidx) => (
                                <li key={sidx} className="flex gap-2 text-sm text-zinc-700">
                                  <span className="text-zinc-400 mt-1">•</span>
                                  <span>{subtopic}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Lab Work */}
              {displayCourse.labWork && displayCourse.labWork.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Wrench className="w-5 h-5 text-primary-600" />
                    <h2 className="text-xl font-semibold text-zinc-900">Lab Work & Practical Activities</h2>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <ul className="space-y-2">
                      {displayCourse.labWork.map((activity, idx) => (
                        <li key={idx} className="flex gap-3 text-sm">
                          <span className="text-purple-600 font-bold min-w-fit">{idx + 1}.</span>
                          <span className="text-zinc-700">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* Reference Books */}
              {displayCourse.referenceBooks && displayCourse.referenceBooks.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 mb-4">Recommended References</h2>
                  <div className="space-y-2">
                    {displayCourse.referenceBooks.map((book, idx) => (
                      <div key={idx} className="border-l-4 border-primary-600 bg-zinc-50 p-4 rounded">
                        <p className="text-sm text-zinc-800">{book}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
