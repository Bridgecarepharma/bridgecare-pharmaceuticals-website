import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Terms governing use of the Bridgecare Pharmaceuticals website and its educational product information.',
  alternates: { canonical: '/terms/' },
};

export default function TermsPage() {
  return <main className="legalPage"><div className="container legalWrap"><span className="kicker">Website information</span><h1>Terms and Conditions</h1><p className="legalUpdated">Last updated: 25 July 2026</p>
    <section><h2>Website use</h2><p>This website provides company, product, order and general wellness information. You agree to use it lawfully and not interfere with its operation or attempt to misuse its content.</p></section>
    <section><h2>Medical information</h2><p>Website content is general education only. It is not a diagnosis, prescription or substitute for care from a qualified doctor, pharmacist or other healthcare professional. In an emergency, seek immediate professional medical assistance.</p></section>
    <section><h2>Product information and availability</h2><p>Product descriptions, prices and availability may change. Always read the current product pack and follow professional guidance. Confirmation from Paystack or Bridgecare is required before an order is considered accepted.</p></section>
    <section><h2>External services</h2><p>Checkout, maps, live chat and messaging links are provided through third parties. Their services are governed by their own terms, privacy policies and availability.</p></section>
    <section><h2>Intellectual property</h2><p>Bridgecare names, logos, official product artwork, page design and original website content may not be copied or commercially reused without permission.</p></section>
    <section><h2>Contact</h2><p>Questions may be sent to <a href="mailto:smith@bridgecarepharma.com">smith@bridgecarepharma.com</a> or raised by telephone on <a href="tel:+2348077733373">08077733373</a>.</p></section>
    <aside className="legalNotice">These terms are a practical website draft and should be reviewed by a qualified Nigerian legal professional before final adoption.</aside>
    <Link className="textLink" href="/">Return to homepage</Link>
  </div></main>;
}
