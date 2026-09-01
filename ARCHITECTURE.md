# MockExams — Architecture Map

_Last updated: 2026-08-20_

## 1. What this product is

MockExams is a Next.js (App Router) exam-preparation platform for university/entrance
exam candidates (currently focused on Purbanchal University BIT, expanding to
TU CSIT, CBSE, and Cambridge A-Levels). It combines mock exams (CBT engine),
spaced-repetition flashcards (FSRS), semester notes, an AI tutor, analytics,
gamified leaderboards, and multi-tenant organization/admin tooling.

## 2. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Styling | Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`) |
| Motion | Framer Motion |
| Auth / DB | Firebase (Auth, Firestore, Storage) — `firebase-admin` on the server |
| Secondary data | Supabase (`supabase/` — seed scripts) |
| Payments | Stripe (`/api/checkout`, `/api/stripe-webhook`) |
| AI | Anthropic SDK (`/api/tutor`) |
| Caching/queues | ioredis |
| Math | KaTeX / react-katex |

## 3. Route map (`src/app`)

### Public / marketing
```
/                landing page
/about           company/product story
/pricing         plans
/privacy /terms  legal
/login /signup   auth
/organization/apply   org onboarding request
```

### Student app (auth-gated)
```
/dashboard                 home base: progress, streak, quick actions
/dashboard/history         past attempt history
/exams                     exam catalogue
/exams/[id]/take           CBT exam-taking engine
/exams/results/[attemptId] scored result + review
/flashcards                 FSRS spaced-repetition decks
/notes                      semester notes (block-based, code + KaTeX)
/semester /semester/[id]    semester-level index into notes
/course/[slug] /courses/[slug]  course detail
/syllabus                   syllabus browser
/exam-patterns               historical exam pattern reference
/projects                   project blueprint library
/study-plan                  personalized planner
/analytics                  diagnostic analytics (weakness heatmaps)
/tutor                      AI tutor chat (+ /api/tutor)
/leaderboard                 gamified ranking
/rewards                    points/rewards
/inspire                     motivational content
/learn                       learning hub
/notices                    announcements
/profile /settings /subscription   account management
```

### Examiner role
```
/examiner                          examiner home
/examiner/exams (+ new)            exam authoring list/create
/examiner/exams/[id]                exam detail
/examiner/exams/[id]/questions/new  add question
/examiner/exams/[id]/questions/[qid]/edit
/examiner/exams/[id]/results        results review
```

### Organization (multi-tenant) role
```
/organization/[orgId]                 org home
/organization/[orgId]/members          member management
/organization/[orgId]/exams            org exam assignment
/organization/[orgId]/analytics        org-level analytics
```

### Admin (platform)
```
/admin                       admin home
/admin/exams (+ new)          global exam management
/admin/exams/[id]             exam detail
/admin/exams/[id]/questions/new
/admin/exams/[id]/questions/[qid]/edit
/admin/users                  user management
/admin/organizations (+ [orgId])   org management
```

## 4. Role model

Four roles gate navigation and routes via `useAuth()` (`src/context/AuthContext`):
`student` (default) → `examiner` → `organization admin` → `platform admin`.
`Navbar.tsx` conditionally injects nav items for `isExaminer` / `isAdmin`.
There is currently **no dedicated app shell per role** — every role reuses the
same top navbar + single-column `<main>`, which is the main structural gap
for an "enterprise" feel (see §6).

## 5. Shared UI layer

```
src/components/
  Navbar.tsx            global top nav (marketing + app, role-aware)
  Footer.tsx             marketing footer (shown on every page, including app pages)
  UIComponents.tsx        primitive kit: BaseCard, StatCard, FeatureCard,
                          StatusBadge, DifficultyBadge, PrimaryButton,
                          SecondaryButton, ProgressBar, CircleProgress,
                          PageHeader, EmptyState, Alert
  QuickNavRail.tsx        floating quick-nav (student app)
  StudentDashboard.tsx    dashboard widgets
  ExamForm / QuestionForm / QuestionTable   admin/examiner authoring
  ExamReview / ExamTimerBar                exam-taking runtime
  AiTutorModal.tsx        tutor entry point
  NotificationProvider.tsx  toast/alert context
  MathRenderer.tsx        KaTeX wrapper
```

`src/app/globals.css` defines the Tailwind v4 `@theme` tokens (colors, radii,
shadows) plus hand-rolled utility classes (`.glass-card`, `.text-gradient`,
animation keyframes). Most page-level JSX uses raw Tailwind palette classes
(`bg-indigo-600`, `text-slate-900`) rather than the semantic `--color-primary`
tokens, so retheming currently requires touching both the token file **and**
call sites — this is being consolidated as part of the redesign (see below).

## 6. Redesign plan (this pass)

**Design language shift:** from "gradient SaaS marketing" (font-black
everywhere, blobby `rounded-3xl`, heavy glow shadows) to a restrained
enterprise system — one confident primary, a disciplined neutral (zinc)
scale, a real type scale (`font-semibold`/`font-bold` instead of
`font-black` by default), 8px-grid spacing/radius, low-elevation shadows.
See `src/app/globals.css` for the new token set and rationale.

