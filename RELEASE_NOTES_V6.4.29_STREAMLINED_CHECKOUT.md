# v6.4.29 — Streamlined checkout

- Renamed Customer information to Contact & delivery information.
- Removed duplicate Recipient name and Recipient phone fields.
- Customer full name and phone are still copied into recipient fields in the order payload for backend compatibility.
- Removed Postal code from the checkout UI; backend receives an empty optional postal code.
- Changed the payment CTA from "Pay ₦… securely" to "Checkout ₦… securely".
- Removed the problematic mobile bottom-sticky behavior that was covering checkout fields.
- Preserved shipping, 3-pack free delivery, coupons, Paystack, analytics, cart logic, and contextual recommendations.
