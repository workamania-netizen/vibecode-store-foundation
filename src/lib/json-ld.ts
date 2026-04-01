// ---------------------------------------------------------------------------
// JSON-LD structured data generators
// ---------------------------------------------------------------------------

import storeConfig from "@/config/store";
import type { Product } from "@/config/store";

const siteUrl = storeConfig.seo.siteUrl;

/**
 * Organization — injected in root layout.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: storeConfig.name,
    url: siteUrl,
    logo: `${siteUrl}/images/logo.svg`,
    description: storeConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: storeConfig.address.street,
      addressLocality: storeConfig.address.city,
      addressRegion: storeConfig.address.state,
      postalCode: storeConfig.address.zip,
      addressCountry: storeConfig.address.country,
    },
    telephone: storeConfig.phone,
    email: storeConfig.email,
    sameAs: [
      storeConfig.social.facebook,
      storeConfig.social.instagram,
      storeConfig.social.twitter,
      storeConfig.social.youtube,
    ].filter(Boolean),
  };
}

/**
 * LocalBusiness with Store type — used on homepage.
 */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: storeConfig.name,
    url: siteUrl,
    logo: `${siteUrl}/images/logo.svg`,
    image: `${siteUrl}${storeConfig.seo.ogImage}`,
    description: storeConfig.seo.defaultDescription,
    telephone: storeConfig.phone,
    email: storeConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: storeConfig.address.street,
      addressLocality: storeConfig.address.city,
      addressRegion: storeConfig.address.state,
      postalCode: storeConfig.address.zip,
      addressCountry: storeConfig.address.country,
    },
    openingHoursSpecification: storeConfig.hours
      .filter((h) => !h.closed)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.day,
        opens: h.open,
        closes: h.close,
      })),
    priceRange: "$$",
    foundingDate: String(storeConfig.foundedYear),
  };
}

/**
 * Product with Offer — used on product detail pages.
 */
export function productJsonLd(product: Product) {
  const lowestPrice = Math.min(...product.variants.map((v) => v.price));
  const highestPrice = Math.max(...product.variants.map((v) => v.price));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) =>
      img.startsWith("http") ? img : `${siteUrl}${img}`
    ),
    url: `${siteUrl}/products/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: storeConfig.name,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: (lowestPrice / 100).toFixed(2),
      highPrice: (highestPrice / 100).toFixed(2),
      offerCount: product.variants.length,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: storeConfig.name,
      },
    },
    sku: product.variants[0]?.sku,
  };
}

/**
 * BlogPosting — used on individual blog post pages.
 */
export function blogPostingJsonLd(post: {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: `${siteUrl}/blog/${post.slug}`,
    image: post.image
      ? post.image.startsWith("http")
        ? post.image
        : `${siteUrl}${post.image}`
      : undefined,
    author: {
      "@type": "Person",
      name: post.author || storeConfig.owner,
    },
    publisher: {
      "@type": "Organization",
      name: storeConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/images/logo.svg`,
      },
    },
  };
}

/**
 * BreadcrumbList — used on inner pages.
 */
export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}
