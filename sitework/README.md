# Bridgecare Pharmaceuticals E-commerce Website

Production-oriented Next.js e-commerce website for Bridgecare Pharmaceuticals Limited.

## Public product portfolio

- Aspivit®
- AsFenositol®
- Globivida®
- Bridgecare Herbal Bitter Tea®


## Included

- Responsive corporate website and family-backed product hero
- Product catalogue and product detail pages
- Persistent browser cart
- Checkout with required customer and delivery address information
- State-based standard and express delivery fees
- Server-side price calculation
- Paystack payment initialization, callback verification and signed webhook processing
- PostgreSQL order and order-item storage through Prisma
- Order confirmation and failed-payment pages
- SEO metadata, sitemap, robots file and legal/support pages

## Local setup

```bash
npm install
cp .env.example .env
npm run db:migrate -- --name initial
npm run dev
```

Use a Paystack test secret key during development.

## Production build

```bash
npm run build
npm start
```

## Netlify

Deployment configuration is included in `netlify.toml`. See `NETLIFY_DEPLOYMENT.md` for the exact environment variables, database migration step and the stale static-site settings that must be removed from the Netlify dashboard.

## Production URLs

- Website: `https://bridgecarepharmang.com`
- Purchase conversion page: `https://bridgecarepharmang.com/order-success`
- Paystack webhook: `https://bridgecarepharmang.com/api/paystack/webhook`

## Before accepting live orders

- Confirm product prices and delivery fees in `lib/store.ts`.
- Review all claims against approved packaging and current regulatory requirements.
- Apply the Prisma production migration.
- Add the live Paystack secret only after successful test transactions.
- Test successful, failed, abandoned, duplicate and delayed payment scenarios.
- Connect fulfilment email/SMS notifications and an authenticated order-management workflow.
