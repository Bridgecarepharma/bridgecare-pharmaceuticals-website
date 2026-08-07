import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div><span className="eyebrow footer-eyebrow">Healthier communities start with trusted care</span><h2>Stay informed with Bridgecare.</h2></div>
        <form className="newsletter-form" action="/newsletter/success">
          <label className="sr-only" htmlFor="footer-email">Email address</label>
          <input id="footer-email" type="email" name="email" placeholder="Enter your email address" required />
          <button className="button" type="submit">Subscribe</button>
        </form>
      </div>
      <div className="container footer-grid">
        <div className="footer-brand-column">
          <Link href="/" className="footer-logo"><Image src="/images/brand/bridgecare-logo.png" alt="Bridgecare Pharmaceuticals Limited" width={205} height={92} /></Link>
          <p>Quality healthcare products, responsible information and dependable partnerships for families across Nigeria.</p>
          <div className="footer-contact"><span><Phone size={17}/>+234 807 773 3373</span><span><Mail size={17}/>info@bridgecarepharmang.com</span><span><MapPin size={17}/>LASCOFED Building, Ogba, Lagos</span></div>
        </div>
        <div><h3>Company</h3><Link href="/about">About us</Link><Link href="/quality-compliance">Quality & Compliance</Link><Link href="/csr">Corporate responsibility</Link><Link href="/careers">Careers</Link></div>
        <div><h3>Explore</h3><Link href="/products">Products</Link><Link href="/health-centre">Health Centre</Link><Link href="/news">News</Link><Link href="/downloads">Downloads</Link></div>
        <div className="footer-support-column"><h3>Support</h3><Link href="/faq">Frequently asked questions</Link><Link href="/distributors">Become a distributor</Link><Link href="/contact">Contact us</Link><Link href="/privacy-policy">Privacy policy</Link><Link href="/admin/login" className="footer-admin-button">Admin Login</Link></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Bridgecare Pharmaceuticals Limited.</span><span>Advancing Health. Inspiring Life.</span></div>
    </footer>
  );
}
