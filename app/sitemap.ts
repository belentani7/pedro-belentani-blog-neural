import { Metadata } from "next";

export default function sitemap() {
  const siteUrl = process.env.SITE_URL ?? "https://pedrobelentani.com";
  const baseUrl = siteUrl.replace(/\/$/, "");

  const articles = [
    { slug: "complejidad-legible", lastmod: new Date("2026-08-12") },
    { slug: "arte-web-robusto", lastmod: new Date("2026-08-12") },
    { slug: "creatividad-como-sistema", lastmod: new Date("2026-08-12") },
  ];

  const urls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...articles.map((article) => ({
      url: `${baseUrl}/articulos/${article.slug}`,
      lastModified: article.lastmod,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
  ];

  return urls;
}