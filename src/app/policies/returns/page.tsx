import type { Metadata } from "next";
import storeConfig from "@/config/store";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description: `Returns policy for ${storeConfig.name}. ${storeConfig.returns.windowDays}-day return window on all products.`,
};

export default function ReturnsPage() {
  const { returns } = storeConfig;

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-dark">Returns & Exchanges</h1>

        {/* Quick fact */}
        <div className="mt-8 rounded-xl border border-gray-100 bg-light p-6 text-center sm:inline-block sm:text-left">
          <p className="text-2xl font-bold text-primary">
            {returns.windowDays}-Day Return Window
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Hassle-free returns on all products
          </p>
        </div>

        {/* Full policy */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-dark">Return Policy</h2>
          <p className="mt-4 leading-relaxed text-gray-600">
            {returns.policy}
          </p>
        </div>

        <div className="mt-12">
          <Button href="/contact" variant="outline">
            Start a Return
          </Button>
        </div>
      </div>
    </div>
  );
}
