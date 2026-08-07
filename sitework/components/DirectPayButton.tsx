import { ExternalLink } from "lucide-react";

export function DirectPayButton({ href, label = "Buy instantly" }: { href: string; label?: string }) {
  return (
    <a className="button direct-pay-button" href={href} target="_blank" rel="noopener noreferrer">
      {label} <ExternalLink size={17} />
    </a>
  );
}
