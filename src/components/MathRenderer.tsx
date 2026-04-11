"use client";

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import React from 'react';

interface MathRendererProps {
  content: string;
  className?: string;
  isBlock?: boolean;
}

/**
 * A robust component that handles mixed text and LaTeX.
 * Supports $[...] for inline math and $$[...] for block math.
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ content, className, isBlock = false }) => {
  if (!content) return null;

  // Simple regex to find LaTeX blocks
  // Checks for $$...$$ first, then $...$
  const parts = content.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);

  return (
    <div className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const formula = part.slice(2, -2).trim();
          return <BlockMath key={index}>{formula}</BlockMath>;
        } else if (part.startsWith('$') && part.endsWith('$')) {
          const formula = part.slice(1, -1).trim();
          return <InlineMath key={index}>{formula}</InlineMath>;
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};

export default MathRenderer;
