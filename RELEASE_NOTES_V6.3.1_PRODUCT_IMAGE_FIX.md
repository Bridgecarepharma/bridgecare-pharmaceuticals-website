# Bridgecare v6.3.1 — Product Image Routing Fix

## Fixed
- Product detail pages now always load the image assigned to the current product slug.
- Product hero and related-product images bypass the Netlify/Next image transformation cache.
- Added unique cache-busting versions for Aspivit, Globivida, Herbal Bitter Tea and AsFenositol.
- Preserved Verified Reviews v6.3.0.

## Why
The page data and image filenames were correct, but transformed image responses were being reused incorrectly between product routes. Product detail images now use the original static assets directly.

## Test
Open each URL after deployment and hard-refresh:
- /products/aspivit
- /products/asfenositol
- /products/globivida
- /products/herbal-bitter-tea
