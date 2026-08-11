# Bridgecare v6.4.4 — Official Logo Patch

This patch uses the exact Bridgecare Pharmaceuticals Limited logo supplied by the user.

## Files changed
- `components/Header.tsx` — replaces the separate icon + recreated text with the official full logo.
- `app/globals.css` — sizes the official logo responsively in the header/footer.
- `public/images/brand/bridgecare-logo.png` — exact supplied official logo.
- `images/brand/bridgecare-logo.png` — matching source asset.

## Safety
This patch does NOT touch:
- Prisma or database migrations
- reviews / Q&A
- `data/products.ts`
- product details
- product images or flyers
- checkout, Paystack, shipping, coupons, admin, or Health Centre

## Install
Extract the ZIP into the repository root and allow these files to overwrite their matching paths.
Then commit and push to `main`.

Suggested commit:
`Use official Bridgecare Pharmaceuticals logo v6.4.4`
