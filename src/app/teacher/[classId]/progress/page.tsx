"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Users,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  ChevronLeft,
  Search,
  Check,
  X,
  Sparkles,
  BarChart3,
  Copy,
  GraduationCap,
  FileCheck,
  Send,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { TeacherClass, ClassEnrollment } from "@/lib/examai/types";

interface WrittenSubmissionItem {
  attemptId: string;
  userId: string;
  studentName: string;
  examTitle: string;
  questionNumber: string;
  questionText: string;
  studentAnswer: string;
  fullMarks: number;
  marksAwarded: number | null;
  teacherFeedback: string;
  gradingStatus: "pending" | "graded";
  breakdownIndex: number;
}

export default function ClassProgressPage() {
  const { classId } = useParams<{ classId: string }>();
  const router = useRouter();
  const { user, loading: authLoading, isAdmin, isExaminer } = useAuth();

  const [classData, setClassData] = useState<TeacherClass | null>(null);
  const [students, setStudents] = useState<ClassEnrollment[]>([]);
  const [writtenSubmissions, setWrittenSubmissions] = useState<WrittenSubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"roster" | "grading">("roster");

  // Grading interaction state
  const [gradingScores, setGradingScores] = useState<Record<string, number>>({});
  const [gradingFeedback, setGradingFeedback] = useState<Record<string, string>>({});
  const [submittingGrade, setSubmittingGrade] = useState<string | null>(null);
  const [issuingCert, setIssuingCert] = useState<string | null>(null);
  const [certSuccess, setCertSuccess] = useState<Record<string, string>>({});
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (authLoading || !classId) return;

    async function loadClassAndStudents() {
      try {
        setLoading(true);

        // 1. Fetch Class Doc
        const classRef = doc(db, "classes", classId);
        const classSnap = await getDoc(classRef);
        if (!classSnap.exists()) {
          console.error("Class not found:", classId);
          setLoading(false);
          return;
        }

        const cData = { id: classSnap.id, ...classSnap.data() } as TeacherClass;
        setClassData(cData);

        // 2. Fetch Enrolled Students
        const qEnrollments = query(
          collection(db, "classEnrollments"),
          where("classId", "==", classId)
        );
        const enrollSnap = await getDocs(qEnrollments);
        const loadedStudents = enrollSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as ClassEnrollment[];

        // 3. For each student, compute course progress across assigned courses
        const studentsWithProgress = await Promise.all(
          loadedStudents.map(async (student) => {
            if (!student.userId) return student;
            const qCourseEnrollments = query(
              collection(db, "studentCourseEnrollments"),
              where("userId", "==", student.userId)
            );
            const ceSnap = await getDocs(qCourseEnrollments);
            if (ceSnap.empty) return { ...student, progressPercentage: 0 };

            const userCourses = ceSnap.docs.map((d) => d.data());
            // Filter to assigned courses if specified
            const relevant =
              cData.assignedCourseIds && cData.assignedCourseIds.length > 0
                ? userCourses.filter((uc: any) => cData.assignedCourseIds.includes(uc.courseId))
                : userCourses;

            if (relevant.length === 0) return { ...student, progressPercentage: 0 };
            const avgProgress = Math.round(
              relevant.reduce((sum: number, curr: any) => sum + (Number(curr.completionPercentage) || 0), 0) /
                relevant.length
            );
            return {
              ...student,
              progressPercentage: avgProgress,
            };
          })
        );

        setStudents(studentsWithProgress);

        // 4. Fetch Written Submissions across enrolled students
        const studentIds = loadedStudents.map((s) => s.userId).filter(Boolean);
        const submissions: WrittenSubmissionItem[] = [];

        if (studentIds.length > 0) {
          // Query recent exam attempts of these students (batching up to 10 for Firestore 'in' limit)
          const batches: string[][] = [];
          for (let i = 0; i < studentIds.length; i += 10) {
            batches.push(studentIds.slice(i, i + 10));
          }

          for (const batch of batches) {
            const qAttempts = query(
              collection(db, "exam_attempts"),
              where("user_id", "in", batch)
            );
            const attemptsSnap = await getDocs(qAttempts);

            attemptsSnap.docs.forEach((aDoc) => {
              const attempt = aDoc.data();
              const breakdown = attempt?.answers_json?.breakdown;
              const student = loadedStudents.find((s) => s.userId === attempt.user_id);
              const studentName = student?.studentName || "Class Student";

              if (Array.isArray(breakdown)) {
                breakdown.forEach((item: any, idx: number) => {
                  if (item.type === "written" || item.grading_status === "pending") {
                    submissions.push({
                      attemptId: aDoc.id,
                      userId: attempt.user_id,
                      studentName,
                      examTitle: attempt.exam_title || "Mock Assessment",
                      questionNumber: item.questionNumber || `Q${idx + 1}`,
                      questionText: item.questionText || "Written theoretical question",
                      studentAnswer: item.studentAnswer || item.answer || "(No written text provided)",
                      fullMarks: Number(item.fullMarks) || 5,
                      marksAwarded: item.marksAwarded !== undefined ? Number(item.marksAwarded) : null,
                      teacherFeedback: item.feedback || "",
                      gradingStatus: item.grading_status || "pending",
                      breakdownIndex: idx,
                    });
                  }
                });
              }
            });
          }
        }

        setWrittenSubmissions(submissions);
      } catch (err) {
        console.error("Error loading class progress:", err);
      } finally {
        setLoading(false);
      }
    }

    loadClassAndStudents();
  }, [classId, user, authLoading]);

  const handleCopyJoinCode = () => {
    if (!classData?.joinCode) return;
    navigator.clipboard.writeText(classData.joinCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleGradeSubmission = async (sub: WrittenSubmissionItem) => {
    const key = `${sub.attemptId}-${sub.breakdownIndex}`;
    const score = gradingScores[key] ?? sub.marksAwarded ?? sub.fullMarks;
    const feedback = gradingFeedback[key] ?? sub.teacherFeedback ?? "Well demonstrated.";

    try {
      setSubmittingGrade(key);

      const attemptRef = doc(db, "exam_attempts", sub.attemptId);
      const attemptSnap = await getDoc(attemptRef);
      if (!attemptSnap.exists()) return;

      const attemptData = attemptSnap.data();
      const breakdown = [...(attemptData?.answers_json?.breakdown || [])];

      if (breakdown[sub.breakdownIndex]) {
        breakdown[sub.breakdownIndex] = {
          ...breakdown[sub.breakdownIndex],
          marksAwarded: score,
          feedback,
          grading_status: "graded",
          graded_by: user?.uid,
          graded_at: new Date().toISOString(),
        };

        // Recalculate total score
        const totalMarksAwarded = breakdown.reduce(
          (sum: number, item: any) => sum + (Number(item.marksAwarded) || 0),
          0
        );
        const totalMarksPossible = breakdown.reduce(
          (sum: number, item: any) => sum + (Number(item.fullMarks) || 1),
          0
        );
        const percentage = Math.round((totalMarksAwarded / totalMarksPossible) * 100);

        await updateDoc(attemptRef, {
          "answers_json.breakdown": breakdown,
          score: totalMarksAwarded,
          percentage,
          grading_status: "completed",
          updated_at: serverTimestamp(),
        });
      }

      // Update local state
      setWrittenSubmissions((prev) =>
        prev.map((item) =>
          item.attemptId === sub.attemptId && item.breakdownIndex === sub.breakdownIndex
            ? { ...item, marksAwarded: score, teacherFeedback: feedback, gradingStatus: "graded" }
            : item
        )
      );
    } catch (err) {
      console.error("Grading submission failed:", err);
    } finally {
      setSubmittingGrade(null);
    }
  };

  const handleIssueCertificate = async (student: ClassEnrollment) => {
    try {
      setIssuingCert(student.id);

      // Issue completion certificate for first assigned course or general class mastery
      const targetCourse = classData?.assignedCourseIds?.[0] || "BIT-DEGREE";
      const courseTitle = classData?.name ? `${classData.name} Mastery` : "Class Syllabus Mastery";

      // Check if certificate already exists for this student and course
      const existingCertSnap = await getDocs(
        query(
          collection(db, "certificates"),
          where("user_id", "==", student.userId),
          where("exam_id", "==", targetCourse)
        )
      );

      let code = "";
      if (!existingCertSnap.empty) {
        code = existingCertSnap.docs[0].data().code;
      } else {
        const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        const bytes = new Uint8Array(8);
        if (typeof window !== "undefined" && window.crypto) {
          window.crypto.getRandomValues(bytes);
        }
        for (let i = 0; i < 8; i++) code += alphabet[bytes[i] % alphabet.length];
        code = `MX-${code.slice(0, 4)}-${code.slice(4)}`;

        await addDoc(collection(db, "certificates"), {
          code,
          user_id: student.userId,
          user_name: student.studentName || "Student",
          exam_id: targetCourse,
          exam_title: courseTitle,
          percentage: Math.round(student.progressPercentage || 100),
          attempts: 1,
          issued_at: new Date().toISOString(),
          class_id: classData?.id || null,
        });
      }

      setCertSuccess((prev) => ({
        ...prev,
        [student.id]: code,
      }));
    } catch (err) {
      console.error("Issue certificate error:", err);
    } finally {
      setIssuingCert(null);
    }
  };

  // Class statistics
  const stats = useMemo(() => {
    const totalEnrolled = students.length;
    const avgCompletion =
      totalEnrolled > 0
        ? Math.round(
            students.reduce((sum, s) => sum + (Number(s.progressPercentage) || 0), 0) / totalEnrolled
          )
        : 0;
    const pendingGradingCount = writtenSubmissions.filter((s) => s.gradingStatus === "pending").length;

    return {
      totalEnrolled,
      avgCompletion,
      pendingGradingCount,
    };
  }, [students, writtenSubmissions]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-zinc-50/50 flex flex-col items-center justify-center p-6">
        <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          Loading Class Progress &amp; Submissions...
        </p>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-zinc-900">Class Not Found</h2>
          <p className="text-xs text-zinc-500">The requested class could not be found or has been deleted.</p>
          <Link
            href="/teacher/classes"
            className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-bold"
          >
            Back to Classes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/40 pb-20 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
          <Link href="/teacher/classes" className="hover:text-zinc-900 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Teacher Classes
          </Link>
          <span>/</span>
          <span className="text-zinc-900">{classData.name}</span>
        </div>

        {/* Class Banner Card */}
        <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-primary-50 text-primary-600">
                <GraduationCap className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-zinc-900">{classData.name}</h1>
                <p className="text-xs text-zinc-500">Instructor: {classData.teacherName}</p>
              </div>
            </div>

            {classData.description && (
              <p className="text-xs text-zinc-600 max-w-xl leading-relaxed">{classData.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase">Assigned Courses:</span>
              {classData.assignedCourseIds?.map((c) => (
                <span key={c} className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-xs font-bold font-mono">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center gap-3">
              <div>
                <span className="block text-[10px] uppercase font-bold text-zinc-400">Class Join Code</span>
                <span className="text-sm font-mono font-bold text-zinc-900">{classData.joinCode}</span>
              </div>
              <button
                onClick={handleCopyJoinCode}
                title="Copy Join Code"
                className="p-1.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-600"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Class Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Enrolled</p>
              <h3 className="text-2xl font-extrabold text-zinc-900 mt-1 tabular-nums">{stats.totalEnrolled}</h3>
              <p className="text-[11px] text-zinc-500 font-semibold mt-0.5">Students in class roster</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Cohort Completion</p>
              <h3 className="text-2xl font-extrabold text-zinc-900 mt-1 tabular-nums">{stats.avgCompletion}%</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Average syllabus progress</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Written Reviews</p>
              <h3 className="text-2xl font-extrabold text-zinc-900 mt-1 tabular-nums">
                {stats.pendingGradingCount}
              </h3>
              <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Submissions awaiting grading</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-zinc-200">
          <button
            onClick={() => setActiveTab("roster")}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "roster"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Users className="w-4 h-4" />
            Student Roster ({students.length})
          </button>
          <button
            onClick={() => setActiveTab("grading")}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "grading"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <FileCheck className="w-4 h-4" />
            Written Answers &amp; Grading ({writtenSubmissions.length})
          </button>
        </div>

        {/* TAB 1: Student Roster & Certificate Issuance */}
        {activeTab === "roster" && (
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h2 className="text-base font-bold text-zinc-900">Enrolled Student Cohort</h2>
              <span className="text-xs text-zinc-400">
                Certificates can be issued once student syllabus completion reaches ≥ 90%
              </span>
            </div>

            {students.length === 0 ? (
              <div className="p-8 text-center bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                <Users className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-zinc-800">No students enrolled yet</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Share join code <span className="font-mono font-bold text-zinc-900">{classData.joinCode}</span> with
                  your students to start tracking progress.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4 font-bold">Student</th>
                      <th className="py-3 px-4 font-bold">Email</th>
                      <th className="py-3 px-4 font-bold">Enrolled Date</th>
                      <th className="py-3 px-4 font-bold">Course Progress</th>
                      <th className="py-3 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {students.map((student) => {
                      const pct = student.progressPercentage || 0;
                      const eligible = pct >= 90;
                      const certCode = certSuccess[student.id];

                      return (
                        <tr key={student.id} className="hover:bg-zinc-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-zinc-900">{student.studentName}</td>
                          <td className="py-3.5 px-4 text-zinc-500">{student.studentEmail || "—"}</td>
                          <td className="py-3.5 px-4 text-zinc-500">
                            {student.joinedAt
                              ? new Date(student.joinedAt?.toMillis?.() || student.joinedAt).toLocaleDateString()
                              : "Recently"}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-24 h-2 bg-zinc-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${eligible ? "bg-emerald-500" : "bg-primary-600"}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="font-bold tabular-nums text-zinc-700">{pct}%</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {certCode ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-purple-50 text-purple-700 font-mono font-bold text-[11px] border border-purple-200">
                                <Award className="w-3 h-3" />
                                {certCode}
                              </span>
                            ) : (
                              <button
                                onClick={() => handleIssueCertificate(student)}
                                disabled={issuingCert === student.id || !eligible}
                                title={!eligible ? "Student must achieve ≥ 90% syllabus completion" : undefined}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                                  eligible
                                    ? "bg-purple-600 hover:bg-purple-700 text-white shadow-xs cursor-pointer"
                                    : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                                }`}
                              >
                                <Award className="w-3.5 h-3.5" />
                                {issuingCert === student.id ? "Issuing..." : "Issue Certificate"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Written Answers Review & Grading */}
        {activeTab === "grading" && (
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-zinc-900">Student Written Submissions</h2>
                <p className="text-xs text-zinc-500">
                  Review long-form theoretical answers submitted in mock exam attempts and assign marks
                </p>
              </div>
            </div>

            {writtenSubmissions.length === 0 ? (
              <div className="p-8 text-center bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                <FileCheck className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-zinc-800">No written answer submissions pending</p>
                <p className="text-xs text-zinc-500 mt-1">
                  When students sit mock exams containing written questions, their answers will queue here for review.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {writtenSubmissions.map((sub) => {
                  const key = `${sub.attemptId}-${sub.breakdownIndex}`;
                  const currentScore = gradingScores[key] ?? (sub.marksAwarded ?? sub.fullMarks);
                  const currentFeedback = gradingFeedback[key] ?? (sub.teacherFeedback || "");
                  const isGraded = sub.gradingStatus === "graded";

                  return (
                    <div
                      key={key}
                      className="p-5 rounded-xl border border-zinc-200 bg-zinc-50/30 space-y-4 hover:border-zinc-300 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-900 text-sm">{sub.studentName}</span>
                            <span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-700 font-mono text-[10px] font-bold">
                              {sub.questionNumber}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500">{sub.examTitle}</p>
                        </div>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold self-start sm:self-auto ${
                            isGraded
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {isGraded ? "Graded" : "Pending Teacher Review"}
                        </span>
                      </div>

                      {/* Question Text */}
                      <div className="p-3 bg-white rounded-lg border border-zinc-200 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-zinc-400">Exam Question:</span>
                        <p className="text-xs text-zinc-800 font-medium leading-relaxed">{sub.questionText}</p>
                      </div>

                      {/* Student's Answer */}
                      <div className="p-3 bg-white rounded-lg border border-zinc-200 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-zinc-400">Student Answer:</span>
                        <p className="text-xs text-zinc-900 leading-relaxed font-mono whitespace-pre-wrap">
                          {sub.studentAnswer}
                        </p>
                      </div>

                      {/* Teacher Grading Inputs */}
                      <div className="p-4 bg-white rounded-xl border border-zinc-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <label className="text-xs font-bold text-zinc-700">Marks Awarded:</label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={0}
                                max={sub.fullMarks}
                                value={currentScore}
                                onChange={(e) =>
                                  setGradingScores((prev) => ({
                                    ...prev,
                                    [key]: Number(e.target.value),
                                  }))
                                }
                                className="w-16 px-2.5 py-1.5 border border-zinc-300 rounded-lg text-xs font-bold text-center"
                              />
                              <span className="text-xs text-zinc-400 font-bold">/ {sub.fullMarks}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleGradeSubmission(sub)}
                            disabled={submittingGrade === key}
                            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 self-end sm:self-auto"
                          >
                            <Send className="w-3.5 h-3.5" />
                            {submittingGrade === key ? "Saving..." : isGraded ? "Update Grade" : "Submit Grade"}
                          </button>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-700 flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                            Instructor Feedback:
                          </label>
                          <input
                            type="text"
                            value={currentFeedback}
                            onChange={(e) =>
                              setGradingFeedback((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }))
                            }
                            placeholder="Add actionable remarks or correction guidance for the student..."
                            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
