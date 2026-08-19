import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

interface SubmitBody {
  answers: Record<string, string>;
  time_spent_seconds?: number;
}

interface QuestionBreakdown {
  questionId: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  explanation: string | null;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  marksAwarded: number;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: examId } = await params;

    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ success: false, error: "Missing auth token" }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (e) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 });
    }
    const userId = decodedToken.uid;

    // Verify user is enrolled in this exam
    const enrollmentSnap = await adminDb.collection('enrollments')
      .where('user_id', '==', userId)
      .where('exam_id', '==', examId)
      .limit(1)
      .get();

    if (enrollmentSnap.empty) {
      return NextResponse.json({ success: false, error: "Not enrolled in this exam" }, { status: 403 });
    }

    // Fetch user's displayName from users collection
    const userSnap = await adminDb.collection("users").doc(userId).get();
    const displayName = userSnap.exists
      ? (userSnap.data()?.displayName ?? userSnap.data()?.name ?? decodedToken.name ?? "Student")
      : (decodedToken.name || "Student");

    let body: SubmitBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const { answers = {}, time_spent_seconds = 0 } = body;

    const examRef = adminDb.collection('exams').doc(examId);
    const examSnap = await examRef.get();
    if (!examSnap.exists) return NextResponse.json({ success: false, error: "Exam not found" }, { status: 404 });
    const exam = examSnap.data() || {};

    const questionsRes = await adminDb.collection('questions')
      .where('exam_id', '==', examId)
      .get();
    
    if (questionsRes.empty) {
      return NextResponse.json({ success: false, error: "Exam has no questions" }, { status: 500 });
    }

    const questions = questionsRes.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => ((a as any).order_in_exam || 0) - ((b as any).order_in_exam || 0));

    const negativeMarkingEnabled = exam.negativeMarkingEnabled ?? false;
    const defaultMarks = exam.defaultMarksPerQuestion ?? 1;
    const defaultNegative = exam.defaultNegativeMarks ?? 0.25;

    let score = 0;
    let maxScore = 0;
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    const breakdown: QuestionBreakdown[] = [];

    for (const q of questions) {
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
        question_text: q.question_text ?? "",
        option_a: q.option_a ?? "",
        option_b: q.option_b ?? "",
        option_c: q.option_c ?? "",
        option_d: q.option_d ?? "",
        explanation: q.explanation ?? null,
        selectedAnswer,
        correctAnswer: q.correct_option,
        isCorrect,
        marksAwarded,
      });
    }

    score = Math.max(0, score);
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 10000) / 100 : 0;

    const attemptData = {
      exam_id: examId,
      exam_title: exam.title,
      user_id: userId,
      user_name: displayName,
      displayName, // Ensure it's in the attempt doc too
      score,
      total_marks: maxScore,
      percentage,
      time_spent_seconds: Math.min(time_spent_seconds, (exam.duration_minutes || 60) * 60),
      answers_json: { breakdown, raw_answers: answers },
      attempted_at: new Date().toISOString()
    };

    const attemptRef = await adminDb.collection('exam_attempts').add(attemptData);

    // Use transaction to atomically update/create leaderboard entry
    await adminDb.runTransaction(async (transaction) => {
      const lbQuery = await transaction.get(
        adminDb.collection('leaderboard')
          .where('user_id', '==', userId)
          .where('exam_id', '==', examId)
          .limit(1)
      );

      if (lbQuery.empty) {
        await transaction.set(adminDb.collection('leaderboard').doc(), {
          user_id: userId,
          user_name: displayName,
          displayName: displayName,
          exam_id: examId,
          score,
          percentage,
          attempts: 1,
          last_attempt: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      } else {
        const lbDoc = lbQuery.docs[0];
        const existingData = lbDoc.data();
        const shouldUpdateBest = (existingData.percentage || 0) < percentage;

        transaction.update(lbDoc.ref, {
          user_name: displayName,
          displayName: displayName,
          attempts: (existingData.attempts || 0) + 1,
          last_attempt: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...(shouldUpdateBest ? { score, percentage } : {})
        });
      }
    });

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
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
