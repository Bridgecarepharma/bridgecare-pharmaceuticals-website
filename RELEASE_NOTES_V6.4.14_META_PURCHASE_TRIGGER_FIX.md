# Bridgecare v6.4.14 — Meta Purchase Trigger Fix

- Moves Meta `Purchase` firing directly into the successful `/api/paystack/verify` response path.
- Fires only when the server confirms `paid: true`.
- Simplifies the Purchase payload to the standard fields already proven by the site's working Meta commerce events: value, NGN currency, content IDs, content type and item count.
- Removes the extra browser event-ID/options object and nested `contents` payload from the browser Purchase call to reduce the chance of Meta rejecting the event.
- Retains per-Paystack-reference duplicate protection in localStorage.
- Uses the database `productSlug` when available, with a safe product-name fallback.
- Does not change checkout prices, Paystack verification, reviews, product details, shipping, or admin functionality.

Suggested commit: `Fix verified Meta Purchase trigger v6.4.14`
