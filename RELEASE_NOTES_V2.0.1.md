# Bridgecare v2.0.1 — Database & Payment Foundation

## Added

- Normalized `Customer` records linked to orders.
- Dedicated `Payment` records for Paystack transactions.
- Payment lifecycle status: `PENDING`, `SUCCESS`, `FAILED`, `ABANDONED`, `REFUNDED`.
- Database indexes for orders, customers, payments and order items.
- Production migration: `20260730000100_checkout_v2_foundation`.

## Checkout changes

- Customer is created or updated by email before order creation.
- Order, order items and pending payment are created in one database transaction.
- Paystack webhook now updates both the order and payment records atomically.
- Paystack callback verification also updates both records atomically.
- Existing Paystack fallback behaviour remains unchanged when production secrets are unavailable.

## Deployment

Set these Netlify environment variables:

- `DATABASE_URL`
- `PAYSTACK_SECRET_KEY`
- `NEXT_PUBLIC_SITE_URL`

Run the database migration once from a database-enabled environment:

```bash
npm run db:deploy
```

Then deploy normally with:

```bash
npm run build
```
