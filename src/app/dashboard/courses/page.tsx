"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import ProgramGate from "@/components/ProgramGate";
import {
  GraduationCap,
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BarChart,
  Loader2,
  Award,
} from "lucide-react";
import type { Course, StudentCourseEnrollment } from "@/lib/examai/types";

export default function DashboardCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Record<string, StudentCourseEnrollment>>({});
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch all courses
      const coursesSnap = await getDocs(collection(db, "courses"));
      const courseList: Course[] = coursesSnap.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          code: docSnap.id,
          courseId: docSnap.id,
          name: d.name || docSnap.id,
          semester: d.semester || 1,
          programId: d.programId || "BIT",
          credits: d.credits || 3,
          curriculum: d.curriculum || "new_course",
          syllabusUnits: d.syllabusUnits || [],
          description: d.description || "",
          learningOutcomes: d.learningOutcomes || [],
          prerequisites: d.prerequisites || [],
          difficulty: d.difficulty || "Intermediate",
        };
      });
      // Sort courses by semester ascending, then name
      courseList.sort((a, b) => a.semester - b.semester || a.name.localeCompare(b.name));
      setCourses(courseList);

      // 2. Fetch user enrollments if signed in
      if (user) {
        const enrollQuery = query(
          collection(db, "studentCourseEnrollments"),
          where("userId", "==", user.uid)
        );
        const enrollSnap = await getDocs(enrollQuery);
        const enrollMap: Record<string, StudentCourseEnrollment> = {};
        enrollSnap.docs.forEach((docSnap) => {
          const d = docSnap.data() as StudentCourseEnrollment;
          enrollMap[d.courseId] = d;
        });
        setEnrollments(enrollMap);
      }
    } catch (err) {
      console.error("Error fetching courses and enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (course: Course) => {
    if (!user) return;
    setEnrollingId(course.code);
    try {
      const enrollmentDocId = `${user.uid}_${course.code}`;
      const enrollmentData: StudentCourseEnrollment = {
        userId: user.uid,
        courseId: course.code,
        enrolledAt: serverTimestamp(),
        completionPercentage: 0,
        status: "active",
        lastAccessedAt: serverTimestamp(),
        topicsCompleted: [],
        topicsInProgress: [],
        questionsAttempted: 0,
      };

      await setDoc(doc(db, "studentCourseEnrollments", enrollmentDocId), enrollmentData);

      setEnrollments((prev) => ({
        ...prev,
        [course.code]: enrollmentData,
      }));
    } catch (err) {
      console.error("Failed to enroll in course:", err);
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (selectedSemester !== "all" && c.semester !== selectedSemester) return false;
      if (selectedDifficulty !== "all" && c.difficulty !== selectedDifficulty) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesCode = c.code.toLowerCase().includes(q);
        const matchesDesc = (c.description || "").toLowerCase().includes(q);
        return matchesName || matchesCode || matchesDesc;
      }
      return true;
    });
  }, [courses, selectedSemester, selectedDifficulty, searchQuery]);

  return (
    <ProgramGate>
      <div className="min-h-screen bg-zinc-50/50 pb-20 pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Banner */}
          <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-primary-900 via-primary-800 to-indigo-900 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-emerald-300" />
                <span>Academic Curriculum</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Courses &amp; Semester Modules
              </h1>
              <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                Explore accredited university courses, track your chapter progress, attempt verified
                exam questions, and earn graduation readiness certificates.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/learning-paths"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-900 font-bold text-xs hover:bg-zinc-100 transition-all shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                  View Curated Learning Paths
                </Link>
                <Link
                  href="/notes"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-sm border border-white/20 transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Explore Notes Database
                </Link>
              </div>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="p-4 sm:p-6 bg-white border border-zinc-200 rounded-xl shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search course title or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-primary-600"
                />
              </div>

              {/* Quick Semester Badges */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                <span className="text-xs font-bold text-zinc-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Sem:
                </span>
                <button
                  onClick={() => setSelectedSemester("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    selectedSemester === "all"
                      ? "bg-primary-600 text-white shadow-sm"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  All
                </button>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <button
                    key={sem}
                    onClick={() => setSelectedSemester(sem)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      selectedSemester === sem
                        ? "bg-primary-600 text-white shadow-sm"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    Sem {sem}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 text-xs font-medium">
              <span className="font-bold text-zinc-400">Difficulty:</span>
              {["all", "Beginner", "Intermediate", "Advanced"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    selectedDifficulty === diff
                      ? "bg-zinc-900 text-white font-bold"
                      : "text-zinc-600 hover:bg-zinc-100 font-medium"
                  }`}
                >
                  {diff === "all" ? "All Levels" : diff}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          {loading ? (
            <div className="min-h-[300px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="p-12 text-center bg-white border border-zinc-200 rounded-2xl">
              <BookOpen className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-800">No matching courses found</h3>
              <p className="text-xs text-zinc-500 mt-1 mb-4">
                Try selecting a different semester or clearing your search term.
              </p>
              <button
                onClick={() => {
                  setSelectedSemester("all");
                  setSelectedDifficulty("all");
                  setSearchQuery("");
                }}
                className="px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const enrollment = enrollments[course.code];
                const isEnrolled = !!enrollment;
                const isEnrolling = enrollingId === course.code;
                const completion = enrollment?.completionPercentage || 0;

                return (
                  <div
                    key={course.code}
                    className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 border border-primary-100 text-[11px] font-bold">
                          {course.code} • Sem {course.semester}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            course.difficulty === "Beginner"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : course.difficulty === "Advanced"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {course.difficulty}
                        </span>
                      </div>

                      {/* Course Title */}
                      <div>
                        <Link href={`/courses/${course.code}`}>
                          <h3 className="text-lg font-bold text-zinc-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                            {course.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-zinc-500 mt-2 line-clamp-2 leading-relaxed">
                          {course.description || "University curriculum module covering theoretical concepts and practical algorithms."}
                        </p>
                      </div>

                      {/* Course Metadata Points */}
                      <div className="space-y-1.5 pt-2 border-t border-zinc-100 text-xs text-zinc-600">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">Credits:</span>
                          <span className="font-bold text-zinc-800">{course.credits} Credits</span>
                        </div>
                        {course.prerequisites && course.prerequisites.length > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Prerequisite:</span>
                            <span className="font-medium text-zinc-700 truncate max-w-[160px]">
                              {course.prerequisites[0]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Enrollment Progress if enrolled */}
                      {isEnrolled && (
                        <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-primary-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary-600" /> Enrolled
                            </span>
                            <span className="text-zinc-600">{completion}% Complete</span>
                          </div>
                          <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-600 rounded-full transition-all duration-500"
                              style={{ width: `${completion}%` }}
                            />
                          </div>
                          {completion >= 90 && (
                            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                              <Award className="w-3.5 h-3.5" /> Certificate Ready
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-6 mt-4 border-t border-zinc-100 flex items-center gap-3">
                      {isEnrolled ? (
                        <Link
                          href={`/courses/${course.code}`}
                          className="flex-1 py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          Continue Learning
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course)}
                          disabled={isEnrolling}
                          className="flex-1 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                        >
                          {isEnrolling ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Enrolling...
                            </>
                          ) : (
                            "Enroll Course"
                          )}
                        </button>
                      )}
                      <Link
                        href={`/courses/${course.code}`}
                        className="py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold transition-all"
                        title="Course Details"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProgramGate>
  );
}
