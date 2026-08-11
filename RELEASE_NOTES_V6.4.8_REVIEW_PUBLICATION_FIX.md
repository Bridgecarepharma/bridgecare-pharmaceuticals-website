# Bridgecare v6.4.8 — Approved Review Publication Fix

## Why an approved review could still show as 0 publicly
There were two independent issues:

1. Reviews are product-specific. The review shown in the supplied admin screenshot is currently linked to
   `Bridgecare Herbal Bitter Tea®`. It will not appear on Aspivit, AsFenositol or Globivida unless reassigned.
2. The public product community component could be statically cached, so moderation changes were not guaranteed
   to appear immediately.

## Fixes
- Product review queries now opt out of Next.js static caching and read the current database state.
- Admin review moderation now has a **Product** selector.
- A review can be reassigned to the correct product before/after approval.
- Approve / Pending / Reject actions from v6.4.6 are retained.
- Both the old and new product routes are revalidated after reassignment.
- No Prisma migration is required.

## Files changed
- `components/product/ProductCommunitySection.tsx`
- `app/admin/reviews-and-questions/page.tsx`

## Not touched
- Prisma schema or migrations
- official Bridgecare logo
- product copy/images/flyers
- checkout, shipping, coupons, Health Centre

Suggested commit:
`Fix approved review publication and product assignment v6.4.8`
