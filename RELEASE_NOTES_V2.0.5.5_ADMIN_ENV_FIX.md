# Bridgecare v2.0.5.5 — Netlify Admin Environment Fix

## Fixed
- Changed admin environment-variable reads from dynamic bracket access (`process.env[name]`) to static server references:
  - `process.env.ADMIN_PASSWORD`
  - `process.env.ADMIN_SESSION_SECRET`
- Forced the admin login API route to use the Node.js runtime and dynamic execution.
- This allows Next.js/Netlify to trace the private variables into the deployed server function.

## Netlify setup
Create both variables with these exact keys:
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Apply them to all scopes and deploy contexts, then use **Clear cache and deploy site**.
