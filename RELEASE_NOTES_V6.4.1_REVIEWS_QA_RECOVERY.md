# Bridgecare v6.4.1 — Reviews + Q&A Migration Recovery

This release repairs the failed Prisma migration chain and recreates the Reviews, Ratings & Customer Questions feature safely.

## Database recovery
- Keeps the existing Verified Reviews schema introduced by `20260806020000_verified_reviews`.
- Treats the duplicate failed migration `20260807010000_add_product_reviews` as already applied so Prisma stops blocking later migrations.
- Adds only the new `QuestionStatus` enum and `ProductQuestion` table in `20260807223000_product_questions_only`.
- Does not recreate or alter the existing ProductReview table.

## Build flow
Netlify runs:

`npm run db:recover:reviews && npm run db:migrate:deploy && npm run build`

The recovery helper is idempotent: if the duplicate migration is already marked applied, it continues normally.

## UI
- Ratings and review summary on product pages.
- Verified customer reviews.
- Customer Questions & Answers.
- Admin moderation for reviews and questions.

## Important
This patch intentionally does not include `data/products.ts` and does not change product images.
