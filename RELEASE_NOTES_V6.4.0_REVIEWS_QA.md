# Bridgecare v6.4.0 — Ratings, Reviews & Customer Questions

## Added
- Customer 1–5 star ratings and moderated written reviews on product pages.
- Verified Purchase badge when order number, email, paid order status and purchased product match.
- Rating average and 5-to-1 star distribution.
- Bridgecare admin replies to customer reviews.
- Customer Questions & Answers with admin moderation and approved Bridgecare answers.
- Admin workspace at `/admin/reviews-and-questions`.
- Submission rate limits and required moderation before public display.
- Safety notice directing medication interactions, pregnancy, side effects, diagnosis and urgent concerns to healthcare professionals.

## Database
- Reconciles the earlier ProductReview migration with the current Prisma schema.
- Adds ProductReviewImage and ProductQuestion.
- Netlify now runs `prisma migrate deploy` before the production build.
