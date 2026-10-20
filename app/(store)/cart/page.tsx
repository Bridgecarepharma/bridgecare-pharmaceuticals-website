"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatNaira } from "@/lib/store";

export default function CartPage(){
 const {items,subtotalKobo,remove,setQuantity}=useCart();
 const packCount=items.reduce((sum,item)=>sum+item.quantity,0);
 const packsToFree=Math.max(0,4-packCount);
 return <><section className="page-hero"><div className="container narrow"><span className="eyebrow">Your order</span><h1>Shopping Cart</h1><p>Review your products before entering delivery details and paying securely with Paystack.</p></div></section>
 <section className="section"><div className="container">
 {items.length===0?<div className="prose"><h2>Your cart is empty</h2><p>Add a product to begin your order.</p><Link className="button" href="/products">Shop products</Link></div>:
 <div className="checkout-grid"><div className="cart-list">{items.map(item=><article className="cart-row" key={item.slug}><div className="cart-thumb"><Image src={`/images/products/${item.slug}.png`} alt={`${item.name} product pack`} fill sizes="84px"/></div><div><h3>{item.name}</h3><p>{formatNaira(item.priceKobo)} each</p></div><label>Quantity<input type="number" min={1} max={20} value={item.quantity} onChange={e=>setQuantity(item.slug,Number(e.target.value))}/></label><strong>{formatNaira(item.priceKobo*item.quantity)}</strong><button className="text-button" onClick={()=>remove(item.slug)}>Remove</button></article>)}</div>
 <aside className="order-summary"><h2>Order summary</h2><div><span>Subtotal</span><strong>{formatNaira(subtotalKobo)}</strong></div>{packCount>=4?<div className="cart-free-delivery unlocked"><strong>✓ FREE delivery unlocked</strong><span>Your order has {packCount} packs.</span></div>:<div className="cart-free-delivery"><strong>Add {packsToFree} more pack{packsToFree===1?"":"s"} for FREE delivery</strong><span>Free nationwide delivery starts at 4 packs.</span></div>}<p>Delivery is calculated from your selected region at checkout.</p><Link className="button full" href="/checkout">Continue to checkout</Link></aside></div>}
 </div></section></>
}
