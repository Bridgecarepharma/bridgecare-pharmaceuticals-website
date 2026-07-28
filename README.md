# Bridgecare Pharmaceuticals — Netlify Zero-Build Edition

This project intentionally does **not** use Next.js. It avoids the static-export/API-route conflict that caused the previous Netlify failures.

## Deploy

1. Upload this folder to a new GitHub repository or replace the contents of the existing repository.
2. Connect the repository to Netlify.
3. Netlify reads `netlify.toml`; no framework preset is required.
4. Add environment variable:
   - `PAYSTACK_SECRET_KEY=sk_test_...` while testing, then use the live key for production.
5. Deploy.

Expected build settings:
- Build command: `echo 'Bridgecare static site: no framework build required'`
- Publish directory: `site`
- Functions directory: `netlify/functions`

## Paystack

The secret key is only used inside Netlify Functions. The browser calls:
- `/api/paystack/initialize`
- `/api/paystack/verify`

Recommended webhook URL for future order automation:
`https://bridgecarepharmang.com/.netlify/functions/paystack-webhook`

## Important

Prices in `site/assets/js/store.js` are placeholders until Bridgecare confirms final retail prices and delivery fees.
