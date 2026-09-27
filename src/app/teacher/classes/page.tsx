"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  BookOpen,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Award,
  Search,
  School,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { TeacherClass, ClassEnrollment } from "@/lib/examai/types";
import { bitSyllabusData, SubjectInfo } from "@/data/bitSyllabusData";

const bitCoursesList: SubjectInfo[] = bitSyllabusData.flatMap((s) => s.subjects);

function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "MX-";
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function TeacherClassesPage() {
  const { user, loading: authLoading, isAdmin, isExaminer } = useAuth();
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Class Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [className, setClassName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [createError, setCreateError] = useState<string | null>(null);

  // Student Join Modal State
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) {
      if (!authLoading && !user) setLoading(false);
      return;
    }

    async function loadClasses() {
      try {
        setLoading(true);
        // Load classes taught by this user or all if admin
        let qClasses = query(collection(db, "classes"), where("teacherId", "==", user?.uid));
        if (isAdmin) {
          qClasses = query(collection(db, "classes"));
        }

        const snap = await getDocs(qClasses);
        const loadedClasses = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as TeacherClass[];

        // Fetch student enrollments count for each class
        const classesWithCounts = await Promise.all(
          loadedClasses.map(async (c) => {
            const enrollSnap = await getDocs(
              query(collection(db, "classEnrollments"), where("classId", "==", c.id))
            );
            return {
              ...c,
              studentCount: enrollSnap.size,
            };
          })
        );

        setClasses(classesWithCounts);
      } catch (err) {
        console.error("Failed to load classes:", err);
      } finally {
        setLoading(false);
      }
    }

    loadClasses();
  }, [user, authLoading, isAdmin]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const toggleCourseSelection = (courseCode: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseCode) ? prev.filter((c) => c !== courseCode) : [...prev, courseCode]
    );
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) {
      setCreateError("Please enter a class name");
      return;
    }
    if (selectedCourses.length === 0) {
      setCreateError("Please assign at least one course to the class");
      return;
    }

    try {
      setCreating(true);
      setCreateError(null);
      const joinCode = generateJoinCode();

      const newClassData = {
        name: className.trim(),
        description: description.trim(),
        joinCode,
        teacherId: user?.uid,
        teacherName: user?.displayName || user?.email || "Instructor",
        assignedCourseIds: selectedCourses,
        studentCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "classes"), newClassData);

      setClasses((prev) => [
        {
          id: docRef.id,
          ...newClassData,
        } as TeacherClass,
        ...prev,
      ]);

      // Reset form and close
      setClassName("");
      setDescription("");
      setSelectedCourses([]);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Class creation failed:", err);
      setCreateError("Failed to create class. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = joinCodeInput.trim().toUpperCase();
    if (!code) {
      setJoinError("Please enter a valid join code");
      return;
    }

    try {
      setJoining(true);
      setJoinError(null);
      setJoinSuccess(null);

      // 1. Look up class with this join code
      const qLookup = query(collection(db, "classes"), where("joinCode", "==", code));
      const snap = await getDocs(qLookup);
      if (snap.empty) {
        setJoinError("No active class found with this join code. Please check with your instructor.");
        return;
      }

      const targetClassDoc = snap.docs[0];
      const targetClass = targetClassDoc.data() as TeacherClass;
      const classId = targetClassDoc.id;

      // 2. Check if already enrolled
      const qCheck = query(
        collection(db, "classEnrollments"),
        where("classId", "==", classId),
        where("userId", "==", user?.uid)
      );
      const checkSnap = await getDocs(qCheck);
      if (!checkSnap.empty) {
        setJoinError("You are already enrolled in this class!");
        return;
      }

      // 3. Create class enrollment
      await addDoc(collection(db, "classEnrollments"), {
        classId,
        userId: user?.uid,
        studentName: user?.displayName || user?.email?.split("@")[0] || "Student",
        studentEmail: user?.email || "",
        joinedAt: serverTimestamp(),
        progressPercentage: 0,
      });

      // 4. Update student count on class
      await updateDoc(doc(db, "classes", classId), {
        studentCount: (targetClass.studentCount || 0) + 1,
        updatedAt: serverTimestamp(),
      });

      setJoinSuccess(`Successfully enrolled into "${targetClass.name}"!`);
      setJoinCodeInput("");
      setTimeout(() => {
        setShowJoinModal(false);
        setJoinSuccess(null);
      }, 2000);
    } catch (err) {
      console.error("Join class error:", err);
      setJoinError("Could not join class. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-zinc-50/50 flex flex-col items-center justify-center p-6">
        <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          Loading Class Rosters &amp; Portals...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/40 pb-20 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Primary Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary-50 text-primary-600">
                <School className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Teacher Classes &amp; Cohorts</h1>
            </div>
            <p className="text-sm text-zinc-500">
              Create curriculum classrooms, share join codes with students, assign degree courses, and evaluate progress.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 font-bold text-xs transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-zinc-500" />
              Join via Code
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Create Class
            </button>
          </div>
        </div>

        {/* Classes Grid */}
        {classes.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-zinc-300 max-w-2xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto">
              <Users className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900">No classes created yet</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Create your first cohort to distribute past papers, assign degree courses, review student written
                answers, and issue course completion certificates.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Create Your First Class
              </button>
              <button
                onClick={() => setShowJoinModal(true)}
                className="px-5 py-2.5 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 rounded-xl text-xs font-bold transition-all"
              >
                Join as Student
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs hover:border-primary-400 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 font-bold text-[11px] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-zinc-500" />
                      {c.studentCount || 0} Student{c.studentCount === 1 ? "" : "s"}
                    </span>
                    <button
                      onClick={() => handleCopyCode(c.joinCode)}
                      title="Copy Class Join Code"
                      className="px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 font-mono font-bold text-xs hover:bg-primary-100 transition-colors flex items-center gap-1.5"
                    >
                      <span>{c.joinCode}</span>
                      {copiedCode === c.joinCode ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-zinc-900 group-hover:text-primary-600 transition-colors">
                      {c.name}
                    </h3>
                    {c.description && (
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                    <p className="text-[10px] uppercase font-bold text-zinc-400">Assigned Courses:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {c.assignedCourseIds?.map((code) => (
                        <span
                          key={code}
                          className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[10px] font-bold"
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400 font-medium">
                    Instructor: {c.teacherName}
                  </span>
                  <Link
                    href={`/teacher/${c.id}/progress`}
                    className="px-3.5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Class Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Create Class */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary-600" />
                  Create New Class Cohort
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-zinc-400 hover:text-zinc-600 text-lg leading-none"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateClass} className="space-y-4">
                {createError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                    {createError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700">Class / Section Name *</label>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="e.g. BIT 3rd Sem - Section A (2026)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief syllabus guidelines, classroom schedule, or examination preparation goals..."
                    rows={2}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-700">Assign University Courses *</label>
                  <p className="text-[11px] text-zinc-500">
                    Select the degree courses this class will study and be tracked on:
                  </p>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-zinc-50 rounded-xl border border-zinc-200">
                    {bitCoursesList.map((course) => {
                      const isSelected = selectedCourses.includes(course.code);
                      return (
                        <button
                          key={course.code}
                          type="button"
                          onClick={() => toggleCourseSelection(course.code)}
                          className={`p-2.5 rounded-lg border text-left transition-all text-xs flex items-center justify-between ${
                            isSelected
                              ? "bg-primary-50 border-primary-500 text-primary-900 font-bold"
                              : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300"
                          }`}
                        >
                          <div className="min-w-0 pr-1">
                            <span className="block font-mono text-[10px] text-zinc-500">{course.code}</span>
                            <span className="truncate block font-semibold">{course.name}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {creating ? "Creating Class..." : "Create Class"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Join Class via Code */}
        {showJoinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary-600" />
                  Join Class via Code
                </h3>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="text-zinc-400 hover:text-zinc-600 text-lg leading-none"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleJoinClass} className="space-y-4">
                {joinError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                    {joinError}
                  </div>
                )}
                {joinSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                    {joinSuccess}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700">Enter Class Join Code</label>
                  <input
                    type="text"
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                    placeholder="e.g. MX-7K8P"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 font-mono font-bold text-center tracking-wider text-base focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
                    maxLength={10}
                    required
                  />
                  <p className="text-[11px] text-zinc-400 text-center">
                    Ask your teacher or professor for the 6-character class code.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowJoinModal(false)}
                    className="px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={joining}
                    className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {joining ? "Joining..." : "Enroll in Class"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
