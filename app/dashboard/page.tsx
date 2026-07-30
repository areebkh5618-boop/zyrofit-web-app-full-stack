import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { toOrderDTO } from "@/lib/serialize";
import { OrderDTO } from "@/lib/types";
import DashboardTabs from "@/components/ui/DashboardTabs";
import LogoutButton from "@/components/ui/LogoutButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/dashboard");

  let orders: OrderDTO[] = [];
  try {
    await connectDB();
    const docs = await Order.find({ userId: String(user._id) }).sort({ createdAt: -1 }).lean();
    orders = docs.map(toOrderDTO);
  } catch {
    // empty if DB down
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-10">
      <div className="mb-2 font-mono-ui text-xs uppercase tracking-wider text-[var(--ink-soft)]">
        Account
      </div>
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <h1 className="font-display text-[38px]">Hey, {user.name.split(" ")[0]}</h1>
        <LogoutButton />
        {user.role === "admin" && (
          <Link
            href="/admin"
            className="rounded bg-zyro-green px-5 py-2.5 text-sm font-bold text-zyro-black"
          >
            Admin Panel →
          </Link>
        )}
      </div>
      <DashboardTabs
        orders={orders}
        profile={{
          name: user.name,
          email: user.email,
          phone: user.phone,
          shirtSize: user.shirtSize,
          address: user.address,
        }}
      />
    </div>
  );
}
