# Bridgecare v6.6.9 — Waybill no-second-page fix

- Removes the fixed 150 mm CSS content height that was causing browser print pagination/rounding to push the footer and barcode to page 2.
- Keeps the physical print page at 100 mm × 150 mm via `@page`.
- Places FROM details and the Code 39 barcode in normal document flow immediately after PACKAGE CONTENT.
- Removes the flex `margin-top:auto` spacer that created the large blank area on page 1.
- Removes absolute barcode anchoring, so the barcode can no longer be fragmented onto a second page by the print engine.
- Keeps print-only sizing compact for thermal label output.

Replace:
`app/admin/orders/[id]/waybill/page.tsx`

Then rebuild and deploy the website.
