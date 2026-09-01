// Provider-agnostic payment contract.
//
// Stripe does not onboard merchants in Nepal, so the primary rail is eSewa
// (Khalti/Fonepay slot in behind the same interface). Every provider converts
// its own callback into the same verified result, and only ever grants access
// through grantEntitlement() in @/lib/entitlements.

import type { PlanOffer } from "@/lib/payments/plans";

export interface CheckoutRequest {
  offer: PlanOffer;
  userId: string;
  email?: string;
  /** Absolute origin used to build return URLs. */
  origin: string;
}

export interface CheckoutSession {
  /** Our own reference, stored on the transaction and echoed back by the provider. */
  transactionId: string;
  /**
   * Either a URL to redirect to, or an HTML-form POST descriptor for providers
   * (like eSewa) that require a signed form submission rather than a GET.
   */
  redirectUrl?: string;
  formPost?: { action: string; fields: Record<string, string> };
}

export interface VerifiedPayment {
  transactionId: string;
  userId: string;
  offerId: string;
  amountNPR: number;
  providerRef: string;
}

export interface PaymentProvider {
  readonly name: string;
  /** False when the provider's credentials are absent, so callers can fall back. */
  isConfigured(): boolean;
  /** True when pointed at the provider's live endpoints rather than its test ones. */
  isLiveMode?(): boolean;
  createCheckout(req: CheckoutRequest): Promise<CheckoutSession>;
  /**
   * Verify a provider callback. MUST confirm the payment server-side rather
   * than trusting redirect parameters, and MUST be safe to call twice — the
   * caller relies on idempotency to survive replayed callbacks.
   */
  verifyCallback(payload: Record<string, unknown>): Promise<VerifiedPayment | null>;
}
