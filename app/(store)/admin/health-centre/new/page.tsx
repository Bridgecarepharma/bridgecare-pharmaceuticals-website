import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { ArticleEditor } from "@/components/health/ArticleEditor";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { ensureHealthCategories } from "@/lib/health-cms";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New Health Article", robots: { index: false, follow: false } };

export default async function NewHealthArticlePage() {
  await requireAdmin();
  await ensureHealthCategories();
  const categories = await prisma.healthCategory.findMany({ orderBy: { name: "asc" } });
  return <section className="section admin-shell"><div className="container">
    <AdminNav />
    <div className="admin-heading"><div><span className="eyebrow">Health Centre CMS</span><h1>New article</h1><p>Save as a draft or publish immediately.</p></div><Link className="button secondary" href="/admin/health-centre">Back to articles</Link></div>
    <ArticleForm categories={categories} />
  </div></section>;
}

function ArticleForm({ categories }: { categories: { id: string; name: string }[] }) {
  return <form className="health-cms-form" action="/api/admin/health-centre/articles" method="post">
    <div className="health-cms-main">
      <label>Article title<input name="title" required maxLength={180} /></label>
      <label>URL slug <input name="slug" placeholder="generated-from-title-if-empty" /></label>
      <label>Short summary<textarea name="excerpt" rows={4} required maxLength={400} /></label>
      <label>Article content<ArticleEditor defaultValue={'<p>Start writing your article here.</p>\n<h2>What readers should know</h2>\n<p>Add clear, evidence-informed information.</p>\n<h2>Practical tips</h2>\n<ul><li>Add a helpful tip.</li></ul>'} /></label>
    </div>
    <aside className="health-cms-sidebar">
      <label>Status<select name="status" defaultValue="DRAFT"><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></label>
      <label>Category<select name="categoryId"><option value="">Uncategorised</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label>
      <label>Tags<input name="tags" placeholder="wellness, nutrition, family health" /></label>
      <label>Author<input name="authorName" defaultValue="Bridgecare Health Team" /></label>
      <label>Featured image URL<input name="featuredImageUrl" type="url" placeholder="https://..." /></label>
      <label>Image alt text<input name="featuredImageAlt" /></label>
      <label>SEO title<input name="seoTitle" maxLength={70} /></label>
      <label>Meta description<textarea name="metaDescription" rows={4} maxLength={170} /></label>
      <label className="shipping-toggle"><input name="isFeatured" type="checkbox"/><span>Feature this article</span></label>
      <button className="button" type="submit">Save article</button>
    </aside>
  </form>;
}
