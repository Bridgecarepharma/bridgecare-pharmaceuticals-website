import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Box,
  ChevronDown,
  Droplets,
  FlaskConical,
  HeartPulse,
  Leaf,
  LockKeyhole,
  PackageCheck,
  ShieldAlert,
  Sparkles,
  SunMedium,
  ThermometerSun,
  Truck,
} from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { DirectPayButton } from "@/components/DirectPayButton";
import { formatNaira } from "@/lib/store";

export const metadata = {
  title: "AsFenositol® | Bridgecare Pharmaceuticals",
  description:
    "Approved product information, active ingredients, directions, storage and safety guidance for AsFenositol®.",
};

const priceKobo = 600000;

const ingredients = [
  {
    name: "Myo-Inositol",
    strength: "1000 mg",
    copy: "A principal ingredient in the AsFenositol® formulation. Use the product only as directed on the approved pack.",
  },
  {
    name: "L-Methyl Folate",
    strength: "0.5 mg",
    copy: "The active folate form included in the approved formulation at the stated pack strength.",
  },
  {
    name: "Pyridoxal-5-Phosphate",
    strength: "0.5 mg",
    copy: "An active form of vitamin B6 included in the formulation at the approved pack strength.",
  },
  {
    name: "Vitamin D3",
    strength: "1000 IU",
    copy: "Vitamin D3 is included in each tablet at the strength shown on the approved packaging.",
  },
];

const faqs = [
  {
    question: "What is AsFenositol® indicated for?",
    answer:
      "The approved packaging states that AsFenositol® improves ovarian and immune function, enhances egg quality and fertility, and enriches the gums. Product claims should always be read together with the current approved pack.",
  },
  {
    question: "How should AsFenositol® be taken?",
    answer:
      "The pack directs one tablet daily, or as directed by a healthcare practitioner.",
  },
  {
    question: "How many tablets are in one pack?",
    answer: "Each pack contains 10 tablets.",
  },
  {
    question: "How should the product be stored?",
    answer:
      "Store in a cool, dry and dark place below 30°C and protect from direct sunlight. Keep out of reach of children.",
  },
];

