import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ products });
  } catch (error) {
    console.error("GET products error:", error);

    return NextResponse.json(
      { error: "Failed to load products." },
      { status: 500 }
    );
  }
}