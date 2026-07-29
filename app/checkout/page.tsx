"use client";
import Image from "next/image";
import { FormEvent,useMemo,useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { FREE_SHIPPING_PACK_COUNT,formatNaira,shippingFeeForOrder } from "@/lib/store";

const STATES=["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara","Abuja"];

export default function CheckoutPage(){
 const {items,subtotalKobo}=useCart();
 const [state,setState]=useState("Lagos");
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState("");
 const packCount=useMemo(()=>items.reduce((sum,item)=>sum+item.quantity,0),[items]);
 const shippingKobo=useMemo(()=>shippingFeeForOrder(state,packCount),[state,packCount]);
 const totalKobo=subtotalKobo+shippingKobo;

 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();setError("");
  if(!items.length){setError("Your cart is empty.");return}
  setLoading(true);
  try{
   const data=new FormData(event.currentTarget);
   const payload={
    customer:{fullName:data.get("fullName"),email:data.get("email"),phone:data.get("phone")},
    delivery:{recipientName:data.get("recipientName"),recipientPhone:data.get("recipientPhone"),addressLine1:data.get("addressLine1"),addressLine2:data.get("addressLine2"),landmark:data.get("landmark"),city:data.get("city"),lga:data.get("lga"),state:data.get("state"),postalCode:data.get("postalCode"),deliveryInstructions:data.get("deliveryInstructions"),deliveryMethod:"standard"},
    items:items.map(i=>({slug:i.slug,quantity:i.quantity}))
   };
   const response=await fetch("/api/paystack/initialize",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
   const result=await response.json();
   if(!response.ok)throw new Error(result.error||"Unable to start payment.");
   window.location.href=result.authorizationUrl;
  }catch(e){setError(e instanceof Error?e.message:"Unable to continue.");setLoading(false)}
 }

 if(!items.length)return <section className="page-hero"><div className="container narrow"><h1>Your cart is empty</h1><p>Add products before checking out.</p><Link className="button" href="/products">Shop products</Link></div></section>;

 return <><section className="page-hero"><div className="container narrow"><span className="eyebrow">Secure checkout</span><h1>Delivery & Payment</h1><p>Enter the delivery address before continuing to Paystack.</p></div></section>
 <section className="section"><div className="container checkout-grid"><form className="form checkout-form" onSubmit={submit}>
 <h2>Customer information</h2><div className="form-row"><label>Full name<input name="fullName" required autoComplete="name"/></label><label>Email<input name="email" type="email" required autoComplete="email"/></label></div><label>Phone number<input name="phone" required autoComplete="tel"/></label>
 <h2>Delivery address</h2><div className="form-row"><label>Recipient name<input name="recipientName" required/></label><label>Recipient phone<input name="recipientPhone" required/></label></div>
 <label>House number and street address<input name="addressLine1" required autoComplete="address-line1"/></label><label>Apartment, estate or additional address<input name="addressLine2" autoComplete="address-line2"/></label>
 <div className="form-row"><label>Landmark<input name="landmark"/></label><label>City<input name="city" required autoComplete="address-level2"/></label></div>
 <div className="form-row"><label>Local Government Area<input name="lga" required/></label><label>State<select name="state" value={state} onChange={e=>setState(e.target.value)} required>{STATES.map(x=><option key={x}>{x}</option>)}</select></label></div>
 <label>Postal code (optional)<input name="postalCode" autoComplete="postal-code"/></label><label>Delivery instructions (optional)<textarea name="deliveryInstructions" placeholder="Gate code, preferred contact method, or directions for the rider."/></label>
 <h2>Delivery method</h2><input type="hidden" name="deliveryMethod" value="standard"/><div className="radio-card"><span aria-hidden="true">●</span><span><strong>Standard delivery</strong><small>{shippingKobo===0?`Free delivery for ${FREE_SHIPPING_PACK_COUNT}+ packs`:formatNaira(shippingKobo)}</small></span></div>
 {error&&<div className="error-box">{error}</div>}<button className="button full" disabled={loading}>{loading?"Opening Paystack…":`Pay ${formatNaira(totalKobo)} securely`}</button><p className="secure-note">Your order and delivery address are saved before payment. Payment status is confirmed by the server and Paystack webhook.</p>
 </form>
 <aside className="order-summary"><h2>Order summary</h2>{items.map(i=><div className="summary-product" key={i.slug}><Image src={`/images/products/${i.slug}.png`} alt="" width={58} height={48}/><span>{i.name} × {i.quantity}</span><strong>{formatNaira(i.priceKobo*i.quantity)}</strong></div>)}<hr/><div><span>Subtotal</span><strong>{formatNaira(subtotalKobo)}</strong></div><div><span>Delivery</span><strong>{formatNaira(shippingKobo)}</strong></div><div className="summary-total"><span>Total</span><strong>{formatNaira(totalKobo)}</strong></div></aside>
 </div></section></>
}
