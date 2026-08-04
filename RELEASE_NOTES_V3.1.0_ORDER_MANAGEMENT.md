# Bridgecare v3.1.0 — Order Management

## Added
- Advanced order search by order number, Paystack reference, customer, email or phone.
- Order-status, payment-status and date-range filtering.
- Fulfilment KPI cards for the currently filtered order set.
- Printable customer invoices.
- Printable packing slips with item checkboxes and courier sign-off.
- Dedicated status notes stored in the order timeline.
- Tracking-number management and tracking visibility on order lists.
- Direct customer email, telephone and WhatsApp contact links.
- Improved order detail, payment and delivery presentation.

## URLs
- `/admin/orders`
- `/admin/orders/[id]`
- `/admin/orders/[id]/invoice`
- `/admin/orders/[id]/packing-slip`

No database migration is required because this release uses the existing tracking, notes and status-history fields.
