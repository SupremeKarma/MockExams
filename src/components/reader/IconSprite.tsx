/**
 * The icon sprite, rendered once per page.
 *
 * Both the React chrome and the markdown renderer reference these by
 * `<use href="#i-…">`, which is what lets the content package emit icons
 * without importing a component — it produces plain HTML, and the sprite has to
 * already be on the page for those references to resolve.
 *
 * Strokes are set here rather than per-icon so a theme change moves every icon
 * with the text colour.
 */
export function IconSprite() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
      focusable="false"
    >
      <symbol id="i-menu" viewBox="0 0 24 24">
        <path d="M4 7h16M4 12h16M4 17h10" />
      </symbol>
      <symbol id="i-search" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </symbol>
      <symbol id="i-list" viewBox="0 0 24 24">
        <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
      </symbol>
      <symbol id="i-tree" viewBox="0 0 24 24">
        <path d="M5 4v16M5 8h6M5 14h6M13 8h6M13 14h6" />
      </symbol>
      <symbol id="i-check" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8.5" />
        <path d="m8.5 12.2 2.3 2.3 4.7-4.9" />
      </symbol>
      <symbol id="i-close" viewBox="0 0 24 24">
        <path d="M6 6l12 12M18 6 6 18" />
      </symbol>
      <symbol id="i-bulb" viewBox="0 0 24 24">
        <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" />
      </symbol>
      <symbol id="i-grid" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M4 10h16M4 16h16M10 4v16M16 4v16" />
      </symbol>
      <symbol id="i-pen" viewBox="0 0 24 24">
        <path d="m14.5 5.5 4 4L9 19H5v-4l9.5-9.5Z" />
        <path d="m13 7 4 4" />
      </symbol>
      <symbol id="i-alert" viewBox="0 0 24 24">
        <path d="M12 4 3 20h18L12 4Z" />
        <path d="M12 10v4M12 17h.01" />
      </symbol>
      <symbol id="i-steps" viewBox="0 0 24 24">
        <path d="M4 18h4v-4h4v-4h4V6h4" />
      </symbol>
      <symbol id="i-box" viewBox="0 0 24 24">
        <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
        <rect x="6" y="8" width="12" height="8" rx="1" />
      </symbol>
      <symbol id="i-tick" viewBox="0 0 24 24">
        <path d="m5 12.5 4.2 4.2L19 7" />
      </symbol>
      <symbol id="i-type" viewBox="0 0 24 24">
        <path d="M4 7V5h16v2M12 5v14M9 19h6" />
      </symbol>
      <symbol id="i-back" viewBox="0 0 24 24">
        <path d="M14 6 8 12l6 6" />
      </symbol>
      <symbol id="i-forward" viewBox="0 0 24 24">
        <path d="m10 6 6 6-6 6" />
      </symbol>
      <symbol id="i-refresh" viewBox="0 0 24 24">
        <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" />
        <path d="M18 3v4h-4M6 21v-4h4" />
      </symbol>
      <symbol id="i-chevron-down" viewBox="0 0 24 24">
        <path d="m6 9 6 6 6-6" />
      </symbol>
    </svg>
  );
}

/** One icon from the sprite. */
export function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <svg className={className ? `icon ${className}` : "icon"} aria-hidden="true" focusable="false">
      <use href={`#${name}`} />
    </svg>
  );
}
