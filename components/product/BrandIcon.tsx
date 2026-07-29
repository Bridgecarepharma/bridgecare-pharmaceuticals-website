export function BrandIcon({ symbol, label }: { symbol: string; label?: string }) {
  return <span className="brand-icon" role="img" aria-label={label || ""}>
    <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 3 54 15v25L32 61 10 40V15Z"/><circle cx="32" cy="30" r="18"/><text x="32" y="36" textAnchor="middle">{symbol}</text></svg>
  </span>;
}
