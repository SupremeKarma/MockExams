"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  Brain, 
  Lightbulb, 
  BookOpen, 
  CheckCircle2, 
  MessageSquare,
  RefreshCw
} from "lucide-react";
import { useState } from "react";

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextTopic?: string;
  contextCode?: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "tutor";
  text: string;
  timestamp: string;
  isHint?: boolean;
}

export function AiTutorModal({ isOpen, onClose, contextTopic, contextCode }: AiTutorModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "tutor",
      text: `Hello! I'm your Socratic AI Tutor. ${contextTopic ? `I see you're studying "${contextTopic}".` : "What concept or problem would you like to explore together?"} Instead of giving plain answers, I'll guide you step-by-step to master the core principles. Where would you like to begin?`,
      timestamp: "Just now"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: inputText.trim(),
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate Socratic reasoning response
    setTimeout(() => {
      let reply = "That's an interesting approach! Let's think through the edge case: what happens to your pointers when the input list has only 1 node? How would your loop condition handle a null head?";
      
      const q = userMsg.text.toLowerCase();
      if (q.includes("prime") || q.includes("algorithm")) {
        reply = "Great question! Notice that factors appear in symmetric pairs: if $n = a \\times b$, one factor must be $\\le \\sqrt{n}$. Why does checking up to $\\sqrt{n}$ instead of $n$ drastically reduce time complexity from $O(n)$ to $O(\\sqrt{n})$?";
      } else if (q.includes("matrix") || q.includes("2d")) {
        reply = "Consider how a 2D array is stored in contiguous memory in C/C++ (row-major order). Why is row-wise iteration cache-friendly compared to column-wise jumping?";
      } else if (q.includes("recursion") || q.includes("stack")) {
        reply = "Every recursive call allocates a new activation record (stack frame). What is the base condition that terminates this frame chain, and what happens if that condition is omitted?";
      }

      const tutorMsg: ChatMessage = {
        id: `tut-${Date.now()}`,
        sender: "tutor",
        text: reply,
        timestamp: "Just now"
      };

      setMessages(prev => [...prev, tutorMsg]);
      setIsTyping(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl h-[620px] rounded-3xl border border-white/10 bg-slate-900 shadow-2xl flex flex-col overflow-hidden text-slate-200"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Socratic AI Tutor</h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">24/7 Companion</span>
              </div>
              <p className="text-xs text-slate-400">Guided Conceptual Learning</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "tutor" && (
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 text-purple-400 mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-none shadow-md"
                    : "bg-slate-950/80 border border-white/10 text-slate-200 rounded-bl-none shadow-inner"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center text-xs text-purple-400 font-mono">
              <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span>Socratic Tutor is formulating a hint...</span>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask a question, explain your logic, or ask for a hint..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="p-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
