# Bridgecare v6.4.5 — Reviews, Ratings & Customer Questions

Built directly from the current source ZIP supplied after the official Bridgecare logo deployment.

## Customer-facing
- 1–5 star product ratings
- Average rating and 5★–1★ distribution
- Moderated customer reviews
- Verified Purchase badge when order number + email + product match a paid/fulfilled Bridgecare order
- Bridgecare replies to approved reviews
- Customer Questions & Answers
- Ask-a-question form with moderation
- Product-specific integration on Aspivit, AsFenositol, Globivida and Herbal Bitter Tea

## Admin
- `/admin/reviews-and-questions`
- Approve/reject/archive reviews
- Add Bridgecare replies
- Feature reviews
- Answer/archive customer questions

## Database recovery
The production database previously recorded failed duplicate migrations.
The Netlify build command intentionally runs:

`npm run db:recover:qna && npm run db:migrate:deploy && npm run build`

The recovery script resolves the known duplicate/failed review migrations before Prisma deploys the idempotent ProductQuestion migration.

## Protected areas
This release is based on the user's current source and does not replace:
- the official Bridgecare logo assets
- product pack/flyer assets
- `data/products.ts`
- checkout/shipping/coupon logic

Suggested commit:
`Add reviews ratings and customer questions v6.4.5`
