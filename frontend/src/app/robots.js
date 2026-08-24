import { siteConfig } from "@/config/site";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: new URL("/sitemap.xml", siteConfig.siteUrl).toString(),
  };
}
