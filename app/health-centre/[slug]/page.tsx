import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHealthArticle, healthArticles } from "@/lib/healthArticles";

export function generateStaticParams() {
  return healthArticles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getHealthArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/health-centre/${article.slug}` },
    openGraph: { title: article.title, description: article.description, type: "article", publishedTime: article.publishedAt, modifiedTime: article.updatedAt },
  };
}

export default async function HealthArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getHealthArticle(slug);
  if (!article) notFound();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bridgecarepharmang.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: "Bridgecare Pharmaceuticals Limited" },
    publisher: { "@type": "Organization", name: "Bridgecare Pharmaceuticals Limited", logo: { "@type": "ImageObject", url: `${siteUrl}/icon.png` } },
    mainEntityOfPage: `${siteUrl}/health-centre/${article.slug}`,
  };

  return (
    <article className="section health-article">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container health-article__inner">
        <Link href="/health-centre" className="health-back">← Health Education Centre</Link>
        <div className="health-article__meta"><span>{article.category}</span><span>{article.readTime}</span></div>
        <h1>{article.title}</h1>
        <p className="health-article__intro">{article.description}</p>
        {article.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
        <aside className="health-disclaimer"><strong>Medical disclaimer:</strong> This article provides general educational information only. It does not diagnose, treat, cure or prevent disease and does not replace personalised advice from a qualified healthcare professional.</aside>
      </div>
    </article>
  );
}
