"use client";

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import React, { useMemo } from 'react';

export interface MathRendererProps {
  content: string | null | undefined;
  className?: string;
  isBlock?: boolean;
  inline?: boolean;
  renderError?: (error: Error) => React.ReactNode;
}

interface MathSegment {
  type: 'text' | 'inline' | 'block';
  content: string;
}

/**
 * Parses mixed text, LaTeX delimiters ($$, $, \[, \(), and bare LaTeX commands
 * into structured math segments ready for KaTeX rendering.
 */
function parseMathSegments(text: string, isBlock: boolean = false): MathSegment[] {
  if (!text) return [];

  // If explicitly requested as a block equation
  if (isBlock) {
    let cleaned = text.trim();
    if (cleaned.startsWith('$$') && cleaned.endsWith('$$')) {
      cleaned = cleaned.slice(2, -2).trim();
    } else if (cleaned.startsWith('\\[') && cleaned.endsWith('\\]')) {
      cleaned = cleaned.slice(2, -2).trim();
    } else if (cleaned.startsWith('$') && cleaned.endsWith('$')) {
      cleaned = cleaned.slice(1, -1).trim();
    }
    return [{ type: 'block', content: cleaned }];
  }

  // 1. Normalize delimiters
  const normalized = text
    .replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$')
    .replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$');

  // 2. Tokenize by $$...$$ first, then $...$
  const tokenRegex = /(\$\$[\s\S]*?\$\$|\$(?!\s)[^$\n]+?(?<!\s)\$)/g;
  const rawParts = normalized.split(tokenRegex);

  const finalParts: MathSegment[] = [];

  for (const part of rawParts) {
    if (!part) continue;

    if (part.startsWith('$$') && part.endsWith('$$') && part.length >= 4) {
      finalParts.push({ type: 'block', content: part.slice(2, -2).trim() });
    } else if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
      finalParts.push({ type: 'inline', content: part.slice(1, -1).trim() });
    } else {
      // Check if this plain text segment contains bare LaTeX math expressions
      // like \int, \frac, \sqrt, \iint, \sum, \partial, \nabla, etc.
      if (/\\(?:frac|sqrt|int|iint|iiint|oint|sum|prod|lim|partial|nabla|vec|begin)(?![a-zA-Z])/.test(part)) {
        const bareRegex = /(\\(?:frac|sqrt|int|iint|iiint|oint|sum|prod|lim|partial|nabla|begin)(?![a-zA-Z])[\s\S]*?(?=(?:\s+(?:and|or|where|if|then|when|with|for|such|that|over|under|in|at|by|from|to|between|using|given)\b|\s*$)))/g;
        const subParts = part.split(bareRegex);
        for (const sub of subParts) {
          if (!sub) continue;
          if (/\\(?:frac|sqrt|int|iint|iiint|oint|sum|prod|lim|partial|nabla|begin)(?![a-zA-Z])/.test(sub)) {
            finalParts.push({ type: 'inline', content: sub.trim() });
          } else {
            finalParts.push({ type: 'text', content: sub });
          }
        }
      } else {
        finalParts.push({ type: 'text', content: part });
      }
    }
  }

  return finalParts;
}

/**
 * Default fallback renderer if KaTeX encounters malformed LaTeX.
 * Preserves the raw string visibly in mono typography without throwing or crashing the React tree.
 */
function defaultErrorFallback(error: Error, raw: string): React.ReactNode {
  return (
    <span
      className="katex-fallback font-mono text-[0.85em] bg-amber-50/80 text-amber-900 border border-amber-200/80 px-1 py-0.5 rounded inline-block"
      title={error?.message || "LaTeX syntax warning"}
    >
      {raw}
    </span>
  );
}

/**
 * Hardened, universal Math & LaTeX renderer for MockExams.
 * - Supports inline ($...$, \(...\)) and display block ($$...$$, \[...\]) math.
 * - Auto-detects bare LaTeX expressions (\int, \frac, \sqrt, etc.) when unwrapped.
 * - Fully crash-resistant with custom error fallbacks.
 * - Supports seamless inline rendering (rendering as <span> to prevent DOM hydration warnings in headings/paragraphs).
 */
export const MathRenderer: React.FC<MathRendererProps> = ({
  content,
  className,
  isBlock = false,
  inline = false,
  renderError,
}) => {
  if (!content) return null;

  const segments = useMemo(() => parseMathSegments(content, isBlock), [content, isBlock]);

  const renderContent = () => (
    <>
      {segments.map((seg, idx) => {
        if (seg.type === 'block') {
          return (
            <div key={idx} className="my-2 overflow-x-auto text-center">
              <BlockMath
                math={seg.content}
                renderError={(err) =>
                  renderError ? renderError(err) : defaultErrorFallback(err, `$$${seg.content}$$`)
                }
              />
            </div>
          );
        }

        if (seg.type === 'inline') {
          return (
            <span key={idx} className="inline-block mx-0.5 align-baseline">
              <InlineMath
                math={seg.content}
                renderError={(err) =>
                  renderError ? renderError(err) : defaultErrorFallback(err, `$${seg.content}$`)
                }
              />
            </span>
          );
        }

        return <React.Fragment key={idx}>{seg.content}</React.Fragment>;
      })}
    </>
  );

  if (inline) {
    return <span className={className}>{renderContent()}</span>;
  }

  return <div className={className}>{renderContent()}</div>;
};

export default MathRenderer;
