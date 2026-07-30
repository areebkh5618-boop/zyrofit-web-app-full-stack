import Image from "next/image";
import { StarIcon } from "@/components/ui/Icons";

const TESTIMONIALS = [
  {
    name: "Jordan M.",
    role: "Marathon Runner",
    quote:
      "The Velocity shirt has survived more 20-mile training runs than I can count and still looks brand new. This is what \u201Ctechnical fabric\u201D should mean.",
    img: 12,
  },
  {
    name: "Priya K.",
    role: "CrossFit Coach",
    quote:
      "I outfit my whole box in ZyroFit now. The Flux leggings hold compression through a full WOD without ever needing a mid-class adjustment.",
    img: 47,
  },
  {
    name: "Marcus T.",
    role: "Powerlifter",
    quote:
      "Grip straps are genuinely better than brands twice the price. Padding stays put and the stitching hasn\u2019t budged after months of pulls.",
    img: 33,
  },
  {
    name: "Sofia R.",
    role: "Yoga & Mobility",
    quote:
      "Finally a compression top that breathes. I run hot mid-session and this is the first base layer that doesn\u2019t turn into a sauna.",
    img: 65,
  },
  {
    name: "Devon A.",
    role: "College Athletics",
    quote:
      "Ordered the Voyager duffel for the whole team. Eight months of road trips later, zero seam failures. That\u2019s the real review.",
    img: 8,
  },
];

export default function Testimonials() {
  return (
    <div className="scrollbar-thin flex snap-x gap-5.5 overflow-x-auto pb-2.5">
      {TESTIMONIALS.map((t) => (
        <div
          key={t.name}
          className="flex w-[320px] flex-shrink-0 snap-start flex-col gap-3.5 rounded-2xl border border-[var(--line-c)] bg-[var(--surface)] p-6.5"
        >
          <div className="flex gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <StarIcon key={i} className="h-3.5 w-3.5 text-zyro-green" />
            ))}
          </div>
          <p className="text-[14.5px] leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
          <div className="mt-auto flex items-center gap-3">
            <Image
              src={`https://i.pravatar.cc/100?img=${t.img}`}
              alt={t.name}
              width={42}
              height={42}
              className="rounded-full object-cover grayscale-[30%]"
            />
            <div>
              <b className="block text-[13px]">{t.name}</b>
              <span className="text-xs text-[var(--ink-soft)]">{t.role}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
