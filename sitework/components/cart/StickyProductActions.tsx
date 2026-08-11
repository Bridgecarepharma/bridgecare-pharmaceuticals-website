"use client";

import { ShoppingCart, Zap } from "lucide-react";
import { useCart } from "./CartProvider";

export function StickyProductActions({slug,name,priceKobo}:{slug:string;name:string;priceKobo:number}){
 const {add}=useCart();
 return <div className="product-sticky-actions" aria-label={`${name} purchase actions`}>
  <button type="button" className="product-sticky-add" onClick={()=>add({slug,name,priceKobo})}><ShoppingCart size={18}/>Add to cart</button>
  <button type="button" className="product-sticky-buy" onClick={()=>{window.localStorage.setItem('bridgecare-cart',JSON.stringify([{slug,name,priceKobo,quantity:1}]));window.location.assign('/checkout')}}>Buy now<Zap size={17}/></button>
 </div>;
}
