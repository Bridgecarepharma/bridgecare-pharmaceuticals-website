import { prisma } from "@/lib/prisma";
import { STORE_PRODUCTS } from "@/lib/store";

const SKU_BY_SLUG: Record<string, string> = {
  aspivit: "BC-ASP-001",
  asfenositol: "BC-ASF-001",
  globivida: "BC-GLO-001",
  "herbal-bitter-tea": "BC-HBT-001",
};

export async function ensureInventoryProducts() {
  await Promise.all(
    Object.values(STORE_PRODUCTS).map((product) =>
      prisma.inventory.upsert({
        where: { productSlug: product.slug },
        update: { productName: product.name },
        create: {
          productSlug: product.slug,
          productName: product.name,
          sku: SKU_BY_SLUG[product.slug] ?? `BC-${product.slug.toUpperCase()}`,
          stock: 0,
          reorderLevel: 10,
        },
      }),
    ),
  );
}

export async function assertStockAvailable(items: { slug: string; quantity: number }[]) {
  const inventory = await prisma.inventory.findMany({
    where: { productSlug: { in: items.map((item) => item.slug) }, isActive: true },
  });
  const bySlug = new Map(inventory.map((entry) => [entry.productSlug, entry]));

  for (const item of items) {
    const entry = bySlug.get(item.slug);
    if (!entry || entry.stock < item.quantity) {
      const name = STORE_PRODUCTS[item.slug]?.name ?? item.slug;
      throw new Error(`INSUFFICIENT_STOCK:${name}:${entry?.stock ?? 0}`);
    }
  }
}
