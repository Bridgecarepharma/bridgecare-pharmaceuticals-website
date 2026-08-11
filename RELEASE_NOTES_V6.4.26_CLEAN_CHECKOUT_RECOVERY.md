# Bridgecare v6.4.26 — Clean Checkout Recovery

Built from the user-uploaded project package after the Git merge conflict.

## Checkout changes only
- Combined customer and delivery details under **Contact & delivery information**.
- Removed duplicate Recipient name and Recipient phone inputs from the checkout UI.
- Full name and phone number are still sent internally as recipientName and recipientPhone so existing order/database logic remains compatible.
- Removed Postal code from the checkout UI; an empty postalCode value is still sent for schema/API compatibility.
- Sticky payment button wording remains dynamic: **Checkout ₦[total] securely**.
- Preserved existing Paystack initialization, coupon logic, shipping zones, free-shipping threshold, cart behavior, Meta tracking and TikTok tracking.
- No intentional homepage/mobile storefront redesign.

## Merge recovery
- Packaged from a clean source tree with no unresolved Git conflict markers in application source files.
