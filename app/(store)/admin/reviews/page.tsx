import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Admin Reviews", robots: { index: false, follow: false } };

type SearchParams = Promise<{ status?: string; product?: string; saved?: string }>;

async function updateReview(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const requestedStatus = String(formData.get("status") || "PENDING");
  const quickAction = String(formData.get("reviewAction") || "");
  const statusMap = {
    approve: "APPROVED",
    pending: "PENDING",
    reject: "REJECTED",
    archive: "ARCHIVED",
  } as const;
  const status = (statusMap[quickAction as keyof typeof statusMap] ||
    (["PENDING", "APPROVED", "REJECTED", "ARCHIVED"].includes(requestedStatus) ? requestedStatus : "PENDING")) as
    "PENDING"|"APPROVED"|"REJECTED"|"ARCHIVED";
  const adminReply = String(formData.get("adminReply") || "").trim() || null;
  const isFeatured = formData.get("isFeatured") === "on";
  const [updated] = await prisma.$transaction([
    prisma.productReview.update({ where: { id }, data: { status, adminReply, isFeatured } }),
    prisma.adminAuditLog.create({ data: { action: "REVIEW_UPDATED", entity: "ProductReview", entityId: id, details: { status, isFeatured } } }),
  ]);
  revalidatePath("/admin/reviews");
  revalidatePath("/admin/reviews-and-questions");
  revalidatePath("/products");
  revalidatePath(`/products/${updated.productSlug}`);
}

export default async function AdminReviewsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const status = ["PENDING","APPROVED","REJECTED","ARCHIVED"].includes(params.status || "") ? params.status : undefined;
  const reviews = await prisma.productReview.findMany({
    where: { ...(status ? { status: status as "PENDING"|"APPROVED"|"REJECTED"|"ARCHIVED" } : {}), ...(params.product ? { productSlug: params.product } : {}) },
    include: { images: true }, orderBy: { createdAt: "desc" }, take: 200,
  });
  const counts = await prisma.productReview.groupBy({ by: ["status"], _count: { _all: true } });
  const countMap = Object.fromEntries(counts.map((item) => [item.status, item._count._all]));
  return <section className="section admin-shell"><div className="container"><AdminNav/>
    <div className="admin-heading"><div><span className="eyebrow">Customer trust</span><h1>Verified Reviews</h1><p>Moderate customer feedback and confirm purchase-backed reviews.</p></div></div>
    <div className="admin-kpi-grid"><article><span>Pending</span><strong>{countMap.PENDING || 0}</strong></article><article><span>Approved</span><strong>{countMap.APPROVED || 0}</strong></article><article><span>Rejected</span><strong>{countMap.REJECTED || 0}</strong></article><article><span>Total</span><strong>{Object.values(countMap).reduce((a,b)=>a+Number(b),0)}</strong></article></div>
    <div className="admin-filter-row"><a href="/admin/reviews">All</a><a href="/admin/reviews?status=PENDING">Pending</a><a href="/admin/reviews?status=APPROVED">Approved</a><a href="/admin/reviews?status=REJECTED">Rejected</a></div>
    <div className="admin-review-list">{reviews.length ? reviews.map((review) => <article className="admin-review-card" key={review.id}>
      <div className="admin-review-summary"><div><span className="review-stars">{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</span><h2>{review.title || review.productName}</h2><p>{review.body}</p><small>{review.customerName} · {review.customerEmail} · {review.city || "Location not supplied"}</small></div><div><strong>{review.status}</strong>{review.verifiedPurchase && <span className="verified-badge">Verified Purchase</span>}</div></div>
      <form action={updateReview} className="admin-review-form"><input type="hidden" name="id" value={review.id}/><label>Status<select name="status" defaultValue={review.status}><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option><option value="ARCHIVED">Archived</option></select></label><label>Bridgecare reply<textarea name="adminReply" rows={3} defaultValue={review.adminReply || ""}/></label><label className="checkbox-line"><input type="checkbox" name="isFeatured" defaultChecked={review.isFeatured}/> Feature this review</label><div className="review-admin-actions"><button className="button" type="submit">Save changes</button><button className="button" type="submit" name="reviewAction" value="approve">Approve</button><button className="button button-secondary" type="submit" name="reviewAction" value="pending">Move to pending</button><button className="button button-secondary" type="submit" name="reviewAction" value="reject">Reject</button></div></form>
    </article>) : <div className="notice">No reviews match this filter.</div>}</div>
  </div></section>;
}
