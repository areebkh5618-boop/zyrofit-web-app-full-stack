"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/components/providers/CartContext";

export default function ClearCartOnMount() {
  const { clear } = useCart();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    clear();
  }, [clear]);

  return null;
}
