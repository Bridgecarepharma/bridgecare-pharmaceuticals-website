import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { IngredientCard, InfoCard, SafetyPanel, SectionTitle } from "@/components/product/ProductPageSections";
import { formatNaira } from "@/lib/store";

export const metadata = {
  title: "AsFenositol® | Women’s Wellness | Bridgecare Pharmaceuticals",
  description: "Official product information for AsFenositol®, including approved indication, active ingredients, directions, storage and safety guidance.",
};

const priceKobo = 600000;

const Icon = ({ children }: { children: ReactNode }) => <span aria-hidden="true">{children}</span>;

export default function AsFenositolPage() {
  return <main className="product-page asfenositol-theme">
    <section className="premium-product-hero">
      <div className="container premium-product-grid">
        <div className="premium-pack-stage">
          <div className="pack-halo" />
          <div className="premium-pack-image"><Image src="/images/products/asfenositol.png" alt="AsFenositol product pack" fill priority sizes="(max-width: 900px) 90vw, 46vw" /></div>
          <div className="glass-pedestal"><span /></div>
        </div>
        <div className="premium-product-copy">
          <span className="eyebrow">Women’s wellness</span>
          <h1>AsFenositol®</h1>
          <p className="approved-indication">Approved indication</p>
          <h2>Supports ovarian and immune function, egg quality and fertility.</h2>
          <p className="lead">A once-daily nutritional formulation containing Myo-Inositol, L-Methyl Folate, Pyridoxal-5-Phosphate and Vitamin D₃.</p>
          <div className="purchase-line"><strong>{formatNaira(priceKobo)}</strong><span>10 tablets per pack</span></div>
          <div className="hero-actions"><AddToCartButton slug="asfenositol" name="AsFenositol®" priceKobo={priceKobo}/><Link className="button secondary" href="/checkout?product=asfenositol">Buy now</Link></div>
          <div className="micro-trust"><span>Secure Paystack checkout</span><span>Nationwide delivery</span><span>Free delivery from 3 packs</span></div>
        </div>
      </div>
    </section>

    <nav className="product-anchor-nav" aria-label="Product page sections"><div className="container"><a href="#overview">Overview</a><a href="#ingredients">Ingredients</a><a href="#directions">Directions</a><a href="#safety">Safety</a><a href="#faq">FAQs</a></div></nav>

    <section className="section" id="overview"><div className="container product-content-narrow">
      <SectionTitle eyebrow="Overview" title="Thoughtfully formulated for women’s wellness" intro="AsFenositol combines four labelled nutrients in a convenient tablet. The page presents the approved pack information in a clear, customer-friendly format; it does not replace advice from a healthcare professional." />
      <div className="why-grid">
        <InfoCard icon={<Icon>01</Icon>} title="Four labelled nutrients">Myo-Inositol, active folate, active vitamin B6 and Vitamin D₃ in one formulation.</InfoCard>
        <InfoCard icon={<Icon>02</Icon>} title="Simple routine">The approved pack direction is one tablet daily, or as directed by a healthcare practitioner.</InfoCard>
        <InfoCard icon={<Icon>03</Icon>} title="Clear product information">Ingredients, directions, storage and warnings are presented directly from the approved packaging supplied by Bridgecare.</InfoCard>
      </div>
    </div></section>

    <section className="section product-tint" id="ingredients"><div className="container">
      <SectionTitle eyebrow="Approved active ingredients" title="What each tablet contains" intro="Tap or click each ingredient to see a concise explanation. Ingredient quantities follow the product carton." />
      <div className="ingredient-grid">
        <IngredientCard icon={<Icon>M</Icon>} name="Myo-Inositol" strength="1000 mg per tablet">A naturally occurring inositol included as the principal ingredient in the labelled formulation.</IngredientCard>
        <IngredientCard icon={<Icon>F</Icon>} name="L-Methyl Folate" strength="0.5 mg per tablet">The active form of folate listed on the approved product pack.</IngredientCard>
        <IngredientCard icon={<Icon>B6</Icon>} name="Pyridoxal-5-Phosphate" strength="0.5 mg per tablet">The active coenzyme form of vitamin B6 included in the formulation.</IngredientCard>
        <IngredientCard icon={<Icon>D3</Icon>} name="Vitamin D₃" strength="1000 IU per tablet">Vitamin D₃ at the labelled strength of 1000 IU per tablet.</IngredientCard>
      </div>
    </div></section>

    <section className="section"><div className="container">
      <SectionTitle eyebrow="Approved benefits" title="The product’s labelled purpose" intro="Claims below are limited to the approved indication shown on the pack." />
      <div className="benefit-grid"><InfoCard icon={<Icon>○</Icon>} title="Ovarian function">Formulated to support ovarian function.</InfoCard><InfoCard icon={<Icon>◇</Icon>} title="Immune function">Formulated to support immune function.</InfoCard><InfoCard icon={<Icon>✦</Icon>} title="Egg quality and fertility">The approved indication includes support for egg quality and fertility.</InfoCard></div>
    </div></section>

    <section className="section directions-section" id="directions"><div className="container">
      <SectionTitle eyebrow="Directions" title="Simple, easy-to-read usage guidance" />
      <div className="dosage-layout"><article className="dosage-card featured"><span>Daily dose</span><strong>1 tablet</strong><p>Take one tablet daily, or use as directed by a healthcare practitioner.</p></article><article className="dosage-card"><span>Pack size</span><strong>10 tablets</strong><p>One blister pack containing ten tablets.</p></article><article className="dosage-card"><span>Responsible use</span><strong>Follow the label</strong><p>Do not exceed or alter the labelled direction without professional guidance.</p></article></div>
    </div></section>

    <section className="section"><div className="container">
      <SectionTitle eyebrow="Storage" title="Protect product quality" />
      <div className="storage-grid"><InfoCard icon={<Icon>30°</Icon>} title="Cool storage">Store below 30°C.</InfoCard><InfoCard icon={<Icon>☀</Icon>} title="Protect from sunlight">Keep the pack away from direct sunlight.</InfoCard><InfoCard icon={<Icon>⌂</Icon>} title="Dry place">Store in a cool, dry place.</InfoCard></div>
    </div></section>

    <section className="section product-tint" id="safety"><div className="container product-content-narrow">
      <SafetyPanel><h2>Read before use</h2><ul><li>Keep out of reach of children.</li><li>Use according to the approved pack direction or a healthcare practitioner’s advice.</li><li>Speak with a healthcare professional when you have questions about suitability, other medicines, pregnancy, breastfeeding or an existing medical condition.</li></ul></SafetyPanel>
      <p className="regulatory-note">Pack reference supplied by Bridgecare: NAFDAC Reg. No. A7-102870. Always check the physical pack for the latest batch, manufacturing and expiry information.</p>
    </div></section>

    <section className="section" id="faq"><div className="container product-content-narrow">
      <SectionTitle eyebrow="Frequently asked questions" title="Helpful answers before you purchase" />
      <div className="faq-list">
        <details><summary>What is AsFenositol used for?</summary><p>Its approved pack indication is support for ovarian and immune function, egg quality and fertility.</p></details>
        <details><summary>How do I take AsFenositol?</summary><p>The pack direction states one tablet daily, or as directed by a healthcare practitioner.</p></details>
        <details><summary>How many tablets are in one pack?</summary><p>Each pack contains 10 tablets.</p></details>
        <details><summary>Where should I store it?</summary><p>Store below 30°C in a cool, dry place, protected from sunlight and out of reach of children.</p></details>
        <details><summary>Can I use it with other medicines or supplements?</summary><p>A healthcare professional should review your complete medicine and supplement routine before you combine products.</p></details>
      </div>
    </div></section>

    <section className="product-closing-cta"><div className="container product-closing-grid"><div><span className="eyebrow">Shop directly from Bridgecare</span><h2>Bring AsFenositol into your daily routine</h2><p>Secure online payment, clear delivery fees and free shipping when your basket contains any three packs or more.</p></div><div className="closing-purchase"><strong>{formatNaira(priceKobo)}</strong><AddToCartButton slug="asfenositol" name="AsFenositol®" priceKobo={priceKobo}/><Link className="button secondary" href="/products">Explore all products</Link></div></div></section>
  </main>;
}
