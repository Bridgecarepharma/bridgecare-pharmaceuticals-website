# Bridgecare v6.6.14 — Waybill barcode one-page fix

- Fixes the Code 39 barcode being pushed to a second 100 × 150 mm print page.
- Keeps the readable print font sizes introduced in the recent waybill update.
- Uses a 149 mm print-safe label height to avoid browser/printer pagination rounding at exactly 150 mm.
- Reserves 14 mm at the bottom of the label and anchors the barcode inside that reserved area.
- Keeps FROM and HANDLE WITH CARE in normal flow while ensuring the barcode remains physically inside page 1.
- No checkout, payment, order, storefront, or admin API logic changed.
