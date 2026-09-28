import Link from 'next/link';

export default function NotFound() {
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
        <span
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '2.5rem',
            fontWeight: 700,
            color: 'var(--pen, #c0392f)',
            display: 'block',
            marginBottom: '0.5rem',
          }}
        >
          404
        </span>

        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            color: 'var(--ink, #1a2230)',
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--ink-2, #3f4957)',
            marginBottom: '1.75rem',
          }}
        >
          The page or curriculum resource you requested could not be located. It may have been moved or updated.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/"
            className="btn btn--primary"
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Go to Home
          </Link>
          <Link
            href="/syllabus"
            className="btn btn--quiet"
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              textDecoration: 'none',
              border: '1px solid var(--rule, #e5e7e3)',
            }}
          >
            Browse Syllabus
          </Link>
        </div>
      </div>
    </div>
  );
}
