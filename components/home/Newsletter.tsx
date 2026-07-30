"use client";

import { useToast } from "@/components/providers/ToastContext";

export default function Newsletter() {
  const { show } = useToast();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    show("Subscribed! Check your inbox for 10% off.");
    e.currentTarget.reset();
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-zyro-black p-9 text-white sm:p-14">
      <div className="pointer-events-none absolute -right-[10%] -top-[40%] h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,rgba(57,255,20,0.25),transparent_70%)]" />
      <div className="relative flex flex-wrap items-center justify-between gap-7">
        <div>
          <h3 className="font-display text-[28px] sm:text-[38px]">Get 10% off your first order</h3>
          <p className="mt-2 text-sm text-[#aeb4bd]">Training tips, early drops, and athlete stories — straight to your inbox.</p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-wrap gap-2.5">
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="min-w-[240px] rounded border border-[#333] bg-[#1a1a1a] px-4.5 py-3.5 text-sm text-white outline-none focus:border-zyro-green"
          />
          <button type="submit" className="rounded bg-zyro-green px-7 py-3.5 text-sm font-bold text-zyro-black">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}
