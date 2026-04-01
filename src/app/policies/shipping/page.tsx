import type { Metadata } from "next";
import storeConfig from "@/config/store";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Shipping Information",
  description: `Shipping policy for ${storeConfig.name}. ${storeConfig.shipping.estimatedDays} delivery. Free shipping on orders over $${(storeConfig.shipping.freeShippingThreshold / 100).toFixed(0)}.`,
};

export default function ShippingPage() {
  const { shipping } = storeConfig;

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-dark">Shipping Information</h1>

        {/* Quick facts */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-light p-6 text-center">
            <p className="text-2xl font-bold text-primary">
              ${(shipping.standardRate / 100).toFixed(2)}
            </p>
            <p className="mt-1 text-sm text-gray-600">Standard Shipping</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-light p-6 text-center">
            <p className="text-2xl font-bold text-primary">FREE</p>
            <p className="mt-1 text-sm text-gray-600">
              Orders Over ${(shipping.freeShippingThreshold / 100).toFixed(0)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-light p-6 text-center">
            <p className="text-2xl font-bold text-primary">
              {shipping.estimatedDays}
            </p>
            <p className="mt-1 text-sm text-gray-600">Estimated Delivery</p>
          </div>
        </div>

        {/* Full policy */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-dark">Shipping Policy</h2>
          <p className="mt-4 leading-relaxed text-gray-600">
            {shipping.policy}
          </p>
        </div>

        <div className="mt-12">
          <Button href="/contact" variant="outline">
            Questions? Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}
