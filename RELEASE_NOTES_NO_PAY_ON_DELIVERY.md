# Pay on Delivery disabled

- Removed Lagos Pay on Delivery from checkout; orders continue through Paystack.
- Closed the Pay on Delivery POST endpoint with HTTP 410, including requests from older checkout tabs. It performs no database writes.
- Existing Pay on Delivery order records and admin handling remain available.
- Shipping fees, free-shipping rules, coupons and online-payment logic are unchanged.

Deployment: update the source in the existing GitHub repository and deploy through the existing Netlify build. This ZIP is source code, not a static deployment bundle.
