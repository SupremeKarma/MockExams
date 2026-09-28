"use client";

import React, { useState, useMemo } from "react";
import { Copy, Check, Download, FileText, Code2, Eye, Printer, Sparkles, Lock, Shield } from "lucide-react";

interface MarkdownViewerProps {
  content: string;
  title?: string;
  downloadFilename?: string;
  showActions?: boolean;
  allowDownload?: boolean;
  className?: string;
}

/**
 * Lightweight, robust markdown parser that converts GFM-style Markdown
 * (tables, headings, lists, blockquotes, code blocks) into accessible, styled JSX.
 * Renders proprietary curriculum content strictly in-app without leaking source files.
 */
export default function MarkdownViewer({
  content,
  title,
  downloadFilename = "syllabus.md",
  showActions = true,
  allowDownload = false,
  className = "",
}: MarkdownViewerProps) {
  const [viewMode, setViewMode] = useState<"rendered" | "raw">("rendered");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  // Convert Markdown content into structured elements
  const parsedElements = useMemo(() => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;

    const renderInline = (text: string): React.ReactNode => {
      // Parse bold **text**, inline `code`, and links [text](url)
      const parts: React.ReactNode[] = [];
      let lastIdx = 0;
      const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
      let match;

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIdx) {
          parts.push(text.substring(lastIdx, match.index));
        }
        const m = match[0];
        if (m.startsWith("**") && m.endsWith("**")) {
          parts.push(
            <strong key={match.index} className="font-bold text-zinc-900">
              {m.slice(2, -2)}
            </strong>
          );
        } else if (m.startsWith("`") && m.endsWith("`")) {
          parts.push(
            <code
              key={match.index}
              className="px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-800 font-mono text-[11px] font-semibold border border-zinc-200"
            >
              {m.slice(1, -1)}
            </code>
          );
        } else if (m.startsWith("[") && m.includes("](")) {
          const closeBracket = m.indexOf("]");
          const linkText = m.slice(1, closeBracket);
          const linkUrl = m.slice(closeBracket + 2, -1);
          parts.push(
            <a
              key={match.index}
              href={linkUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary-600 hover:text-primary-800 underline font-semibold"
            >
              {linkText}
            </a>
          );
        }
        lastIdx = match.index + m.length;
      }
      if (lastIdx < text.length) {
        parts.push(text.substring(lastIdx));
      }
      return parts.length > 0 ? parts : text;
    };

    while (i < lines.length) {
      const line = lines[i];

      // Empty line
      if (!line.trim()) {
        i++;
        continue;
      }

      // Horizontal Rule
      if (line.trim() === "---" || line.trim() === "***") {
        elements.push(<hr key={i} className="my-6 border-zinc-200" />);
        i++;
        continue;
      }

      // Headers
      if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={i}
            className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-6 mb-3 pb-2 border-b border-zinc-200"
          >
            {renderInline(line.replace("# ", ""))}
          </h1>
        );
        i++;
        continue;
      }
      if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={i}
            className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight mt-6 mb-2.5 flex items-center gap-2"
          >
            <span className="w-1.5 h-5 rounded-full bg-primary-600 inline-block" />
            {renderInline(line.replace("## ", ""))}
          </h2>
        );
        i++;
        continue;
      }
      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="text-base sm:text-lg font-bold text-zinc-800 mt-4 mb-2">
            {renderInline(line.replace("### ", ""))}
          </h3>
        );
        i++;
        continue;
      }
      if (line.startsWith("#### ")) {
        elements.push(
          <h4
            key={i}
            className="text-sm font-bold text-zinc-700 uppercase tracking-wide mt-3 mb-1.5"
          >
            {renderInline(line.replace("#### ", ""))}
          </h4>
        );
        i++;
        continue;
      }

      // Code Block
      if (line.startsWith("```")) {
        const codeLines: string[] = [];
        const lang = line.replace("```", "").trim();
        i++;
        while (i < lines.length && !lines[i].startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```
        elements.push(
          <div
            key={i}
            className="my-3 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-950 text-zinc-100 text-xs font-mono"
          >
            {lang && (
              <div className="px-4 py-1.5 bg-zinc-900 text-zinc-400 text-[10px] font-bold uppercase tracking-wider border-b border-zinc-800">
                {lang}
              </div>
            )}
            <pre className="p-4 overflow-x-auto leading-relaxed">
              <code>{codeLines.join("\n")}</code>
            </pre>
          </div>
        );
        continue;
      }

      // Markdown Table
      if (line.includes("|") && line.trim().startsWith("|") && line.trim().endsWith("|")) {
        const tableLines: string[] = [];
        while (
          i < lines.length &&
          lines[i].includes("|") &&
          lines[i].trim().startsWith("|") &&
          lines[i].trim().endsWith("|")
        ) {
          tableLines.push(lines[i].trim());
          i++;
        }

        if (tableLines.length >= 2) {
          const headerRow = tableLines[0]
            .slice(1, -1)
            .split("|")
            .map((c) => c.trim());
          // Check if row 1 is separator (e.g. :--- or ---)
          const isSeparator = tableLines[1].replace(/[:\-\s|]/g, "").length === 0;
          const bodyRows = tableLines
            .slice(isSeparator ? 2 : 1)
            .map((row) =>
              row
                .slice(1, -1)
                .split("|")
                .map((c) => c.trim())
            );

          elements.push(
            <div key={`table-${i}`} className="my-4 overflow-x-auto rounded-xl border border-zinc-200 shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-100 border-b border-zinc-200">
                    {headerRow.map((cell, cIdx) => (
                      <th
                        key={cIdx}
                        className="py-2.5 px-3 font-bold text-zinc-900 border-r last:border-r-0 border-zinc-200 whitespace-nowrap"
                      >
                        {renderInline(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {bodyRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={rIdx % 2 === 1 ? "bg-zinc-50/60 hover:bg-zinc-50" : "hover:bg-zinc-50"}
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="py-2 px-3 text-zinc-700 border-r last:border-r-0 border-zinc-200 whitespace-nowrap"
                        >
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // Blockquote
      if (line.startsWith(">")) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].startsWith(">")) {
          quoteLines.push(lines[i].replace(/^>\s?/, ""));
          i++;
        }
        elements.push(
          <blockquote
            key={i}
            className="my-3 pl-4 py-2 border-l-4 border-primary-500 bg-primary-50/50 rounded-r-xl text-xs text-zinc-700 italic space-y-1"
          >
            {quoteLines.map((ql, qIdx) => (
              <p key={qIdx}>{renderInline(ql)}</p>
            ))}
          </blockquote>
        );
        continue;
      }

      // Unordered List
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const listItems: string[] = [];
        while (
          i < lines.length &&
          (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))
        ) {
          listItems.push(lines[i].trim().slice(2));
          i++;
        }
        elements.push(
          <ul key={i} className="my-2.5 space-y-1.5 text-xs text-zinc-700 pl-4 list-disc marker:text-primary-600">
            {listItems.map((item, lIdx) => (
              <li key={lIdx} className="leading-relaxed">
                {renderInline(item)}
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Ordered List
      if (/^\d+\.\s/.test(line.trim())) {
        const listItems: string[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
          listItems.push(lines[i].trim().replace(/^\d+\.\s/, ""));
          i++;
        }
        elements.push(
          <ol key={i} className="my-2.5 space-y-1.5 text-xs text-zinc-700 pl-4 list-decimal marker:font-bold marker:text-zinc-600">
            {listItems.map((item, lIdx) => (
              <li key={lIdx} className="leading-relaxed">
                {renderInline(item)}
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // Regular Paragraph
      elements.push(
        <p key={i} className="my-2 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          {renderInline(line)}
        </p>
      );
      i++;
    }

    return elements;
  }, [content]);

  return (
    <div className={`rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs ${className}`}>
      {/* Top Action Bar */}
      {showActions && (
        <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-primary-100 text-primary-800 text-[11px] font-mono font-bold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>.md format</span>
            </span>
            {title && <span className="text-xs font-bold text-zinc-800 truncate max-w-xs">{title}</span>}
          </div>

          <div className="flex items-center gap-1.5">
            {/* View Mode Toggle */}
            <div className="bg-zinc-200/70 p-0.5 rounded-lg flex items-center">
              <button
                type="button"
                onClick={() => setViewMode("rendered")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                  viewMode === "rendered"
                    ? "bg-white text-zinc-900 shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
                title="Rendered Document View"
              >
                <Eye className="w-3 h-3" />
                <span>Document</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("raw")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                  viewMode === "raw"
                    ? "bg-white text-zinc-900 shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
                title="Raw Markdown Source"
              >
                <Code2 className="w-3 h-3" />
                <span>Raw .md</span>
              </button>
            </div>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 text-[11px] font-semibold flex items-center gap-1 transition-colors"
              title="Copy Markdown to Clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy .md</span>
                </>
              )}
            </button>

            {/* Download Button or Protected Badge */}
            {allowDownload ? (
              <button
                type="button"
                onClick={handleDownload}
                className="px-2.5 py-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                title="Download as .md file"
              >
                <Download className="w-3 h-3 text-primary-600" />
                <span>Download</span>
              </button>
            ) : (
              <span
                className="px-2 py-1 rounded-md bg-amber-50 text-amber-800 text-[10px] font-semibold border border-amber-200/80 flex items-center gap-1 select-none"
                title="Proprietary In-App Curriculum • Protected by ExamAI"
              >
                <Lock className="w-2.5 h-2.5 text-amber-600" />
                <span>In-App Protected</span>
              </span>
            )}

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="p-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600 text-[11px] transition-colors"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="p-6 sm:p-8">
        {viewMode === "rendered" ? (
          <div className="prose prose-zinc max-w-none space-y-2">{parsedElements}</div>
        ) : (
          <div className="relative rounded-xl border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-200 overflow-x-auto leading-relaxed">
            <pre className="whitespace-pre-wrap">{content}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
