/**
 * API Route: GET /api/share/[token]
 *
 * Verify and access shared content via token.
 * Only exam results can be shared.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateShareToken } from '@/middleware/access-control';
import { logAccessAttempt } from '@/lib/access-control';

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> | { token: string } }
): Promise<NextResponse> {
  const resolvedParams = await Promise.resolve(params);
  const token = resolvedParams.token;
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
