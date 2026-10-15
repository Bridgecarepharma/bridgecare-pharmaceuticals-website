# Bridgecare product verification — installation and operation

## What is included

- Public page: `/verify`; API: `POST /api/verify`.
- Protected admin: `/admin/verification` (existing administrator login).
- Products initially enabled: AsFenositol Tablets and Globivida Capsules.
- Separate link to NAFDAC Greenbook. Registration lookup does not authenticate an individual pack.
- Downloadable generic QR: `/images/verification/bridgecare-verify-qr.svg`. It opens `https://bridgecarepharmang.com/verify`. It contains no pack secret and scanning it does not mark a code as checked.
- Codes: 96 bits of cryptographic randomness, displayed as six groups of four hexadecimal characters. Only SHA-256 hashes are stored; plaintext is returned in the initial CSV download only.
- Batch activation/deactivation, individual code disabling from verification history, audit records and paginated verification history.

## Deploy

1. Upload this source into the existing GitHub repository. Use the existing Netlify build, not drag-and-drop of the source ZIP.
2. Keep the existing `DATABASE_URL`, `DIRECT_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` and `NEXT_PUBLIC_SITE_URL` environment settings. No new secret is required. The admin session secret must be configured for verification rate limiting. No production credentials are included in this ZIP.
3. The existing Netlify command runs `npm run db:migrate:deploy` before the build. The added additive migration is `20261015090000_pack_verification`. Do not reset the database. If deploying through a different pipeline, run `npm run db:migrate:deploy` before enabling the feature.
4. After deployment, open `/verify` and `/admin/verification`. Create a small real test batch in admin, save the CSV, activate it and test a first and repeat check. Deactivate this test batch afterwards; do not send its codes for commercial printing.
5. Confirm HTTP 429 appears after 30 checks from the same connection in a 15-minute window. The limiter trusts Netlify's `x-nf-client-connection-ip`; local/non-Netlify deployments without it share a fallback bucket. Verify forwarding under your Cloudflare/Netlify configuration. Configure equivalent trusted client-IP handling before moving to another host.

## Routine operation

- Enter the exact product, batch number, manufacture date and expiry date from the actual carton. Generate 1–5,000 codes per batch. This release supports one generation/export per product/batch. If a manufacturing batch has more than 5,000 packs, extend this limit/export workflow before commissioning labels; do not invent a different batch number that does not match the carton.
- Save the downloaded CSV securely, verify that it opens and keep an encrypted backup. Restrict access to authorised staff and your printer. Code downloads cannot be reconstructed from database hashes. Do not commit CSVs to GitHub, email them broadly or put them in the public website folder.
- If a download fails, leave that batch inactive and investigate; do not print or activate an unrecovered code set. Refresh the admin page after any failed operation. Do not simply repeat generation for the same manufacturing batch.
- Print the generic verification QR and `bridgecarepharmang.com/verify` visibly. Print a unique code beneath an opaque scratch-off panel on each pack, with appropriate tamper evidence. Never put the hidden code in the visible QR, a URL, analytics or server logs.
- Compare printer proofs against the CSV and actual carton batch/expiry. Activate only after printing and packaging are complete and the packs are ready for release.
- Deactivate compromised batches in admin. From the history table, individual checked codes may be permanently disabled. Review repeat, unrecognised, inactive and expired results. A repeat check can be the customer's own earlier check and is not proof of a counterfeit.
- Codes cannot be re-enabled individually. An inactive batch may be reactivated unless expired; disabled individual codes remain disabled.

## Customer results

- **Code recognised — first check:** issued code, first recorded successful check; compare product/batch/expiry with the pack.
- **Previously checked:** show first-check time; advise contacting Bridgecare if this is the customer's first check.
- **Unrecognised:** check typing and contact support.
- **Inactive:** not released or deactivated; contact support.
- **Expired:** advise against using expired products.
- **Service unavailable:** no verification claim is made. Existing store checkout is unaffected.

A valid code cannot guarantee authenticity; genuine codes can be copied. This is Bridgecare's own check, not NAFDAC pack authentication. The public page links to existing support/contact channels for suspicious-pack reports. It is not an SMS service.

## Privacy and maintenance

Raw client IP addresses and submitted plaintext codes are not stored. A session-secret-keyed IP/window hash supports a persistent rate bucket. Expired buckets are deleted when new buckets are opened. Verification events retain outcome, time and the internal code reference (where recognised); apply an appropriate operational retention policy. Existing infrastructure/CDN request logs remain governed by their separate settings. Never log submitted security codes.

## Validation

- `npm ci` (Node 20/22 as configured) installs locked dependencies.
- `npm run build` generates Prisma and builds Next.js with type checking.
- `npm run test:verification` runs security code tests and migration/route integration tests against local PostgreSQL-compatible PGlite. Prisma calls are adapted to SQL in the tests; a production Supabase end-to-end test still needs to be performed after deployment.
- Tests cover 5,000-code uniqueness, normalization, hashing and CSV safety; migration application; admin authentication and origin checks; inactive/active lifecycle; simultaneous first/repeat checks; disable/deactivate; expiry; unknown/malformed codes; rate limiting; and service unavailability.

Changed-file lint and production HTTP smoke checks also passed. Repository-wide lint still reports inherited issues in older source. A browser visual check could not run because the browser download was unavailable; check mobile presentation after deploying.

No production database was contacted, no production codes were issued, and this deliverable is not yet deployed.
