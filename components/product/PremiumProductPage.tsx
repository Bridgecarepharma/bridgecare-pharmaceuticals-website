import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { BuyNowButton } from "@/components/cart/BuyNowButton";
import { BrandIcon } from "./BrandIcon";
import { IngredientCard, SafetyPanel, SectionTitle } from "./ProductPageSections";
import { formatNaira } from "@/lib/store";
import { BadgeCheck, Headphones, LockKeyhole, Truck } from "lucide-react";
import type { Product } from "@/data/products";
import { PRODUCTS } from "@/data/products";

export function PremiumProductPage({ product }: { product: Product }) {
  const complete = product.ingredients.length > 0;
  const related = PRODUCTS.filter(p => p.slug !== product.slug).slice(0,3);

  if (product.slug === "aspivit") {
    const composition = [
      ["EPA", "90 mg"], ["DHA", "60 mg"], ["Vitamin A", "900 mcg"],
      ["Vitamin B6", "1 mg"], ["Vitamin C", "40 mg"], ["Vitamin D3", "400 IU"],
      ["Vitamin E", "15 mg"], ["Folic Acid", "400 mcg"], ["Selenium", "40 mcg"],
      ["Magnesium", "2 mg"], ["Chromium", "35 mcg"], ["Copper", "1 mg"],
      ["Zinc Sulphate", "7.5 mg"]
    ];
    const benefits = [
      "Supports healthy brain function and cognitive performance.",
      "Promotes normal vision and helps maintain eye health.",
      "Strengthens the immune system.",
      "Provides antioxidant protection against free radical damage.",
      "Supports cardiovascular health.",
      "Helps maintain healthy skin and hair.",
      "Promotes healthy bones and muscles.",
      "Supports normal energy metabolism and reduces nutritional deficiencies.",
      "Helps maintain healthy nerve function.",
      "Supports red blood cell formation and overall vitality."
    ];
    const whyChoose = [
      "Premium Omega-3 (EPA & DHA) formulation.",
      "Comprehensive multivitamin and multimineral supplement.",
      "Manufactured in India under GMP-certified facilities.",
      "Film-coated tablet for easy swallowing.",
      "High-quality ingredients for maximum nutritional support.",
      "Suitable for everyday wellness and nutritional maintenance."
    ];
    const warnings = [
      "Do not exceed the recommended daily dose.",
      "Food supplements should not be used as a substitute for a varied and balanced diet.",
      "Keep out of reach of children.",
      "Consult your physician before use if you are pregnant, nursing, taking medication, or have any medical condition.",
      "Do not use if the seal is broken or missing."
    ];
    return <main className={`product-page ${product.theme}-theme`}>
      <section className="premium-product-hero"><div className="container premium-product-grid">
        <div className="premium-pack-stage"><div className="pack-halo"/><div className="premium-pack-image"><Image src={product.image} alt="Aspivit Tablet product pack" fill priority unoptimized sizes="(max-width: 900px) 90vw, 46vw"/></div><div className="glass-pedestal"><span/></div></div>
        <div className="premium-product-copy"><span className="eyebrow">{product.category}</span><h1>ASPIVIT TABLET</h1><p className="approved-indication">Product overview</p><h2>{product.indication}</h2><p className="lead">{product.summary}</p><div className="purchase-line"><strong>{formatNaira(product.priceKobo)}</strong><span>{product.packSize} per pack</span></div><div className="hero-actions"><AddToCartButton slug={product.slug} name={product.name} priceKobo={product.priceKobo}/><BuyNowButton slug={product.slug} name={product.name} priceKobo={product.priceKobo}/></div><div className="product-trust-badges"><span><LockKeyhole size={17}/><b>Secure Paystack</b><small>Protected payment</small></span><span><Truck size={17}/><b>Nationwide delivery</b><small>Rates shown at checkout</small></span><span><Headphones size={17}/><b>Customer support</b><small>Help when you need it</small></span><span><BadgeCheck size={17}/><b>Bridgecare direct</b><small>Order from the source</small></span></div></div>
      </div></section>
      <nav className="product-anchor-nav" aria-label="Aspivit page sections"><div className="container"><a href="#specifications">Specifications</a><a href="#efficacy">Efficacy</a><a href="#composition">Composition</a><a href="#usage">Suggested use</a><a href="#warnings">Warnings</a></div></nav>
      <section className="section" id="specifications"><div className="container product-content-narrow aspivit-details"><SectionTitle eyebrow="Product details" title="ASPIVIT TABLET"/>
        <h2>📦 Product Specifications</h2><dl className="product-spec-list"><div><dt>Product Name</dt><dd>Aspivit Tablet</dd></div><div><dt>Dosage Form</dt><dd>Film-Coated Tablet</dd></div><div><dt>Packaging</dt><dd>Bottle</dd></div><div><dt>Shelf Life</dt><dd>2 Years</dd></div><div><dt>Country of Origin</dt><dd>India</dd></div><div><dt>Manufacturer</dt><dd>Manufactured in India under GMP-certified pharmaceutical standards.</dd></div></dl>
      </div></section>
      <section className="section product-tint" id="efficacy"><div className="container product-content-narrow aspivit-details"><h2>👨‍⚕️ PRODUCT EFFICACY</h2><p>Aspivit Tablet is a comprehensive nutritional supplement formulated with Omega-3 fatty acids, essential vitamins, and trace minerals to support overall health and wellbeing.</p><h3>Key Benefits</h3><ul>{benefits.map(item=><li key={item}>{item}</li>)}</ul></div></section>
      <section className="section"><div className="container product-content-narrow aspivit-details"><h2>📦 Product Description</h2><p>Aspivit Tablet is an advanced daily multivitamin and Omega-3 supplement designed to provide essential nutrients required for optimal health. Each film-coated tablet combines EPA, DHA, vitamins, and essential minerals to help bridge nutritional gaps and promote overall wellness.</p><p>Manufactured in India under stringent pharmaceutical quality standards, Aspivit Tablet delivers high-quality nutrients with excellent stability and bioavailability, making it suitable for daily nutritional supplementation.</p></div></section>
      <section className="section product-tint" id="composition"><div className="container product-content-narrow aspivit-details"><h2>🧪 Composition</h2><p>Each film-coated tablet contains:</p><div className="composition-table" role="table" aria-label="Aspivit composition"><div className="composition-row composition-head" role="row"><strong>Ingredient</strong><strong>Amount</strong></div>{composition.map(([ingredient,amount])=><div className="composition-row" role="row" key={ingredient}><span>{ingredient}</span><span>{amount}</span></div>)}</div></div></section>
      <section className="section" id="usage"><div className="container product-content-narrow aspivit-details"><h2>🛒 Suggested Use</h2><p><strong>Adults:</strong> Take <strong>one (1) tablet daily after meals</strong>, or as directed by your healthcare professional.</p><h2>📦 Storage Instructions</h2><ul><li>Store in a cool, dry place below 30°C.</li><li>Protect from direct sunlight and moisture.</li><li>Keep the bottle tightly closed after use.</li></ul><h2>🎯 Why Choose Aspivit?</h2><ul>{whyChoose.map(item=><li key={item}>{item}</li>)}</ul></div></section>
      <section className="section product-tint" id="warnings"><div className="container product-content-narrow aspivit-details"><SafetyPanel><h2>⚠️ Warnings</h2><ul>{warnings.map(item=><li key={item}>{item}</li>)}</ul></SafetyPanel></div></section>
      {product.detailImage && <section className="section aspivit-flyer-section"><div className="container product-content-narrow"><SectionTitle eyebrow="Complete product guide" title="Aspivit Tablet information flyer"/><div className="aspivit-flyer"><Image src={product.detailImage} alt="Aspivit Tablet product information flyer" width={1024} height={1536} unoptimized sizes="(max-width: 900px) 94vw, 900px"/></div></div></section>}
      <section className="section"><div className="container"><SectionTitle eyebrow="Related products" title="Explore more from Bridgecare"/><div className="related-grid">{related.map(p=><Link href={`/products/${p.slug}`} className="related-product" key={p.slug}><span className="related-image"><Image src={p.image} alt="" fill sizes="180px"/></span><strong>{p.name}</strong><small>{formatNaira(p.priceKobo)}</small></Link>)}</div></div></section>
      <section className="product-closing-cta"><div className="container product-closing-grid"><div><span className="eyebrow">Shop directly from Bridgecare</span><h2>Order Aspivit Tablet securely</h2><p>Clear delivery fees and free shipping when your basket contains any three packs or more.</p></div><div className="closing-purchase"><strong>{formatNaira(product.priceKobo)}</strong><AddToCartButton slug={product.slug} name={product.name} priceKobo={product.priceKobo}/><Link className="button secondary" href="/products">Explore all products</Link></div></div></section>
    </main>;
  }

  return <main className={`product-page ${product.theme}-theme`}>
    <section className="premium-product-hero"><div className="container premium-product-grid">
      <div className="premium-pack-stage"><div className="pack-halo"/><div className="premium-pack-image"><Image src={product.image} alt={`${product.name} product pack`} fill priority sizes="(max-width: 900px) 90vw, 46vw"/></div><div className="glass-pedestal"><span/></div></div>
      <div className="premium-product-copy"><span className="eyebrow">{product.category}</span><h1>{product.name}</h1><p className="approved-indication">Approved indication</p><h2>{product.indication}</h2><p className="lead">{product.summary}</p><div className="purchase-line"><strong>{formatNaira(product.priceKobo)}</strong><span>{product.packSize} per pack</span></div><div className="hero-actions"><AddToCartButton slug={product.slug} name={product.name} priceKobo={product.priceKobo}/><BuyNowButton slug={product.slug} name={product.name} priceKobo={product.priceKobo}/></div><div className="product-trust-badges"><span><LockKeyhole size={17}/><b>Secure Paystack</b><small>Protected payment</small></span><span><Truck size={17}/><b>Nationwide delivery</b><small>Rates shown at checkout</small></span><span><Headphones size={17}/><b>Customer support</b><small>Help when you need it</small></span><span><BadgeCheck size={17}/><b>Bridgecare direct</b><small>Order from the source</small></span></div></div>
    </div></section>
    <nav className="product-anchor-nav" aria-label="Product page sections"><div className="container"><a href="#overview">Overview</a>{complete&&<a href="#ingredients">Ingredients</a>}<a href="#directions">Directions</a><a href="#safety">Safety</a><a href="#faq">FAQs</a></div></nav>
    <section className="section" id="overview"><div className="container product-content-narrow"><SectionTitle eyebrow="Overview" title={`Why ${product.name}`} intro={product.overview}/>{complete ? <div className="why-grid">{product.reasons.map(r=><article className="product-info-card" key={r.title}><BrandIcon symbol={r.symbol}/><h3>{r.title}</h3><p>{r.text}</p></article>)}</div> : <div className="notice">The complete premium information page will be populated only from the approved pack copy.</div>}</div></section>
    {complete&&<><section className="section product-tint" id="ingredients"><div className="container"><SectionTitle eyebrow="Approved active ingredients" title="What each tablet contains" intro="Select an ingredient to read its concise description."/><div className="ingredient-grid">{product.ingredients.map(i=><IngredientCard key={i.name} icon={<BrandIcon symbol={i.symbol}/>} name={i.name} strength={i.strength}>{i.summary}</IngredientCard>)}</div></div></section>
    <section className="section"><div className="container"><SectionTitle eyebrow="Approved benefits" title="The product’s labelled purpose" intro="Claims below are limited to the approved indication shown on the pack."/><div className="benefit-grid">{product.benefits.map(b=><article className="product-info-card" key={b.title}><BrandIcon symbol={b.symbol}/><h3>{b.title}</h3><p>{b.text}</p></article>)}</div></div></section></>}
    <section className="section directions-section" id="directions"><div className="container"><SectionTitle eyebrow="Directions" title="Easy-to-read usage guidance"/><div className="dosage-layout">{product.directions.length ? product.directions.map((d,i)=><article className={`dosage-card ${i===0?'featured':''}`} key={d.label}><span>{d.label}</span><strong>{d.value}</strong><p>{d.text}</p></article>) : <article className="dosage-card featured"><span>Approved directions</span><strong>See physical pack</strong><p>Use only according to the current approved label.</p></article>}</div></div></section>
    {complete&&<section className="section"><div className="container"><SectionTitle eyebrow="Storage" title="Protect product quality"/><div className="storage-grid">{product.storage.map(s=><article className="product-info-card" key={s.title}><BrandIcon symbol={s.symbol}/><h3>{s.title}</h3><p>{s.text}</p></article>)}</div></div></section>}
    <section className="section product-tint" id="safety"><div className="container product-content-narrow"><SafetyPanel><h2>Read before use</h2><ul>{product.warnings.map(w=><li key={w}>{w}</li>)}</ul></SafetyPanel>{product.nafdac&&<p className="regulatory-note">Pack reference supplied by Bridgecare: NAFDAC Reg. No. {product.nafdac}. Check the physical pack for current batch, manufacturing and expiry information.</p>}</div></section>
    <section className="section" id="faq"><div className="container product-content-narrow"><SectionTitle eyebrow="Frequently asked questions" title="Helpful answers before purchase"/><div className="faq-list">{product.faqs.length ? product.faqs.map(f=><details key={f.question}><summary>{f.question}</summary><p>{f.answer}</p></details>) : <details><summary>Where can I find the complete approved information?</summary><p>Read the physical product pack or contact Bridgecare customer support.</p></details>}</div></div></section>
    <section className="section product-tint"><div className="container"><SectionTitle eyebrow="Resources" title="Product support and information"/><div className="resource-grid"><Link href="/downloads" className="resource-card"><BrandIcon symbol="PDF"/><h3>Product resources</h3><p>Access available product and corporate downloads.</p></Link><Link href="/contact" className="resource-card"><BrandIcon symbol="?"/><h3>Need more information?</h3><p>Speak with Bridgecare customer support.</p></Link></div></div></section>
    <section className="section"><div className="container"><SectionTitle eyebrow="Related products" title="Explore more from Bridgecare"/><div className="related-grid">{related.map(p=><Link href={`/products/${p.slug}`} className="related-product" key={p.slug}><span className="related-image"><Image src={p.image} alt="" fill sizes="180px"/></span><strong>{p.name}</strong><small>{formatNaira(p.priceKobo)}</small></Link>)}</div></div></section>
    <section className="product-closing-cta"><div className="container product-closing-grid"><div><span className="eyebrow">Shop directly from Bridgecare</span><h2>Order {product.name} securely</h2><p>Clear delivery fees and free shipping when your basket contains any three packs or more.</p></div><div className="closing-purchase"><strong>{formatNaira(product.priceKobo)}</strong><AddToCartButton slug={product.slug} name={product.name} priceKobo={product.priceKobo}/><Link className="button secondary" href="/products">Explore all products</Link></div></div></section>
  </main>;
}
