"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/providers/CartContext";
import { productImageUrl } from "@/lib/data";
import { BagIcon, CloseIcon } from "@/components/ui/Icons";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, updateQty, removeItem, subtotal } = useCart();

  return (
    <div
      className={`fixed inset-0 z-[400] bg-black/50 transition-opacity duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-[var(--bg)] transition-transform duration-400 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ transitionTimingFunction: "var(--ease)" }}
      >
        <div className="flex items-center justify-between border-b border-[var(--line-c)] px-6 py-5">
          <h3 className="font-display text-2xl">Your Cart</h3>
          <button onClick={onClose} aria-label="Close cart">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {!items.length ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center text-[var(--ink-soft)]">
            <BagIcon className="h-12 w-12 text-[var(--line-c)]" />
            <p>Your cart is empty.</p>
            <Link
              href="/shop"
              onClick={onClose}
              className="btn-sweep rounded bg-zyro-black px-6 py-3 text-sm font-bold text-white"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto px-6">
              {items.map((line, i) => (
                <div key={i} className="flex gap-3.5 border-b border-[var(--line-c)] py-4">
                  <Image
                    src={productImageUrl(line.imageSeed, 150, 180)}
                    alt={line.name}
                    width={68}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <b className="text-[13.5px]">{line.name}</b>
                    <div className="my-1 font-mono-ui text-[11px] text-[var(--ink-soft)]">
                      {line.size} · {line.color}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-[var(--line-c)]">
                        <button onClick={() => updateQty(i, -1)} className="h-[26px] w-[26px] text-[13px]">
                          −
                        </button>
                        <span className="w-6 text-center font-mono-ui text-xs">{line.qty}</span>
                        <button onClick={() => updateQty(i, 1)} className="h-[26px] w-[26px] text-[13px]">
                          +
                        </button>
                      </div>
                      <b className="font-mono-ui text-[13px]">${(line.price * line.qty).toFixed(2)}</b>
                    </div>
                    <button
                      onClick={() => removeItem(i)}
                      className="mt-1.5 text-[11px] text-[var(--ink-soft)] underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--line-c)] px-6 py-5">
              <div className="mb-3.5 flex justify-between text-sm font-bold">
                <span>Subtotal</span>
                <span className="font-mono-ui">${subtotal.toFixed(2)}</span>
              </div>
              <Link
                href="/cart"
                onClick={onClose}
                className="btn-sweep flex w-full items-center justify-center rounded bg-zyro-black px-6 py-3.5 text-sm font-bold text-white"
              >
                View Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
