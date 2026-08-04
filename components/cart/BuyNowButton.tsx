"use client";

import { Zap } from "lucide-react";

type BuyNowButtonProps = {
  slug: string;
  name: string;
  priceKobo: number;
};

/**
 * Starts a one-product checkout without using any Paystack shop link.
 * The cart is written synchronously before navigation so checkout always
 * has the customer's selected product available on first render.
 */
export function BuyNowButton({ slug, name, priceKobo }: BuyNowButtonProps) {
  function handleBuyNow() {
    const item = [{ slug, name, priceKobo, quantity: 1 }];
    window.localStorage.setItem("bridgecare-cart", JSON.stringify(item));
    window.location.assign("/checkout");
  }

  return (
    <button type="button" className="button buy-now-button" onClick={handleBuyNow}>
      Buy now <Zap size={17} aria-hidden="true" />
    </button>
  );
}
