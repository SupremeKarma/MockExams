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

const LATEX_COMMAND_NAMES = [
  'frac', 'sqrt', 'int', 'iint', 'iiint', 'oint', 'sum', 'prod', 'lim', 'partial',
  'nabla', 'vec', 'begin', 'end', 'pm', 'mp', 'times', 'div', 'cdot', 'approx',
  'neq', 'le', 'ge', 'leq', 'geq', 'infty', 'implies', 'iff', 'to', 'rightarrow',
  'leftarrow', 'alpha', 'beta', 'gamma', 'delta', 'theta', 'pi', 'lambda', 'mu',
  'sigma', 'omega', 'phi', 'psi', 'tau', 'Delta', 'Gamma', 'Theta', 'Lambda',
  'Sigma', 'Phi', 'Psi', 'Omega', 'sin', 'cos', 'tan', 'sec', 'csc', 'cot',
  'sinh', 'cosh', 'tanh', 'ln', 'log', 'det', 'mathbf', 'mathcal', 'mathbb',
  'text', 'operatorname', 'left', 'right', 'over'
];

const LATEX_COMMAND_REGEX = new RegExp(`\\\\(?:${LATEX_COMMAND_NAMES.join('|')})(?![a-zA-Z])`);

function normalizeUnicodeMath(str: string): string {
  if (!str) return str;
  return str
    .replace(/∬/g, '\\iint ')
    .replace(/∭/g, '\\iiint ')
    .replace(/∮/g, '\\oint ')
    .replace(/∫/g, '\\int ')
    .replace(/∑/g, '\\sum ')
    .replace(/∏/g, '\\prod ')
    .replace(/∂/g, '\\partial ')
    .replace(/∇/g, '\\nabla ')
    .replace(/[Δ∆]/g, '\\Delta ')
    .replace(/≤/g, ' \\le ')
    .replace(/≥/g, ' \\ge ')
    .replace(/≠/g, ' \\neq ')
    .replace(/±/g, ' \\pm ')
    .replace(/∓/g, ' \\mp ')
    .replace(/×/g, ' \\times ')
    .replace(/÷/g, ' \\div ')
    .replace(/[·•]/g, ' \\cdot ')
    .replace(/∈/g, ' \\in ')
    .replace(/∉/g, ' \\notin ')
    .replace(/(?:⇒|=>)/g, ' \\implies ')
    .replace(/(?:⇔|<=>)/g, ' \\iff ')
    .replace(/→/g, ' \\to ')
    .replace(/∞/g, ' \\infty ')
    .replace(/π/g, ' \\pi ')
    .replace(/θ/g, ' \\theta ')
    .replace(/λ/g, ' \\lambda ')
    .replace(/₁/g, '_1')
    .replace(/₂/g, '_2')
    .replace(/₃/g, '_3')
    .replace(/₄/g, '_4')
    .replace(/₀/g, '_0')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/ⁿ/g, '^n');
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
    return [{ type: 'block', content: normalizeUnicodeMath(cleaned) }];
  }

  // 1. Normalize bracket delimiters using functional replacements to avoid JS $ string expansion bugs
  let normalized = text
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, m) => `$$${m}$$`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, m) => `$${m}$`);

  // 1b. Normalize common unicode mathematical symbols outside or inside math
  normalized = normalizeUnicodeMath(normalized);

  // 2. Tokenize by $$...$$ first, then $...$
  const tokenRegex = /(\$\$[\s\S]*?\$\$|\$(?:\\\$|[^$\n])+?\$)/g;
  const rawParts = normalized.split(tokenRegex);

  const finalParts: MathSegment[] = [];

  for (const part of rawParts) {
    if (!part) continue;

    if (part.startsWith('$$') && part.endsWith('$$') && part.length >= 4) {
      const inner = part.slice(2, -2).trim();
      if (inner) finalParts.push({ type: 'block', content: inner });
    } else if (part.startsWith('$') && part.endsWith('$') && part.length >= 3) {
      const inner = part.slice(1, -1).trim();
      if (inner) finalParts.push({ type: 'inline', content: inner });
    } else {
      // Check if this plain text segment contains bare LaTeX math expressions
      if (LATEX_COMMAND_REGEX.test(part)) {
        // Match expressions around bare LaTeX commands:
        // Supports optional variable assignment prefix (e.g. "b_n = ", "m = 2 ")
        // and stops before English conjunctions/prepositions or trailing punctuation
        const bareRegex = /((?:(?:[a-zA-Z0-9_]+\s*=\s*)?(?:[a-zA-Z0-9_().+\-*\/^]+\s*)?)?\\(?:[a-zA-Z]+)(?:\{[^{}]*\}|\[[^[\]]*\]|[\w\s+\-*\/=^_{}(),.<>|\\~!]|\\[a-zA-Z]+)*?)(?=(?:\s+(?:and|or|where|if|then|when|with|for|such|that|over|under|in|at|by|from|to|between|using|given|as|is|are|we|get|gives)\b|[.,;:!?](?:\s|$)|$))/g;

        let lastIdx = 0;
        let match;
        while ((match = bareRegex.exec(part)) !== null) {
          const matchStart = match.index;
          const matchStr = match[0];

          if (matchStart > lastIdx) {
            finalParts.push({ type: 'text', content: part.slice(lastIdx, matchStart) });
          }

          // Strip any trailing sentence punctuation if accidentally absorbed
          let mathContent = matchStr.trim();
          let trailingPunct = '';
          const punctMatch = mathContent.match(/[.,;:!?]+$/);
          if (punctMatch && !mathContent.endsWith('\\.')) {
            trailingPunct = punctMatch[0];
            mathContent = mathContent.slice(0, -trailingPunct.length).trim();
          }

          if (LATEX_COMMAND_REGEX.test(mathContent)) {
            finalParts.push({ type: 'inline', content: mathContent });
            if (trailingPunct) {
              finalParts.push({ type: 'text', content: trailingPunct });
            }
          } else {
            finalParts.push({ type: 'text', content: matchStr });
          }

          lastIdx = matchStart + matchStr.length;
        }

        if (lastIdx < part.length) {
          finalParts.push({ type: 'text', content: part.slice(lastIdx) });
        }
      } else {
        finalParts.push({ type: 'text', content: part });
      }
    }
  }

  // Merge adjacent text segments
  const merged: MathSegment[] = [];
  for (const seg of finalParts) {
    if (seg.type === 'text' && merged.length > 0 && merged[merged.length - 1].type === 'text') {
      merged[merged.length - 1].content += seg.content;
    } else {
      merged.push(seg);
    }
  }

  return merged;
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
 * - Auto-detects bare LaTeX expressions (\int, \frac, \sqrt, \pm, \implies, etc.) when unwrapped.
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
  const segments = useMemo(
    () => (content ? parseMathSegments(content, isBlock) : []),
    [content, isBlock]
  );

  if (!content || segments.length === 0) return null;

  const renderContent = () => (
    <>
      {segments.map((seg, idx) => {
        if (seg.type === 'block') {
          if (inline) {
            return (
              <span key={idx} className="inline-block my-1 max-w-full overflow-x-auto align-middle">
                <InlineMath
                  math={seg.content}
                  renderError={(err) =>
                    renderError ? renderError(err) : defaultErrorFallback(err, `$$${seg.content}$$`)
                  }
                />
              </span>
            );
          }
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
