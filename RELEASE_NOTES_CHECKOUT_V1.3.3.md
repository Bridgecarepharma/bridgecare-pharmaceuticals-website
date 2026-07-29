# Checkout v1.3.3

- Restored the integrated delivery form and Paystack API checkout.
- Added server-side shipping calculation.
- Added free delivery for carts containing 3 packs or more.
- Lagos delivery is ₦2,500; delivery outside Lagos is ₦3,000.
- Orders are saved as `PENDING_PAYMENT` before Paystack opens.
- Added signed Paystack webhook processing and callback verification.
- Successful payments update orders to `PAID`.
- Added Paystack transaction ID storage for payment reconciliation.
- Replaced raw database/payment errors with customer-friendly messages.
- Added Prisma production migrations to the Netlify build command.
- Product-specific Buy Instantly links remain separate from cart checkout.
