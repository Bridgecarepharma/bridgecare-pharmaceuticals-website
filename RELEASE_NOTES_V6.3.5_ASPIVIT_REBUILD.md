# Bridgecare v6.3.5 — Aspivit Product Details Rebuild

Built from the reverted v6.2.0 source archive supplied on 7 August 2026.

## Changes
- Replaced the placeholder Aspivit record with a dedicated product record.
- Added the supplied Aspivit pack image as the top hero image.
- Added the supplied Aspivit information flyer below all written product details.
- Replaced the previous Aspivit page body with the supplied specifications, efficacy, benefits, product description, composition, suggested use, storage instructions, reasons to choose Aspivit, and warnings.
- Left AsFenositol, Globivida, and Herbal Bitter Tea unchanged.
- Preserved checkout, coupons, Health Centre, admin, and existing storefront functionality from the supplied baseline.

## Deployment
Extract the ZIP so `package.json`, `app`, `components`, `data`, and `public` are at repository root. Commit and push the extracted file changes. Then trigger a Netlify deploy without cache.
