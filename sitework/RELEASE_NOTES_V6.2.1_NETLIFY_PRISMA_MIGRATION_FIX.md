# v6.2.1 — Netlify Prisma migration build fix

- Netlify now runs `npm run build` without applying database migrations during every deployment.
- The build script still runs `prisma generate` before `next build`, so Prisma Client types are current.
- `db:deploy` now generates Prisma Client only.
- Added `db:migrate:deploy` for deliberate/manual production migrations.

## One-time database reconciliation

The database already contains the `ProductReview` table, while migration `20260807010000_add_product_reviews` is recorded as failed or unapplied. Run this once from a trusted local/admin environment with the production `DATABASE_URL` configured:

```bash
npx prisma migrate resolve --applied 20260807010000_add_product_reviews
```

Only mark it applied after confirming the existing table matches `prisma/schema.prisma`. This command is intentionally not run in Netlify.
