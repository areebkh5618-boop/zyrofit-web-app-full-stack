import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import User, { IUser } from "@/models/User";

export const AUTH_COOKIE = "zyrofit_token";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET is not set. Copy .env.example to .env.local and add a random secret."
    );
  }
  return secret;
}

export interface TokenPayload {
  userId: string;
  role: "customer" | "admin";
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getSecret()) as TokenPayload;
  } catch {
    return null;
  }
}

export type SafeUser = Omit<IUser, "passwordHash">;

/**
 * Reads the auth cookie (server-side only) and resolves the logged-in user.
 * Returns null if there is no valid session.
 */
export async function getCurrentUser(): Promise<SafeUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  await connectDB();
  const user = await User.findById(payload.userId).lean<IUser>();
  if (!user) return null;

  const { passwordHash, ...safeUser } = user;
  return safeUser as SafeUser;
}
