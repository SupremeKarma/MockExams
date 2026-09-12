"use client";

import { useCallback, useState } from "react";

import {
  COOKIE_NAME,
  DEFAULT_SETTINGS,
  serialiseReadingCookie,
  type FontChoice,
  type ReadingSettings as Settings,
  type Size,
  type Spacing,
  type Theme,
  type Width,
} from "@/lib/examai/reading-settings";
import { Icon } from "./IconSprite";
import { useDialog } from "./useDialog";

const THEME_LABELS: Record<Theme, string> = {
  paper: "Paper",
  warm: "Warm",
  blackboard: "Blackboard",
  night: "Night",
};

/**
 * Swatch preview colours.
 *
 * These are the `--bg` and `--ink` of each theme, copied from tokens.css as
 * literals. They have to be literals: the swatch shows what a theme LOOKS like
 * while a different theme is still active, so `var(--bg)` would paint all four
 * chips the same. tokens.css stays the source of truth — if a theme's paper
 * colour changes there, change it here too.
 */
const THEME_PREVIEW: Record<Theme, { background: string; color: string }> = {
  paper: { background: "#FBFBF8", color: "#1A2230" },
  warm: { background: "#EFE6D2", color: "#2B241B" },
  blackboard: { background: "#1B2320", color: "#E7E5DD" },
  night: { background: "#000000", color: "#C9C4B8" },
};

const SIZE_ORDER: Size[] = ["s", "m", "l", "xl", "xxl"];

/** Named rather than a percentage, so the announcement is meaningful aloud. */
const SIZE_NAMES: Record<Size, string> = {
  s: "Smaller",
  m: "Default",
  l: "Large",
  xl: "Larger",
  xxl: "Largest",
};

interface Props {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  onChange: (next: Settings) => void;
}

/**
 * Reading preferences.
 *
 * Changes apply to `<html>` immediately and are written to a cookie, which the
 * root layout reads on the next request — so the choice survives navigation
 * with no flash of the previous theme. The same values go to the student's
 * profile when signed in, so they follow them from phone to laptop; the cookie
 * is only the cache (DESIGN.md §6).
 *
 * The controls are real `fieldset`/`legend`/`input` groups rather than buttons
 * with `aria-pressed`, because that is the markup the design system's CSS is
 * written against: `.segmented label:has(input:checked)`, `.swatch input`,
 * `.switch input`. Styling a button here would mean forking the stylesheet.
 */
