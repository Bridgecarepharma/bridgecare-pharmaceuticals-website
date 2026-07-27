import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, HeartPulse, ShieldCheck, Truck, Headphones, Building2, FlaskConical, MapPin, LockKeyhole, BookOpen, Stethoscope, ChevronRight, Phone, Mail, Brain, Zap, Leaf, Circle, Baby, Scale, Activity, Droplets, Sprout, CircleDot, Users } from 'lucide-react';
import { CartButton } from './components/Cart';
import Experience from './components/Experience';
import ProductExplorer from './components/ProductExplorer';

import { products } from '../lib/products';
import StructuredData from './components/StructuredData';

const heroPackImages: Record<string, string> = {
  aspivit: '/images/hero-packs/aspivit.webp',
  asfenositol: '/images/hero-packs/asfenositol.webp',
  'herbal-tea': '/images/hero-packs/herbal-tea.webp',
  globivida: '/images/hero-packs/globivida.webp',
};

export const metadata: Metadata = {
  title: 'Pharmaceutical and Wellness Products in Nigeria',
  description: 'Discover Bridgecare products, educational wellness resources, secure Paystack checkout and responsive support across Nigeria.',
  alternates: { canonical: '/' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How do I place an order?', acceptedAnswer: { '@type': 'Answer', text: 'Choose a product, add it to your cart and continue to secure Paystack checkout. A combined checkout is available for multiple products.' } },
    { '@type': 'Question', name: 'Can I speak with someone before buying?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Contact Bridgecare by telephone, email, WhatsApp or live chat for product and order enquiries.' } },
    { '@type': 'Question', name: 'Do you work with distributors?', acceptedAnswer: { '@type': 'Answer', text: 'Bridgecare welcomes enquiries from pharmacies, hospitals, wholesalers and qualified medical distributors across Nigeria.' } },
    { '@type': 'Question', name: 'Is the Health Academy medical advice?', acceptedAnswer: { '@type': 'Answer', text: 'No. The Health Academy provides general educational information and does not replace professional medical care.' } },
  ],
};

