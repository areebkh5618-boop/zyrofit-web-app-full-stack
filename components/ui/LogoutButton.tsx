"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/ToastContext";

export default function LogoutButton() {
  const router = useRouter();
  const { show } = useToast();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    show("Logged out");
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="ml-auto rounded border-[1.5px] border-[var(--ink)] px-5 py-2.5 text-sm font-bold transition-colors hover:bg-[var(--ink)] hover:text-[var(--bg)]"
    >
      Log Out
    </button>
  );
}
