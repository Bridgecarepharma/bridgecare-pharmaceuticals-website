# v6.4.25 — Contextual checkout recommendations

Adds product-specific recommendations to checkout without changing Paystack,
shipping, free-shipping calculations, cart storage, or the responsive checkout layout.

Rules:
- AsFenositol -> Omega-3 Supplement (Aspivit®) + Bridgecare Herbal Bitter Tea
- Aspivit -> Bridgecare Herbal Bitter Tea
- Globivida -> Omega-3 Supplement (Aspivit®)
- Bridgecare Herbal Bitter Tea -> Omega-3 Supplement (Aspivit®)

Globivida is excluded from the general recommendation tier. It remains available
under the collapsed "More Bridgecare products" area for customers who deliberately
want to add it.

Aspivit is displayed as "Omega-3 Supplement (Aspivit®)" in recommendation/add-more
cards while retaining its existing product slug, price, image, and checkout data.
