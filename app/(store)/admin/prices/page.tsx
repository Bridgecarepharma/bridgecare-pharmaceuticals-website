import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import { ensureInventoryProducts } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin Product Prices", robots: { index: false, follow: false } };
type SearchParams = Promise<{ updated?: string; error?: string }>;

export default async function AdminPricesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  await ensureInventoryProducts();
  const params = await searchParams;
  const products = await prisma.inventory.findMany({ orderBy: { productName: "asc" } });

  return (
    <section className="section admin-shell">
      <div className="container">
        <AdminNav />
        <div className="admin-heading admin-products-heading">
          <div>
            <span className="eyebrow">Bridgecare operations</span>
            <h1>Product prices</h1>
            <p>Change selling prices in naira. Checkout uses the new price immediately.</p>
          </div>
          <Link className="button secondary" href="/products" target="_blank">View storefront</Link>
        </div>

        {params.updated === "1" && <div className="admin-success">Price updated successfully.</div>}
        {params.error && <div className="admin-alert">The price could not be saved. Enter a valid amount greater than zero.</div>}

        <div className="product-stock-grid">
          {products.map((product) => (
            <article className="product-stock-card" key={product.id}>
              <div className="product-stock-summary">
                <div>
                  <span className="eyebrow">{product.sku}</span>
                  <h2>{product.productName}</h2>
                  <p>Current selling price</p>
                </div>
                <div className="product-stock-count">
                  <strong>{formatNaira(product.priceKobo)}</strong>
                  <span>per pack</span>
                </div>
              </div>
              <form className="product-stock-form" action="/api/admin/products/price" method="post">
                <input type="hidden" name="productSlug" value={product.productSlug} />
                <label className="wide">
                  New price (₦)
                  <input name="priceNaira" type="number" min="1" step="1" defaultValue={Math.round(product.priceKobo / 100)} required />
                </label>
                <button className="button" type="submit">Save price</button>
              </form>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
