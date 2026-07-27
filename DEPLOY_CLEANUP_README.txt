BRIDGECARE FAMILY HEALTH v1.8 - CLEAN DEPLOY

IMPORTANT: Do not upload these files on top of the old repository without deleting old source files first.

Delete these stale e-commerce paths from the GitHub repository before uploading this package:
- app/cart/
- app/checkout/
- app/api/
- components/cart/
- lib/store.ts
- lib/prisma.ts
- prisma/

This release is a public static website. It intentionally does not include cart, checkout, Paystack, Prisma, database, or API routes.

Recommended clean replacement:
1. Download the current GitHub repository as a backup.
2. Delete all files/folders in the repository except .git (when using GitHub Desktop/VS Code).
3. Copy all contents of this package into the repository root.
4. Commit and push.
5. In Netlify, clear cache and deploy site.

Netlify settings:
- Build command: npm run build
- Publish directory: out
- Node version: 20
