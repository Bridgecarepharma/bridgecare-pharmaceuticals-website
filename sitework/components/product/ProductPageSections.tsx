import type { ReactNode } from "react";

export function SectionTitle({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return <div className="product-section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</div>;
}

export function IngredientCard({ icon, name, strength, children }: { icon: ReactNode; name: string; strength: string; children: ReactNode }) {
  return <details className="ingredient-card"><summary><span className="ingredient-icon">{icon}</span><span><strong>{name}</strong><small>{strength}</small></span><span className="expand-mark">+</span></summary><div className="ingredient-body">{children}</div></details>;
}

export function InfoCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <article className="product-info-card"><span className="product-info-icon">{icon}</span><h3>{title}</h3><p>{children}</p></article>;
}

export function SafetyPanel({ children }: { children: ReactNode }) {
  return <aside className="safety-panel"><div className="safety-symbol">!</div><div><span className="eyebrow">Important safety information</span>{children}</div></aside>;
}
