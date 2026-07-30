import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Building2, CheckCircle2, HeartPulse, Headphones, ShieldCheck, Sparkles, Stethoscope, Truck } from "lucide-react";
import { CTA, ProductGrid } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow"><Sparkles size={14}/> Bridgecare Pharmaceuticals Limited</span>
            <h1>Advancing Health.<br />Inspiring Life.</h1>
            <p className="lead">Quality healthcare products, trusted partnerships and practical health information for healthier families and stronger communities.</p>
            <div className="hero-actions">
              <Link className="button" href="/products">Shop our products</Link>
              <Link className="button secondary" href="/distributors">Become a distributor</Link>
            </div>
            <div className="hero-assurance">
              <span><CheckCircle2 size={16}/> Secure Paystack checkout</span>
              <span><CheckCircle2 size={16}/> Delivery across Nigeria</span>
              <span><CheckCircle2 size={16}/> Responsive customer support</span>
            </div>
          </div>
          <div className="hero-products" aria-label="Bridgecare products supporting healthier families">
            <div className="hero-glow" />
            <div className="hero-family" aria-hidden="true">
              <Image
                src="/images/hero/family-hero.jpg"
                alt=""
                fill
                priority
                sizes="(max-width: 900px) 100vw, 54vw"
              />
            </div>
            <div className="hero-family-fade" aria-hidden="true" />
            <div className="hero-product hero-product-aspivit"><Image src="/images/products/aspivit.png" alt="Aspivit product pack" fill priority sizes="(max-width: 900px) 58vw, 28vw" /></div>
            <div className="hero-product hero-product-asfenositol"><Image src="/images/products/asfenositol.png" alt="AsFenositol product pack" fill priority sizes="(max-width: 900px) 58vw, 28vw" /></div>
            <div className="hero-product hero-product-globivida"><Image src="/images/products/globivida.png" alt="Globivida product pack" fill priority sizes="(max-width: 900px) 42vw, 20vw" /></div>
            <div className="hero-product hero-product-tea"><Image src="/images/products/herbal-bitter-tea.png" alt="Bridgecare Herbal Bitter Tea product pack" fill priority sizes="(max-width: 900px) 42vw, 20vw" /></div>
            <div className="hero-proof"><strong>4</strong><span>carefully selected wellness products</span></div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-strip-grid">
          <div><ShieldCheck /><span><strong>Quality focused</strong><small>Responsible product stewardship</small></span></div>
          <div><Truck /><span><strong>Nationwide delivery</strong><small>Delivery address collected at checkout</small></span></div>
          <div><Headphones /><span><strong>Responsive support</strong><small>Help before and after purchase</small></span></div>
          <div><Building2 /><span><strong>Real operations</strong><small>Established office and inventory facility</small></span></div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Shop Bridgecare</span><h2>Our healthcare portfolio</h2></div>
            <Link className="section-link" href="/products">View all products <ArrowRight size={18}/></Link>
          </div>
          <ProductGrid />
        </div>
      </section>

      <section className="section">
        <div className="container facility-intro">
          <div className="facility-copy">
            <span className="eyebrow">Inside Bridgecare</span>
            <h2>A healthcare company customers can see and trust</h2>
            <p>Our public website is supported by real people, a professional office and an organised inventory operation. These facilities help us serve customers and distribution partners with care.</p>
            <div className="facility-points">
              <span>Professional customer reception</span>
              <span>Organised stock handling</span>
              <span>Reliable order fulfilment</span>
            </div>
            <Link className="button" href="/about">Learn about Bridgecare</Link>
          </div>
          <div className="facility-feature">
            <Image src="/images/facilities/reception.jpg" alt="Bridgecare Pharmaceuticals reception area" fill sizes="(max-width: 900px) 100vw, 54vw" />
            <div className="facility-caption"><strong>Bridgecare reception</strong><span>A welcoming point of contact for customers and partners.</span></div>
          </div>
        </div>
      </section>

      <section className="section operations-section">
        <div className="container operations-grid">
          <div className="operations-image"><Image src="/images/facilities/warehouse.jpg" alt="Bridgecare organised inventory and distribution facility" fill sizes="(max-width: 900px) 100vw, 55vw" /></div>
          <div className="operations-copy">
            <span className="eyebrow">Operations & distribution</span>
            <h2>Prepared to fulfil orders responsibly</h2>
            <p>Our inventory facility supports product availability, order preparation and distribution. The public image has been framed to keep attention on Bridgecare's operations rather than products outside the current online portfolio.</p>
            <Link className="button secondary" href="/quality-compliance">Our quality commitment</Link>
          </div>
        </div>
      </section>

      <section className="section health-centre-home">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Bridgecare Health Centre</span>
              <h2>Clear health information for everyday decisions</h2>
              <p>Practical, responsible guidance designed to help families understand wellness products, use medicines carefully and know when to speak with a healthcare professional.</p>
            </div>
            <Link className="section-link" href="/health-centre">Visit Health Centre <ArrowRight size={18}/></Link>
          </div>
          <div className="health-topic-grid">
            <Link href="/health-centre" className="health-topic-card">
              <span className="health-topic-icon"><BookOpenCheck size={28}/></span>
              <span className="eyebrow">Product education</span>
              <h3>Read labels with confidence</h3>
              <p>Understand directions, ingredients, warnings, storage instructions and the difference between general information and professional advice.</p>
              <strong>Explore guidance <ArrowRight size={17}/></strong>
            </Link>
            <Link href="/health-centre" className="health-topic-card">
              <span className="health-topic-icon"><HeartPulse size={28}/></span>
              <span className="eyebrow">Everyday wellness</span>
              <h3>Build healthier daily routines</h3>
              <p>Simple information on nutrition, responsible supplement use and practical habits that support long-term wellbeing.</p>
              <strong>Read wellness topics <ArrowRight size={17}/></strong>
            </Link>
            <Link href="/faq" className="health-topic-card">
              <span className="health-topic-icon"><Stethoscope size={28}/></span>
              <span className="eyebrow">Responsible use</span>
              <h3>Know when to ask for help</h3>
              <p>Find answers to common questions and learn when a pharmacist, doctor or other qualified healthcare professional should guide your next step.</p>
              <strong>View common questions <ArrowRight size={17}/></strong>
            </Link>
          </div>
          <div className="health-centre-note"><ShieldCheck size={21}/><p><strong>Health information, not a diagnosis.</strong> Bridgecare educational content does not replace consultation with a qualified healthcare professional.</p></div>
        </div>
      </section>

      <CTA />
    </>
  );
}
