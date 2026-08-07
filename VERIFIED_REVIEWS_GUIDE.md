# Bridgecare Verified Reviews v6.3.0

## Admin
Open `/admin/reviews` to approve, reject, archive, feature or reply to reviews.

## Customer verification
Customers may enter their Bridgecare order number and the email used at checkout. A review receives the **Verified Purchase** badge only when the database contains a paid, processing, packed, dispatched or delivered order with the same email and product.

## Moderation
Every new review starts as `PENDING` and is invisible publicly until an administrator changes it to `APPROVED`.

## Review images
This first release accepts up to three public HTTPS image URLs. A managed media upload service can be connected in a later release.

## Deployment
Netlify runs `prisma migrate deploy` before the Next.js build. Confirm both `DATABASE_URL` and `DIRECT_URL` remain available to Builds.
