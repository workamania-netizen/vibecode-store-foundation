import type { Metadata } from "next";
import Image from "next/image";
import storeConfig from "@/config/store";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${storeConfig.name} — ${storeConfig.description}`,
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-light px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl lg:flex lg:items-center lg:gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-bold text-dark sm:text-5xl">
              About {storeConfig.name}
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              {storeConfig.description}
            </p>
          </div>
          <div className="mt-8 lg:mt-0 lg:w-1/2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/images/about.svg"
                alt={`About ${storeConfig.name}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-dark">Our Story</h2>
          <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
            <p>
              {storeConfig.name} was founded in {storeConfig.foundedYear} by{" "}
              {storeConfig.owner} in the beautiful Appalachian foothills of{" "}
              {storeConfig.address.city}, {storeConfig.address.state}. What
              started with just two backyard hives and a deep love for nature
              has grown into a thriving small apiary producing some of the
              finest raw honey in the region.
            </p>
            <p>
              We believe in doing things the right way — the slow way. Our
              honey is never heated above natural hive temperatures, never
              ultra-filtered, and never blended with imported honey. Every jar
              you buy from us was harvested, extracted, and packed by hand,
              right here on our farm.
            </p>
            <p>
              Our bees forage across hundreds of acres of Appalachian
              wildflowers, clover fields, and hardwood forests. The result is
              honey with complex, season-specific flavors you simply can&apos;t
              get from mass-produced store brands. We also create a line of
              infused honeys and beeswax products, using the same commitment
              to quality and simplicity.
            </p>
            <p>
              When you buy from {storeConfig.name}, you&apos;re supporting a
              small family farm, healthy pollinator populations, and the
              tradition of real, honest beekeeping.
            </p>
          </div>
        </div>
      </section>

      {/* Visit Us */}
      <section className="bg-light px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-dark">Visit Us</h2>
          <address className="mt-6 space-y-2 text-lg text-gray-600 not-italic">
            <p>{storeConfig.address.street}</p>
            <p>
              {storeConfig.address.city}, {storeConfig.address.state}{" "}
              {storeConfig.address.zip}
            </p>
            <p>
              <a
                href={`tel:${storeConfig.phone.replace(/[^\d+]/g, "")}`}
                className="text-primary hover:text-secondary transition-colors"
              >
                {storeConfig.phone}
              </a>
            </p>
          </address>

          {/* Hours */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-dark">Store Hours</h3>
            <div className="mt-4 inline-block text-left">
              {storeConfig.hours.map((h) => (
                <div
                  key={h.day}
                  className="flex justify-between gap-8 border-b border-gray-200 py-2 text-gray-600"
                >
                  <span className="font-medium">{h.day}</span>
                  <span>
                    {h.closed ? "Closed" : `${h.open} – ${h.close}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Button href="/contact">Get in Touch</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
