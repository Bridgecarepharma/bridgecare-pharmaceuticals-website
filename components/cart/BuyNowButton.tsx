"use client";

import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";

export function BuyNowButton({slug,name,priceKobo}:{slug:string;name:string;priceKobo:number}){
  const router=useRouter();
  const {buyNow}=useCart();

  function handleBuyNow(){
    buyNow({slug,name,priceKobo});
    router.push("/checkout");
  }

  return <button type="button" className="button buy-now-button" onClick={handleBuyNow}>Buy now <ExternalLink size={17}/></button>;
}