**Sequencing:**
1. ✅ Architecture map (this file)
2. ✅ New design tokens (`globals.css`) + rebuilt primitive kit (`UIComponents.tsx`)
3. ✅ Shell: `Navbar`, `Footer`, root `layout.tsx`
4. ✅ Flagship pages: landing (`/`), `/dashboard`
5. ✅ Rolled the new tokens/primitives across every route (53 pages) —
   colors, radius, weight, and spacing normalized everywhere; the highest
   traffic surfaces (landing, dashboard, exams catalogue, exam-taking,
   results, flashcards, notes, analytics, tutor, admin dashboard/users,
   question & exam authoring) got full structural rebuilds onto the shared
   primitive kit.
6. ✅ Role-aware app shell — see below.

## 7. App shell (`src/components/AppShell.tsx`)

The single highest-leverage structural change flagged in earlier passes is
now built: a collapsible left sidebar (`src/components/Sidebar.tsx`) for the
logged-in product surface, decided per-route in `AppShell` (mounted once in
the root layout):

- **Sidebar shell** — `/dashboard`, `/exams` (except the focus-mode take
  page), `/flashcards`, `/notes`, `/analytics`, `/tutor`, `/study-plan`,
  `/leaderboard`, `/profile`, `/settings`, `/rewards`, `/examiner/*`,
  `/organization/*` (except `/organization/apply`), `/admin/*`. Renders the
  slim top `Navbar` + `Sidebar` + `<main>`, no footer, no `QuickNavRail`.
  The sidebar shows the core student nav always, a role-gated "Workspace"
  section (Examiner Console / Organization / Admin, based on `useAuth()`),
  and collapses to an icon rail (persisted in `localStorage`).
- **Focus mode** — `/exams/[id]/take` gets zero global chrome (no navbar,
  no sidebar, no footer); the page's own sticky in-page header is the only
  bar, matching how high-stakes CBT UIs typically remove nav during a timed
  attempt.
- **Marketing shell** — everything else (`/`, `/about`, `/pricing`, legal,
  `/login`, `/signup`, `/organization/apply`, and the still-bespoke content
  pages — `semester`, `syllabus`, `exam-patterns`, `projects`, `course(s)`,
  `notices`, `learn`, `inspire`, `subscription`) keeps the original top-nav
  + `QuickNavRail` + footer treatment.

Not yet folded into the sidebar shell: the "still-bespoke content pages"
listed above are logged-in-adjacent content (notes-like browsing, not core
app actions) and were left on the marketing shell to keep this change
scoped — revisit if they should move into the app shell too.

## 8. Multi-faculty / multi-program architecture

`academicTaxonomyData.ts` already listed four programs (PU BIT, TU BSc.CSIT,
CBSE Class 12, Cambridge A-Levels), but the navbar's "University / Program"
switcher was purely decorative — selecting a different program didn't
change anything, and every content page was hardcoded to BIT data
(`bitNotesData`, `bitSyllabusData`, `bitProjectsData`). Fixed:

- **`src/context/ProgramContext.tsx`** — the real, global, `localStorage`-
  persisted "active program" state (`useProgram()`). Exposes
  `CONTENT_AVAILABLE_PROGRAM_IDS`, the single list controlling which
  programs actually have content — today just `["prog-bit"]`.
- **`src/components/ProgramGate.tsx`** — wraps a BIT-specific content page's
  body. If the active program isn't in `CONTENT_AVAILABLE_PROGRAM_IDS`, it
  renders an honest "{program} content is coming soon" state with a
  one-click "Switch to BIT" button, instead of leaking BIT content under a
  different program's name. Applied to `/notes`, `/syllabus`, `/semester`,
  `/semester/[id]`, `/projects`, `/flashcards` — every page that imports
  `bit*Data`.
- **`Navbar.tsx`**'s taxonomy dropdown now reads/writes `useProgram()`
  directly and shows a live "Live" / "Coming soon" badge per program instead
  of a static hardcoded list.

**To add real support for a new program** (e.g. TU BSc.CSIT): build its
content data (notes/syllabus/past-papers, following the shape of the
`bit*Data.ts` files — or generalize those files to be keyed by program if
the shape is shared), then add that program's id to
`CONTENT_AVAILABLE_PROGRAM_IDS` in `ProgramContext.tsx`. No other wiring
changes needed — the gate and switcher already handle it.

### BIT content pipeline (the reference implementation)

BIT is the fully-built-out program, serving as the template for others:

- **Syllabus** (`bitSyllabusData.ts`) — verified against real Purbanchal
  University course syllabus documents (not invented), semester by
  semester, with real course codes and unit breakdowns. Semesters 1, 2, 3,
  4, 6, 7, 8 are fully verified against official PU/ACMT syllabus PDFs
  (saved in `bulk-imports/syllabus-sources/`). **Semester 5 is still the
  original unverified placeholder data** — no official PDF for it was
  found at the source that had all the others; get one from the user
  before treating Sem 5 as authoritative.
- **Past papers → question bank**: `bulk-imports/<year>/*.txt` — real
  university exam papers (read from PDFs/photos, some via
  `/api/admin/extract-questions`) converted into the bulk-import MCQ
  format (`src/lib/bulkQuestionParser.ts`), tagged by syllabus year since
  PU's course content changes over time (e.g. 2022's Sem 6 papers are a
  different, older syllabus than 2026's). Validated against the real
  parser before handoff, then imported via `BulkQuestionImport.tsx` in the
  admin/examiner UI.
