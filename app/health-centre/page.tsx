import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, CTA } from "@/components/Sections";
import { getPublishedHealthArticles } from "@/lib/health-cms";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Health Education Centre",
  description: "Practical, responsible health and wellness education from Bridgecare Pharmaceuticals.",
  alternates: { canonical: "/health-centre" },
};

type SearchParams = Promise<{ q?: string; category?: string }>;
export default async function HealthCentrePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const articles = await getPublishedHealthArticles();
  const query = (params.q || "").trim().toLowerCase();
  const category = (params.category || "").trim();
  const filtered = articles.filter((article) => {
    const matchesQuery = !query || `${article.title} ${article.description} ${article.category} ${article.tags.join(" ")}`.toLowerCase().includes(query);
    const matchesCategory = !category || article.category === category;
    return matchesQuery && matchesCategory;
  });
  const categories = [...new Set(articles.map((article) => article.category))].sort();

  return <>
    <PageHero eyebrow="Education first" title="Bridgecare Health Centre" text="Responsible health and wellness information designed to support informed conversations with qualified healthcare professionals." />
    <section className="section"><div className="container">
      <form className="health-search" action="/health-centre" method="get">
        <label><span className="sr-only">Search health articles</span><input type="search" name="q" defaultValue={params.q || ""} placeholder="Search health and wellness articles" /></label>
        <label><span className="sr-only">Filter by category</span><select name="category" defaultValue={category}><option value="">All categories</option>{categories.map((name) => <option value={name} key={name}>{name}</option>)}</select></label>
        <button className="button" type="submit">Search</button>
      </form>
      <div className="article-grid">
        {filtered.map((article) => <article className="article-card" key={article.slug}>
          {article.featuredImageUrl && <img className="article-card__image" src={article.featuredImageUrl} alt={article.featuredImageAlt} />}
          <div className="article-card__meta"><span>{article.category}</span><span>{article.readTime}</span></div>
          <h2>{article.title}</h2><p>{article.description}</p>
          <Link href={`/health-centre/${article.slug}`} className="btn btn-secondary">Read article</Link>
        </article>)}
        {!filtered.length && <div className="empty-state"><h2>No articles found</h2><p>Try a different keyword or category.</p></div>}
      </div>
      <p className="health-disclaimer"><strong>Medical disclaimer:</strong> This content is for general education only and is not a diagnosis or substitute for advice from a doctor, pharmacist or other qualified healthcare professional.</p>
    </div></section>
    <CTA />
  </>;
}
