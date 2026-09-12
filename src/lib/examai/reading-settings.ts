// Reader preferences, carried as `data-*` attributes on <html>.
//
// They live in a COOKIE rather than localStorage for one reason: the server has
// to know the theme before it sends the first byte. Reading it on the client
// means the page paints in the default theme and then repaints — a white flash
// in a dark room, which is exactly the situation the Night theme exists for.
//
// For signed-in students the profile is the source of truth and this cookie is
// a cache, so preferences follow them from phone to laptop (DESIGN.md §6).

export const THEMES = ["paper", "warm", "blackboard", "night"] as const;
export const SIZES = ["s", "m", "l", "xl", "xxl"] as const;
export const FONTS = ["book", "clear"] as const;
export const WIDTHS = ["narrow", "normal", "wide"] as const;
export const SPACINGS = ["normal", "relaxed"] as const;
export const VIEWINGS = ["page", "tv"] as const;
export const MODES = ["beginner", "revision"] as const;

export type Theme = (typeof THEMES)[number];
export type Size = (typeof SIZES)[number];
export type FontChoice = (typeof FONTS)[number];
export type Width = (typeof WIDTHS)[number];
export type Spacing = (typeof SPACINGS)[number];
export type Viewing = (typeof VIEWINGS)[number];
export type ReadingMode = (typeof MODES)[number];

export interface ReadingSettings {
  /**
   * Null means "not chosen yet", which is NOT the same as "paper".
   *
   * With no attribute the stylesheet falls through to `prefers-color-scheme`,
   * so a student whose phone is in dark mode gets Blackboard on first visit
   * without having to ask. Defaulting to paper here would override the device.
   */
  theme: Theme | null;
  size: Size;
  font: FontChoice;
  width: Width;
  spacing: Spacing;
  viewing: Viewing;
  /**
   * Hide both side panes and read on the article alone.
   *
   * Only meaningful from 1000px up, where the panes exist at all — below that
   * the stylesheet hides its toggle with `.hide-small`, because "hide the
   * panels" is a confusing offer on a phone that never showed them.
   */
  focus: boolean;
  eyeBreaks: boolean;
  /**
   * Beginner shows every `idea`/`example` block expanded; Revision collapses
   * them to `<details>`, leaving method and key points.
   *
   * Unlike every other setting here, this changes the SERVER-RENDERED HTML
   * itself (packages/content/src/render.ts), not a CSS token — collapsing with
   * `<details>` rather than JavaScript is what keeps it working with no JS and
   * in print. So switching it needs a server round trip (see
   * ReadingSettingsDialog's mode handler), where every other control here
   * applies instantly by writing a `data-*` attribute on the client.
   */
  mode: ReadingMode;
}

export const COOKIE_NAME = "examai_reader";

export const DEFAULT_SETTINGS: ReadingSettings = {
  theme: null,
  size: "m",
  font: "book",
  width: "normal",
  spacing: "normal",
  viewing: "page",
  focus: false,
  eyeBreaks: true,
  mode: "beginner",
};

function pick<T extends readonly string[]>(
  allowed: T,
  value: string | undefined,
  fallback: T[number]
): T[number] {
  return value && (allowed as readonly string[]).includes(value) ? (value as T[number]) : fallback;
}

/** `theme:paper,size:m,font:book,width:normal,spacing:normal,eye:on` */
export function parseReadingCookie(raw: string | undefined): ReadingSettings {
  if (!raw) return DEFAULT_SETTINGS;

  const values = new Map<string, string>();
  for (const part of raw.split(",")) {
    const [key, value] = part.split(":");
    if (key && value) values.set(key.trim(), value.trim());
  }

  const theme = values.get("theme");
  return {
    theme: theme && (THEMES as readonly string[]).includes(theme) ? (theme as Theme) : null,
    size: pick(SIZES, values.get("size"), "m"),
    font: pick(FONTS, values.get("font"), "book"),
    width: pick(WIDTHS, values.get("width"), "normal"),
    spacing: pick(SPACINGS, values.get("spacing"), "normal"),
    viewing: pick(VIEWINGS, values.get("viewing"), "page"),
    focus: values.get("focus") === "on",
    eyeBreaks: values.get("eye") !== "off",
    mode: pick(MODES, values.get("mode"), "beginner"),
  };
}

export function serialiseReadingCookie(settings: ReadingSettings): string {
  const parts = [
    settings.theme ? `theme:${settings.theme}` : null,
    `size:${settings.size}`,
    `font:${settings.font}`,
    `width:${settings.width}`,
    `spacing:${settings.spacing}`,
    settings.viewing === "tv" ? "viewing:tv" : null,
    settings.focus ? "focus:on" : null,
    settings.eyeBreaks ? null : "eye:off",
    settings.mode === "revision" ? "mode:revision" : null,
  ].filter(Boolean);
  return parts.join(",");
}

/**
 * The attributes to spread onto `<html>`.
 *
 * `data-theme` is omitted entirely when unset — the stylesheet keys its
 * `prefers-color-scheme` fallback on `:root:not([data-theme])`, so an empty
 * string would defeat it.
 */
export function readingAttributes(settings: ReadingSettings): Record<string, string> {
  const attrs: Record<string, string> = {
    "data-size": settings.size,
    "data-font": settings.font,
    "data-width": settings.width,
    "data-spacing": settings.spacing,
  };
  if (settings.theme) attrs["data-theme"] = settings.theme;
  if (settings.viewing === "tv") attrs["data-viewing"] = "tv";
  if (settings.focus) attrs["data-focus"] = "on";
  return attrs;
}

/**
 * Does this user agent look like a TV?
 *
 * Used only to SUGGEST the TV view, never to switch automatically — detection
 * guesses wrong often enough that silently reflowing a laptop into 29px type
 * would be worse than the occasional missed TV (DESIGN.md §7).
 */
export function looksLikeTv(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return /\b(SMART-TV|SmartTV|Tizen|Web0S|webOS|NetCast|BRAVIA|AFT[BMS]|GoogleTV|HbbTV|Viera|AppleTV|CrKey)\b/i.test(
    userAgent
  );
}
