# Bridgecare Enterprise Cart v1.1

## Improvements

- Premium right-side cart drawer with a clearer order summary.
- Quantity controls, item removal, cart clearing and live line totals.
- Persistent browser storage with migration from the previous cart version.
- Safer validation of previously stored cart data.
- Accessible keyboard navigation, Escape-to-close, focus trapping and screen-reader announcements.
- Body scroll locking while the cart is open.
- Mobile refinements and polished feedback after adding an item.
- Combined Paystack checkout retained: https://paystack.shop/pay/btzq7yqk7p

## Test checklist

1. Add every product and confirm the drawer opens.
2. Increase and decrease quantities and confirm subtotal changes.
3. Refresh the page and confirm the cart remains populated.
4. Remove one item and use **Clear cart**.
5. Press Escape to close the drawer and verify keyboard focus returns to the cart button.
6. Test at mobile width and confirm the drawer fills the screen without horizontal overflow.
7. Open **Proceed to checkout** and confirm the combined Paystack page loads.

## Netlify build correction
- Corrected the cart confirmation timer type for browser and Next.js TypeScript compatibility.
- Replaced `window.setTimeout` / `window.clearTimeout` for this timer with the environment-safe `setTimeout` / `clearTimeout` pair.
