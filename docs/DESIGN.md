# ExamAI Study Design System

A reading interface built for long study sessions on every screen a Nepali student actually uses: a shared family laptop, a phone on a bus, an iPad, a college lab monitor, or a TV in the living room.

**Files**

| File | What it is |
|---|---|
| `tokens.css` | Colors for 4 themes, type families, scale, spacing, reading preferences |
| `reader.css` | Layout (1, 2 or 3 panes), article typography, study blocks, syllabus tree, outline, dialogs, phone toolbar, TV view, print |
| `ExamAI_Reader_Demo.html` | Working demo of topic 6.d with every piece wired up |

---

## 1. Principles

1. **The page is the product.** Everything that isn't the lesson stays quiet: thin rules, muted panes, no decoration.
2. **Borrow from the student's desk, not from SaaS templates.** Copy paper and ballpoint ink for text. A red margin line like an exam notebook. Highlighter for the plain-words idea. Squared maths paper behind worked examples. A boxed final answer like on an answer sheet. The teacher's red pen for exam tips.
3. **One bold element.** The red margin line is the signature. Nothing else competes with it.
4. **Readable first, pretty second.** Every text color is checked against its background. Line length stays under 80 characters. Nothing depends on color alone.
5. **The reader decides.** Theme, size, font, line width and spacing are one tap away and remembered.
6. **Study time, not screen time.** Success is topics learned, not minutes on the site (see section 8).

---

## 2. Themes

| Theme | Use it for | Feel |
|---|---|---|
| **Paper** (default) | Daytime, most studying | Copy paper, blue-black ink |
| **Warm** | Evening under a lamp | Old notebook, less blue light glare |
| **Blackboard** | Dark rooms, TVs and projectors | Classroom slate and chalk |
| **Night** | OLED phones in bed, very dark rooms | True black, dimmed chalk so white text doesn't glow |

**Why Paper is the default:** reading studies consistently find dark text on a light background gives better legibility and proofreading performance than light-on-dark, for younger and older adults. Dark themes are still offered because comfort in a dark room matters too. Until the student picks, the theme follows the device's light/dark setting.

### Verified contrast (WCAG ratios, computed from `tokens.css`)

| Pair | Paper | Warm | Blackboard | Night | Target |
|---|---|---|---|---|---|
| Body text | 15.4 | 12.3 | 12.7 | 12.1 | 7:1 |
| Secondary text | 8.8 | 7.6 | 8.9 | 7.9 | 4.5:1 |
| Hints, meta | 5.4 | 5.4 | 6.2 | 5.9 | 4.5:1 |
| Links, accent | 7.7 | 7.0 | 9.0 | 8.8 | 4.5:1 |
| Red pen (exam tips) | 5.2 | 5.3 | 6.7 | 7.3 | 4.5:1 |
| Text on highlighter | 14.0 | 11.0 | 10.2 | 9.7 | 7:1 |
| Common mistake label | 5.9 | 5.9 | 8.1 | 8.2 | 4.5:1 |
| Learned (ok) | 5.1 | 5.1 | 8.8 | 10.0 | 4.5:1 |
| Button text on accent | 7.7 | 7.0 | 9.0 | 8.8 | 4.5:1 |
| Control borders | 3.4 | 3.5 | 3.6 | 3.5 | 3:1 |

Body text meets AAA (7:1) in every theme. **If you add or change a color, rerun the contrast check.** Don't eyeball it.

Colors are plain hex on purpose. Many Smart TV browsers run old Chromium or WebKit builds that ignore `oklch()`.

### Token names

`--bg` page · `--bg-rail` side panes · `--surface` dialogs, tables · `--ink` / `--ink-2` / `--ink-3` text levels · `--rule` hairlines · `--rule-strong` control borders · `--accent` links, focus, primary buttons · `--accent-soft` current item · `--pen` exam tips, "asked in" marks · `--pen-line` margin line · `--highlight` idea block, text selection · `--grid-bg` / `--grid-line` example paper · `--warn-ink` / `--warn-bg` / `--warn-line` common mistakes · `--ok` learned · `--focus` focus ring · `--elevation` dialogs only

