/**
 * API Route: POST /api/share
 *
 * Create shareable links for content (exam results only).
 * Protected against unauthorized sharing of proprietary content.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  enforceShareAction,
  getSharePermissions,
  logAccessAttempt,
} from '@/lib/access-control';
import {
  protectShareEndpoint,
  accessDeniedResponse,
  shareLimiter,
  activityDetector,
} from '@/middleware/access-control';

export interface ShareRequest {
  contentType: 'exam-results' | 'syllabus' | 'notes' | 'solution' | 'past-papers';
  contentId: string;
  userId: string;
  expiresIn?: number; // seconds (default 7 days = 604800)
  allowEmail?: boolean;
  allowDownload?: boolean;
}

export interface ShareResponse {
  success: boolean;
  shareLink?: string;
  shareToken?: string;
  expiresAt?: string;
  contentType?: string;
  contentId?: string;
  error?: string;
  message?: string;
}

/**
 * Generate a secure share token
 * In production, use JWT with RS256 or similar
 */
function generateShareToken(
  contentType: string,
  contentId: string,
  userId: string,
  expiresIn: number
): string {
  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  const tokenData = {
    contentType,
    contentId,
    createdBy: userId,
    createdAt: new Date().toISOString(),
    expiresAt,
    version: 1,
  };

  // In production, use proper JWT signing
  // For now, use base64 encoding (NOT SECURE - use real JWT in production)
  const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');

  return token;
}

/**
 * Generate share link from token
 */
function generateShareLink(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://examai.local';
  return `${baseUrl}/share/${token}`;
}

/**
 * Validate share request
 */
function validateShareRequest(body: any): { valid: boolean; error?: string } {
  if (!body.contentType) {
    return { valid: false, error: 'contentType is required' };
  }

  if (!body.contentId) {
    return { valid: false, error: 'contentId is required' };
  }

  if (!body.userId) {
    return { valid: false, error: 'userId is required' };
  }

  const validContentTypes = [
    'exam-results',
    'syllabus',
    'notes',
    'solution',
    'past-papers',
  ];
  if (!validContentTypes.includes(body.contentType)) {
    return { valid: false, error: `Invalid contentType: ${body.contentType}` };
  }

  return { valid: true };
}

/**
 * POST /api/share
 * Create a shareable link for content
 *
 * Request body:
 * {
 *   "contentType": "exam-results",
 *   "contentId": "attempt-123",
 *   "userId": "user-456",
 *   "expiresIn": 604800
 * }
 *
 * Response (success):
 * {
 *   "success": true,
 *   "shareLink": "https://examai.local/share/eyJ...",
 *   "shareToken": "eyJ...",
 *   "expiresAt": "2026-10-05T14:23:45.000Z",
 *   "contentType": "exam-results",
 *   "contentId": "attempt-123"
 * }
 *
 * Response (error - protected content):
 * {
 *   "success": false,
 *   "error": "Access Denied",
 *   "message": "Cannot share content of type 'notes'. This content is proprietary...",
 *   "code": "CONTENT_PROTECTED"
 * }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  try {
    // Parse request body
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
          message: 'Request body must be valid JSON',
        },
        { status: 400 }
      );
    }

    const userId = body.userId || request.headers.get('x-user-id') || 'unknown';
    const contentType = body.contentType || '';

    // Validate request
    const validation = validateShareRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error',
          message: validation.error,
        },
        { status: 400 }
      );
    }

    // Check rate limiting
    if (!shareLimiter.isAllowed(userId)) {
      const remaining = shareLimiter.getRemainingAttempts(userId);
      return NextResponse.json(
        {
          success: false,
          error: 'Rate Limited',
          message: `Too many requests. Try again later. Remaining attempts: ${remaining}`,
          retryAfter: 60,
        },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    // MAIN RULE: Enforce access control - only exam-results can be shared
    try {
      enforceShareAction(contentType, 'share');
    } catch (error) {
      // Log failed attempt
      logAccessAttempt({
        timestamp: new Date().toISOString(),
        userId,
        contentType: contentType as any,
        action: 'share',
        allowed: false,
        ipAddress,
        userAgent,
      });

      activityDetector.recordAttempt({
        timestamp: new Date().toISOString(),
        userId,
        contentType: contentType as any,
        action: 'share',
        allowed: false,
        ipAddress,
        userAgent,
      });

      // Return detailed error
      return accessDeniedResponse(contentType, 'share');
    }

    // Generate share token (only for allowed content)
    const expiresIn = body.expiresIn || 7 * 24 * 60 * 60; // default 7 days
    const token = generateShareToken(contentType, body.contentId, userId, expiresIn);
    const shareLink = generateShareLink(token);
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    // Log successful share
    logAccessAttempt({
      timestamp: new Date().toISOString(),
      userId,
      contentType: contentType as any,
      action: 'share',
      allowed: true,
      ipAddress,
      userAgent,
    });

    activityDetector.recordAttempt({
      timestamp: new Date().toISOString(),
      userId,
      contentType: contentType as any,
      action: 'share',
      allowed: true,
      ipAddress,
      userAgent,
    });

    // In production, save share record to database
    // await db.sharedContent.create({
    //   token,
    //   contentType,
    //   contentId: body.contentId,
    //   createdBy: userId,
    //   expiresAt: new Date(expiresAt),
    //   ipAddress,
    //   userAgent,
    // });

    return NextResponse.json<ShareResponse>(
      {
        success: true,
        shareLink,
        shareToken: token,
        expiresAt,
        contentType,
        contentId: body.contentId,
        message: `Share link created. Expires in ${expiresIn} seconds.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[SHARE_ENDPOINT] Unexpected error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while creating share link',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/share
 * CORS preflight
 */
export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  return NextResponse.json(
    { allowed: ['POST'] },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}
