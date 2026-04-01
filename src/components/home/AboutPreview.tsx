import Image from "next/image";
import storeConfig from "@/config/store";
import Button from "@/components/ui/Button";

export default function AboutPreview() {
  return (
    <section className="bg-light px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl lg:flex lg:items-center lg:gap-12">
        {/* Image */}
        <div className="lg:w-1/2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/images/about.svg"
              alt={`About ${storeConfig.name}`}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Text */}
        <div className="mt-8 lg:mt-0 lg:w-1/2">
          <h2 className="text-3xl font-bold text-dark sm:text-4xl">
            Our Story
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Since {storeConfig.foundedYear}, {storeConfig.owner} have been
            tending hives in the Appalachian foothills of {storeConfig.address.city},{" "}
            {storeConfig.address.state}. What started with two backyard hives
            has grown into a small family apiary producing some of the finest
            raw honey in the region.
          </p>
          <p className="mt-4 text-gray-600">
            Every jar is harvested, extracted, and packed by hand. We never
            heat our honey above natural hive temperatures, ensuring you get
            all the enzymes, pollen, and flavor nature intended.
          </p>
          <div className="mt-8">
            <Button href="/about" variant="outline">
              Learn More About Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
