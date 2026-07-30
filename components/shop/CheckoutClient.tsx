"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartContext";
import { useToast } from "@/components/providers/ToastContext";

export default function CheckoutClient({ userName }: { userName: string }) {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const { show } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("cod");
  const [form, setForm] = useState({
    firstName: userName.split(" ")[0] ?? "",
    lastName: userName.split(" ").slice(1).join(" ") ?? "",
    address: "",
    city: "",
    zip: "",
  });

  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 7.99;
  const total = subtotal + shipping;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) {
      show("Your cart is empty");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          paymentMethod,
          shippingAddress: {
            name: `${form.firstName} ${form.lastName}`.trim(),
            address: form.address,
            city: form.city,
            zip: form.zip,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed");

      if (paymentMethod === "cod") {
        clear();
        show("Order placed — pay on delivery");
        router.push(data.url);
      } else {
        window.location.href = data.url;
      }
    } catch (err) {
      show(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-[var(--line-c)] bg-[var(--surface)] px-4 py-3.5 text-sm outline-none focus:border-zyro-blue";
  const labelClass = "mb-2 block font-mono-ui text-xs uppercase tracking-wider text-[var(--ink-soft)]";

  return (
    <div className="grid grid-cols-1 gap-9 md:grid-cols-[1.6fr_1fr]">
      <div>
        <h3 className="font-display mb-4.5 text-[26px]">Shipping Details</h3>
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>First Name</label>
              <input
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <input
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Street address"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>City</label>
              <input
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>ZIP Code</label>
              <input
                required
                value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Payment Method</label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`rounded-lg border-2 p-4 text-left transition-colors ${
                  paymentMethod === "cod"
                    ? "border-zyro-green bg-[var(--bg-alt)]"
                    : "border-[var(--line-c)]"
                }`}
              >
                <b className="block text-sm">Cash on Delivery</b>
                <span className="text-xs text-[var(--ink-soft)]">Pay when you receive the order</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`rounded-lg border-2 p-4 text-left transition-colors ${
                  paymentMethod === "card"
                    ? "border-zyro-green bg-[var(--bg-alt)]"
                    : "border-[var(--line-c)]"
                }`}
              >
                <b className="block text-sm">Card / Online</b>
                <span className="text-xs text-[var(--ink-soft)]">Pay securely with Stripe</span>
              </button>
            </div>
          </div>

          {paymentMethod === "card" && (
            <div className="rounded-lg border border-[var(--line-c)] bg-[var(--bg-alt)] p-4 text-[13px] text-[var(--ink-soft)]">
              You&apos;ll enter card details on Stripe&apos;s secure page. Test card:{" "}
              <code className="font-mono-ui">4242 4242 4242 4242</code>
            </div>
          )}

          {paymentMethod === "cod" && (
            <div className="rounded-lg border border-[var(--line-c)] bg-[var(--bg-alt)] p-4 text-[13px] text-[var(--ink-soft)]">
              Pay in cash when your order is delivered. No online payment needed.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-sweep w-full rounded bg-zyro-black py-4 text-sm font-bold text-white disabled:opacity-50"
          >
            {loading
              ? "Placing order..."
              : paymentMethod === "cod"
                ? "Place Order (COD)"
                : "Continue to Payment"}
          </button>
        </form>
      </div>

      <div className="h-fit rounded-2xl border border-[var(--line-c)] bg-[var(--surface)] p-7">
        <h3 className="font-display mb-3.5 text-[22px]">Order Summary</h3>
        {items.length ? (
          items.map((l, i) => (
            <div key={i} className="mb-2 flex justify-between text-sm">
              <span>
                {l.name} ×{l.qty}
              </span>
              <span className="font-mono-ui">${(l.price * l.qty).toFixed(2)}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-[var(--ink-soft)]">Cart is empty</p>
        )}
        <div className="mt-3 border-t border-[var(--line-c)] pt-3 text-sm">
          <div className="mb-1 flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono-ui">${subtotal.toFixed(2)}</span>
          </div>
          <div className="mb-1 flex justify-between">
            <span>Shipping</span>
            <span className="font-mono-ui">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="mt-2 flex justify-between text-base font-bold">
            <span>Total</span>
            <span className="font-mono-ui">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
