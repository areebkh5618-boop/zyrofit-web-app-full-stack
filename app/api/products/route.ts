import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/auth";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    const body = await req.json();
    await connectDB();

    const baseSlug = slugify(body.name || "");
    let slug = baseSlug;
    let suffix = 1;
    while (await Product.exists({ slug })) {
      slug = `${baseSlug}-${++suffix}`;
    }

    const product = await Product.create({ ...body, slug });
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}
