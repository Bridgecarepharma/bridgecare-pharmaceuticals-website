# Bridgecare v2.0.6 — Sales Reports

## Added
- Protected `/admin/reports` dashboard.
- Date-range filtering for reports.
- Paid revenue, paid order count, average order value, total orders, customer count, and shipping collected.
- Product performance table with units sold and product revenue.
- Recent paid orders table.
- Protected CSV export endpoint at `/api/admin/reports/export`.
- Reports link in the admin navigation.
- Admin navigation added to the inventory page.

## Deployment
No Prisma migration is required for this release.
Deploy normally through Netlify. The reports require a configured `DATABASE_URL` and an authenticated admin session.
