# Version 2.1.6 — Buy Now checkout routing fix

- Buy Now no longer depends on a delayed React cart-state update.
- The selected product is written directly to browser storage before navigation.
- Buy Now always opens `/checkout` and never opens a Paystack shop/payment link.
- Paystack is opened only after the customer submits contact and delivery details on checkout.
