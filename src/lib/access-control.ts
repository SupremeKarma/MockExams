/**
 * Access Control Rules: Enforce content sharing and export restrictions
 *
 * Proprietary content (syllabus, notes, solutions) cannot be shared or
 * downloaded. Only exam results are shareable and exportable.
 */

export type ContentType =
  | 'syllabus'
  | 'notes'
  | 'solution'
  | 'past-papers'
  | 'exam-results';

export interface SharePermission {
  canShare: boolean;
  canDownload: boolean;
  canExportPDF: boolean;
  canExportWord: boolean;
  canPrint: boolean;
  canEmail: boolean;
  reason?: string;
}

/**
 * RULE: Determine if content can be shared
 * Only exam-results can be shared
 */
export function canShare(contentType: ContentType): boolean {
  return contentType === 'exam-results';
}

/**
 * RULE: Determine if content can be downloaded
 * Only exam-results can be downloaded
 */
export function canDownload(contentType: ContentType): boolean {
  return contentType === 'exam-results';
}

/**
 * RULE: Determine if content can be exported as PDF
 * Only exam-results can be exported to PDF
 */
export function canExportPDF(contentType: ContentType): boolean {
  return contentType === 'exam-results';
}

/**
 * RULE: Determine if content can be exported as Word
 * Only exam-results can be exported to Word
 */
export function canExportWord(contentType: ContentType): boolean {
  return contentType === 'exam-results';
}

/**
 * RULE: Determine if content can be printed
 * Protected content (syllabus, notes, solutions): warn but allow
 * Exam results: full print support
 */
export function canPrint(contentType: ContentType): boolean {
  // All content can be printed by browser, but protected content
  // will show watermark. Return true but handle at render level.
  return true;
}

/**
 * RULE: Determine if content can be emailed
 * Only exam-results can be emailed
 */
export function canEmail(contentType: ContentType): boolean {
  return contentType === 'exam-results';
}

/**
 * RULE: Get full permission object for a content type
 */
export function getSharePermissions(contentType: ContentType): SharePermission {
  const protectedTypes = ['syllabus', 'notes', 'solution', 'past-papers'];
  const isProtected = protectedTypes.includes(contentType);

  return {
    canShare: !isProtected,
    canDownload: !isProtected,
    canExportPDF: !isProtected,
    canExportWord: !isProtected,
    canPrint: true, // Browser can print, but watermark applies
    canEmail: !isProtected,
    reason: isProtected
      ? 'This content is proprietary and cannot be shared or downloaded. Access it on the website.'
      : undefined,
  };
}

/**
 * RULE: Validate if action is allowed on content
 */
export function isActionAllowed(
  contentType: ContentType,
  action: 'share' | 'download' | 'export-pdf' | 'export-word' | 'email' | 'print'
): boolean {
  const perms = getSharePermissions(contentType);

  switch (action) {
    case 'share':
      return perms.canShare;
    case 'download':
      return perms.canDownload;
    case 'export-pdf':
      return perms.canExportPDF;
    case 'export-word':
      return perms.canExportWord;
    case 'email':
      return perms.canEmail;
    case 'print':
      return perms.canPrint;
    default:
      return false;
  }
}

/**
 * RULE: Get user-facing message about sharing
 */
export function getShareMessage(contentType: ContentType): string {
  const permissions = getSharePermissions(contentType);

  if (permissions.reason) {
    return permissions.reason;
  }

  return 'You can share, download, and export this content.';
}

/**
 * RULE: Enforce API access - used in API routes
 * Throws error if action not allowed
 */
export function enforceShareAction(
  contentType: string,
  action: string
): void {
  const validTypes: ContentType[] = [
    'syllabus',
    'notes',
    'solution',
    'past-papers',
    'exam-results',
  ];

  if (!validTypes.includes(contentType as ContentType)) {
    throw new Error(`Invalid content type: ${contentType}`);
  }

  const validActions = ['share', 'download', 'export-pdf', 'export-word', 'email'];
  if (!validActions.includes(action)) {
    throw new Error(`Invalid action: ${action}`);
  }

  const contentTypeEnum = contentType as ContentType;
  const allowed = isActionAllowed(
    contentTypeEnum,
    action as 'share' | 'download' | 'export-pdf' | 'export-word' | 'email' | 'print'
  );

  if (!allowed) {
    throw new Error(
      `Action '${action}' is not allowed for content type '${contentType}'. ${getShareMessage(contentTypeEnum)}`
    );
  }
}

/**
 * RULE: Log unauthorized access attempts
 * Used for security monitoring
 */
export interface AccessLog {
  timestamp: string;
  userId: string;
  contentType: ContentType;
  action: string;
  allowed: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export function logAccessAttempt(log: AccessLog): void {
  const status = log.allowed ? 'ALLOWED' : 'BLOCKED';
  console.warn(
    `[ACCESS_CONTROL] ${status}: user=${log.userId}, content=${log.contentType}, action=${log.action}`
  );

  // In production, this would send to logging service
  if (typeof window === 'undefined') {
    // Server-side: could send to logging service
    // sendToLogService(log);
  }
}

/**
 * RULE: Alert on suspicious activity
 * Multiple failed attempts or unusual patterns
 */
export function checkSuspiciousActivity(
  userId: string,
  recentAttempts: AccessLog[]
): boolean {
  // Alert if user tried to access protected content more than 5 times in 5 minutes
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const protectedAttempts = recentAttempts.filter(
    (log) => {
      const isProtected = [
        'syllabus',
        'notes',
        'solution',
        'past-papers',
      ].includes(log.contentType);
      return (
        log.userId === userId &&
        !log.allowed &&
        isProtected &&
        log.timestamp > fiveMinutesAgo
      );
    }
  );

  if (protectedAttempts.length > 5) {
    console.warn(
      `[SECURITY_ALERT] Suspicious activity: user ${userId} attempted to access protected content ${protectedAttempts.length} times in 5 minutes`
    );
    return true;
  }

  return false;
}

/**
 * RULE: Get CSS class for content type
 * Used to apply access-control.css rules
 */
export function getContentClass(contentType: ContentType): string {
  const classMap: Record<ContentType, string> = {
    'syllabus': 'syllabus',
    'notes': 'notes',
    'solution': 'solution',
    'past-papers': 'past-papers',
    'exam-results': 'exam-results',
  };

  return classMap[contentType];
}

/**
 * RULE: Check if content is proprietary (not shareable)
 */
export function isProprietaryContent(contentType: ContentType): boolean {
  return ['syllabus', 'notes', 'solution', 'past-papers'].includes(contentType);
}

/**
 * RULE: Check if content is an exam result (shareable)
 */
export function isExamResult(contentType: ContentType): boolean {
  return contentType === 'exam-results';
}

/**
 * React Hook: useSharePermissions
 * Get permissions for a content type in React components
 */
export function useSharePermissions(contentType: ContentType) {
  const permissions = getSharePermissions(contentType);
  const message = getShareMessage(contentType);

  return {
    ...permissions,
    message,
    isProtected: isProprietaryContent(contentType),
  };
}
