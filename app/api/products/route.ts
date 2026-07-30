import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load product." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    const { id } = await params;
    const body = await req.json();
    await connectDB();
    const product = await Product.findByIdAndUpdate(id, body, { new: true });
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    const { id } = await params;
    await connectDB();
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }
}
