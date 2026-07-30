"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/providers/CartContext";
import { useToast } from "@/components/providers/ToastContext";
import { productImageUrl } from "@/lib/data";
import { BagIcon } from "@/components/ui/Icons";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const { show } = useToast();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(false);

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === "ZYRO10") {
      setApplied(true);
      show("Coupon applied — 10% off");
    } else {
      setApplied(false);
      show("Invalid coupon code");
    }
  }

  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 7.99;
  const discount = applied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-10">
      <div className="mb-2 flex items-center gap-2 font-mono-ui text-xs uppercase tracking-wider text-[var(--ink-soft)]">
        Home <span className="text-zyro-blue">/</span> Cart
      </div>
      <h1 className="font-display mb-8 text-[42px]">Your Cart</h1>

      {!items.length ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center text-[var(--ink-soft)]">
          <BagIcon className="h-12 w-12 text-[var(--line-c)]" />
          <p>Your cart is empty.</p>
          <Link href="/shop" className="btn-sweep rounded bg-zyro-black px-6 py-3 text-sm font-bold text-white">
            Browse Gear
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-9 md:grid-cols-[1.6fr_1fr]">
          <div>
            {items.map((line, i) => (
              <div
                key={i}
                className="grid grid-cols-[70px_1fr_auto_auto] items-center gap-4 border-b border-[var(--line-c)] py-4.5"
              >
                <Image
                  src={productImageUrl(line.imageSeed, 150, 180)}
                  alt={line.name}
                  width={70}
                  height={84}
                  className="rounded-lg object-cover"
                />
                <div>
                  <b className="block text-sm">{line.name}</b>
                  <span className="font-mono-ui text-[11px] text-[var(--ink-soft)]">
                    {line.size} · {line.color}
                  </span>
                  <button onClick={() => removeItem(i)} className="mt-1.5 block text-[11px] text-[var(--ink-soft)] underline">
                    Remove
                  </button>
                </div>
                <div className="flex items-center rounded-md border border-[var(--line-c)]">
                  <button onClick={() => updateQty(i, -1)} className="h-[30px] w-[30px]">
                    −
                  </button>
                  <span className="w-7 text-center font-mono-ui text-xs">{line.qty}</span>
                  <button onClick={() => updateQty(i, 1)} className="h-[30px] w-[30px]">
                    +
                  </button>
                </div>
                <b className="font-mono-ui">${(line.price * line.qty).toFixed(2)}</b>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-2xl border border-[var(--line-c)] bg-[var(--surface)] p-7">
            <h3 className="font-display mb-3.5 text-[22px]">Order Summary</h3>
            <div className="my-4 flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Coupon code (try ZYRO10)"
                className="flex-1 rounded-md border border-[var(--line-c)] bg-[var(--bg)] px-3 py-2.5 text-sm outline-none"
              />
              <button onClick={applyCoupon} className="rounded border border-[var(--ink)] px-4 text-sm font-bold">
                Apply
              </button>
            </div>
            <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`} />
            {discount > 0 && <Row label="Discount" value={`−$${discount.toFixed(2)}`} />}
            <div className="mt-2 flex justify-between border-t border-[var(--line-c)] pt-4 text-[17px] font-extrabold">
              <span>Total</span>
              <span className="font-mono-ui">${total.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              className="btn-sweep mt-4 flex w-full items-center justify-center rounded bg-zyro-black py-3.5 text-sm font-bold text-white"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2.5 text-sm text-[var(--ink-soft)]">
      <span>{label}</span>
      <span className="font-mono-ui">{value}</span>
    </div>
  );
}
