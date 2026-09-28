import { describe, expect, it } from 'vitest';
import {
  canShare,
  canDownload,
  canExportPDF,
  canExportWord,
  canPrint,
  enforceShareAction,
  ContentType,
} from '@/lib/access-control';
import {
  validatePublicUrl,
  sanitizeErrorMessage,
  generatePublicContentUrl,
  withImplementationHiding,
} from '@/middleware/implementation-hiding';
import { ShareRateLimiter, validateShareToken } from '@/middleware/access-control';
import { NextRequest, NextResponse } from 'next/server';

describe('Access Control Rules', () => {
  const protectedTypes: ContentType[] = ['syllabus', 'notes', 'solution', 'past-papers'];

  it('allows sharing and downloading only for exam-results', () => {
    expect(canShare('exam-results')).toBe(true);
    expect(canDownload('exam-results')).toBe(true);
    expect(canExportPDF('exam-results')).toBe(true);
    expect(canExportWord('exam-results')).toBe(true);
    expect(canPrint('exam-results')).toBe(true);

    for (const type of protectedTypes) {
      expect(canShare(type)).toBe(false);
      expect(canDownload(type)).toBe(false);
      expect(canExportPDF(type)).toBe(false);
      expect(canExportWord(type)).toBe(false);
    }
  });

  it('enforces access control with descriptive error messages on protected types', () => {
    expect(() => enforceShareAction('exam-results', 'share')).not.toThrow();

    for (const type of protectedTypes) {
      expect(() => enforceShareAction(type, 'share')).toThrow(/not allowed for content type/);
      expect(() => enforceShareAction(type, 'download')).toThrow(/not allowed for content type/);
      expect(() => enforceShareAction(type, 'export-pdf')).toThrow(/not allowed for content type/);
    }
  });
});

describe('Implementation Hiding Utilities', () => {
  it('validates public URLs and flags leaked implementation paths', () => {
    expect(validatePublicUrl('/syllabus/operating-systems')).toBe(true);
    expect(validatePublicUrl('/notes/computer-networks')).toBe(true);

    expect(validatePublicUrl('/content/syllabus/os-101.md')).toBe(false);
    expect(validatePublicUrl('/markdown/notes.md')).toBe(false);
    expect(validatePublicUrl('/raw/solution.md')).toBe(false);
    expect(validatePublicUrl('/source/notes')).toBe(false);
  });

  it('sanitizes error messages to hide .md file structures', () => {
    const leakedError = new Error('File not found: /content/syllabus/BIT101CO.md');
    const sanitized = sanitizeErrorMessage(leakedError);

    expect(sanitized).not.toContain('.md');
    expect(sanitized).not.toContain('/content/');
  });

  it('generates safe public content URLs without file extensions', () => {
    expect(generatePublicContentUrl('syllabus', 'bit-101')).toBe('/syllabus/bit-101');
    expect(generatePublicContentUrl('notes', 'deadlocks')).toBe('/notes/deadlocks');
  });

  it('blocks direct .md file requests in middleware with 403 Forbidden', async () => {
    const dummyNext = (_req: NextRequest) => NextResponse.next();
    const wrappedMiddleware = withImplementationHiding(dummyNext);

    const blockedReq = new NextRequest('http://localhost:3000/content/syllabus.md');
    const response = await wrappedMiddleware(blockedReq);

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe('Access Denied');
  });

  it('allows safe public requests through in middleware', async () => {
    const dummyNext = (_req: NextRequest) => NextResponse.json({ ok: true });
    const wrappedMiddleware = withImplementationHiding(dummyNext);

    const safeReq = new NextRequest('http://localhost:3000/syllabus');
    const response = await wrappedMiddleware(safeReq);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
  });
});

describe('Share Rate Limiting & Token Validation', () => {
  it('enforces maximum 10 share requests per minute window', () => {
    const limiter = new ShareRateLimiter();
    const userId = 'student-test-123';

    for (let i = 0; i < 10; i++) {
      expect(limiter.isAllowed(userId)).toBe(true);
    }

    // 11th request must be blocked
    expect(limiter.isAllowed(userId)).toBe(false);
    expect(limiter.getRemainingAttempts(userId)).toBe(0);
  });

  it('rejects share tokens with non-exam content or expired dates', async () => {
    // Non-exam result token
    const invalidToken = Buffer.from(
      JSON.stringify({
        contentType: 'notes',
        contentId: 'unit-1',
        expiresAt: new Date(Date.now() + 100000).toISOString(),
      })
    ).toString('base64');

    const result = await validateShareToken(invalidToken);
    expect(result).toBeNull();

    // Expired exam result token
    const expiredToken = Buffer.from(
      JSON.stringify({
        contentType: 'exam-results',
        contentId: 'attempt-1',
        expiresAt: new Date(Date.now() - 100000).toISOString(),
      })
    ).toString('base64');

    const expiredResult = await validateShareToken(expiredToken);
    expect(expiredResult).toBeNull();
  });
});
