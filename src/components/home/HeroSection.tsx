import Image from "next/image";
import storeConfig from "@/config/store";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-light">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:flex lg:items-center lg:gap-12 lg:px-8 lg:py-28">
        {/* Text content */}
        <div className="text-center lg:w-1/2 lg:text-left">
          <h1 className="text-4xl font-bold text-dark sm:text-5xl lg:text-6xl">
            {storeConfig.tagline}
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            {storeConfig.description}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <Button href="/products" size="lg">
              Shop All Products
            </Button>
            <Button href="/about" variant="outline" size="lg">
              Our Story
            </Button>
          </div>
        </div>

        {/* Hero image */}
        <div className="mt-12 lg:mt-0 lg:w-1/2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/images/hero.svg"
              alt={`${storeConfig.name} — ${storeConfig.tagline}`}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