export default function Home(){return <><StructuredData data={faqSchema}/>
<header className="header"><div className="container nav"><Link href="#top" className="brand"><Image src="/images/logo.png" alt="Bridgecare Pharmaceuticals" width={230} height={116} priority/></Link><nav><a href="#products">Products</a><Link href="/health-finder">Health finder</Link><a href="#academy">Health Academy</a><a href="#about">About</a><a href="#contact">Contact</a></nav><div className="navTools"><CartButton/><a className="navCta" href="https://wa.link/bridgecarepharmaltd">Contact us</a></div></div></header>
<main id="top">
<section className="hero"><div className="orb one"/><div className="orb two"/><div className="particles"><i/><i/><i/><i/><i/></div><div className="container heroGrid"><div className="heroCopy"><div className="eyebrow"><BadgeCheck size={17}/> Trusted healthcare solutions</div><h1>Committed to better health for every Nigerian family.</h1><p>Helping Nigerian families live healthier with trusted pharmaceutical and wellness products, dependable service and nationwide reach.</p><div className="heroActions"><a className="primary" href="#products">Explore products <ArrowRight size={18}/></a><a className="secondary" href="#distributor">Become a distributor</a></div><div className="trustRow"><span><ShieldCheck/>Quality focused</span><span><Truck/>Nationwide supply</span><span><Headphones/>Responsive support</span></div></div>
<div className="heroVisual"><div className="halo"/><div className="doctorCard familyCard"><Image src="/images/family-health-hero.webp" alt="Happy Nigerian family representing health, wellness and trust" width={660} height={410} priority loading="eager" fetchPriority="high" sizes="(max-width: 900px) 92vw, 44vw"/><div className="familyGlow"/></div><div className="productStage">{products.map((p,i)=><div className={`heroPack pack${i+1}`} key={p.slug}><Image src={heroPackImages[p.slug] ?? p.image} alt={p.name} width={620} height={460} priority loading="eager" fetchPriority="high" sizes="(max-width: 600px) 150px, (max-width: 900px) 190px, 225px"/></div>)}<div className="podium"><span>Bridgecare</span></div></div></div></div></section>
<section className="metrics"><div className="container metricGrid"><div><strong>4</strong><span>Distinct product lines</span></div><div><strong>Nationwide</strong><span>Distribution focus</span></div><div><strong>Secure</strong><span>Paystack checkout</span></div><div><strong>Responsive</strong><span>Customer support</span></div></div></section>
<section className="section intro"><div className="container centered"><span className="kicker">Our portfolio</span><h2>Products presented with clarity, confidence and care</h2><p>Explore a growing portfolio across daily nutrition, women’s wellness, herbal wellness and specialised support.</p></div></section>
<section id="products" className="products"><div className="container"><ProductExplorer/><div className="checkout"><p>Buying more than one product?</p><a href="https://paystack.shop/pay/btzq7yqk7p">Use combined checkout <ArrowRight size={17}/></a></div></div></section>
<section id="finder" className="finder"><div className="container"><div className="sectionHead centered"><span className="kicker">Interactive health finder</span><h2>What would you like to support today?</h2><p>Choose a wellness pathway to discover relevant educational guidance and products.</p></div><Experience/></div></section>
<section className="why"><div className="container"><div className="sectionHead"><span className="kicker">Why Bridgecare</span><h2>Healthcare partnerships built on trust</h2></div><div className="featureGrid">{[[ShieldCheck,'Quality commitment','Responsible sourcing, clear product presentation and a strong focus on customer safety.'],[FlaskConical,'Thoughtful formulations','A focused portfolio designed around distinct wellness and nutritional needs.'],[Truck,'Nationwide reach','Reliable supply designed to serve customers and partners across Nigeria.'],[Headphones,'Responsive service','Accessible support through phone, email, WhatsApp and live chat.']].map(([Icon,title,text]:any)=><div className="feature" key={title}><Icon/><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>
<section id="academy" className="academy"><div className="container"><div className="sectionHead academyHead"><div><span className="kicker">Health Academy</span><h2>Clear wellness education for everyday decisions</h2><p>Explore practical, easy-to-understand guidance created to support informed conversations with qualified healthcare professionals.</p></div><a className="academyAll" href="#finder">Use the health finder <ArrowRight size={17}/></a></div><div className="academyGrid">{[
 [HeartPulse,'Heart & daily wellness','Simple habits and nutritional considerations that can support heart health and everyday wellbeing.','Heart health'],
 [Circle,'Women’s wellness','Educational guidance on cycle awareness, hormonal wellness and nutritional support.','Women’s wellness'],
 [Droplets,'Blood sugar support','Learn about balanced routines, monitoring and the role of professional medical guidance.','Blood sugar'],
 [Stethoscope,'Specialised nutritional care','Understand supportive nutrition and why personalised medical care remains essential.','Specialised care']
].map(([Icon,title,text,tag]:any)=><article className="academyCard" key={title}><div className="academyIcon"><Icon/></div><span>{tag}</span><h3>{title}</h3><p>{text}</p><a href="#finder">Explore topic <ChevronRight size={17}/></a></article>)}</div><div className="academyNotice"><BookOpen/><p><strong>Educational information only.</strong> Bridgecare’s online wellness content does not replace diagnosis, treatment or advice from a doctor, pharmacist or other qualified healthcare professional.</p></div></div></section>
<section id="about" className="about"><div className="container aboutGrid"><div className="aboutVisual"><div className="cross">+</div><div className="stat"><strong>Bridgecare</strong><span>Quality. Integrity. Reliability.</span></div></div><div><span className="kicker">About Bridgecare</span><h2>Bridging the gap in accessing quality healthcare products.</h2><p>Bridgecare Pharmaceuticals Limited is committed to importing, marketing and distributing high-quality, affordable pharmaceutical and wellness products across Nigeria.</p><p>Our vision is to become one of Africa’s most trusted pharmaceutical companies through quality, integrity, innovation, reliability and customer focus.</p><a className="textLink" href="mailto:smith@bridgecarepharma.com">Speak with our team <ArrowRight size={17}/></a></div></div></section>
<section id="distributor" className="distributor"><div className="container distributorBox"><div><span className="kicker light">Partnership opportunities</span><h2>Grow with Bridgecare</h2><p>We welcome pharmacies, hospitals, wholesalers and qualified medical distributors seeking dependable products and responsive support.</p><div className="partnerPoints"><span><Building2/>Professional enquiries</span><span><MapPin/>Nationwide opportunity</span><span><LockKeyhole/>Secure communication</span></div></div><a href="https://wa.link/bridgecarepharmaltd">Become a distributor <ArrowRight size={18}/></a></div></section>
<section id="contact" className="contactSection"><div className="container contactGrid"><div className="contactPanel"><span className="kicker">Visit or contact us</span><h2>We are here to help</h2><p>Speak with our team about products, orders, distribution opportunities or general enquiries.</p><div className="contactMethods"><a href="tel:+2348077733373"><Phone/><span><small>Call us</small><strong>08077733373</strong></span></a><a href="mailto:smith@bridgecarepharma.com"><Mail/><span><small>Email us</small><strong>smith@bridgecarepharma.com</strong></span></a><a href="https://wa.link/bridgecarepharmaltd"><Headphones/><span><small>WhatsApp</small><strong>Chat with support</strong></span></a></div><address><MapPin/>LASCOFED Building, 13 Isaacstan Close, Off Wemco Road, Ogba, Lagos.</address></div><div className="mapFrame"><iframe title="Bridgecare Pharmaceuticals office location" src="https://www.google.com/maps?q=LASCOFED%20Building%2013%20Isaacstan%20Close%20Off%20Wemco%20Road%20Ogba%20Lagos&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></div></div></section>
<section className="faq"><div className="container faqGrid"><div><span className="kicker">Frequently asked questions</span><h2>Helpful answers before you order</h2><p>For product-specific medical advice, please speak with a qualified healthcare professional.</p></div><div className="faqList">{[
 ['How do I place an order?','Choose a product, add it to your cart and continue to the secure Paystack checkout. You can also use the combined checkout when purchasing multiple products.'],
 ['Can I speak with someone before buying?','Yes. Contact the Bridgecare team by phone, email, WhatsApp or live chat for product and order enquiries.'],
 ['Do you work with distributors?','Yes. Bridgecare welcomes enquiries from pharmacies, hospitals, wholesalers and qualified medical distributors across Nigeria.'],
 ['Is the Health Academy medical advice?','No. The Health Academy provides general educational information and is not a diagnosis or substitute for professional medical care.']
].map(([q,a])=><details key={q}><summary>{q}<ChevronRight/></summary><p>{a}</p></details>)}</div></div></section>
</main>
<footer><div className="container footerGrid"><div><Image src="/images/logo.png" alt="Bridgecare Pharmaceuticals" width={210} height={105}/><p>Quality pharmaceutical and wellness products for healthier lives.</p></div><div><h4>Contact</h4><p>08077733373</p><p>smith@bridgecarepharma.com</p><p>LASCOFED Building, 13 Isaacstan Close, Off Wemco Road, Ogba, Lagos.</p></div><div><h4>Quick links</h4><a href="#products">Products</a><Link href="/health-finder">Health finder</Link><a href="#academy">Health Academy</a><Link href="/resources/">Resources</Link><a href="#about">About</a><a href="#contact">Contact</a><Link href="/privacy/">Privacy</Link><Link href="/terms/">Terms</Link></div></div><div className="container copyright">© 2026 Bridgecare Pharmaceuticals Limited. All rights reserved.</div></footer>
</>}
