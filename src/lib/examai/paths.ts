// Cloud Storage path construction — the single source of truth.
//
// Mirrored in examai-api/app/paths.py. These two files must agree exactly: the
// worker writes a solution and the reader fetches it, and if the paths differ
// by one character the read returns "not found" rather than an error anyone
// would notice. That is a silent failure, so paths are never built inline.

/** Extensions we accept for an uploaded page. Anything else is rejected upstream. */
export const PAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "pdf"] as const;
export type PageExtension = (typeof PAGE_EXTENSIONS)[number];

export const MIME_TO_EXTENSION: Readonly<Record<string, PageExtension>> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

export function paperRoot(paperId: string): string {
  return `papers/${paperId}`;
}

/**
 * An uploaded page. `index` is 0-based and defines READING ORDER, which is why
 * it is zero-padded: `10.jpg` must not sort before `2.jpg` when the bucket is
 * listed, or a two-page paper reassembles backwards.
 */
export function originalPath(paperId: string, index: number, ext: PageExtension): string {
  return `${paperRoot(paperId)}/original/${String(index).padStart(3, "0")}.${ext}`;
}

/** ONE source of truth per question — both the AI's context and what students read. */
export function solutionPath(paperId: string, qId: string): string {
  return `${paperRoot(paperId)}/solutions/q${qId}.md`;
}

/** Cached render. Regenerate whenever any solution in the paper changes. */
export function exportPdfPath(paperId: string): string {
  return `${paperRoot(paperId)}/export/full.pdf`;
}

/**
 * Guard against a paperId that would escape its own prefix.
 *
 * A paperId reaches this from an API request body. Without the check, an id
 * containing "../" would write outside the paper's folder — into another
 * paper's solutions, or over an export someone is serving. Ids are always
 * `<CODE>_<YEAR>_<type>`, so this rejects everything that is not that shape
 * rather than trying to sanitise it.
 */
export function isSafePathSegment(value: string): boolean {
  return /^[A-Za-z0-9_-]+$/.test(value) && value.length > 0 && value.length <= 64;
}
