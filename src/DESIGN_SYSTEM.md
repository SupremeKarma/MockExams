# MockExams Design System
**Enterprise Education Platform UI Framework**

Source of truth for tokens: [`src/app/globals.css`](app/globals.css) (`@theme` block).
Source of truth for primitives: [`src/components/UIComponents.tsx`](components/UIComponents.tsx).

---

## 🎨 Visual Identity

Enterprise SaaS language: one confident primary, a disciplined neutral (zinc)
scale, real semantic colors, an 8px spacing/radius grid, and low-elevation
shadows. Depth comes from borders first, shadow second — avoid the
"gradient + blobby radius + glow shadow" marketing-site look on product
surfaces.

### Primary — Royal Indigo
| Token | Hex | Usage |
|---|---|---|
| `primary-50` | `#eef2ff` | Soft backgrounds, badges |
| `primary-100`–`300` | `#e0e7ff`–`#a5b4fc` | Hover backgrounds, borders |
| `primary-600` | `#4338ca` | **Default primary** — buttons, links, active states |
| `primary-700` | `#3730a3` | Hover/pressed state |

Use `bg-primary-600` / `text-primary-600` / `border-primary-300` etc. (Tailwind
v4 auto-generates these utilities from the `--color-primary-*` theme tokens.)

### Semantic
| Role | Token | Hex |
|---|---|---|
| Success | `--color-success` | `#059669` (emerald-600) |
| Warning | `--color-warning` | `#d97706` (amber-600) |
| Danger | `--color-danger` | `#dc2626` (red-600) |
| Info | `--color-info` | `#0284c7` (sky-600) |

Each has a paired `-soft` background token (e.g. `--color-success-soft`) for
badge/alert fills.

### Neutral — Zinc (not slate)
`neutral-50` (`#fafafa`) through `neutral-950` (`#09090b`). Zinc reads
cooler and more "product" than slate; used for all text, borders, and
surface grays. Body text defaults to `neutral-900` / `zinc-900`, secondary
text to `zinc-500`, borders to `zinc-200`.

---

## 📐 Typography

- **Sans:** Geist Sans (fallback: -apple-system, BlinkMacSystemFont, system-ui)
- **Mono:** Geist Mono (code blocks, exam question IDs, tabular numerics)

### Type scale & weight
| Size | Usage | Weight |
|---|---|---|
| 11px | Micro-labels, eyebrow badges | `font-semibold`/`font-bold` |
| 12–13px | Nav links, meta text, table cells | `font-medium` |
| 14px | Body (default) | `font-normal`/`font-medium` |
| 16–18px | Card/section titles | `font-semibold` |
| 20–24px | Page titles (`PageHeader`) | `font-bold` |
| 30–48px | Marketing hero only | `font-bold` |

`font-black` is reserved for nothing — it was overused in the previous
iteration of this system and has been removed. Enterprise UI tops out at
`font-bold`. Numeric values (scores, stats, currency) should carry
`tabular-nums`.

---

## 📏 Spacing & radius

8px grid throughout (Tailwind's default `4`-based scale already aligns:
`p-2`=8px, `p-4`=16px, `p-5`=20px, `p-6`=24px, `p-8`=32px).

Radius is capped — no more `rounded-3xl` blobs on cards/buttons:
| Token | Value | Usage |
|---|---|---|
| `radius-xs`/`sm` | 4–6px | Badges, chips, checkboxes |
| `radius-md` | 8px | **Default** — buttons, inputs |
| `radius-lg`/`xl` | 10–12px | Cards, modals, containers |

## 🌑 Elevation

Flat by default. Use border color + `shadow-xs`/`shadow-sm` at rest,
`shadow-md` on hover — never stacked glow shadows (`shadow-glow-*` tokens
are kept as no-op aliases for backward compatibility only; do not use them
in new code).

---

## 🧱 Component Patterns

Prefer the shared primitives in `UIComponents.tsx` over ad hoc markup:

- `BaseCard` / `SectionCard` — generic surfaces; `SectionCard` adds a
  title/description/actions header row for data-dense pages (tables,
  settings panels).
- `StatCard` — KPI tile with icon, value, optional trend.
- `FeatureCard` — clickable feature/module tile (dashboards, catalogues).
- `PrimaryButton` / `SecondaryButton` — the only two button treatments;
  don't invent a third without updating this doc.
- `StatusBadge` / `DifficultyBadge` — pill badges with semantic color.
- `ProgressBar` / `CircleProgress` — linear/radial progress.
- `PageHeader` — route-level header (badge + title + subtitle + actions).
- `EmptyState` — no-data placeholder with optional CTA.
- `Alert` — inline info/success/warning/error banner.

### Example
```tsx
<PageHeader
  badge="Diagnostics"
  title="Performance Analytics"
  subtitle="Weakness heatmaps and time/speed benchmarks vs. toppers."
  actions={<PrimaryButton href="/exams">Take a Diagnostic</PrimaryButton>}
/>
```

---

## 🧭 Layout

- **Marketing surface** (`/`, `/about`, `/pricing`, legal, `/login`,
  `/signup`): top navbar + footer, generous hero sections, restrained use
  of `.text-gradient` for hero headlines only.
- **Product surface** (`/dashboard`, `/exams/*`, `/flashcards`, `/notes`,
  `/analytics`, `/tutor`, `/study-plan`, `/leaderboard`, `/profile`,
  `/settings`, `/rewards`, `/examiner/*`, `/organization/*`, `/admin/*`):
  role-aware sidebar shell (`AppShell` + `Sidebar`, see
  [`ARCHITECTURE.md`](../ARCHITECTURE.md) §7) — no footer, no marketing
  nav. Content should read as dense, data-first product UI: `SectionCard`
  grids, tables, `StatCard` rows — not marketing hero blocks. The exam-taking
  route (`/exams/[id]/take`) is focus mode: zero shell chrome.

---

## ♿ Accessibility

- Focus ring: 2px `primary-500` outline, 2px offset (`:focus-visible` in
  `globals.css`) — do not suppress with `outline-none` without a visible
  replacement.
- Color is never the only signal — pair `StatusBadge`/`DifficultyBadge`
  color with text.
- Respect `prefers-reduced-motion` (already handled globally).

---

## 🌗 Dark mode

Tokens are theme-aware via `:root[data-theme="dark"]` and
`prefers-color-scheme: dark` (see `globals.css`). When adding new
components, reference the CSS custom properties (`var(--card-bg)`,
`var(--card-border)`) rather than hardcoding `bg-white`/`border-zinc-200`
if the component needs to support dark mode; most current product pages
are light-mode only and that's an accepted gap, not a regression.
