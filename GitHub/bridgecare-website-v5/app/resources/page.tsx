import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, FileText, HeartPulse, MessagesSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Browse Bridgecare product information, wellness education and support resources.',
  alternates: { canonical: '/resources/' },
};

const resources = [
  { icon: FileText, title: 'Product information', text: 'Review benefits, directions, safety information and frequently asked questions for every listed Bridgecare product.', href: '/#products', action: 'Browse products' },
  { icon: HeartPulse, title: 'Smart Health Finder', text: 'Explore wellness topics and relevant products through a guided educational experience.', href: '/health-finder/', action: 'Start health finder' },
  { icon: BookOpen, title: 'Health Academy', text: 'Read clear introductory guidance across daily wellness, women’s wellness, blood sugar support and specialised nutritional care.', href: '/#academy', action: 'Explore topics' },
  { icon: MessagesSquare, title: 'Speak with Bridgecare', text: 'Ask about products, orders or distribution through telephone, email, WhatsApp or live chat.', href: '/contact/', action: 'Contact the team' },
];

export default function ResourcesPage() {
  return <main className="resourcePage"><section className="banner"><div className="container"><span className="kicker">Bridgecare resources</span><h1>Reliable information in one place.</h1><p>Use our product pages, educational tools and support channels to make better-informed next steps.</p></div></section><section className="section"><div className="container resourceGrid">{resources.map(({ icon: Icon, title, text, href, action }) => <article key={title}><Icon/><h2>{title}</h2><p>{text}</p><Link href={href}>{action} <ArrowRight size={17}/></Link></article>)}</div><div className="container resourceNotice"><strong>Downloadable brochures coming later.</strong><p>This page is ready for official Bridgecare product brochures, company profiles and professional resources when approved files are available.</p></div></section></main>;
}
