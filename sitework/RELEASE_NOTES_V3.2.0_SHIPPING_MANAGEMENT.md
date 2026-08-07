# Bridgecare v3.2.0 — Shipping Management

## Added
- Secure `/admin/shipping` page.
- Database-backed delivery zones and charges.
- Lagos: ₦3,500.
- South West: ₦4,000.
- South East (including South-South states): ₦5,500.
- Northern State (including Abuja and North-Central): ₦7,000.
- Admin control to enable or disable each delivery zone.
- Admin control for the free-delivery pack threshold.
- Public checkout API for current shipping charges.
- Checkout and Paystack totals now use the same database shipping configuration.
- Audit logs for shipping changes.

## Deployment
The Netlify build runs `prisma migrate deploy`, which creates the shipping tables automatically. After deployment, visit `/admin/shipping`.
