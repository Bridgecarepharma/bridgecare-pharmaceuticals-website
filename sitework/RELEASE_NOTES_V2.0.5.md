# Bridgecare v2.0.5 — Inventory Management

## Added
- Protected admin inventory page at `/admin/inventory`.
- Stock levels, SKUs, reorder levels, and low-stock warnings.
- Add, remove, and set-exact-stock actions with movement history.
- Automatic inventory records for the four current Bridgecare products.
- Checkout stock validation when PostgreSQL is enabled.
- Automatic stock deduction after the first verified Paystack `charge.success` event.
- Duplicate webhooks do not deduct stock twice.

## Deployment
Add `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` to Netlify, deploy, then run `npm run db:deploy` once. Set opening stock from `/admin/inventory` before enabling database-backed checkout.
