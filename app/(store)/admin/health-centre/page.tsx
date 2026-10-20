import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Health Centre CMS", robots: { index: false, follow: false } };
type SearchParams = Promise<{ updated?: string; deleted?: string; error?: string }>;

export default async function HealthCentreAdminPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const articles = await prisma.healthArticle.findMany({ include: { category: true }, orderBy: { updatedAt: "desc" } });
  const published = articles.filter((article) => article.status === "PUBLISHED").length;
  const drafts = articles.filter((article) => article.status === "DRAFT").length;

  return <section className="section admin-shell"><div className="container">
    <AdminNav />
    <div className="admin-heading admin-products-heading">
      <div><span className="eyebrow">Bridgecare publishing</span><h1>Health Centre</h1><p>Create, edit and publish responsible health education articles without changing code.</p></div>
      <div className="admin-heading-actions"><Link className="button secondary" href="/admin/health-centre/categories">Categories</Link><Link className="button" href="/admin/health-centre/new">New article</Link></div>
    </div>
    {params.updated === "1" && <div className="admin-success">Article saved successfully.</div>}
    {params.deleted === "1" && <div className="admin-success">Article deleted.</div>}
    {params.error && <div className="admin-alert">The article could not be saved. Check the required fields and try again.</div>}
    <div className="admin-kpi-grid health-cms-kpis">
      <article><span>Total articles</span><strong>{articles.length}</strong></article>
      <article><span>Published</span><strong>{published}</strong></article>
      <article><span>Drafts</span><strong>{drafts}</strong></article>
    </div>
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Article</th><th>Category</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead><tbody>
      {articles.map((article) => <tr key={article.id}>
        <td><strong>{article.title}</strong><br/><small>/{article.slug}</small></td>
        <td>{article.category?.name || "Uncategorised"}</td>
        <td><span className={`status-pill status-${article.status.toLowerCase()}`}>{article.status}</span></td>
        <td>{new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" }).format(article.updatedAt)}</td>
        <td><div className="table-actions"><Link href={`/admin/health-centre/${article.id}/edit`}>Edit</Link>{article.status === "PUBLISHED" && <Link href={`/health-centre/${article.slug}`} target="_blank">View</Link>}</div></td>
      </tr>)}
      {!articles.length && <tr><td colSpan={5}>No CMS articles yet. Create your first article.</td></tr>}
    </tbody></table></div>
  </div></section>;
}
