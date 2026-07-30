import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";

interface CartItemInput {
  productId: string;
  size: string;
  color: string;
  qty: number;
  name?: string;
  price?: number;
  imageSeed?: string;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in to check out." }, { status: 401 });
    }

    const body = await req.json();
    const items: CartItemInput[] = body.items ?? [];
    const shippingAddress = body.shippingAddress ?? {};
    const paymentMethod: "card" | "cod" = body.paymentMethod === "cod" ? "cod" : "card";

    if (!items.length) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    await connectDB();

    const orderItems = [];
    let subtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId).lean();
      if (!product) continue;
      const qty = Math.max(1, Math.floor(item.qty));
      subtotal += product.price * qty;
      orderItems.push({
        productId: String(product._id),
        name: product.name,
        price: product.price,
        qty,
        size: item.size,
        color: item.color,
        imageSeed: product.imageUrl || product.imageSeed,
      });
    }

    if (!orderItems.length) {
      return NextResponse.json({ error: "None of the items in your cart could be found." }, { status: 400 });
    }

    const shipping = subtotal > 75 ? 0 : 7.99;
    const total = subtotal + shipping;

    // ---- Cash on Delivery ----
    if (paymentMethod === "cod") {
      const order = await Order.create({
        userId: String(user._id),
        items: orderItems,
        subtotal,
        shipping,
        total,
        status: "pending",
        paymentMethod: "cod",
        shippingAddress,
      });

      return NextResponse.json({
        url: `/checkout/success?orderId=${order._id}&method=cod`,
        orderId: String(order._id),
      });
    }

    // ---- Card (Stripe) ----
    const order = await Order.create({
      userId: String(user._id),
      items: orderItems,
      subtotal,
      shipping,
      total,
      status: "pending",
      paymentMethod: "card",
      shippingAddress,
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    if (!process.env.STRIPE_SECRET_KEY) {
      // No Stripe key — treat as paid for local testing
      order.status = "paid";
      await order.save();
      return NextResponse.json({
        url: `/checkout/success?orderId=${order._id}&method=card`,
        orderId: String(order._id),
      });
    }

    const stripe = getStripe();
    const lineItems = orderItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: `${item.name} (${item.size}, ${item.color})` },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Shipping" },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: lineItems,
      success_url: `${baseUrl}/checkout/success?orderId=${order._id}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      metadata: { orderId: String(order._id) },
    });

    order.stripeSessionId = session.id;
    await order.save();

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Checkout failed. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