export default function AsFenositolPage() {
  return (
    <main className="asf-page">
      <section className="asf-hero">
        <div className="container asf-hero-grid">
          <div className="asf-product-stage" aria-label="AsFenositol product pack">
            <div className="asf-orb" aria-hidden="true" />
            <div className="asf-pack-float">
              <Image
                src="/images/products/asfenositol.png"
                alt="AsFenositol® pack"
                fill
                priority
                sizes="(max-width: 900px) 82vw, 460px"
              />
            </div>
            <div className="asf-pedestal" aria-hidden="true" />
          </div>

          <div className="asf-hero-copy">
            <span className="asf-kicker">Women’s wellness</span>
            <h1>AsFenositol®</h1>
            <p className="asf-indication">
              A carefully formulated tablet containing Myo-Inositol, L-Methyl Folate,
              Pyridoxal-5-Phosphate and Vitamin D3.
            </p>
            <p className="asf-approved-copy">
              Approved indication: improves ovarian and immune function, enhances egg
              quality and fertility, and enriches the gums.
            </p>

            <div className="asf-price-row">
              <div>
                <span>Price per pack</span>
                <strong>{formatNaira(priceKobo)}</strong>
              </div>
              <span className="asf-pack-size"><Box size={18} /> 10 tablets</span>
            </div>

            <div className="asf-actions">
              <AddToCartButton slug="asfenositol" name="AsFenositol®" priceKobo={priceKobo} />
              <DirectPayButton href="https://paystack.shop/pay/qz4b43usk0" label="Buy instantly" />
              <Link className="button secondary" href="/checkout">Checkout cart</Link>
            </div>

            <div className="asf-trust-row">
              <span><BadgeCheck size={18} /> NAFDAC registered</span>
              <span><LockKeyhole size={18} /> Secure payment</span>
              <span><Truck size={18} /> Nationwide delivery</span>
            </div>
          </div>
        </div>
      </section>

      <nav className="asf-section-nav" aria-label="Product page sections">
        <div className="container">
          <a href="#overview">Overview</a>
          <a href="#ingredients">Ingredients</a>
          <a href="#benefits">Benefits</a>
          <a href="#directions">Directions</a>
          <a href="#safety">Safety</a>
          <a href="#faqs">FAQs</a>
        </div>
      </nav>

      <section id="overview" className="section asf-overview">
        <div className="container asf-two-column">
          <div>
            <span className="eyebrow">Product overview</span>
            <h2>Clear product information, presented with care</h2>
          </div>
          <div>
            <p className="lead">
              AsFenositol® brings four approved active ingredients together in a
              convenient once-daily tablet. This page reorganises the information on the
              approved pack into a clearer, customer-friendly format.
            </p>
            <p>
              Always read the current pack before use and consult a healthcare
              professional when individual guidance is required.
            </p>
          </div>
        </div>
      </section>

      <section className="section asf-soft" aria-labelledby="why-heading">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Why this product?</span>
              <h2 id="why-heading">A precise four-ingredient formulation</h2>
            </div>
            <p>Designed around approved pack information, simple daily use and clear responsible-use guidance.</p>
          </div>
          <div className="asf-feature-grid">
            <article><FlaskConical /><h3>Defined strengths</h3><p>Every active ingredient is displayed with the exact strength stated on the pack.</p></article>
            <article><Sparkles /><h3>Simple daily use</h3><p>The approved direction is one tablet daily, or as directed by a healthcare practitioner.</p></article>
            <article><PackageCheck /><h3>Clearly labelled pack</h3><p>Each carton contains 10 tablets with storage and safety information presented on-pack.</p></article>
          </div>
        </div>
      </section>

      <section id="ingredients" className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Approved active ingredients</span>
              <h2>What each tablet contains</h2>
            </div>
            <p>Tap or click an ingredient to view a concise explanation.</p>
          </div>
          <div className="asf-ingredient-grid">
            {ingredients.map((ingredient, index) => (
              <details key={ingredient.name} className="asf-ingredient-card" open={index === 0}>
                <summary>
                  <span><FlaskConical size={21} /> {ingredient.name}</span>
                  <strong>{ingredient.strength}</strong>
                  <ChevronDown className="asf-chevron" size={20} />
                </summary>
                <p>{ingredient.copy}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="section asf-benefits-section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Approved benefits</span>
              <h2>Benefits stated on the pack</h2>
            </div>
            <p>No additional treatment or disease-prevention claims have been added.</p>
          </div>
          <div className="asf-benefit-grid">
            <article><HeartPulse /><h3>Ovarian function</h3><p>Supports the approved ovarian-function indication stated on the packaging.</p></article>
            <article><ShieldAlert /><h3>Immune function</h3><p>Reflects the approved immune-function indication on the current pack.</p></article>
            <article><Sparkles /><h3>Egg quality & fertility</h3><p>Presented exactly within the scope of the approved product indication.</p></article>
            <article><Leaf /><h3>Gum enrichment</h3><p>Included because it appears in the approved indication on the pack.</p></article>
          </div>
        </div>
      </section>

      <section id="directions" className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Directions and storage</span>
              <h2>Easy-to-read use guidance</h2>
            </div>
          </div>
          <div className="asf-direction-grid">
            <article className="asf-direction-card">
              <span>01</span><Droplets /><h3>Dosage</h3>
              <p>Take one tablet daily, or as directed by a healthcare practitioner.</p>
            </article>
            <article className="asf-direction-card">
              <span>02</span><ThermometerSun /><h3>Temperature</h3>
              <p>Store below 30°C in a cool place.</p>
            </article>
            <article className="asf-direction-card">
              <span>03</span><SunMedium /><h3>Protection</h3>
              <p>Keep dry, store in a dark place and protect from direct sunlight.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="safety" className="section asf-safety-section">
        <div className="container">
          <div className="asf-safety-box">
            <div className="asf-safety-icon"><ShieldAlert size={34} /></div>
            <div>
              <span className="eyebrow">Warnings & precautions</span>
              <h2>Use responsibly</h2>
              <ul>
                <li>Keep out of reach of children.</li>
                <li>Use only according to the approved pack directions or a healthcare practitioner’s advice.</li>
                <li>Do not rely on this website as a substitute for personalised medical advice.</li>
                <li>Check the current packaging before use because approved information may be updated.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section asf-quality-section">
        <div className="container asf-two-column">
          <div>
            <span className="eyebrow">Science & quality</span>
            <h2>Information grounded in the approved pack</h2>
          </div>
          <div>
            <p className="lead">
              Bridgecare presents product information clearly and responsibly. Ingredient
              strengths, directions, storage guidance and approved indications on this page
              have been organised from the supplied product packaging.
            </p>
            <Link className="text-link" href="/quality-compliance">Explore Quality & Compliance →</Link>
          </div>
        </div>
      </section>

      <section id="faqs" className="section asf-soft">
        <div className="container narrow">
          <div className="section-head">
            <div>
              <span className="eyebrow">Frequently asked questions</span>
              <h2>Helpful answers before you buy</h2>
            </div>
          </div>
          <div className="asf-faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}<ChevronDown size={20} /></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section asf-purchase-section">
        <div className="container asf-purchase-card">
          <div>
            <span className="eyebrow">Ready to order?</span>
            <h2>Buy AsFenositol® directly from Bridgecare</h2>
            <p>Secure checkout, verified payment and delivery address collection before payment.</p>
          </div>
          <div className="asf-purchase-actions">
            <strong>{formatNaira(priceKobo)}</strong>
            <AddToCartButton slug="asfenositol" name="AsFenositol®" priceKobo={priceKobo} />
            <DirectPayButton href="https://paystack.shop/pay/qz4b43usk0" label="Buy instantly" />
            <Link className="button secondary" href="/products">View related products</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
