"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText } from "lucide-react";
import MarkdownViewer from "./MarkdownViewer";

interface SyllabusMarkdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  markdownContent: string;
  downloadFilename?: string;
}

export default function SyllabusMarkdownModal({
  isOpen,
  onClose,
  title,
  markdownContent,
  downloadFilename,
}: SyllabusMarkdownModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden border border-zinc-200"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-primary-600/30 text-primary-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">{title}</h2>
                  <p className="text-xs text-zinc-400">Official Curriculum Syllabus &amp; Examination Scheme</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Markdown Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-50/50">
              <MarkdownViewer
                content={markdownContent}
                title={title}
                downloadFilename={downloadFilename || `${title.replace(/\s+/g, "_")}.md`}
                showActions={true}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
