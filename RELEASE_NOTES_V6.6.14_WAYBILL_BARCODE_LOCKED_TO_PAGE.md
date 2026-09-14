# Bridgecare v6.6.14 — Waybill barcode locked to page 1

- Keeps the print canvas at exactly 100 mm × 150 mm.
- Uses a 148 mm internal label height to avoid browser print rounding that can create an extra page.
- Reserves 14 mm at the bottom of the label for the barcode.
- Anchors the Code 39 barcode inside the label at 2.5 mm from the bottom.
- Hides print overflow so the browser cannot create a second blank/barcode page.
- Leaves the normal on-screen waybill preview unchanged.

Replace `app/admin/orders/[id]/waybill/page.tsx`, rebuild, and redeploy.
