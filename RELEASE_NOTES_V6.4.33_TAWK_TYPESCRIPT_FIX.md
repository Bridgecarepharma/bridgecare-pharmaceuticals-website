# Bridgecare v6.4.33 — Tawk.to TypeScript Build Fix

- Removed redundant global `Window.Tawk_API` and `Window.Tawk_LoadStart` TypeScript declarations from both TawkToChat component copies.
- The Tawk initialization code runs inside the Next.js `<Script>` string and does not require those TypeScript globals.
- Preserves the v6.4.32 pending-order WhatsApp recovery changes.
- No checkout, Paystack, shipping, pricing, order-status, or customer-facing Tawk behavior was intentionally changed.
