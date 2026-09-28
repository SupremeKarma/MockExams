/**
 * API Middleware: Enforce access control rules
 *
 * Prevents unauthorized sharing, downloading, and export of proprietary content.
 * Only exam results are allowed to be shared and exported.
 */

import { NextRequest, NextResponse } from 'next/server';
import { enforceShareAction, logAccessAttempt, AccessLog } from '@/lib/access-control';
export { logAccessAttempt } from '@/lib/access-control';

/**
 * MIDDLEWARE: Protect share/download endpoints
 *
 * Usage in API route:
 * ```ts
 * export async function POST(request: NextRequest) {
 *   await protectShareEndpoint(request, 'share');
 *   // ... rest of logic
 * }
 * ```
 */
export async function protectShareEndpoint(
  request: NextRequest,
  action: 'share' | 'download' | 'export-pdf' | 'export-word' | 'email'
): Promise<void> {
  const body = await request.json().catch(() => ({}));
  const contentType = body.contentType || body.type || '';
  const userId = request.headers.get('x-user-id') || 'unknown';
  const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';

  const log: AccessLog = {
    timestamp: new Date().toISOString(),
    userId,
    contentType: contentType as any,
    action,
    allowed: false,
    ipAddress,
    userAgent: request.headers.get('user-agent') || undefined,
  };

  try {
    enforceShareAction(contentType, action);
    log.allowed = true;
    logAccessAttempt(log);
  } catch (error) {
    logAccessAttempt(log);
    throw error;
  }
}

/**
 * MIDDLEWARE: Reject unauthorized API access
 *
 * Usage in API route:
 * ```ts
 * export async function GET(request: NextRequest) {
 *   const path = new URL(request.url).pathname;
 *   rejectProtectedContent(path);
 *   // ... rest of logic
 * }
 * ```
 */
export function rejectProtectedContent(path: string): void {
  const protectedPatterns = [
    /\/api\/syllabus\/.*\.md/,
    /\/api\/notes\/.*\.md/,
    /\/api\/solutions?\/.*\.md/,
    /\/api\/past-papers?\/.*\.md/,
    /\/api\/content\/(syllabus|notes|solution|past-papers)\/.*\.(md|download|export)/,
  ];

  const isProtected = protectedPatterns.some((pattern) => pattern.test(path));

  if (isProtected) {
    throw new Error(
      `Access denied: Cannot download or export ${path}. This content is proprietary.`
    );
  }
}

/**
 * Create error response for access denied
 */
export function accessDeniedResponse(
  contentType: string,
  action: string
): NextResponse {
  return NextResponse.json(
    {
      error: 'Access Denied',
      message: `Cannot ${action} content of type '${contentType}'. This content is proprietary and cannot be shared or exported.`,
      code: 'CONTENT_PROTECTED',
      details: {
        contentType,
        action,
        allowedActions: ['view-on-website'],
        helpText: 'To access this content, please visit the website.',
      },
    },
    { status: 403 }
  );
}

/**
 * Validate share token (for shared exam results)
 * Tokens should only work for exam-results, not protected content
 */
export async function validateShareToken(token: string): Promise<{
  contentType: string;
  contentId: string;
  expiresAt: Date;
  isValid: boolean;
} | null> {
  // In production, validate against database
  // This is a placeholder implementation

  try {
    // Decode token (would be JWT or similar in production)
    const decoded = JSON.parse(
      Buffer.from(token, 'base64').toString('utf-8')
    );

    // RULE: Only exam-results tokens are valid
    if (decoded.contentType !== 'exam-results') {
      console.warn(
        `[SECURITY] Invalid share token: content type is ${decoded.contentType}, only exam-results allowed`
      );
      return null;
    }

    // Check expiration
    const expiresAt = new Date(decoded.expiresAt);
    if (expiresAt < new Date()) {
      console.warn(`[SECURITY] Share token expired at ${expiresAt}`);
      return null;
    }

    return {
      contentType: decoded.contentType,
      contentId: decoded.contentId,
      expiresAt,
      isValid: true,
    };
  } catch (error) {
    console.warn(`[SECURITY] Failed to validate share token: ${error}`);
    return null;
  }
}

/**
 * MIDDLEWARE: Log all share/export attempts
 * Used for audit trail and abuse detection
 */
export async function logShareAttempt(
  userId: string,
  contentType: string,
  action: string,
  success: boolean,
  metadata?: Record<string, any>
): Promise<void> {
  const log: AccessLog = {
    timestamp: new Date().toISOString(),
    userId,
    contentType: contentType as any,
    action,
    allowed: success,
    ...metadata,
  };

  logAccessAttempt(log);

  // In production, persist to audit database
  // await db.auditLog.create(log);
}

/**
 * MIDDLEWARE: Rate limit share requests
 * Prevent abuse of share endpoint
 */
export class ShareRateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts = 10;
  private readonly windowMs = 60 * 1000; // 1 minute

  isAllowed(userId: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(userId) || [];

    // Remove old attempts outside window
    const validAttempts = userAttempts.filter((time) => now - time < this.windowMs);

    if (validAttempts.length >= this.maxAttempts) {
      console.warn(
        `[RATE_LIMIT] User ${userId} exceeded share rate limit: ${validAttempts.length} attempts in ${this.windowMs}ms`
      );
      return false;
    }

    validAttempts.push(now);
    this.attempts.set(userId, validAttempts);
    return true;
  }

  getRemainingAttempts(userId: string): number {
    const now = Date.now();
    const userAttempts = this.attempts.get(userId) || [];
    const validAttempts = userAttempts.filter((time) => now - time < this.windowMs);
    return Math.max(0, this.maxAttempts - validAttempts.length);
  }
}

/**
 * MIDDLEWARE: Detect suspicious patterns
 * Alert on unusual access patterns
 */
export class SuspiciousActivityDetector {
  private readonly logs: AccessLog[] = [];
  private readonly maxLogs = 1000;

  recordAttempt(log: AccessLog): void {
    this.logs.push(log);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest
    }

    this.detectPatterns(log);
  }

  private detectPatterns(currentLog: AccessLog): void {
    // Pattern 1: Many failed attempts from same user
    const failedAttempts = this.logs.filter(
      (log) => log.userId === currentLog.userId && !log.allowed
    );
    if (failedAttempts.length > 10) {
      this.alert(
        `Multiple failed access attempts from user ${currentLog.userId}`,
        'HIGH'
      );
    }

    // Pattern 2: Attempting to access protected content
    const protectedAttempts = this.logs.filter(
      (log) =>
        log.userId === currentLog.userId &&
        ['syllabus', 'notes', 'solution', 'past-papers'].includes(
          log.contentType
        ) &&
        !log.allowed
    );
    if (protectedAttempts.length > 5) {
      this.alert(
        `User ${currentLog.userId} repeatedly trying to access protected content`,
        'MEDIUM'
      );
    }

    // Pattern 3: Bulk export attempts
    const exportAttempts = this.logs.filter(
      (log) =>
        log.userId === currentLog.userId &&
        (log.action === 'export-pdf' || log.action === 'export-word')
    );
    if (exportAttempts.length > 20) {
      this.alert(
        `User ${currentLog.userId} attempting bulk exports of exam results`,
        'LOW'
      );
    }
  }

  private alert(message: string, severity: 'HIGH' | 'MEDIUM' | 'LOW'): void {
    console.warn(`[SECURITY_ALERT] [${severity}] ${message}`);
    // In production, send to monitoring service
  }
}

// Global instances (use dependency injection in production)
export const shareLimiter = new ShareRateLimiter();
export const activityDetector = new SuspiciousActivityDetector();
