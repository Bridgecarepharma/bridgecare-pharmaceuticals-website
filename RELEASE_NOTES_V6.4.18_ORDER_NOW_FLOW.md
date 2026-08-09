# v6.4.18 — Order Now flow and TikTok commerce events

## Customer ordering improvements
- Product purchase buttons now say **Order now** instead of **Add to cart**.
- Clicking **Order now** keeps any products already selected, adds the chosen product, and opens checkout immediately.
- Checkout now starts with a clear **Your order** section where customers can increase/decrease pack quantity or remove an item.
- Checkout includes **Add more products**, allowing customers to combine Bridgecare products without leaving the order form.
- Existing cart, shipping, coupon, Paystack initialization and server-side payment verification remain in place.

## TikTok Pixel commerce funnel
- Added TikTok browser events for `ViewContent`, `AddToCart`, `InitiateCheckout`, and verified `Purchase`.
- Purchase fires only after the existing Paystack server verification reports the payment as paid.
- Purchase is guarded by the Paystack reference in local storage to reduce duplicate browser purchase events.
- Meta commerce tracking remains intact.
