"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/providers/ToastContext";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { show } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Something went wrong.");
        setLoading(false);
        return;
      }
      show(mode === "login" ? "Signed in — welcome back!" : "Account created — welcome to ZyroFit!");
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-[var(--line-c)] bg-[var(--surface)] px-4 py-3.5 text-sm outline-none focus:border-zyro-blue";
  const labelClass = "mb-2 block font-mono-ui text-xs uppercase tracking-wider text-[var(--ink-soft)]";

  return (
    <div className="mx-auto max-w-[440px] py-[70px]">
      <div className="mb-7.5 flex overflow-hidden rounded-lg border border-[var(--line-c)]">
        <Link
          href="/login"
          className={`flex-1 py-3.5 text-center text-[13px] font-bold ${
            mode === "login" ? "bg-zyro-black text-white" : "bg-[var(--bg-alt)]"
          }`}
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className={`flex-1 py-3.5 text-center text-[13px] font-bold ${
            mode === "register" ? "bg-zyro-black text-white" : "bg-[var(--bg-alt)]"
          }`}
        >
          Create Account
        </Link>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className={labelClass}>Full Name</label>
            <input name="name" type="text" required placeholder="Your name" className={inputClass} />
          </div>
        )}
        <div>
          <label className={labelClass}>Email</label>
          <input name="email" type="email" required placeholder="you@example.com" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder={mode === "register" ? "Create a password" : "••••••••"}
            className={inputClass}
          />
        </div>

        {error && <p className="text-sm font-semibold text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-sweep w-full rounded bg-zyro-black py-4 text-sm font-bold text-white disabled:opacity-50"
        >
          {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        <p className="text-center text-[13px] text-[var(--ink-soft)]">
          {mode === "login"
            ? "New to ZyroFit? Use the Create Account tab above."
            : "By signing up you agree to our Terms & Privacy Policy."}
        </p>
      </form>
    </div>
  );
}
