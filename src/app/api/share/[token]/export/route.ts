/**
 * API Route: GET /api/share/[token]/export?format=pdf|docx
 *
 * Export shared content as PDF or Word document.
 * Only exam results can be exported.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  validateShareToken,
  activityDetector,
} from '@/middleware/access-control';
import { isActionAllowed, logAccessAttempt } from '@/lib/access-control';
import { adminDb } from '@/lib/firebase-admin';

export interface ExportRequest {
  format: 'pdf' | 'docx';
  token: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> | { token: string } }
): Promise<NextResponse> {
  const resolvedParams = await Promise.resolve(params);
  const token = resolvedParams.token;
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
        action: `export-${format}` as any,
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
        action: exportAction as any,
        allowed: false,
        ipAddress,
        userAgent,
      });

      activityDetector.recordAttempt({
        timestamp: new Date().toISOString(),
        userId: 'public',
        contentType: tokenData.contentType as any,
        action: exportAction as any,
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
      action: exportAction as any,
      allowed: true,
      ipAddress,
      userAgent,
    });

    // Fetch real exam attempt result
    let studentName = 'Student';
    let examTitle = 'Exam Result';
    let scoreText = 'N/A';
    let percentageText = 'N/A';
    let attemptedAt = new Date().toISOString().split('T')[0];

    try {
      const attemptSnap = await adminDb.collection('exam_attempts').doc(tokenData.contentId).get();
      if (attemptSnap.exists) {
        const d = attemptSnap.data() as any;
        studentName = d.displayName || d.user_name || 'Student';
        examTitle = d.exam_title || 'Exam Result';
        scoreText = `${d.score ?? 0} / ${d.total_marks ?? 0}`;
        percentageText = `${Math.round(d.percentage ?? 0)}%`;
        if (d.attempted_at) attemptedAt = String(d.attempted_at).split('T')[0];
      }
    } catch (e) {
      console.warn('Could not read attempt document from Firestore:', e);
    }

    if (format === 'pdf') {
      const details = [
        `Student Name: ${studentName}`,
        `Exam Title: ${examTitle}`,
        `Score: ${scoreText}`,
        `Percentage: ${percentageText}`,
        `Date: ${attemptedAt}`,
        `Verification Token: ${token}`,
      ];
      const pdfBuffer = generateExamResultPdf(`MockExams Official Result - ${examTitle}`, details);

      return new NextResponse(
        new Uint8Array(pdfBuffer),
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
      const wordHtml = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>${examTitle}</title>
<style>
body { font-family: Calibri, Arial, sans-serif; font-size: 14pt; color: #111; padding: 40px; }
h1 { color: #2563eb; font-size: 20pt; margin-bottom: 24px; border-bottom: 2px solid #2563eb; padding-bottom: 8px; }
table { width: 100%; border-collapse: collapse; margin-top: 20px; }
th, td { text-align: left; padding: 10px 14px; border-bottom: 1px solid #e5e7eb; }
th { background-color: #f8fafc; font-weight: bold; width: 35%; }
.footer { margin-top: 40px; font-size: 10pt; color: #6b7280; }
</style>
</head>
<body>
<h1>MockExams Official Result</h1>
<table>
  <tr><th>Exam Title</th><td>${examTitle}</td></tr>
  <tr><th>Candidate</th><td>${studentName}</td></tr>
  <tr><th>Score</th><td>${scoreText}</td></tr>
  <tr><th>Percentage</th><td>${percentageText}</td></tr>
  <tr><th>Attempt Date</th><td>${attemptedAt}</td></tr>
  <tr><th>Verification Token</th><td>${token}</td></tr>
</table>
<div class='footer'>This document was officially exported from MockExams learning platform.</div>
</body>
</html>`;

      return new NextResponse(
        Buffer.from(wordHtml, 'utf8'),
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

/**
 * Generates a valid standard PDF-1.4 document containing exam result certification.
 */
function generateExamResultPdf(title: string, details: string[]): Buffer {
  const safeText = (t: string) => String(t || '').replace(/[()\\]/g, '\\$&');
  const lines = [
    'BT',
    '/F1 18 Tf',
    '50 780 Td',
    `(${safeText(title)}) Tj`,
    '/F1 11 Tf',
    '0 -30 Td',
  ];

  for (const d of details) {
    lines.push(`(${safeText(d)}) Tj`);
    lines.push('0 -22 Td');
  }
  lines.push('ET');

  const contentStream = lines.join('\n');
  const streamLength = Buffer.byteLength(contentStream, 'utf8');

  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  const obj3 = '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n';
  const obj4 = '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
  const obj5 = `5 0 obj\n<< /Length ${streamLength} >>\nstream\n${contentStream}\nendstream\nendobj\n`;

  let body = '%PDF-1.4\n';
  const offsets = [0];

  offsets.push(Buffer.byteLength(body, 'binary'));
  body += obj1;
  offsets.push(Buffer.byteLength(body, 'binary'));
  body += obj2;
  offsets.push(Buffer.byteLength(body, 'binary'));
  body += obj3;
  offsets.push(Buffer.byteLength(body, 'binary'));
  body += obj4;
  offsets.push(Buffer.byteLength(body, 'binary'));
  body += obj5;

  const xrefStart = Buffer.byteLength(body, 'binary');
  let xref = `xref\n0 ${offsets.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) {
    xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }

  const trailer = `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return Buffer.from(body + xref + trailer, 'binary');
}
