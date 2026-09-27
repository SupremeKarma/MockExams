"use client";

import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { Check, Copy } from "lucide-react";

export type ContentSize = "xs" | "sm" | "base" | "lg";

interface FormattedContentProps {
  content: string | null | undefined;
  className?: string;
  size?: ContentSize;
}

/**
 * Copy button for code blocks.
 */
function CodeCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <button
      onClick={onCopy}
      type="button"
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
      title="Copy code"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-emerald-400" />
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

/**
 * Formats inline markdown (math, bold, italic, code, links).
 */
export function renderInlineMarkdown(text: string, keyPrefix: string = "inline"): React.ReactNode[] {
  if (!text) return [];

  // Match:
  // 1) Inline math: $...$
  // 2) Inline code: `...`
  // 3) Bold: **...**
  // 4) Italic: *...*
  // 5) Link: [label](url)
  const tokenRegex = /(\$[^$\n]+?\$|`[^`\n]+?`|\*\*[^*]+?\*\*|\*[^*]+?\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    const key = `${keyPrefix}-${idx}`;
    if (!part) return null;

    // Inline LaTeX math: $...$
    if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
      const math = part.slice(1, -1).trim();
      return (
        <span key={key} className="inline-block mx-0.5 align-middle">
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
          className="px-1.5 py-0.5 rounded bg-zinc-100 text-primary-700 font-mono text-[0.88em] border border-zinc-200"
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

    // Link: [label](url)
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const match = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
      if (match) {
        return (
          <a
            key={key}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 underline font-medium"
          >
            {match[1]}
          </a>
        );
      }
    }

    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

interface BlockItem {
  type:
    | "code"
    | "math"
    | "heading"
    | "ordered-list"
    | "unordered-list"
    | "blockquote"
    | "table"
    | "hr"
    | "callout"
    | "paragraph";
  raw: string;
  level?: number;
  language?: string;
  items?: { marker?: string; text: string }[];
  headers?: string[];
  rows?: string[][];
  title?: string;
}

/**
 * Parses raw text into semantic Markdown and LMS presentation blocks.
 */
function parseContentBlocks(content: string): BlockItem[] {
  // Normalize newlines
  const text = content.replace(/\r\n/g, "\n");

  // Step 1: Extract multiline code blocks and display math blocks with placeholders
  const placeholderMap = new Map<string, BlockItem>();
  let placeholderCounter = 0;

  let processed = text.replace(/(```[\s\S]*?```|\$\$[\s\S]*?\$\$)/g, (match) => {
    const key = `@@BLOCK_PLACEHOLDER_${placeholderCounter++}@@`;

    if (match.startsWith("```") && match.endsWith("```")) {
      const inside = match.slice(3, -3);
      const firstNewline = inside.indexOf("\n");
      let language = "";
      let codeText = inside;

      if (firstNewline !== -1) {
        const firstLine = inside.slice(0, firstNewline).trim();
        if (/^[a-zA-Z0-9_-]+$/.test(firstLine)) {
          language = firstLine;
          codeText = inside.slice(firstNewline + 1);
        }
      }

      placeholderMap.set(key, {
        type: "code",
        raw: codeText.trim(),
        language,
      });
    } else if (match.startsWith("$$") && match.endsWith("$$")) {
      placeholderMap.set(key, {
        type: "math",
        raw: match.slice(2, -2).trim(),
      });
    }

    return `\n\n${key}\n\n`;
  });

  // Step 2: Line-by-line block recognition
  const lines = processed.split("\n");
  const blocks: BlockItem[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // Check placeholder
    if (placeholderMap.has(trimmed)) {
      blocks.push(placeholderMap.get(trimmed)!);
      i++;
      continue;
    }

    // Horizontal Rule: ---, ***, ___
    if (/^(?:---+|\*\*\*+|___+)\s*$/.test(trimmed)) {
      blocks.push({ type: "hr", raw: trimmed });
      i++;
      continue;
    }

    // Headings: #, ##, ###, ####
    const headingMatch = /^(#{1,4})\s+(.+)$/.exec(trimmed);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        raw: headingMatch[2].trim(),
      });
      i++;
      continue;
    }

    // Blockquote: > ...
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({
        type: "blockquote",
        raw: quoteLines.join("\n"),
      });
      continue;
    }

    // Markdown Table: lines starting and ending with |
    if (trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.length > 2) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const splitRow = (rowStr: string) =>
          rowStr
            .slice(1, -1)
            .split("|")
            .map((c) => c.trim());

        const headers = splitRow(tableLines[0]);
        // Row 1 might be separator like |---|---|
        let dataStartIdx = 1;
        if (
          tableLines.length > 1 &&
          tableLines[1].replace(/[\s|:-]/g, "").length === 0
        ) {
          dataStartIdx = 2;
        }

        const rows: string[][] = [];
        for (let r = dataStartIdx; r < tableLines.length; r++) {
          rows.push(splitRow(tableLines[r]));
        }

        blocks.push({
          type: "table",
          raw: tableLines.join("\n"),
          headers,
          rows,
        });
        continue;
      }
    }

    // Numbered / Ordered List: e.g. "1. ", "1) ", "(1) ", "a. ", "a) ", "(a) ", "i. "
    const orderedListRegex = /^(\(?\b(?:\d+|[a-zA-Z]|[ivxlcdmIVXLCDM]+)[\.\)]\s+)(.+)$/;
    if (orderedListRegex.test(trimmed)) {
      const listItems: { marker?: string; text: string }[] = [];
      while (i < lines.length) {
        const curTrim = lines[i].trim();
        const curMatch = orderedListRegex.exec(curTrim);
        if (!curMatch) break;
        listItems.push({
          marker: curMatch[1].trim(),
          text: curMatch[2].trim(),
        });
        i++;
      }
      blocks.push({
        type: "ordered-list",
        raw: "",
        items: listItems,
      });
      continue;
    }

    // Unordered List: e.g. "- ", "* ", "• "
    const unorderedListRegex = /^([-*•]\s+)(.+)$/;
    if (unorderedListRegex.test(trimmed)) {
      const listItems: { marker?: string; text: string }[] = [];
      while (i < lines.length) {
        const curTrim = lines[i].trim();
        const curMatch = unorderedListRegex.exec(curTrim);
        if (!curMatch) break;
        listItems.push({
          text: curMatch[2].trim(),
        });
        i++;
      }
      blocks.push({
        type: "unordered-list",
        raw: "",
        items: listItems,
      });
      continue;
    }

    // Distinct callout / section header line:
    // e.g. "**Key Concepts:**", "**Step 1: Formula**", "Definition: ..."
    const calloutMatch = /^(\*\*[^*:]+?:\*\*|\b(?:Definition|Key Points?|Formula|Step \d+|Phase \d+|Summary|Example|Important|Note):)\s*(.*)$/i.exec(
      trimmed
    );
    if (calloutMatch && calloutMatch[2].trim().length > 0) {
      blocks.push({
        type: "callout",
        title: calloutMatch[1].replace(/\*\*/g, "").trim(),
        raw: calloutMatch[2].trim(),
      });
      i++;
      continue;
    }

    // Otherwise: Ordinary Paragraph chunk (accumulate until empty line, heading, list, or table)
    const paraLines: string[] = [line];
    i++;
    while (i < lines.length) {
      const nextLine = lines[i];
      const nextTrim = nextLine.trim();
      if (!nextTrim) break;
      if (placeholderMap.has(nextTrim)) break;
      if (/^(?:---+|\*\*\*+|___+)\s*$/.test(nextTrim)) break;
      if (/^(#{1,4})\s+(.+)$/.test(nextTrim)) break;
      if (nextTrim.startsWith(">")) break;
      if (nextTrim.startsWith("|") && nextTrim.endsWith("|")) break;
      if (orderedListRegex.test(nextTrim)) break;
      if (unorderedListRegex.test(nextTrim)) break;
      if (
        /^(\*\*[^*:]+?:\*\*|\b(?:Definition|Key Points?|Formula|Step \d+|Phase \d+|Summary|Example|Important|Note):)\s*(.*)$/i.test(
          nextTrim
        )
      ) {
        break;
      }

      paraLines.push(nextLine);
      i++;
    }

    blocks.push({
      type: "paragraph",
      raw: paraLines.join("\n").trim(),
    });
  }

  return blocks;
}

/**
 * Size-to-typography class map
 */
const SIZE_CLASSES: Record<ContentSize, { body: string; list: string; code: string }> = {
  xs: {
    body: "text-xs text-zinc-700 leading-normal",
    list: "text-xs text-zinc-700 leading-normal",
    code: "text-[11px]",
  },
  sm: {
    body: "text-xs sm:text-sm text-zinc-700 leading-relaxed",
    list: "text-xs sm:text-sm text-zinc-700 leading-relaxed",
    code: "text-xs",
  },
  base: {
    body: "text-sm sm:text-[15px] md:text-base text-zinc-800 leading-relaxed font-normal",
    list: "text-sm sm:text-[15px] md:text-base text-zinc-800 leading-relaxed",
    code: "text-xs sm:text-sm",
  },
  lg: {
    body: "text-base sm:text-lg text-zinc-900 leading-relaxed font-normal",
    list: "text-base sm:text-lg text-zinc-900 leading-relaxed",
    code: "text-sm",
  },
};

/**
 * Production-ready formatted content renderer for exam questions, student answers,
 * model solutions, rubrics, and feedback.
 */
export function FormattedContent({
  content,
  className = "",
  size = "base",
}: FormattedContentProps) {
  if (!content || !content.trim()) {
    return null;
  }

  const blocks = parseContentBlocks(content);
  const typography = SIZE_CLASSES[size] || SIZE_CLASSES.base;

  return (
    <div className={`space-y-3.5 ${typography.body} ${className}`}>
      {blocks.map((block, idx) => {
        const key = `block-${idx}`;

        // 1. Code Block
        if (block.type === "code") {
          return (
            <div
              key={key}
              className="my-3 rounded-lg overflow-hidden border border-zinc-200/90 bg-zinc-950 shadow-xs"
            >
              <div className="bg-zinc-900 px-3.5 py-1.5 flex items-center justify-between border-b border-zinc-800">
                <span className="text-[11px] uppercase font-mono font-bold text-zinc-400 tracking-wider">
                  {block.language || "Code"}
                </span>
                <CodeCopyButton text={block.raw} />
              </div>
              <pre
                className={`p-3.5 text-zinc-100 font-mono overflow-x-auto whitespace-pre leading-relaxed ${typography.code}`}
              >
                <code>{block.raw}</code>
              </pre>
            </div>
          );
        }

        // 2. Display Math $$...$$
        if (block.type === "math") {
          return (
            <div
              key={key}
              className="my-3.5 py-2.5 px-4 bg-zinc-50/80 rounded-lg border border-zinc-200/80 overflow-x-auto text-center"
            >
              <BlockMath
                renderError={(_err) => (
                  <span className="font-mono text-amber-700 bg-amber-50 px-2 py-1 rounded text-xs block">
                    $${block.raw}$$
                  </span>
                )}
              >
                {block.raw}
              </BlockMath>
            </div>
          );
        }

        // 3. Headings
        if (block.type === "heading") {
          if (block.level === 1) {
            return (
              <h2
                key={key}
                className="text-lg sm:text-xl font-bold text-zinc-900 mt-4 mb-2 pb-1 border-b border-zinc-200"
              >
                {renderInlineMarkdown(block.raw, key)}
              </h2>
            );
          }
          if (block.level === 2) {
            return (
              <h3
                key={key}
                className="text-base sm:text-lg font-bold text-zinc-900 mt-3 mb-1.5"
              >
                {renderInlineMarkdown(block.raw, key)}
              </h3>
            );
          }
          return (
            <h4
              key={key}
              className="text-sm sm:text-base font-semibold text-zinc-900 mt-2.5 mb-1"
            >
              {renderInlineMarkdown(block.raw, key)}
            </h4>
          );
        }

        // 4. Ordered List
        if (block.type === "ordered-list" && block.items) {
          return (
            <ol key={key} className={`my-2 space-y-2 pl-0.5 ${typography.list}`}>
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2.5">
                  <span className="font-bold text-primary-700 tabular-nums shrink-0 select-none">
                    {item.marker}
                  </span>
                  <div className="flex-1">
                    {renderInlineMarkdown(item.text, `${key}-${itemIdx}`)}
                  </div>
                </li>
              ))}
            </ol>
          );
        }

        // 5. Unordered List
        if (block.type === "unordered-list" && block.items) {
          return (
            <ul key={key} className={`my-2 space-y-2 pl-0.5 ${typography.list}`}>
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2.5 shrink-0 select-none" />
                  <div className="flex-1">
                    {renderInlineMarkdown(item.text, `${key}-${itemIdx}`)}
                  </div>
                </li>
              ))}
            </ul>
          );
        }

        // 6. Blockquote
        if (block.type === "blockquote") {
          return (
            <blockquote
              key={key}
              className="border-l-4 border-primary-500 bg-primary-50/50 pl-4 py-2.5 my-2.5 rounded-r text-zinc-700 italic"
            >
              {block.raw.split("\n").map((line, lIdx) => (
                <p key={lIdx} className="leading-relaxed">
                  {renderInlineMarkdown(line, `${key}-${lIdx}`)}
                </p>
              ))}
            </blockquote>
          );
        }

        // 7. Markdown Table
        if (block.type === "table" && block.headers && block.rows) {
          return (
            <div
              key={key}
              className="my-3.5 overflow-x-auto rounded-lg border border-zinc-200 shadow-xs"
            >
              <table className="min-w-full divide-y divide-zinc-200 text-xs sm:text-sm">
                <thead className="bg-zinc-100 text-zinc-800">
                  <tr>
                    {block.headers.map((hdr, hIdx) => (
                      <th
                        key={hIdx}
                        className="px-3.5 py-2.5 text-left font-bold text-zinc-900 tracking-wider"
                      >
                        {renderInlineMarkdown(hdr, `${key}-th-${hIdx}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {block.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={rIdx % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="px-3.5 py-2.5 text-zinc-700 align-top"
                        >
                          {renderInlineMarkdown(cell, `${key}-td-${rIdx}-${cIdx}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // 8. Horizontal Rule
        if (block.type === "hr") {
          return <hr key={key} className="my-3.5 border-zinc-200" />;
        }

        // 9. Callout / Key Point
        if (block.type === "callout") {
          return (
            <div
              key={key}
              className="my-2.5 p-3 rounded-lg bg-zinc-50 border border-zinc-200/90"
            >
              <div className="font-bold text-primary-800 text-xs uppercase tracking-wider mb-1">
                {block.title}
              </div>
              <div className="text-zinc-800 leading-relaxed">
                {renderInlineMarkdown(block.raw, `${key}-callout`)}
              </div>
            </div>
          );
        }

        // 10. Ordinary Paragraph with soft line breaks
        const lines = block.raw.split("\n");
        return (
          <p key={key} className="leading-relaxed">
            {lines.map((line, lineIdx) => (
              <React.Fragment key={lineIdx}>
                {renderInlineMarkdown(line, `${key}-line-${lineIdx}`)}
                {lineIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export default FormattedContent;
