"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { cartPaymentLink, products } from "@/data/site";
import { formatNaira } from "@/lib/store";

export default function CartPage() {
  const { items, subtotalKobo, setQuantity, remove, clear } = useCart();
  const totalPacks = items.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryKobo = totalPacks >= 3 ? 0 : 0;

  if (!items.length) {
    return (
      <>
        <section className="page-hero"><div className="container narrow"><span className="eyebrow">Your basket</span><h1>Your cart is empty</h1><p>Add Bridgecare products to your cart, then continue to the secure combined-order Paystack page.</p></div></section>
        <section className="section"><div className="container narrow" style={{ textAlign: "center" }}><ShoppingBag size={48} style={{ margin: "0 auto 1rem" }} /><Link className="button" href="/products">Browse products</Link></div></section>
      </>
    );
  }

  return (
    <>
      <section className="page-hero"><div className="container narrow"><span className="eyebrow">Your basket</span><h1>Review your order</h1><p>Check your products and quantities before continuing to Bridgecare’s secure Paystack cart payment page.</p></div></section>
      <section className="section"><div className="container checkout-grid">
        <div className="cart-list">
          {items.map(item => {
            const product = products.find(p => p.slug === item.slug);
            return <article className="cart-row" key={item.slug}>
              <div className="cart-thumb">{product && <Image src={product.image} alt="" fill sizes="84px" />}</div>
              <div><h3>{item.name}</h3><p>{formatNaira(item.priceKobo)} per pack</p></div>
              <div className="cart-quantity" aria-label={`Quantity for ${item.name}`}>
                <button type="button" onClick={() => setQuantity(item.slug, item.quantity - 1)} aria-label="Reduce quantity"><Minus size={16}/></button>
                <strong>{item.quantity}</strong>
                <button type="button" onClick={() => setQuantity(item.slug, item.quantity + 1)} aria-label="Increase quantity"><Plus size={16}/></button>
              </div>
              <strong>{formatNaira(item.priceKobo * item.quantity)}</strong>
              <button className="text-button" type="button" onClick={() => remove(item.slug)} aria-label={`Remove ${item.name}`}><Trash2 size={17}/> Remove</button>
            </article>;
          })}
          <div className="cart-actions"><Link className="button secondary" href="/products">Continue shopping</Link><button className="text-button" type="button" onClick={clear}>Clear cart</button></div>
        </div>

        <aside className="order-summary">
          <h2>Order summary</h2>
          <div><span>Total packs</span><strong>{totalPacks}</strong></div>
          <div><span>Products subtotal</span><strong>{formatNaira(subtotalKobo)}</strong></div>
          <div><span>Delivery</span><strong>{totalPacks >= 3 ? "Free" : "Confirmed after payment"}</strong></div>
          <hr />
          <div className="summary-total"><span>Product total</span><strong>{formatNaira(subtotalKobo + deliveryKobo)}</strong></div>
          <a className="button full" href={cartPaymentLink} target="_blank" rel="noopener noreferrer">Continue to Paystack <ExternalLink size={18}/></a>
          <p className="secure-note">The Paystack cart link opens in a secure new tab. Use this order summary when entering or confirming your payment details.</p>
          <div className="notice" style={{ marginTop: "1rem" }}><strong>Delivery:</strong> Free shipping applies to any three packs or more. For fewer than three packs, Lagos delivery is ₦2,500 and delivery outside Lagos is ₦3,000.</div>
        </aside>
      </div></section>
    </>
  );
}
