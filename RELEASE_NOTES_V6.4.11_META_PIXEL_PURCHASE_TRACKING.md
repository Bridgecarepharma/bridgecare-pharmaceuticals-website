# Bridgecare v6.4.11 — Meta Pixel + Verified Purchase Tracking

## What this release does
- Enables the Bridgecare Website Pixel (`2746017509129064`) across the site.
- Keeps `NEXT_PUBLIC_META_PIXEL_ID` configurable in Netlify, with the current Bridgecare Pixel ID as a safe public fallback.
- Fires Meta's standard `Purchase` event only after `/api/paystack/verify` confirms `paid: true`.
- Sends the real order value in NGN, purchased item IDs, quantities and item prices.
- Uses the Paystack reference as a deterministic Meta `eventID` for future browser/server deduplication.
- Stores a browser-side sent marker so refreshing the order-success page does not repeatedly fire the same Purchase event.
- Waits briefly for the Meta Pixel library if Paystack verification completes before `fbq` is ready.

## Files changed
- `components/analytics/MarketingAnalytics.tsx`
- `components/cart/OrderSuccessClient.tsx`
- `.env.example`

## Netlify
Recommended environment variable:
`NEXT_PUBLIC_META_PIXEL_ID=2746017509129064`

The Pixel ID is public by design; no Meta access token or secret is included in client code.

## Important
This release does not fire Purchase on product views, cart visits, checkout starts, or failed payments. Purchase is sent only after server-side Paystack verification reports the transaction as paid.

Suggested commit:
`Add Meta Pixel verified purchase tracking v6.4.11`
