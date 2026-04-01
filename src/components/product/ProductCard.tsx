import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/config/store";

interface ProductCardProps {
  product: Product;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-light">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white px-4 py-1 text-sm font-medium text-gray-900">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-4">
        <h3 className="font-semibold text-dark group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.variants.length > 1 && (
            <span className="text-xs text-gray-400">
              {product.variants.length} sizes
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
