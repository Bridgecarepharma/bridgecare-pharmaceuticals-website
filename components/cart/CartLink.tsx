"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";
export function CartLink(){const {count}=useCart();return <Link href="/cart" className="cart-link" aria-label={`Cart with ${count} items`}><ShoppingBag size={20}/><span>{count}</span></Link>}
