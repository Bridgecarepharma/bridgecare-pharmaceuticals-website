import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Bridgecare Pharmaceuticals handles information submitted through its website and third-party services.',
  alternates: { canonical: '/privacy/' },
};

export default function PrivacyPage() {
  return <main className="legalPage"><div className="container legalWrap"><span className="kicker">Website information</span><h1>Privacy Policy</h1><p className="legalUpdated">Last updated: 25 July 2026</p>
    <section><h2>Information you provide</h2><p>Bridgecare may receive information you choose to provide when you contact us by telephone, email, WhatsApp or live chat. This may include your name, contact details and the contents of your enquiry.</p></section>
    <section><h2>Payments and third-party services</h2><p>Online payments are completed through Paystack. Bridgecare does not collect or store your full payment-card details through this website. WhatsApp, Tawk.to, Google Maps and Paystack process information under their own privacy terms.</p></section>
    <section><h2>How information may be used</h2><p>Information may be used to respond to enquiries, assist with orders, support distributor discussions, improve customer service and meet applicable legal obligations.</p></section>
    <section><h2>Cookies and analytics</h2><p>The website may use essential storage for shopping-cart functionality and cookies or similar technologies supplied by embedded support and mapping services. Analytics will only be added when configured by Bridgecare.</p></section>
    <section><h2>Your choices</h2><p>You may ask Bridgecare to correct or delete information you submitted, subject to legal and operational requirements. Contact <a href="mailto:smith@bridgecarepharma.com">smith@bridgecarepharma.com</a>.</p></section>
    <aside className="legalNotice">This policy is a practical website notice and should be reviewed by a qualified Nigerian privacy or legal professional before being treated as formal legal advice.</aside>
    <Link className="textLink" href="/">Return to homepage</Link>
  </div></main>;
}
