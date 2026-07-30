"use client";

import Link from "next/link";
import { ProductDTO } from "@/lib/types";
import { useWishlist } from "@/components/providers/WishlistContext";
import ProductCard from "@/components/shop/ProductCard";
import { HeartIcon } from "@/components/ui/Icons";

export default function WishlistClient({ products }: { products: ProductDTO[] }) {
  const { ids } = useWishlist();
  const wished = products.filter((p) => ids.includes(p.id));

  if (!wished.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center text-[var(--ink-soft)]">
        <HeartIcon className="h-12 w-12 text-[var(--line-c)]" />
        <p>No items saved yet.</p>
        <Link href="/shop" className="btn-sweep rounded bg-zyro-black px-6 py-3 text-sm font-bold text-white">
          Browse The Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4.5 sm:grid-cols-3 lg:grid-cols-4">
      {wished.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
