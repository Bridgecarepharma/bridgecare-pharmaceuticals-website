# Bridgecare v6.6.13 — Waybill balanced print text

This patch keeps the working 100 mm × 150 mm single-page waybill layout and barcode placement.

Changes:
- Slightly larger section labels in print.
- Larger, clearer FROM/company details.
- Larger barcode/order number text.
- No change to the current one-page structure or barcode height.

Replace:
`app/admin/orders/[id]/waybill/page.tsx`
