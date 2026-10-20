# Standalone Bridgecare product verification

## What changes immediately on deployment

`/verify` has its own page layout: Bridgecare name, code form, a result pop-up, verification reminders and telephone support only. It has no store navigation, footer links, cart, prices, sales chat, marketing analytics or advertising pixels. Existing QR codes and the existing POST `/api/verify` endpoint continue to work. Codes, batches, admin records, rate limiting and verification rules are unchanged. Batch dates remain available internally and expired or inactive packs still trigger a warning, but these dates and batch numbers are not returned to customers. No database migration is needed for this layout change (the earlier stockist migrations remain in this package).

## Connect the separate address

Use the same existing Netlify project; do not create another database or website project.

1. Deploy this source through the existing GitHub-connected Netlify project.
2. In that project's domain management, add `verify.bridgecarepharmang.com` as an additional custom domain/domain alias. Keep `bridgecarepharmang.com` as the storefront domain. Do not configure the verification alias to redirect to the primary domain.
3. In Cloudflare DNS, add a CNAME named `verify` pointing to the exact existing Netlify site's `your-site-name.netlify.app` hostname shown by Netlify. Use DNS-only while validating the domain and issuing HTTPS. Do not invent a Netlify hostname or change the root/www records.
4. Wait for Netlify to confirm the domain and provision HTTPS. Open `https://verify.bridgecarepharmang.com/`. Confirm the form loads and no store menu or prices appear. Visiting `/products`, `/cart`, `/contact` or `/admin` on this hostname should return to the verification home. The main storefront remains available on the main hostname.
5. Only after that works, add the Netlify environment variable `VERIFICATION_SITE_URL=https://verify.bridgecarepharmang.com` to the production deploy context and trigger a new production deployment. Do not change `NEXT_PUBLIC_SITE_URL`: that remains the main storefront address.
6. The old sticker URL `https://bridgecarepharmang.com/verify` now redirects to the separate address. Existing printed QR codes and previously generated code CSVs do not need replacement.

Until step 5, the old address stays on the standalone verification page itself. This prevents a redirect to an unconfigured domain. Redirects are temporary (307) so they can be reversed by removing the variable and redeploying. Requests containing code values in query strings are not forwarded; customers type the concealed code into the form and it is sent by POST.

## Verify after deployment

- Check main site shopping and admin sign-in still work on the main domain.
- Check the old QR URL and new subdomain on a phone.
- Use a dedicated test batch/code for any end-to-end code check: a first successful check changes verification history. Do not test a retail pack's unused code.
- Verify first-check, repeat-check and invalid-code responses, and telephone support. No production code checks were performed during source preparation.
- This page separates verification from shopping; it does not stop someone independently visiting the main website.

This package has been prepared locally. It does not itself change Cloudflare, Netlify domain settings or the live deployment.

## Validation performed

Production build and changed-file lint passed. Eight automated tests cover existing verification/stockist behavior, standalone markup, host routing, redirect fallback and blocking shopping/admin routes on the verification hostname. Database migrations and stockist import records are unchanged. The verification API now returns the check count instead of exposing batch, manufacturing and expiry details.

## Customer result presentation

The result is a native accessible modal with an OK button, close button and Escape support. Recognised and repeat-check results include product name, first-verification time in Africa/Lagos and total successful checks including the current check. Invalid codes show no product or check history. Expired and inactive records retain their warnings without exposing batch or date fields. The page uses Bridgecare styling and does not claim a security code alone proves a pack is genuine. Existing scratch codes remain 24 characters, not the 16-digit format of the supplied visual reference.
