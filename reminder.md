# MockExams — Reminder

State as of 21 Aug 2026. Everything below was measured, not remembered.

Health: `npm run build` clean · **183 unit tests pass** · **50 rules tests pass** ·
`npm run lint` **36 errors, 228 warnings**

---

## 1. Done and verified

| Area | State |
|---|---|
| Security (P0) | Rules deployed and verified against **production** as a real student: answer key, other students' attempts, self-granting admin/Pro all return 403 |
| Payments | eSewa + Khalti on their **official test endpoints**; guard refuses to run test mode in a production build |
| Question bank | 262 questions, **262 tagged** with concepts |
| Solutions | **249/249** MCQs explained · **13/13** written have model answers **and rubrics** |
| Sarthi | Floating companion, app-wide, survives navigation, **Explain mode is default** |
| Past-paper solving | Upload PDF/photo/text → solutions in real exam format (header, Group A/B, marks in margin) |
| Certificates | Issued at ≥80%, publicly verifiable by code |
| Adaptive practice | Weak-area targeting, Daily 10, streaks, badges |
| Accessibility | Skip link, focus rings, reduced motion, TTS (free), print stylesheet |

---

## 2. Missing — highest value first

### 2.1 Notes review screen (engine built, unusable)
The authoring pipeline works but has **no front door**, and the `notes` collection
is **empty (0 docs)**.
Needs: staff API route, an admin review/approve screen, and
`src/app/notes/page.tsx` reading approved notes from Firestore.
Drafts are already hidden from students by rules — that part is done and tested.

**Measured cost:** roughly **half** of drafted topics come back ungrounded (the
model answers from memory despite a retry) and need a human to verify or re-run.

### 2.2 Study plan is fake
`src/app/study-plan/page.tsx` still renders `SAMPLE_WEEKLY_PLAN`.
`src/lib/study-scheduler.ts` is orphaned. For a student with 15 subjects and one
evening, sequencing matters more than content.

### 2.3 Pattern analysis
Not built. All 262 questions are tagged, so this is arithmetic on existing data:
per subject, how often each topic appears across papers and what marks it carries.
Descriptive only — **"appeared in 4 of 5 papers, usually 5 marks"**, never
"predicted questions".

### 2.4 The 8 empty subjects
Zero questions for: **Probability & Statistics, COA, Operating System, JAVA,
Mathematics II, Financial Management, Digital Logic, Discrete Structure.**
Plan: generate MCQs from *approved* notes through the existing bulk-import format
so they land in the staff review flow that already exists.

### 2.5 Flashcards do not persist
`src/app/flashcards/page.tsx` keeps FSRS state in React state only — **every
review is lost on refresh**, so the scheduling algorithm never schedules
anything. Cards come from a static `bitNotesData` file, not user content.
Pricing sells "Unlimited FSRS v6 active recall cards" as a Pro benefit.

### 2.6 Flashcard extraction has no UI
`/api/me/flashcards/extract` works and is credit-gated, but **nothing calls it**.
Extracted cards have nowhere to go (see 2.5).

### 2.7 Exam-writing guide
"What's the format to write an exam" — never built. Should derive from the 13
rubrics plus the existing exam-patterns reference, not be invented.

---

## 3. Known errors and defects

### 3.1 Lint: 36 errors (was 5,145)
All React Compiler rules, mostly pre-existing:
- ~15 `react-hooks/immutability` — hook ordering in admin/examiner pages
- ~13 `react-hooks/set-state-in-effect` — mount-effect `setState`
- ~2 `react-hooks/purity` — `Date.now()` in tutor handlers

Deferred deliberately: fixing them means refactoring pages already verified
working. **It creeps up as files are added** — was 30 a few sessions ago.

### 3.2 Two libs target the wrong database
`src/lib/flashcard-repository.ts` and `src/lib/spaced-repetition.ts` are written
against **Supabase**, which the app no longer uses. Not just orphaned — pointed
at a database that isn't there. Delete or port to Firestore.

### 3.3 Still-orphaned modules
`study-scheduler` · `flashcard-repository` · `redis-cache` · `spaced-repetition`

### 3.4 Grounding is unreliable
Gemini often answers from memory even when told to search. There's a retry, and
ungrounded output is flagged and held as draft — but **do not assume notes or
solutions were verified**. Check the `grounded` flag.

### 3.5 Long papers lose questions
An 11-question paper returned 8 — Q4, Q5, Q7 absent. Now **detected and shown in
red** ("Questions 4, 5, 7 could not be solved"), but not yet *fixed*. Root cause
is the model skipping, not truncation (token budget already raised to 16,000).

### 3.6 Browser print header
The `localhost:3000/... · 8/21/26, 9:48 PM` line on printed PDFs is the
browser's, not the app's. Turn off in the print dialog →
**More settings → uncheck "Headers and footers"**.

### 3.7 Test account holds unpaid Pro
`teststudent_sandbox@mockexams.com` has a Pro entitlement (expires
**20 Sep 2026**) granted by the mock gateway that has since been removed.
Harmless, but revoke it or let it lapse.

---

## 4. Deliberate decisions (don't undo by accident)

- **No question prediction.** Historical pattern analysis only. Selling
  "predicted questions" to anxious students is false confidence they pay for in
  marks.
- **No webcam proctoring.** Biometric data from minors, DPDP/GDPR exposure, high
  false positives. Integrity-by-design instead: server timing, per-attempt
  shuffling, withheld answers, soft tab-blur signals.
- **No cash prizes or scholarships.** The rewards page previously promised the
  top 1% a "$500 tuition reimbursement" — an obligation the platform can't meet.
  Replaced with recognition it can honour today.
- **Grading and marks are always free.** Credits gate the open-ended tutor, not
  a student's score. Charging for grading means a student out of credits gets no
  score — a broken exam, not a paywall.
- **Notes are original prose, grounded in cited sources.** Never verbatim copies
  of third-party notes.
- **Nothing AI-written reaches a student unreviewed.**

---

## 5. Handy commands

```bash
npm run build                                   # must stay clean
npm test                                        # 183 unit tests
npm run test:rules                              # 50 rules tests (Firestore emulator)
npm run lint                                    # 36 errors, see 3.1

npm run author-notes -- --subject BIT353CO      # dry run; --apply to write drafts
npm run author-rubrics                          # dry run; --apply to write
node scripts/tag-questions.mjs                  # dry run; --apply to write

firebase deploy --only firestore:rules          # after any rules change
```

Scripts **dry-run by default** and refuse to run unscoped. That guard exists
because a mis-forwarded argument once started authoring all 44 subjects.

---

## 6. Environment

- `GEMINI_API_KEY` — live. Model `gemini-3.5-flash-lite` (cheapest tier).
  The 2.0 and 2.5 families are retired or closed to new users.
- `ESEWA_*` / `KHALTI_*` — sandbox. Set `*_ENV=live` with real keys to go live;
  a production build refuses to start checkout while still in test mode.
- `serviceAccountKey.json` — gitignored, used by the scripts.

---

## 7. Next session — suggested order

1. **Notes review screen** — unblocks the whole notes pipeline (2.1)
2. **Flashcard persistence** — a sold Pro feature that currently forgets (2.5)
3. **Real study plan** (2.2)
4. **Pattern analysis** (2.3)
5. **Lint cleanup** before it creeps further (3.1)
