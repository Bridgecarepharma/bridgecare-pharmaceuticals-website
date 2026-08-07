# Bridgecare v6.4.2 — Reviews & Q&A migration recovery

This patch repairs Prisma migration history without rebuilding the existing Verified Reviews schema.

## What changed
- Preserves the existing `ProductReview`, `ReviewImage`, and `ReviewStatus` database structures from the successful Verified Reviews release.
- Treats the two later duplicate/failed review migrations as resolved so Prisma can continue.
- Replaces the failed combined Reviews + Q&A migration with a new migration that adds only `QuestionStatus` and `ProductQuestion`.
- The new Q&A migration is guarded so an already-created `QuestionStatus` type or `ProductQuestion` table does not cause another duplicate-object error.
- No product data, product images, checkout, shipping, coupons, or Health Centre files are included in this patch.

## Deploy
Keep the Netlify command as:
`npm run db:recover:reviews && npm run db:migrate:deploy && npm run build`
