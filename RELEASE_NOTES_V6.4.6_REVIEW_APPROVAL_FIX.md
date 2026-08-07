# Bridgecare v6.4.6 — Review Approval Persistence Fix

Fixes admin reviews returning to Pending after approval.

## What changed
- Added explicit **Approve**, **Move to pending**, and **Reject** actions.
- `Save changes` still preserves the value chosen in the Status dropdown.
- Review status is validated server-side before Prisma update.
- Product page and admin caches are revalidated immediately after review moderation.

## Files changed
- `app/admin/reviews-and-questions/page.tsx`
- `app/admin/reviews/page.tsx`

## Not touched
- Prisma schema/migrations
- product details or images
- official Bridgecare logo
- checkout, Paystack, shipping, coupons, Health Centre

Suggested commit:
`Fix review approval persistence v6.4.6`
