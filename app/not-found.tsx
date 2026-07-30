import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[560px] px-6 py-28 text-center">
      <span className="font-display text-zyro-blue text-[120px] leading-none">404</span>
      <h1 className="font-display mt-2 text-[32px]">Lost The Trail</h1>
      <p className="mt-2.5 text-[var(--ink-soft)]">We couldn&apos;t find the page or product you&apos;re looking for.</p>
      <Link href="/" className="btn-sweep mt-7 inline-block rounded bg-zyro-black px-7 py-3.5 text-sm font-bold text-white">
        Back to Home
      </Link>
    </div>
  );
}
