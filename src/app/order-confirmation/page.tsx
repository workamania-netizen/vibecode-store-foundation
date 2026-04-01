"use client";

import { Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import storeConfig from "@/config/store";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const hasClearedRef = useRef(false);

  // Clear cart once on mount when we have a valid session_id
  useEffect(() => {
    if (sessionId && !hasClearedRef.current) {
      hasClearedRef.current = true;
      clearCart();
    }
  }, [sessionId, clearCart]);

  if (!sessionId) {
    return (
      <div className="px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold text-dark">No Order Found</h1>
          <p className="mt-2 text-gray-500">
            This page is shown after a successful checkout. If you placed an
            order, check your email for confirmation.
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

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        {/* Success icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-dark">
          Thank You for Your Order!
        </h1>
        <p className="mt-4 text-gray-600">
          Your order has been placed successfully. We&apos;ll send a
          confirmation email with your order details shortly.
        </p>

        {/* What happens next */}
        <div className="mt-8 rounded-xl border border-gray-100 bg-light p-6 text-left">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            What Happens Next
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                1
              </span>
              <span>
                You&apos;ll receive an order confirmation email at the address
                you provided during checkout.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                2
              </span>
              <span>
                We&apos;ll hand-pack your order with care and ship it via USPS
                Priority Mail within 1 business day.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                3
              </span>
              <span>
                Expect delivery in {storeConfig.shipping.estimatedDays}.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-secondary"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border-2 border-gray-200 px-6 py-3 font-medium text-gray-600 transition-colors hover:border-primary hover:text-primary"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-gray-400">Loading order details...</p>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
