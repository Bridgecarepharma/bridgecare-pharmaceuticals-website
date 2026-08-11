# v6.4.16 — Paystack safe verification diagnostic

Adds a safe diagnostic object when a successful Paystack transaction fails the
order consistency checks. It exposes only reference/amount/currency/metadata
comparison results — never the Paystack secret, customer data, or card data.

After deployment, reuse the existing failed transaction reference at:
`/api/paystack/verify?reference=<REFERENCE>`

No new payment is required.
