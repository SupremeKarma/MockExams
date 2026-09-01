// Khalti ePayment v2 provider.
//
// Flow: we call Khalti server-to-server to initiate a payment and get back a
// `pidx` plus a hosted payment URL. The browser is redirected there, and Khalti
// returns the user to our callback. The callback's query parameters are NOT
// trusted — the provider re-queries Khalti's lookup endpoint and checks the
// amount against the transaction we recorded before redirecting.

import { randomUUID } from "crypto";
import type {
  CheckoutRequest,
  CheckoutSession,
  PaymentProvider,
  VerifiedPayment,
} from "@/lib/payments/types";
import { getPlanOffer } from "@/lib/payments/plans";
import { adminDb } from "@/lib/firebase-admin";

const SANDBOX_BASE = "https://dev.khalti.com";
const LIVE_BASE = "https://khalti.com";

function isLive(): boolean {
  return process.env.KHALTI_ENV === "live";
}

function baseUrl(): string {
  return isLive() ? LIVE_BASE : SANDBOX_BASE;
}

function secretKey(): string {
  return process.env.KHALTI_SECRET_KEY || "";
}

/** Khalti works in paisa, not rupees. */
export function toPaisa(amountNPR: number): number {
  return Math.round(amountNPR * 100);
}

interface InitiateResponse {
  pidx?: string;
  payment_url?: string;
  detail?: string;
}

interface LookupResponse {
  pidx?: string;
  total_amount?: number;
  status?: string;
  transaction_id?: string;
  refunded?: boolean;
}

export const khaltiProvider: PaymentProvider = {
  name: "khalti",

  isLiveMode: () => isLive(),

  isConfigured() {
    return Boolean(secretKey());
  },

  async createCheckout({ offer, userId, email, origin }: CheckoutRequest): Promise<CheckoutSession> {
    const transactionId = randomUUID();

    // Bind the transaction to a user, plan and amount BEFORE redirecting, so a
    // tampered callback cannot claim a different plan than what was paid for.
    await adminDb.collection("payment_transactions").doc(transactionId).set({
      provider: "khalti",
      user_id: userId,
      offer_id: offer.id,
      amount_npr: offer.amountNPR,
      status: "pending",
      created_at: new Date().toISOString(),
    });

    const res = await fetch(`${baseUrl()}/api/v2/epayment/initiate/`, {
      method: "POST",
      headers: {
        Authorization: `Key ${secretKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        return_url: `${origin}/api/payments/callback?provider=khalti`,
        website_url: origin,
        amount: toPaisa(offer.amountNPR),
        purchase_order_id: transactionId,
        purchase_order_name: offer.label,
        customer_info: email ? { name: email.split("@")[0], email } : undefined,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as InitiateResponse;

    if (!res.ok || !data.pidx || !data.payment_url) {
      await adminDb.collection("payment_transactions").doc(transactionId).update({
        status: "failed",
        error: data.detail ?? `Khalti initiate failed (${res.status})`,
      });
      throw new Error(data.detail ?? `Khalti initiate failed (${res.status})`);
    }

    // pidx is what the lookup endpoint keys on, so it must be stored now.
    await adminDb.collection("payment_transactions").doc(transactionId).update({ pidx: data.pidx });

    return { transactionId, redirectUrl: data.payment_url };
  },

  async verifyCallback(payload: Record<string, unknown>): Promise<VerifiedPayment | null> {
    const pidx = typeof payload.pidx === "string" ? payload.pidx : "";
    if (!pidx) return null;

    const snap = await adminDb
      .collection("payment_transactions")
      .where("pidx", "==", pidx)
      .limit(1)
      .get();

    if (snap.empty) return null;

    const doc = snap.docs[0];
    const tx = doc.data();

    // Idempotency: a replayed callback must not grant a second time.
    if (tx.status === "complete") return null;

    const offer = getPlanOffer(tx.offer_id);
    if (!offer) return null;

    // Server-side confirmation — the redirect parameters prove nothing.
    const res = await fetch(`${baseUrl()}/api/v2/epayment/lookup/`, {
      method: "POST",
      headers: {
        Authorization: `Key ${secretKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    });

    if (!res.ok) return null;

    const status = (await res.json().catch(() => ({}))) as LookupResponse;
    if (status.status !== "Completed") return null;
    if (status.refunded) return null;

    // Confirm Khalti charged the amount we recorded, not one chosen by the client.
    if (Number(status.total_amount) !== toPaisa(Number(tx.amount_npr))) return null;

    await doc.ref.update({
      status: "complete",
      provider_ref: String(status.transaction_id ?? pidx),
      completed_at: new Date().toISOString(),
    });

    return {
      transactionId: doc.id,
      userId: tx.user_id,
      offerId: tx.offer_id,
      amountNPR: Number(tx.amount_npr),
      providerRef: String(status.transaction_id ?? pidx),
    };
  },
};
