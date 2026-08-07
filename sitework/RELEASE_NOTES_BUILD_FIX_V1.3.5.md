# Bridgecare Integrated Checkout v1.3.5

## Netlify build fix

- Removed `prisma migrate deploy` from the Netlify build command.
- Netlify now runs `prisma generate && next build`, so a missing `DATABASE_URL` no longer blocks the application build.
- Added `npm run db:deploy` for running production migrations separately after the PostgreSQL `DATABASE_URL` is configured.
- Kept the integrated checkout, shipping calculation, order persistence, Paystack initialization, callback verification, and signed webhook flow unchanged.

## Required production setup

Before live checkout can save orders, configure these Netlify environment variables:

- `DATABASE_URL`
- `PAYSTACK_SECRET_KEY`
- `NEXT_PUBLIC_SITE_URL`

Then run the database migrations once using `npm run db:deploy` from an environment that can reach the production database.
