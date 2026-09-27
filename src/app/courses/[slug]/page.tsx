"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import ProgramGate from "@/components/ProgramGate";
import EntranceCourseDetailPage from "@/app/course/[slug]/page";
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Award,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Loader2,
  FileText,
  AlertCircle,
} from "lucide-react";
import type { Course, StudentCourseEnrollment, Paper } from "@/lib/examai/types";

export default function CourseSlugPage() {
  const params = useParams();
  const slug = (params.slug as string) || "";
  const normalizedCode = slug.toUpperCase();
  const { user } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<StudentCourseEnrollment | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [topics, setTopics] = useState<{ id: string; name: string; importance: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAcademic, setIsAcademic] = useState<boolean | null>(null);
  const [updatingTopic, setUpdatingTopic] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [slug, user]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      // 1. Try finding academic course by normalizedCode or slug
      let courseSnap = await getDoc(doc(db, "courses", normalizedCode));
      if (!courseSnap.exists()) {
        courseSnap = await getDoc(doc(db, "courses", slug));
      }

      if (courseSnap.exists()) {
        setIsAcademic(true);
        const d = courseSnap.data();
        const loadedCourse: Course = {
          code: courseSnap.id,
          courseId: courseSnap.id,
          name: d.name || courseSnap.id,
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
        setCourse(loadedCourse);

        // 2. Fetch enrollment if user is logged in
        if (user) {
          const enrollRef = doc(db, "studentCourseEnrollments", `${user.uid}_${loadedCourse.code}`);
          const enrollSnap = await getDoc(enrollRef);
          if (enrollSnap.exists()) {
            setEnrollment(enrollSnap.data() as StudentCourseEnrollment);
          }
        }

        // 3. Fetch past papers for this course
        try {
          const papersQ = query(
            collection(db, "papers"),
            where("courseId", "==", loadedCourse.code)
          );
          const papersSnap = await getDocs(papersQ);
          const paperList: Paper[] = papersSnap.docs.map((pDoc) => ({
            id: pDoc.id,
            ...(pDoc.data() as Omit<Paper, "id">),
          }));
          setPapers(paperList);
        } catch (e) {
          console.warn("Could not load course papers:", e);
        }

        // 4. Fetch topics from studentNotes
        try {
          const topicsSnap = await getDocs(
            collection(db, "studentNotes", loadedCourse.code, "topics")
          );
          if (!topicsSnap.empty) {
            setTopics(
              topicsSnap.docs.map((tDoc) => ({
                id: tDoc.id,
                name: tDoc.data().name || tDoc.id,
                importance: tDoc.data().importance || "Medium",
              }))
            );
          } else if (loadedCourse.syllabusUnits && loadedCourse.syllabusUnits.length > 0) {
            setTopics(
              loadedCourse.syllabusUnits.map((u) => ({
                id: u.unitId,
                name: u.title,
                importance: "Medium",
              }))
            );
          }
        } catch (e) {
          console.warn("Could not load topics:", e);
        }
      } else {
        // Not in academic courses collection -> check if it's an entrance course
        setIsAcademic(false);
      }
    } catch (err) {
      console.error("Error loading course:", err);
      setIsAcademic(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user || !course) {
      router.push(`/login?next=/courses/${slug}`);
      return;
    }
    setEnrolling(true);
    try {
      const enrollRef = doc(db, "studentCourseEnrollments", `${user.uid}_${course.code}`);
      const newEnrollment: StudentCourseEnrollment = {
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
      await setDoc(enrollRef, newEnrollment);
      setEnrollment(newEnrollment);
    } catch (err) {
      console.error("Failed to enroll:", err);
    } finally {
      setEnrolling(false);
    }
  };

  const toggleTopicCompletion = async (topicId: string) => {
    if (!user || !course || !enrollment) return;
    setUpdatingTopic(topicId);

    const completed = new Set(enrollment.topicsCompleted || []);
    if (completed.has(topicId)) {
      completed.delete(topicId);
    } else {
      completed.add(topicId);
    }

    const updatedTopics = Array.from(completed);
    const totalCount = topics.length || 1;
    const newPercentage = Math.min(100, Math.round((updatedTopics.length / totalCount) * 100));
    const isNowEligibleForCertificate = newPercentage >= 90;

    const enrollRef = doc(db, "studentCourseEnrollments", `${user.uid}_${course.code}`);
    const patch: Partial<StudentCourseEnrollment> = {
      topicsCompleted: updatedTopics,
      completionPercentage: newPercentage,
      lastAccessedAt: serverTimestamp(),
      ...(isNowEligibleForCertificate && !enrollment.certificateIssuedAt
        ? { certificateIssuedAt: serverTimestamp() }
        : {}),
    };

    try {
      await setDoc(enrollRef, patch, { merge: true });
      setEnrollment((prev) =>
        prev
          ? {
              ...prev,
              topicsCompleted: updatedTopics,
              completionPercentage: newPercentage,
              ...(isNowEligibleForCertificate && !prev.certificateIssuedAt
                ? { certificateIssuedAt: new Date() }
                : {}),
            }
          : null
      );
    } catch (err) {
      console.error("Failed to update topic progress:", err);
    } finally {
      setUpdatingTopic(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  // If not an academic course in `courses`, render Entrance Course view
  if (!isAcademic || !course) {
    return <EntranceCourseDetailPage />;
  }

  const isEnrolled = !!enrollment;
  const completion = enrollment?.completionPercentage || 0;

  return (
    <ProgramGate>
      <div className="min-h-screen bg-zinc-50/50 pb-20 pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Back link */}
          <div>
            <Link
              href="/dashboard/courses"
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Courses Directory
            </Link>
          </div>

          {/* Hero Banner */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-lg bg-primary-50 text-primary-700 border border-primary-100 text-xs font-bold">
                    {course.code}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-xs font-bold">
                    Semester {course.semester}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-xs font-bold">
                    {course.credits} Credits
                  </span>
                  <span
                    className={`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
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
                <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
                  {course.name}
                </h1>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {course.description ||
                    "Curated syllabus topics, verified past paper problems, and study guides for academic excellence."}
                </p>
              </div>

              {/* Enrollment / Certificate Card */}
              <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl w-full md:w-80 shrink-0 space-y-4">
                {isEnrolled ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-zinc-600">Course Progress</span>
                      <span className="text-primary-700">{completion}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full transition-all duration-500"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      {enrollment?.topicsCompleted?.length || 0} of {topics.length || 1} topics
                      mastered
                    </p>
                    {completion >= 90 ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs font-bold text-emerald-800">
                        <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Mastery Certificate Issued!</span>
                      </div>
                    ) : (
                      <p className="text-[10px] text-zinc-400">
                        Reach 90% topic completion to receive your graduation certificate.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 text-center">
                    <GraduationCap className="w-10 h-10 text-primary-600 mx-auto" />
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900">Enroll to Track Progress</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Track syllabus chapters and qualify for certificates.
                      </p>
                    </div>
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      {enrolling ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Enrolling...
                        </>
                      ) : (
                        "Enroll in Course"
                      )}
                    </button>
                  </div>
                )}

                <div className="pt-3 border-t border-zinc-200 flex gap-2">
                  <Link
                    href={`/notes`}
                    className="flex-1 py-2 text-center rounded-lg bg-white border border-zinc-200 text-zinc-700 font-bold text-xs hover:bg-zinc-100 transition-colors"
                  >
                    View Notes
                  </Link>
                  <Link
                    href={`/practice`}
                    className="flex-1 py-2 text-center rounded-lg bg-zinc-900 text-white font-bold text-xs hover:bg-zinc-800 transition-colors"
                  >
                    Practice Drills
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Syllabus Topics Checklist */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">Curriculum &amp; Topics</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Check off topics as you study to update your course completion status.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md">
                    {topics.length} Units
                  </span>
                </div>

                {topics.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-4">No topics published for this course yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {topics.map((t, idx) => {
                      const isCompleted =
                        enrollment?.topicsCompleted?.includes(t.id) || false;
                      const isUpdating = updatingTopic === t.id;

                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            if (isEnrolled) toggleTopicCompletion(t.id);
                          }}
                          className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                            isCompleted
                              ? "bg-emerald-50/50 border-emerald-200"
                              : "bg-zinc-50/50 border-zinc-200 hover:border-zinc-300"
                          } ${isEnrolled ? "cursor-pointer" : "cursor-default"}`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              disabled={!isEnrolled || isUpdating}
                              className="text-zinc-400 hover:text-zinc-600 disabled:opacity-50"
                            >
                              {isUpdating ? (
                                <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                              ) : isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-zinc-300" />
                              )}
                            </button>
                            <div>
                              <span className="text-xs font-bold text-zinc-900 block">
                                {idx + 1}. {t.name}
                              </span>
                              <span className="text-[10px] text-zinc-400">
                                Priority: {t.importance}
                              </span>
                            </div>
                          </div>
                          <Link
                            href="/notes"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs font-bold text-primary-600 hover:underline shrink-0"
                          >
                            Study Unit →
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Past Exam Papers Linked to Course */}
              {papers.length > 0 && (
                <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <h3 className="text-lg font-bold text-zinc-900">Verified Past Papers</h3>
                    <span className="text-xs font-bold text-zinc-500">{papers.length} Papers</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {papers.map((paper) => {
                      const extractedCount =
                        paper.coverage?.byGroup?.reduce(
                          (acc, g) => acc + (g.questionsExtracted || 0),
                          0
                        ) || 0;
                      return (
                        <Link
                          key={paper.paperId}
                          href={`/papers/${paper.paperId}`}
                          className="p-4 rounded-xl border border-zinc-200 hover:border-primary-500 bg-zinc-50/40 transition-all block group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-800 group-hover:text-primary-600">
                              {paper.year} ({paper.examType})
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-zinc-200 text-zinc-600 font-bold uppercase">
                              {paper.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-1">
                            {extractedCount > 0 ? `${extractedCount} Questions • ` : ""}Max {paper.fullMarks} Marks
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Learning Outcomes & Prerequisites */}
            <div className="space-y-6">
              {/* Learning Outcomes */}
              {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary-600" />
                    Learning Outcomes
                  </h4>
                  <ul className="space-y-2 text-xs text-zinc-600">
                    {course.learningOutcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary-600" />
                    Prerequisites
                  </h4>
                  <ul className="space-y-2 text-xs text-zinc-600">
                    {course.prerequisites.map((prereq, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-600 shrink-0" />
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Learning Path Recommendation */}
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-primary-50 border border-primary-100 rounded-2xl space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700">
                  Recommended Path
                </span>
                <h4 className="text-sm font-bold text-zinc-900">
                  Part of University Foundations
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  This course is integrated into structured degree learning paths. Complete all
                  sequenced courses to unlock comprehensive mastery credentials.
                </p>
                <Link
                  href="/learning-paths"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:text-primary-800"
                >
                  Explore All Learning Paths <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProgramGate>
  );
}