---

## 3. Typography

| Role | Typeface | Why |
|---|---|---|
| Reading, "Book" | **Literata** | Built for long-form reading on screens (originally Google Play Books); variable, free |
| Headings, UI, "Clear" reading option | **Atkinson Hyperlegible Next** | Letterforms designed to be hard to confuse (l/1/I, 0/O); free, variable, 150+ languages |
| Code, algorithms | **Atkinson Hyperlegible Mono** | Same family, clear symbols for `Request[i] ≤ Work` |
| Nepali, Maithili | **Noto Serif / Noto Sans Devanagari** | Fallback in both stacks; load only on pages with Devanagari |

**Rules**
- Body size is fluid, **17px on phones to 19px on desktops**, times the reader's size choice (5 steps, 90% to 140%).
- Modular scale 1.2 (minor third): H3 = 1.2em, H2 = 1.44em, H1 up to 2.07em.
- Line length: **58 / 66 / 76 characters** (Narrow / Normal / Wide). Never over 80.
- Line height: 1.7 for Literata, 1.6 for Atkinson, 1.9 for "Relaxed" and for Devanagari (matras need room).
- Tables use Atkinson with **tabular numbers** so Gantt charts and matrices line up.
- `text-wrap: balance` on headings, `pretty` on paragraphs. Both are progressive: Firefox currently ignores `pretty` and wraps normally.
- Sentence case everywhere. No all-caps labels.

---

## 4. Layout by device

| Screen | Layout | Navigation |
|---|---|---|
| **Phone** (< 1000px) | One column, full-width page, safe-area padding for notches | Bottom toolbar: Syllabus, Contents, Reading, Learned. Syllabus opens as a drawer; Contents and Reading as bottom sheets |
| **iPad, small laptop** (1000–1279px) | Article + "On this page" on the right | Syllabus button in the header opens a drawer |
| **Laptop, desktop** (≥ 1280px) | Syllabus tree, article, "On this page" | All visible; panes stick while the article scrolls |
| **Large monitor** (≥ 1920px) | Same, wider side panes | Text column never stretches past the chosen line width |
| **TV, projector** (TV view) | One column, text sized from screen width | Big "Contents" button; remote/arrow keys move a thick focus ring |
| **Print / PDF** | Black on white, no chrome | Blocks, tables and figures don't split across pages |

Layout uses viewport media queries, not container queries, so it still works on older TV browsers. Split-screen iPad and resized windows get the matching layout for their width.

**Touch:** targets are 44px on touch screens and 40px with a mouse. Hover styles only apply on devices that can hover.

---

## 5. Study blocks (match the allowed markdown directives)

| Directive | Class | Look | Meaning |
|---|---|---|---|
| `:::idea` | `.block--idea` | Highlighter stroke, slightly uneven edges | The idea in plain words; read this first |
| `:::example` | `.block--example` | Squared maths paper | Worked example |
| `:::working` | `.block--working` | Bordered, numbered steps | A method to follow in order |
| `:::answer-box` | `.block--answer` | Double ink border | Final answer, as boxed on an answer sheet |
| `:::exam-tip` | `.block--tip` | Red pen line and label | What examiners look for |
| `:::warning` | `.block--warning` | Amber note | Common mistake |
| `:::formula` | `.block--formula` | Set apart between rules, scrolls sideways if long | Formula or update rule |
| `:::diagram` | `figure` + `.diagram-svg` | Theme-aware SVG + caption | Diagrams use theme colors, so they work in all 4 themes |

Every block has a text label with an icon, so meaning never relies on color alone. **Trust badge** under the title: hollow dot "AI draft", filled green "Code-verified", filled blue "Teacher-verified".

---

## 6. Reading settings

