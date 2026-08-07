# Bridgecare v6.3.4 — Product Image Layout Correction

## Fixed
- Restored the original product pack images on the homepage, product cards, related products, and the top of each product page.
- Moved the four long product-information artworks to a dedicated **Complete product guide** section below the structured product details.
- Added separate image paths for pack artwork and detailed information artwork to prevent future mix-ups.
- Added new cache-version identifiers for both image types.

## Image structure
- Product pack images: `public/images/products/`
- Full product-information artworks: `public/images/product-details/`

## Deployment
Deploy without cache, then hard-refresh the homepage, `/products`, and each product page.
