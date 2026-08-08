# Bridgecare v6.4.15 — Paystack confirmation retry

Fixes successful Paystack payments sometimes landing on “We could not confirm the order”.

Changes:
- Order-success verification now retries briefly instead of failing after one immediate Paystack verify call.
- If the signed Paystack webhook has already marked the order/payment successful, the confirmation API returns paid immediately.
- Paystack amount comparisons are normalized to numbers and currency comparisons are normalized to uppercase.
- Exact amount and currency matching remains mandatory before browser verification can mark an unpaid order PAID.
- Meta Purchase still fires only after the confirmation API returns `paid: true`.

Suggested commit: `Fix Paystack post-payment confirmation retry v6.4.15`
