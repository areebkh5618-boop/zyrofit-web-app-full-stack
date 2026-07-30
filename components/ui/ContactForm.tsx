"use client";

import { useState } from "react";
import { useToast } from "@/components/providers/ToastContext";

export default function ContactForm() {
  const { show } = useToast();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      show("Message sent — we'll reply within 24 hours.");
      form.reset();
    } catch {
      show("Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-[var(--line-c)] bg-[var(--surface)] px-4 py-3.5 text-sm outline-none transition-colors focus:border-zyro-blue";
  const labelClass = "mb-2 block font-mono-ui text-xs uppercase tracking-wider text-[var(--ink-soft)]";

  return (
    <form onSubmit={onSubmit} className="space-y-4.5">
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Full Name</label>
          <input name="name" type="text" required placeholder="Your name" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input name="email" type="email" required placeholder="you@example.com" className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Subject</label>
        <select name="subject" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Select a topic
          </option>
          <option>Order Support</option>
          <option>Product Question</option>
          <option>Returns &amp; Exchanges</option>
          <option>Wholesale / Team Orders</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Message</label>
        <textarea name="message" required rows={5} placeholder="How can we help?" className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="btn-sweep w-full rounded bg-zyro-black py-4 text-sm font-bold text-white disabled:opacity-50"
      >
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
