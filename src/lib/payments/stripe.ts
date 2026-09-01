// Stripe provider — kept for international and campus deals. Not usable for
// Nepali merchant accounts, which is why eSewa is the default rail.
//
// Subscription lifecycle still arrives via the Stripe webhook rather than
// verifyCallback, so this provider only implements checkout creation.

import Stripe from "stripe";
import type {
  CheckoutRequest,
  CheckoutSession,
  PaymentProvider,
  VerifiedPayment,
} from "@/lib/payments/types";

function client(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export const stripeProvider: PaymentProvider = {
  name: "stripe",

  isConfigured() {
    return Boolean(process.env.STRIPE_SECRET_KEY);
  },

  async createCheckout({ offer, userId, email, origin }: CheckoutRequest): Promise<CheckoutSession> {
    const stripe = client();
    if (!stripe) throw new Error("Stripe is not configured");

    // Price ids come from env, never from the request — the old route accepted
    // a client-supplied priceId, which let the caller pick what they paid.
    const priceId = offer.stripePriceIdEnv ? process.env[offer.stripePriceIdEnv] : undefined;
    if (!priceId) {
      throw new Error(`Missing Stripe price id for offer "${offer.id}" (set ${offer.stripePriceIdEnv})`);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?payment=success`,
      cancel_url: `${origin}/pricing?payment=cancelled`,
      ...(email ? { customer_email: email } : {}),
      metadata: { userId, offerId: offer.id },
      subscription_data: { metadata: { userId, offerId: offer.id } },
    });

    return { transactionId: session.id, redirectUrl: session.url ?? undefined };
  },

  async verifyCallback(): Promise<VerifiedPayment | null> {
    // Stripe grants access through the signed webhook, not a redirect.
    return null;
  },
};
