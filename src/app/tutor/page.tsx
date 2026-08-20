"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  MessageCircle,
  Bot,
  Brain,
  BookOpen,
  Lightbulb,
  Check,
  Copy,
  RotateCcw,
  Menu,
  X,
  ChevronDown,
  Target,
  Award,
  Clock,
  Zap,
  Code2,
} from "lucide-react";
import Link from "next/link";

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

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response with Socratic approach
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me guide you through this step by step. First, can you tell me what you already know about this concept?",
        "Interesting! Before I explain, let me ask you: what do you think is the key insight here? What would happen if we changed this parameter?",
        "Excellent inquiry! This touches on a fundamental principle. Let me help you build understanding: What's the underlying mechanism that makes this work?",
        "I see where you're going with this! Let me break it down:\n\n1. The foundational concept is...\n2. The practical application involves...\n3. Common pitfalls to avoid:\n   - Mistake 1\n   - Mistake 2\n\nDoes this clarify things?",
        "Great question! Here's a worked example:\n\n```c\n// Example code\nint result = function();\nreturn result;\n```\n\nNotice how this demonstrates the principle? What would change if we modified X?",
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800);
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
    <div className="min-h-screen bg-mesh text-slate-900 pt-28 pb-24">
      <div className="max-w-7xl mx-auto h-full flex gap-6 px-4 sm:px-6 lg:px-8">
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
              <div className="p-6 rounded-lg bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900">Filter by Subject</h3>
                </div>
                <div className="space-y-2">
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`w-full px-4 py-2.5 rounded-lg text-xs font-bold transition-all border text-left ${
                        selectedSubject === subject
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Questions */}
              <div className="p-6 rounded-lg bg-white border border-slate-200 shadow-sm space-y-4 flex-1 overflow-y-auto">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-slate-900">Sample Questions</h3>
                </div>
                <div className="space-y-2">
                  {filteredQuestions.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => handleQuickQuestion(q.question)}
                      className="w-full p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all group"
                    >
                      <p className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600">
                        {q.question}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 font-bold">
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
              <div className="p-6 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  Your Progress
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Questions Answered</span>
                    <span className="font-bold text-indigo-600">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Topics Mastered</span>
                    <span className="font-bold text-emerald-600">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Study Streak</span>
                    <span className="font-bold text-amber-600">6 days</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col gap-4 min-h-screen">
          {/* Header */}
          <div className="sticky top-28 z-30 flex items-center justify-between p-6 rounded-lg bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900">AI Socratic Tutor</h1>
                <p className="text-xs text-slate-500">Live & Interactive Learning</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-2 rounded-lg hover:bg-slate-100 border border-slate-200 text-slate-600 transition-all"
                title="Start new conversation"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 rounded-lg hover:bg-slate-100 border border-slate-200 text-slate-600 transition-all lg:hidden"
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
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-indigo-600" />
                  </div>
                )}

                <div
                  className={`max-w-md rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white border border-slate-200 text-slate-900 rounded-bl-none shadow-sm"
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </div>

                  {message.role === "assistant" && message.content.includes("```") && (
                    <button
                      onClick={() => handleCopyCode(message.content, message.id)}
                      className="mt-2 text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 flex items-center gap-1"
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
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-indigo-600 animate-pulse" />
                </div>
                <div className="bg-white border border-slate-200 rounded-lg rounded-bl-none p-4 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="space-y-3 p-6 rounded-lg bg-white border border-slate-200 shadow-sm">
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
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                className="px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all flex items-center gap-2 shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              💡 Tip: This AI tutor uses Socratic questioning to help you discover answers yourself. Ask follow-up
              questions if you need clarification!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
