import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import ClearCartOnMount from "@/components/shop/ClearCartOnMount";
import { CheckIcon } from "@/components/ui/Icons";

const STEPS = ["Order Placed", "Processing", "Shipped", "Delivered"] as const;

function stepsDoneCount(status: string): number {
  if (status === "pending") return 1;
  if (status === "paid" || status === "processing") return 2;
  if (status === "shipped") return 3;
  if (status === "delivered") return 4;
  return 1;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { orderId } = await searchParams;
  let order: { id: string; status: string } | null = null;

  if (orderId) {
    try {
      await connectDB();
      const doc = await Order.findOne({ _id: orderId, userId: user._id }).lean();
      if (doc) order = { id: String(doc._id), status: doc.status };
    } catch {
      // ignore — render generic confirmation below
    }
  }

  const done = order ? stepsDoneCount(order.status) : 1;

  return (
    <div className="mx-auto max-w-[560px] px-6 py-20 text-center">
      <ClearCartOnMount />
      <div className="mx-auto mb-6.5 flex h-20 w-20 items-center justify-center rounded-full bg-zyro-green">
        <CheckIcon className="h-9 w-9 text-zyro-black" />
      </div>
      <h1 className="font-display text-[38px]">Order Confirmed</h1>
      <p className="mt-2.5 text-[var(--ink-soft)]">
        {order ? (
          <>
            Order <b className="font-mono-ui text-zyro-blue">{order.id.slice(-8).toUpperCase()}</b> is locked in. A
            confirmation email is on its way.
          </>
        ) : (
          "Your order is locked in. A confirmation email is on its way."
        )}
      </p>

      <div className="relative my-10 flex justify-between">
        <div className="absolute left-0 right-0 top-3.5 h-0.5 bg-[var(--line-c)]" />
        {STEPS.map((label, i) => {
          const isDone = i < done;
          return (
            <div key={label} className="relative z-10 flex flex-1 flex-col items-center gap-2">
              <div
                className={`flex h-7.5 w-7.5 items-center justify-center rounded-full border-2 ${
                  isDone ? "border-zyro-green bg-zyro-green" : "border-[var(--line-c)] bg-[var(--bg)]"
                }`}
              >
                {isDone && <CheckIcon className="h-3.5 w-3.5 text-zyro-black" />}
              </div>
              <span className={`font-mono-ui text-[11px] ${isDone ? "font-bold text-[var(--ink)]" : "text-[var(--ink-soft)]"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-3">
        <Link href="/shop" className="btn-sweep rounded bg-zyro-black px-6 py-3.5 text-sm font-bold text-white">
          Continue Shopping
        </Link>
        <Link
          href="/dashboard"
          className="rounded border-[1.5px] border-[var(--ink)] px-6 py-3.5 text-sm font-bold transition-colors hover:bg-[var(--ink)] hover:text-[var(--bg)]"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
}
