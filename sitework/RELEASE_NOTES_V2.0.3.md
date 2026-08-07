# Bridgecare Pharmaceuticals v2.0.3

## Payment confirmation
- Verifies Paystack webhook signatures with HMAC SHA-512.
- Stores every accepted webhook in `PaymentWebhookEvent`.
- Uses a unique event key to safely ignore duplicate deliveries.
- Validates payment status, amount, and currency before marking an order paid.
- Records Paystack transaction ID, channel, paid time, and raw event payload.
- Returns an error for processing failures so Paystack can retry.

## Admin orders
- Added `/admin/login` and `/admin/orders`.
- Admin access uses an HTTP-only signed session cookie.
- Orders page shows the latest 100 orders, customer details, products, totals, payment status, order status, and date.
- Added sign-out support.

## Required environment variables
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- Existing `DATABASE_URL` and `PAYSTACK_SECRET_KEY`

## Deployment
Run the new database migration once:

```bash
npm run db:deploy
```

Paystack webhook:

`https://bridgecarepharmang.com/api/paystack/webhook`
