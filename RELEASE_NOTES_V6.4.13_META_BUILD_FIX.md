# Bridgecare v6.4.13 — Meta Commerce Events Build Fix

## What caused the Netlify error
The v6.4.12 package applied Meta tracking changes to both:
- the real application root, and
- the duplicate `sitework/` backup/source copy.

`sitework/components/product/PremiumProductPage.tsx` then imported
`./ProductCommunitySection`, but that component does not exist in the original
`sitework/components/product/` folder. Netlify TypeScript checks that duplicate
tree and failed before deployment.

## Fix
- Restored the entire `sitework/` directory to the exact state from the user's
  latest uploaded source.
- Kept all v6.4.12 Meta ecommerce tracking in the actual application root only.
- No database, Prisma, review, logo, product-detail, image, checkout-flow, or
  shipping changes were added by this recovery release.

## Meta events retained in the live app
- PageView
- ViewContent
- AddToCart
- InitiateCheckout
- Purchase after successful Paystack verification

Suggested commit:
`Fix Meta tracking build by restoring sitework v6.4.13`
