# Phase 4 — Admin Portal

---

## Task 4.1 — Admin dashboard crashes (fix Phase 1 Bug 2 first)

**Priority:** 🔴 High
**File:** `src/app/admin/page.tsx`

See **Phase 1 — Bug 2** for the import fix.
After adding the missing imports, the admin dashboard loads correctly:
- Total users, exams, and attempts stat cards work
- Recent users table renders

No further changes needed beyond the import fix.

---

## Task 4.2 — Admin exam list and create ✅ Done

`/admin/exams` lists all exams correctly.
`/admin/exams/new` creates new exam with full metadata.
No changes needed.

---

## Task 4.3 — Admin question create and edit ✅ Done

`/admin/exams/[id]/questions/new` and `/edit` both work.
`QuestionForm` component renders with KaTeX math preview.
No changes needed.

---

## Task 4.4 — Generate exam page calls non-existent API

**Priority:** 🟡 Medium
**File:** `src/app/admin/exams/generate/page.tsx`

**Problem:**
This page POSTs to `/api/admin/generate` which does not exist anywhere in the
codebase. Clicking "Generate" shows a network error. This feature was planned
but never implemented.

**Fix Option A — Remove the page (recommended for now):**
Delete `src/app/admin/exams/generate/page.tsx` and remove the link to it
from the admin exam list page.

```bash
rm src/app/admin/exams/generate/page.tsx
```

Then in `src/app/admin/exams/page.tsx`, remove the "Generate Exam" button/link.

**Fix Option B — Add a stub API that returns a helpful error:**
Create `src/app/api/admin/generate/route.ts`:

```ts
import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json(
    { error: "Question generation is not yet implemented." },
    { status: 501 }
  );
}
```

---

## Task 4.5 — Admin organisations ✅ Done

`/admin/organizations` lists `org_requests` from Firestore.
Approve/reject actions work and update the document status.
No changes needed.

---

## Task 4.6 — Admin user role management (missing feature)

**Priority:** 🟡 Medium
**File:** `src/app/admin/page.tsx` or new `src/app/admin/users/page.tsx`

**Problem:**
There is no UI for an admin to change a user's role (e.g. promote a student
to examiner, or demote a user). Currently this requires a direct Firestore
edit in the Firebase Console.

**Fix:**
Add a role selector to the recent users table on the admin dashboard:

```tsx
// In the users table row
<select
  value={user.role}
  onChange={async (e) => {
    await updateDoc(doc(db, "users", user.id), { role: e.target.value });
    // refresh users list
  }}
  className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10"
>
  <option value="student">student</option>
  <option value="examiner">examiner</option>
  <option value="org_admin">org_admin</option>
  <option value="admin">admin</option>
</select>
```

Note: Import `updateDoc, doc` from `firebase/firestore` (client-side is fine
here since it's admin-only and Firestore rules allow admin writes).
