/**
 * A faint, per-reader identity tiled across the lesson.
 *
 * This does not stop a screenshot — nothing in a browser can. What it does is
 * put the signed-in reader's own email on every copy of the page they can
 * capture, at an opacity that reads fine while studying but shows up clearly
 * once the image is shared or re-uploaded elsewhere. The deterrent is being
 * identifiable, not being blocked.
 *
 * aria-hidden and unselectable: it is a visual artifact of the render, not
 * content — a screen reader or a copy-paste should never see it.
 */
export function Watermark({ label }: { label: string }) {
  // Repeated rather than one central mark, so cropping the screenshot to hide
  // it also crops away most of the actual note.
  const tiles = Array.from({ length: 24 });

  return (
    <div className="reader-watermark" aria-hidden="true">
      {tiles.map((_, i) => (
        <span key={i}>{label}</span>
      ))}
    </div>
  );
}
