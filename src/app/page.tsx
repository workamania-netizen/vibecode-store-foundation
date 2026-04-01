import storeConfig from "@/config/store";
import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div>
      {/* Hero section — will be replaced by HeroSection component in Phase 2 */}
      <section className="bg-light px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-dark sm:text-5xl lg:text-6xl">
            {storeConfig.tagline}
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            {storeConfig.description}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/products" size="lg">
              Shop All Products
            </Button>
            <Button href="/about" variant="outline" size="lg">
              Our Story
            </Button>
          </div>
        </div>
      </section>

      {/* Placeholder sections — will be built out in Phase 2 */}
      <section className="px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-gray-400">
          Featured products, testimonials, and more coming in Phase 2.
        </p>
      </section>
    </div>
  );
}
