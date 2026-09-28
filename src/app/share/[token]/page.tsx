/**
 * Page: /share/[token]
 *
 * Display shared content (exam results only) via share token.
 * Protected content cannot be shared via this route.
 */

import { Suspense } from 'react';
import Link from 'next/link';
import ExportMenu from '@/components/ExportMenu';

interface SharePageProps {
  params: Promise<{ token: string }> | { token: string };
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Verify token and fetch content
 */
async function verifyAndFetchContent(token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://examai.local';

  try {
    const response = await fetch(`${baseUrl}/api/share/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache: revalidate every 60 seconds
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('[SHARE_PAGE] Failed to verify token:', error);
    return { success: false, error: { message: 'Failed to load shared content' } };
  }
}

/**
 * Load shared exam result content
 * Only exam-results can be shared, so this will only load exam data
 */
async function fetchExamResult(contentId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://examai.local';

  try {
    const response = await fetch(
      `${baseUrl}/api/exams/results/${contentId}/shared`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('[SHARE_PAGE] Failed to fetch exam result:', error);
    return null;
  }
}

/**
 * Shared Content Loader Component
 */
async function SharedContent({ token }: { token: string }) {
  const verification = await verifyAndFetchContent(token);

  if (!verification.success) {
    return (
      <div className="error-container">
        <h1>Share Link Invalid or Expired</h1>
        <p>{verification.error?.message || 'This share link is no longer valid.'}</p>
        <p>Share links expire 7 days after creation.</p>
        <Link href="/">← Return to home</Link>
      </div>
    );
  }

  const { contentType, contentId, expiresAt } = verification.data;

  // RULE: Only exam-results should be here
  if (contentType !== 'exam-results') {
    return (
      <div className="error-container">
        <h1>Access Denied</h1>
        <p>Only exam results can be shared. This content type is not shareable.</p>
        <Link href="/">← Return to home</Link>
      </div>
    );
  }

  // Fetch the actual exam result
  const examResult = await fetchExamResult(contentId);

  if (!examResult) {
    return (
      <div className="error-container">
        <h1>Content Not Found</h1>
        <p>The requested exam result could not be found.</p>
        <Link href="/">← Return to home</Link>
      </div>
    );
  }

  const expiresDate = new Date(expiresAt);
  const isExpiringSoon = expiresDate.getTime() - Date.now() < 24 * 60 * 60 * 1000;

  return (
    <div className="shared-content-container">
      {isExpiringSoon && (
        <div className="warning-banner">
          ⚠️ This share link expires on{' '}
          {expiresDate.toLocaleDateString()}
        </div>
      )}

      <header className="shared-header">
        <h1>Exam Result</h1>
        <div className="shared-meta">
          <p>Student: {examResult.studentName}</p>
          <p>Score: {examResult.score}/{examResult.totalMarks}</p>
          <p>Date: {new Date(examResult.attemptDate).toLocaleDateString()}</p>
        </div>
      </header>

      <section className="exam-content">
        {/* Render exam result details */}
        <div className="result-sections">
          {examResult.sections?.map((section: any) => (
            <div key={section.id} className="result-section">
              <h2>{section.name}</h2>
              <p>
                Score: {section.obtained}/{section.total}
              </p>
              {section.questions?.map((question: any) => (
                <div key={question.id} className="question-result">
                  <h3>{question.text}</h3>
                  <p>
                    Your answer: <strong>{question.userAnswer}</strong>
                  </p>
                  <p>
                    Correct answer: <strong>{question.correctAnswer}</strong>
                  </p>
                  {question.explanation && (
                    <p className="explanation">{question.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <div className="export-actions" style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Download or Print This Result</h3>
        <ExportMenu contentType="exam-results" contentId={contentId} token={token} />
      </div>

      <footer className="shared-footer">
        <p>
          ℹ️ This result was shared with you via ExamAI. You can download, print,
          or email this result.
        </p>
        <p>Share link expires: {expiresDate.toLocaleString()}</p>
      </footer>
    </div>
  );
}

/**
 * Main Share Page Component
 */
export default async function SharePage({
  params,
}: SharePageProps) {
  const resolvedParams = await Promise.resolve(params);
  const token = resolvedParams.token;

  return (
    <main className="share-page">
      <Suspense fallback={<LoadingState />}>
        <SharedContent token={token} />
      </Suspense>
    </main>
  );
}

/**
 * Loading State While Verifying Token
 */
function LoadingState() {
  return (
    <div className="loading-container">
      <p>Loading shared content...</p>
    </div>
  );
}

/**
 * Metadata for share page
 */
export async function generateMetadata({ params }: SharePageProps) {
  const resolvedParams = await Promise.resolve(params);
  const token = resolvedParams.token;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://examai.local';
    const response = await fetch(`${baseUrl}/api/share/${token}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return {
        title: 'Invalid Share Link | ExamAI',
        description: 'This share link is invalid or expired.',
      };
    }

    const data = await response.json();

    if (data.contentType === 'exam-results') {
      return {
        title: 'Exam Result | ExamAI',
        description: 'View and download your exam result.',
        robots: 'noindex, nofollow', // Don't index shared content
      };
    }

    return {
      title: 'Shared Content | ExamAI',
      description: 'View shared content.',
      robots: 'noindex, nofollow',
    };
  } catch {
    return {
      title: 'Shared Content | ExamAI',
      robots: 'noindex, nofollow',
    };
  }
}
