import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative flex min-h-[92vh] items-stretch overflow-hidden bg-zyro-black">
      <div className="grid w-full grid-cols-1 lg:grid-cols-[1fr_1.15fr]">
        <div className="relative z-[3] flex flex-col justify-center gap-5 px-6 pb-20 pt-[140px] text-white lg:max-w-[560px] lg:px-10 lg:pt-0 xl:pl-0">
          <div className="flex items-center gap-2.5 font-mono-ui text-xs uppercase tracking-[3px] text-zyro-green">
            <span className="stripe" style={{ width: 20, height: 4 }} />
            New Season Drop
          </div>
          <h1 className="font-display text-[48px] leading-[0.92] text-white sm:text-[64px] lg:text-[80px] xl:text-[92px]">
            MOVE STRONG.
            <br />
            <em className="not-italic text-zyro-green">PERFORM</em> BETTER.
          </h1>
          <p className="max-w-[420px] text-[16px] leading-relaxed text-[#c9cdd3]">
            Engineered apparel and training gear for athletes who don&apos;t take rest days from intent. Built for the
            gym, the track, and everywhere in between.
          </p>
          <div className="mt-1.5 flex flex-wrap gap-3.5">
            <Link
              href="/shop"
              className="rounded bg-zyro-green px-7 py-4 text-sm font-bold text-zyro-black transition-transform hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(57,255,20,0.45)]"
            >
              Shop The Drop
            </Link>
            <Link
              href="/about"
              className="rounded border-[1.5px] border-[#444] px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-white hover:text-zyro-black"
            >
              Our Story
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-7">
            {[
              ["50K+", "Athletes Equipped"],
              ["4.9★", "Average Rating"],
              ["30-Day", "Free Returns"],
            ].map(([big, small]) => (
              <div key={small}>
                <b className="block font-display text-[30px] text-white">{big}</b>
                <span className="font-mono-ui text-[11px] uppercase tracking-wider text-[#9aa3af]">{small}</span>
              </div>
            ))}
          </div>
        </div>
        <div
          className="media-duo relative min-h-[380px]"
          style={{ clipPath: "polygon(14% 0, 100% 0, 100% 100%, 0% 100%)" }}
        >
          <Image
            src="https://picsum.photos/seed/zyrofit-hero-main/1200/1500"
            alt="Athlete training in ZyroFit apparel"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
      <div className="absolute bottom-0 left-[14%] top-0 z-[4] hidden w-2.5 -skew-x-12 bg-zyro-green lg:block" />
    </div>
  );
}
