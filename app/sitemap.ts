import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const paths = [
  "",
  "/about",
  "/products",
  "/products/aspivit",
  "/products/asfenositol",
  "/products/globivida",
  "/products/herbal-bitter-tea",
  "/cart",
  "/checkout",
  "/health-centre",
  "/quality-compliance",
  "/csr",
  "/news",
  "/contact",
  "/distributors",
  "/careers",
  "/faq",
  "/downloads",
  "/privacy-policy",
  "/terms",
  "/cookie-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://bridgecarepharmang.com";

  return paths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
