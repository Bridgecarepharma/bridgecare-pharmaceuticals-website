# Netlify Prisma ProductReview fix

This package includes:

- A `ProductReview` model in `prisma/schema.prisma`.
- A migration that creates the `ProductReview` table and indexes.
- `prisma generate` added to the `db:deploy` script so Netlify refreshes Prisma Client before Next.js type checking.

Netlify build command remains:

```bash
npm run db:deploy && npm run build
```

Note: the source archive supplied for this update did not contain `app/admin/reviews/page.tsx`, although the Netlify log references it. Confirm that Netlify is deploying this exact archive/repository branch and clear its build cache before retrying.
