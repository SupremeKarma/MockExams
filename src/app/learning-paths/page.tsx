"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import ProgramGate from "@/components/ProgramGate";
import {
  Compass,
  GraduationCap,
  Clock,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Loader2,
  Award,
  Layers,
} from "lucide-react";
import type { LearningPath, StudentPathEnrollment } from "@/lib/examai/types";

export default function LearningPathsPage() {
  const { user } = useAuth();
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [enrollments, setEnrollments] = useState<Record<string, StudentPathEnrollment>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaths();
  }, [user]);

  const fetchPaths = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "learningPaths"));
      const pathList: LearningPath[] = snap.docs.map((docSnap) => ({
        pathId: docSnap.id,
        ...(docSnap.data() as Omit<LearningPath, "pathId">),
      }));
      setPaths(pathList);

      if (user) {
        const enrollQuery = query(
          collection(db, "studentPathEnrollments"),
          where("userId", "==", user.uid)
        );
        const enrollSnap = await getDocs(enrollQuery);
        const map: Record<string, StudentPathEnrollment> = {};
        enrollSnap.docs.forEach((docSnap) => {
          const d = docSnap.data() as StudentPathEnrollment;
          map[d.pathId] = d;
        });
        setEnrollments(map);
      }
    } catch (err) {
      console.error("Failed to load learning paths:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProgramGate>
      <div className="min-h-screen bg-zinc-50/50 pb-20 pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Banner */}
          <div className="rounded-2xl p-6 sm:p-10 bg-gradient-to-r from-indigo-900 via-primary-900 to-slate-900 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider">
                <Compass className="w-4 h-4 text-emerald-300" />
                <span>Curated Academic Sequences</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Degree Learning Paths
              </h1>
              <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                Step-by-step course roadmaps engineered for university graduation requirements.
                Complete sequenced modules, master key algorithms, and verify readiness with past exam papers.
              </p>
            </div>
          </div>

          {/* Paths Grid */}
          {loading ? (
            <div className="min-h-[300px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : paths.length === 0 ? (
            <div className="p-12 text-center bg-white border border-zinc-200 rounded-2xl">
              <Compass className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-800">No learning paths found</h3>
              <p className="text-xs text-zinc-500 mt-1 mb-4">
                Curated learning paths will appear here once published.
              </p>
              <Link
                href="/dashboard/courses"
                className="px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 transition-colors inline-block"
              >
                Browse Individual Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paths.map((path) => {
                const enrollment = enrollments[path.pathId];
                const isEnrolled = !!enrollment;
                const completion = enrollment?.completionPercentage || 0;

                return (
                  <div
                    key={path.pathId}
                    className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      {/* Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-bold">
                          {path.programId} Path
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            {path.estimatedHours}h
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                      </div>

                      {/* Title & Desc */}
                      <div>
                        <Link href={`/learning-paths/${path.pathId}`}>
                          <h3 className="text-lg font-bold text-zinc-900 group-hover:text-primary-600 transition-colors">
                            {path.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-zinc-500 mt-2 line-clamp-2 leading-relaxed">
                          {path.description}
                        </p>
                      </div>

                      {/* Course sequence badges */}
                      <div className="space-y-2 pt-2 border-t border-zinc-100">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                          Included Modules ({path.courseIds.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {path.courseIds.map((cId, idx) => (
                            <span
                              key={cId}
                              className="px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold inline-flex items-center gap-1"
                            >
                              <span className="text-[10px] text-zinc-400">{idx + 1}.</span>
                              {cId}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Progress bar if enrolled */}
                      {isEnrolled && (
                        <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-primary-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary-600" /> Active Path
                            </span>
                            <span className="text-zinc-600">{completion}% Done</span>
                          </div>
                          <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                              style={{ width: `${completion}%` }}
                            />
                          </div>
                          {completion >= 90 && (
                            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                              <Award className="w-3.5 h-3.5" /> Certificate Unlocked
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-6 mt-4 border-t border-zinc-100 flex items-center justify-between">
                      <Link
                        href={`/learning-paths/${path.pathId}`}
                        className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        {isEnrolled ? "Continue Path" : "View Curriculum & Start"}
                        <ArrowRight className="w-3.5 h-3.5" />
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
