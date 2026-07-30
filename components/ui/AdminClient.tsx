"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductDTO, OrderDTO } from "@/lib/types";
import { CATEGORIES, COLOR_HEX, SIZES_APPAREL, productImageUrl } from "@/lib/data";
import { useToast } from "@/components/providers/ToastContext";

const EMPTY_FORM = {
  name: "",
  category: "shirts",
  price: "",
  oldPrice: "",
  badge: "",
  description: "",
};

const STATUS_OPTIONS = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

export default function AdminClient({
  products,
  orders,
}: {
  products: ProductDTO[];
  orders: OrderDTO[];
}) {
  const router = useRouter();
  const { show } = useToast();
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [form, setForm] = useState(EMPTY_FORM);
  const [sizes, setSizes] = useState<Set<string>>(new Set(["M", "L"]));
  const [colors, setColors] = useState<Set<string>>(new Set(["Black"]));
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  function toggle(set: Set<string>, setter: (s: Set<string>) => void, value: string) {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    setter(next);
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setImageUrl(data.url);
      setPreview(data.url);
      show("Image uploaded");
    } catch (err) {
      show(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl) {
      show("Please upload a product image");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null,
          badge: form.badge || null,
          imageUrl,
          imageSeed: imageUrl,
          sizes: Array.from(sizes),
          colors: Array.from(colors),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      show("Product created");
      setForm(EMPTY_FORM);
      setImageUrl("");
      setPreview(null);
      setSizes(new Set(["M", "L"]));
      setColors(new Set(["Black"]));
      router.refresh();
    } catch (err) {
      show(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      show("Product deleted");
      router.refresh();
    } else {
      show("Failed to delete product");
    }
  }

  async function updateOrderStatus(orderId: string, status: string) {
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    if (res.ok) {
      show(`Order updated → ${status}`);
      router.refresh();
    } else {
      show("Failed to update order");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-[var(--line-c)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-zyro-blue";
  const labelClass = "mb-1.5 block font-mono-ui text-xs uppercase tracking-wider text-[var(--ink-soft)]";

  return (
    <div>
      <div className="mb-8 flex gap-1 border-b border-[var(--line-c)]">
        {(["products", "orders"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border-b-2 px-5 py-3 text-[13px] font-bold capitalize ${
              tab === t ? "border-zyro-blue text-[var(--ink)]" : "border-transparent text-[var(--ink-soft)]"
            }`}
          >
            {t === "products" ? `Products (${products.length})` : `Orders (${orders.length})`}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="font-display mb-4.5 text-2xl">Add Product</h2>
            <form onSubmit={onSubmit} className="space-y-3.5 rounded-2xl border border-[var(--line-c)] p-6">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={inputClass}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Badge</label>
                  <select
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">None</option>
                    <option>New</option>
                    <option>Best Seller</option>
                    <option>Sale</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Price ($)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Old Price (optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.oldPrice}
                    onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Product Image</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={onFileChange}
                  disabled={uploading}
                  className="w-full text-sm file:mr-3 file:rounded file:border-0 file:bg-zyro-black file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
                />
                {uploading && <p className="mt-1 text-xs text-[var(--ink-soft)]">Uploading...</p>}
                {preview && (
                  <div className="mt-3 relative h-32 w-28 overflow-hidden rounded-lg border border-[var(--line-c)]">
                    <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES_APPAREL.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggle(sizes, setSizes, s)}
                      className={`rounded-md border px-2.5 py-1.5 font-mono-ui text-xs font-bold ${
                        sizes.has(s) ? "border-zyro-black bg-zyro-black text-white" : "border-[var(--line-c)]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Colors</label>
                <div className="flex flex-wrap gap-2.5">
                  {Object.entries(COLOR_HEX).map(([name, hex]) => (
                    <button
                      type="button"
                      key={name}
                      title={name}
                      onClick={() => toggle(colors, setColors, name)}
                      className="h-7 w-7 rounded-full"
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
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full rounded bg-zyro-black py-3.5 text-sm font-bold text-white disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Product"}
              </button>
            </form>
          </div>

          <div>
            <h2 className="font-display mb-4.5 text-2xl">Catalog ({products.length})</h2>
            <div className="space-y-2.5">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-3.5 rounded-xl border border-[var(--line-c)] p-3">
                  <Image
                    src={productImageUrl(p.imageSeed, 100, 120, p.imageUrl)}
                    alt={p.name}
                    width={48}
                    height={58}
                    className="rounded-md object-cover"
                    unoptimized
                  />
                  <div className="flex-1">
                    <b className="block text-sm">{p.name}</b>
                    <span className="font-mono-ui text-xs text-[var(--ink-soft)]">
                      ${p.price.toFixed(2)} · {p.category}
                    </span>
                  </div>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="rounded border border-[var(--line-c)] px-3 py-1.5 text-xs font-bold text-red-500 hover:border-red-500"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div>
          <h2 className="font-display mb-4.5 text-2xl">All Orders ({orders.length})</h2>
          {!orders.length ? (
            <p className="py-12 text-center text-[var(--ink-soft)]">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="rounded-xl border border-[var(--line-c)] p-4.5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <b className="font-mono-ui text-[13px]">#{o.id.slice(-8).toUpperCase()}</b>
                      <span className="ml-2 text-xs text-[var(--ink-soft)]">
                        {new Date(o.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[var(--bg-alt)] px-2.5 py-1 font-mono-ui text-[11px] uppercase">
                        {o.paymentMethod === "cod" ? "COD" : "Card"}
                      </span>
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        className="rounded border border-[var(--line-c)] bg-[var(--surface)] px-2 py-1.5 text-xs font-bold"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <b className="font-mono-ui">${o.total.toFixed(2)}</b>
                    </div>
                  </div>
                  <div className="text-sm text-[var(--ink-soft)]">
                    {o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                  </div>
                  {o.shippingAddress && (
                    <div className="mt-2 text-xs text-[var(--ink-soft)]">
                      Ship to: {o.shippingAddress.name}, {o.shippingAddress.address},{" "}
                      {o.shippingAddress.city} {o.shippingAddress.zip}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
