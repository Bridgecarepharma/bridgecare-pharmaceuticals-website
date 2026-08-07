# Bridgecare Checkout v1.3.6

## Fixed
- Checkout no longer stops when `DATABASE_URL` is absent.
- Shipping is still calculated by the website and sent to Paystack.
- Paystack payment initialization now works in fallback mode.
- The success page can verify and display paid orders from Paystack metadata when no database is configured.
- Webhook signature validation remains enabled.

## Full order tracking
To save orders before payment and let the webhook update them to `PAID`, configure `DATABASE_URL` in Netlify and run:

```bash
npm run db:deploy
```

Without `DATABASE_URL`, customers can pay and receive a verified success page, but orders are not persisted in PostgreSQL.
