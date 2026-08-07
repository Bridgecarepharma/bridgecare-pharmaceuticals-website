# v2.1.3 — Admin price management

- Added `/admin/prices` for secure product price updates.
- Added database-backed product prices to Inventory.
- Checkout now validates and charges the latest database price.
- Product listing, product pages, and saved carts refresh current prices.
- Added audit logging for price changes.
- Product purchase actions now use the integrated cart checkout so database price changes cannot be bypassed by older fixed Paystack links.
