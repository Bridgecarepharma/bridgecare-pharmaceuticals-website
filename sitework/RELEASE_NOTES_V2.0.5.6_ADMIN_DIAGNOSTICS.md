# Bridgecare v2.0.5.6 — Admin Deployment Diagnostics

- Added a safe `/api/admin/status` endpoint that reports whether required admin variables are visible without exposing their values.
- Login page now identifies the Netlify site/deploy URL currently serving the request.
- Login page shows separate password/secret configuration checks.
- Forced the admin login page and status endpoint to execute dynamically in the Node.js runtime.
- Added no-store caching headers to admin configuration failures.
