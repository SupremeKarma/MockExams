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
  { params }: { params: any }
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

    let body: SubmitBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const { answers = {}, time_spent_seconds = 0 } = body;

    // Hardcoded Mock Data for Demo
    if (examId === "real-ioe-entrance") {
        const mockQuestions = [
        { id: "q1", correct_option: "c", marks: 1, question_text: "A force F = (5i + 3j + 2k) N moves a particle from r1 = (2i + j) m to r2 = (4i + 3j - k) m. The work done by the force is:", option_a: "10 J", option_b: "12 J", option_c: "14 J", option_d: "15 J", explanation: "Work = F·Δr = (5)(2) + (3)(2) + (2)(-1) = 10 + 6 - 2 = 14 J" },
        { id: "q2", correct_option: "d", marks: 1, question_text: "The escape velocity of a body from the earth's surface depends upon:", option_a: "The mass of the body", option_b: "The direction of projection", option_c: "The height of projection", option_d: "The mass and radius of the planet", explanation: "Escape velocity v = √(2GM/R) depends only on the planet's mass M and radius R, not on the body's mass or direction." },
        { id: "q3", correct_option: "c", marks: 1, question_text: "In a Young's double slit experiment, if the distance between the slits is halved and the distance between the slits and the screen is doubled, the fringe width will be:", option_a: "Unchanged", option_b: "Doubled", option_c: "Four times", option_d: "Eight times", explanation: "Fringe width β = λD/d. If d→d/2 and D→2D, then β→λ(2D)/(d/2) = 4λD/d = 4β." },
        { id: "q4", correct_option: "b", marks: 1, question_text: "The dimension of Planck's constant (h) is equivalent to:", option_a: "Linear Momentum", option_b: "Angular Momentum", option_c: "Energy", option_d: "Power", explanation: "h has dimensions of energy × time = ML²T⁻¹, same as angular momentum (mvr = ML²T⁻¹)." },
        { id: "q5", correct_option: "b", marks: 1, question_text: "If z = (1+i)/(1-i), then |z| is equal to:", option_a: "0", option_b: "1", option_c: "2", option_d: "i", explanation: "|z| = |1+i|/|1-i| = √2/√2 = 1." },
        { id: "q6", correct_option: "a", marks: 1, question_text: "The derivative of log(sec x) with respect to x is:", option_a: "tan x", option_b: "sec x", option_c: "cot x", option_d: "cos x", explanation: "d/dx[log(sec x)] = (1/sec x) · sec x · tan x = tan x." },
        { id: "q7", correct_option: "a", marks: 1, question_text: "Which of the following describes the behavior of an ideal gas at absolute zero temperature?", option_a: "Molecules cease to move", option_b: "Volume becomes infinite", option_c: "Pressure becomes infinite", option_d: "Entropy reaches maximum", explanation: "At absolute zero (0 K), the kinetic energy of ideal gas molecules approaches zero, meaning molecular motion ceases." },
        { id: "q8", correct_option: "b", marks: 1, question_text: "The half-life of a radioactive element is 10 days. The fraction of the element left after 20 days is:", option_a: "1/2", option_b: "1/4", option_c: "1/8", option_d: "3/4", explanation: "After 2 half-lives (20 days), fraction remaining = (1/2)² = 1/4." },
        { id: "q9", correct_option: "a", marks: 1, question_text: "The specific heat capacity of water is approximately:", option_a: "4200 J/kg·K", option_b: "2100 J/kg·K", option_c: "1000 J/kg·K", option_d: "4.2 J/kg·K", explanation: "The specific heat capacity of water is approximately 4200 J/kg·K (or 4.2 J/g·K)." },
        { id: "q10", correct_option: "d", marks: 1, question_text: "In a triangle ABC, if a=3, b=4, and c=5, the angle C is:", option_a: "30 degrees", option_b: "45 degrees", option_c: "60 degrees", option_d: "90 degrees", explanation: "Since 3² + 4² = 9 + 16 = 25 = 5², this is a right triangle with C = 90°." },
      ];

      let score = 0;
      let correct = 0;
      const breakdown: QuestionBreakdown[] = [];

      for (const q of mockQuestions) {
        const selected = answers[q.id];
        const isCorrect = selected === q.correct_option;
        if (isCorrect) {
          score += q.marks;
          correct++;
        } else if (selected) {
          score -= 0.25; // Default negative marking
        }
        breakdown.push({
          questionId: q.id,
          question_text: q.question_text,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          explanation: q.explanation,
          selectedAnswer: selected || null,
          correctAnswer: q.correct_option,
          isCorrect,
          marksAwarded: isCorrect ? q.marks : (selected ? -0.25 : 0)
        });
      }

      const percentage = (Math.max(0, score) / mockQuestions.length) * 100;

      return NextResponse.json({
        success: true,
        attempt_id: "mock-attempt-" + Date.now(),
        correct_count: correct,
        total: mockQuestions.length,
        percentage,
        result: {
          exam_title: "IOE Entrance Model Exam 2081",
          score,
          total_marks: mockQuestions.length,
          percentage,
          time_spent_seconds,
          answers_json: { breakdown }
        }
      });
    }

    const examRef = adminDb.collection('exams').doc(examId);
    const questionsRes = await adminDb.collection('questions')
      .where('exam_id', '==', examId)
      .orderBy('order_in_exam', 'asc')
      .get();
    
    const examSnap = await examRef.get();

    if (!examSnap.exists) return NextResponse.json({ success: false, error: "Exam not found" }, { status: 404 });
    const exam = examSnap.data();
    if (!exam) return NextResponse.json({ success: false, error: "Exam data empty" }, { status: 500 });

    if (questionsRes.empty) {
      return NextResponse.json({ success: false, error: "Exam has no questions" }, { status: 500 });
    }

    const questions = questionsRes.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

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
      user_name: decodedToken.name || decodedToken.email?.split('@')[0] || "Student",
      score,
      total_marks: maxScore,
      percentage,
      time_spent_seconds: Math.min(time_spent_seconds, (exam.duration_minutes || 60) * 60),
      answers_json: { breakdown, raw_answers: answers },
      attempted_at: new Date().toISOString()
    };

    const attemptRef = await adminDb.collection('exam_attempts').add(attemptData);

    const lbQuery = await adminDb.collection('leaderboard')
      .where('user_id', '==', userId)
      .where('exam_id', '==', examId)
      .limit(1)
      .get();
    
    if (lbQuery.empty) {
      await adminDb.collection('leaderboard').add({
        user_id: userId,
        user_name: attemptData.user_name,
        exam_id: examId,
        score,
        percentage,
        last_attempt: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } else {
      const lbDoc = lbQuery.docs[0];
      const existingData = lbDoc.data();
      const shouldUpdateBest = existingData.percentage < percentage;

      await lbDoc.ref.update({
        user_name: attemptData.user_name,
        last_attempt: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...(shouldUpdateBest ? { score, percentage } : {})
      });
    }

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
    return NextResponse.json({ success: false, error: e.message || "Internal server error" }, { status: 500 });
  }
}
