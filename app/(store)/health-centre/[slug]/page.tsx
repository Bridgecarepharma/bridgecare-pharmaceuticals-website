import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedHealthArticle, getPublishedHealthArticles } from "@/lib/health-cms";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedHealthArticle(slug);
  if (!article) return {};
  return {
    title: article.seoTitle || article.title,
    description: article.metaDescription || article.description,
    alternates: { canonical: `/health-centre/${article.slug}` },
    openGraph: { title: article.seoTitle || article.title, description: article.metaDescription || article.description, type: "article", publishedTime: article.publishedAt, modifiedTime: article.updatedAt, images: article.featuredImageUrl ? [article.featuredImageUrl] : undefined },
  };
}

export default async function HealthArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedHealthArticle(slug);
  if (!article) notFound();
  const allArticles = await getPublishedHealthArticles();
  const related = allArticles.filter((item) => item.slug !== article.slug && item.category === article.category).slice(0, 3);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bridgecarepharmang.com";
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description,
    datePublished: article.publishedAt, dateModified: article.updatedAt,
    author: { "@type": "Organization", name: article.authorName },
    publisher: { "@type": "Organization", name: "Bridgecare Pharmaceuticals Limited", logo: { "@type": "ImageObject", url: `${siteUrl}/icon.png` } },
    mainEntityOfPage: `${siteUrl}/health-centre/${article.slug}`,
    image: article.featuredImageUrl || undefined,
  };

  return <article className="section health-article">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="container health-article__inner">
      <Link href="/health-centre" className="health-back">← Bridgecare Health Centre</Link>
      <div className="health-article__meta"><span>{article.category}</span><span>{article.readTime}</span></div>
      <h1>{article.title}</h1>
      <p className="health-article__intro">{article.description}</p>
      <div className="health-article__byline">By {article.authorName} · {new Intl.DateTimeFormat("en-NG", { dateStyle: "long" }).format(new Date(article.publishedAt))}</div>
      {article.featuredImageUrl && <img className="health-article__hero" src={article.featuredImageUrl} alt={article.featuredImageAlt} />}
      <div className="health-article__content" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
      {article.tags.length > 0 && <div className="health-tags">{article.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
      <aside className="health-disclaimer"><strong>Medical disclaimer:</strong> This article provides general educational information only. It does not diagnose, treat, cure or prevent disease and does not replace personalised advice from a qualified healthcare professional.</aside>
      {related.length > 0 && <section className="related-articles"><h2>Related articles</h2><div className="article-grid">{related.map((item) => <article className="article-card" key={item.slug}><div className="article-card__meta"><span>{item.category}</span><span>{item.readTime}</span></div><h3>{item.title}</h3><p>{item.description}</p><Link className="btn btn-secondary" href={`/health-centre/${item.slug}`}>Read article</Link></article>)}</div></section>}
      <div className="health-share"><strong>Share this article:</strong><a href={`https://wa.me/?text=${encodeURIComponent(`${article.title} ${siteUrl}/health-centre/${article.slug}`)}`} target="_blank" rel="noreferrer">WhatsApp</a><a href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`${article.description}\n\n${siteUrl}/health-centre/${article.slug}`)}`}>Email</a></div>
    </div>
  </article>;
}
