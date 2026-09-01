import type { PaymentProvider } from "@/lib/payments/types";
import { esewaProvider } from "@/lib/payments/esewa";
import { khaltiProvider } from "@/lib/payments/khalti";
import { stripeProvider } from "@/lib/payments/stripe";

export * from "@/lib/payments/types";
export * from "@/lib/payments/plans";

const PROVIDERS: Record<string, PaymentProvider> = {
  esewa: esewaProvider,
  khalti: khaltiProvider,
  stripe: stripeProvider,
};

/** Named lookup, or the first configured provider when none is requested. */
export function getProvider(name?: string): PaymentProvider | null {
  if (name) {
    const provider = PROVIDERS[name];
    return provider && provider.isConfigured() ? provider : null;
  }
  // Local rails first; Stripe is the international fallback.
  const preference = [esewaProvider, khaltiProvider, stripeProvider];
  return preference.find((p) => p.isConfigured()) ?? null;
}

export function configuredProviders(): string[] {
  return Object.values(PROVIDERS).filter((p) => p.isConfigured()).map((p) => p.name);
}
