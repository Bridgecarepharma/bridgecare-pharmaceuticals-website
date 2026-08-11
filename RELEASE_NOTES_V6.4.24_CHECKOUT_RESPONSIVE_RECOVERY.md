# v6.4.24 — Checkout Responsive Recovery

Baseline: v6.4.22 corrected compact hero.

This release intentionally changes checkout presentation only. Checkout business logic, cart calculations, delivery zones, free-shipping eligibility, coupons, Paystack initialization/verification, and analytics are unchanged.

Mobile fixes:
- restores true single-column responsive checkout
- prevents horizontal overflow from order/product/delivery cards
- styles and hides checkout progress steps appropriately on phones
- reduces heading and field heights without changing required fields
- compacts product quantity and add-more-product cards
- compacts delivery method, delivery zones, coupon and summary sections
- keeps the payment button accessible with a mobile sticky treatment
- adds extra safeguards for 380px and narrower screens
