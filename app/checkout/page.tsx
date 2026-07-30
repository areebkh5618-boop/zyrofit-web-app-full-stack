"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/providers/CartContext";

type PaymentMethod = "cod" | "card";

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CheckoutResponse {
  url?: string;
  orderId?: string;
  error?: string;
}

interface AccountResponse {
  user?: {
    name?: string;
    email?: string;
  };
  name?: string;
  email?: string;
}

const initialAddress: ShippingAddress = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "Pakistan",
};

export default function CheckoutPage() {
  const { items, subtotal, count } = useCart();

  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress>(initialAddress);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cod");

  const [submitting, setSubmitting] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [error, setError] = useState("");

  const shipping = subtotal > 75 ? 0 : 7.99;
  const total = subtotal + shipping;

  const formattedSubtotal = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(subtotal),
    [subtotal],
  );

  const formattedShipping =
    shipping === 0
      ? "Free"
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(shipping);

  const formattedTotal = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(total),
    [total],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadAccount() {
      try {
        const response = await fetch("/api/account", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as AccountResponse;
        const account = data.user ?? data;

        if (!cancelled) {
          setShippingAddress((current) => ({
            ...current,
            fullName: account.name ?? current.fullName,
            email: account.email ?? current.email,
          }));
        }
      } catch {
        // User can enter the details manually.
      } finally {
        if (!cancelled) {
          setLoadingAccount(false);
        }
      }
    }

    loadAccount();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(
    field: keyof ShippingAddress,
    value: string,
  ) {
    setShippingAddress((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateForm(): string | null {
    if (!shippingAddress.fullName.trim()) {
      return "Please enter your full name.";
    }

    if (!shippingAddress.email.trim()) {
      return "Please enter your email address.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        shippingAddress.email.trim(),
      )
    ) {
      return "Please enter a valid email address.";
    }

    if (!shippingAddress.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (!shippingAddress.address.trim()) {
      return "Please enter your complete address.";
    }

    if (!shippingAddress.city.trim()) {
      return "Please enter your city.";
    }

    if (!shippingAddress.postalCode.trim()) {
      return "Please enter your postal code.";
    }

    if (!shippingAddress.country.trim()) {
      return "Please enter your country.";
    }

    if (!items.length) {
      return "Your cart is empty.";
    }

    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            qty: item.qty,
            size: item.size,
            color: item.color,
            imageSeed: item.imageSeed,
          })),
          shippingAddress: {
            fullName: shippingAddress.fullName.trim(),
            email: shippingAddress.email.trim(),
            phone: shippingAddress.phone.trim(),
            address: shippingAddress.address.trim(),
            city: shippingAddress.city.trim(),
            postalCode: shippingAddress.postalCode.trim(),
            country: shippingAddress.country.trim(),
          },
          paymentMethod,
        }),
      });

      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok) {
        throw new Error(
          data.error ?? "Checkout failed. Please try again.",
        );
      }

      if (!data.url) {
        throw new Error(
          "Checkout URL was not returned by the server.",
        );
      }

      window.location.assign(data.url);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Checkout failed. Please try again.",
      );
      setSubmitting(false);
    }
  }

  if (!loadingAccount && items.length === 0) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="font-display text-4xl uppercase">
          Your cart is empty
        </h1>

        <p className="mt-3 text-[var(--ink-soft)]">
          Add products to your cart before proceeding to checkout.
        </p>

        <Link
          href="/shop"
          className="mt-7 rounded bg-zyro-black px-7 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-85"
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-9">
        <p className="font-mono-ui text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
          Secure checkout
        </p>

        <h1 className="mt-2 font-display text-4xl uppercase sm:text-5xl">
          Complete Your Order
        </h1>

        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Enter your delivery details and choose a payment method.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[1fr_420px]"
      >
        <div className="space-y-8">
          <section className="rounded-xl border border-[var(--line-c)] bg-[var(--bg)] p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zyro-black text-sm font-bold text-white">
                1
              </span>

              <h2 className="text-xl font-bold">
                Shipping Information
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <CheckoutField
                label="Full Name"
                type="text"
                value={shippingAddress.fullName}
                placeholder="Muhammad Areeb Khan"
                autoComplete="name"
                onChange={(value) =>
                  updateField("fullName", value)
                }
              />

              <CheckoutField
                label="Email Address"
                type="email"
                value={shippingAddress.email}
                placeholder="name@example.com"
                autoComplete="email"
                onChange={(value) => updateField("email", value)}
              />

              <CheckoutField
                label="Phone Number"
                type="tel"
                value={shippingAddress.phone}
                placeholder="+92 300 1234567"
                autoComplete="tel"
                onChange={(value) => updateField("phone", value)}
              />

              <CheckoutField
                label="City"
                type="text"
                value={shippingAddress.city}
                placeholder="Lahore"
                autoComplete="address-level2"
                onChange={(value) => updateField("city", value)}
              />

              <div className="sm:col-span-2">
                <CheckoutField
                  label="Complete Address"
                  type="text"
                  value={shippingAddress.address}
                  placeholder="House number, street, area"
                  autoComplete="street-address"
                  onChange={(value) =>
                    updateField("address", value)
                  }
                />
              </div>

              <CheckoutField
                label="Postal Code"
                type="text"
                value={shippingAddress.postalCode}
                placeholder="54000"
                autoComplete="postal-code"
                onChange={(value) =>
                  updateField("postalCode", value)
                }
              />

              <CheckoutField
                label="Country"
                type="text"
                value={shippingAddress.country}
                placeholder="Pakistan"
                autoComplete="country-name"
                onChange={(value) =>
                  updateField("country", value)
                }
              />
            </div>
          </section>

          <section className="rounded-xl border border-[var(--line-c)] bg-[var(--bg)] p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zyro-black text-sm font-bold text-white">
                2
              </span>

              <h2 className="text-xl font-bold">
                Payment Method
              </h2>
            </div>

            <div className="grid gap-4">
              <label
                className={`cursor-pointer rounded-lg border-2 p-5 transition-colors ${
                  paymentMethod === "cod"
                    ? "border-zyro-black bg-[var(--surface)]"
                    : "border-[var(--line-c)] hover:border-[var(--ink-soft)]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1 h-4 w-4 accent-black"
                  />

                  <div>
                    <p className="font-bold">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-sm text-[var(--ink-soft)]">
                      Pay in cash when your order is delivered.
                    </p>
                  </div>
                </div>
              </label>

              <label
                className={`cursor-pointer rounded-lg border-2 p-5 transition-colors ${
                  paymentMethod === "card"
                    ? "border-zyro-black bg-[var(--surface)]"
                    : "border-[var(--line-c)] hover:border-[var(--ink-soft)]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="mt-1 h-4 w-4 accent-black"
                  />

                  <div>
                    <p className="font-bold">
                      Credit or Debit Card
                    </p>

                    <p className="mt-1 text-sm text-[var(--ink-soft)]">
                      You will enter your card details securely on
                      the Stripe payment page.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-xl border border-[var(--line-c)] bg-[var(--bg)] p-5 sm:p-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-[var(--line-c)] pb-4">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <span className="text-sm text-[var(--ink-soft)]">
              {count} {count === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="max-h-[360px] space-y-4 overflow-y-auto py-5">
            {items.map((item, index) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}-${index}`}
                className="flex justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-[var(--ink-soft)]">
                    Size: {item.size} · Color: {item.color}
                  </p>

                  <p className="mt-1 text-xs text-[var(--ink-soft)]">
                    Quantity: {item.qty}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-bold">
                  $
                  {(item.price * item.qty).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-[var(--line-c)] pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--ink-soft)]">
                Subtotal
              </span>
              <span className="font-semibold">
                {formattedSubtotal}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[var(--ink-soft)]">
                Shipping
              </span>
              <span className="font-semibold">
                {formattedShipping}
              </span>
            </div>

            <div className="flex justify-between border-t border-[var(--line-c)] pt-4 text-lg">
              <span className="font-bold">Total</span>
              <span className="font-bold">{formattedTotal}</span>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || loadingAccount || !items.length}
            className="mt-6 w-full rounded bg-zyro-black px-6 py-4 text-sm font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Processing..."
              : paymentMethod === "cod"
                ? "Place COD Order"
                : "Continue to Card Payment"}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-[var(--ink-soft)]">
            By placing your order, you agree to the store terms
            and delivery policy.
          </p>

          <Link
            href="/cart"
            className="mt-4 block text-center text-sm font-semibold underline underline-offset-4"
          >
            Return to Cart
          </Link>
        </aside>
      </form>
    </main>
  );
}

interface CheckoutFieldProps {
  label: string;
  type: string;
  value: string;
  placeholder: string;
  autoComplete: string;
  onChange: (value: string) => void;
}

function CheckoutField({
  label,
  type,
  value,
  placeholder,
  autoComplete,
  onChange,
}: CheckoutFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">
        {label}
      </span>

      <input
        required
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-[var(--line-c)] bg-transparent px-4 py-3 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-soft)] focus:border-[var(--ink)]"
      />
    </label>
  );
}