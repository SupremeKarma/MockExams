"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import ProgramGate from "@/components/ProgramGate";
import {
  Compass,
  ArrowLeft,
  GraduationCap,
  Clock,
  CheckCircle2,
  Circle,
  Award,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Sparkles,
  Loader2,
  Layers,
} from "lucide-react";
import type { LearningPath, StudentPathEnrollment, Course } from "@/lib/examai/types";

export default function LearningPathDetailPage() {
  const params = useParams();
  const pathId = params.pathId as string;
  const { user } = useAuth();
  const router = useRouter();

  const [path, setPath] = useState<LearningPath | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollment, setEnrollment] = useState<StudentPathEnrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [updatingCourse, setUpdatingCourse] = useState<string | null>(null);

  useEffect(() => {
    fetchPathData();
  }, [pathId, user]);

  const fetchPathData = async () => {
    setLoading(true);
    try {
      // 1. Fetch path document
      const pathSnap = await getDoc(doc(db, "learningPaths", pathId));
      if (!pathSnap.exists()) {
        setPath(null);
        setLoading(false);
        return;
      }

      const pathData = {
        pathId: pathSnap.id,
        ...(pathSnap.data() as Omit<LearningPath, "pathId">),
      };
      setPath(pathData);

      // 2. Fetch all courses referenced in pathData.courseIds
      const coursePromises = (pathData.courseIds || []).map(async (cId) => {
        const cSnap = await getDoc(doc(db, "courses", cId));
        if (cSnap.exists()) {
          const d = cSnap.data();
          return {
            code: cSnap.id,
            courseId: cSnap.id,
            name: d.name || cSnap.id,
            semester: d.semester || 1,
            programId: d.programId || "BIT",
            credits: d.credits || 3,
            curriculum: d.curriculum || "new_course",
            syllabusUnits: d.syllabusUnits || [],
            description: d.description || "",
            difficulty: d.difficulty || "Intermediate",
          } as Course;
        }
        return {
          code: cId,
          courseId: cId,
          name: cId,
          semester: 1,
          programId: "BIT",
          credits: 3,
          curriculum: "new_course",
          syllabusUnits: [],
          difficulty: "Intermediate",
        } as Course;
      });

      const loadedCourses = await Promise.all(coursePromises);
      setCourses(loadedCourses);

      // 3. Fetch enrollment if user is logged in
      if (user) {
        const enrollRef = doc(db, "studentPathEnrollments", `${user.uid}_${pathId}`);
        const enrollSnap = await getDoc(enrollRef);
        if (enrollSnap.exists()) {
          setEnrollment(enrollSnap.data() as StudentPathEnrollment);
        }
      }
    } catch (err) {
      console.error("Failed to load learning path:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollPath = async () => {
    if (!user || !path) {
      router.push(`/login?next=/learning-paths/${pathId}`);
      return;
    }
    setEnrolling(true);
    try {
      const enrollRef = doc(db, "studentPathEnrollments", `${user.uid}_${path.pathId}`);
      const newEnrollment: StudentPathEnrollment = {
        userId: user.uid,
        pathId: path.pathId,
        enrolledAt: serverTimestamp(),
        completedCourses: [],
        currentCourseId: path.courseIds[0] || "",
        completionPercentage: 0,
      };

      await setDoc(enrollRef, newEnrollment);
      setEnrollment(newEnrollment);
    } catch (err) {
      console.error("Failed to enroll in path:", err);
    } finally {
      setEnrolling(false);
    }
  };

  const toggleCourseCompleted = async (courseCode: string) => {
    if (!user || !path || !enrollment) return;
    setUpdatingCourse(courseCode);

    const completed = new Set(enrollment.completedCourses || []);
    if (completed.has(courseCode)) {
      completed.delete(courseCode);
    } else {
      completed.add(courseCode);
    }

    const updatedList = Array.from(completed);
    const totalCourses = path.courseIds.length || 1;
    const newPercentage = Math.min(100, Math.round((updatedList.length / totalCourses) * 100));
    const isCertificateEligible = newPercentage >= 90;

    const enrollRef = doc(db, "studentPathEnrollments", `${user.uid}_${path.pathId}`);
    const patch: Partial<StudentPathEnrollment> = {
      completedCourses: updatedList,
      completionPercentage: newPercentage,
      ...(isCertificateEligible && !enrollment.certificateIssuedAt
        ? { certificateIssuedAt: serverTimestamp() }
        : {}),
    };

    try {
      await setDoc(enrollRef, patch, { merge: true });
      setEnrollment((prev) =>
        prev
          ? {
              ...prev,
              completedCourses: updatedList,
              completionPercentage: newPercentage,
              ...(isCertificateEligible && !prev.certificateIssuedAt
                ? { certificateIssuedAt: new Date() }
                : {}),
            }
          : null
      );
    } catch (err) {
      console.error("Failed to update path progress:", err);
    } finally {
      setUpdatingCourse(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <Compass className="w-12 h-12 text-zinc-300 mb-3" />
        <h2 className="text-xl font-bold text-zinc-900">Learning Path Not Found</h2>
        <p className="text-xs text-zinc-500 mt-1 mb-6">
          The requested degree learning path could not be located.
        </p>
        <Link
          href="/learning-paths"
          className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition-colors"
        >
          Back to Learning Paths
        </Link>
      </div>
    );
  }

  const isEnrolled = !!enrollment;
  const completion = enrollment?.completionPercentage || 0;

  return (
    <ProgramGate>
      <div className="min-h-screen bg-zinc-50/50 pb-20 pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Back link */}
          <div>
            <Link
              href="/learning-paths"
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Paths
            </Link>
          </div>

          {/* Hero Banner */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold">
                    {path.programId} Degree Path
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-xs font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    {path.estimatedHours} Hours
                  </span>
                  <span
                    className={`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      path.difficulty === "Beginner"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : path.difficulty === "Advanced"
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {path.difficulty}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
                  {path.name}
                </h1>
                <p className="text-sm text-zinc-600 leading-relaxed">{path.description}</p>
                {path.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {path.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-600 text-[10px] font-semibold rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Progress & Enrollment Card */}
              <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl w-full md:w-80 shrink-0 space-y-4">
                {isEnrolled ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-zinc-600">Sequence Progress</span>
                      <span className="text-indigo-700">{completion}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      {enrollment?.completedCourses?.length || 0} of {courses.length} courses completed
                    </p>
                    {completion >= 90 ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs font-bold text-emerald-800">
                        <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Path Mastery Certificate Unlocked!</span>
                      </div>
                    ) : (
                      <p className="text-[10px] text-zinc-400">
                        Complete 90% or more of the course sequence to unlock degree certificate.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 text-center">
                    <Compass className="w-10 h-10 text-indigo-600 mx-auto" />
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900">Start This Learning Path</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Follow the sequence to complete all curriculum milestones.
                      </p>
                    </div>
                    <button
                      onClick={handleEnrollPath}
                      disabled={enrolling}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      {enrolling ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Enrolling...
                        </>
                      ) : (
                        "Enroll in Sequence"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sequential Course Roadmap */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
            <div className="border-b border-zinc-100 pb-4">
              <h2 className="text-xl font-bold text-zinc-900">Sequential Course Roadmap</h2>
              <p className="text-xs text-zinc-500 mt-1">
                Courses are ordered by academic prerequisites. Complete each course in sequence to build deep comprehension.
              </p>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-zinc-200 before:hidden sm:before:block">
              {courses.map((course, idx) => {
                const isCompleted =
                  enrollment?.completedCourses?.includes(course.code) || false;
                const isUpdating = updatingCourse === course.code;

                return (
                  <div
                    key={course.code}
                    className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6 pl-0 sm:pl-3"
                  >
                    {/* Step Icon */}
                    <div className="relative z-10 hidden sm:flex w-7 h-7 rounded-full bg-white border-2 border-indigo-600 items-center justify-center font-bold text-xs text-indigo-700 shrink-0">
                      {idx + 1}
                    </div>

                    {/* Course Card */}
                    <div
                      className={`flex-1 w-full p-6 rounded-2xl border transition-all ${
                        isCompleted
                          ? "bg-emerald-50/40 border-emerald-200"
                          : "bg-zinc-50/40 border-zinc-200 hover:border-indigo-400"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold">
                              {course.code}
                            </span>
                            <span className="text-xs text-zinc-500 font-semibold">
                              Semester {course.semester} • {course.credits} Credits
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-zinc-900 mt-1">
                            {course.name}
                          </h3>
                          <p className="text-xs text-zinc-500 max-w-2xl leading-relaxed">
                            {course.description || "University curriculum module covering fundamentals, algorithms, and past exam questions."}
                          </p>
                        </div>

                        {/* Complete Toggle & Direct Link */}
                        <div className="flex items-center gap-3 shrink-0">
                          {isEnrolled && (
                            <button
                              onClick={() => toggleCourseCompleted(course.code)}
                              disabled={isUpdating}
                              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                isCompleted
                                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                  : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                              }`}
                            >
                              {isUpdating ? (
                                <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                              ) : isCompleted ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed
                                </>
                              ) : (
                                <>
                                  <Circle className="w-4 h-4 text-zinc-400" /> Mark Complete
                                </>
                              )}
                            </button>
                          )}
                          <Link
                            href={`/courses/${course.code}`}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                          >
                            Explore Course <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ProgramGate>
  );
}
