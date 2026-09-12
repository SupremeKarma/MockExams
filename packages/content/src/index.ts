// @examai/content — parse, validate, derive, render.
//
// The one place note markdown is understood. Admin preview, the publish
// pipeline and the Reader all import from here; there is deliberately no second
// parser or renderer anywhere in the repo.

export * from "./types";
export { parseDocument, buildToc, splitFrontmatter, toMdast } from "./parse";
export { renderMarkdown, renderDocument, type RenderResult } from "./render";
export { diffAnchors, type AnchorDiff } from "./anchors";
export {
  publishDocument,
  generateShortId,
  ValidationFailed,
  AnchorsWouldBreak,
  type PublishInput,
  type PublishResult,
} from "./publish";
