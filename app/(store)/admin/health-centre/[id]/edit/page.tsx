import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { ArticleEditor } from "@/components/health/ArticleEditor";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit Health Article", robots: { index: false, follow: false } };

export default async function EditHealthArticlePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [article, categories] = await Promise.all([
    prisma.healthArticle.findUnique({ where: { id }, include: { tags: { include: { tag: true } } } }),
    prisma.healthCategory.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!article) notFound();
  return <section className="section admin-shell"><div className="container">
    <AdminNav />
    <div className="admin-heading"><div><span className="eyebrow">Health Centre CMS</span><h1>Edit article</h1><p>Update content, publication status and SEO settings.</p></div><Link className="button secondary" href="/admin/health-centre">Back to articles</Link></div>
    <form className="health-cms-form" action="/api/admin/health-centre/articles" method="post">
      <input type="hidden" name="id" value={article.id}/>
      <div className="health-cms-main">
        <label>Article title<input name="title" required maxLength={180} defaultValue={article.title}/></label>
        <label>URL slug<input name="slug" defaultValue={article.slug}/></label>
        <label>Short summary<textarea name="excerpt" rows={4} required maxLength={400} defaultValue={article.excerpt}/></label>
        <label>Article content<ArticleEditor defaultValue={article.contentHtml}/></label>
      </div>
      <aside className="health-cms-sidebar">
        <label>Status<select name="status" defaultValue={article.status}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select></label>
        <label>Category<select name="categoryId" defaultValue={article.categoryId || ""}><option value="">Uncategorised</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label>
        <label>Tags<input name="tags" defaultValue={article.tags.map(({ tag }) => tag.name).join(", ")}/></label>
        <label>Author<input name="authorName" defaultValue={article.authorName}/></label>
        <label>Featured image URL<input name="featuredImageUrl" type="url" defaultValue={article.featuredImageUrl || ""}/></label>
        <label>Image alt text<input name="featuredImageAlt" defaultValue={article.featuredImageAlt || ""}/></label>
        <label>SEO title<input name="seoTitle" maxLength={70} defaultValue={article.seoTitle || ""}/></label>
        <label>Meta description<textarea name="metaDescription" rows={4} maxLength={170} defaultValue={article.metaDescription || ""}/></label>
        <label className="shipping-toggle"><input name="isFeatured" type="checkbox" defaultChecked={article.isFeatured}/><span>Feature this article</span></label>
        <button className="button" type="submit">Save changes</button>
        <button className="button danger" type="submit" formAction="/api/admin/health-centre/articles/delete" formNoValidate>Delete article</button>
      </aside>
    </form>
  </div></section>;
}
