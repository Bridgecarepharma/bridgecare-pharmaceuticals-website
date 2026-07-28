import Image from "next/image";
import Link from "next/link";
import { Building2, Headphones, ShieldCheck, Truck } from "lucide-react";
import { CTA, ProductGrid } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Bridgecare Pharmaceuticals Limited</span>
            <h1>Advancing Health.<br />Inspiring Life.</h1>
            <p className="lead">Quality healthcare products, trusted partnerships and practical health information for healthier families and stronger communities.</p>
            <div className="hero-actions">
              <Link className="button" href="/products">Shop our products</Link>
              <Link className="button secondary" href="/about">Discover Bridgecare</Link>
            </div>
            <div className="hero-assurance">
              <span>Secure Paystack checkout</span>
              <span>Delivery across Nigeria</span>
              <span>Responsive customer support</span>
            </div>
          </div>
          <div className="hero-products" aria-label="Bridgecare product range">
            <div className="hero-family"><Image src="/images/hero-family.jpg" alt="Happy family enjoying everyday wellness" fill priority sizes="(max-width: 900px) 100vw, 50vw" /></div>
            <div className="hero-glow" />
            <div className="hero-product hero-product-aspivit"><Image src="/images/products/aspivit.png" alt="Aspivit product pack" fill priority sizes="(max-width: 900px) 58vw, 28vw" /></div>
            <div className="hero-product hero-product-asfenositol"><Image src="/images/products/asfenositol.png" alt="AsFenositol product pack" fill priority sizes="(max-width: 900px) 58vw, 28vw" /></div>
            <div className="hero-product hero-product-globivida"><Image src="/images/products/globivida.png" alt="Globivida product pack" fill priority sizes="(max-width: 900px) 42vw, 20vw" /></div>
            <div className="hero-product hero-product-tea"><Image src="/images/products/herbal-bitter-tea.png" alt="Bridgecare Herbal Bitter Tea product pack" fill priority sizes="(max-width: 900px) 42vw, 20vw" /></div>
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
            <Link className="button secondary" href="/products">View all products</Link>
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

      <CTA />
    </>
  );
}
