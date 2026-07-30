"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const looksLikeDbIssue = /MONGODB_URI|ECONNREFUSED|querySrv|JWT_SECRET|STRIPE_SECRET_KEY/i.test(error.message);

  return (
    <div className="mx-auto max-w-[640px] px-6 py-28 text-center">
      <h1 className="font-display text-[32px]">Something Went Wrong</h1>
      {looksLikeDbIssue ? (
        <p className="mt-3 text-[var(--ink-soft)]">
          This usually means an environment variable is missing. Copy <code className="font-mono-ui">.env.example</code>{" "}
          to <code className="font-mono-ui">.env.local</code>, fill in your MongoDB / Stripe / JWT values, and restart
          the dev server.
        </p>
      ) : (
        <p className="mt-3 text-[var(--ink-soft)]">{error.message || "An unexpected error occurred."}</p>
      )}
      <button onClick={reset} className="mt-7 rounded bg-zyro-black px-7 py-3.5 text-sm font-bold text-white">
        Try Again
      </button>
    </div>
  );
}
