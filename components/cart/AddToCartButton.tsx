"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { trackMetaAddToCart } from "@/components/analytics/MetaCommerceEvents";
import { trackTikTokAddToCart } from "@/components/analytics/TikTokCommerceEvents";

export function AddToCartButton({
  slug,
  name,
  priceKobo,
}: {
  slug: string;
  name: string;
  priceKobo: number;
}) {
  const { add } = useCart();
  const router = useRouter();

  function orderNow() {
    add({ slug, name, priceKobo });
    trackMetaAddToCart({ slug, name, priceKobo });
    trackTikTokAddToCart({ slug, name, priceKobo });
    router.push("/checkout");
  }

  return (
    <button type="button" className="button" onClick={orderNow}>
      <ShoppingBag size={18} /> Order now
    </button>
  );
}
