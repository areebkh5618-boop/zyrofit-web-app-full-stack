import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, productImageUrl } from "@/lib/data";

export default function CategoryTiles() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {CATEGORIES.map((c) => (
        <Link
          key={c.key}
          href={`/shop?category=${c.key}`}
          className="media-duo group relative aspect-square overflow-hidden rounded-2xl"
        >
          <Image
            src={productImageUrl(c.seed, 600, 600)}
            alt={c.label}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute bottom-4.5 left-4.5 z-10 text-white">
            <span className="stripe mb-2 block" style={{ width: 20, height: 4 }} />
            <h3 className="font-display text-2xl tracking-wide">{c.label}</h3>
            <span className="font-mono-ui text-[11px] text-zyro-green">Shop Now →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
