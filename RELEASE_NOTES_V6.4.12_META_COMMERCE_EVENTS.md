# Bridgecare v6.4.12 — Meta Commerce Events

Adds explicit Meta standard ecommerce browser events:
- `ViewContent` on product detail pages.
- `AddToCart` when Add to cart or Buy now is used.
- `InitiateCheckout` when a populated checkout page opens.
- `Purchase` remains protected by server-side Paystack verification and duplicate browser protection from v6.4.11.

All monetary event parameters are sent in NGN. The existing Meta Pixel ID remains `2746017509129064` (environment override: `NEXT_PUBLIC_META_PIXEL_ID`).
