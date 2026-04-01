import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import storeConfig from "@/config/store";
import ProductGallery from "@/components/product/ProductGallery";
import VariantSelector from "@/components/product/VariantSelector";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return storeConfig.products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = storeConfig.products.find((p) => p.slug === slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description,
  };
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = storeConfig.products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const category = storeConfig.categories.find(
    (c) => c.slug === product.category
  );

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    ...(category
      ? [{ name: category.name, url: `/products?category=${category.slug}` }]
      : []),
    { name: product.name, url: `/products/${product.slug}` },
  ];

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(product)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems)),
        }}
      />
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/products" className="hover:text-primary transition-colors">
            Products
          </Link>
          {category && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/products?category=${category.slug}`}
                className="hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-dark">{product.name}</span>
        </nav>

        {/* Product layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold text-dark sm:text-4xl">
              {product.name}
            </h1>

            {category && (
              <p className="mt-2 text-sm font-medium text-primary">
                {category.name}
              </p>
            )}

            <p className="mt-4 text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Stock status */}
            {!product.inStock && (
              <p className="mt-4 inline-block rounded-full bg-gray-100 px-4 py-1 text-sm font-medium text-gray-600">
                Currently Sold Out
              </p>
            )}

            {/* Variant selector + price + add to cart */}
            <div className="mt-8">
              <VariantSelector product={product} />
            </div>

            {/* Shipping note */}
            <div className="mt-8 rounded-lg border border-gray-100 bg-light p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h.008M21 12.75V14.25m0 0h-3.375M3.375 14.25V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 011.123-.08m0 0A48.063 48.063 0 0112 3.75c2.082 0 4.135.095 6.15.28m-12.825-.177v.672c0 .568.422 1.048.987 1.106a48.6 48.6 0 0011.676 0c.565-.058.987-.538.987-1.106v-.672"
                  />
                </svg>
                <div className="text-sm">
                  <p className="font-medium text-dark">
                    Free shipping on orders over{" "}
                    {formatPrice(storeConfig.shipping.freeShippingThreshold)}
                  </p>
                  <p className="mt-1 text-gray-500">
                    {storeConfig.shipping.estimatedDays} delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Long description */}
        <div className="mt-16 border-t border-gray-100 pt-12">
          <h2 className="text-2xl font-bold text-dark">About This Product</h2>
          <p className="mt-4 max-w-3xl text-gray-600 leading-relaxed">
            {product.longDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
