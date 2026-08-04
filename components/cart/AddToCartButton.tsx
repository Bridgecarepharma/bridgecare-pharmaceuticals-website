"use client";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";
export function AddToCartButton({slug,name,priceKobo}:{slug:string;name:string;priceKobo:number}){
 const {add}=useCart();
 return <button className="button" onClick={()=>add({slug,name,priceKobo})}><ShoppingCart size={18}/> Add to cart</button>
}
