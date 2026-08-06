import { BadgeCheck } from "lucide-react";
import { getReviewSummary } from "@/lib/reviews";
import { ReviewForm } from "./ReviewForm";

function stars(rating: number) {
  return <span className="review-stars" aria-label={`${rating} out of 5 stars`}>{"★".repeat(rating)}{"☆".repeat(5-rating)}</span>;
}

export async function ProductReviews({ productSlug, productName }: { productSlug: string; productName: string }) {
  const { reviews, count, average, distribution } = await getReviewSummary(productSlug);
  const structuredData = count ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    aggregateRating: { "@type": "AggregateRating", ratingValue: Number(average.toFixed(1)), reviewCount: count, bestRating: 5, worstRating: 1 },
  } : null;
  return (
    <>
    {structuredData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />}
    <section className="section product-reviews-section" id="reviews">
      <div className="container product-content-narrow">
        <div className="section-head review-section-head">
          <div><span className="eyebrow">Verified customer reviews</span><h2>What customers say about {productName}</h2><p>Genuine reviews are moderated before publication. Purchase verification is based on Bridgecare order records.</p></div>
          <div className="review-score"><strong>{count ? average.toFixed(1) : "—"}</strong>{count ? stars(Math.round(average)) : <span className="review-stars">☆☆☆☆☆</span>}<small>{count} approved review{count === 1 ? "" : "s"}</small></div>
        </div>
        <div className="review-layout">
          <div>
            <div className="rating-bars">
              {distribution.map(({rating,count: ratingCount}) => <div className="rating-bar" key={rating}><span>{rating}★</span><div><i style={{width: count ? `${(ratingCount/count)*100}%` : "0%"}} /></div><small>{ratingCount}</small></div>)}
            </div>
            <div className="review-list">
              {reviews.length ? reviews.map((review) => <article className="review-card" key={review.id}>
                <div className="review-card-top"><div>{stars(review.rating)}{review.title && <h3>{review.title}</h3>}</div>{review.verifiedPurchase && <span className="verified-badge"><BadgeCheck size={16}/> Verified Purchase</span>}</div>
                <p>{review.body}</p>
                {review.images.length > 0 && <div className="review-images">{review.images.map((image) => <span key={image.id}><img src={image.imageUrl} alt={image.altText || "Customer review image"} loading="lazy" /></span>)}</div>}
                {review.adminReply && <div className="review-reply"><strong>Bridgecare replied</strong><p>{review.adminReply}</p></div>}
                <footer><strong>{review.customerName}</strong>{review.city && <span>{review.city}</span>}<time dateTime={review.createdAt.toISOString()}>{review.createdAt.toLocaleDateString("en-NG", { year:"numeric", month:"short", day:"numeric" })}</time></footer>
              </article>) : <div className="review-empty"><h3>Be the first to review this product</h3><p>Share an honest review of your product, packaging, ordering and delivery experience.</p></div>}
            </div>
          </div>
          <ReviewForm productSlug={productSlug} productName={productName} />
        </div>
      </div>
    </section>
    </>
  );
}
