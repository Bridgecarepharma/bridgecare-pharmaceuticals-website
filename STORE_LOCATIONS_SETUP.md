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
5. Add one confirmed shop and check its phone and directions. Publish it, confirm it appears in Where to Buy, then test search and filters. Uncheck the publish box to hide it if required.

## Add shops

Enter the pharmacy/distributor name, full physical address, state, city and phone. Add a WhatsApp number only if it is actually used by that shop; Nigerian numbers beginning with 0 are converted to +234 links. Optional opening hours and product selections can be edited later.

New records remain hidden unless the confirmed-stockist publish checkbox is selected. Edit a published shop and clear that checkbox to hide it. Remove deletes its directory entry after confirmation. The directory refreshes on page visits; existing customer tabs may need a reload after a change.

No shops have been seeded. The Jos pharmacy list discussed as sales prospects has not been treated as a list of confirmed Bridgecare stockists, and no competitor locations were copied. Supply the actual stockist details or add them through admin.

The customer page distinguishes an empty directory, no matching results and a temporary database failure. It also provides links to the online shop and Bridgecare contact page.

## Validation

- `npm ci` installs the locked dependencies (use Node 20 or 22 as configured).
- `npm run build` generates Prisma and performs a production Next.js build with type checking.
- `npm run test:stockists` tests validation, filters, contact/maps links, rendered empty/result states, migration application and the authenticated add/edit/publish/hide/remove lifecycle. Database tests use PostgreSQL-compatible PGlite with a Prisma-to-SQL test adapter, not the production Supabase account.
- Changed-file lint is checked separately. Visual browser and production-Supabase end-to-end checks should be completed after deployment.

Existing checkout, shipping rules, payment handlers and pack-verification logic are preserved. This deliverable has not been deployed from this workspace.
