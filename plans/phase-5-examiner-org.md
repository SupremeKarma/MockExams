# Phase 5 — Examiner & Organisation Portals

---

## Task 5.1 — Examiner exam list, create, edit ✅ Done

`/examiner/exams` and all CRUD operations work correctly.
Examiners can create exams, add/edit/delete questions.
No changes needed.

---

## Task 5.2 — Examiner results page ✅ Done

`/examiner/exams/[id]/results` loads attempt data for all students
who took that exam. Scores and percentages display correctly.
No changes needed.

---

## Task 5.3 — Organisation apply page ✅ Done

`/organization/apply` submits to `org_requests` collection correctly.
Admin sees the request in the admin portal.
No changes needed.

---

## Task 5.4 — Organisation dashboard, members, exams ✅ Done

All three pages (`/organization/[orgId]`, `/members`, `/exams`) load and
display data correctly from Firestore.
No changes needed.

---

## Task 5.5 — Organisation analytics charts show zero

**Priority:** 🟡 Medium
**File:** `src/app/organization/[orgId]/analytics/page.tsx`

**Problem:**
The analytics page fetches exam attempts correctly and computes `avgPct`,
but the chart rendering has a data mapping issue. The `avgPct` values
are all rendering as 0 because `attempt.percentage` is stored as a number
in Firestore but being compared with `Number(a.percentage || 0)` — the
`|| 0` short-circuits valid low percentage values (e.g. a score of 0% is
treated the same as missing data).

**Fix:**
Change the average calculation:

```ts
// BEFORE
const avgPct = count > 0
  ? Math.round(attempts.reduce((s, a) => s + Number(a.percentage || 0), 0) / count)
  : 0;

// AFTER
const avgPct = count > 0
  ? Math.round(
      attempts.reduce((s, a) => s + (typeof a.percentage === "number" ? a.percentage : 0), 0)
      / count
    )
  : 0;
```

Also verify the chart component is receiving the data correctly by adding a
`console.log(stats)` before the chart render to confirm values are non-zero.

**Verify:**
Navigate to `/organization/[orgId]/analytics` after students have submitted
attempts → bar chart should show non-zero average scores per exam.

---

## Task 5.6 — Organisation add member flow incomplete

**Priority:** 🟡 Medium
**File:** `src/app/organization/[orgId]/members/page.tsx`

**Problem:**
The "Add Member" flow creates an `org_members` document but does NOT update
the target user's `role` field in the `users` collection. So the new member
can be listed in the org but their `AuthContext` still resolves them as `student`
and they cannot access the examiner portal.

**Fix:**
After creating the `org_members` document, also update the user's role:

```ts
const handleAddMember = async (email: string, role: string) => {
  // 1. Find user by email
  const usersSnap = await getDocs(
    query(collection(db, "users"), where("email", "==", email), limit(1))
  );
  if (usersSnap.empty) {
    alert("No user found with that email. They must sign up first.");
    return;
  }
  const targetUser = usersSnap.docs[0];
  const targetUid = targetUser.id;

  // 2. Create org_members document
  await setDoc(doc(db, "org_members", `${targetUid}_${orgId}`), {
    user_id: targetUid,
    org_id: orgId,
    role,
    status: "active",
    added_at: serverTimestamp(),
  });

  // 3. Update user's role in users collection
  await updateDoc(doc(db, "users", targetUid), {
    role,               // 'examiner' or 'org_admin'
    org_id: orgId,
  });
};
```

Note: This requires the Firestore security rule for `users` to allow
org_admin writes, or this must be done via an API Route using Admin SDK
for proper security.
