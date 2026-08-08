"use client";
import { useEffect } from "react";

type Fbq = (...args: unknown[]) => void;
function getFbq(): Fbq | undefined { return (window as Window & { fbq?: Fbq }).fbq; }
function whenFbqReady(send: (fbq: Fbq) => void) {
  let attempts=0;
  const trySend=()=>{ const fbq=getFbq(); if(fbq){send(fbq);return true} return false };
  if(trySend()) return ()=>{};
  const timer=window.setInterval(()=>{attempts+=1;if(trySend()||attempts>=20)window.clearInterval(timer)},250);
  return ()=>window.clearInterval(timer);
}
export function MetaProductView({slug,name,priceKobo}:{slug:string;name:string;priceKobo:number}){
 useEffect(()=>whenFbqReady(fbq=>fbq("track","ViewContent",{content_ids:[slug],content_name:name,content_type:"product",value:Number((priceKobo/100).toFixed(2)),currency:"NGN"})),[slug,name,priceKobo]);
 return null;
}
export function MetaInitiateCheckout({items,subtotalKobo}:{items:{slug:string;name:string;priceKobo:number;quantity:number}[];subtotalKobo:number}){
 const signature=items.map(i=>`${i.slug}:${i.quantity}:${i.priceKobo}`).join("|");
 useEffect(()=>{if(!items.length)return;return whenFbqReady(fbq=>fbq("track","InitiateCheckout",{content_ids:items.map(i=>i.slug),contents:items.map(i=>({id:i.slug,quantity:i.quantity,item_price:Number((i.priceKobo/100).toFixed(2))})),content_type:"product",num_items:items.reduce((n,i)=>n+i.quantity,0),value:Number((subtotalKobo/100).toFixed(2)),currency:"NGN"}))},[signature,subtotalKobo]);
 return null;
}
export function trackMetaAddToCart({slug,name,priceKobo}:{slug:string;name:string;priceKobo:number}){
 const send=(fbq:Fbq)=>fbq("track","AddToCart",{content_ids:[slug],content_name:name,content_type:"product",contents:[{id:slug,quantity:1,item_price:Number((priceKobo/100).toFixed(2))}],value:Number((priceKobo/100).toFixed(2)),currency:"NGN"});
 const fbq=getFbq(); if(fbq)send(fbq); else whenFbqReady(send);
}
