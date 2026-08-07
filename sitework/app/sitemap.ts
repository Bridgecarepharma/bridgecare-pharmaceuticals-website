import type { MetadataRoute } from "next";
import { getPublishedHealthArticles } from "@/lib/health-cms";

const pages = ["", "/about", "/products", "/products/aspivit", "/products/asfenositol", "/products/globivida", "/products/herbal-bitter-tea", "/cart", "/checkout", "/health-centre", "/quality-compliance", "/csr", "/news", "/contact", "/distributors", "/careers", "/faq", "/downloads", "/privacy-policy", "/terms", "/cookie-policy"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://bridgecarepharmang.com";
  const staticPages = pages.map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: path === "" ? 1 : .7 }));
  const healthArticles = await getPublishedHealthArticles();
  const articles = healthArticles.map((article) => ({ url: `${base}/health-centre/${article.slug}`, lastModified: new Date(article.updatedAt), changeFrequency: "monthly" as const, priority: .75 }));
  return [...staticPages, ...articles];
}
