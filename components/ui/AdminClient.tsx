"use client";

import { useState } from "react";
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
  const [editId, setEditId] = useState<string | null>(null);

  function toggle(set: Set<string>, setter: (s: Set<string>) => void, value: string) {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    setter(next);
  }

  function startEdit(p: ProductDTO) {
    setEditId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      oldPrice: p.oldPrice != null ? String(p.oldPrice) : "",
      badge: p.badge || "",
      description: p.description,
    });
    setSizes(new Set(p.sizes.length ? p.sizes : ["M"]));
    setColors(new Set(p.colors.length ? p.colors : ["Black"]));
    const img = p.imageUrl || productImageUrl(p.imageSeed, 200, 250, p.imageUrl);
    setImageUrl(p.imageUrl || "");
    setPreview(img);
    setTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setImageUrl("");
    setPreview(null);
    setSizes(new Set(["M", "L"]));
    setColors(new Set(["Black"]));
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
    if (!editId && !imageUrl) {
      show("Please upload a product image");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null,
        badge: form.badge || null,
        description: form.description,
        sizes: Array.from(sizes),
        colors: Array.from(colors),
        ...(imageUrl
          ? { imageUrl, imageSeed: imageUrl }
          : {}),
      };

      const res = await fetch(editId ? `/api/products/${editId}` : "/api/products", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      show(editId ? "Product updated" : "Product created");
      cancelEdit();
      router.refresh();
    } catch (err) {
      show(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      show("Product deleted");
      if (editId === id) cancelEdit();
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
    "w-full rounded-lg border border-[var(--line-c)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-zyro-blue sm:px-4 sm:py-3";
  const labelClass = "mb-1.5 block font-mono-ui text-xs uppercase tracking-wider text-[var(--ink-soft)]";

  return (
    <div className="min-w-0">
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-[var(--line-c)] sm:mb-8">
        {(["products", "orders"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-[13px] font-bold capitalize sm:px-5 ${
              tab === t ? "border-zyro-blue text-[var(--ink)]" : "border-transparent text-[var(--ink-soft)]"
            }`}
          >
            {t === "products" ? `Products (${products.length})` : `Orders (${orders.length})`}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-10">
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-xl sm:text-2xl">
                {editId ? "Edit Product" : "Add Product"}
              </h2>
              {editId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded border border-[var(--line-c)] px-3 py-1.5 text-xs font-bold"
                >
                  Cancel edit
                </button>
              )}
            </div>
            <form onSubmit={onSubmit} className="space-y-3.5 rounded-2xl border border-[var(--line-c)] p-4 sm:p-6">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                <label className={labelClass}>Product Image {editId ? "(optional — leave to keep current)" : ""}</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={onFileChange}
                  disabled={uploading}
                  className="w-full max-w-full text-sm file:mr-3 file:rounded file:border-0 file:bg-zyro-black file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
                />
                <p className="mt-1 text-xs text-[var(--ink-soft)]">JPG / PNG / WEBP · max 2MB</p>
                {uploading && <p className="mt-1 text-xs text-[var(--ink-soft)]">Uploading...</p>}
                {preview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Preview" className="mt-3 h-32 w-28 rounded-lg border border-[var(--line-c)] object-cover" />
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
                {saving ? "Saving..." : editId ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>

          <div className="min-w-0">
            <h2 className="font-display mb-4.5 text-xl sm:text-2xl">Catalog ({products.length})</h2>
            <div className="space-y-2.5">
              {products.map((p) => (
                <div
                  key={p.id}
                  className={`flex flex-wrap items-center gap-3 rounded-xl border p-3 sm:flex-nowrap ${
                    editId === p.id ? "border-zyro-blue" : "border-[var(--line-c)]"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={productImageUrl(p.imageSeed, 100, 120, p.imageUrl)}
                    alt={p.name}
                    className="h-[58px] w-12 flex-shrink-0 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <b className="block truncate text-sm">{p.name}</b>
                    <span className="font-mono-ui text-xs text-[var(--ink-soft)]">
                      ${p.price.toFixed(2)} · {p.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="rounded border border-[var(--line-c)] px-3 py-1.5 text-xs font-bold hover:border-zyro-blue"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
                      className="rounded border border-[var(--line-c)] px-3 py-1.5 text-xs font-bold text-red-500 hover:border-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="min-w-0">
          <h2 className="font-display mb-4.5 text-xl sm:text-2xl">All Orders ({orders.length})</h2>
          {!orders.length ? (
            <p className="py-12 text-center text-[var(--ink-soft)]">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="rounded-xl border border-[var(--line-c)] p-4">
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <div>
                      <b className="font-mono-ui text-[13px]">#{o.id.slice(-8).toUpperCase()}</b>
                      <span className="ml-2 text-xs text-[var(--ink-soft)]">
                        {new Date(o.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
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
                  <div className="text-sm text-[var(--ink-soft)] break-words">
                    {o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                  </div>
                  {o.shippingAddress && (
                    <div className="mt-2 text-xs text-[var(--ink-soft)] break-words">
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
