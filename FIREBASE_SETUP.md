# Firebase Configuration Guide

This app requires both **client-side** and **server-side** Firebase configurations.

## Issue: "Invalid or expired token" on exam submission

This error occurs when the **Firebase Admin SDK credentials are missing** from `.env.local`. The exam submission endpoint needs these credentials to verify user authentication tokens.

## Setup Instructions

### 1. Client-Side Configuration (NEXT_PUBLIC_* variables)
These go in `.env.local` and are safe to commit (they're public).

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Project Settings** (gear icon)
4. Go to **Your apps** section and find your web app
5. Copy these values into your `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

**Status:** This is likely ✅ already done if login works.

---

### 2. Server-Side Configuration (Firebase Admin SDK) — REQUIRED FOR EXAM SUBMISSION

The exam submission endpoint (`/api/exams/[id]/submit`) needs the Admin SDK to verify tokens.

#### Step 1: Generate a Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Project Settings** (gear icon)
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key** button
6. A JSON file will download. **Keep this secure** — don't commit it to git!

#### Step 2: Extract the three required values

Open the downloaded JSON file. It looks like:

```json
{
  "type": "service_account",
  "project_id": "mock-exams-site",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxx@mock-exams-site.iam.gserviceaccount.com",
  ...
}
```

Copy these three values to `.env.local`:

```bash
FIREBASE_PROJECT_ID=mock-exams-site
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@mock-exams-site.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n"
```

**Important:** The `FIREBASE_PRIVATE_KEY` must include the literal `\n` characters (not actual newlines). If you copy-paste from the JSON file, it should work as-is.

#### Step 3: Verify in `.env.local`

Your `.env.local` should now have both client and server configs:

```bash
# Client-side (NEXT_PUBLIC_*)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# ... other NEXT_PUBLIC_* vars ...

# Server-side (no NEXT_PUBLIC_ prefix)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

#### Step 4: Restart the dev server

```bash
npm run dev
```

The app will initialize Firebase Admin SDK on the first API call.

---

## Verification

Try submitting an exam. If it works:
- Exam results appear
- Entry added to leaderboard
- No "Invalid or expired token" error

If still broken:
1. Check `.env.local` has all three `FIREBASE_*` variables (no `NEXT_PUBLIC_` prefix)
2. Verify the private key includes actual `\n` characters, not escaped backslashes
3. Check browser console for errors (might give more details)
4. Restart the dev server

---

## Security Note

- **Never commit `.env.local`** to git — it contains sensitive credentials
- **Rotate keys periodically** in Firebase Console
- `.env.local` is in `.gitignore` by default, so it won't be committed

---

## Troubleshooting

### "Firebase Admin SDK: Environment variables are missing"
The Admin SDK variables are not in `.env.local`. Follow **Step 1-3** above.

### "Invalid or expired token"
- Admin SDK not initialized (see above)
- OR token is genuinely expired (shouldn't happen unless your system clock is very wrong)

### "Not enrolled in this exam"
User doesn't have an enrollment record for this exam. Check Firestore `enrollments` collection.

### Other errors
Check server console output (`npm run dev` terminal) for detailed error messages.
