"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  X,
  Minus,
  Loader2,
  GraduationCap,
  HelpCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { auth } from "@/lib/firebase";

/**
 * Sarthi — the study companion that stays with the student.
 *
 * Mounted once in the app shell rather than opened per page, so a conversation
 * survives navigation: a student can ask about a question, walk to their
 * analytics, and keep the same thread.
 *
 * Two modes matter here. "Explain" teaches from scratch and is the default,
 * because the Socratic-only tutor that shipped first was useless to a student
 * who had not started a subject — it refused to explain anything. "Socratic"
 * is the old behaviour, for when they already know the basics and want to be
 * pushed.
 */

interface ChatMessage {
  id: string;
  sender: "user" | "sarthi";
  text: string;
}

type Mode = "explain" | "socratic";

const GREETING: ChatMessage = {
  id: "greeting",
  sender: "sarthi",
  text: "Namaste! I'm Sarthi. Ask me anything about what you're studying — I'll explain it from the beginning, no assumed knowledge. If you'd rather be quizzed than told, switch to Socratic mode above.",
};

/** A short description of where the student is, so replies land in context. */
function describeRoute(pathname: string): string | undefined {
  if (pathname.startsWith("/exams/") && pathname.endsWith("/take")) return "sitting a mock exam";
  if (pathname.startsWith("/exams/results")) return "reviewing their exam results";
  if (pathname.startsWith("/practice")) return "doing an adaptive practice set";
  if (pathname.startsWith("/analytics")) return "looking at their performance analytics";
  if (pathname.startsWith("/notes")) return "reading study notes";
  if (pathname.startsWith("/flashcards")) return "revising flashcards";
  if (pathname.startsWith("/study-plan")) return "planning their study schedule";
  return undefined;
}

export function Sarthi() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [mode, setMode] = useState<Mode>("explain");
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => auth.onAuthStateChanged((user) => setSignedIn(Boolean(user))), []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;

    const user = auth.currentUser;
    if (!user) {
      setError("Please sign in to talk to Sarthi.");
      return;
    }

    const outgoing: ChatMessage = { id: `u-${Date.now()}`, sender: "user", text };
    const history = [...messages, outgoing];
    setMessages(history);
    setInput("");
    setBusy(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          mode,
          topic: describeRoute(pathname),
          messages: history
            // The greeting is scene-setting, not part of the conversation.
            .filter((m) => m.id !== "greeting")
            .map((m) => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text })),
        }),
      });

      const data = await res.json();

      // Running out of credits is an expected state, not a failure.
      if (res.status === 402) {
        setError(data.message ?? "You're out of tutor credits.");
        return;
      }
      if (!res.ok) throw new Error(data.error ?? "Sarthi is unavailable right now.");

      setCredits(typeof data.creditsRemaining === "number" ? data.creditsRemaining : null);
      setMessages((prev) => [...prev, { id: `s-${Date.now()}`, sender: "sarthi", text: data.reply }]);
    } catch (err) {
      console.error("Sarthi error:", err);
      setError("Sarthi is unavailable right now. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  }, [input, busy, messages, mode, pathname]);

  // Only for signed-in students: the tutor costs credits and needs an identity.
  if (!signedIn) return null;

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setOpen(true)}
            aria-label="Open Sarthi, your study companion"
            className="fixed bottom-5 right-5 z-50 print:hidden flex items-center gap-2 px-4 py-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Sarthi</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            role="dialog"
            aria-label="Sarthi study companion"
            className="fixed bottom-5 right-5 z-50 print:hidden w-[min(92vw,26rem)] h-[min(80vh,34rem)] rounded-xl border border-zinc-200 bg-white shadow-2xl flex flex-col overflow-hidden"
          >
            <header className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-200 text-primary-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-zinc-900 leading-tight">Sarthi</p>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {credits === null ? "Your study companion" : `${credits} credits left`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Minimise Sarthi"
                className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50"
              >
                <Minus className="w-4 h-4" />
              </button>
            </header>

            <div className="px-4 py-2 border-b border-zinc-100 flex gap-1.5">
              {(
                [
                  { id: "explain", label: "Explain it", icon: GraduationCap },
                  { id: "socratic", label: "Quiz me", icon: HelpCircle },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  aria-pressed={mode === id}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[11px] font-semibold transition-colors ${
                    mode === id
                      ? "bg-primary-50 border-primary-300 text-primary-700"
                      : "bg-white border-zinc-200 text-zinc-500 hover:border-primary-300"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`text-sm leading-relaxed rounded-lg px-3 py-2 whitespace-pre-wrap ${
                    m.sender === "user"
                      ? "bg-primary-600 text-white ml-8"
                      : "bg-zinc-50 border border-zinc-100 text-zinc-700 mr-4"
                  }`}
                >
                  {m.text}
                </div>
              ))}

              {busy && (
                <div className="flex items-center gap-2 text-xs text-zinc-400 mr-4">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {mode === "explain" ? "Working through it…" : "Thinking of a question…"}
                </div>
              )}

              {error && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="p-3 border-t border-zinc-100 flex items-end gap-2"
            >
              <label htmlFor="sarthi-input" className="sr-only">
                Ask Sarthi a question
              </label>
              <textarea
                id="sarthi-input"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={
                  mode === "explain" ? "What should I explain?" : "What shall I quiz you on?"
                }
                className="flex-1 resize-none rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-600/10 max-h-28"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="p-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-40 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sarthi;
