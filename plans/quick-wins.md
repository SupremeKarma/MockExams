# Quick Wins — Copy-Paste Fixes (Under 10 Lines Each)

These are all the small fixes that take less than 5 minutes each.
Do these alongside the main phases.

---

## Fix 1 — package.json name

**File:** `package.json` line 2

```json
"name": "mockexams",
```

---

## Fix 2 — Admin page missing imports

**File:** `src/app/admin/page.tsx` — update the firestore import line

```ts
import {
  collection,
  getCountFromServer,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
```

---

## Fix 3 — Signup: write displayName field to Firestore

**File:** `src/app/signup/page.tsx` — in the `setDoc` call, add one line

```ts
await setDoc(doc(db, "users", user.uid), {
  name: formData.name,
  displayName: formData.name,   // ← add this
  email: formData.email,
  phone: formData.phone,
  role: "student",
  created_at: serverTimestamp(),
});
```

---

## Fix 4 — Submit API: include explanation in breakdown

**File:** `src/app/api/exams/[id]/submit/route.ts` — in the breakdown.push() call

```ts
breakdown.push({
  questionId: qDoc.id,
  question_text: q.question_text,
  option_a: q.option_a,
  option_b: q.option_b,
  option_c: q.option_c,
  option_d: q.option_d,
  explanation: q.explanation ?? null,   // ← add this line
  selectedAnswer: selected ?? null,
  correctAnswer: q.correct_option,
  isCorrect,
  marksAwarded,
});
```

---

## Fix 5 — Leaderboard: write displayName at submission

**File:** `src/app/api/exams/[id]/submit/route.ts`
Add after `const userId = decodedToken.uid;`:

```ts
const userSnap = await adminDb.collection("users").doc(userId).get();
const displayName = userSnap.exists
  ? (userSnap.data()?.displayName ?? userSnap.data()?.name ?? "Student")
  : "Student";
```

Then in the leaderboard `batch.set()`, change `displayName: null` to `displayName`.

---

## Fix 6 — Dashboard: add "View all history" link

**File:** `src/app/dashboard/page.tsx`
Add after the recent attempts section:

```tsx
<Link href="/dashboard/history" className="text-sm text-primary hover:underline mt-4 inline-flex items-center gap-1">
  View full history →
</Link>
```

---

## Fix 7 — Results page: add next-action buttons

**File:** `src/app/exams/results/[attemptId]/page.tsx`
Add at the bottom of the results card:

```tsx
<div className="flex gap-4 mt-8">
  <Link href={`/exams/${attempt.exam_id}/take`} className="px-6 py-3 bg-primary text-white rounded-xl font-semibold">
    Retake Exam
  </Link>
  <Link href="/exams" className="px-6 py-3 glass text-white rounded-xl font-semibold">
    Browse Exams
  </Link>
</div>
```

---

## Fix 8 — Org analytics: fix percentage calculation

**File:** `src/app/organization/[orgId]/analytics/page.tsx`

```ts
// Replace
const avgPct = count > 0
  ? Math.round(attempts.reduce((s, a) => s + Number(a.percentage || 0), 0) / count)
  : 0;

// With
const avgPct = count > 0
  ? Math.round(attempts.reduce((s, a) => s + (typeof a.percentage === "number" ? a.percentage : 0), 0) / count)
  : 0;
```

---

## Fix 9 — Settings page: validate displayName not empty

**File:** `src/app/settings/page.tsx` — add at top of `handleSubmit`

```ts
if (!form.displayName.trim()) {
  alert("Display name cannot be empty.");
  return;
}
```

---

## Fix 10 — Delete broken duplicate route folders

**Run in terminal from project root:**

```bash
rm -rf "src/app/exams/[id/]"
rm -rf "src/app/api/exams/[id/]"
```
