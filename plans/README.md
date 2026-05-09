# MockExams — Complete Finish Plan

> **Status:** ~85% complete. 33 tasks total across 9 phases.
> Work through phases in order — Phase 1 blockers must be fixed before anything else.

---

## Progress Overview

| Phase | Tasks | Status |
|-------|-------|--------|
| [Phase 1 — Critical Bugs](./phase-1-critical-bugs.md) | 4 | 🔴 Blockers — fix first |
| [Phase 2 — Core Exam Flow](./phase-2-exam-flow.md) | 6 | 🟡 4 done, 2 broken |
| [Phase 3 — Dashboard & Leaderboard](./phase-3-dashboard-leaderboard.md) | 6 | 🟡 3 done, 3 partial |
| [Phase 4 — Admin Portal](./phase-4-admin.md) | 6 | 🟡 3 done, 3 broken |
| [Phase 5 — Examiner & Organisation](./phase-5-examiner-org.md) | 6 | 🟡 4 done, 2 partial |
| [Phase 6 — Auth, Profile & Settings](./phase-6-auth-profile.md) | 6 | 🟡 4 done, 2 broken |
| [Phase 7 — Payments](./phase-7-payments.md) | 4 | 🟡 2 done, 2 missing |
| [Phase 8 — Content & Seeding](./phase-8-content-seeding.md) | 4 | 🔴 2 missing |
| [Phase 9 — Deployment & Launch](./phase-9-deployment.md) | 5 | 🔴 All pending |

---

## Quick Reference — Top 10 Things To Fix Right Now

1. Delete duplicate `[id/]` folders — breaks Next.js router completely
2. Fix missing imports in `admin/page.tsx` — admin dashboard crashes
3. `signup/page.tsx` — must write `users/{uid}` doc with `role: 'student'`
4. Remove hardcoded `real-ioe-entrance` special case from take/submit pages
5. `notes/page.tsx` — connect to Firestore, remove 100% mock data
6. Fix `displayName` never populated in leaderboard entries
7. `settings/page.tsx` — `setDoc` uses merge:true correctly, but `displayName` field name mismatch with `users` doc
8. Add `/api/admin/generate` stub or remove the broken generate exam page
9. Add user role management UI in admin portal
10. Deploy Firestore security rules to production

---

## File Structure Reference

```
src/
  app/
    admin/           ← Admin portal
    examiner/        ← Examiner portal
    organization/    ← Org portal
    exams/           ← Student exam flow
    dashboard/       ← Student dashboard
    leaderboard/     ← Leaderboard page
    notes/           ← Notes library
    api/
      exams/[id]/submit/   ← Scoring API
      leaderboard/         ← Leaderboard API
      checkout/            ← Stripe API
  components/
    ExamTimerBar.tsx
    ExamReview.tsx
    QuestionForm.tsx
  context/
    AuthContext.tsx
  hooks/
    useExamTimer.ts
  lib/
    firebase.ts
    firebase-admin.ts
supabase/
  seed-firestore.ts        ← Database seeding
firestore.rules            ← Security rules
```
