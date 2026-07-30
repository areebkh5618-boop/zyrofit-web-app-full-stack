"use client";

import Link from "next/link";
import { ProductDTO } from "@/lib/types";
import { catLabel, productImageUrl } from "@/lib/data";
import { HeartIcon, StarIcon, BagIcon } from "@/components/ui/Icons";
import { useWishlist } from "@/components/providers/WishlistContext";
import { useCart } from "@/components/providers/CartContext";
import { useToast } from "@/components/providers/ToastContext";

export default function ProductCard({ product }: { product: ProductDTO }) {
  const { has, toggle } = useWishlist();
  const { addItem } = useCart();
  const { show } = useToast();
  const wished = has(product.id);
  const imgSrc = productImageUrl(product.imageSeed, 600, 750, product.imageUrl);

  function onToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const nowWishlisted = toggle(product.id);
    show(nowWishlisted ? "Added to wishlist" : "Removed from wishlist");
  }

  function onQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes.includes("M") ? "M" : product.sizes[0] || "M";
    const color = product.colors[0] || "Black";
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        size,
        color,
        imageSeed: product.imageUrl || product.imageSeed,
      },
      1
    );
    show("Added to cart");
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--line-c)] bg-[var(--surface)] transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[var(--shadow)]">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-[var(--bg-alt)]">
        {product.badge && (
          <span
            className={`absolute left-2.5 top-2.5 z-10 rounded font-mono-ui text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 text-white ${
              product.badge === "Sale"
                ? "bg-zyro-black"
                : product.badge === "New"
                  ? "bg-zyro-green !text-zyro-black"
                  : "bg-zyro-blue"
            }`}
          >
            {product.badge}
          </span>
        )}
        <button
          onClick={onToggleWishlist}
          aria-label="Toggle wishlist"
          className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 transition-transform hover:scale-110 dark:bg-black/70"
        >
          <HeartIcon
            className={`h-4 w-4 ${wished ? "fill-zyro-blue stroke-zyro-blue" : "stroke-zyro-black dark:stroke-white"}`}
          />
        </button>

        {/* Native img = reliable on listing (works with data-URLs, /uploads, picsum) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute inset-x-2.5 bottom-2.5 z-10 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={onQuickAdd}
            className="btn-sweep flex w-full items-center justify-center gap-2 rounded bg-zyro-black px-4 py-2.5 text-xs font-bold text-white"
          >
            <BagIcon className="h-3.5 w-3.5" /> Add to Cart
          </button>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="font-mono-ui text-[10px] uppercase tracking-wider text-[var(--ink-soft)]">
          {catLabel(product.category)}
        </span>
        <Link href={`/product/${product.slug}`} className="text-[15px] font-bold leading-tight hover:text-zyro-blue">
          {product.name}
        </Link>
        <div className="flex items-center gap-1 text-xs text-[var(--ink-soft)]">
          {[0, 1, 2, 3, 4].map((i) => (
            <StarIcon
              key={i}
              className={`h-3 w-3 ${i < Math.round(product.rating) ? "text-zyro-green" : "text-[var(--line-c)]"}`}
            />
          ))}
          <span>({product.reviewsCount})</span>
        </div>
        <div className="mt-auto flex items-center gap-2 pt-1.5">
          <span className="font-mono-ui text-base font-bold">${product.price.toFixed(2)}</span>
          {product.oldPrice && (
            <span className="font-mono-ui text-[13px] text-[var(--ink-soft)] line-through">
              ${product.oldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
