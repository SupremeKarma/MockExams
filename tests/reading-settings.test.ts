/**
 * The reading cookie is the one piece of UNTRUSTED input that reaches the
 * server-rendered `<html>` element. A student can edit it, and a stale one
 * survives a deploy, so both the parser and the attribute builder have to be
 * total: any string in, a valid settings object out.
 */

import { describe, expect, it } from "vitest";

import {
  DEFAULT_SETTINGS,
  FONTS,
  MODES,
  parseReadingCookie,
  readingAttributes,
  serialiseReadingCookie,
  SIZES,
  SPACINGS,
  THEMES,
  VIEWINGS,
  WIDTHS,
  type ReadingSettings,
} from "@/lib/examai/reading-settings";

const FULL: ReadingSettings = {
  theme: "night",
  size: "xl",
  font: "clear",
  width: "wide",
  spacing: "relaxed",
  viewing: "tv",
  focus: true,
  eyeBreaks: false,
  mode: "revision",
};

describe("reading cookie", () => {
  it("round-trips every field", () => {
    expect(parseReadingCookie(serialiseReadingCookie(FULL))).toEqual(FULL);
  });

  it("round-trips the defaults", () => {
    expect(parseReadingCookie(serialiseReadingCookie(DEFAULT_SETTINGS))).toEqual(DEFAULT_SETTINGS);
  });

  it("round-trips every value of every enumerated field", () => {
    for (const theme of THEMES) expect(round({ theme }).theme).toBe(theme);
    for (const size of SIZES) expect(round({ size }).size).toBe(size);
    for (const font of FONTS) expect(round({ font }).font).toBe(font);
    for (const width of WIDTHS) expect(round({ width }).width).toBe(width);
    for (const spacing of SPACINGS) expect(round({ spacing }).spacing).toBe(spacing);
    for (const viewing of VIEWINGS) expect(round({ viewing }).viewing).toBe(viewing);
    for (const focus of [true, false]) expect(round({ focus }).focus).toBe(focus);
    for (const eyeBreaks of [true, false]) expect(round({ eyeBreaks }).eyeBreaks).toBe(eyeBreaks);
    for (const mode of MODES) expect(round({ mode }).mode).toBe(mode);
  });

  it("keeps the default serialisation short", () => {
    // Every field that equals its default is omitted, so the common cookie
    // stays small enough not to matter on a slow connection.
    expect(serialiseReadingCookie(DEFAULT_SETTINGS)).toBe(
      "size:m,font:book,width:normal,spacing:normal"
    );
  });

  it("omits the theme entirely when unset", () => {
    // Not `theme:` with an empty value: the stylesheet keys its
    // prefers-color-scheme fallback on :root:not([data-theme]).
    expect(serialiseReadingCookie({ ...DEFAULT_SETTINGS, theme: null })).not.toContain("theme");
    expect(readingAttributes({ ...DEFAULT_SETTINGS, theme: null })).not.toHaveProperty("data-theme");
  });
});

describe("a hostile or broken cookie", () => {
  const JUNK = [
    undefined,
    "",
    ",,,,",
    "::::",
    "theme",
    "theme:",
    ":paper",
    "theme:<script>alert(1)</script>",
    "size:999",
    "width:'; DROP TABLE --",
    "focus:yes",
    "eye:maybe",
    "theme:paper,theme:night",
    "a".repeat(10_000),
    "theme:PAPER",
    "theme: paper ,size: l ",
  ];

  it.each(JUNK)("never throws and never yields an invalid value: %j", (raw) => {
    const settings = parseReadingCookie(raw as string | undefined);

    expect(settings.theme === null || (THEMES as readonly string[]).includes(settings.theme)).toBe(
      true
    );
    expect(SIZES).toContain(settings.size);
    expect(FONTS).toContain(settings.font);
    expect(WIDTHS).toContain(settings.width);
    expect(SPACINGS).toContain(settings.spacing);
    expect(VIEWINGS).toContain(settings.viewing);
    expect(typeof settings.focus).toBe("boolean");
    expect(typeof settings.eyeBreaks).toBe("boolean");
  });

  it("cannot inject an attribute value that escapes its quotes", () => {
    // The attributes are spread onto <html> by React, which escapes them — but
    // the parser should never produce such a value in the first place.
    const attrs = readingAttributes(parseReadingCookie('theme:paper" onload="x'));
    for (const value of Object.values(attrs)) {
      expect(value).not.toMatch(/["'<>]/);
    }
  });

  it("whitespace around a value is tolerated, case is not", () => {
    // Trimming is a kindness for a hand-edited cookie. Case-folding is not:
    // the values become data-* attributes the stylesheet matches exactly, so
    // accepting "PAPER" would set an attribute no CSS rule selects.
    expect(parseReadingCookie("theme: night ").theme).toBe("night");
    expect(parseReadingCookie("theme:NIGHT").theme).toBeNull();
  });
});

describe("html attributes", () => {
  it("carries every setting the stylesheet keys on", () => {
    expect(readingAttributes(FULL)).toEqual({
      "data-theme": "night",
      "data-size": "xl",
      "data-font": "clear",
      "data-width": "wide",
      "data-spacing": "relaxed",
      "data-viewing": "tv",
      "data-focus": "on",
    });
  });

  it("omits the optional attributes when off, rather than writing a falsy value", () => {
    // `data-viewing="page"` and `data-focus="off"` would both be truthy to a
    // CSS attribute selector written as [data-focus]; absence is the contract.
    const attrs = readingAttributes(DEFAULT_SETTINGS);
    expect(attrs).not.toHaveProperty("data-viewing");
    expect(attrs).not.toHaveProperty("data-focus");
  });
});

function round(patch: Partial<ReadingSettings>): ReadingSettings {
  return parseReadingCookie(serialiseReadingCookie({ ...DEFAULT_SETTINGS, ...patch }));
}
