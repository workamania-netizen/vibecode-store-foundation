import type { Metadata } from "next";
import storeConfig from "@/config/store";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { organizationJsonLd } from "@/lib/json-ld";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: storeConfig.name,
    template: storeConfig.seo.titleTemplate,
  },
  description: storeConfig.seo.defaultDescription,
  metadataBase: new URL(storeConfig.seo.siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: storeConfig.name,
    images: [{ url: storeConfig.seo.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

/**
 * Generates inline CSS custom properties from the store config colors.
 * Change a color in store.ts and every component updates automatically.
 */
function getColorCSSVariables(): React.CSSProperties {
  return {
    "--color-primary": storeConfig.colors.primary,
    "--color-secondary": storeConfig.colors.secondary,
    "--color-accent": storeConfig.colors.accent,
    "--color-dark": storeConfig.colors.dark,
    "--color-light": storeConfig.colors.light,
  } as React.CSSProperties;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={getColorCSSVariables()}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
