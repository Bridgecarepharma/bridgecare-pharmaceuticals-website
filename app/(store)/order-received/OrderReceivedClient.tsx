"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { formatNaira } from "@/lib/store";

type Order={orderNumber:string;paystackReference:string;totalKobo:number;customerPhone:string;recipientName:string;addressLine1:string;addressLine2?:string|null;city:string;lga:string;state:string;paymentChannel?:string|null};
export default function OrderReceived(){
 const params=useSearchParams();const reference=params.get("reference")||"";const{clear}=useCart();const[order,setOrder]=useState<Order|null>(null);const[error,setError]=useState("");
 useEffect(()=>{if(!reference){setError("Order reference is missing.");return}fetch(`/api/orders/${encodeURIComponent(reference)}`,{cache:"no-store"}).then(async r=>{const x=await r.json();if(!r.ok)throw new Error(x.error||"Order not found");return x.order as Order}).then(o=>{setOrder(o);clear()}).catch(e=>setError(e instanceof Error?e.message:"Unable to load order."))},[reference]);
 if(error)return <section className="page-hero"><div className="container narrow"><h1>We could not load the order</h1><p>{error}</p><Link className="button" href="/contact">Contact support</Link></div></section>;
 if(!order)return <section className="page-hero"><div className="container narrow"><h1>Saving your order…</h1></div></section>;
 return <><section className="page-hero"><div className="container narrow"><span className="eyebrow">Order received</span><h1>Your Pay on Delivery order is confirmed</h1><p>Thank you. Bridgecare may call or WhatsApp you to confirm the Lagos delivery before dispatch.</p></div></section><section className="section"><div className="container prose"><div className="success-card"><h2>Order {order.orderNumber}</h2><p><strong>Payment method:</strong> Pay on Delivery</p><p><strong>Amount due on delivery:</strong> {formatNaira(order.totalKobo)}</p><p><strong>Delivery address:</strong><br/>{order.recipientName}<br/>{order.addressLine1}{order.addressLine2?`, ${order.addressLine2}`:""}<br/>{order.city}, {order.lga}, {order.state}</p><p>Please keep your phone available. Our team may contact you before the order is dispatched.</p><div className="hero-actions"><Link className="button" href="/products">Continue shopping</Link><Link className="button secondary" href="/contact">Contact support</Link></div></div></div></section></>;
}
