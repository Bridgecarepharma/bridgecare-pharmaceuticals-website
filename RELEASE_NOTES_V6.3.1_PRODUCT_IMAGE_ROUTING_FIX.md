# Bridgecare v6.3.1 — Product Image Routing Fix

## Fixed
- Product detail images no longer persist from the previously visited product during client-side navigation.
- Globivida, Herbal Bitter Tea, Aspivit and AsFenositol now always remount with their own product image.
- Removed duplicate legacy static product-detail routes so `/products/[slug]` is the single source of truth.
- Added product-specific image cache keys and bypassed the image optimizer for the four hero pack images to prevent stale Netlify/browser image reuse.

## Test
1. Open `/products`.
2. Click Globivida, then Herbal Bitter Tea, then Aspivit without refreshing.
3. Confirm each page changes both text and pack image.
4. Repeat in a private/incognito window and on mobile.
