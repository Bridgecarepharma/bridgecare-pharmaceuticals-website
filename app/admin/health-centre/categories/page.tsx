import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { ensureHealthCategories } from "@/lib/health-cms";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Health Article Categories", robots: { index: false, follow: false } };
type SearchParams = Promise<{ updated?: string; error?: string }>;

export default async function HealthCategoriesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  await ensureHealthCategories();
  const params = await searchParams;
  const categories = await prisma.healthCategory.findMany({ include: { _count: { select: { articles: true } } }, orderBy: { name: "asc" } });
  return <section className="section admin-shell"><div className="container">
    <AdminNav />
    <div className="admin-heading"><div><span className="eyebrow">Health Centre CMS</span><h1>Categories</h1><p>Organise articles into clear health and wellness topics.</p></div><Link className="button secondary" href="/admin/health-centre">Back to articles</Link></div>
    {params.updated === "1" && <div className="admin-success">Category saved.</div>}
    {params.error && <div className="admin-alert">The category could not be saved.</div>}
    <div className="health-category-layout">
      <form className="health-category-form" action="/api/admin/health-centre/categories" method="post">
        <h2>Add category</h2>
        <label>Name<input name="name" required /></label>
        <label>Slug<input name="slug" placeholder="generated-if-empty" /></label>
        <label>Description<textarea name="description" rows={4}/></label>
        <button className="button" type="submit">Save category</button>
      </form>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Category</th><th>Slug</th><th>Articles</th></tr></thead><tbody>{categories.map((category) => <tr key={category.id}><td><strong>{category.name}</strong><br/><small>{category.description}</small></td><td>{category.slug}</td><td>{category._count.articles}</td></tr>)}{!categories.length && <tr><td colSpan={3}>No categories yet.</td></tr>}</tbody></table></div>
    </div>
  </div></section>;
}
