# Phase 7 — Payments & Pricing

---

## Task 7.1 — Pricing page ✅ Done

`/pricing` displays Free, Pro, and Enterprise tiers correctly.
Feature lists per tier are accurate.
No changes needed.

---

## Task 7.2 — Stripe Checkout API route ✅ Done

`POST /api/checkout` creates a Stripe Checkout session server-side.
Stripe secret key is correctly read from environment variables.
The route is structurally correct.

---

## Task 7.3 — Wire Stripe with real keys and test

**Priority:** 🟡 Medium
**File:** `src/app/api/checkout/route.ts` + Vercel environment

**Problem:**
The Stripe integration is built but not tested with real or test-mode keys.
The `.env.local` file has a placeholder `STRIPE_SECRET_KEY=sk_test_placeholder`.

**Steps to complete:**

1. Go to [stripe.com/dashboard](https://stripe.com/dashboard) → create a free account
2. In Stripe Dashboard → Developers → API Keys → copy the **test** secret key
3. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
   ```
4. Create a product and price in Stripe Dashboard:
   - Product: "MockExams Pro"
   - Price: $10/month recurring
   - Copy the `price_xxx` ID
5. Update `src/app/api/checkout/route.ts` to use the real price ID:
   ```ts
   line_items: [
     {
       price: "price_YOUR_PRICE_ID_HERE",
       quantity: 1,
     },
   ],
   ```
6. Test: click "Upgrade to Pro" on pricing page → should redirect to Stripe Checkout
7. Use Stripe test card `4242 4242 4242 4242` to complete payment

**Verify:**
Checkout redirects to Stripe-hosted page → payment completes → redirected back
to `/dashboard?success=true`.

---

## Task 7.4 — Add Stripe webhook handler (missing)

**Priority:** 🟡 Medium (required for Pro features to actually unlock)
**File:** `src/app/api/stripe-webhook/route.ts` (create this file)

**Problem:**
After a successful payment, Stripe sends a webhook event but there is no
handler. This means Pro payment succeeds on Stripe's side but the user's
role/subscription status in Firestore is never updated. Pro features cannot
be gated properly.

**Fix — Create the webhook handler:**

```ts
// src/app/api/stripe-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.CheckoutSession;
    const userId = session.metadata?.userId;

    if (userId) {
      await adminDb.collection("users").doc(userId).update({
        subscription: "pro",
        subscribed_at: new Date().toISOString(),
      });
    }
  }

  return NextResponse.json({ received: true });
}
```

Then in `src/app/api/checkout/route.ts`, pass the user's uid in session metadata:

```ts
metadata: {
  userId: userId,   // from JWT token verification
},
```

**Webhook setup:**
In Stripe Dashboard → Developers → Webhooks → add endpoint:
`https://mockexams.site/api/stripe-webhook`
Select event: `checkout.session.completed`
Copy the webhook signing secret → add to Vercel env as `STRIPE_WEBHOOK_SECRET`.
