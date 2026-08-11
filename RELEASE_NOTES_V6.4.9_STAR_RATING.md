# Bridgecare v6.4.9 — Clickable Star Rating

Fixes the customer review star selector.

## Changes
- Stars now give clear visual feedback when clicked.
- Selected stars turn gold.
- Hover/focus previews the intended rating.
- The chosen value is announced as `X out of 5 stars selected`.
- Keyboard and screen-reader semantics improved with radio roles.
- Rating resets to 5 after a successful review submission.

## Files changed
- `components/product/ProductCommunityForms.tsx`
- `app/globals.css`

## No changes to
- Prisma/database/migrations
- review approval logic
- product content/images
- official logo
- checkout/shipping/coupons

Suggested commit:
`Fix clickable review star rating v6.4.9`
