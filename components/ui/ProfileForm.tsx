"use client";

import { useState } from "react";
import { useToast } from "@/components/providers/ToastContext";

export default function ProfileForm({
  initialName,
  initialEmail,
  initialPhone,
  initialShirtSize,
  initialAddress,
}: {
  initialName: string;
  initialEmail: string;
  initialPhone?: string;
  initialShirtSize?: string;
  initialAddress?: string;
}) {
  const { show } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: initialName,
    phone: initialPhone ?? "",
    shirtSize: initialShirtSize ?? "M",
    address: initialAddress ?? "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      show("Profile updated");
    } catch {
      show("Couldn't save changes — please try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-[var(--line-c)] bg-[var(--surface)] px-4 py-3.5 text-sm outline-none focus:border-zyro-blue";
  const labelClass = "mb-2 block font-mono-ui text-xs uppercase tracking-wider text-[var(--ink-soft)]";

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Full Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input value={initialEmail} disabled className={`${inputClass} opacity-60`} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+1 (555) 012-3344"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Shirt Size</label>
          <select
            value={form.shirtSize}
            onChange={(e) => setForm({ ...form, shirtSize: e.target.value })}
            className={inputClass}
          >
            {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Shipping Address</label>
        <textarea
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          rows={3}
          placeholder="221B Endurance Lane, Austin, TX 78701"
          className={inputClass}
        />
      </div>
      <button type="submit" disabled={saving} className="rounded bg-zyro-black px-6 py-3 text-sm font-bold text-white disabled:opacity-50">
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
