"use client";

import { createContext, useContext, useRef, useState, ReactNode } from "react";

interface ToastContextValue {
  show: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show(msg: string) {
    setMessage(msg);
    setVisible(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), 2400);
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        className={`fixed bottom-6 left-1/2 z-[500] -translate-x-1/2 flex items-center gap-2 rounded-lg bg-zyro-black px-5 py-3.5 text-sm font-semibold text-white shadow-xl transition-all duration-300 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0 pointer-events-none"
        }`}
        role="status"
        aria-live="polite"
      >
        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-zyro-green" />
        <span>{message}</span>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
