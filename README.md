# Bridgecare Pharmaceuticals E-commerce Website

A Next.js, TypeScript, Tailwind CSS, PostgreSQL and Paystack starter for the Bridgecare public website and online store.

## Included

- Public corporate and product pages
- Persistent browser cart
- Required customer and delivery-address form
- State-based standard and express delivery fees
- Server-side price calculation
- Order creation before payment
- Paystack transaction initialization
- Paystack callback verification
- Signed Paystack webhook handling
- PostgreSQL order and order-item storage
- Order confirmation page
- Cart clearing only after verified payment

## Setup

1. Install packages:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env
```

3. Add your PostgreSQL URL and Paystack **test** secret key.

4. Create the database tables:

```bash
npm run db:generate
npm run db:migrate -- --name initial
```

5. Start development:

```bash
npm run dev
```

## Paystack dashboard configuration

Set the webhook URL to:

```text
https://bridgecarepharmang.com/api/paystack/webhook
```

The application sets the successful transaction callback URL to:

```text
https://bridgecarepharmang.com/order-success
```

Use test keys until checkout and webhook verification are fully tested. Never expose `PAYSTACK_SECRET_KEY` to browser code or commit `.env` to GitHub.

## Before launch

- Replace sample product prices in `lib/store.ts`.
- Replace sample delivery fees in `lib/store.ts`.
- Add official product images.
- Verify every public product claim against current approved packaging.
- Insert approved legal policies.
- Connect email/SMS fulfilment notifications.
- Add an authenticated order-management dashboard or connect the database to your existing operations system.
- Test failed, abandoned, duplicate and delayed payments.
- Configure the production database, domain and live Paystack key.

## Netlify deployment

This application is a server-rendered/hybrid Next.js application because it contains Paystack API routes, webhooks, dynamic order lookup, and Prisma database access. It must **not** be deployed as a static export.

Use these Netlify build settings:

```text
Build command: npm run build
Publish directory: .next
```

A matching `netlify.toml` is included. In the Netlify dashboard, remove any old `out` publish-directory override under **Site configuration → Build & deploy → Build settings**. Then clear the build cache and redeploy.

Required production environment variables:

```text
NEXT_PUBLIC_SITE_URL=https://bridgecarepharmang.com
PAYSTACK_SECRET_KEY=sk_live_...
DATABASE_URL=postgresql://...
```

Configure the Paystack webhook as:

```text
https://bridgecarepharmang.com/api/paystack/webhook
```
