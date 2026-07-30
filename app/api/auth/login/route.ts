import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User, { IUser } from "@/models/User";
import { signToken, AUTH_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() }).lean<IUser>();
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = signToken({ userId: String(user._id), role: user.role });

    const res = NextResponse.json({
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
    });
    res.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("[login]", err);
    const message =
      err instanceof Error && (err.message.includes("MONGODB_URI") || err.message.includes("JWT_SECRET"))
        ? err.message
        : "Server error — check .env.local (MONGODB_URI, JWT_SECRET) and that MongoDB is reachable.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
