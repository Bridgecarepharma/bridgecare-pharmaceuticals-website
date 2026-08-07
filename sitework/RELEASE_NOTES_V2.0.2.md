# Bridgecare v2.0.2 — Production Checkout Engine

## Included

- Server-authoritative product pricing and shipping calculation.
- Lagos delivery: ₦2,500.
- Outside Lagos: ₦3,000.
- Free delivery for three packs or more.
- Collision-resistant Bridgecare order numbers and Paystack references.
- Customer, order, order items and pending payment saved in one database transaction.
- Dynamic Paystack initialization using the exact order total in kobo.
- Failed Paystack initialization now marks both the order and payment as failed/cancelled.
- Clear API responses containing subtotal, shipping and total.
- Existing Paystack Shop fallback remains available until both DATABASE_URL and PAYSTACK_SECRET_KEY are configured.

## Required Netlify variables for integrated checkout

- `DATABASE_URL`
- `PAYSTACK_SECRET_KEY`
- `NEXT_PUBLIC_SITE_URL=https://bridgecarepharmang.netlify.app`

Optional:

- `ALLOW_PAYSTACK_FALLBACK=false` to prevent fallback and require the integrated checkout.
- `PAYSTACK_CART_URL=https://paystack.shop/pay/btzq7yqk7p`

## Database migration

Run once after adding `DATABASE_URL`:

```bash
npm run db:deploy
```

## Paystack webhook

Configure:

`https://bridgecarepharmang.netlify.app/api/paystack/webhook`
