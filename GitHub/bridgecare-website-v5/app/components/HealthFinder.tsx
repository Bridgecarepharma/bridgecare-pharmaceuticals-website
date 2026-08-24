'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Brain, Check, Droplets, HeartPulse, MessageCircle, RotateCcw, ShieldCheck, Sparkles, Stethoscope, UserRound } from 'lucide-react';
import { products } from '../../lib/products';
import { healthTopics, type HealthTopic } from '../../lib/healthTopics';
import { AddToCartButton } from './Cart';

const iconMap = { heart: HeartPulse, sparkles: Sparkles, droplets: Droplets, stethoscope: Stethoscope, brain: Brain };
const audiences = ['Myself', 'My spouse', 'My child', 'A family member', 'Someone else'];
const intentions = ['Learn more', 'Browse a relevant product', 'Contact Bridgecare'];

export default function HealthFinder({ compact = false }: { compact?: boolean }) {
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState<HealthTopic | null>(null);
  const [audience, setAudience] = useState('');
  const [intention, setIntention] = useState('');

  const product = useMemo(() => products.find((item) => item.slug === topic?.productSlug), [topic]);
  const progress = step === 0 ? 0 : Math.min(step, 3) * 33.333;

  const restart = () => { setStep(0); setTopic(null); setAudience(''); setIntention(''); };
  const chooseTopic = (item: HealthTopic) => { setTopic(item); setStep(2); };

  if (step === 0) return <div className={`healthWizard welcome ${compact ? 'compact' : ''}`}>
    <div className="wizardWelcomeIcon"><HeartPulse/></div>
    <span className="kicker">Bridgecare Health Finder</span>
    <h3>Discover a wellness pathway in a few simple steps</h3>
    <p>Choose what you would like to learn about and receive general educational guidance with a relevant Bridgecare product where available.</p>
    <button className="primary wizardStart" type="button" onClick={() => setStep(1)}>Start Health Finder <ArrowRight size={18}/></button>
    <div className="wizardDisclaimer"><ShieldCheck size={18}/><span>Educational information only. This tool does not diagnose conditions or replace professional medical advice.</span></div>
  </div>;

  return <div className={`healthWizard ${compact ? 'compact' : ''}`}>
    <div className="wizardProgress" aria-label={`Step ${Math.min(step, 3)} of 3`}><div><span style={{ width: `${progress}%` }}/></div><small>Step {Math.min(step, 3)} of 3</small></div>

    {step === 1 && <section className="wizardStep">
      <span className="kicker">Your wellness interest</span><h3>What would you like to support today?</h3><p>Select the pathway that is most relevant to what you want to learn about.</p>
      <div className="topicGrid">{healthTopics.map((item) => { const Icon = iconMap[item.icon]; return <button type="button" key={item.id} onClick={() => chooseTopic(item)}><Icon/><span>{item.label}</span><ArrowRight size={17}/></button>; })}</div>
    </section>}

    {step === 2 && <section className="wizardStep">
      <button className="wizardBack" type="button" onClick={() => setStep(1)}><ArrowLeft size={16}/> Back</button>
      <span className="kicker">A little context</span><h3>Who are you exploring this for?</h3><p>This choice simply personalises the wording. We do not collect or store health information.</p>
      <div className="choiceGrid">{audiences.map((item) => <button type="button" key={item} className={audience === item ? 'selected' : ''} onClick={() => { setAudience(item); setStep(3); }}><UserRound/><span>{item}</span>{audience === item && <Check/>}</button>)}</div>
    </section>}

    {step === 3 && <section className="wizardStep">
      <button className="wizardBack" type="button" onClick={() => setStep(2)}><ArrowLeft size={16}/> Back</button>
      <span className="kicker">Your next step</span><h3>What would you like to do?</h3><p>Choose what would be most useful for {audience.toLowerCase()}.</p>
      <div className="choiceGrid intention">{intentions.map((item) => <button type="button" key={item} className={intention === item ? 'selected' : ''} onClick={() => { setIntention(item); setStep(4); }}><span>{item}</span><ArrowRight size={17}/></button>)}</div>
    </section>}

    {step === 4 && topic && <section className="wizardResult">
      <div className="resultHeader"><div><span className="kicker">Your educational pathway</span><h3>{topic.title}</h3><p>{topic.description}</p></div><button type="button" onClick={restart}><RotateCcw size={16}/> Start again</button></div>
      <div className="resultLayout">
        <article className="guidanceCard"><h4>General wellness guidance</h4><ul>{topic.tips.map((tip) => <li key={tip}><Check size={17}/>{tip}</li>)}</ul><div className="articleTeaser"><span>Health Academy preview</span><strong>{topic.articleTitle}</strong><p>Educational article content can be expanded in the next Health Academy milestone.</p></div></article>
        {product ? <article className="recommendationCard" style={{ '--accent': product.accent } as React.CSSProperties}>
          <div className="recommendedBadge">Relevant product to explore</div><div className="recommendationImage"><Image src={product.image} alt={product.name} width={520} height={400}/></div><span>{product.categoryLabel}</span><h4>{product.name}</h4><p>{product.summary}</p><strong className="recommendationPrice">{product.price}</strong>
          <div className="recommendationActions"><Link href={`/products/${product.slug}`}>Learn more <ArrowRight size={16}/></Link><AddToCartButton product={{ slug: product.slug, name: product.name, price: product.priceValue, priceLabel: product.price, image: product.image }}/><a href={product.paystack} target="_blank" rel="noreferrer">Buy now</a></div>
        </article> : <article className="recommendationCard future"><Brain/><span>Educational pathway</span><h4>Product recommendation coming later</h4><p>Bridgecare does not currently display a dedicated nerve-health product in this website catalogue. Speak with the team for general product information.</p><a className="contactFinder" href="https://wa.link/bridgecarepharmaltd" target="_blank" rel="noreferrer"><MessageCircle size={17}/> Contact Bridgecare</a></article>}
      </div>
      <aside className="finderSafety"><ShieldCheck/><p><strong>Important:</strong> This result is based only on the wellness topic you selected. It is not a diagnosis, prescription or personalised treatment recommendation. Consult a qualified healthcare professional for medical concerns and always follow product-pack directions.</p></aside>
    </section>}
  </div>;
}
