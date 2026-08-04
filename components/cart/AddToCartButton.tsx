"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartProvider";

export function AddToCartButton({ slug, name, priceKobo }: { slug: string; name: string; priceKobo: number }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add({ slug, name, priceKobo });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button className="button" type="button" onClick={handleAdd} aria-label={`Add ${name} to cart`}>
      <ShoppingCart size={18} /> {added ? "Added to cart" : "Add to cart"}
    </button>
  );
}
