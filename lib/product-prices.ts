import { prisma } from "@/lib/prisma";
import { STORE_PRODUCTS } from "@/lib/store";

export async function getProductPriceMap() {
  try {
    const rows = await prisma.inventory.findMany({ select: { productSlug: true, priceKobo: true } });
    return Object.fromEntries(Object.entries(STORE_PRODUCTS).map(([slug, product]) => {
      const row = rows.find((item) => item.productSlug === slug);
      return [slug, row?.priceKobo && row.priceKobo > 0 ? row.priceKobo : product.priceKobo];
    }));
  } catch {
    return Object.fromEntries(Object.entries(STORE_PRODUCTS).map(([slug, product]) => [slug, product.priceKobo]));
  }
}

export async function getProductPrice(slug: string) {
  const prices = await getProductPriceMap();
  return prices[slug] ?? STORE_PRODUCTS[slug]?.priceKobo ?? 0;
}
