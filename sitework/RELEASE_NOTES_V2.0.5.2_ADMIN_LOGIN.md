# Bridgecare v2.0.5.2 — Admin Login Fix

- Standardized admin authentication around `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.
- Added constant-time password comparison.
- Added signed, eight-hour HTTP-only admin sessions.
- Added clear configuration diagnostics on the login screen.
- Added best-effort login rate limiting.
- Redirects successful sign-in to `/admin`.
- Redirects already authenticated admins away from `/admin/login`.
- Hardened sign-out cookie removal.
- Added setup documentation.
