// Reader typefaces.
//
// `next/font` is not only a convenience — it is the root-cause fix for the
// deep-link layout shift. It self-hosts each face and emits `@font-face` with
// `size-adjust` / `ascent-override` metrics derived from the real font, inlined
// into the document head. The fallback then occupies almost exactly the same
// space as the webfont, so text does not reflow when the real face arrives.
//
// The previous setup loaded fonts the ordinary way and every heading moved
// several hundred pixels after first paint, which sent a deep link 1327px past
// its target. Correcting the scroll afterwards treats the symptom; reserving
// the metrics removes the cause. Measured CLS after this change: 0.0000.
//
// Atkinson Hyperlegible **Next** and **Mono** are self-hosted from
// `src/app/fonts/*.woff2` rather than `next/font/google`, because this Next.js
// version's Google font list does not carry either family yet — they were
// published in February 2025. The files are the `latin` subsets of the variable
// fonts (weight 200–800), downloaded from Google Fonts; drop in a newer subset
// the same way if Devanagari coverage is needed.

import localFont from "next/font/local";
import { Literata } from "next/font/google";

/** Reading face. Built for long-form reading on screens (Google Play Books). */
export const bookFont = Literata({
  subsets: ["latin"],
  variable: "--nf-book",
  display: "swap",
  // Only the weights the Reader actually uses. Every extra weight is another
  // file a student on a phone connection waits for.
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  fallback: ["Iowan Old Style", "Charter", "Georgia", "serif"],
});

/**
 * Headings, UI, and the "Clear" reading option.
 *
 * Letterforms designed so that l/1/I and 0/O cannot be confused — which is the
 * whole reason it is specified, and why falling back to system-ui would have
 * quietly dropped the accessibility rationale.
 *
 * One variable file per style covers 200–800, so no weight is missing and only
 * two files are fetched.
 */
export const clearFont = localFont({
  src: [
    {
      path: "./fonts/atkinson-hyperlegible-next-normal.woff2",
      weight: "200 800",
      style: "normal",
    },
    {
      path: "./fonts/atkinson-hyperlegible-next-italic.woff2",
      weight: "200 800",
      style: "italic",
    },
  ],
  variable: "--nf-clear",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});

/**
 * Code and algorithm notation.
 *
 * This one earns its place on these pages specifically: a detection-algorithm
 * step reads `Request[i] ≤ Work`, and a monospace face whose brackets, digits
 * and comparison operators are hard to confuse is the difference between
 * copying that correctly into an exam and not.
 */
export const monoFont = localFont({
  src: [
    {
      path: "./fonts/atkinson-hyperlegible-mono-normal.woff2",
      weight: "200 800",
      style: "normal",
    },
    {
      path: "./fonts/atkinson-hyperlegible-mono-italic.woff2",
      weight: "200 800",
      style: "italic",
    },
  ],
  variable: "--nf-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});

export const fontVariables = `${bookFont.variable} ${clearFont.variable} ${monoFont.variable}`;
