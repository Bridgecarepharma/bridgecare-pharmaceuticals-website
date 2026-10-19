# Bridgecare Where to Buy

## Included

- Public directory: `/store-locations`, linked from the main menu and footer and included in the sitemap.
- Admin page: `/admin/stockists`, using the existing Bridgecare administrator login.
- Search by shop name, address or area, with state, city and product filters; state browsing covers all 36 states and Abuja (FCT).
- Each published shop can display its address, phone, optional WhatsApp number, opening hours, product range and Google Maps directions. Maps open using the supplied address; no Maps API key is needed. Check the directions once for each real shop before publication.
- Customer notice to call and confirm availability. Product selections identify a supplied range, not live inventory.
- Add, edit, publish, hide and remove shops. Authenticated changes are validated, checked for same-origin requests and recorded in the existing admin audit log.
- Responsive cards with 12 results shown initially and a Show more button; the admin list is paginated in groups of 20 and searchable.

## Deploy

1. Commit this source to the existing GitHub repository connected to Netlify.
2. The existing Netlify build command runs migrations before building. The new additive migration is `prisma/migrations/20261019090000_store_locations/migration.sql`. No database reset is needed. For other deployment pipelines, run `npm run db:migrate:deploy` before making the new routes available.
3. Existing database and admin environment settings are reused. No new account, paid mapping service or API secret is required.
4. After deployment, open Admin → Shop locations. If storage is unavailable, check the migration and database connection; do not reset the production database.
5. Open Where to Buy and confirm the imported active locations appear. Review the contact CSV, test search and state filters, and edit or hide individual locations through Admin → Shop locations as needed.

## Add shops

Enter the pharmacy/distributor name, full physical address, state, city and phone. Add a WhatsApp number only if it is actually used by that shop; Nigerian numbers beginning with 0 are converted to +234 links. Optional opening hours and product selections can be edited later.

New records remain hidden unless the confirmed-stockist publish checkbox is selected. Edit a published shop and clear that checkbox to hide it. Remove deletes its directory entry after confirmation. The directory refreshes on page visits; existing customer tabs may need a reload after a change.

The owner confirmed on 19 October 2026 that shops in the supplied nationwide directory already stock Bridgecare products. Migration `20261019150000_activate_confirmed_stockists` imports 1,669 unique name/address/state entries as active across all 36 states and the FCT. It also activates existing exact matching entries without replacing their contact details. This runs once through Prisma migrations; later admin edits and hiding remain in effect.

The imported data is in `data/stockists-import.json`, with state counts in `STOCKISTS_IMPORT_SUMMARY.json`. The 130 entries without a usable Nigerian contact number appear in `STOCKISTS_CONTACT_REVIEW.csv` and remain published without a call link. No WhatsApp availability, product ranges or opening hours are assumed. Cities are left blank because they were not separately provided; customers can search the full address and filter by state, and administrators can add cities later. Some source addresses are only a town name: confirm the map destination before travelling.

All entries remain editable in Admin → Shop locations. Review ambiguous or near-duplicate source entries before treating them as separate outlets. Exact normalized name/address/state duplicates were removed; potentially different branches were retained.

The customer page distinguishes an empty directory, no matching results and a temporary database failure. It also provides links to the online shop and Bridgecare contact page.

## Validation

- `npm ci` installs the locked dependencies (use Node 20 or 22 as configured).
- `npm run build` generates Prisma and performs a production Next.js build with type checking.
- `npm run test:stockists` tests validation, filters, contact/maps links, rendered empty/result states, migration application and the authenticated add/edit/publish/hide/remove lifecycle. Database tests use PostgreSQL-compatible PGlite with a Prisma-to-SQL test adapter, not the production Supabase account.
- Changed-file lint is checked separately. Visual browser and production-Supabase end-to-end checks should be completed after deployment.

Existing checkout, shipping rules, payment handlers and pack-verification logic are preserved. This deliverable has not been deployed from this workspace.
