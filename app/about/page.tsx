import Link from "next/link";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
      <div className="mb-2 font-mono-ui text-xs uppercase tracking-wider text-zyro-blue">Our Story</div>
      <h1 className="font-display mb-6 text-[48px] leading-none sm:text-[64px]">
        Built for athletes
        <br />
        who train with intent.
      </h1>
      <div className="max-w-2xl space-y-5 text-[16px] leading-relaxed text-[var(--ink-soft)]">
        <p>
          ZyroFit started with a simple frustration: most training gear looks good in a photo but falls apart the
          moment you actually train hard in it. We set out to design apparel and accessories that survive real
          sessions — not just look the part.
        </p>
        <p>
          Every piece is engineered with performance fabric, flatlock seams, and athletic fits tested by runners,
          lifters, and coaches. From compression tops to duffels that survive road trips, we obsess over the details
          that keep you moving.
        </p>
        <p>
          Today we equip tens of thousands of athletes. Whether you&apos;re chasing a PR or coaching a team, we build
          gear that keeps up.
        </p>
      </div>
      <Link
        href="/shop"
        className="mt-10 inline-block rounded bg-zyro-black px-7 py-4 text-sm font-bold text-white"
      >
        Shop The Collection
      </Link>
    </div>
  );
}
