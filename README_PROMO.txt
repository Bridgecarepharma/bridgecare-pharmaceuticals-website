ASPIVIT CORRECTED PROMO — READ BEFORE DEPLOYING

Price: ₦8,000 before; ₦6,000 promo; 25% off.

Changes:
- Product cards (home/shop): strike-through ₦8,000, ₦6,000, 25% OFF.
- Aspivit detail page: same presentation.
- Central server price map: Aspivit temporarily fixed to 600000 kobo even if database inventory still has ₦8,000. This affects /api/products/prices, cart refresh, checkout, and Paystack server calculations.
- Default catalog and fallback price set to ₦6,000.
- Admin price screen explains temporary override.
- No shipping changes.

IMPORTANT: The ₦6,000 override is hard-coded in lib/product-prices.ts for this promotion. Changing Aspivit in /admin/prices will NOT affect customer checkout until this override is removed. Remove the override when promotion ends. Also update database inventory to ₦6,000 for consistency.

Deployment:
1. Back up website, database and environment settings.
2. Use the patch ZIP by copying its files into the corresponding paths in your existing source tree; or use the lite source ZIP if your host builds Next.js from source.
3. Build with your existing environment and dependencies, deploy through your normal hosting process. Do NOT upload patch ZIP as a prebuilt Netlify deployment.
4. Hard-refresh site, clear old Aspivit from cart, add it again.
5. Confirm homepage/shop, product page, /api/products/prices, cart, checkout and Paystack all show ₦6,000; Mainland delivery ₦3,500, Island ₦5,000.
6. Make a controlled test payment and confirm the Paystack transaction amount and order record.
7. Obtain necessary NAFDAC advertising clearance before promotion.

No live website, database or Paystack settings have been modified. Build/test was not run here.
