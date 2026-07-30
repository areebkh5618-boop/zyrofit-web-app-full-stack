import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";
import { toOrderDTO } from "@/lib/serialize";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  await connectDB();
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "1";

  if (all) {
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ orders: orders.map(toOrderDTO) });
  }

  const orders = await Order.find({ userId: String(user._id) }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ orders: orders.map(toOrderDTO) });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = await req.json();
  const { orderId, status } = body;
  if (!orderId || !status) {
    return NextResponse.json({ error: "orderId and status required." }, { status: 400 });
  }

  const allowed = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  await connectDB();
  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true }).lean();
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order: toOrderDTO(order) });
}
