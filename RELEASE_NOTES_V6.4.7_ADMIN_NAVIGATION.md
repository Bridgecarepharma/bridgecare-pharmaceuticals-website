# Bridgecare v6.4.7 — Admin Navigation + Footer Login

## What changed
- Added an **Admin Login** button to the public website footer.
- Admin Login opens `/admin/login`.
- Reworked the admin menu into a clear responsive navigation card.
- Added spacing between admin navigation items.
- Added active-page highlighting.
- Added a dedicated Sign out button.
- Added a View storefront shortcut.
- Desktop: horizontal structured navigation.
- Tablet: scroll-safe navigation.
- Mobile: two-column admin menu with full-width Sign out.

## Files changed
- `components/Footer.tsx`
- `components/admin/AdminNav.tsx`
- `app/globals.css`

## Not touched
- Prisma schema or migrations
- Reviews / Q&A database logic
- Product data
- Product images/flyers
- Official Bridgecare logo
- Checkout, Paystack, shipping, coupons, Health Centre

Suggested commit:
`Add admin footer login and fix admin navigation v6.4.7`
