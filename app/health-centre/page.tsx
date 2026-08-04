import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, CTA } from "@/components/Sections";
import { healthArticles } from "@/lib/healthArticles";

export const metadata: Metadata = {
  title: "Health Education Centre",
  description: "Practical, responsible health and wellness education from Bridgecare Pharmaceuticals.",
  alternates: { canonical: "/health-centre" },
};

export default function HealthCentrePage() {
  return (
    <>
      <PageHero eyebrow="Education first" title="Health Education Centre" text="Responsible health and wellness information designed to support informed conversations with qualified healthcare professionals." />
      <section className="section">
        <div className="container">
          <div className="article-grid">
            {healthArticles.map((article) => (
              <article className="article-card" key={article.slug}>
                <div className="article-card__meta"><span>{article.category}</span><span>{article.readTime}</span></div>
                <h2>{article.title}</h2>
                <p>{article.description}</p>
                <Link href={`/health-centre/${article.slug}`} className="btn btn-secondary">Read article</Link>
              </article>
            ))}
          </div>
          <p className="health-disclaimer"><strong>Medical disclaimer:</strong> This content is for general education only and is not a diagnosis or substitute for advice from a doctor, pharmacist or other qualified healthcare professional.</p>
        </div>
      </section>
      <CTA />
    </>
  );
}
