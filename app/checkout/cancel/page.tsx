import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-[560px] px-6 py-24 text-center">
      <h1 className="font-display text-[38px]">Checkout Cancelled</h1>
      <p className="mt-2.5 text-[var(--ink-soft)]">
        No charge was made. Your cart is exactly as you left it whenever you&apos;re ready to finish up.
      </p>
      <div className="mt-7 flex justify-center gap-3">
        <Link href="/cart" className="btn-sweep rounded bg-zyro-black px-6 py-3.5 text-sm font-bold text-white">
          Back to Cart
        </Link>
        <Link
          href="/shop"
          className="rounded border-[1.5px] border-[var(--ink)] px-6 py-3.5 text-sm font-bold transition-colors hover:bg-[var(--ink)] hover:text-[var(--bg)]"
        >
          Keep Shopping
        </Link>
      </div>
    </div>
  );
}
