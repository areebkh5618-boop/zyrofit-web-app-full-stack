"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductDTO } from "@/lib/types";
import { COLOR_HEX, catLabel, productImageUrl } from "@/lib/data";
import { useCart } from "@/components/providers/CartContext";
import { useToast } from "@/components/providers/ToastContext";
import { StarIcon, BagIcon, TruckIcon, ShieldIcon, RefreshIcon, PlusIcon } from "@/components/ui/Icons";

const REVIEW_POOL = [
  { name: "A. Reyes", text: "Fit was exactly true to size — ordered my usual and it's perfect. Fabric feels premium, not flimsy like a lot of training gear." },
  { name: "K. Nguyen", text: "Held up through six weeks of daily gym sessions with zero pilling. Will be buying another in a second colorway." },
  { name: "T. Brooks", text: "Comfortable enough to wear all day, supportive enough to actually train hard in. That balance is hard to find." },
  { name: "M. Okafor", text: "Shipping was fast and the packaging was minimal/recyclable which I appreciated. Product itself exceeded expectations." },
];

const THUMBS = ["a", "b", "c", "d"];

export default function ProductDetail({ product }: { product: ProductDTO }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { show } = useToast();

  const [thumb, setThumb] = useState(0);
  const [size, setSize] = useState(product.sizes.includes("M") ? "M" : product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [openSection, setOpenSection] = useState<"details" | "shipping" | "reviews">("details");


  function handleAddToCart(redirectToCheckout = false) {
    addItem(
      { productId: product.id, name: product.name, price: product.price, size, color, imageSeed: product.imageUrl || product.imageSeed },
      qty
    );
    if (redirectToCheckout) {
      router.push("/checkout");
    } else {
      show("Added to cart");
    }
  }

  const idx = Number(product.id.slice(-4).replace(/\D/g, "")) || 0;
  const reviewPicks = [REVIEW_POOL[idx % 4], REVIEW_POOL[(idx + 1) % 4], REVIEW_POOL[(idx + 2) % 4]];
  const reviewDates = ["Jun 2, 2026", "May 19, 2026", "Apr 27, 2026"];

  return (
    <div className="grid grid-cols-1 gap-12 py-12 md:grid-cols-2">
      <div>
        <div className="relative mb-3.5 aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--bg-alt)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl ? product.imageUrl : productImageUrl(`${product.imageSeed}-${THUMBS[thumb]}`, 700, 875)}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex gap-2.5">
          {THUMBS.map((t, i) => (
            <button
              key={t}
              onClick={() => setThumb(i)}
              className={`media-duo relative h-[88px] w-[74px] overflow-hidden rounded-lg border-2 transition-opacity ${
                i === thumb ? "border-zyro-blue opacity-100" : "border-transparent opacity-60"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.imageUrl ? product.imageUrl : productImageUrl(`${product.imageSeed}-${t}`, 200, 250)} alt="thumbnail" className="absolute inset-0 h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="font-mono-ui text-[10px] uppercase tracking-wider text-[var(--ink-soft)]">
          {catLabel(product.category)}
        </span>
        <h1 className="mb-3 mt-2 text-[clamp(28px,4vw,40px)] font-extrabold leading-tight tracking-tight">{product.name}</h1>
        <div className="flex items-center gap-1.5 text-sm text-[var(--ink-soft)]">
          {[0, 1, 2, 3, 4].map((i) => (
            <StarIcon key={i} className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? "text-zyro-green" : "text-[var(--line-c)]"}`} />
          ))}
          <span>
            {product.rating} · {product.reviewsCount} Reviews
          </span>
        </div>

        <div className="my-5.5 flex items-center gap-3">
          <span className="font-mono-ui text-[26px] font-bold text-zyro-blue">${product.price.toFixed(2)}</span>
          {product.oldPrice && (
            <span className="font-mono-ui text-sm text-[var(--ink-soft)] line-through">${product.oldPrice.toFixed(2)}</span>
          )}
          {product.badge && (
            <span
              className={`rounded font-mono-ui text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 text-white ${
                product.badge === "Sale" ? "bg-zyro-black" : product.badge === "New" ? "bg-zyro-green !text-zyro-black" : "bg-zyro-blue"
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>

        <p className="mb-6.5 text-[14.5px] leading-relaxed text-[var(--ink-soft)]">{product.description}</p>

        <div className="mb-6.5">
          <span className="mb-2.5 block font-mono-ui text-xs uppercase tracking-wider">Color: {color}</span>
          <div className="flex flex-wrap gap-2.5">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                title={c}
                className="h-6.5 w-6.5 rounded-full transition-transform hover:scale-110"
                style={{
                  background: COLOR_HEX[c] ?? "#ccc",
                  boxShadow: color === c ? `0 0 0 2px var(--bg), 0 0 0 4px var(--color-zyro-blue)` : `0 0 0 1px var(--line-c)`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="mb-6.5">
          <span className="mb-2.5 block font-mono-ui text-xs uppercase tracking-wider">Size: {size}</span>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`flex h-9 min-w-[42px] items-center justify-center rounded-md border px-2 font-mono-ui text-xs font-bold transition-colors ${
                  size === s ? "border-zyro-black bg-zyro-black text-white" : "border-[var(--line-c)] hover:border-[var(--ink)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6.5">
          <span className="mb-2.5 block font-mono-ui text-xs uppercase tracking-wider">Quantity</span>
          <div className="inline-flex items-center rounded-md border border-[var(--line-c)]">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-[42px] w-[38px] text-base font-bold">
              −
            </button>
            <span className="w-10 text-center font-mono-ui font-bold">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="h-[42px] w-[38px] text-base font-bold">
              +
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleAddToCart(false)}
            className="btn-sweep flex min-w-[160px] flex-1 items-center justify-center gap-2 rounded bg-zyro-black px-7 py-4 text-sm font-bold text-white"
          >
            <BagIcon className="h-4 w-4" /> Add to Cart
          </button>
          <button
            onClick={() => handleAddToCart(true)}
            className="flex min-w-[160px] flex-1 items-center justify-center rounded bg-zyro-green px-7 py-4 text-sm font-bold text-zyro-black transition-transform hover:-translate-y-0.5"
          >
            Buy Now
          </button>
        </div>

        <div className="mt-7.5 flex flex-col gap-3 border-t border-[var(--line-c)] pt-6.5">
          <div className="flex items-center gap-3 text-[13.5px] text-[var(--ink-soft)]">
            <TruckIcon className="h-[18px] w-[18px] flex-shrink-0 text-zyro-blue" /> Free shipping on orders over $75
          </div>
          <div className="flex items-center gap-3 text-[13.5px] text-[var(--ink-soft)]">
            <ShieldIcon className="h-[18px] w-[18px] flex-shrink-0 text-zyro-blue" /> Secure checkout, encrypted end-to-end
          </div>
          <div className="flex items-center gap-3 text-[13.5px] text-[var(--ink-soft)]">
            <RefreshIcon className="h-[18px] w-[18px] flex-shrink-0 text-zyro-blue" /> 30-day hassle-free returns
          </div>
        </div>

        <div className="mt-7">
          {(
            [
              ["details", "Product Details"],
              ["shipping", "Shipping & Returns"],
              ["reviews", `Reviews (${product.reviewsCount})`],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="border-b border-[var(--line-c)]">
              <button
                onClick={() => setOpenSection(openSection === key ? ("" as typeof key) : key)}
                className="flex w-full items-center justify-between py-4.5 text-left text-sm font-bold"
              >
                {label}
                <PlusIcon className={`h-4 w-4 transition-transform ${openSection === key ? "rotate-45" : ""}`} />
              </button>
              {openSection === key && (
                <div className="pb-4.5 text-[13.5px] leading-relaxed text-[var(--ink-soft)]">
                  {key === "details" && (
                    <p>
                      Four-way stretch performance fabric, flatlock seams to prevent chafing, moisture-wicking finish, and a
                      true-to-size athletic fit. Machine washable, tumble dry low.
                    </p>
                  )}
                  {key === "shipping" && (
                    <p>
                      Orders ship within 24 hours on business days. Standard delivery takes 2–5 days. Not the right fit?
                      Return unworn items within 30 days for a full refund.
                    </p>
                  )}
                  {key === "reviews" && (
                    <div>
                      {reviewPicks.map((r, i) => (
                        <div key={i} className="border-b border-[var(--line-c)] py-4 last:border-b-0">
                          <div className="mb-1.5 flex items-center justify-between">
                            <b className="text-[13.5px] text-[var(--ink)]">{r.name}</b>
                            <span className="font-mono-ui text-[11px]">{reviewDates[i]}</span>
                          </div>
                          <div className="mb-1.5 flex gap-0.5">
                            {[0, 1, 2, 3, 4].map((s) => (
                              <StarIcon key={s} className={`h-3 w-3 ${s < 4 + (i % 2) ? "text-zyro-green" : "text-[var(--line-c)]"}`} />
                            ))}
                          </div>
                          <p>{r.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
