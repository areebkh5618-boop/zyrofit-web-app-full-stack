"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/components/providers/CartContext";
import { WishlistProvider } from "@/components/providers/WishlistContext";
import { ToastProvider } from "@/components/providers/ToastContext";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </CartProvider>
    </ToastProvider>
  );
}
