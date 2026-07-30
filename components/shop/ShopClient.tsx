"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductDTO } from "@/lib/types";
import { CATEGORIES, COLOR_HEX, SIZES_APPAREL } from "@/lib/data";
import ProductCard from "@/components/shop/ProductCard";
import { CloseIcon } from "@/components/ui/Icons";

const MAX_PRICE_CEILING = 120;

export default function ShopClient({
  products,
  initialCategory,
}: {
  products: ProductDTO[];
  initialCategory?: string;
}) {
  const [cats, setCats] = useState<Set<string>>(new Set(initialCategory ? [initialCategory] : []));
  const [sizes, setSizes] = useState<Set<string>>(new Set());
  const [colors, setColors] = useState<Set<string>>(new Set());
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE_CEILING);
  const [sort, setSort] = useState("popularity");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Re-sync when navigating client-side to /shop?category=X from a different
    // page (e.g. a category tile) while this component instance is reused.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initialCategory) setCats(new Set([initialCategory]));
  }, [initialCategory]);

  function toggleSet(set: Set<string>, setter: (s: Set<string>) => void, value: string) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  }

  function resetFilters() {
    setCats(new Set());
    setSizes(new Set());
    setColors(new Set());
    setMaxPrice(MAX_PRICE_CEILING);
  }

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (cats.size && !cats.has(p.category)) return false;
      if (sizes.size && !p.sizes.some((s) => sizes.has(s))) return false;
      if (colors.size && !p.colors.some((c) => colors.has(c))) return false;
      if (p.price > maxPrice) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "newest") list = [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    else list = [...list].sort((a, b) => b.popularity - a.popularity);
    return list;
  }, [products, cats, sizes, colors, maxPrice, sort]);

  const filterPanel = (
    <div className="flex flex-col gap-7">
      <div className="border-b border-[var(--line-c)] pb-5.5">
        <h4 className="mb-3.5 font-mono-ui text-[13px] uppercase tracking-wider">Category</h4>
        {CATEGORIES.map((c) => (
          <label
            key={c.key}
            className={`flex cursor-pointer items-center gap-2.5 py-1.5 text-sm ${
              cats.has(c.key) ? "font-bold text-[var(--ink)]" : "text-[var(--ink-soft)]"
            }`}
          >
            <input
              type="checkbox"
              checked={cats.has(c.key)}
              onChange={() => toggleSet(cats, setCats, c.key)}
              className="h-[15px] w-[15px] accent-zyro-blue"
            />
            {c.label}
          </label>
        ))}
      </div>

      <div className="border-b border-[var(--line-c)] pb-5.5">
        <h4 className="mb-3.5 font-mono-ui text-[13px] uppercase tracking-wider">Price</h4>
        <div className="mb-2 flex justify-between font-mono-ui text-xs text-[var(--ink-soft)]">
          <span>$0</span>
          <span>${maxPrice}</span>
        </div>
        <input
          type="range"
          min={10}
          max={MAX_PRICE_CEILING}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-zyro-blue"
        />
      </div>

      <div className="border-b border-[var(--line-c)] pb-5.5">
        <h4 className="mb-3.5 font-mono-ui text-[13px] uppercase tracking-wider">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES_APPAREL.map((s) => (
            <button
              key={s}
              onClick={() => toggleSet(sizes, setSizes, s)}
              className={`flex h-9 w-[42px] items-center justify-center rounded-md border font-mono-ui text-xs font-bold transition-colors ${
                sizes.has(s)
                  ? "border-zyro-black bg-zyro-black text-white"
                  : "border-[var(--line-c)] hover:border-[var(--ink)]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-[var(--line-c)] pb-5.5">
        <h4 className="mb-3.5 font-mono-ui text-[13px] uppercase tracking-wider">Color</h4>
        <div className="flex flex-wrap gap-2.5">
          {Object.entries(COLOR_HEX).map(([name, hex]) => (
            <button
              key={name}
              title={name}
              onClick={() => toggleSet(colors, setColors, name)}
              className="h-6.5 w-6.5 rounded-full transition-transform hover:scale-110"
              style={{
                background: hex,
                boxShadow: colors.has(name)
                  ? `0 0 0 2px var(--bg), 0 0 0 4px var(--color-zyro-blue)`
                  : `0 0 0 1px var(--line-c)`,
              }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={resetFilters}
        className="w-full rounded border-[1.5px] border-[var(--ink)] py-3 text-sm font-bold transition-colors hover:bg-[var(--ink)] hover:text-[var(--bg)]"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-9 py-12 md:grid-cols-[260px_1fr]">
      <aside className="hidden md:block">{filterPanel}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[300] overflow-auto bg-[var(--bg)] p-6 md:hidden">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-2xl">Filters</h3>
            <button onClick={() => setMobileOpen(false)}>
              <CloseIcon className="h-5.5 w-5.5" />
            </button>
          </div>
          {filterPanel}
          <button
            onClick={() => setMobileOpen(false)}
            className="btn-sweep mt-6 w-full rounded bg-zyro-black py-3.5 text-sm font-bold text-white"
          >
            Show {filtered.length} Results
          </button>
        </div>
      )}

      <div>
        <div className="mb-6.5 flex flex-wrap items-center justify-between gap-3.5">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-2 rounded border border-[var(--line-c)] px-4 py-2.5 text-sm font-bold md:hidden"
          >
            Filters
          </button>
          <span className="text-sm text-[var(--ink-soft)]">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-md border border-[var(--line-c)] bg-[var(--surface)] px-3.5 py-2.5 text-sm font-semibold"
          >
            <option value="popularity">Sort: Popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {filtered.length ? (
          <div className="grid grid-cols-2 gap-4.5 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-[var(--ink-soft)]">
            <p>No products match these filters yet.</p>
            <button onClick={resetFilters} className="mt-4 rounded border border-[var(--ink)] px-5 py-2.5 text-sm font-bold">
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
