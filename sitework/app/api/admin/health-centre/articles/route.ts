import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { sanitizeArticleHtml, slugify } from "@/lib/health-cms";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  if (!(await isAdminAuthenticated())) return NextResponse.redirect(`${origin}/admin/login`, 303);
  const form = await request.formData();
  const id = String(form.get("id") || "").trim();
  const title = String(form.get("title") || "").trim();
  const slug = slugify(String(form.get("slug") || title));
  const excerpt = String(form.get("excerpt") || "").trim();
  const contentHtml = sanitizeArticleHtml(String(form.get("contentHtml") || "").trim());
  const statusValue = String(form.get("status") || "DRAFT");
  const status = statusValue === "PUBLISHED" || statusValue === "ARCHIVED" ? statusValue : "DRAFT";
  const categoryId = String(form.get("categoryId") || "").trim() || null;
  const authorName = String(form.get("authorName") || "Bridgecare Health Team").trim() || "Bridgecare Health Team";
  const featuredImageUrl = String(form.get("featuredImageUrl") || "").trim() || null;
  const featuredImageAlt = String(form.get("featuredImageAlt") || "").trim() || null;
  const seoTitle = String(form.get("seoTitle") || "").trim() || null;
  const metaDescription = String(form.get("metaDescription") || "").trim() || null;
  const isFeatured = form.get("isFeatured") === "on";
  const tagNames = String(form.get("tags") || "").split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 12);

  if (!title || !slug || !excerpt || !contentHtml) return NextResponse.redirect(`${origin}/admin/health-centre?error=invalid`, 303);

  try {
    const existing = id ? await prisma.healthArticle.findUnique({ where: { id } }) : null;
    const publishedAt = status === "PUBLISHED" ? existing?.publishedAt || new Date() : existing?.publishedAt || null;
    const article = id
      ? await prisma.healthArticle.update({ where: { id }, data: { title, slug, excerpt, contentHtml, status, categoryId, authorName, featuredImageUrl, featuredImageAlt, seoTitle, metaDescription, isFeatured, publishedAt } })
      : await prisma.healthArticle.create({ data: { title, slug, excerpt, contentHtml, status, categoryId, authorName, featuredImageUrl, featuredImageAlt, seoTitle, metaDescription, isFeatured, publishedAt } });

    await prisma.healthArticleTag.deleteMany({ where: { articleId: article.id } });
    for (const name of tagNames) {
      const tagSlug = slugify(name);
      if (!tagSlug) continue;
      const tag = await prisma.healthTag.upsert({ where: { slug: tagSlug }, update: { name }, create: { name, slug: tagSlug } });
      await prisma.healthArticleTag.create({ data: { articleId: article.id, tagId: tag.id } });
    }
    await prisma.adminAuditLog.create({ data: { action: id ? "UPDATE_HEALTH_ARTICLE" : "CREATE_HEALTH_ARTICLE", entity: "HealthArticle", entityId: article.id, details: { title, slug, status } } });
    return NextResponse.redirect(`${origin}/admin/health-centre?updated=1`, 303);
  } catch {
    return NextResponse.redirect(`${origin}/admin/health-centre?error=save`, 303);
  }
}
