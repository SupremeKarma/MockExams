# Phase 9 — Deployment & Launch

> Complete all previous phases before starting this one.
> Do not deploy a broken build.

---

## Task 9.1 — Verify local build passes

**Priority:** 🔴 Must-do before deploy
**Command:** Run in project root

```bash
npm run build
```

Expected output:
```
✓ Compiled successfully
✓ Linting and checking validity of types
Route (app)               Size
...
```

**Common build errors to fix:**
- TypeScript errors from missing types — add `as any` as a short-term fix
- `'X' is possibly undefined` — add optional chaining `?.`
- Missing env vars in build — add to `.env.local` and Vercel dashboard
- Import of server-only code in client components — check `firebase-admin.ts`
  is only imported in API Routes, never in `page.tsx` files

---

## Task 9.2 — Set all environment variables in Vercel

**Priority:** 🔴 Must-do
**Where:** Vercel Dashboard → Project → Settings → Environment Variables

Add ALL of the following — if any are missing the app crashes silently:

```
# Firebase Client (public — safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Firebase Admin (server-only — never expose)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=          # paste the full key including \n characters
                                # wrap in quotes: "-----BEGIN PRIVATE KEY-----\n..."

# Stripe (server-only)
STRIPE_SECRET_KEY=sk_live_...  # use sk_test_ for staging
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe (public)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

**Important for FIREBASE_PRIVATE_KEY:**
In Vercel, paste the key exactly as it appears in your service account JSON.
If it contains literal `\n` characters, Vercel will handle them correctly.
Do NOT manually replace `\n` with newlines in the Vercel UI.

---

## Task 9.3 — Add domain in Vercel and Firebase Auth

**Priority:** 🔴 Must-do for production

**Step 1 — Vercel domain:**
1. Vercel Dashboard → Project → Settings → Domains
2. Add `mockexams.site`
3. Vercel shows DNS records to configure

**Step 2 — Update DNS at your domain registrar:**
Add the A record and CNAME record Vercel specifies.
DNS propagation takes 10–60 minutes.

**Step 3 — Firebase Auth authorized domains:**
1. Firebase Console → Authentication → Settings → Authorized Domains
2. Click "Add domain"
3. Add `mockexams.site`
4. Also add `www.mockexams.site` if you want www to work

**Verify:**
Navigate to `https://mockexams.site` → app loads → login works →
no CORS or auth errors in console.

---

## Task 9.4 — Deploy Firestore security rules

**Priority:** 🔴 Must-do before launch
**File:** `firestore.rules`

The `firestore.rules` file is correctly written but has NOT been deployed
to the live Firebase project yet. Without deploying, the default rules
(either allow-all or deny-all) are in effect.

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login
firebase login

# Deploy only the rules (not the whole project)
firebase deploy --only firestore:rules

# Also deploy indexes
firebase deploy --only firestore:indexes
```

**Verify:**
In Firebase Console → Firestore → Rules → check the rules match your local file.

---

## Task 9.5 — Seed the production Firestore database

**Priority:** 🔴 Must-do — don't launch with empty database

After deploying, run the seed script against the production Firestore:

```bash
# Ensure .env.local points to production Firebase credentials
npm run seed-firebase
```

This will populate:
- IOE Entrance Model Exam 2081 (40 questions after Phase 8 expansion)
- NEB Grade 12 Physics Final Prep (30 questions after Phase 8 expansion)
- Notes/resources collection (5+ resources after Phase 8 seeding)

**Verify in Firebase Console:**
- `exams` collection: 2 documents
- `exams/{id}/questions`: 40 and 30 documents respectively
- `resources` collection: 5+ documents

---

## Post-Launch Checklist

```
[ ] Sign up a test account → verify users/{uid} doc created with role: student
[ ] Take a full exam → submit → verify results page shows breakdown
[ ] Check leaderboard → verify your name appears (not Anonymous)
[ ] Test Stripe checkout with test card 4242 4242 4242 4242
[ ] Log in as admin → verify dashboard loads without errors
[ ] Create a new exam as admin → add 3 questions → publish
[ ] Apply as organisation → approve in admin → verify org_admin role assigned
[ ] Test on mobile (Chrome DevTools responsive mode, 375px width)
[ ] Check Vercel logs for any server errors after first real user traffic
```
