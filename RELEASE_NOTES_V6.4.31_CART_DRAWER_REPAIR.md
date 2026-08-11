# v6.4.31 — Mobile Cart Drawer Repair

Focused repair on the v6.4.30 mobile cart drawer.

- Restores full-screen/right-side drawer positioning and backdrop.
- Makes the drawer internally scrollable on small screens.
- Keeps the checkout footer visible without covering cart content.
- Repairs product, quantity, recommendation, and free-shipping card layout.
- Removes the stray literal `\n` between CartDrawer and Footer in app/layout.tsx.
- Leaves checkout, Paystack, shipping logic, contextual recommendations, and product-page sticky actions unchanged.
