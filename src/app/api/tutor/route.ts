import { NextRequest, NextResponse } from "next/server";
import { callGemini, GeminiContent } from "@/lib/gemini";
import { askSupreme, isSupremeAskConfigured, SupremeAskError } from "@/lib/supremeAsk";
import { adminAuth } from "@/lib/firebase-admin";
import { spendCredits, CREDIT_COSTS, CREDIT_REWARDS } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

const SOCRATIC_PROMPT = `You are Sarthi, the study companion for MockExams, an exam-prep platform covering programming, data structures, mathematics, databases, and microcontrollers.

Your teaching method is strictly Socratic:
1. Never state a final answer or complete solution outright, even if asked directly.
2. Respond to the student's message with a guiding question that pushes them toward the answer themselves.
3. Ground each question in what the student just said - reference their specific words, code, or reasoning.
4. Break large problems into a sequence of smaller questions rather than one big question.
5. When the student is right, confirm briefly and ask a follow-up question that deepens or extends their understanding.
6. When the student is wrong or stuck, don't correct them directly - ask a question that exposes the gap or contradiction in their thinking (e.g. "What happens when...?", "Why did you choose...?", "Can you walk me through what happens if...?").
7. If the student explicitly says they are stuck after genuine effort, or directly asks for the answer a second time, you may give a small, concrete hint (not the full answer) framed as a narrower question or a single nudge, then immediately return to questioning.
8. Keep responses short - 2 to 5 sentences, at most one code snippet only if illustrating a question, never a full solution.
9. Adapt question difficulty to the student's demonstrated level based on the conversation so far.

Never break character to explain that you are following the Socratic method - just do it.`;

const EXPLAIN_PROMPT = `You are Sarthi, the study companion for MockExams, an exam-prep platform for Nepali university students (Purbanchal University BIT, IOE entrance, NEB).

You are talking to a student who may not know the basics of this topic at all, and may be sitting their first exam. Teach them.

How to teach:
1. Start from what they actually asked, at the level they asked it. Never assume prior knowledge they have not shown.
2. Explain the concept plainly first, then give one concrete worked example.
3. Use short paragraphs. Define every technical term the first time you use it.
4. When the topic is examinable, say how it is usually asked and what an answer must contain to earn full marks.
5. End by checking understanding with one short question — but always after you have explained, never instead of explaining.
6. If they are lost, go simpler. Do not send them away to read something else.

Be direct and warm. Never refuse to explain something. A student who does not know where to start needs an answer, not a riddle.

Write plain text only. The chat panel does not render markdown, so a "###" heading or a "**bold**" marker shows up literally. Separate ideas with blank lines instead.`;

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Please sign in to use the tutor." }, { status: 401 });
    }

    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: "Your session expired. Please sign in again." }, { status: 401 });
    }
    if (!decoded) {
      return NextResponse.json({ error: "Auth is not configured on the server" }, { status: 503 });
    }

    // Checked after auth so an anonymous caller learns nothing about how the
    // service is configured. The Supreme AI gateway (/ask) is preferred when
    // configured — it's a thin passthrough, not a replacement decision: the
    // direct-Gemini path below stays as the fallback for local dev / an
    // unconfigured gateway, so this cannot regress existing deployments.
    const useSupreme = isSupremeAskConfigured();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!useSupreme && !apiKey) {
      return NextResponse.json({ error: "Tutor unavailable" }, { status: 503 });
    }

    const body = await request.json();
    const messages: ChatTurn[] = Array.isArray(body?.messages) ? body.messages : [];
    const topic: string | undefined = typeof body?.topic === "string" ? body.topic : undefined;
    // Beginners need explanation, not Socratic questioning. Explain is the
    // default because the platform's own users told us the questioning-only
    // tutor was useless when they had not started a subject.
    const mode: "explain" | "socratic" = body?.mode === "socratic" ? "socratic" : "explain";

    if (messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const cleaned = messages
      .filter(
        (m): m is ChatTurn =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
      )
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 4000) }));

    if (cleaned.length === 0) {
      return NextResponse.json({ error: "No valid messages provided" }, { status: 400 });
    }

    // Exam scores and written feedback are always free. The open-ended tutor
    // conversation is the part that costs credits — and credits are earned by
    // studying, so a diligent student never has to pay for it.
    const spend = await spendCredits(decoded.uid, CREDIT_COSTS.tutor_turn, "tutor_turn");
    if (!spend.ok) {
      return NextResponse.json(
        {
          error: "out_of_credits",
          message: `You're out of tutor credits. Earn ${CREDIT_REWARDS.exam_completed} by finishing an exam, ${CREDIT_REWARDS.daily_login} for showing up today, or go Pro for unlimited tutoring.`,
          remaining: spend.remaining,
        },
        { status: 402 }
      );
    }

    const basePrompt = mode === "socratic" ? SOCRATIC_PROMPT : EXPLAIN_PROMPT;
    const persona = topic
      ? `${basePrompt}\n\nThe student is currently working on:\n"${topic}"\n\nAnchor your reply to this specific work.`
      : basePrompt;

    let reply: string;
    if (useSupreme) {
      try {
        const result = await askSupreme({
          messages: cleaned,
          user_id: decoded.uid,
          persona,
          session_id: topic,
        });
        reply = result.answer;
      } catch (err) {
        // Gateway rejected or was unreachable — fall back to direct Gemini
        // rather than failing a request the student already spent a credit on.
        console.error("Supreme AI /ask failed, falling back to direct Gemini:", err instanceof SupremeAskError ? err.message : err);
        if (!apiKey) throw err;
        const contents: GeminiContent[] = cleaned.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));
        reply = await callGemini(apiKey, persona, contents, mode === "explain" ? 900 : 400);
      }
    } else {
      const contents: GeminiContent[] = cleaned.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));
      // Explaining properly needs more room than asking a question does.
      reply = await callGemini(apiKey!, persona, contents, mode === "explain" ? 900 : 400);
    }

    return NextResponse.json({
      reply: reply || "Can you tell me more about your thinking so far?",
      mode,
      creditsRemaining: spend.unlimited ? null : spend.remaining,
    });
  } catch (error) {
    console.error("Tutor API error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
