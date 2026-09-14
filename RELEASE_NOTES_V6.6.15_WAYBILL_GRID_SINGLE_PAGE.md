# Bridgecare v6.6.15 — Waybill barcode single-page grid fix

## Problem
Chrome/Edge print pagination could still fragment the absolutely positioned barcode onto a second 100 × 150 mm page even though visible space remained on page 1.

## Fix
- Removed absolute positioning from the print barcode.
- Changed the printed 100 × 150 mm label to a fixed seven-row CSS grid.
- Reserved a dedicated 10 mm final grid row for the barcode inside the physical label page.
- Kept package content in the only flexible `minmax(0, 1fr)` row.
- Removed the extra 14 mm bottom padding previously used to reserve barcode space.
- Kept overflow clipped to the physical 100 × 150 mm label.

This makes the barcode part of the same fixed print grid instead of a paginated positioned child, preventing Chrome/Edge from moving it to page 2.
