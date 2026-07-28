import Link from "next/link";
export function Footer(){return <footer className="footer"><div className="container footer-grid">
<div><div className="brand light"><span className="brand-mark">B</span><span><strong>Bridgecare</strong><small>Pharmaceuticals Limited</small></span></div><p>Improving lives through quality healthcare products, responsible information and trusted partnerships.</p></div>
<div><h3>Company</h3><Link href="/about">About</Link><Link href="/quality-compliance">Quality</Link><Link href="/csr">CSR</Link><Link href="/careers">Careers</Link></div>
<div><h3>Resources</h3><Link href="/health-centre">Health Centre</Link><Link href="/news">News</Link><Link href="/downloads">Downloads</Link><Link href="/faq">FAQ</Link></div>
<div><h3>Legal</h3><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms">Terms of Use</Link><Link href="/cookie-policy">Cookie Policy</Link><Link href="/contact">Contact</Link></div>
</div><div className="container footer-bottom">© {new Date().getFullYear()} Bridgecare Pharmaceuticals Limited. All rights reserved.</div></footer>}
