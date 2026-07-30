"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductDTO } from "@/lib/types";
import { catLabel, productImageUrl } from "@/lib/data";
import { SearchIcon } from "@/components/ui/Icons";

export default function SearchBox({ products }: { products: ProductDTO[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  const matches = query.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            catLabel(p.category).toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)
    : [];

  return (
    <div ref={wrapRef} className="relative hidden sm:block">
      <div className="flex w-[200px] items-center gap-2 rounded-full bg-[var(--bg-alt)] px-4 py-2.5 transition-all focus-within:w-[260px]">
        <SearchIcon className="h-4 w-4 flex-shrink-0 text-[var(--ink-soft)]" />
        <input
          type="text"
          placeholder="Search gear..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full bg-transparent text-[13px] outline-none placeholder:text-[var(--ink-soft)]"
        />
      </div>
      {open && query.trim() && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 max-h-[340px] w-[300px] overflow-auto rounded-lg border border-[var(--line-c)] bg-[var(--surface)] shadow-[var(--shadow)]">
          {matches.length ? (
            matches.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                onClick={() => {
                  setQuery("");
                  setOpen(false);
                }}
                className="flex items-center gap-2.5 border-b border-[var(--line-c)] p-2.5 last:border-b-0 hover:bg-[var(--bg-alt)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={productImageUrl(p.imageSeed, 100, 100, p.imageUrl)}
                  alt={p.name}
                  width={42}
                  height={42}
                  className="h-[42px] w-[42px] rounded-md object-cover"
                />
                <div>
                  <div className="text-[13px] font-semibold">{p.name}</div>
                  <div className="font-mono-ui text-xs text-[var(--ink-soft)]">
                    ${p.price.toFixed(2)} · {catLabel(p.category)}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-4 text-center text-[13px] text-[var(--ink-soft)]">No gear found for &quot;{query}&quot;</div>
          )}
        </div>
      )}
    </div>
  );
}