| Setting | Values | Stored as |
|---|---|---|
| Theme | Paper, Warm, Blackboard, Night | `data-theme` |
| Text size | 5 steps | `data-size` = s, m, l, xl, xxl |
| Font | Book, Clear | `data-font` |
| Line width | Narrow, Normal, Wide | `data-width` |
| Line spacing | Normal, Relaxed | `data-spacing` |
| Focus mode | On/off (large screens only) | `data-focus="on"` |
| TV and projector view | On/off | `data-viewing="tv"` |
| Eye break reminder | On/off | user profile |

**Persist without a flash of the wrong theme**
1. Save preferences to a cookie (for example `examai_reader=theme:paper,size:m,font:book,width:normal,spacing:normal`).
2. In the root layout, read the cookie on the server and render the attributes on `<html>`. The first paint is already correct.
3. For signed-in students, also save to their profile, so preferences follow them from phone to laptop. The cookie is only a cache.
4. No saved theme → no `data-theme` attribute → the device's light/dark setting decides.

The demo doesn't persist anything, because artifact previews block storage.

---

## 7. TV and projector view

- **Text scales with screen width** (`1.5vw` root, about 29px on a 1080p TV), so it reads the same on a 32-inch TV or a projector wall.
- **Safe area:** content stays at least 5% from the edges. TV platform guidelines keep about a 5% margin so overscan never cuts off text.
- **Sans-serif body and Blackboard theme by default:** Android TV guidance favors simple sans-serif fonts and light text on dark backgrounds. Switching to TV view moves Paper users to Blackboard and says so.
- **Remote-friendly:** no hover, thick focus ring with a gap, big targets, one column, header not sticky.
- **How it turns on:** a toggle in Reading settings, or a `?view=tv` link. If the user agent looks like a TV (Tizen, webOS, Android TV, BRAVIA, Fire TV), *suggest* TV view with a banner. Don't switch automatically, since detection guesses wrong.

---

## 8. Wellbeing: long sessions without burning out

- **The metric is learning.** Measure topics learned, practice accuracy and exam readiness, not minutes on site. No streak guilt, infinite feeds, or autoplay.
- **Eye break reminder (on by default, easy to turn off):** every 20 minutes a quiet message suggests looking about 6 metres away for 20 seconds, based on the 20-20-20 guidance eye-care organisations give for digital eye strain. It never blocks the page and never interrupts a mock exam timer.
- **Natural stopping points:** "Mark as learned" and the next-topic links at the end of every lesson give a clean place to pause.
- **Night theme dims the text** instead of using pure white on pure black, which reduces glow for late sessions.

---

## 9. Accessibility and system settings (already in the CSS)

- Focus ring on every interactive element; skip link to the lesson; landmarks (`header`, `nav`, `main`, `aside`).
- `prefers-reduced-motion`: no smooth scroll, no drawer animation.
- `prefers-contrast: more`: secondary text becomes full ink, hairlines become strong borders, thicker focus ring.
- `forced-colors` (Windows high contrast): blocks get system borders, current items get system highlight.
- Progress dots differ by **shape** (hollow, half, full) and carry screen-reader text.
- Dialogs use native `<dialog>`, which provides Esc to close and keeps focus inside; focus returns to the button that opened it.
- Tables that don't fit fade at the cut edge and show "Swipe the table sideways". Header cells wrap, so most tables fit on phones.
- Zoom to 200% and 320px-wide windows reflow into the phone layout without horizontal scrolling (except wide tables, which scroll inside their own box).

---

## 10. Next.js + Tailwind v4 integration

**Fonts** (`app/fonts.ts`)
```ts
import { Literata, Atkinson_Hyperlegible_Next, Atkinson_Hyperlegible_Mono } from "next/font/google";

export const book  = Literata({ subsets: ["latin"], variable: "--nf-book", display: "swap" });
export const clear = Atkinson_Hyperlegible_Next({ subsets: ["latin"], variable: "--nf-clear", display: "swap" });
export const mono  = Atkinson_Hyperlegible_Mono({ subsets: ["latin"], variable: "--nf-mono", display: "swap" });
// If your Next.js version's font list lacks a family, download it from Google Fonts and use next/font/local.
```
Then point the stacks at them in `tokens.css`: `--font-book: var(--nf-book), "Noto Serif Devanagari", Georgia, serif;` (same for clear and mono).

