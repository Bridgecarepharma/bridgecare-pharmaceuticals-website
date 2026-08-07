# Bridgecare v6.3.0 Reviews Schema Fix

This patch restores the Prisma models required by the existing Verified Reviews code:

- `ReviewStatus`
- `ProductReview`
- `ReviewImage`

It also restores the corresponding Prisma migration.

No product content, images, checkout, coupons, shipping, or Health Centre files are changed.

## Deploy

Copy the patch contents into the repository root and replace the existing `prisma/schema.prisma` file. Commit and push. Netlify's existing build scripts already run `prisma generate` and `prisma migrate deploy`.
