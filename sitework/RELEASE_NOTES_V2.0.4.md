# Bridgecare Pharmaceuticals Website v2.0.4

## Admin operations dashboard

- Added `/admin` dashboard with total orders, paid orders, pending payments and recorded revenue.
- Added recent-orders overview and admin navigation.
- Upgraded `/admin/orders` with customer/order search and status filtering.
- Added full order detail pages.
- Added fulfilment status updates, tracking numbers and internal notes.
- Added order status history and admin audit logging.
- Added customer directory, lifetime spend and customer order-history pages.

## Database migration

This release adds:

- `Order.trackingNumber`
- `Order.internalNotes`
- `OrderStatusHistory`
- `AdminAuditLog`

Run `npm run db:deploy` after deployment.

## Admin URLs

- `/admin/login`
- `/admin`
- `/admin/orders`
- `/admin/customers`
