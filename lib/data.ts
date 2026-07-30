export const CATEGORIES = [
  { key: "shirts", label: "Sports Shirts", seed: "cat-shirts" },
  { key: "shorts", label: "Training Shorts", seed: "cat-shorts" },
  { key: "bags", label: "Sports Bags", seed: "cat-bags" },
  { key: "gym", label: "Gym Wear", seed: "cat-gym" },
  { key: "compression", label: "Compression Wear", seed: "cat-compression" },
  { key: "accessories", label: "Fitness Accessories", seed: "cat-accessories" },
] as const;

export const COLOR_HEX: Record<string, string> = {
  Black: "#111111",
  Blue: "#007BFF",
  White: "#FFFFFF",
  Grey: "#9AA3AF",
  Green: "#39FF14",
};

export const SIZES_APPAREL = ["XS", "S", "M", "L", "XL", "XXL"];

export function catLabel(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

/**
 * Resolves product image:
 * - If imageUrl is set (uploaded file or full URL), use it
 * - If seed is already a path/URL, use it
 * - Otherwise picsum placeholder
 */
export function productImageUrl(seedOrUrl: string, w = 600, h = 750, imageUrl?: string | null): string {
  if (imageUrl) return imageUrl;
  if (!seedOrUrl) return `https://picsum.photos/seed/placeholder/${w}/${h}`;
  if (seedOrUrl.startsWith("/") || seedOrUrl.startsWith("http://") || seedOrUrl.startsWith("https://")) {
    return seedOrUrl;
  }
  return `https://picsum.photos/seed/${seedOrUrl}/${w}/${h}`;
}
