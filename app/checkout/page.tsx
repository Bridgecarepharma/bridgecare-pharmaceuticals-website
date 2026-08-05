"use client";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, LockKeyhole, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatNaira } from "@/lib/store";
import {
  calculateShippingForZoneKobo,
  DEFAULT_FREE_SHIPPING_PACK_COUNT,
  DEFAULT_SHIPPING_ZONES,
  type ShippingZoneView,
} from "@/lib/shipping-rates";

const STATES=["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara","Abuja"];

type ShippingConfiguration = { zones: ShippingZoneView[]; freeShippingPackCount: number };

export default function CheckoutPage(){
 const {items,subtotalKobo}=useCart();
 const [state,setState]=useState("Lagos");
 const [shippingZoneCode,setShippingZoneCode]=useState("LAGOS");
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState("");
 const [shipping,setShipping]=useState<ShippingConfiguration>({zones:DEFAULT_SHIPPING_ZONES,freeShippingPackCount:DEFAULT_FREE_SHIPPING_PACK_COUNT});
 const packCount=useMemo(()=>items.reduce((sum,item)=>sum+item.quantity,0),[items]);
 const activeZones=useMemo(()=>shipping.zones.filter(zone=>zone.isActive).sort((a,b)=>a.sortOrder-b.sortOrder),[shipping.zones]);
 const selectedZone=useMemo(()=>activeZones.find(zone=>zone.code===shippingZoneCode),[activeZones,shippingZoneCode]);
 const shippingKobo=useMemo(()=>calculateShippingForZoneKobo(shippingZoneCode,state,packCount,shipping.zones,shipping.freeShippingPackCount)??0,[shippingZoneCode,state,packCount,shipping]);
 const zoneMatchesState=Boolean(selectedZone?.states.includes(state));
 const totalKobo=subtotalKobo+shippingKobo;

 useEffect(()=>{
  let active=true;
  fetch("/api/shipping/rates",{cache:"no-store"})
   .then(response=>response.ok?response.json():Promise.reject(new Error("Unable to load delivery charges")))
   .then((data:ShippingConfiguration)=>{
    if(active&&Array.isArray(data.zones)){
     setShipping(data);
     const matching=data.zones.find(zone=>zone.isActive&&zone.states.includes(state));
     if(matching)setShippingZoneCode(matching.code);
    }
   })
   .catch(()=>{});
  return()=>{active=false};
 },[]);

 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();setError("");
  if(!items.length){setError("Your cart is empty.");return}
  if(!selectedZone||!zoneMatchesState){setError("Please select the delivery zone that matches your delivery state.");return}
  setLoading(true);
  try{
   const data=new FormData(event.currentTarget);
   const payload={
    customer:{fullName:data.get("fullName"),email:data.get("email"),phone:data.get("phone")},
    delivery:{recipientName:data.get("recipientName"),recipientPhone:data.get("recipientPhone"),addressLine1:data.get("addressLine1"),addressLine2:data.get("addressLine2"),landmark:data.get("landmark"),city:data.get("city"),lga:data.get("lga"),state:data.get("state"),postalCode:data.get("postalCode"),deliveryInstructions:data.get("deliveryInstructions"),deliveryMethod:"standard",shippingZoneCode:data.get("shippingZoneCode")},
    items:items.map(i=>({slug:i.slug,quantity:i.quantity}))
   };
   const response=await fetch("/api/paystack/initialize",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
   const result=await response.json().catch(()=>({}));
   if(!response.ok)throw new Error(result.error||"Unable to start payment.");
   if(!result.authorizationUrl)throw new Error("Paystack did not return a payment page. Please try again.");
   window.location.assign(result.authorizationUrl);
  }catch(e){setError(e instanceof Error?e.message:"Unable to continue.");setLoading(false)}
 }

 if(!items.length)return <section className="page-hero"><div className="container narrow"><h1>Your cart is empty</h1><p>Add products before checking out.</p><Link className="button" href="/products">Shop products</Link></div></section>;

 return <><section className="checkout-hero-v3"><div className="container"><div><span className="eyebrow">Secure checkout</span><h1>Complete your order</h1><p>Enter your contact and delivery information, review your order, then continue securely to Paystack.</p></div><div className="checkout-steps"><span className="active"><b>1</b>Details</span><i/><span><b>2</b>Payment</span><i/><span><b>3</b>Confirmation</span></div></div></section>
 <section className="section checkout-section-v3"><div className="container checkout-grid"><form className="form checkout-form checkout-form-v3" onSubmit={submit}>
 <h2>Customer information</h2><div className="form-row"><label>Full name<input name="fullName" required autoComplete="name"/></label><label>Email<input name="email" type="email" required autoComplete="email"/></label></div><label>Phone number<input name="phone" required autoComplete="tel"/></label>
 <h2>Delivery address</h2><div className="form-row"><label>Recipient name<input name="recipientName" required/></label><label>Recipient phone<input name="recipientPhone" required/></label></div>
 <label>House number and street address<input name="addressLine1" required autoComplete="address-line1"/></label><label>Apartment, estate or additional address<input name="addressLine2" autoComplete="address-line2"/></label>
 <div className="form-row"><label>Landmark<input name="landmark"/></label><label>City<input name="city" required autoComplete="address-level2"/></label></div>
 <div className="form-row"><label>Local Government Area<input name="lga" required/></label><label>State<select name="state" value={state} onChange={e=>{const nextState=e.target.value;setState(nextState);const matching=activeZones.find(zone=>zone.states.includes(nextState));if(matching)setShippingZoneCode(matching.code)}} required>{STATES.map(x=><option key={x}>{x}</option>)}</select></label></div>
 <label>Postal code (optional)<input name="postalCode" autoComplete="postal-code"/></label><label>Delivery instructions (optional)<textarea name="deliveryInstructions" placeholder="Gate code, preferred contact method, or directions for the rider."/></label>
 <h2>Delivery method</h2><input type="hidden" name="deliveryMethod" value="standard"/><div className="shipping-zone-list">{activeZones.map(zone=>{const free=shipping.freeShippingPackCount>0&&packCount>=shipping.freeShippingPackCount;return <label className={`radio-card shipping-zone-option${shippingZoneCode===zone.code?" selected":""}`} key={zone.code}><input type="radio" name="shippingZoneCode" value={zone.code} checked={shippingZoneCode===zone.code} onChange={()=>{setShippingZoneCode(zone.code);if(!zone.states.includes(state))setState(zone.states[0]||state)}}/><span><strong>{zone.name}</strong><small>{free?"Free delivery":formatNaira(zone.priceKobo)}</small></span></label>})}</div>{shipping.freeShippingPackCount>0&&<p className="shipping-threshold-note">Free delivery applies automatically when the cart contains {shipping.freeShippingPackCount} or more packs.</p>}
 {error&&<div className="error-box">{error}</div>}<button className="button full" disabled={loading||!selectedZone||!zoneMatchesState}>{loading?"Opening Paystack…":`Pay ${formatNaira(totalKobo)} securely`}</button><p className="secure-note">Your order and delivery address are saved before payment. Payment status is confirmed by the server and Paystack webhook.</p>
 </form>
 <aside className="order-summary order-summary-v3"><div className="summary-secure"><ShieldCheck size={22}/><span><strong>Secure checkout</strong><small>Your payment is processed by Paystack.</small></span></div><h2>Order summary</h2>{items.map(i=><div className="summary-product" key={i.slug}><Image src={`/images/products/${i.slug}.png`} alt="" width={58} height={48}/><span>{i.name} × {i.quantity}</span><strong>{formatNaira(i.priceKobo*i.quantity)}</strong></div>)}<hr/><div><span>Subtotal</span><strong>{formatNaira(subtotalKobo)}</strong></div><div><span>Delivery</span><strong>{selectedZone?formatNaira(shippingKobo):"Unavailable"}</strong></div><div className="summary-total"><span>Total</span><strong>{formatNaira(totalKobo)}</strong></div><div className="checkout-confidence"><span><LockKeyhole size={17}/> Encrypted payment</span><span><Truck size={17}/> Delivery details confirmed</span><span><CheckCircle2 size={17}/> Order saved before payment</span></div></aside>
 </div></section></>
}
