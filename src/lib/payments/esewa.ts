// eSewa ePay v2 provider.
//
// Flow: we sign a form server-side, the browser POSTs it to eSewa, and eSewa
// redirects back to our callback. The redirect params are NOT trusted — the
// callback re-queries eSewa's status API before anything is granted.

import { createHmac, randomUUID } from "crypto";
import type {
  CheckoutRequest,
  CheckoutSession,
  PaymentProvider,
  VerifiedPayment,
} from "@/lib/payments/types";
import { getPlanOffer } from "@/lib/payments/plans";
import { adminDb } from "@/lib/firebase-admin";

const TEST_FORM_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
const LIVE_FORM_URL = "https://epay.esewa.com.np/api/epay/main/v2/form";
const TEST_STATUS_URL = "https://rc.esewa.com.np/api/epay/transaction/status/";
const LIVE_STATUS_URL = "https://epay.esewa.com.np/api/epay/transaction/status/";

const SIGNED_FIELDS = "total_amount,transaction_uuid,product_code";

function isLive() {
  return process.env.ESEWA_ENV === "live";
}

function productCode() {
  // eSewa's sandbox merchant code; override in production.
  return process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
}

function secretKey() {
  return process.env.ESEWA_SECRET_KEY || "";
}

/** base64(HMAC-SHA256) over eSewa's fixed `key=value,key=value` message form. */
export function signEsewaPayload(totalAmount: string, transactionUuid: string, code: string, secret: string): string {
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${code}`;
  return createHmac("sha256", secret).update(message).digest("base64");
}

export const esewaProvider: PaymentProvider = {
  name: "esewa",

  isLiveMode: () => isLive(),

  isConfigured() {
    return Boolean(secretKey());
  },

  async createCheckout({ offer, userId, origin }: CheckoutRequest): Promise<CheckoutSession> {
    const transactionId = randomUUID();
    const totalAmount = String(offer.amountNPR);

    // Bind the transaction to a user, plan and amount BEFORE redirecting, so a
    // tampered callback cannot claim a different plan than what was paid for.
    await adminDb.collection("payment_transactions").doc(transactionId).set({
      provider: "esewa",
      user_id: userId,
      offer_id: offer.id,
      amount_npr: offer.amountNPR,
      status: "pending",
      created_at: new Date().toISOString(),
    });

    const signature = signEsewaPayload(totalAmount, transactionId, productCode(), secretKey());

    return {
      transactionId,
      formPost: {
        action: isLive() ? LIVE_FORM_URL : TEST_FORM_URL,
        fields: {
          amount: totalAmount,
          tax_amount: "0",
          total_amount: totalAmount,
          transaction_uuid: transactionId,
          product_code: productCode(),
          product_service_charge: "0",
          product_delivery_charge: "0",
          success_url: `${origin}/api/payments/callback?provider=esewa`,
          failure_url: `${origin}/pricing?payment=failed`,
          signed_field_names: SIGNED_FIELDS,
          signature,
        },
      },
    };
  },

  async verifyCallback(payload: Record<string, unknown>): Promise<VerifiedPayment | null> {
    const transactionId = typeof payload.transaction_uuid === "string" ? payload.transaction_uuid : "";
    if (!transactionId) return null;

    const txSnap = await adminDb.collection("payment_transactions").doc(transactionId).get();
    if (!txSnap.exists) return null;

    const tx = txSnap.data();
    // Idempotency: a replayed callback must not grant a second time.
    if (tx.status === "complete") return null;

    const offer = getPlanOffer(tx.offer_id);
    if (!offer) return null;

    // Server-side confirmation — the redirect itself proves nothing.
    const statusUrl = `${isLive() ? LIVE_STATUS_URL : TEST_STATUS_URL}?product_code=${encodeURIComponent(
      productCode()
    )}&total_amount=${encodeURIComponent(String(tx.amount_npr))}&transaction_uuid=${encodeURIComponent(transactionId)}`;

    const res = await fetch(statusUrl, { cache: "no-store" });
    if (!res.ok) return null;

    const status = await res.json();
    if (status?.status !== "COMPLETE") return null;

    // Confirm eSewa charged the amount we recorded, not one chosen by the client.
    if (Number(status.total_amount) !== Number(tx.amount_npr)) return null;

    await txSnap.ref.update({
      status: "complete",
      provider_ref: String(status.ref_id ?? ""),
      completed_at: new Date().toISOString(),
    });

    return {
      transactionId,
      userId: tx.user_id,
      offerId: tx.offer_id,
      amountNPR: Number(tx.amount_npr),
      providerRef: String(status.ref_id ?? ""),
    };
  },
};
