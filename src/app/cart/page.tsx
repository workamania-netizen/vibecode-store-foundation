"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartItemRow from "@/components/cart/CartItem";
import storeConfig from "@/config/store";

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function CartPage() {
  const { items, isHydrated, totalPrice, clearCart } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function handleCheckout() {
    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productSlug: item.productSlug,
            variantSku: item.variantSku,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCheckoutError(data.error || "Checkout failed. Please try again.");
        setCheckoutLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setCheckoutError("Something went wrong. Please try again.");
      setCheckoutLoading(false);
    }
  }

  if (!isHydrated) {
    return (
      <div className="px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-gray-400">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <svg
            className="mx-auto h-16 w-16 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          <h1 className="mt-4 text-2xl font-bold text-dark">
            Your Cart is Empty
          </h1>
          <p className="mt-2 text-gray-500">
            Looks like you haven&apos;t added any honey yet.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-secondary"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost =
    totalPrice >= storeConfig.shipping.freeShippingThreshold
      ? 0
      : storeConfig.shipping.standardRate;
  const orderTotal = totalPrice + shippingCost;
  const amountToFreeShipping =
    storeConfig.shipping.freeShippingThreshold - totalPrice;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-dark">Shopping Cart</h1>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart items */}
          <div className="lg:col-span-2">
            {items.map((item) => (
              <CartItemRow
                key={`${item.productSlug}-${item.variantSku}`}
                item={item}
              />
            ))}

            <button
              type="button"
              onClick={clearCart}
              className="mt-4 text-sm text-gray-400 transition-colors hover:text-red-500"
            >
              Clear Cart
            </button>
          </div>

          {/* Order summary */}
          <div className="rounded-xl border border-gray-100 bg-light p-6 lg:sticky lg:top-24 h-fit">
            <h2 className="text-lg font-bold text-dark">Order Summary</h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-dark">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-dark">
                  {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-base">
                  <span className="font-bold text-dark">Total</span>
                  <span className="font-bold text-dark">
                    {formatPrice(orderTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Free shipping progress */}
            {amountToFreeShipping > 0 && (
              <p className="mt-4 rounded-lg bg-white p-3 text-center text-sm text-gray-600">
                Add {formatPrice(amountToFreeShipping)} more for{" "}
                <span className="font-semibold text-primary">free shipping</span>
              </p>
            )}

            {checkoutError && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
                {checkoutError}
              </p>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="mt-6 w-full rounded-lg bg-primary px-6 py-3 text-base font-medium text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {checkoutLoading ? "Redirecting..." : "Proceed to Checkout"}
            </button>

            <Link
              href="/products"
              className="mt-3 block text-center text-sm text-gray-500 transition-colors hover:text-primary"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
