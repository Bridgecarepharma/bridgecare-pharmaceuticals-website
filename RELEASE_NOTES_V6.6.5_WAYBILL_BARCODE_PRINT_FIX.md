# Bridgecare Website v6.6.5 — Waybill Barcode Print Fix

## Fixed
- Prevents the delivery-waybill barcode from being pushed below the printable 100 mm × 150 mm label.
- Reduces print-only vertical spacing while preserving the normal on-screen preview.
- Reserves a fixed barcode area at the bottom of the printed label.
- Compacts recipient, package-content, and sender sections for thermal-label printing.
- Keeps the barcode/order number inside the physical label even when normal address content uses more space.

## Scope
Only the delivery waybill print CSS was changed. Order data, checkout, payments, admin authentication, and storefront behavior are unchanged.
