# Bridgecare integrated checkout launch

This build provides a cart, delivery form, server-calculated shipping, Paystack transaction initialization, payment verification, webhook processing, order storage, inventory and the admin dashboard.

## 1. Rotate the exposed Paystack secret key

The live key previously shown in a screenshot must not be used. In Paystack, generate a new live secret key and revoke the exposed one. Do not commit any secret key to GitHub.

Use a Paystack **test secret key** until checkout testing is complete.

## 2. Create Supabase PostgreSQL

1. Create a Supabase project.
2. Open **Project Settings → Database → Connection string**.
3. Choose the pooled/session connection string suitable for serverless hosting.
4. Copy it and replace the password placeholder with the database password.
5. Save the entire connection string as `DATABASE_URL` in Netlify.

The deployment command runs `prisma migrate deploy`, which creates the order, payment, inventory, customer and admin audit tables.

## 3. Add Netlify environment variables

Add these under **Project configuration → Environment variables**:

- `NEXT_PUBLIC_SITE_URL` = `https://bridgecarepharmang.com`
- `NEXT_PUBLIC_CONTACT_EMAIL` = `info@bridgecarepharmang.com`
- `DATABASE_URL` = Supabase pooled PostgreSQL connection string
- `PAYSTACK_SECRET_KEY` = Paystack test secret key initially
- `ALLOW_PAYSTACK_FALLBACK` = `false`
- `ADMIN_PASSWORD` = a strong private password
- `ADMIN_SESSION_SECRET` = a random string of at least 32 characters

Do not add quotes around values in the Netlify form.

## 4. Paystack callback and webhook

The application initializes each payment with this callback:

`https://bridgecarepharmang.com/order-success`

In Paystack, set the webhook URL to:

`https://bridgecarepharmang.com/api/paystack/webhook`

The webhook validates `x-paystack-signature`, checks the amount and currency, marks the order paid and deducts inventory only once.

## 5. Shipping rules already configured

- Lagos: ₦2,500
- Other Nigerian states: ₦3,000
- Three packs or more: free shipping

## 6. Deploy and test

1. Commit this project to the GitHub `main` branch.
2. In Netlify, run **Clear cache and deploy site**.
3. Add stock quantities from `/admin/inventory` before testing checkout.
4. Place an order using Paystack test mode.
5. Confirm the order appears in `/admin/orders` and payment becomes `PAID`.
6. Confirm the inventory quantity decreases once.
7. Only after successful testing, replace the test key with the newly rotated live secret key and deploy again.
