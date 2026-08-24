# v6.4.32 — Pending Order WhatsApp Recovery

Focused admin-order improvement based on the stable v6.4.31 source.

## What changed

- Keeps the existing **WhatsApp customer** button on the order details page.
- For pending, failed, or abandoned payments, the button now opens a recovery message that includes:
  - customer first name
  - Bridgecare order number
  - every product name in the order
  - quantity of each product
  - total order amount
  - a courteous incomplete-payment reminder and offer of assistance
- Paid/successful orders retain the existing WhatsApp message behavior.
- No checkout, Paystack, shipping, pricing, or payment-status logic was changed.
