# Netlify production deployment

This project is a server-rendered Next.js application. It must **not** be configured as a static export.

## Netlify settings

- Build command: `npm run build`
- Publish directory: `.next`
- Node.js: 20
- Next.js runtime: `@netlify/plugin-nextjs`

Clear the Netlify build cache after replacing an older static-export deployment.

## Required environment variables

```env
NEXT_PUBLIC_SITE_URL=https://bridgecarepharmang.com
PAYSTACK_SECRET_KEY=sk_live_replace_me
DATABASE_URL=postgresql://replace_me
```

## Paystack webhook

`https://bridgecarepharmang.com/api/paystack/webhook`

## Database setup

Run `npx prisma migrate deploy` against the production database before accepting orders.
