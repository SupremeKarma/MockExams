/**
 * API Route: GET /api/share/[token]/export?format=pdf|docx
 *
 * Export shared content as PDF or Word document.
 * Only exam results can be exported.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  validateShareToken,
  logAccessAttempt,
  activityDetector,
} from '@/middleware/access-control';
import { isActionAllowed } from '@/lib/access-control';

export interface ExportRequest {
  format: 'pdf' | 'docx';
  token: string;
}

/**
 * GET /api/share/[token]/export?format=pdf
 * Export shared content
 *
 * Query params:
 * - format: "pdf" or "docx" (required)
 * - includeAnswers: "true" or "false" (for exam results)
 *
 * Response (success):
 * - Binary file (PDF or Word document)
 * - Content-Type: application/pdf or application/vnd.openxmlformats-officedocument.wordprocessingml.document
 * - Content-Disposition: attachment; filename="exam-result-123.pdf"
 *
 * Response (error - protected content):
 * {
 *   "error": "Access Denied",
 *   "message": "Cannot export content of type 'notes'"
 * }
 *
 * Response (error - invalid token):
 * {
 *   "error": "Invalid share token",
 *   "message": "This share link has expired or is invalid"
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
): Promise<NextResponse> {
  const token = params.token;
  const format = request.nextUrl.searchParams.get('format') || 'pdf';
  const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  try {
    // Validate format
    if (!['pdf', 'docx'].includes(format)) {
      return NextResponse.json(
        {
          error: 'Invalid format',
          message: 'Format must be "pdf" or "docx"',
        },
        { status: 400 }
      );
    }

    // Validate token
    const tokenData = await validateShareToken(token);

    if (!tokenData || !tokenData.isValid) {
      logAccessAttempt({
        timestamp: new Date().toISOString(),
        userId: 'public',
        contentType: 'unknown' as any,
        action: `export-${format}`,
        allowed: false,
        ipAddress,
        userAgent,
      });

      return NextResponse.json(
        {
          error: 'Invalid share token',
          message: 'This share link has expired or is invalid',
        },
        { status: 404 }
      );
    }

    // RULE: Check if content can be exported
    const exportAction = format === 'pdf' ? 'export-pdf' : 'export-word';
    const canExport = isActionAllowed(
      tokenData.contentType as any,
      exportAction as any
    );

    if (!canExport) {
      logAccessAttempt({
        timestamp: new Date().toISOString(),
        userId: 'public',
        contentType: tokenData.contentType as any,
        action: exportAction,
        allowed: false,
        ipAddress,
        userAgent,
      });

      activityDetector.recordAttempt({
        timestamp: new Date().toISOString(),
        userId: 'public',
        contentType: tokenData.contentType as any,
        action: exportAction,
        allowed: false,
        ipAddress,
        userAgent,
      });

      return NextResponse.json(
        {
          error: 'Access Denied',
          message: `Cannot export content of type '${tokenData.contentType}'. Only exam results can be exported.`,
        },
        { status: 403 }
      );
    }

    // Log export attempt
    logAccessAttempt({
      timestamp: new Date().toISOString(),
      userId: 'public',
      contentType: tokenData.contentType as any,
      action: exportAction,
      allowed: true,
      ipAddress,
      userAgent,
    });

    // In production: Generate actual PDF/Word document
    // For now, return placeholder

    if (format === 'pdf') {
      // TODO: Generate PDF from exam result data
      // const pdfContent = await generateExamResultPDF(tokenData.contentId);

      return new NextResponse(
        Buffer.from('PDF content placeholder'),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="exam-result-${tokenData.contentId}.pdf"`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        }
      );
    } else {
      // format === 'docx'
      // TODO: Generate Word document from exam result data
      // const docxContent = await generateExamResultDocx(tokenData.contentId);

      return new NextResponse(
        Buffer.from('DOCX content placeholder'),
        {
          status: 200,
          headers: {
            'Content-Type':
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename="exam-result-${tokenData.contentId}.docx"`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        }
      );
    }
  } catch (error) {
    console.error('[SHARE_EXPORT_ENDPOINT] Error:', error);

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to export content',
      },
      { status: 500 }
    );
  }
}
