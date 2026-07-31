import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { ensureInventoryProducts } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Inventory" };
export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  await ensureInventoryProducts();
  const inventory = await prisma.inventory.findMany({ orderBy: { productName: "asc" }, include: { movements: { orderBy: { createdAt: "desc" }, take: 5 } } });
  const totalUnits = inventory.reduce((sum, item) => sum + item.stock, 0);
  const lowStock = inventory.filter((item) => item.stock <= item.reorderLevel).length;
  return <section className="admin-shell"><header className="admin-topbar"><div><span className="eyebrow">Bridgecare operations</span><h1>Inventory</h1></div><form action="/api/admin/logout" method="post"><button className="button secondary" type="submit">Sign out</button></form></header>
    <div className="admin-kpis"><article><span>Products</span><strong>{inventory.length}</strong></article><article><span>Total units</span><strong>{totalUnits}</strong></article><article><span>Low stock</span><strong>{lowStock}</strong></article></div>
    <div className="inventory-grid">{inventory.map((item) => <article className="inventory-card" key={item.id}>
      <div className="inventory-card-head"><div><span className="eyebrow">{item.sku}</span><h2>{item.productName}</h2></div><span className={item.stock <= item.reorderLevel ? "stock-badge low" : "stock-badge"}>{item.stock} units</span></div>
      <p>Reorder warning at {item.reorderLevel} units.</p>
      <form className="inventory-form" action="/api/admin/inventory/adjust" method="post">
        <input type="hidden" name="productSlug" value={item.productSlug}/>
        <label>Action<select name="action" defaultValue="add"><option value="add">Add stock</option><option value="remove">Remove stock</option><option value="set">Set exact stock</option></select></label>
        <label>Quantity<input name="quantity" type="number" min="0" required /></label>
        <label>Reorder level<input name="reorderLevel" type="number" min="0" defaultValue={item.reorderLevel} required /></label>
        <label className="wide">Note<input name="note" placeholder="Restock delivery, correction, damaged stock…" /></label>
        <button className="button" type="submit">Save adjustment</button>
      </form>
      <div className="movement-list"><h3>Recent movements</h3>{item.movements.length ? item.movements.map((movement) => <div key={movement.id}><span>{movement.type.replaceAll("_", " ")}</span><strong>{movement.quantity > 0 ? "+" : ""}{movement.quantity}</strong><small>{movement.createdAt.toLocaleString("en-NG")}</small></div>) : <p>No movements recorded yet.</p>}</div>
    </article>)}</div>
  </section>;
}
