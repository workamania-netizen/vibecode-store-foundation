"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, type CartItem as CartItemType } from "@/context/CartContext";

interface CartItemProps {
  item: CartItemType;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 border-b border-gray-100 py-4">
      {/* Product image */}
      <Link
        href={`/products/${item.productSlug}`}
        className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-light"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <Link
              href={`/products/${item.productSlug}`}
              className="font-semibold text-dark hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
            <p className="text-sm text-gray-500">{item.variantName}</p>
          </div>
          <span className="font-semibold text-dark">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>

        {/* Quantity controls */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                updateQuantity(
                  item.productSlug,
                  item.variantSku,
                  item.quantity - 1
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition-colors hover:border-primary hover:text-primary"
              aria-label="Decrease quantity"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              </svg>
            </button>
            <span className="w-8 text-center text-sm font-medium text-dark">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                updateQuantity(
                  item.productSlug,
                  item.variantSku,
                  item.quantity + 1
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition-colors hover:border-primary hover:text-primary"
              aria-label="Increase quantity"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.productSlug, item.variantSku)}
            className="text-sm text-gray-400 transition-colors hover:text-red-500"
            aria-label={`Remove ${item.name} from cart`}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
