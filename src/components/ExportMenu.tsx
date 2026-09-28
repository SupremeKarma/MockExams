'use client';

import { canExportPDF, canExportWord, canPrint } from '@/lib/access-control';

interface ExportMenuProps {
  contentType: string;
  contentId: string;
  token?: string;
  className?: string;
}

export default function ExportMenu({
  contentType,
  contentId,
  token,
  className = '',
}: ExportMenuProps) {
  // Access control check: Only exam results can be exported
  if (!canExportPDF(contentType as any) && !canExportWord(contentType as any)) {
    return null;
  }

  const exportBaseUrl = token
    ? `/api/share/${token}/export`
    : `/api/exams/results/${contentId}/export`;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div
      className={`export-menu ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
      }}
    >
      <a
        href={`${exportBaseUrl}?format=pdf`}
        download={`exam-result-${contentId}.pdf`}
        className="btn btn--quiet"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.82rem',
          padding: '0.4rem 0.75rem',
          borderRadius: '6px',
          border: '1px solid var(--rule, #e5e7e3)',
          textDecoration: 'none',
          color: 'var(--ink, #1a2230)',
        }}
        title="Download official PDF report"
      >
        <span>📄</span>
        <span>Download PDF</span>
      </a>

      <a
        href={`${exportBaseUrl}?format=docx`}
        download={`exam-result-${contentId}.docx`}
        className="btn btn--quiet"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.82rem',
          padding: '0.4rem 0.75rem',
          borderRadius: '6px',
          border: '1px solid var(--rule, #e5e7e3)',
          textDecoration: 'none',
          color: 'var(--ink, #1a2230)',
        }}
        title="Download Word document"
      >
        <span>📝</span>
        <span>Download Word</span>
      </a>

      {canPrint(contentType as any) && (
        <button
          type="button"
          onClick={handlePrint}
          className="btn btn--quiet"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.82rem',
            padding: '0.4rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid var(--rule, #e5e7e3)',
            cursor: 'pointer',
          }}
          title="Print official result"
        >
          <span>🖨️</span>
          <span>Print</span>
        </button>
      )}
    </div>
  );
}
