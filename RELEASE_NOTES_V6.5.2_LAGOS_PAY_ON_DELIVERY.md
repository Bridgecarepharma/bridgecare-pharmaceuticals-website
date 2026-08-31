# Bridgecare Website v6.5.2 — Lagos Pay on Delivery

- Adds Pay on Delivery only for Lagos Mainland and Lagos Island.
- Keeps Paystack online payment available to all customers.
- Enforces Lagos-only eligibility on the server.
- Keeps the current Lagos delivery charges and free nationwide delivery from four packs.
- COD orders are saved without redirecting to Paystack and receive a dedicated confirmation page.
- COD orders are clearly labelled in admin and mobile-admin API data.
- Admin WhatsApp uses a COD confirmation message instead of failed-payment recovery.

- COD orders remain in PENDING_PAYMENT operational status until staff confirms/advances them, while the PAY ON DELIVERY channel prevents them being mistaken for abandoned Paystack orders.
