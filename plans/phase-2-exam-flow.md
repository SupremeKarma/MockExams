# Phase 2 — Core Exam Flow

---

## Task 2.1 — Remove hardcoded `real-ioe-entrance` special case ✅ Partial

**Priority:** 🔴 High
**Files:**
- `src/app/exams/[id]/take/page.tsx`
- `src/app/api/exams/[id]/submit/route.ts`

**Problem:**
Both files have a large hardcoded `if (exam_id === "real-ioe-entrance")` block
with 10 questions baked directly into the source code. This means:
- Only one exam works end-to-end for real students
- All other Firestore-seeded exams go through a separate untested path
- Correct answers are visible in the browser source code

**Fix:**
1. Delete the entire `if (examId === "real-ioe-entrance")` block from both files
2. Ensure the Firestore path handles all exams (it already does — just remove the shortcut)
3. Seed the `real-ioe-entrance` exam properly via the seed script (see Phase 8)

In `take/page.tsx`, remove lines ~30–120 (the hardcoded exam/questions block).
In `submit/route.ts`, remove lines ~48–130 (the hardcoded mockQuestions block).

After deletion the code should fall straight through to the Firestore fetch path
which is already correctly implemented below the hardcoded block.

**Verify:**
- Navigate to `/exams/real-ioe-entrance/take` — should load questions from Firestore
- Submit answers — score should be computed server-side from Firestore data

---

## Task 2.2 — Exam listing page ✅ Done

The exam portal at `/exams` is working correctly.
- Country filter (Nepal default), level filter, search — all functional
- Real Firestore data loads with mock fallback for demo exams
- No changes needed

---

## Task 2.3 — Exam taking page ✅ Done

`/exams/[id]/take` is working correctly (after removing hardcoded block above).
- `ExamTimerBar` integrated and rendering
- `useExamTimer` hook with drift correction in place
- `sessionStorage` persistence across refreshes
- Answer selection, navigation, progress bar — all functional

---

## Task 2.4 — Submit API ✅ Done

`POST /api/exams/[id]/submit` is working correctly (after removing hardcoded block).
- JWT token verification
- Idempotency guard
- Server-side scoring with negative marking
- Score clamped to zero
- Firestore attempt write + leaderboard transaction

---

## Task 2.5 — Results page breakdown not showing explanations

**Priority:** 🔴 High
**File:** `src/app/exams/results/[attemptId]/page.tsx`

**Problem:**
The results page fetches the attempt document and passes it to `<ExamReview />`.
However the `ExamReview` component expects a `breakdown` array where each item has
`explanation` populated. The submit API stores `explanation: null` for hardcoded
exams and does not fetch the explanation field from Firestore question docs.

**Fix in `src/app/api/exams/[id]/submit/route.ts`:**
When building the breakdown array, include the explanation from the question doc:

```ts
breakdown.push({
  questionId: qDoc.id,
  question_text: q.question_text,
  option_a: q.option_a,
  option_b: q.option_b,
  option_c: q.option_c,
  option_d: q.option_d,
  explanation: q.explanation ?? null,   // ← add this
  selectedAnswer: selected ?? null,
  correctAnswer: q.correct_option,
  isCorrect,
  marksAwarded,
});
```

**Verify:**
Take an exam → submit → go to results → each question row should show
a green/red indicator AND the explanation text below the correct answer.

---

## Task 2.6 — Results page missing next-action buttons

**Priority:** 🟡 Medium
**File:** `src/app/exams/results/[attemptId]/page.tsx`

**Problem:**
After viewing results there are no clear CTAs. Students are stuck on the results
page with no obvious path to retake or browse more exams.

**Fix:**
Add two buttons at the bottom of the results page:

```tsx
<div className="flex gap-4 mt-10">
  <Link
    href={`/exams/${attempt.exam_id}/take`}
    className="px-6 py-3 bg-primary text-white rounded-xl font-semibold"
  >
    Retake Exam
  </Link>
  <Link
    href="/exams"
    className="px-6 py-3 glass text-white rounded-xl font-semibold"
  >
    Browse More Exams
  </Link>
</div>
```
