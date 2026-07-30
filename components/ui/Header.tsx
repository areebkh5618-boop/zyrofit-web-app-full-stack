"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProductDTO } from "@/lib/types";
import SearchBox from "@/components/ui/SearchBox";
import ThemeToggle from "@/components/ui/ThemeToggle";
import CartDrawer from "@/components/ui/CartDrawer";
import { useCart } from "@/components/providers/CartContext";
import { useWishlist } from "@/components/providers/WishlistContext";
import { BagIcon, HeartIcon, UserIcon, MenuIcon, CloseIcon } from "@/components/ui/Icons";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ products }: { products: ProductDTO[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { count } = useCart();
  const { ids: wishlistIds } = useWishlist();

  return (
    <>
      <header className="sticky top-0 z-[200] h-[64px] sm:h-[76px] border-b border-[var(--line-c)] bg-[var(--bg)] transition-colors duration-300">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex flex-shrink-0 items-center gap-2.5 font-display text-2xl tracking-wide">
            <span className="stripe" style={{ width: 18, height: 18, borderRadius: 3 }} />
            ZYROFIT
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1.5 text-sm font-semibold transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-zyro-green after:transition-all after:duration-300 ${
                    active
                      ? "text-[var(--ink)] after:w-full"
                      : "text-[var(--ink-soft)] after:w-0 hover:text-[var(--ink)] hover:after:w-full"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-shrink-0 items-center gap-1">
            <SearchBox products={products} />
            <ThemeToggle />
            <Link
              href="/dashboard"
              aria-label="Account"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--bg-alt)]"
            >
              <UserIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--bg-alt)]"
            >
              <HeartIcon className="h-5 w-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-zyro-blue font-mono-ui text-[10px] font-bold text-white">
                  {wishlistIds.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--bg-alt)]"
            >
              <BagIcon className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-zyro-blue font-mono-ui text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
              className="flex h-10 w-10 items-center justify-center lg:hidden"
            >
              <MenuIcon className="h-5.5 w-5.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <div
        className={`fixed inset-0 z-[300] bg-black/50 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setMobileOpen(false);
        }}
      >
        <div
          className={`absolute right-0 top-0 flex h-full w-[82%] max-w-[340px] flex-col gap-1 bg-[var(--bg)] p-6 transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button onClick={() => setMobileOpen(false)} className="mb-2 ml-auto h-9 w-9">
            <CloseIcon className="h-5.5 w-5.5" />
          </button>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-[var(--line-c)] py-4 text-lg font-bold"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="border-b border-[var(--line-c)] py-4 text-lg font-bold"
          >
            Account
          </Link>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
