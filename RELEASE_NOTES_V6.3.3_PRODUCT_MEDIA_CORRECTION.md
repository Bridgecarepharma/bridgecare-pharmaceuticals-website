# Bridgecare v6.3.3 — Product Media Correction

Corrects the four public product-detail images using the approved artwork supplied for Aspivit, AsFenositol, Globivida and Bridgecare Herbal Bitter Tea.

## Root cause
The repository contained two different copies of each product image (`images/products` and `public/images/products`). Next.js serves `/images/products/...` from the `public` directory, while the prior update had inconsistent image files between those locations.

## Fix
- Replaced both copies with the correct approved artwork.
- Preserved the expanded v6.3.2 product-detail content.
- Bumped product image cache keys to v6.3.3.
