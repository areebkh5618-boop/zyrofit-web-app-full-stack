"use client";

import { useState } from "react";
import Link from "next/link";
import { OrderDTO } from "@/lib/types";
import ProfileForm from "@/components/ui/ProfileForm";
import { BagIcon } from "@/components/ui/Icons";

const STATUS_STYLES: Record<string, string> = {
  delivered: "bg-[#E6F8E6] text-[#1c8a1c] dark:bg-[#10301a]",
  shipped: "bg-[#E6F0FF] text-zyro-blue dark:bg-[#0e2138]",
  processing: "bg-[#FFF3E0] text-[#c47f00] dark:bg-[#322710]",
  paid: "bg-[#E6F0FF] text-zyro-blue dark:bg-[#0e2138]",
  pending: "bg-[var(--bg-alt)] text-[var(--ink-soft)]",
  cancelled: "bg-[#FBE7E7] text-[#c0392b]",
};

export default function DashboardTabs({
  orders,
  profile,
}: {
  orders: OrderDTO[];
  profile: { name: string; email: string; phone?: string; shirtSize?: string; address?: string };
}) {
  const [tab, setTab] = useState<"orders" | "profile">("orders");

  return (
    <div>
      <div className="mb-7.5 flex gap-1 overflow-x-auto border-b border-[var(--line-c)]">
        {(["orders", "profile"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap border-b-2 px-5 py-3.5 text-[13px] font-bold ${
              tab === t ? "border-zyro-blue text-[var(--ink)]" : "border-transparent text-[var(--ink-soft)]"
            }`}
          >
            {t === "orders" ? "Order History" : "Profile"}
          </button>
        ))}
      </div>

      {tab === "orders" &&
        (orders.length ? (
          <div className="space-y-3">
            {orders.map((o) => (
              <div
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-[var(--line-c)] p-4.5"
              >
                <div>
                  <b className="font-mono-ui text-[13px]">#{o.id.slice(-8).toUpperCase()}</b>
                  <div className="mt-1 text-xs text-[var(--ink-soft)]">{o.items.map((i) => i.name).join(", ")}</div>
                </div>
                <span className="text-xs text-[var(--ink-soft)]">
                  {new Date(o.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 font-mono-ui text-[11px] uppercase tracking-wide ${
                    STATUS_STYLES[o.status] ?? STATUS_STYLES.pending
                  }`}
                >
                  {o.status}
                </span>
                <b className="font-mono-ui">${o.total.toFixed(2)}</b>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-16 text-center text-[var(--ink-soft)]">
            <BagIcon className="h-10 w-10 text-[var(--line-c)]" />
            <p>No orders yet.</p>
            <Link href="/shop" className="btn-sweep rounded bg-zyro-black px-6 py-3 text-sm font-bold text-white">
              Browse Gear
            </Link>
          </div>
        ))}

      {tab === "profile" && (
        <ProfileForm
          initialName={profile.name}
          initialEmail={profile.email}
          initialPhone={profile.phone}
          initialShirtSize={profile.shirtSize}
          initialAddress={profile.address}
        />
      )}
    </div>
  );
}
