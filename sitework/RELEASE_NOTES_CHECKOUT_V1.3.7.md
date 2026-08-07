# Checkout v1.3.7

- Removed the blocking “Secure payment is temporarily unavailable” response when `PAYSTACK_SECRET_KEY` is absent.
- Checkout now opens the approved Bridgecare Paystack cart fallback: `https://paystack.shop/pay/btzq7yqk7p`.
- Dynamic shipping totals and database-linked tracking continue to work automatically when `PAYSTACK_SECRET_KEY` and `DATABASE_URL` are configured.
- Added safer Paystack response handling on the checkout page.

## Important

The fallback page cannot receive the website-calculated shipping amount or save the order. For the complete integrated flow, configure `PAYSTACK_SECRET_KEY`, `DATABASE_URL`, and run `npm run db:deploy`.
