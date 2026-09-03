import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BadgeCheck, BookOpenCheck, Building2, CheckCircle2, HeartPulse,
  Headphones, LockKeyhole, MessageCircle, PackageCheck, ShieldCheck, Sparkles,
  Stethoscope, Truck, UsersRound
} from "lucide-react";
import { CTA, ProductGrid } from "@/components/Sections";
import { getPublishedHealthArticles } from "@/lib/health-cms";

const faqs = [
  ["Do you deliver across Nigeria?", "Yes. Select your delivery zone at checkout. Delivery charges are displayed before payment."],
  ["How do I pay?", "Payments are processed securely through Paystack after you enter your customer and delivery details."],
  ["When is delivery free?", "Free delivery is applied automatically when your basket reaches the pack threshold configured by Bridgecare."],
  ["Can I speak with someone before ordering?", "Yes. Use the WhatsApp or call buttons for help with product information and ordering."],
];

export default async function Home() {
  const latestHealthArticles = (await getPublishedHealthArticles()).slice(0, 3);
  return (
    <>
      <section className="hero hero-v3">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow"><Sparkles size={14}/> Trusted health and wellness products</span>
            <h1>Better wellness starts with products you can trust.</h1>
            <p className="lead">Shop Bridgecare products with clear information, secure payment and delivery across Nigeria.</p>
            <div className="hero-actions">
              <Link className="button hero-primary" href="/products">Shop products <ArrowRight size={18}/></Link>
              <a className="button secondary hero-whatsapp" href="https://wa.link/bridgecarepharmaltd" target="_blank" rel="noreferrer"><MessageCircle size={18}/> Chat on WhatsApp</a>
            </div>
            <div className="hero-assurance hero-assurance-v3">
              <span><LockKeyhole size={17}/><b>Secure checkout</b></span>
              <span><Truck size={17}/><b>Nationwide delivery</b></span>
              <span><Headphones size={17}/><b>Customer support</b></span>
            </div>
          </div>
          <div className="hero-products hero-products-v3" aria-label="Bridgecare healthcare products">
            <div className="hero-glow" />
            <div className="hero-family" aria-hidden="true"><Image src="/images/hero/family-hero.jpg" alt="" fill priority sizes="(max-width: 900px) 100vw, 54vw" /></div>
            <div className="hero-family-fade" aria-hidden="true" />
            <div className="hero-product hero-product-aspivit"><Image src="/images/products/aspivit.png" alt="Aspivit product pack" fill priority sizes="(max-width: 900px) 58vw, 28vw" /></div>
            <div className="hero-product hero-product-asfenositol"><Image src="/images/products/asfenositol.png" alt="AsFenositol product pack" fill priority sizes="(max-width: 900px) 58vw, 28vw" /></div>
            <div className="hero-product hero-product-globivida"><Image src="/images/products/globivida.png" alt="Globivida product pack" fill priority sizes="(max-width: 900px) 42vw, 20vw" /></div>
            <div className="hero-product hero-product-tea"><Image src="/images/products/herbal-bitter-tea.png" alt="Bridgecare Herbal Bitter Tea product pack" fill priority sizes="(max-width: 900px) 42vw, 20vw" /></div>
            <div className="hero-proof"><strong>4</strong><span>wellness products available online</span></div>
          </div>
        </div>
      </section>

      <section className="trust-strip trust-strip-v3">
        <div className="container trust-strip-grid">
          <div><BadgeCheck /><span><strong>Quality focused</strong><small>Clear, responsible product information</small></span></div>
          <div><LockKeyhole /><span><strong>Paystack secured</strong><small>Protected online payment</small></span></div>
          <div><Truck /><span><strong>Delivery across Nigeria</strong><small>Transparent regional charges</small></span></div>
          <div><Headphones /><span><strong>Human support</strong><small>Help before and after purchase</small></span></div>
        </div>
      </section>

      <section className="mobile-shop-tools" aria-label="Shop Bridgecare products">
        <div className="container">
          <Link href="/search" className="mobile-store-search"><span>Search Bridgecare products</span><ArrowRight size={18}/></Link>
          <div className="mobile-category-chips" aria-label="Product categories">
            <Link href="/products">All products</Link>
            <Link href="/products/asfenositol">Women’s wellness</Link>
            <Link href="/products/aspivit">Vitamins</Link>
            <Link href="/products/globivida">Nutritional support</Link>
            <Link href="/products/herbal-bitter-tea">Herbal wellness</Link>
          </div>
        </div>
      </section>


      <section className="commerce-promo-band">
        <div className="container commerce-promo-grid">
          <div><Truck size={24}/><span><strong>Buy 4+ packs</strong><small>Enjoy FREE nationwide delivery</small></span></div>
          <div><LockKeyhole size={24}/><span><strong>Choose how to pay</strong><small>Paystack online • Pay on delivery in Lagos</small></span></div>
          <div><MessageCircle size={24}/><span><strong>Need help choosing?</strong><small>Chat with Bridgecare on WhatsApp</small></span></div>
        </div>
      </section>

      <section className="section soft shop-section-v3 storefront-featured">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Popular products</span><h2>Shop Bridgecare best sellers</h2><p>See prices, compare support areas and add products directly to your cart.</p></div>
            <Link className="section-link" href="/products">Shop all <ArrowRight size={18}/></Link>
          </div>
          <ProductGrid />
        </div>
      </section>

      <section className="section health-needs-section">
        <div className="container">
          <div className="center-heading"><span className="eyebrow">Shop by health need</span><h2>Find the right Bridgecare range faster</h2><p>Start with the wellness area that matters to you, then review the product information before ordering.</p></div>
          <div className="health-needs-grid">
            <Link href="/products/asfenositol"><span><HeartPulse size={24}/></span><strong>Women’s Health</strong><small>Daily women’s wellness support</small></Link>
            <Link href="/products/aspivit"><span><Sparkles size={24}/></span><strong>Daily Nutrition</strong><small>Vitamins, minerals &amp; omega-3</small></Link>
            <Link href="/products/globivida"><span><BadgeCheck size={24}/></span><strong>Blood &amp; Vitality</strong><small>Specialised nutritional support</small></Link>
            <Link href="/products/herbal-bitter-tea"><span><HeartPulse size={24}/></span><strong>Herbal Wellness</strong><small>Plant-based everyday wellness</small></Link>
          </div>
        </div>
      </section>

      <section className="section why-v3">
        <div className="container">
          <div className="center-heading"><span className="eyebrow">Why choose Bridgecare</span><h2>Professional service from product selection to delivery</h2><p>Every part of the shopping experience is designed to be clear, secure and supportive.</p></div>
          <div className="why-choice-grid">
            <article><span><ShieldCheck/></span><h3>Responsible information</h3><p>Product pages present approved information clearly and encourage professional advice where appropriate.</p></article>
            <article><span><PackageCheck/></span><h3>Reliable fulfilment</h3><p>Orders are recorded before payment and managed through Bridgecare’s fulfilment workflow.</p></article>
            <article><span><LockKeyhole/></span><h3>Secure payment</h3><p>Customers complete payment through Paystack after confirming contact and delivery information.</p></article>
            <article><span><UsersRound/></span><h3>Responsive support</h3><p>Call or chat with Bridgecare for help before ordering and throughout fulfilment.</p></article>
          </div>
        </div>
      </section>

      <section className="section facility-v3">
        <div className="container facility-intro">
          <div className="facility-copy">
            <span className="eyebrow">A visible, accountable company</span>
            <h2>Real people, real operations, dependable service</h2>
            <p>Bridgecare’s public website is supported by a professional office, customer service team and organised inventory operation.</p>
            <div className="facility-points"><span>Professional customer reception</span><span>Organised stock handling</span><span>Nationwide order support</span></div>
            <Link className="button" href="/about">About Bridgecare <ArrowRight size={17}/></Link>
          </div>
          <div className="facility-feature"><Image src="/images/facilities/reception.jpg" alt="Bridgecare Pharmaceuticals reception area" fill sizes="(max-width: 900px) 100vw, 54vw" /><div className="facility-caption"><strong>Bridgecare reception</strong><span>A professional point of contact for customers and partners.</span></div></div>
        </div>
      </section>

      <section className="section customer-proof-v3">
        <div className="container customer-proof-grid">
          <div><span className="eyebrow">Customer confidence</span><h2>Only genuine customer experiences belong here</h2><p>Bridgecare will publish verified feedback as customers complete purchases. We do not use invented testimonials.</p><a className="button secondary" href="https://wa.link/bridgecarepharmaltd" target="_blank" rel="noreferrer">Share your experience</a></div>
          <div className="testimonial-placeholder"><div className="testimonial-stars">★★★★★</div><blockquote>Verified customer reviews will appear here after moderation.</blockquote><span><CheckCircle2 size={18}/> Authentic feedback only</span></div>
        </div>
      </section>

      <section className="section health-centre-home">
        <div className="container">
          <div className="section-head"><div><span className="eyebrow">Bridgecare Health Centre</span><h2>Responsible health education for everyday decisions</h2><p>Read clear guidance while remembering that educational content does not replace professional medical advice.</p></div><Link className="section-link" href="/health-centre">Visit Health Centre <ArrowRight size={18}/></Link></div>
          <div className="health-topic-grid">
            {latestHealthArticles.map((article, index) => (
              <Link href={`/health-centre/${article.slug}`} className="health-topic-card" key={article.slug}>
                <span className="health-topic-icon">{index === 0 ? <BookOpenCheck size={28}/> : index === 1 ? <HeartPulse size={28}/> : <Stethoscope size={28}/>}</span>
                <span className="eyebrow">{article.category}</span>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <strong>Read article <ArrowRight size={17}/></strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section faq-home-v3">
        <div className="container faq-home-grid"><div><span className="eyebrow">Frequently asked questions</span><h2>Everything you need before ordering</h2><p>Still need help? Chat with Bridgecare on WhatsApp.</p><a className="button" href="https://wa.link/bridgecarepharmaltd" target="_blank" rel="noreferrer"><MessageCircle size={18}/> Ask Bridgecare</a></div><div className="faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></div>
      </section>

      <CTA />
    </>
  );
}
