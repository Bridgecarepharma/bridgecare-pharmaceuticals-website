import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ReviewForm, QuestionForm } from "./ProductCommunityForms";

function Stars({ rating }: { rating: number }) { return <span className="stars" aria-label={`${rating} out of 5 stars`}>{[1,2,3,4,5].map(v => <span key={v} className={v <= Math.round(rating) ? "on" : ""}>★</span>)}</span>; }

export async function ProductCommunitySection({ productSlug, productName }: { productSlug: string; productName: string }) {
  noStore();
  const configured = Boolean(process.env.DATABASE_URL);
  let reviews: any[] = []; let questions: any[] = [];
  if (configured) {
    try {
      [reviews, questions] = await Promise.all([
        prisma.productReview.findMany({ where: { productSlug, status: "APPROVED" }, orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }], take: 50 }),
        prisma.productQuestion.findMany({ where: { productSlug, status: "ANSWERED", answer: { not: null } }, orderBy: { answeredAt: "desc" }, take: 30 }),
      ]);
    } catch { reviews = []; questions = []; }
  }
  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const counts = [5,4,3,2,1].map(star => ({ star, count: reviews.filter(r => r.rating === star).length }));
  return <section className="section product-community" id="reviews-and-questions"><div className="container">
    <div className="community-heading"><span className="eyebrow">Customer experience</span><h2>Ratings, reviews & customer questions</h2><p>Read genuine customer feedback and answers from Bridgecare, or share your own experience and questions.</p></div>
    <div className="community-tabs-layout">
      <div className="community-main">
        <section className="community-card" id="reviews"><div className="community-card-heading"><div><h3>Customer ratings & reviews</h3><p>Reviews are moderated before publication. Verified Purchase appears only when we can match the order information.</p></div></div>
          <div className="rating-summary"><div className="rating-score"><strong>{reviews.length ? average.toFixed(1) : "—"}</strong><Stars rating={average}/><span>{reviews.length} approved review{reviews.length === 1 ? "" : "s"}</span></div><div className="rating-bars">{counts.map(row => <div key={row.star}><span>{row.star}★</span><i><b style={{ width: reviews.length ? `${(row.count/reviews.length)*100}%` : "0%" }}/></i><small>{row.count}</small></div>)}</div></div>
          <div className="review-list">{reviews.length ? reviews.map(review => <article className="review-card" key={review.id}><div className="review-top"><Stars rating={review.rating}/>{review.verifiedPurchase && <span className="verified-pill">✓ Verified Purchase</span>}</div>{review.title && <h4>{review.title}</h4>}<p>{review.body}</p><footer><strong>{review.customerName}</strong>{review.city && <span> · {review.city}</span>}<time dateTime={review.createdAt.toISOString()}> · {new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" }).format(review.createdAt)}</time></footer>{review.adminReply && <div className="bridgecare-reply"><strong>Bridgecare response</strong><p>{review.adminReply}</p></div>}</article>) : <div className="community-empty">No approved reviews yet. Be the first to share your experience.</div>}</div>
          <details className="community-disclosure"><summary>Write a review</summary><ReviewForm productSlug={productSlug} productName={productName}/></details>
        </section>

        <section className="community-card" id="questions"><div className="community-card-heading"><div><h3>Customer questions & answers</h3><p>Questions are reviewed by Bridgecare before an answer is published.</p></div></div>
          <div className="question-list">{questions.length ? questions.map(item => <article className="question-card" key={item.id}><h4>Q: {item.question}</h4><div className="answer"><strong>Bridgecare:</strong><p>{item.answer}</p></div><small>Asked by {item.customerName}</small></article>) : <div className="community-empty">No answered questions yet. Ask the first question about this product.</div>}</div>
          <details className="community-disclosure" open={!questions.length}><summary>Have a question about this product?</summary><QuestionForm productSlug={productSlug} productName={productName}/></details>
        </section>
      </div>
    </div>
  </div></section>;
}
