# Bridgecare integrated checkout setup

This release restores the complete flow:

1. Customer completes the delivery form.
2. The server validates products and calculates shipping.
3. The order is saved in PostgreSQL as `PENDING_PAYMENT`.
4. Paystack opens with the exact server-calculated amount.
5. Paystack calls the signed webhook after payment.
6. The webhook and callback verification update the order to `PAID`.

## Shipping rules

- 3 packs or more: free delivery.
- Fewer than 3 packs to Lagos: ₦2,500.
- Fewer than 3 packs outside Lagos: ₦3,000.

## Netlify environment variables

Add these in **Site configuration → Environment variables**:

- `DATABASE_URL`: your PostgreSQL connection string.
- `PAYSTACK_SECRET_KEY`: Paystack test or live secret key. Never expose it in browser code.
- `NEXT_PUBLIC_SITE_URL`: `https://bridgecarepharmang.netlify.app` while using Netlify, then change to `https://bridgecarepharmang.com` after the custom domain is active.

The build command now runs Prisma generation and production migrations automatically.

## Paystack webhook

Set the webhook URL in the Paystack dashboard to:

`https://bridgecarepharmang.netlify.app/api/paystack/webhook`

After moving to the custom domain, use:

`https://bridgecarepharmang.com/api/paystack/webhook`

## Before accepting live payments

Use Paystack test keys and complete one successful order. Confirm that:

- The delivery fee shown on checkout matches the final Paystack amount.
- The order exists in PostgreSQL before payment.
- The order status changes from `PENDING_PAYMENT` to `PAID`.
- Three or more packs receive free delivery.
