"use client";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";
export function CartLink(){const {count,openCart}=useCart();return <button type="button" onClick={openCart} className="cart-link" aria-label={`Cart with ${count} items`}><ShoppingBag size={20}/><span>{count}</span></button>}
