import { prisma } from "@/lib/prisma";
import { healthArticles as legacyArticles } from "@/lib/healthArticles";


const DEFAULT_HEALTH_CATEGORIES = [
  ["Women’s Wellness", "womens-wellness"],
  ["Blood Sugar Support", "blood-sugar-support"],
  ["Nerve Wellness", "nerve-wellness"],
  ["Heart Health", "heart-health"],
  ["Nutrition", "nutrition"],
  ["Healthy Living", "healthy-living"],
  ["Bridgecare News", "bridgecare-news"],
] as const;

export async function ensureHealthCategories() {
  await Promise.all(DEFAULT_HEALTH_CATEGORIES.map(([name, slug]) =>
    prisma.healthCategory.upsert({ where: { slug }, update: { name }, create: { name, slug } }),
  ));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export function sanitizeArticleHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+\s*=\s*(["']).*?\1/gi, "")
    .replace(/javascript:/gi, "");
}

export function estimateReadingTime(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

export async function getPublishedHealthArticles() {
  const legacy = legacyArticles.map((article) => ({
    id: article.slug,
    slug: article.slug,
    title: article.title,
    description: article.description,
    category: article.category,
    readTime: article.readTime,
    contentHtml: article.sections.map((section) => `<section><h2>${section.heading}</h2>${section.paragraphs.map((p) => `<p>${p}</p>`).join("")}</section>`).join(""),
    featuredImageUrl: null as string | null,
    featuredImageAlt: article.title,
    authorName: "Bridgecare Health Team",
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    seoTitle: null as string | null,
    metaDescription: null as string | null,
    tags: [] as string[],
    isFeatured: false,
    source: "legacy" as const,
  }));

  try {
    const rows = await prisma.healthArticle.findMany({
      where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
      include: { category: true, tags: { include: { tag: true } } },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    });
    const cms = rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.excerpt,
      category: row.category?.name || "Healthy Living",
      readTime: estimateReadingTime(row.contentHtml),
      contentHtml: row.contentHtml,
      featuredImageUrl: row.featuredImageUrl,
      featuredImageAlt: row.featuredImageAlt || row.title,
      authorName: row.authorName,
      publishedAt: (row.publishedAt || row.createdAt).toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      seoTitle: row.seoTitle,
      metaDescription: row.metaDescription,
      tags: row.tags.map(({ tag }) => tag.name),
      isFeatured: row.isFeatured,
      source: "cms" as const,
    }));
    const cmsSlugs = new Set(cms.map((article) => article.slug));
    return [...cms, ...legacy.filter((article) => !cmsSlugs.has(article.slug))];
  } catch {
    return legacy;
  }
}

export async function getPublishedHealthArticle(slug: string) {
  const articles = await getPublishedHealthArticles();
  return articles.find((article) => article.slug === slug);
}
