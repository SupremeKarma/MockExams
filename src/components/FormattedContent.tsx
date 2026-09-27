"use client";

import React from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

interface FormattedContentProps {
  content: string | null | undefined;
  className?: string;
}

/**
 * Formats inline markdown (bold, italic, inline code, links) while
 * safely preserving inline math segments.
 */
function renderInlineMarkdown(text: string, keyPrefix: string): React.ReactNode[] {
  // Regex to match inline math $...$ and inline code `...`
  const tokenRegex = /(\$[^$\n]+?\$|`[^`\n]+?`|\*\*[^*]+?\*\*|\*[^*]+?\*)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    const key = `${keyPrefix}-${idx}`;

    if (!part) return null;

    // Inline LaTeX math: $...$
    if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
      const math = part.slice(1, -1).trim();
      return (
        <span key={key} className="inline-block mx-0.5">
          <InlineMath
            renderError={(_err) => (
              <span className="font-mono text-amber-700 bg-amber-50 px-1 rounded text-xs">
                {part}
              </span>
            )}
          >
            {math}
          </InlineMath>
        </span>
      );
    }

    // Inline code: `...`
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={key}
          className="px-1.5 py-0.5 rounded bg-zinc-100 text-primary-700 font-mono text-[11px] border border-zinc-200"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Bold: **...**
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={key} className="font-semibold text-zinc-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *...*
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={key} className="italic text-zinc-700">
          {part.slice(1, -1)}
        </em>
      );
    }

    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

/**
 * Production-ready content formatter for exam questions, student answers,
 * explanations, and grading rubrics. Supports:
 * - Block math: $$...$$
 * - Inline math: $...$
 * - Code blocks: ```lang ... ```
 * - Inline markdown (bold, italic, code)
 * - Blockquotes: > ...
 * - Bullet lists: - ...
 * - Multi-paragraph layout
 */
export function FormattedContent({ content, className = "" }: FormattedContentProps) {
  if (!content || !content.trim()) {
    return null;
  }

  // Normalize Windows CRLF to LF
  const raw = content.replace(/\r\n/g, "\n");

  // Split into major chunks: code blocks ```...```, display math $$...$$, or regular text
  const majorChunkRegex = /(```[\s\S]*?```|\$\$[\s\S]*?\$\$)/g;
  const chunks = raw.split(majorChunkRegex);

  return (
    <div className={`space-y-2 leading-relaxed ${className}`}>
      {chunks.map((chunk, chunkIdx) => {
        if (!chunk) return null;

        // Block code: ```...```
        if (chunk.startsWith("```") && chunk.endsWith("```")) {
          const lines = chunk.slice(3, -3).trim().split("\n");
          let language = "";
          let codeText = chunk.slice(3, -3).trim();

          // Check if the first line specifies a language (e.g. ```c or ```python)
          if (lines.length > 1 && /^[a-zA-Z0-9_-]+$/.test(lines[0].trim())) {
            language = lines[0].trim();
            codeText = lines.slice(1).join("\n");
          }

          return (
            <div key={chunkIdx} className="my-2.5 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-950">
              {language && (
                <div className="bg-zinc-900 px-3 py-1 text-[10px] uppercase font-bold text-zinc-400 border-b border-zinc-800 tracking-wider">
                  {language}
                </div>
              )}
              <pre className="p-3.5 text-zinc-100 text-xs font-mono overflow-x-auto whitespace-pre">
                <code>{codeText}</code>
              </pre>
            </div>
          );
        }

        // Display / Block Math: $$...$$
        if (chunk.startsWith("$$") && chunk.endsWith("$$")) {
          const formula = chunk.slice(2, -2).trim();
          return (
            <div
              key={chunkIdx}
              className="my-3 py-2 px-3 bg-zinc-50/60 rounded-md border border-zinc-100 overflow-x-auto text-center"
            >
              <BlockMath
                renderError={(_err) => (
                  <span className="font-mono text-amber-700 bg-amber-50 px-2 py-1 rounded text-xs block">
                    {chunk}
                  </span>
                )}
              >
                {formula}
              </BlockMath>
            </div>
          );
        }

        // Text chunk: split by double newlines into paragraphs or lists
        const paragraphs = chunk.split(/\n{2,}/);

        return (
          <React.Fragment key={chunkIdx}>
            {paragraphs.map((para, paraIdx) => {
              const trimmed = para.trim();
              if (!trimmed) return null;

              // Blockquote: starts with >
              if (trimmed.startsWith(">")) {
                const quoteText = trimmed.replace(/^>\s?/gm, "").trim();
                return (
                  <blockquote
                    key={paraIdx}
                    className="border-l-4 border-primary-500 bg-primary-50/40 pl-3.5 py-1.5 my-2 text-xs text-zinc-700 italic rounded-r"
                  >
                    {renderInlineMarkdown(quoteText, `quote-${chunkIdx}-${paraIdx}`)}
                  </blockquote>
                );
              }

              // List block: lines starting with "- " or "* "
              const lines = trimmed.split("\n");
              const isList = lines.every((l) => /^[-*]\s/.test(l.trim()));

              if (isList) {
                return (
                  <ul key={paraIdx} className="space-y-1 my-1.5 pl-1">
                    {lines.map((line, lineIdx) => {
                      const itemText = line.trim().replace(/^[-*]\s+/, "");
                      return (
                        <li key={lineIdx} className="flex items-start gap-2 text-xs text-zinc-700">
                          <span className="text-primary-500 font-bold select-none">•</span>
                          <span className="flex-1">
                            {renderInlineMarkdown(itemText, `li-${chunkIdx}-${paraIdx}-${lineIdx}`)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                );
              }

              // Ordinary paragraph with soft breaks
              return (
                <p key={paraIdx} className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
                  {lines.map((line, lineIdx) => (
                    <React.Fragment key={lineIdx}>
                      {renderInlineMarkdown(line, `p-${chunkIdx}-${paraIdx}-${lineIdx}`)}
                      {lineIdx < lines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default FormattedContent;
