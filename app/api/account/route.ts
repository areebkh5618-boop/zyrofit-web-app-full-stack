import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const { name, phone, shirtSize, address } = await req.json();

  await connectDB();
  const updated = await User.findByIdAndUpdate(
    user._id,
    { name, phone, shirtSize, address },
    { new: true }
  ).lean();

  if (!updated) return NextResponse.json({ error: "User not found." }, { status: 404 });

  return NextResponse.json({
    user: { name: updated.name, phone: updated.phone, shirtSize: updated.shirtSize, address: updated.address },
  });
}
