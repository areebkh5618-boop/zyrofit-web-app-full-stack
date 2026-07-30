"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface WishlistContextValue {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => boolean; // returns true if now wishlisted
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "zyrofit_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is unavailable during SSR
      if (raw) setIds(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids, hydrated]);

  function has(id: string) {
    return ids.includes(id);
  }

  function toggle(id: string) {
    let nowWishlisted = false;
    setIds((prev) => {
      if (prev.includes(id)) {
        nowWishlisted = false;
        return prev.filter((x) => x !== id);
      }
      nowWishlisted = true;
      return [...prev, id];
    });
    return nowWishlisted;
  }

  return <WishlistContext.Provider value={{ ids, has, toggle }}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
