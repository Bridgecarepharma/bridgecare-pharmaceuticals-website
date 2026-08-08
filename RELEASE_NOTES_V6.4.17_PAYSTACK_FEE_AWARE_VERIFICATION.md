# v6.4.17 — Paystack fee-aware verification

Fixes successful payments being rejected when Paystack passes its transaction fee
to the customer and therefore reports a charged amount above the Bridgecare order total.

Verification still requires successful provider status, matching reference/order,
matching currency, exact signed metadata order ID, exact signed metadata order total,
and a provider charge that is not below the stored order total.

Updated both browser verification and the signed Paystack webhook.
