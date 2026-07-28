# Netlify repair notes

This build must run as a full-stack Next.js application because it contains Paystack, Prisma, webhooks, and dynamic order APIs.

## Required repository state

- `next.config.mjs` must not contain `output: "export"`.
- `netlify.toml` must publish `.next`, not `out`.
- `npm run build` runs a prebuild guard that stops the build if static-export settings are reintroduced.
- ESLint uses `.eslintrc.json`, avoiding the unresolved flat-config import seen in the Netlify log.
- `app/sitemap.ts` and `app/robots.ts` are explicitly static metadata routes.

## Netlify settings

- Build command: `npm run build`
- Publish directory: `.next`
- Node.js: `20`

After replacing the files in GitHub, use **Clear cache and deploy site**.
