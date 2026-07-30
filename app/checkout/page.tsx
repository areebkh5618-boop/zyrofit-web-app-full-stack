import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import CheckoutClient from "@/components/shop/CheckoutClient";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/checkout");

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-10">
      <div className="mb-7 flex items-center gap-2.5 font-mono-ui text-xs">
        <span className="font-bold text-zyro-blue">1. Shipping</span>
        <span className="text-[var(--line-c)]">—</span>
        <span className="font-bold text-zyro-blue">2. Payment</span>
        <span className="text-[var(--line-c)]">—</span>
        <span className="text-[var(--ink-soft)]">3. Confirmation</span>
      </div>
      <CheckoutClient userName={user.name} />
    </div>
  );
}
