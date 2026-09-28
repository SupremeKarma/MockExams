/**
 * API Route: GET /api/share/[token]
 *
 * Verify and access shared content via token.
 * Only exam results can be shared.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateShareToken, logAccessAttempt } from '@/middleware/access-control';

export interface VerifyShareResponse {
  valid: boolean;
  contentType?: string;
  contentId?: string;
  expiresAt?: string;
  createdAt?: string;
  createdBy?: string;
  error?: string;
  message?: string;
}

/**
 * GET /api/share/[token]
 * Verify a share token and get content details
 *
 * Response (valid):
 * {
 *   "valid": true,
 *   "contentType": "exam-results",
 *   "contentId": "attempt-123",
 *   "expiresAt": "2026-10-05T14:23:45.000Z",
 *   "createdAt": "2026-09-28T14:23:45.000Z"
 * }
 *
 * Response (invalid/expired):
 * {
 *   "valid": false,
 *   "error": "Invalid or expired share token",
 *   "message": "This share link has expired or is invalid"
 * }
 *
 * Response (protected content):
 * {
 *   "valid": false,
 *   "error": "Access Denied",
 *   "message": "Only exam results can be shared"
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
): Promise<NextResponse> {
  const token = params.token;
  const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';

  try {
    // Validate token
    const tokenData = await validateShareToken(token);

    if (!tokenData || !tokenData.isValid) {
      return NextResponse.json<VerifyShareResponse>(
        {
          valid: false,
          error: 'Invalid or expired share token',
          message: 'This share link has expired or is invalid',
        },
        { status: 404 }
      );
    }

    // Log access
    logAccessAttempt({
      timestamp: new Date().toISOString(),
      userId: 'public', // Anonymous user via share token
      contentType: tokenData.contentType as any,
      action: 'access-shared',
      allowed: true,
      ipAddress,
    });

    return NextResponse.json<VerifyShareResponse>(
      {
        valid: true,
        contentType: tokenData.contentType,
        contentId: tokenData.contentId,
        expiresAt: tokenData.expiresAt.toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[SHARE_VERIFY_ENDPOINT] Error:', error);

    return NextResponse.json<VerifyShareResponse>(
      {
        valid: false,
        error: 'Invalid request',
        message: 'Failed to verify share token',
      },
      { status: 400 }
    );
  }
}
