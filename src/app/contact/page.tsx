import type { Metadata } from "next";
import storeConfig from "@/config/store";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${storeConfig.name}. Questions about orders, wholesale inquiries, or custom gift sets — we'd love to hear from you.`,
};

export default function ContactPage() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact form */}
          <div>
            <h1 className="text-4xl font-bold text-dark">Get in Touch</h1>
            <p className="mt-4 text-gray-600">
              Have a question about our honey, need help with an order, or
              interested in wholesale? We&apos;d love to hear from you.
            </p>
            <div className="relative mt-8">
              <ContactForm />
            </div>
          </div>

          {/* Contact info sidebar */}
          <div className="lg:pl-8">
            <div className="rounded-xl border border-gray-100 bg-light p-8">
              <h2 className="text-xl font-bold text-dark">
                {storeConfig.name}
              </h2>

              <div className="mt-6 space-y-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                  </svg>
                  <address className="not-italic text-sm text-gray-600">
                    {storeConfig.address.street}<br />
                    {storeConfig.address.city}, {storeConfig.address.state}{" "}
                    {storeConfig.address.zip}
                  </address>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <a
                    href={`tel:${storeConfig.phone.replace(/[^\d+]/g, "")}`}
                    className="text-sm text-gray-600 transition-colors hover:text-primary"
                  >
                    {storeConfig.phone}
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <a
                    href={`mailto:${storeConfig.email}`}
                    className="text-sm text-gray-600 transition-colors hover:text-primary"
                  >
                    {storeConfig.email}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Store Hours
                </h3>
                <div className="mt-3 space-y-1">
                  {storeConfig.hours.map((h) => (
                    <div
                      key={h.day}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span>{h.day}</span>
                      <span>
                        {h.closed ? "Closed" : `${h.open} – ${h.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
