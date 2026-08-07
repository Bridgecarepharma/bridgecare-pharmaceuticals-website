# Bridgecare Coupon Management v6.2.0

## Included
- Admin coupon management at `/admin/marketing/coupons`
- Percentage, fixed-amount and free-delivery coupons
- Start and expiry dates
- Minimum product subtotal
- Total and per-customer usage limits
- First-order-only promotions
- Optional product restrictions
- Active/inactive controls and audit logging
- Coupon entry and live validation at checkout
- Server-side recalculation before Paystack initialization
- Coupon discount, code and redemption stored with the order
- Idempotent redemption after successful Paystack verification/webhook

## Deployment
Netlify runs `prisma migrate deploy` before the Next.js build. No new environment variables are required.

## Test checklist
1. Create a 10% test coupon in Admin → Marketing.
2. Add a product to the cart and proceed to checkout.
3. Enter the customer email before applying the coupon.
4. Confirm the discount appears in the order summary.
5. Confirm Paystack receives the reduced total.
6. Complete a test payment and verify the redemption counter increases once.
7. Test an expired, inactive and product-restricted coupon.
