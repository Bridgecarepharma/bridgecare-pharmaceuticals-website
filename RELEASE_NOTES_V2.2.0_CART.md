# Bridgecare Website v2.2.0 — Cart + Paystack Cart Link

- Restored persistent browser cart using localStorage.
- Product buttons now add products to the cart.
- Added cart quantity controls, removal, totals, and pack count.
- Added cart badge in the main header.
- Checkout redirects to Bridgecare combined Paystack cart link:
  https://paystack.shop/pay/btzq7yqk7p
- No DATABASE_URL or PAYSTACK_SECRET_KEY is required.

Note: a static Paystack payment link does not receive product-line data automatically. The website displays the customer’s cart total and sends the customer to the combined Paystack payment page to complete payment.
