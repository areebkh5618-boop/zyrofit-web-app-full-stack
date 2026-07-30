import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ products });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load products." }, { status: 500 });
  }
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const required = ["name", "category", "price", "description"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required.` }, { status: 400 });
      }
    }

    if (!body.imageUrl && !body.imageSeed) {
      return NextResponse.json({ error: "Upload an image or provide an image seed." }, { status: 400 });
    }

    await connectDB();
    const product = await Product.create({
      ...body,
      slug: slugify(body.name) + "-" + Date.now().toString(36),
      imageSeed: body.imageSeed || body.imageUrl || "placeholder",
      imageUrl: body.imageUrl || null,
      sizes: body.sizes ?? [],
      colors: body.colors ?? [],
      popularity: body.popularity ?? 0,
      rating: body.rating ?? 4.5,
      reviewsCount: body.reviewsCount ?? 0,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}
