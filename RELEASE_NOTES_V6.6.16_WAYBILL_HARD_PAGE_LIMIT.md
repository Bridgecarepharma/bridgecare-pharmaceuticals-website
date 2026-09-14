# V6.6.16 — Waybill hard page limit

- Stops using a 150mm-tall grid for print, which Chromium can fragment at the page boundary.
- Uses a 144mm-tall flex label inside the 150mm paper size to leave a 6mm pagination safety buffer.
- Keeps the barcode in normal document flow as the final fixed-height block.
- Removes flexible growth from the package-content section during printing.
- Keeps the screen preview styling unchanged.
