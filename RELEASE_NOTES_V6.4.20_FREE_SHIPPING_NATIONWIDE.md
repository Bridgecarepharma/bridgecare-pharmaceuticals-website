# Bridgecare v6.4.20 — Free Shipping Nationwide

Policy enforced:
- Any purchase of 3 packs or more qualifies for FREE SHIPPING NATIONWIDE.
- Applies to Lagos and all other Nigerian states.
- 1–2 packs continue to use the normal delivery-zone fee.
- Checkout visibly displays “Free Shipping Nationwide”.
- Server-side shipping calculation is locked to the same 3-pack rule so Paystack totals match the checkout.

Files changed:
- app/checkout/page.tsx
- app/globals.css
- lib/shipping.ts

Suggested commit:
Enforce free shipping nationwide for 3 packs v6.4.20
