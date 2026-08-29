import { Metadata } from "next";

export default function robots() {
  const siteUrl = process.env.SITE_URL ?? "https://pedrobelentani.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/static/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}