"use client";
import Image from "next/image";
import { useEffect,useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { formatNaira } from "@/lib/store";

type OrderItem={id:string;productSlug?:string|null;productName:string;quantity:number;lineTotalKobo:number};
type Order={orderNumber:string;paystackReference:string;status:string;subtotalKobo?:number;shippingKobo?:number;discountKobo?:number;couponCode?:string|null;totalKobo:number;recipientName:string;addressLine1:string;addressLine2?:string|null;city:string;lga:string;state:string;items:OrderItem[]};
type Fbq=(...args:unknown[])=>void;

function safeSlug(item:OrderItem){
 if(item.productSlug)return item.productSlug;
 return item.productName.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}

function fireVerifiedPurchase(order:Order){
 const storageKey=`bridgecare-meta-purchase:${order.paystackReference}`;
 try{if(window.localStorage.getItem(storageKey)==="sent")return()=>{}}catch{}

 const contentIds=order.items.map(safeSlug).filter(Boolean);
 const payload={
  value:Number((order.totalKobo/100).toFixed(2)),
  currency:"NGN",
  content_type:"product",
  content_ids:contentIds,
  num_items:order.items.reduce((sum,item)=>sum+item.quantity,0)
 };
 let attempts=0;
 const send=()=>{
  const fbq=(window as Window & {fbq?:Fbq}).fbq;
  if(typeof fbq!=="function")return false;
  // Keep Purchase deliberately simple: these are the same standard fields Meta
  // already accepts from the other working commerce events on this site.
  fbq("track","Purchase",payload);
  try{window.localStorage.setItem(storageKey,"sent")}catch{}
  return true;
 };
 if(send())return()=>{};
 const timer=window.setInterval(()=>{
  attempts+=1;
  if(send()||attempts>=40)window.clearInterval(timer);
 },250);
 return()=>window.clearInterval(timer);
}

export function OrderSuccessClient(){
 const params=useSearchParams();const reference=params.get("reference")||params.get("trxref");
 const {clear}=useCart();const[order,setOrder]=useState<Order|null>(null);const[error,setError]=useState("");const[loading,setLoading]=useState(true);
 useEffect(()=>{
  if(!reference){setError("The payment reference is missing.");setLoading(false);return}
  let cancelPurchaseRetry:(()=>void)|undefined;
  fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`,{cache:"no-store"})
   .then(r=>r.json().then(x=>({ok:r.ok,x})))
   .then(({ok,x})=>{
    if(!ok||!x.paid)throw new Error(x.error||"Payment has not been confirmed.");
    const verifiedOrder=x.order as Order;
    if(!verifiedOrder?.paystackReference||!verifiedOrder?.totalKobo)throw new Error("The verified order is incomplete.");
    // Fire Meta Purchase at the exact point server-side Paystack verification has
    // returned paid:true. Do this before cart/context changes can trigger re-renders.
    cancelPurchaseRetry=fireVerifiedPurchase(verifiedOrder);
    setOrder(verifiedOrder);
    clear();
   })
   .catch(e=>setError(e.message))
   .finally(()=>setLoading(false));
  return()=>{cancelPurchaseRetry?.()};
 // clear is intentionally omitted so clearing the cart does not trigger repeated verification.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[reference]);
 if(loading)return <section className="page-hero"><div className="container narrow"><h1>Confirming your payment…</h1><p>Please keep this page open while we verify the transaction.</p></div></section>;
 if(error)return <section className="page-hero"><div className="container narrow"><span className="eyebrow">Payment check</span><h1>We could not confirm the order</h1><p>{error}</p><div className="hero-actions" style={{justifyContent:"center"}}><Link className="button" href="/cart">Return to cart</Link><Link className="button secondary" href="/contact">Contact support</Link></div></div></section>;
 return <><section className="page-hero"><div className="container narrow"><span className="eyebrow">Payment successful</span><h1>Thank you for your order</h1><p>Your payment has been confirmed and your order is ready for processing.</p></div></section><section className="section"><div className="container prose"><div className="success-card"><h2>Order {order?.orderNumber}</h2><p><strong>Payment reference:</strong> {order?.paystackReference}</p><p><strong>Status:</strong> {order?.status}</p><h3>Delivery address</h3><p>{order?.recipientName}<br/>{order?.addressLine1}{order?.addressLine2?`, ${order.addressLine2}`:""}<br/>{order?.city}, {order?.lga}, {order?.state}</p><h3>Items</h3>{order?.items.map(i=><div className="receipt-row receipt-product" key={i.id}><Image src={`/images/products/${i.productName.toLowerCase().includes("aspivit")?"aspivit":i.productName.toLowerCase().includes("asfenositol")?"asfenositol":i.productName.toLowerCase().includes("globivida")?"globivida":"herbal-bitter-tea"}.png`} alt="" width={64} height={54}/><span>{i.productName} × {i.quantity}</span><strong>{formatNaira(i.lineTotalKobo)}</strong></div>)}{(order?.discountKobo||0)>0&&<div className="receipt-row"><span>Coupon {order?.couponCode}</span><strong>-{formatNaira(order?.discountKobo||0)}</strong></div>}<div className="receipt-row total"><span>Total paid</span><strong>{formatNaira(order?.totalKobo||0)}</strong></div><div className="hero-actions"><Link className="button" href="/products">Continue shopping</Link><Link className="button secondary" href="/contact">Contact support</Link></div></div></div></section></>
}
