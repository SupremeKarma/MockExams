// app/api/exams/[id]/submit/route.ts
// Production-ready exam submission handler for ExamAI (Firebase/Firestore Version).

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

interface SubmitBody {
  answers: Record<string, string>;
  time_spent_seconds?: number;
}

interface QuestionBreakdown {
  questionId: string;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  marksAwarded: number;
}

export async function POST(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const { id: examId } = await params;

    // 1. Authenticate using Firebase Admin
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return error(401, "Missing auth token");
    }

    let userId: string;
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      userId = decodedToken.uid;
    } catch (authError) {
      console.error("Auth error:", authError);
      return error(401, "Invalid or expired token");
    }

    // 2. Parse body
    let body: SubmitBody;
    try {
      body = await request.json();
    } catch {
      return error(400, "Invalid JSON body");
    }

    const { answers = {}, time_spent_seconds = 0 } = body;

    // 3. Load exam metadata and questions from Firestore
    // Note: We assume questions are in a top-level collection with exam_id or a subcollection.
    // Based on the migration plan, we'll look in a collection called 'questions'.
    const examDoc = await adminDb.collection("exams").doc(examId).get();
    
    if (!examDoc.exists) return error(404, "Exam not found");
    const exam = examDoc.data()!;

    const questionsSnapshot = await adminDb.collection("questions")
      .where("exam_id", "==", examId)
      .orderBy("order_in_exam", "asc")
      .get();

    if (questionsSnapshot.empty) {
      return error(500, "Exam has no questions");
    }

    const questions = questionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 4. Calculate score
    const negativeMarkingEnabled = exam.negativeMarkingEnabled ?? false;
    const defaultMarks = exam.defaultMarksPerQuestion ?? 1;
    const defaultNegative = exam.defaultNegativeMarks ?? 0.25;

    let score = 0;
    let maxScore = 0;
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    const breakdown: QuestionBreakdown[] = [];

    for (const q of (questions as any[])) {
      const marksForQ = q.marks ?? defaultMarks;
      const negativeForQ = q.negativeMarks ?? (negativeMarkingEnabled ? defaultNegative : 0);

      maxScore += marksForQ;

      const selectedAnswer = answers.hasOwnProperty(q.id) ? answers[q.id] : null;

      let marksAwarded = 0;
      let isCorrect = false;

      if (selectedAnswer === null || selectedAnswer === undefined) {
        unanswered++;
      } else if (selectedAnswer === q.correct_option) {
        marksAwarded = marksForQ;
        isCorrect = true;
        correct++;
      } else {
        marksAwarded = negativeMarkingEnabled ? -negativeForQ : 0;
        incorrect++;
      }

      score += marksAwarded;

      breakdown.push({
        questionId: q.id,
        selectedAnswer,
        correctAnswer: q.correct_option,
        isCorrect,
        marksAwarded,
      });
    }

    score = Math.max(0, score);
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 10000) / 100 : 0;
    const passed = percentage >= (exam.passing_score ?? 40);

    // 5. Persist attempt
    const attemptData = {
      exam_id: examId,
      exam_title: exam.title, // Denormalize title for dashboard
      user_id: userId,
      score,
      total_marks: maxScore,
      percentage,
      time_spent_seconds: Math.min(time_spent_seconds, (exam.duration_minutes || 60) * 60),
      answers_json: { breakdown, raw_answers: answers },
      attempted_at: new Date().toISOString()
    };

    const attemptRef = await adminDb.collection("exam_attempts").add(attemptData);

    // 6. Atomic Leaderboard Update
    const lbRef = adminDb.collection("leaderboard").doc(`${userId}_${examId}`);
    
    await adminDb.runTransaction(async (transaction) => {
      const lbDoc = await transaction.get(lbRef);
      const existingLB = lbDoc.data();
      const shouldUpdateBest = !lbDoc.exists || (existingLB?.percentage ?? 0) < percentage;

      transaction.set(lbRef, {
        user_id: userId,
        exam_id: examId,
        last_attempt: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...(shouldUpdateBest ? { score, percentage } : (existingLB || {}))
      }, { merge: true });
    });

    // 7. Return result
    return NextResponse.json(
      {
        success: true,
        attempt_id: attemptRef.id,
        correct_count: correct,
        total: questions.length,
        percentage,
        result: { id: attemptRef.id, ...attemptData },
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("Critical submission failure:", e);
    return error(500, e.message || "Internal server error");
  }
}

function error(status: number, message: string) {
  return NextResponse.json({ success: false, error: message }, { status });
}
