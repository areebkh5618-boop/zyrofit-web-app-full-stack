"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface WishlistContextValue {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => boolean;
  clearWishlist: () => void;
  loading: boolean;
}

interface AccountResponse {
  user?: {
    _id?: string;
    id?: string;
    email?: string;
  } | null;
  _id?: string;
  id?: string;
  email?: string;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function getWishlistKey(userIdentifier: string | null): string {
  return userIdentifier
    ? `zyrofit_wishlist_${userIdentifier}`
    : "zyrofit_wishlist_guest";
}

function readStoredWishlist(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0,
    );
  } catch {
    return [];
  }
}

export function WishlistProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [ids, setIds] = useState<string[]>([]);
  const [storageKey, setStorageKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadWishlist() {
      try {
        const response = await fetch("/api/account", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        let userIdentifier: string | null = null;

        if (response.ok) {
          const data = (await response.json()) as AccountResponse;
          const account = data.user ?? data;

          userIdentifier =
            account?._id ??
            account?.id ??
            account?.email ??
            null;
        }

        const key = getWishlistKey(userIdentifier);

        if (!cancelled) {
          setStorageKey(key);
          setIds(readStoredWishlist(key));
        }
      } catch {
        const guestKey = getWishlistKey(null);

        if (!cancelled) {
          setStorageKey(guestKey);
          setIds(readStoredWishlist(guestKey));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWishlist();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!storageKey || loading) {
      return;
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(ids));
    } catch {
      // localStorage unavailable or storage full
    }
  }, [ids, storageKey, loading]);

  const has = useCallback(
    (id: string): boolean => ids.includes(id),
    [ids],
  );

  const toggle = useCallback((id: string): boolean => {
    let isNowWishlisted = false;

    setIds((currentIds) => {
      if (currentIds.includes(id)) {
        isNowWishlisted = false;
        return currentIds.filter((currentId) => currentId !== id);
      }

      isNowWishlisted = true;
      return [...currentIds, id];
    });

    return isNowWishlisted;
  }, []);

  const clearWishlist = useCallback(() => {
    setIds([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        ids,
        has,
        toggle,
        clearWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider",
    );
  }

  return context;
}