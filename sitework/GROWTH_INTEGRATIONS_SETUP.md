# Bridgecare Growth & SEO Integrations

## Netlify environment variables

Add these under Project configuration → Environment variables, then redeploy without cache:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — GA4 Measurement ID, e.g. `G-XXXXXXXXXX`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — HTML tag verification token from Google Search Console (token only)
- `NEXT_PUBLIC_CLARITY_PROJECT_ID` — Microsoft Clarity project ID
- `NEXT_PUBLIC_META_PIXEL_ID` — Meta Pixel numeric ID

All four are public browser identifiers. Do not put passwords or secret API keys in these variables.

## Google Analytics 4
1. Create/select a GA4 property.
2. Create a Web data stream for `https://bridgecarepharmang.com`.
3. Copy the Measurement ID beginning with `G-` into Netlify.
4. Redeploy and check Realtime while visiting the website.

## Google Search Console
1. Add `https://bridgecarepharmang.com` as a URL-prefix property, or use a Domain property through DNS.
2. For HTML tag verification, copy only the value in `content="..."` into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
3. Redeploy, then click Verify.
4. Submit `https://bridgecarepharmang.com/sitemap.xml`.

## Microsoft Clarity
1. Create a project for the production domain.
2. Copy its project ID into `NEXT_PUBLIC_CLARITY_PROJECT_ID`.
3. Redeploy and confirm recordings begin after real visits.

## Meta Pixel
1. Create/select a Pixel in Meta Events Manager.
2. Copy the numeric Pixel ID into `NEXT_PUBLIC_META_PIXEL_ID`.
3. Redeploy and verify PageView in Meta Pixel Helper/Test Events.

## Included SEO upgrades
- Canonical URLs and richer social sharing metadata
- Google verification metadata
- Organization/WebSite structured data
- Article structured data
- Expanded health education centre
- Article URLs included in sitemap
- Clear medical disclaimers on educational content
