import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { grantEntitlement } from "@/lib/entitlements";
import { getPlanOffer, expiryFromNow } from "@/lib/payments";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Stripe webhook received but keys are missing. Rejecting.");
    return NextResponse.json({ received: false, error: "Missing config" }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "invoice.payment_succeeded": {
        const object = event.data.object as any;
        const metadata = object.metadata ?? object.subscription_details?.metadata ?? {};
        const userId = metadata.userId;
        const offer = getPlanOffer(metadata.offerId ?? "pro_monthly");

        if (!userId || !offer) {
          console.warn("Stripe event without usable metadata:", event.type);
          break;
        }

        // Entitlement is written to the server-only `entitlements` collection.
        // It used to be set as `subscription: "pro"` on the user document,
        // which the user could write themselves from the client.
        await grantEntitlement(
          userId,
          offer.plan,
          expiryFromNow(offer.durationDays),
          `stripe:${event.id}`
        );
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (userId) {
          // Lapse immediately rather than deleting, so history is preserved.
          await grantEntitlement(userId, "free", null, `stripe:${event.id}`);
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("Failed to apply Stripe event:", err);
    // 500 tells Stripe to retry; grantEntitlement is idempotent.
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
