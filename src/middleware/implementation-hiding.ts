/**
 * Implementation Hiding Middleware
 *
 * Hide the fact that content is stored as .md files.
 * Users only see rendered website content.
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Patterns that indicate .md file access attempts
 */
const BLOCKED_PATTERNS = [
  /\.md$/i, // Any .md file
  /^\/content\//i, // /content/ directory
  /^\/markdown\//i, // /markdown/ directory
  /^\/raw\//i, // /raw/ endpoints
  /^\/source\//i, // /source/ endpoints
  /\.md\?/i, // .md files with query params
  /api\/.*\.md/i, // API endpoints with .md
  /api\/content\//i, // /api/content/ endpoints
  /api\/markdown\//i, // /api/markdown/ endpoints
  /\/download.*\.md/i, // Download markdown
];

/**
 * Check if request is trying to access .md files or hidden directories
 */
function isBlockedAccess(pathname: string): boolean {
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(pathname));
}

/**
 * Middleware: Block .md file and hidden directory access
 * Returns 403 to hide existence, not 404 to avoid revealing structure
 *
 * Usage in middleware.ts:
 * ```ts
 * export const middleware = withImplementationHiding(middleware);
 * ```
 */
export function withImplementationHiding(
  middleware: (request: NextRequest) => NextResponse | Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const pathname = new URL(request.url).pathname;

    // Block attempted access to .md files or hidden directories
    if (isBlockedAccess(pathname)) {
      console.warn(`[IMPL_HIDING] Blocked access attempt: ${pathname}`);

      return NextResponse.json(
        {
          error: 'Access Denied',
          message: 'This resource is not available',
        },
        {
          status: 403,
          headers: {
            'Cache-Control': 'public, max-age=3600',
            'X-Content-Type-Options': 'nosniff',
          },
        }
      );
    }

    // Continue with normal middleware
    return middleware(request);
  };
}

/**
 * Validate URL doesn't expose implementation details
 * Used in client components to prevent accidental leaks
 */
export function validatePublicUrl(url: string): boolean {
  const blocked = ['.md', '/content/', '/markdown/', '/raw/', '/source/'];
  return !blocked.some((pattern) => url.includes(pattern));
}

/**
 * Sanitize error messages to not reveal .md structure
 */
export function sanitizeErrorMessage(error: any): string {
  const message = error?.message || 'An error occurred';

  // Hide .md file references
  const sanitized = message
    .replace(/\.md/gi, '')
    .replace(/markdown/gi, 'content')
    .replace(/\/content\//gi, '/')
    .replace(/\/raw\//gi, '/')
    .replace(/\/source\//gi, '/');

  return sanitized;
}

/**
 * Generate safe public URL for content
 * Never expose .md files or internal paths
 */
export function generatePublicContentUrl(
  contentType: 'syllabus' | 'notes' | 'solution' | 'past-papers',
  slug: string
): string {
  // Map content types to public routes
  const routeMap: Record<string, string> = {
    'syllabus': '/syllabus',
    'notes': '/notes',
    'solution': '/solutions',
    'past-papers': '/past-papers',
  };

  const route = routeMap[contentType];
  if (!route) {
    throw new Error(`Invalid content type: ${contentType}`);
  }

  // Never include .md or internal paths
  return `${route}/${slug}`;
}

/**
 * Validate that API endpoint doesn't expose implementation
 * Used in API routes
 */
export function validateApiEndpoint(pathname: string): void {
  const blocked = ['.md', 'markdown', 'content', 'raw', 'source'];

  for (const pattern of blocked) {
    if (pathname.includes(pattern)) {
      throw new Error(`API endpoint contains blocked pattern: ${pattern}`);
    }
  }
}

/**
 * Response headers that hide implementation
 */
export const SAFE_RESPONSE_HEADERS = {
  // Prevent browsers from guessing content type
  'X-Content-Type-Options': 'nosniff',

  // Standard security headers
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',

  // Cache appropriately without revealing structure
  'Cache-Control': 'public, max-age=3600',

  // Don't reveal server
  'Server': 'ExamAI',

  // Standard content type
  'Content-Type': 'text/html; charset=utf-8',

  // NOT these headers (which reveal implementation):
  // 'X-Content-Source': never
  // 'X-Powered-By': never
  // 'X-Original-File': never
  // 'X-Source-Path': never
};

/**
 * Create safe response headers
 */
export function createSafeHeaders(headers?: Record<string, string>) {
  return {
    ...SAFE_RESPONSE_HEADERS,
    ...headers,
  };
}

/**
 * Ensure no leaked implementation details in response
 */
export function sanitizeResponseHeaders(headers: HeadersInit): HeadersInit {
  const dangerous = [
    'X-Content-Source',
    'X-Powered-By',
    'X-Original-File',
    'X-Source-Path',
    'X-Markdown-File',
  ];

  const safeHeaders = { ...headers };

  for (const header of dangerous) {
    delete (safeHeaders as any)[header];
  }

  return safeHeaders;
}

/**
 * Log potential implementation exposure attempts
 */
export function logSecurityEvent(
  eventType: 'blocked-access' | 'exposed-path' | 'invalid-endpoint',
  details: {
    path?: string;
    message?: string;
    ipAddress?: string;
  }
): void {
  const timestamp = new Date().toISOString();
  console.warn(`[IMPL_HIDING] [${timestamp}] ${eventType}:`, details);

  // In production, send to security monitoring
  // sendToSecurityLog({ eventType, ...details, timestamp });
}