export function ReadingSettingsDialog({ open, onClose, settings, onChange }: Props) {
  const { ref, handleClose, handleClick } = useDialog(open, onClose);
  const [status, setStatus] = useState("");

  const update = useCallback(
    (patch: Partial<Settings>, announce?: string) => {
      const next = { ...settings, ...patch };
      onChange(next);
      if (announce !== undefined) setStatus(announce);

      const root = document.documentElement;
      if (next.theme) root.setAttribute("data-theme", next.theme);
      else root.removeAttribute("data-theme");
      root.setAttribute("data-size", next.size);
      root.setAttribute("data-font", next.font);
      root.setAttribute("data-width", next.width);
      root.setAttribute("data-spacing", next.spacing);
      if (next.viewing === "tv") root.setAttribute("data-viewing", "tv");
      else root.removeAttribute("data-viewing");
      if (next.focus) root.setAttribute("data-focus", "on");
      else root.removeAttribute("data-focus");

      // A year, and SameSite=Lax so it still arrives on a normal navigation
      // from an external link — which is how most students will open a topic.
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
        serialiseReadingCookie(next)
      )}; path=/; max-age=31536000; SameSite=Lax`;
    },
    [settings, onChange]
  );

  const sizeIndex = SIZE_ORDER.indexOf(settings.size);

  return (
    <dialog
      ref={ref}
      className="settings-dialog panel"
      aria-labelledby="settings-title"
      onClose={handleClose}
      onClick={handleClick}
    >
      <div className="dialog__head">
        <h2 id="settings-title">Reading</h2>
        <button type="button" className="icon-btn" aria-label="Close reading settings" onClick={onClose}>
          <Icon name="i-close" />
        </button>
      </div>

      <div className="dialog__body">
        <fieldset className="setting">
          <legend>Theme</legend>
          <div className="swatches">
            {(Object.keys(THEME_LABELS) as Theme[]).map((theme) => {
              const checked = settings.theme === theme;
              return (
                // `is-checked` duplicates what `:has(input:checked)` already
                // does, for engines without :has — the demo's own fallback.
                <label key={theme} className={`swatch${checked ? " is-checked" : ""}`}>
                  <input
                    type="radio"
                    name="theme"
                    value={theme}
                    checked={checked}
                    onChange={() => update({ theme }, `Theme set to ${THEME_LABELS[theme]}.`)}
                  />
                  <span className="swatch__chip" style={THEME_PREVIEW[theme]} aria-hidden="true">
                    Aa
                  </span>
                  {THEME_LABELS[theme]}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="setting">
          <span className="legend" id="size-label">
            Text size
          </span>
          <div className="stepper" role="group" aria-labelledby="size-label">
            <button
              type="button"
              className="btn"
              aria-label="Smaller text"
              disabled={sizeIndex <= 0}
              onClick={() => update({ size: SIZE_ORDER[Math.max(0, sizeIndex - 1)] })}
            >
              A−
            </button>
            <output aria-live="polite">{SIZE_NAMES[settings.size]}</output>
            <button
              type="button"
              className="btn"
              aria-label="Larger text"
              disabled={sizeIndex >= SIZE_ORDER.length - 1}
              onClick={() =>
                update({ size: SIZE_ORDER[Math.min(SIZE_ORDER.length - 1, sizeIndex + 1)] })
              }
            >
              A+
            </button>
          </div>
        </div>

        <Segmented
          name="font"
          label="Font"
          value={settings.font}
          options={[
            ["book", "Book"],
            ["clear", "Clear"],
          ]}
          onChange={(font, text) => update({ font: font as FontChoice }, `Font set to ${text}.`)}
        />

        <Segmented
          name="width"
          label="Line width"
          value={settings.width}
          options={[
            ["narrow", "Narrow"],
            ["normal", "Normal"],
            ["wide", "Wide"],
          ]}
          onChange={(width, text) => update({ width: width as Width }, `Line width set to ${text}.`)}
        />

        <Segmented
          name="spacing"
          label="Line spacing"
          value={settings.spacing}
          options={[
            ["normal", "Normal"],
            ["relaxed", "Relaxed"],
          ]}
          onChange={(spacing, text) => update({ spacing: spacing as Spacing }, `Line spacing set to ${text}.`)}
        />

        {/* `.hide-small` is display:none below 1000px, where there are no side
            panes to hide — the offer would be meaningless there. */}
        <label className="switch hide-small">
          <span>
            Focus mode
            <small>Hide the syllabus and contents panels</small>
          </span>
          <input
            type="checkbox"
            checked={settings.focus}
            onChange={() =>
              update(
                { focus: !settings.focus },
                settings.focus ? "Focus mode off. The side panels are back." : "Focus mode on. Side panels hidden."
              )
            }
          />
        </label>

        <label className="switch">
          <span>
            TV and projector view
            <small>Large text for reading across a room</small>
          </span>
          <input
            type="checkbox"
            checked={settings.viewing === "tv"}
            onChange={() =>
              update(
                {
                  viewing: settings.viewing === "tv" ? "page" : "tv",
                  // TV guidance favours light text on dark; moving a Paper
                  // reader to Blackboard is the documented behaviour, and the
                  // banner says so rather than changing the theme silently.
                  theme:
                    settings.viewing === "tv"
                      ? settings.theme
                      : settings.theme === "paper" || settings.theme === null
                        ? "blackboard"
                        : settings.theme,
                },
                settings.viewing === "tv"
                  ? "TV view off."
                  : "TV view on. Text is larger and the panels are hidden."
              )
            }
          />
        </label>

        <label className="switch">
          <span>
            Eye break reminder
            <small>Every 20 minutes, a quiet reminder to look away</small>
          </span>
          <input
            type="checkbox"
            checked={settings.eyeBreaks}
            onChange={() =>
              update(
                { eyeBreaks: !settings.eyeBreaks },
                settings.eyeBreaks ? "Eye break reminders off." : "Eye break reminders on, every 20 minutes."
              )
            }
          />
        </label>

        {/* Most of these controls change the page BEHIND the dialog, where a
            screen-reader user cannot see the result. This says what happened. */}
        <p className="status-line" aria-live="polite">
          {status}
        </p>

        <button
          type="button"
          className="btn btn--quiet"
          onClick={() => {
            update({ ...DEFAULT_SETTINGS, eyeBreaks: settings.eyeBreaks });
            setStatus("Reading settings reset to their defaults.");
          }}
        >
          Reset to defaults
        </button>
      </div>
    </dialog>
  );
}

function Segmented({
  name,
  label,
  value,
  options,
  onChange,
}: {
  name: string;
  label: string;
  value: string;
  options: [string, string][];
  onChange: (value: string, text: string) => void;
}) {
  return (
    <fieldset className="setting">
      <legend>{label}</legend>
      <div className="segmented">
        {options.map(([key, text]) => {
          const checked = value === key;
          return (
            <label key={key} className={checked ? "is-checked" : undefined}>
              <input
                type="radio"
                name={name}
                value={key}
                checked={checked}
                onChange={() => onChange(key, text)}
              />
              {text}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
