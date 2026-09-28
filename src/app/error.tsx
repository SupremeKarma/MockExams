'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { sanitizeErrorMessage } from '@/middleware/implementation-hiding';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized error without exposing internal paths or .md structure
    console.error('[APPLICATION_ERROR]', sanitizeErrorMessage(error));
  }, [error]);

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        background: 'var(--bg, #fbfbf8)',
        color: 'var(--ink, #1a2230)',
        fontFamily: 'var(--font-clear, sans-serif)',
      }}
    >
      <div
        style={{
          maxWidth: '32rem',
          width: '100%',
          padding: '2.5rem 2rem',
          background: 'var(--surface, #ffffff)',
          borderRadius: '12px',
          border: '1px solid var(--rule, #e5e7e3)',
          boxShadow: 'var(--elevation, 0 12px 40px rgba(0,0,0,0.06))',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            background: 'var(--warn-bg, #fff5e0)',
            color: 'var(--warn-ink, #8a5200)',
            marginBottom: '1.25rem',
            fontSize: '1.5rem',
          }}
        >
          !
        </div>

        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            color: 'var(--ink, #1a2230)',
          }}
        >
          Something Went Wrong
        </h1>

        <p
          style={{
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--ink-2, #3f4957)',
            marginBottom: '1.75rem',
          }}
        >
          An unexpected error occurred while loading this page. Our engineers have been notified.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn--primary"
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            Try Again
          </button>
          <Link
            href="/"
            className="btn btn--quiet"
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              textDecoration: 'none',
              border: '1px solid var(--rule, #e5e7e3)',
            }}
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
