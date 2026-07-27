import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import HealthFinder from '../components/HealthFinder';
import { CartButton } from '../components/Cart';

export const metadata: Metadata = {
  title: 'Smart Health Finder | Bridgecare Pharmaceuticals',
  description: 'Explore educational wellness pathways and relevant Bridgecare products through a simple guided experience.',
  alternates: { canonical: '/health-finder/' },
};

export default function HealthFinderPage() {
  return <main className="healthFinderPage"><div className="container"><div className="productTopbar"><Link className="back" href="/"><ArrowLeft size={18}/> Back home</Link><CartButton/></div><div className="finderPageHead"><span className="kicker">Guided product discovery</span><h1>Bridgecare Smart Health Finder</h1><p>Answer three simple questions to explore general wellness information and relevant products.</p></div><HealthFinder/></div></main>;
}
