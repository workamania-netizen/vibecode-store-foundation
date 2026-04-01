"use client";

import { useState } from "react";
import type { ProductVariant } from "@/config/store";

interface VariantSelectorProps {
  variants: ProductVariant[];
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function VariantSelector({ variants }: VariantSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = variants[selectedIndex];

  return (
    <div>
      {/* Variant dropdown */}
      <label htmlFor="variant-select" className="block text-sm font-medium text-gray-700">
        Size
      </label>
      <select
        id="variant-select"
        value={selectedIndex}
        onChange={(e) => setSelectedIndex(Number(e.target.value))}
        className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-dark shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
      >
        {variants.map((variant, i) => (
          <option key={variant.sku} value={i}>
            {variant.name} — {formatPrice(variant.price)}
          </option>
        ))}
      </select>

      {/* Selected price display */}
      <div className="mt-4">
        <span className="text-3xl font-bold text-primary">
          {formatPrice(selected.price)}
        </span>
      </div>

      {/* Add to cart button placeholder — wired up in Phase 4 */}
      <button
        type="button"
        className="mt-6 w-full rounded-lg bg-primary px-6 py-3 text-base font-medium text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
      >
        Add to Cart
      </button>
    </div>
  );
}
