# Phase 3 — Dashboard & Leaderboard

---

## Task 3.1 — Dashboard stats ✅ Done

`/dashboard` correctly fetches `exam_attempts` for the current user
and computes study hours, exams taken, and average score.
No changes needed.

---

## Task 3.2 — Dashboard recent history ✅ Done

Recent 5 attempts display correctly with score, date, and exam name.
No changes needed.

---

## Task 3.3 — Leaderboard API ✅ Done

`GET /api/leaderboard` works correctly.
Competition ranking (1,1,3), pagination, current user injection, CDN cache
headers all in place. No changes needed.

---

## Task 3.4 — Leaderboard displayName always shows "Anonymous"

**Priority:** 🔴 High
**Files:**
- `src/app/api/leaderboard/route.ts`
- `src/app/api/exams/[id]/submit/route.ts`

**Problem:**
The leaderboard document stores `displayName: null`. The leaderboard API
reads it directly without joining the `users` collection. Every entry
shows "Anonymous" regardless of who the student is.

**Fix Option A — Write displayName at submission time (recommended):**

In `submit/route.ts`, after verifying the token, fetch the user's displayName
from the `users` collection and store it in the leaderboard document:

```ts
// After: const userId = decodedToken.uid;
const userSnap = await adminDb.collection("users").doc(userId).get();
const displayName = userSnap.exists
  ? (userSnap.data()?.displayName ?? userSnap.data()?.name ?? "Student")
  : "Student";

// Then pass displayName into the leaderboard set:
batch.set(leaderboardRef, {
  examId,
  userId,
  displayName,          // ← was null before
  bestScore: score,
  bestPercentage: percentage,
  attempts: FieldValue.increment(1),
  lastAttemptAt: now,
}, { merge: true });
```

**Fix Option B — Resolve at read time in the leaderboard API:**

In `leaderboard/route.ts`, after building the ranked array,
batch-fetch displayNames from `users` collection:

```ts
const uids = allSnap.docs.map(d => d.data().userId);
const userDocs = await Promise.all(
  uids.map(uid => adminDb.collection("users").doc(uid).get())
);
const nameMap: Record<string, string> = {};
userDocs.forEach(snap => {
  if (snap.exists) {
    const d = snap.data()!;
    nameMap[snap.id] = d.displayName ?? d.name ?? "Student";
  }
});
// Then use nameMap[data.userId] when building each entry
```

Option A is preferred — it's O(1) at read time.

**Verify:**
Submit an exam → go to leaderboard → your name should appear, not "Anonymous".

---

## Task 3.5 — Dashboard history page not linked

**Priority:** 🟡 Medium
**File:** `src/app/dashboard/page.tsx`

**Problem:**
`/dashboard/history` exists and works correctly but there is no link to it
from the main dashboard. Students cannot discover their full attempt history.

**Fix:**
Add a "View all history →" link below the recent attempts section:

```tsx
<div className="flex justify-end mt-4">
  <Link
    href="/dashboard/history"
    className="text-sm text-primary hover:underline flex items-center gap-1"
  >
    View full history <ChevronRight className="w-4 h-4" />
  </Link>
</div>
```

---

## Task 3.6 — Leaderboard period filter does nothing

**Priority:** 🟡 Medium
**File:** `src/app/leaderboard/page.tsx`

**Problem:**
The "All Time / This Week / This Month" period selector changes local state
but the `fetchLeaderboard` function always fetches without a date filter.
The UI suggests filtering but has no effect.

**Fix Option A — Wire to examId filter (simpler):**
Replace the period selector with an exam selector dropdown that passes
`?examId=` to the API. This is more useful and matches the API's actual capability.

```tsx
<select
  value={selectedExam}
  onChange={e => setSelectedExam(e.target.value)}
  className="..."
>
  <option value="">Global (All Exams)</option>
  {exams.map(exam => (
    <option key={exam.id} value={exam.id}>{exam.title}</option>
  ))}
</select>
```

Then fetch exams list from Firestore and pass `?examId=${selectedExam}` to
the leaderboard API.

**Fix Option B — Remove the selector entirely:**
If time is short, just remove the period selector UI to avoid showing
broken functionality.
