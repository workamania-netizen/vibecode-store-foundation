import storeConfig from "@/config/store";
import Button from "@/components/ui/Button";

export default function CTASection() {
  const freeShippingAmount = (
    storeConfig.shipping.freeShippingThreshold / 100
  ).toFixed(0);

  return (
    <section className="bg-dark px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready to Taste the Difference?
        </h2>
        <p className="mt-4 text-lg text-gray-300">
          Free shipping on orders over ${freeShippingAmount}. Order today and
          enjoy pure, raw Appalachian honey delivered to your door.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/products" size="lg">
            Shop Now
          </Button>
          <Button href="/contact" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-dark">
            Get in Touch
          </Button>
        </div>
      </div>
    </section>
  );
}
