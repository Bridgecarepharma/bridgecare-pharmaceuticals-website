import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import HealthFinder from './HealthFinder';

export default function Experience(){
  return <><HealthFinder compact/><div className="finderFullLink"><Link href="/health-finder">Open the full Health Finder <ArrowRight size={17}/></Link></div></>;
}
