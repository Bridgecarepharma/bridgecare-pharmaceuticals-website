# Bridgecare v2.1.0 — Paystack Payment-Link Launch

This release simplifies the store for immediate deployment on Netlify.

## Changes
- Product Buy Now buttons open the approved Paystack payment links.
- Added a combined-order payment option for mixed or bulk orders.
- Removed database-backed order APIs, Paystack secret-key integration, Prisma build steps, and admin runtime pages.
- Netlify now requires only the public site URL and contact email variables.
- Checkout routes customers to the simplified order page.

## Netlify environment variables
- NEXT_PUBLIC_SITE_URL=https://bridgecarepharmang.com
- NEXT_PUBLIC_CONTACT_EMAIL=info@bridgecarepharmang.com

No DATABASE_URL or PAYSTACK_SECRET_KEY is required for this release.
