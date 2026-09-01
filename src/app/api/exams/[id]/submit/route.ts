import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { gradeAttempt, updateLeaderboard } from "@/lib/grading";
import { addCredits, CREDIT_REWARDS } from "@/lib/entitlements";
import { issueCertificate } from "@/lib/certificates";
import {
  getExamSession,
  markSessionSubmitted,
  resolveOption,
  buildIntegritySignals,
} from "@/lib/exam-session";

export const dynamic = "force-dynamic";

interface SubmitBody {
  answers: Record<string, string>;
  attachments?: Record<string, string[]>;
  time_spent_seconds?: number;
  /** Issued by POST /api/exams/[id]/questions when the attempt started. */
  session_id?: string;
  /** Focus-loss telemetry, recorded as a signal for staff, never an accusation. */
  blur_count?: number;
  longest_blur_seconds?: number;
}

interface QuestionBreakdown {
  questionId: string;
  type: "mcq" | "written";
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
  fullMarks: number;
  /** Carried onto the attempt so analytics can group without re-reading questions. */
  topic: string | null;
  difficulty: string | null;
  // Written-question fields
  writtenAnswer?: string | null;
  modelAnswer?: string | null;
  rubric?: string | null;
  grading_status?: "pending" | "complete" | "unavailable";
  strengths?: string[];
  gaps?: string[];
  nextStep?: string;
  concepts?: string[];
  attachmentUrls?: string[];
  teacherReviewed?: boolean;
  teacherFeedback?: string | null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: examId } = await params;

    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ success: false, error: "Missing auth token" }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
      if (!decodedToken) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Firebase Admin SDK not initialized. Configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local",
          },
          { status: 500 }
        );
      }
    } catch (e: any) {
      console.error("Token verification error:", e.message);
      return NextResponse.json(
        { success: false, error: "Invalid or expired token. Ensure Firebase Admin credentials are configured." },
        { status: 401 }
      );
    }
    const userId = decodedToken.uid;

    // Auto-enroll the user if this is their first attempt at this exam.
    // There's no separate "enroll" step anywhere in the app — every exam is
    // public — so enrollment is just a record of participation, created
    // transparently on first submission rather than gating it.
    const enrollmentSnap = await adminDb
      .collection("enrollments")
      .where("user_id", "==", userId)
      .where("exam_id", "==", examId)
      .limit(1)
      .get();

    if (enrollmentSnap.empty) {
      await adminDb.collection("enrollments").add({
        user_id: userId,
        exam_id: examId,
        enrolled_at: new Date().toISOString(),
      });
    }

    const userSnap = await adminDb.collection("users").doc(userId).get();
    const displayName = userSnap.exists
      ? userSnap.data()?.displayName ?? userSnap.data()?.name ?? decodedToken.name ?? "Student"
      : decodedToken.name || "Student";

    let body: SubmitBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const {
      answers = {},
      attachments = {},
      time_spent_seconds = 0,
      session_id,
      blur_count = 0,
      longest_blur_seconds = 0,
    } = body;

    // Timing and option order come from the server-side session when one
    // exists. Without it, the client is the only source for elapsed time —
    // which is exactly the weakness the session removes.
    const session = session_id ? await getExamSession(session_id) : null;

    if (session) {
      if (session.user_id !== userId || session.exam_id !== examId) {
        return NextResponse.json({ success: false, error: "Session does not match this attempt" }, { status: 403 });
      }
      if (session.submitted) {
        return NextResponse.json({ success: false, error: "This attempt was already submitted" }, { status: 409 });
      }
    }

    const integrity = session
      ? buildIntegritySignals(session, Number(time_spent_seconds) || 0, Number(blur_count) || 0, Number(longest_blur_seconds) || 0)
      : null;

    const examSnap = await adminDb.collection("exams").doc(examId).get();
    if (!examSnap.exists) {
      return NextResponse.json({ success: false, error: "Exam not found" }, { status: 404 });
    }
    const exam = examSnap.data() || {};

    const questionsRes = await adminDb.collection("questions").where("exam_id", "==", examId).get();
    if (questionsRes.empty) {
      return NextResponse.json({ success: false, error: "Exam has no questions" }, { status: 500 });
    }

    const questions = questionsRes.docs
      .map((doc: any) => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => (a.order_in_exam || 0) - (b.order_in_exam || 0));

    const negativeMarkingEnabled = exam.negativeMarkingEnabled ?? false;
    const defaultMarks = exam.defaultMarksPerQuestion ?? 1;
    const defaultNegative = exam.defaultNegativeMarks ?? 0.25;

    let score = 0;
    let maxScore = 0;
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    let pendingWritten = 0;
    const breakdown: QuestionBreakdown[] = [];

    for (const q of questions) {
      const marksForQ = q.marks ?? defaultMarks;
      const negativeForQ = q.negativeMarks ?? (negativeMarkingEnabled ? defaultNegative : 0);
      const isWritten = q.type === "written";

      maxScore += marksForQ;

      const rawAnswer = Object.prototype.hasOwnProperty.call(answers, q.id) ? answers[q.id] : null;
      // The student picked a display position; translate it back to the real
      // option key for this session's shuffle before comparing.
      const selectedAnswer =
        session && q.type !== "written" ? resolveOption(session, q.id, rawAnswer) : rawAnswer;
      const attachmentUrls = Array.isArray(attachments[q.id]) ? attachments[q.id] : [];

      if (isWritten) {
        const answerText = selectedAnswer ? String(selectedAnswer) : "";
        const isBlank = !answerText.trim() && attachmentUrls.length === 0;

        if (isBlank) unanswered++;
        else pendingWritten++;

        // Written answers are scored by the grader that runs after this
        // response is sent, so nothing here blocks the student's results.
        breakdown.push({
          questionId: q.id,
          type: "written",
          question_text: q.question_text ?? "",
          option_a: "",
          option_b: "",
          option_c: "",
          option_d: "",
          explanation: null,
          selectedAnswer: isBlank ? null : answerText,
          correctAnswer: "",
          isCorrect: false,
          marksAwarded: 0,
          fullMarks: marksForQ,
          topic: q.topic ?? null,
          difficulty: q.difficulty ?? null,
          writtenAnswer: isBlank ? null : answerText,
          modelAnswer: q.model_answer ?? null,
          rubric: q.rubric ?? null,
          grading_status: "pending",
          strengths: [],
          gaps: [],
          nextStep: "",
          concepts: [],
          attachmentUrls,
          teacherReviewed: false,
          teacherFeedback: null,
        });
        continue;
      }

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
        type: "mcq",
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
        fullMarks: marksForQ,
        topic: q.topic ?? null,
        difficulty: q.difficulty ?? null,
      });
    }

    score = Math.max(0, score);
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 10000) / 100 : 0;
    const gradingStatus = pendingWritten > 0 ? "pending" : "complete";

    const attemptData = {
      exam_id: examId,
      exam_title: exam.title,
      user_id: userId,
      user_name: displayName,
      displayName,
      score,
      total_marks: maxScore,
      percentage,
      // Counts exclude written answers until grading finishes; the grader
      // recomputes score and percentage when it completes.
      correct_count: correct,
      incorrect_count: incorrect,
      unanswered_count: unanswered,
      pending_written: pendingWritten,
      grading_status: gradingStatus,
      time_spent_seconds: Math.min(
        integrity ? integrity.serverElapsedSeconds : time_spent_seconds,
        (exam.duration_minutes || 60) * 60
      ),
      ...(integrity ? { integrity_signals: integrity } : {}),
      session_id: session_id ?? null,
      answers_json: { breakdown, raw_answers: answers },
      attempted_at: new Date().toISOString(),
    };

    const attemptRef = await adminDb.collection("exam_attempts").add(attemptData);

    if (session_id && session) {
      // Marks the session spent, so the same session cannot be submitted twice.
      await markSessionSubmitted(session_id).catch((err) =>
        console.error("Failed to close exam session:", err)
      );
    }

    // Seed the leaderboard from the MCQ score; the grader corrects it once
    // written marks are known.
    await updateLeaderboard({
      userId,
      examId,
      displayName,
      score,
      percentage,
      countAttempt: true,
    });

    // Studying earns credits — this is how a diligent student keeps access to
    // the AI tutor without paying.
    after(async () => {
      try {
        await addCredits(userId, CREDIT_REWARDS.exam_completed, `exam:${examId}`);
      } catch (err) {
        console.error("Failed to award completion credits:", err);
      }
    });

    // Grade written answers after the response is sent, so submit latency no
    // longer scales with the number of written questions. The certificate check
    // runs afterwards, once the score is final.
    after(async () => {
      try {
        if (pendingWritten > 0) await gradeAttempt(attemptRef.id);
      } catch (err) {
        console.error("Background grading failed:", err);
      }

      try {
        // issueCertificate re-reads the graded attempts and decides eligibility
        // itself, and is idempotent, so calling it on every submit is safe.
        await issueCertificate(userId, examId);
      } catch (err) {
        console.error("Certificate issue check failed:", err);
      }
    });

    return NextResponse.json(
      {
        success: true,
        attempt_id: attemptRef.id,
        correct_count: correct,
        total: questions.length,
        percentage,
        grading_status: gradingStatus,
        pending_written: pendingWritten,
        result: { id: attemptRef.id, ...attemptData },
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("Critical submission failure:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
