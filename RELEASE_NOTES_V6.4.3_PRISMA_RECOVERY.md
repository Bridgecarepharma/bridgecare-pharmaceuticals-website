# Bridgecare v6.4.3 — Prisma Reviews/Q&A Recovery

This patch repairs production migration history before applying the Q&A-only migration.

## What it does
- Resolves the legacy duplicate reviews migration as applied if needed.
- Resolves the failed `20260807220000_reviews_and_questions` migration as applied.
- Applies the separate idempotent `20260807230000_product_questions_only` migration.
- Preserves the existing ProductReview/ProductReviewImage/ReviewStatus schema.
- Adds ProductQuestion/QuestionStatus support to Prisma schema.

## Netlify build command
`npm run db:recover:qna && npm run db:migrate:deploy && npm run build`

After one successful production deploy, the recovery command can remain in place safely because it tolerates already-resolved migrations.
