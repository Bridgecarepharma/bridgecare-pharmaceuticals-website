# Bridgecare v2.0.5.1 — Admin Authentication Build Fix

## Fixed

- Restored the `requireAdmin` export used by the admin dashboard, orders, and customer pages.
- Restored the `verifyAdminSessionToken` export used by the admin order API.
- Kept backward-compatible aliases used by the inventory module:
  - `createAdminToken`
  - `verifyAdminToken`
  - `isAdminAuthenticated`
- Standardized all admin routes on one signed cookie name: `bridgecare_admin`.
- Restored the admin dashboard, orders, customer pages, admin formatting helper, and order update API to the release package.
- Merged the v2.0.3 webhook-event and v2.0.4 admin-dashboard Prisma models with the v2.0.5 inventory models.
- Restored the v2.0.3 and v2.0.4 migrations alongside the inventory migration.
- Added Inventory to the admin navigation.

## Deployment

Deploy normally through Netlify. If the new database migrations have not yet been applied, run:

```bash
npm run db:deploy
```

Required production environment variables remain:

```env
DATABASE_URL=...
PAYSTACK_SECRET_KEY=...
NEXT_PUBLIC_SITE_URL=...
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
```

## Verification

The import/export mismatch reported by Turbopack has been checked against every admin route in this package. A full local npm build could not be run because the execution environment's package registry does not provide `@prisma/client`.
