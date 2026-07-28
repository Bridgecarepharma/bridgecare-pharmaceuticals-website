# Netlify deployment

This repository is a real Next.js application. It must not use the old static-site settings (`site` publish directory or an echo-only build command).

## Repository settings

Netlify reads the included `netlify.toml`:

- Build command: `npm run build`
- Publish directory: `.next`
- Node.js: 20

Netlify detects Next.js automatically. There is intentionally no manual `[[plugins]]` entry for `@netlify/plugin-nextjs`.

## Required environment variables

Add these in **Project configuration → Environment variables** before deploying:

- `NEXT_PUBLIC_SITE_URL=https://bridgecarepharmang.com`
- `PAYSTACK_SECRET_KEY=...`
- `DATABASE_URL=...`

Optional:

- `NEXT_PUBLIC_CONTACT_EMAIL=info@bridgecarepharma.com`

Never commit live secrets.

## Database setup

After creating the PostgreSQL database and setting `DATABASE_URL`, apply the included migration once:

```bash
npx prisma migrate deploy
```

You may run this locally against the production database or in a controlled one-off Netlify/CI command.

## Paystack

Configure the webhook URL as:

```text
https://bridgecarepharmang.com/api/paystack/webhook
```

Successful payments return to:

```text
https://bridgecarepharmang.com/order-success
```

Use Paystack test credentials until the complete payment flow has been verified.

## Remove stale Netlify UI settings

In Netlify, clear any old overrides that still say:

- Build command: `echo 'Bridgecare static site: no framework build required'`
- Publish directory: `site`

Also remove a manually installed Next.js plugin from **Extensions/Plugins** if one remains from the static-site deployment. Netlify will attach the supported Next.js runtime automatically during framework detection.

Security update: Next.js and eslint-config-next pinned to 16.0.10 (patched release line).
