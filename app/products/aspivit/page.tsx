import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatNaira } from "@/lib/store";
import { getProductPrice } from "@/lib/product-prices";
import { ProductCommunitySection } from "@/components/product/ProductCommunitySection";

export const metadata = {
  title: "Aspivit® | Omega-3, Vitamins & Minerals",
  description: "Aspivit Tablet is a daily nutritional supplement with EPA, DHA, essential vitamins and trace minerals for overall health and wellbeing.",
};

const composition = [
  ["EPA", "90 mg"], ["DHA", "60 mg"], ["Vitamin A", "900 mcg"],
  ["Vitamin B6", "1 mg"], ["Vitamin C", "40 mg"], ["Vitamin D3", "400 IU"],
  ["Vitamin E", "15 mg"], ["Folic Acid", "400 mcg"], ["Selenium", "40 mcg"],
  ["Magnesium", "2 mg"], ["Chromium", "35 mcg"], ["Copper", "1 mg"],
  ["Zinc Sulphate", "7.5 mg"],
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
  "Supports red blood cell formation and overall vitality.",
];

export default async function Page() {
  const priceKobo = await getProductPrice("aspivit");
  return <>
    <section className="product-detail-hero">
      <div className="container product-detail">
        <div className="product-detail-image"><Image src="/images/products/aspivit.png" alt="Aspivit® product pack" fill priority sizes="(max-width: 850px) 90vw, 45vw" /></div>
        <div>
          <span className="eyebrow">Omega-3 Fatty Acids, Vitamins & Minerals</span>
          <h1>Aspivit® Tablet</h1>
          <p className="lead">A comprehensive nutritional supplement formulated with Omega-3 fatty acids, essential vitamins and trace minerals to support overall health and wellbeing.</p>
          <div className="detail-price">{formatNaira(priceKobo)}</div>
          <div className="hero-actions"><AddToCartButton slug="aspivit" name="Aspivit®" priceKobo={priceKobo} /><Link className="button secondary" href="/cart">View cart</Link><Link className="button secondary" href="/products">All products</Link></div>
          <p className="product-disclaimer">Food supplements should not be used as a substitute for a varied and balanced diet. Use only as directed.</p>
        </div>
      </div>
    </section>

    <section className="section"><div className="container prose">
      <h2>Product specifications</h2>
      <table className="info-table"><tbody>
        <tr><th>Product name</th><td>Aspivit Tablet</td></tr>
        <tr><th>Dosage form</th><td>Film-Coated Tablet</td></tr>
        <tr><th>Packaging</th><td>Bottle</td></tr>
        <tr><th>Shelf life</th><td>2 Years</td></tr>
        <tr><th>Country of origin</th><td>India</td></tr>
        <tr><th>Manufacturing standard</th><td>Manufactured in India under GMP-certified pharmaceutical standards.</td></tr>
      </tbody></table>

      <h2>Product efficacy</h2>
      <p>Aspivit Tablet is a comprehensive nutritional supplement formulated with Omega-3 fatty acids, essential vitamins, and trace minerals to support overall health and wellbeing.</p>
      <h3>Key benefits</h3>
      <ul>{benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>

      <h2>Product description</h2>
      <p>Aspivit Tablet is an advanced daily multivitamin and Omega-3 supplement designed to provide essential nutrients required for optimal health. Each film-coated tablet combines EPA, DHA, vitamins, and essential minerals to help bridge nutritional gaps and promote overall wellness.</p>
      <p>Manufactured in India under stringent pharmaceutical quality standards, Aspivit Tablet delivers high-quality nutrients with excellent stability and bioavailability, making it suitable for daily nutritional supplementation.</p>

      <h2>Composition</h2>
      <p>Each film-coated tablet contains:</p>
      <table className="info-table"><tbody>{composition.map(([ingredient, amount]) => <tr key={ingredient}><th>{ingredient}</th><td>{amount}</td></tr>)}</tbody></table>

      <h2>Suggested use</h2>
      <p><strong>Adults:</strong> Take one (1) tablet daily after meals, or as directed by your healthcare professional.</p>

      <h2>Storage instructions</h2>
      <ul><li>Store in a cool, dry place below 30°C.</li><li>Protect from direct sunlight and moisture.</li><li>Keep the bottle tightly closed after use.</li></ul>

      <h2>Why choose Aspivit?</h2>
      <ul><li>Premium Omega-3 (EPA &amp; DHA) formulation.</li><li>Comprehensive multivitamin and multimineral supplement.</li><li>Manufactured in India under GMP-certified facilities.</li><li>Film-coated tablet for easy swallowing.</li><li>High-quality ingredients for maximum nutritional support.</li><li>Suitable for everyday wellness and nutritional maintenance.</li></ul>

      <h2>Warnings</h2>
      <ul><li>Do not exceed the recommended daily dose.</li><li>Food supplements should not be used as a substitute for a varied and balanced diet.</li><li>Keep out of reach of children.</li><li>Consult your physician before use if you are pregnant, nursing, taking medication, or have any medical condition.</li><li>Do not use if the seal is broken or missing.</li></ul>
      <div style={{ marginTop: "3rem" }}>
        <h2>Aspivit product flyer</h2>
        <div style={{ position: "relative", width: "100%", maxWidth: "900px", margin: "1.25rem auto 0" }}>
          <Image
            src="/images/products/aspivit-flyer.png"
            alt="Aspivit Tablet product information flyer"
            width={1024}
            height={1536}
            sizes="(max-width: 900px) 100vw, 900px"
            style={{ width: "100%", height: "auto", borderRadius: "18px" }}
          />
        </div>
      </div>
    </div></section>
    <ProductCommunitySection productSlug="aspivit" productName="Aspivit® Tablet" />
  </>;
}
