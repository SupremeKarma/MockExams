'use client';

import { useState } from 'react';
import { canShare } from '@/lib/access-control';

interface ShareButtonProps {
  contentType: string;
  contentId: string;
  userId?: string;
  className?: string;
}

export default function ShareButton({
  contentType,
  contentId,
  userId = 'anonymous',
  className = '',
}: ShareButtonProps) {
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Access control check: Only exam results are shareable
  if (!canShare(contentType as any)) {
    return null;
  }

  const handleShare = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          contentType,
          contentId,
          userId,
        }),
      });

      if (response.status === 429) {
        setError('Rate limit reached (max 10/min). Please try again shortly.');
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.message || 'Sharing is not available for this resource.');
        return;
      }

      const data = await response.json();
      const generatedLink = data.shareLink || `${window.location.origin}/share/${data.shareToken}`;
      setShareUrl(generatedLink);

      // Copy to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to create share link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={handleShare}
        disabled={loading}
        className={`btn btn--quiet ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem',
          padding: '0.45rem 0.85rem',
          borderRadius: '6px',
          border: '1px solid var(--rule, #e5e7e3)',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
        title="Share your exam result"
      >
        <span>🔗</span>
        <span>{loading ? 'Creating Link...' : copied ? 'Link Copied!' : 'Share Result'}</span>
      </button>

      {error && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '0.35rem',
            padding: '0.4rem 0.6rem',
            background: 'var(--warn-bg, #fff5e0)',
            color: 'var(--warn-ink, #8a5200)',
            border: '1px solid var(--warn-line, #e0a64a)',
            borderRadius: '6px',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            zIndex: 20,
          }}
        >
          {error}
        </div>
      )}

      {shareUrl && !copied && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '0.35rem',
            padding: '0.5rem 0.75rem',
            background: 'var(--surface, #ffffff)',
            border: '1px solid var(--rule, #e5e7e3)',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontSize: '0.78rem',
            zIndex: 20,
            minWidth: '220px',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Share Link Created</div>
          <input
            type="text"
            readOnly
            value={shareUrl}
            style={{
              width: '100%',
              fontSize: '0.72rem',
              padding: '0.25rem',
              borderRadius: '4px',
              border: '1px solid var(--rule, #e5e7e3)',
            }}
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
        </div>
      )}
    </div>
  );
}
