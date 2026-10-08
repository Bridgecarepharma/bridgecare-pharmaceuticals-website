# Outside-Lagos bus park checkout

- Lagos retains the full delivery address form.
- Outside Lagos, delivery details require only state, city, and nearest bus park / bus station. Contact details remain required.
- Server validation requires a bus park outside Lagos and a street address plus LGA in Lagos.
- Pickup destinations are saved in the existing order address field and shown on receipts, admin documents and waybills. No database migration is required.
- Pay on Delivery remains disabled; Paystack and shipping/coupon calculations remain available.

Deploy the source using the existing GitHub/Netlify workflow.

Validation: conditional schema checks passed for Lagos and non-Lagos orders, including missing/blank bus parks, missing city/state, stale address fields, and required Lagos street/LGA. TypeScript/TSX syntax checks passed for changed files. A full production build was not run.
