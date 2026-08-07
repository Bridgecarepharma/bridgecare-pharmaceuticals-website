# Prisma review schema fix

The `ProductReview` Prisma model now matches the review administration and API code used by the live repository.

Included fields:
- `status` using `ReviewStatus` (`PENDING`, `APPROVED`, `REJECTED`, `ARCHIVED`)
- `adminReply`
- `customerEmail`, `city`, and `orderNumber`
- `body`
- `verifiedPurchase`
- related `ProductReviewImage` records

Netlify continues to run `prisma generate` as part of `npm run build`. Database migrations are not run automatically during the Netlify build.

The production database must already contain matching columns/tables. If it does not, reconcile the failed migration and apply a corrected database migration separately before using the reviews feature.
