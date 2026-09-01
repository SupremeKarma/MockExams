"use client";

import { useState, useRef, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Bot,
  Check,
  Copy,
  RotateCcw,
  Menu,
  X,
  Target,
  Award,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  copiedCode?: boolean;
}

interface SampleQuestion {
  id: string;
  subject: string;
  category: string;
  question: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const SAMPLE_QUESTIONS: SampleQuestion[] = [
  {
    id: "1",
    subject: "Programming in C",
    category: "Pointers & Memory",
    question: "Explain how pointer arithmetic works in C and when it's useful.",
    difficulty: "Medium",
  },
  {
    id: "2",
    subject: "Data Structures",
    category: "Trees",
    question: "What is the difference between AVL trees and Red-Black trees?",
    difficulty: "Hard",
  },
  {
    id: "3",
    subject: "Mathematics",
    category: "Calculus",
    question: "How do I solve partial fractions integration?",
    difficulty: "Medium",
  },
  {
    id: "4",
    subject: "Database",
    category: "Normalization",
    question: "Explain BCNF and why it's important in database design.",
    difficulty: "Hard",
  },
  {
    id: "5",
    subject: "Microcontroller",
    category: "Interrupts",
    question: "How do interrupt handlers work in 8051 microcontroller?",
    difficulty: "Medium",
  },
];

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content:
        "Hello! I'm your AI Socratic Tutor. I'll help you master programming, data structures, mathematics, and more through guided questioning and deeper explanations. Ask me anything - let's learn together!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [showSidebar, setShowSidebar] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const subjects = ["All", "Programming in C", "Data Structures", "Mathematics", "Database", "Microcontroller"];

  const filteredQuestions =
    selectedSubject === "All"
      ? SAMPLE_QUESTIONS
      : SAMPLE_QUESTIONS.filter((q) => q.subject === selectedSubject);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string): Promise<void> => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const history = [...messages, userMessage];
    setMessages(history);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError("Please sign in to talk to the tutor.");
        return;
      }
      const idToken = await currentUser.getIdToken();

      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          topic: selectedSubject !== "All" ? selectedSubject : undefined,
        }),
      });

      const data = await res.json();

      // Running out of credits is an expected state, not a failure.
      if (res.status === 402) {
        setError(data.message ?? "You are out of tutor credits.");
        return;
      }

      if (!res.ok) {
        throw new Error(data.error ?? "Tutor request failed");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setError("The tutor is unavailable right now. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    setMessages([
      {
        id: "0",
        role: "assistant",
        content:
          "Hello! I'm your AI Socratic Tutor. I'll help you master programming, data structures, mathematics, and more through guided questioning and deeper explanations. Ask me anything - let's learn together!",
        timestamp: new Date(),
      },
    ]);
    setInputValue("");
  };

  return (
    <div className="min-h-screen bg-zinc-50/40 pt-8 pb-20">
      <div className="max-w-7xl mx-auto h-full flex gap-5 px-4 sm:px-6 lg:px-8">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="hidden lg:flex lg:w-80 flex-col gap-6"
            >
              {/* Subject Filter */}
              <div className="p-6 rounded-lg bg-white border border-zinc-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary-600" />
                  <h3 className="font-bold text-zinc-900">Filter by Subject</h3>
                </div>
                <div className="space-y-2">
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`w-full px-4 py-2.5 rounded-lg text-xs font-bold transition-all border text-left ${
                        selectedSubject === subject
                          ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                          : "bg-white text-zinc-700 hover:bg-zinc-50 border-zinc-200"
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Questions */}
              <div className="p-6 rounded-lg bg-white border border-zinc-200 shadow-sm space-y-4 flex-1 overflow-y-auto">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-zinc-900">Sample Questions</h3>
                </div>
                <div className="space-y-2">
                  {filteredQuestions.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => handleQuickQuestion(q.question)}
                      className="w-full p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-left transition-all group"
                    >
                      <p className="text-xs font-bold text-zinc-900 line-clamp-2 group-hover:text-primary-600">
                        {q.question}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] px-2 py-1 rounded-md bg-primary-50 text-primary-700 font-bold">
                          {q.subject}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-1 rounded-md font-bold ${
                            q.difficulty === "Easy"
                              ? "bg-emerald-50 text-emerald-700"
                              : q.difficulty === "Medium"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Card */}
              <div className="p-5 rounded-lg bg-white border border-zinc-200 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary-600" />
                  Your progress
                </h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 text-xs">Questions answered</span>
                    <span className="font-semibold text-primary-600 text-xs tabular-nums">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 text-xs">Topics mastered</span>
                    <span className="font-semibold text-emerald-600 text-xs tabular-nums">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 text-xs">Study streak</span>
                    <span className="font-semibold text-amber-600 text-xs tabular-nums">6 days</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col gap-4 min-h-screen">
          {/* Header */}
          <div className="sticky top-20 z-30 flex items-center justify-between p-5 rounded-lg bg-white border border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-zinc-900">AI Socratic Tutor</h1>
                <p className="text-xs text-zinc-500">Live & Interactive Learning</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-2 rounded-lg hover:bg-zinc-100 border border-zinc-200 text-zinc-600 transition-all"
                title="Start new conversation"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 rounded-lg hover:bg-zinc-100 border border-zinc-200 text-zinc-600 transition-all lg:hidden"
              >
                {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto space-y-4 pb-4">
            {messages.map((message, idx) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary-600" />
                  </div>
                )}

                <div
                  className={`max-w-md rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-primary-600 text-white rounded-br-none"
                      : "bg-white border border-zinc-200 text-zinc-900 rounded-bl-none shadow-sm"
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </div>

                  {message.role === "assistant" && message.content.includes("```") && (
                    <button
                      onClick={() => handleCopyCode(message.content, message.id)}
                      className="mt-2 text-xs px-2 py-1 rounded-md bg-zinc-100 text-zinc-700 font-bold hover:bg-zinc-200 flex items-center gap-1"
                    >
                      {copiedId === message.id ? (
                        <>
                          <Check className="w-3 h-3" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy Code
                        </>
                      )}
                    </button>
                  )}

                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-600 animate-pulse" />
                </div>
                <div className="bg-white border border-zinc-200 rounded-lg rounded-bl-none p-4 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="space-y-3 p-6 rounded-lg bg-white border border-zinc-200 shadow-sm">
            {error && (
              <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }
                }}
                placeholder="Ask me anything about programming, math, or any subject... (Shift+Enter for new line)"
                className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 placeholder:text-zinc-400"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                className="px-4 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all flex items-center gap-2 shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-500">
              💡 Tip: This AI tutor uses Socratic questioning to help you discover answers yourself. Ask follow-up
              questions if you need clarification!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
