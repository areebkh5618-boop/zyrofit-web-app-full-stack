import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/**
 * Lazily creates the Stripe client so the app can still build / run
 * pages that don't touch Stripe even if STRIPE_SECRET_KEY isn't set yet.
 */
export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY is not set. Copy .env.example to .env.local and add your Stripe test key."
      );
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}
