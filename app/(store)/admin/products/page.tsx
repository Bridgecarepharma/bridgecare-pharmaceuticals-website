import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import { ensureInventoryProducts } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";
import { STORE_PRODUCTS, formatNaira } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin Products & Stock",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ updated?: string; error?: string }>;

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  await ensureInventoryProducts();

  const params = await searchParams;
  const inventory = await prisma.inventory.findMany({
    orderBy: { productName: "asc" },
    include: { movements: { orderBy: { createdAt: "desc" }, take: 4 } },
  });

  const totalUnits = inventory.reduce((sum, item) => sum + item.stock, 0);
  const lowStock = inventory.filter((item) => item.isActive && item.stock <= item.reorderLevel).length;
  const unavailable = inventory.filter((item) => !item.isActive || item.stock === 0).length;

  return (
    <section className="section admin-shell">
      <div className="container">
        <AdminNav />
        <div className="admin-heading admin-products-heading">
          <div>
            <span className="eyebrow">Bridgecare operations</span>
            <h1>Products & stock</h1>
            <p>Update available quantities and reorder levels. Checkout uses these figures immediately.</p>
          </div>
          <Link className="button secondary" href="/products" target="_blank">View storefront</Link>
        </div>

        {params.updated === "1" && <div className="admin-success">Stock was updated successfully.</div>}
        {params.error && <div className="admin-alert">The stock update could not be saved. Please check the quantity and try again.</div>}

        <div className="admin-kpis admin-kpis-four">
          <article><span>Products</span><strong>{inventory.length}</strong></article>
          <article><span>Total units</span><strong>{totalUnits}</strong></article>
          <article><span>Low stock</span><strong>{lowStock}</strong></article>
          <article><span>Unavailable</span><strong>{unavailable}</strong></article>
        </div>

        <div className="product-stock-grid">
          {inventory.map((item) => {
            const product = STORE_PRODUCTS[item.productSlug];
            const isLow = item.stock <= item.reorderLevel;
            const isOut = item.stock === 0 || !item.isActive;
            return (
              <article className="product-stock-card" key={item.id}>
                <div className="product-stock-summary">
                  <div>
                    <span className="eyebrow">{item.sku}</span>
                    <h2>{item.productName}</h2>
                    <p>{product ? formatNaira(product.priceKobo) : "Product price unavailable"}</p>
                  </div>
                  <div className="product-stock-count">
                    <strong>{item.stock}</strong>
                    <span>units available</span>
                    <span className={`stock-badge ${isOut ? "out" : isLow ? "low" : ""}`}>
                      {isOut ? "Out of stock" : isLow ? "Low stock" : "In stock"}
                    </span>
                  </div>
                </div>

                <form className="product-stock-form" action="/api/admin/inventory/adjust" method="post">
                  <input type="hidden" name="productSlug" value={item.productSlug} />
                  <input type="hidden" name="returnTo" value="/admin/products" />
                  <label>
                    Stock action
                    <select name="action" defaultValue="set">
                      <option value="set">Set exact stock</option>
                      <option value="add">Add stock</option>
                      <option value="remove">Remove stock</option>
                    </select>
                  </label>
                  <label>
                    Quantity
                    <input name="quantity" type="number" min="0" defaultValue={item.stock} required />
                  </label>
                  <label>
                    Low-stock alert
                    <input name="reorderLevel" type="number" min="0" defaultValue={item.reorderLevel} required />
                  </label>
                  <label className="wide">
                    Note
                    <input name="note" placeholder="Example: New stock received" maxLength={300} />
                  </label>
                  <button className="button" type="submit">Save stock</button>
                </form>

                <details className="stock-history">
                  <summary>Recent stock history</summary>
                  {item.movements.length ? (
                    <div className="movement-list compact">
                      {item.movements.map((movement) => (
                        <div key={movement.id}>
                          <span>{movement.type.replaceAll("_", " ")}</span>
                          <strong>{movement.quantity > 0 ? "+" : ""}{movement.quantity}</strong>
                          <small>{movement.createdAt.toLocaleString("en-NG")}</small>
                        </div>
                      ))}
                    </div>
                  ) : <p>No stock changes recorded yet.</p>}
                </details>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
