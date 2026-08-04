import { ExternalLink } from "lucide-react";

const PAYMENT_LINKS: Record<string, string> = {
  aspivit: "https://paystack.shop/pay/obsk4o4n5y",
  asfenositol: "https://paystack.shop/pay/qz4b43usk0",
  globivida: "https://paystack.shop/pay/wz9fl6zdw3",
  "herbal-bitter-tea": "https://paystack.shop/pay/fvx50o-um4",
};

export function AddToCartButton({ slug, name }: { slug: string; name: string; priceKobo: number }) {
  const href = PAYMENT_LINKS[slug] || "https://paystack.shop/pay/btzq7yqk7p";
  return (
    <a className="button" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Buy ${name} securely on Paystack`}>
      Buy now <ExternalLink size={18} />
    </a>
  );
}
