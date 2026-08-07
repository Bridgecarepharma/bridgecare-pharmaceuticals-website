import { revalidatePath } from "next/cache";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
  const adminReply = String(formData.get("adminReply") || "").trim().slice(0,1500) || null;
  const isFeatured = formData.get("isFeatured") === "on";
  const [updated] = await prisma.$transaction([
    prisma.productReview.update({ where: { id }, data: { status, adminReply, isFeatured } }),
    prisma.adminAuditLog.create({ data: { action: "REVIEW_UPDATED", entity: "ProductReview", entityId: id, details: { status, isFeatured } } }),
  ]);
  revalidatePath("/admin/reviews-and-questions");
  revalidatePath("/admin/reviews");
  revalidatePath("/products");
  revalidatePath(`/products/${updated.productSlug}`);
}

async function answerQuestion(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const answer = String(formData.get("answer") || "").trim().slice(0,3000);
  const status = String(formData.get("status") || (answer ? "ANSWERED" : "PENDING")) as "PENDING"|"ANSWERED"|"ARCHIVED";
  await prisma.$transaction([
    prisma.productQuestion.update({ where: { id }, data: { answer: answer || null, status, answeredAt: status === "ANSWERED" && answer ? new Date() : null } }),
    prisma.adminAuditLog.create({ data: { action: "PRODUCT_QUESTION_UPDATED", entity: "ProductQuestion", entityId: id, details: { status } } }),
  ]);
  revalidatePath("/admin/reviews-and-questions");
}

export default async function Page() {
  await requireAdmin();
  const configured = Boolean(process.env.DATABASE_URL);
  const [reviews, questions] = configured ? await Promise.all([
    prisma.productReview.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.productQuestion.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
  ]) : [[],[]];
  const pendingReviews = reviews.filter(r => r.status === "PENDING").length;
  const unanswered = questions.filter(q => q.status === "PENDING").length;
  return <section className="section admin-shell"><div className="container"><AdminNav/>
    <div className="admin-heading"><div><span className="eyebrow">Customer trust</span><h1>Reviews & product questions</h1><p>Moderate ratings and reviews, verify purchase-linked feedback, and answer customer product questions.</p></div></div>
    {!configured ? <div className="admin-alert">DATABASE_URL is not configured.</div> : <>
      <div className="admin-kpis"><article><span>Pending reviews</span><strong>{pendingReviews}</strong></article><article><span>Approved reviews</span><strong>{reviews.filter(r=>r.status === "APPROVED").length}</strong></article><article><span>Unanswered questions</span><strong>{unanswered}</strong></article></div>
      <div className="moderation-grid">
        <section><h2>Customer reviews</h2>{reviews.length ? reviews.map(review => <article className="admin-card moderation-card" key={review.id}><div className="moderation-head"><div><strong>{review.productName}</strong><span>{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</span></div><span className={`status-pill status-${review.status.toLowerCase()}`}>{review.status}</span></div><h3>{review.title || "Customer review"}</h3><p>{review.body}</p><small>{review.customerName} · {review.customerEmail}{review.verifiedPurchase ? " · Verified Purchase" : ""}</small><form action={updateReview} className="moderation-form"><input type="hidden" name="id" value={review.id}/><label>Status<select name="status" defaultValue={review.status}><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option><option value="ARCHIVED">Archived</option></select></label><label className="wide">Bridgecare reply<textarea name="adminReply" defaultValue={review.adminReply || ""} rows={3}/></label><label className="check"><input type="checkbox" name="isFeatured" defaultChecked={review.isFeatured}/> Feature review</label><div className="review-admin-actions"><button className="button" type="submit">Save changes</button><button className="button" type="submit" name="reviewAction" value="approve">Approve</button><button className="button button-secondary" type="submit" name="reviewAction" value="pending">Move to pending</button><button className="button button-secondary" type="submit" name="reviewAction" value="reject">Reject</button></div></form></article>) : <div className="admin-empty">No reviews yet.</div>}</section>
        <section><h2>Customer questions</h2>{questions.length ? questions.map(question => <article className="admin-card moderation-card" key={question.id}><div className="moderation-head"><strong>{question.productName}</strong><span className={`status-pill status-${question.status.toLowerCase()}`}>{question.status}</span></div><h3>{question.question}</h3><small>{question.customerName} · {question.customerEmail}</small><form action={answerQuestion} className="moderation-form"><input type="hidden" name="id" value={question.id}/><label>Status<select name="status" defaultValue={question.status}><option>PENDING</option><option>ANSWERED</option><option>ARCHIVED</option></select></label><label className="wide">Bridgecare answer<textarea name="answer" defaultValue={question.answer || ""} rows={5} placeholder="Provide an approved product-information answer. Avoid diagnosis or individualized medical advice."/></label><button className="button">Save answer</button></form></article>) : <div className="admin-empty">No customer questions yet.</div>}</section>
      </div>
    </>}
  </div></section>;
}
