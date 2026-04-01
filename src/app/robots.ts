import type { MetadataRoute } from "next";
import storeConfig from "@/config/store";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/order-confirmation"],
    },
    sitemap: `${storeConfig.seo.siteUrl}/sitemap.xml`,
  };
}
