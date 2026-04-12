import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn("Stripe webhook received but keys missing. Skipping handler.");
    return NextResponse.json({ received: false, error: "Missing config" });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (userId) {
      console.log(`Unlocking Pro features for user: ${userId}`);
      try {
        await adminDb.collection("users").doc(userId).update({
          subscription: "pro",
          subscribed_at: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Failed to update user subscription in Firestore:", err);
        return NextResponse.json({ error: "Internal DB error" }, { status: 500 });
      }
    } else {
      console.warn("No userId found in session metadata");
    }
  }

  return NextResponse.json({ received: true });
}
