# Bridgecare v2.0.5.4 — Admin Runtime Environment Fix

## Fixed

- Admin authentication now reads `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`
  dynamically at request time using `process.env[name]`.
- Prevents Next.js/Turbopack from baking an empty value into the server bundle
  when Netlify injects private variables at function runtime.
- Keeps the password input enabled and preserves signed, HTTP-only sessions.

## Netlify settings required

Create both variables with **All scopes** and **Same value in all deploy contexts**:

- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Then run **Clear cache and deploy site**.
