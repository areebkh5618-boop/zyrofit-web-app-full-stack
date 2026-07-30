import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getStripe } from "@/lib/stripe";

// Stripe needs the raw request body to verify the webhook signature,
// so this route reads req.text() instead of req.json().
export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing Stripe signature or webhook secret." }, { status: 400 });
  }

  const rawBody = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      try {
        await connectDB();
        await Order.findByIdAndUpdate(orderId, { status: "paid", stripeSessionId: session.id });
      } catch (err) {
        console.error("Failed to mark order as paid:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