**Root layout**: put the font variable classes and the cookie-derived `data-*` attributes on `<html>`.

**Tailwind v4** (`app/globals.css`)
```css
@import "tailwindcss";
@import "./tokens.css";
@import "./reader.css";

@theme inline {
  --color-bg: var(--bg);
  --color-rail: var(--bg-rail);
  --color-surface: var(--surface);
  --color-ink: var(--ink);
  --color-ink-2: var(--ink-2);
  --color-ink-3: var(--ink-3);
  --color-rule: var(--rule);
  --color-rule-strong: var(--rule-strong);
  --color-accent: var(--accent);
  --color-accent-soft: var(--accent-soft);
  --color-pen: var(--pen);
  --color-highlight: var(--highlight);
  --color-ok: var(--ok);
  --font-reading: var(--reading-font);
  --font-ui: var(--font-clear);
  --font-code: var(--font-mono);
}
```
Use utilities like `bg-bg text-ink border-rule font-ui` for app screens. The Reader article keeps `reader.css`, because the markdown renderer outputs plain HTML elements.

**Renderer mapping** (`packages/content`): each directive renders `<div class="block block--{name}">` with a `<p class="block__label">` (icon + label) first. Tables are wrapped in `<div class="table-wrap">`. Headings get stable `id`s.

---

## 11. QA checklist (before calling the Reader done)

- [ ] All 4 themes: open a topic with every block type; nothing unreadable, and diagrams visible.
- [ ] Contrast script passes after any color change.
- [ ] Phone 390px: toolbar, drawer, sheets, settings; wide table scroll cue; safe areas on a notched phone.
- [ ] iPad portrait and landscape, plus split view.
- [ ] 1440px and 2560px monitor: line length stays at the chosen width.
- [ ] TV view on a real TV browser (or 1920×1080 window with arrow keys only): every control reachable, focus always visible, nothing near the edges.
- [ ] Keyboard only: skip link, tree, outline, settings, dialogs (Esc, focus return).
- [ ] Screen reader: headings in order, progress dot states announced, dialog titles read.
- [ ] Browser zoom 200% and text size Largest: no overlap or clipping.
- [ ] Reduced motion, high contrast and Windows forced colors.
- [ ] Print preview: no chrome, no split blocks.
- [ ] A Devanagari paragraph (`lang="ne"`): matras not clipped.

---

## 12. Paste this to the agent

```
Adopt the ExamAI Study Design System for the Reader (Phase 1) and admin preview (Phase 1b).
Files: tokens.css, reader.css, DESIGN.md, ExamAI_Reader_Demo.html (reference implementation).

1. Copy tokens.css + reader.css into the web app; import via globals.css with the Tailwind v4
   @theme inline mapping in DESIGN.md §10. Load fonts with next/font (Literata, Atkinson
   Hyperlegible Next, Atkinson Hyperlegible Mono); Devanagari only on lang="ne" pages.
2. packages/content renderer outputs the exact classes in DESIGN.md §5 (block--idea, --example,
   --working, --answer, --tip, --warning, --formula; figure + diagram-svg; table-wrap).
   Admin preview must use the same CSS so preview == Reader.
3. Reader layout = DESIGN.md §4 breakpoints, using the demo's markup structure
   (app-header, shell, rail, sheet/prose, toc, toolbar, native <dialog> for drawer/sheets/settings).
4. Reading settings = §6: data-* attributes on <html>, rendered server-side from a cookie
   (no theme flash), synced to the user profile when signed in.
5. TV view = §7, including ?view=tv and the TV user-agent suggestion banner (suggest, never auto-switch).
6. Eye break reminder = §8: default on, dismissible, never shown during mock exams.
7. Don't add colors without extending the contrast table; run the §11 checklist and include
   screenshots (Paper desktop 1440, Blackboard phone 390, Night phone with a wide table, TV 1920x1080)
   in the CP1 report.
```
