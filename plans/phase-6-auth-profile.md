# Phase 6 — Auth, Profile & Settings

---

## Task 6.1 — Signup + Login ✅ Done

Both pages work correctly.
Email/password auth, form validation, redirect on success.
No changes needed.

---

## Task 6.2 — AuthContext multi-role resolution ✅ Done

Role resolution from Firestore works on login.
`isAdmin`, `isExaminer`, `orgId` all exposed correctly.
No changes needed.

---

## Task 6.3 — Route guards ✅ Done

Protected routes redirect unauthenticated users to `/login`.
Auth routes redirect authenticated users to `/dashboard`.
No changes needed.

---

## Task 6.4 — Profile page ✅ Done

Read-only profile display works correctly.
Sign-out button works.
No changes needed.

---

## Task 6.5 — Signup does NOT create Firestore users doc

**Priority:** 🔴 High
**File:** `src/app/signup/page.tsx`

**Problem:**
Looking at the signup code, it DOES call `setDoc` to create the `users/{uid}`
document — but it stores `name` instead of `displayName`. The `AuthContext`
reads `displayName` when resolving roles and for leaderboard display.
This field name mismatch means new users appear as "Student" everywhere
and their `name` is never used.

**Fix:**
In `src/app/signup/page.tsx`, update the `setDoc` call to write both fields:

```ts
await setDoc(doc(db, "users", user.uid), {
  name: formData.name,
  displayName: formData.name,   // ← add this line
  email: formData.email,
  phone: formData.phone,
  role: "student",
  created_at: serverTimestamp(),
});
```

Also confirm the field name used when reading in `AuthContext.tsx`:

```ts
// In AuthContext, when reading the user doc for displayName:
const displayName = userSnap.data()?.displayName ?? userSnap.data()?.name ?? "Student";
```

**Verify:**
Sign up a new account → go to leaderboard after submitting an exam →
your real name should appear, not "Anonymous" or "Student".

---

## Task 6.6 — Settings page field name mismatch

**Priority:** 🟡 Medium
**File:** `src/app/settings/page.tsx`

**Problem:**
The settings page correctly calls `setDoc` with `merge: true` to update
the user profile. However it writes `displayName` to Firestore but
`fetchProfile` reads from `data.displayName`. This part works.

The real issue is the `bio`, `studyGoal`, and `targetExam` fields
are written to Firestore but never displayed anywhere in the app.
The settings page feels broken because nothing visible changes.

**Fix — Make targetExam appear on the dashboard:**

In `src/app/dashboard/page.tsx`, read `targetExam` from the user's Firestore
doc and display it as a personalisation tag:

```tsx
// In fetchUserData, also fetch the user doc
const userDoc = await getDoc(doc(db, "users", uid));
const targetExam = userDoc.data()?.targetExam ?? "IOE Entrance";

// Display in dashboard header
<p className="text-sm text-slate-400">
  Preparing for: <span className="text-primary font-medium">{targetExam}</span>
</p>
```

**Fix — Validate the form before saving:**

Add basic validation so empty `displayName` cannot be saved:

```ts
if (!form.displayName.trim()) {
  setError("Display name cannot be empty.");
  return;
}
```
